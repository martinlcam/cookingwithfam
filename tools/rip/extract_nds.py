"""Unpack a Nintendo DS ROM's file system (FNT/FAT) into a folder. Reference use only.

    python3 -I tools/rip/extract_nds.py "Cooking Mama.zip" tools/raw/cartridge/

Output is gitignored. Nothing from it is ever copied into the game; it is looked
at while drawing our own art.
"""
from __future__ import annotations
import io, os, struct, sys, zipfile

def read_rom(path: str) -> bytes:
    if path.lower().endswith(".zip"):
        with zipfile.ZipFile(path) as z:
            name = next(n for n in z.namelist() if n.lower().endswith(".nds"))
            return z.read(name)
    return open(path, "rb").read()

def extract(rom: bytes, out: str):
    fnt_off, fnt_len, fat_off, fat_len = struct.unpack_from("<IIII", rom, 0x40)
    title = rom[0:12].rstrip(b"\0").decode("ascii", "replace")
    print(f"title={title!r} fnt@{fnt_off:#x} ({fnt_len}) fat@{fat_off:#x} ({fat_len})")
    n_files = fat_len // 8
    fat = [struct.unpack_from("<II", rom, fat_off + i * 8) for i in range(n_files)]

    def walk(dir_id: int, path: str):
        sub_off, first_id, _parent = struct.unpack_from("<IHH", rom, fnt_off + (dir_id & 0xFFF) * 8)
        p = fnt_off + sub_off
        fid = first_id
        while True:
            t = rom[p]; p += 1
            if t == 0: break
            length = t & 0x7F
            name = rom[p:p + length].decode("ascii", "replace"); p += length
            if t & 0x80:
                sub_id = struct.unpack_from("<H", rom, p)[0]; p += 2
                walk(sub_id, os.path.join(path, name))
            else:
                start, end = fat[fid]; fid += 1
                full = os.path.join(out, path, name)
                os.makedirs(os.path.dirname(full), exist_ok=True)
                with open(full, "wb") as f: f.write(rom[start:end])

    walk(0xF000, "")
    # Also dump the ARM9 overlays' owner-less data? Not needed for art. Count what we got.
    count = sum(len(fs) for _, _, fs in os.walk(out))
    print(f"extracted {count} files to {out}")

if __name__ == "__main__":
    src, dst = sys.argv[1], sys.argv[2]
    extract(read_rom(src), dst)
