"""Build the game's bitmap fonts (BMFont XML + PNG) from our own glyph grids.

    python3 tools/font/build.py

Writes public/assets/font/mama.png|xml (gold gradient fill, dark outline) and
mama_white.png|xml (white fill, for tinting at runtime). Glyph shapes live in
glyphs.py and are original; the look is modelled on cooking-game UI type:
chunky letters, light-to-gold vertical gradient, 1px dark outline.
"""
from __future__ import annotations
import os, sys
sys.path.insert(0, os.path.dirname(__file__))
from PIL import Image
from glyphs import G

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
OUT = os.path.join(ROOT, "public", "assets", "font")
os.makedirs(OUT, exist_ok=True)

OUTLINE = (92, 70, 62, 255)
OUTLINE_WHITE = (58, 33, 24, 255)
# Vertical gradient by position within the glyph, top -> bottom.
GRADIENT = [(255, 255, 255), (255, 250, 232), (252, 240, 196), (250, 228, 160), (246, 212, 118), (238, 196, 92)]
CAP = 10          # rows 0..9
DESC = 3          # rows 10..12
LINE_H = 18
SPACE_W = 4

def grad(t: float):
    i = min(len(GRADIENT) - 1, int(t * len(GRADIENT)))
    return (*GRADIENT[i], 255)

def render(rows: list[str], white: bool):
    """Rows of '#'/'.' -> RGBA image with 1px 8-connected outline. Returns (image, top_row)."""
    h = CAP + DESC
    w = max((len(r) for r in rows), default=1)
    fill = {(x, y) for y, r in enumerate(rows) for x, c in enumerate(r) if c == "#"}
    ys = [y for _, y in fill]
    top, bot = min(ys), max(ys)
    im = Image.new("RGBA", (w + 2, h + 2), (0, 0, 0, 0))
    px = im.load()
    for x, y in fill:
        for dx in (-1, 0, 1):
            for dy in (-1, 0, 1):
                px[x + 1 + dx, y + 1 + dy] = OUTLINE_WHITE if white else OUTLINE
    for x, y in fill:
        t = (y - top) / max(1, bot - top)
        px[x + 1, y + 1] = (255, 255, 255, 255) if white else grad(t)
    # crop to the glyph's own box but remember where it sits vertically
    bbox = im.getbbox()
    return im.crop(bbox), bbox[1]

def build(name: str, white: bool):
    glyphs = []
    for ch, rows in G.items():
        im, yoff = render(rows, white)
        glyphs.append((ch, im, yoff))
    pad, sheet_w = 1, 256
    x = y = row_h = 0; placed = []
    for ch, im, yoff in glyphs:
        if x + im.width + pad > sheet_w:
            x, y, row_h = 0, y + row_h + pad, 0
        placed.append((ch, im, yoff, x, y)); x += im.width + pad; row_h = max(row_h, im.height)
    sheet_h = y + row_h + pad
    sheet = Image.new("RGBA", (sheet_w, sheet_h), (0, 0, 0, 0))
    chars = []
    for ch, im, yoff, gx, gy in placed:
        sheet.paste(im, (gx, gy))
        chars.append(f'<char id="{ord(ch)}" x="{gx}" y="{gy}" width="{im.width}" height="{im.height}" xoffset="0" yoffset="{yoff}" xadvance="{im.width + 1}" page="0" chnl="15" />')
    chars.append(f'<char id="32" x="0" y="0" width="0" height="0" xoffset="0" yoffset="0" xadvance="{SPACE_W}" page="0" chnl="15" />')
    sheet.save(os.path.join(OUT, f"{name}.png"))
    xml = (
        '<?xml version="1.0"?>\n<font>\n'
        f'<info face="{name}" size="16" bold="1" italic="0" charset="" unicode="1" stretchH="100" smooth="0" aa="1" padding="0,0,0,0" spacing="1,1" outline="1"/>\n'
        f'<common lineHeight="{LINE_H}" base="{CAP + 1}" scaleW="{sheet_w}" scaleH="{sheet_h}" pages="1" packed="0"/>\n'
        f'<pages><page id="0" file="{name}.png"/></pages>\n'
        f'<chars count="{len(chars)}">\n' + "\n".join(chars) + "\n</chars>\n</font>\n"
    )
    with open(os.path.join(OUT, f"{name}.xml"), "w") as f: f.write(xml)
    print(f"{name}: {len(chars)} glyphs, sheet {sheet_w}x{sheet_h}")

if __name__ == "__main__":
    build("mama", white=False)
    build("mama_white", white=True)
