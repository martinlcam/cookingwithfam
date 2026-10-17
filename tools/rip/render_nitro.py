"""Render Nitro graphics (NCLR + NCGR/NCBR + NCER, NSCR) from an extracted DS ROM to PNG.

    python3 -I tools/rip/render_nitro.py tools/raw/cartridge/data tools/raw/cartridge_png

For each NCGR/NCBR it finds a palette (same basename, else the nearest NCLR in
the directory), renders the raw tile sheet, and if an NCER with the same basename
exists, also assembles every cell (sprite) into its own image plus a labelled
contact sheet per directory. NSCR tilemaps are rendered as full backgrounds.
Reference only; output is gitignored.
"""
from __future__ import annotations
import os, struct, sys
from PIL import Image, ImageDraw

def sections(data: bytes):
    """Yield (magic, payload) for each block in a Nitro container."""
    magic = data[:4]
    n = struct.unpack_from("<H", data, 0xE)[0]
    off = struct.unpack_from("<H", data, 0xC)[0]
    out = []
    for _ in range(n):
        m = data[off:off + 4]; size = struct.unpack_from("<I", data, off + 4)[0]
        out.append((m, data[off + 8:off + size])); off += size
    return magic, out

def read_nclr(data: bytes):
    magic, secs = sections(data)
    for m, p in secs:
        if m == b"TTLP":
            depth = struct.unpack_from("<I", p, 0)[0]
            size = struct.unpack_from("<I", p, 8)[0]
            off = struct.unpack_from("<I", p, 12)[0]
            raw = p[off:off + size]
            cols = []
            for i in range(0, len(raw) - 1, 2):
                v = struct.unpack_from("<H", raw, i)[0]
                cols.append(((v & 31) * 255 // 31, ((v >> 5) & 31) * 255 // 31, ((v >> 10) & 31) * 255 // 31))
            return cols, (4 if depth == 3 else 8)
    return [], 8

def read_ncgr(data: bytes):
    magic, secs = sections(data)
    for m, p in secs:
        if m == b"RAHC":
            h, w = struct.unpack_from("<HH", p, 0)
            depth = struct.unpack_from("<I", p, 4)[0]
            mapping = struct.unpack_from("<I", p, 8)[0]
            flags = struct.unpack_from("<I", p, 12)[0]
            size = struct.unpack_from("<I", p, 16)[0]
            off = struct.unpack_from("<I", p, 20)[0]
            raw = p[off:off + size]
            bpp = 4 if depth == 3 else 8
            tiled = not (flags & 0xFF)  # 0 = tiled (NCGR), 1 = linear bitmap (NCBR)
            return dict(w=w, h=h, bpp=bpp, raw=raw, tiled=tiled, mapping=mapping)
    return None

def pixels(g, bpp):
    raw = g["raw"]
    if bpp == 4:
        px = []
        for b in raw: px.append(b & 15); px.append(b >> 4)
        return px
    return list(raw)

def tile(g, px, idx, bpp):
    """8x8 tile `idx` as a list of 64 palette indices."""
    base = idx * 64
    return px[base:base + 64]

def render_tiles(g, pal, bpp, tiles_per_row=32, pal_bank=0):
    px = pixels(g, bpp)
    n = len(px) // 64
    rows = (n + tiles_per_row - 1) // tiles_per_row
    im = Image.new("RGBA", (tiles_per_row * 8, max(1, rows) * 8), (0, 0, 0, 0))
    out = im.load()
    for t in range(n):
        tx, ty = (t % tiles_per_row) * 8, (t // tiles_per_row) * 8
        tp = tile(g, px, t, bpp)
        for i, c in enumerate(tp):
            if c == 0: continue
            ci = c + (pal_bank * 16 if bpp == 4 else 0)
            if ci < len(pal): out[tx + i % 8, ty + i // 8] = (*pal[ci], 255)
    return im

def render_linear(g, pal, bpp, width):
    px = pixels(g, bpp)
    h = max(1, len(px) // width)
    im = Image.new("RGBA", (width, h), (0, 0, 0, 0)); out = im.load()
    for i, c in enumerate(px[:width * h]):
        if c and c < len(pal): out[i % width, i // width] = (*pal[c], 255)
    return im

OBJ_SIZES = {  # (shape, size) -> (w, h)
    (0, 0): (8, 8), (0, 1): (16, 16), (0, 2): (32, 32), (0, 3): (64, 64),
    (1, 0): (16, 8), (1, 1): (32, 8), (1, 2): (32, 16), (1, 3): (64, 32),
    (2, 0): (8, 16), (2, 1): (8, 32), (2, 2): (16, 32), (2, 3): (32, 64),
}

def read_ncer(data: bytes):
    magic, secs = sections(data)
    cells = []
    for m, p in secs:
        if m == b"KBEC":
            n = struct.unpack_from("<H", p, 0)[0]
            bank_type = struct.unpack_from("<H", p, 2)[0]
            cells_off = struct.unpack_from("<I", p, 4)[0]
            mapping = struct.unpack_from("<I", p, 8)[0]
            entry = 16 if bank_type == 1 else 8
            for i in range(n):
                base = cells_off + i * entry
                n_oam = struct.unpack_from("<H", p, base)[0]
                oam_off = struct.unpack_from("<I", p, base + 4)[0]
                oams = []
                oam_base = cells_off + n * entry + oam_off
                for j in range(n_oam):
                    a0, a1, a2 = struct.unpack_from("<HHH", p, oam_base + j * 6)
                    y = a0 & 0xFF; y = y - 256 if y >= 128 else y
                    x = a1 & 0x1FF; x = x - 512 if x >= 256 else x
                    shape = a0 >> 14; size = a1 >> 14
                    flip_h = (a1 >> 12) & 1; flip_v = (a1 >> 13) & 1
                    tile_idx = a2 & 0x3FF; pal_bank = a2 >> 12
                    colors256 = (a0 >> 13) & 1
                    oams.append(dict(x=x, y=y, w=OBJ_SIZES[(shape, size)][0], h=OBJ_SIZES[(shape, size)][1],
                                     flip_h=flip_h, flip_v=flip_v, tile=tile_idx, pal=pal_bank, c256=colors256))
                cells.append(oams)
            return cells, mapping
    return cells, 0

def render_cell(oams, g, pal, bpp, mapping):
    """Assemble one NCER cell. Sprites are stored back to back at `boundary`-byte units
    (from the NCER mapping field); NCBR data is linear within each sprite, NCGR is 8x8 tiled."""
    if not oams: return None
    x0 = min(o["x"] for o in oams); y0 = min(o["y"] for o in oams)
    x1 = max(o["x"] + o["w"] for o in oams); y1 = max(o["y"] + o["h"] for o in oams)
    im = Image.new("RGBA", (x1 - x0, y1 - y0), (0, 0, 0, 0))
    px = pixels(g, bpp)
    boundary = 32 << (mapping & 3)
    ppb = 2 if bpp == 4 else 1  # pixels per byte
    one_d = bool(g["mapping"] & 0x10)
    W2D = 256 if len(px) >= 256 * 128 else 128  # 2D bitmap width guess
    for o in reversed(oams):
        sp = Image.new("RGBA", (o["w"], o["h"]), (0, 0, 0, 0)); spx = sp.load()
        start = o["tile"] * boundary * ppb
        tw = o["w"] // 8
        for yy in range(o["h"]):
            for xx in range(o["w"]):
                if g["tiled"] and one_d:
                    t = (yy // 8) * tw + xx // 8
                    i = start + t * 64 + (yy % 8) * 8 + xx % 8
                elif g["tiled"]:
                    per_row = 32 if bpp == 4 else 16
                    t = o["tile"] + (yy // 8) * per_row + xx // 8
                    i = t * 64 + (yy % 8) * 8 + xx % 8
                elif one_d:
                    i = start + yy * o["w"] + xx
                else:
                    per_row = W2D // 8
                    bx, by = (o["tile"] % per_row) * 8, (o["tile"] // per_row) * 8
                    i = (by + yy) * W2D + bx + xx
                c = px[i] if i < len(px) else 0
                if not c: continue
                ci = c + (o["pal"] * 16 if bpp == 4 else 0)
                if ci < len(pal): spx[xx, yy] = (*pal[ci], 255)
        if o["flip_h"]: sp = sp.transpose(Image.FLIP_LEFT_RIGHT)
        if o["flip_v"]: sp = sp.transpose(Image.FLIP_TOP_BOTTOM)
        im.alpha_composite(sp, (o["x"] - x0, o["y"] - y0))
    return im

def read_nscr(data: bytes):
    magic, secs = sections(data)
    for m, p in secs:
        if m == b"NRCS":
            w, h = struct.unpack_from("<HH", p, 0)
            size = struct.unpack_from("<I", p, 8)[0]
            raw = p[12:12 + size]
            entries = [struct.unpack_from("<H", raw, i)[0] for i in range(0, len(raw) - 1, 2)]
            return w, h, entries
    return None

def render_screen(scr, g, pal, bpp):
    w, h, entries = scr
    im = Image.new("RGBA", (w, h), (0, 0, 0, 0)); out = im.load()
    px = pixels(g, bpp)
    tw = w // 8
    for i, e in enumerate(entries[: tw * (h // 8)]):
        t = e & 0x3FF; fh = (e >> 10) & 1; fv = (e >> 11) & 1; pb = e >> 12
        tp = tile(g, px, t, bpp)
        tx, ty = (i % tw) * 8, (i // tw) * 8
        for k, c in enumerate(tp):
            if c == 0: continue
            ci = c + (pb * 16 if bpp == 4 else 0)
            if ci >= len(pal): continue
            sx, sy = k % 8, k // 8
            if fh: sx = 7 - sx
            if fv: sy = 7 - sy
            out[tx + sx, ty + sy] = (*pal[ci], 255)
    return im

def contact(items, path, scale=2, cols=10):
    if not items: return
    cw = max(min(im.width, 128) for _, im in items) * scale + 8
    ch = max(min(im.height, 128) for _, im in items) * scale + 22
    rows = (len(items) + cols - 1) // cols
    sheet = Image.new("RGBA", (cols * cw, rows * ch), (90, 60, 80, 255)); d = ImageDraw.Draw(sheet)
    for i, (name, im) in enumerate(items):
        x, y = (i % cols) * cw, (i // cols) * ch
        s = min(scale, (cw - 8) / max(1, im.width), (ch - 22) / max(1, im.height))
        big = im.resize((max(1, int(im.width * s)), max(1, int(im.height * s))), Image.NEAREST)
        sheet.alpha_composite(big, (x + 4, y + 4))
        d.text((x + 2, y + ch - 14), name[:22], fill=(255, 255, 255))
    sheet.save(path)

def main(src, dst):
    for dp, _, fs in os.walk(src):
        rel = os.path.relpath(dp, src)
        pals = {f[:-5]: f for f in fs if f.endswith(".NCLR")}
        gfx = {f[:-5]: f for f in fs if f.endswith((".NCGR", ".NCBR"))}
        cers = {f[:-5]: f for f in fs if f.endswith(".NCER")}
        scrs = {f[:-5]: f for f in fs if f.endswith(".NSCR")}
        if not gfx: continue
        outdir = os.path.join(dst, rel); os.makedirs(outdir, exist_ok=True)
        pal_cache = {k: read_nclr(open(os.path.join(dp, v), "rb").read()) for k, v in pals.items()}
        def pal_for(base):
            if base in pal_cache: return pal_cache[base]
            # nearest by common prefix
            best = max(pal_cache, key=lambda k: len(os.path.commonprefix([k, base])), default=None)
            return pal_cache[best] if best else ([], 8)
        cells_out, bg_out = [], []
        last_g = None
        for base, f in sorted(gfx.items()):
            g = read_ncgr(open(os.path.join(dp, f), "rb").read())
            if not g: continue
            last_g = (base, g)
            pal, pbpp = pal_for(base)
            bpp = g["bpp"]
            if base in cers:
                cells, mapping = read_ncer(open(os.path.join(dp, cers[base]), "rb").read())
                for ci, oams in enumerate(cells):
                    try: im = render_cell(oams, g, pal, bpp, mapping)
                    except Exception as e: im = None
                    if im and im.getbbox(): cells_out.append((f"{base}#{ci}", im))
            elif not g["tiled"]:
                bg_out.append((base, render_linear(g, pal, bpp, g["w"] * 8 if g["w"] not in (0, 0xFFFF) else 256)))
            else:
                bg_out.append((base, render_tiles(g, pal, bpp)))
        for base, f in sorted(scrs.items()):
            scr = read_nscr(open(os.path.join(dp, f), "rb").read())
            if not scr: continue
            # graphics: same basename, else nearest prefix among gfx in this dir
            gb = base if base in gfx else max(gfx, key=lambda k: len(os.path.commonprefix([k, base])))
            g = read_ncgr(open(os.path.join(dp, gfx[gb]), "rb").read())
            pal, _ = pal_for(base if base in pal_cache else gb)
            try: bg_out.append((base, render_screen(scr, g, pal, g["bpp"])))
            except Exception as e: print("nscr fail", base, e)
        if cells_out: contact(cells_out, os.path.join(outdir, "_cells.png"), scale=1, cols=16)
        if bg_out:
            for name, im in bg_out: im.save(os.path.join(outdir, name + ".png"))
            contact(bg_out, os.path.join(outdir, "_sheets.png"), scale=1, cols=4)
        print(f"{rel}: {len(cells_out)} cells, {len(bg_out)} sheets")

if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
