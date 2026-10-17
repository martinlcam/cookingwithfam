"""Catalogue of third-party sprite packs that feed the items atlases.

Every pack lives as a zip under tools/raw/ (committed, licenses in docs/CREDITS.md).
`catalog()` returns {frame_name: (PIL image, priority)} for every usable sprite across all
packs, lowest priority number wins when two packs name the same thing. Frame names are the
packs' own file names normalised (lowercase, underscores, trailing _01 counters dropped), so
the model's ingredient words can be matched against a vocabulary of ~1000 foods.
"""
from __future__ import annotations
import io, os, re, zipfile
from PIL import Image

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
RAW = os.path.join(ROOT, "tools", "raw")

# (zip relative to tools/raw, priority, include-filter on the member path, max sprite size, name map)
SOURCES = [
    # caiomarcelpixel, CC BY 4.0, 64x64 raw ingredients. Mapped by hand in gen.py (PACK_MAP); here as fallback names.
    ("free_ingredients_pack01.zip", 1, lambda p: "/original/" in p or "original/" in p, 64, None),
    # ghostpixxells, CC0, 32x32 dishes and snacks
    ("packs/ghostpixxells_pixelfood_cc0.zip", 2, lambda p: True, 32, None),
    # bluecarrot16 (in AntumDeluge's CC0 compilation), 32x32, big named set
    ("packs/oga_cc0_food-bluecarrot16_20201221_0.zip", 3, lambda p: "32x32/" in p, 32, None),
    # other 32x32 members of the CC0 compilation
    ("packs/oga_cc0_food-7soul1_20201212.zip", 4, lambda p: "32x32/" in p, 32, None),
    ("packs/oga_cc0_food-thekingphoenix_0.zip", 4, lambda p: "32x32/" in p, 32, None),
    ("packs/oga_cc0_food-melle_0.zip", 4, lambda p: "32x32/" in p, 32, None),
    ("packs/oga_cc0_food-glitch_0.zip", 5, lambda p: "32x32/" in p, 32, None),
    ("packs/oga_cc0_food-arlantr_20201229.zip", 5, lambda p: "32x32/" in p, 32, None),
    ("packs/oga_cc0_food-fleurman_0.zip", 5, lambda p: "32x32/" in p, 32, None),
    ("packs/oga_cc0_food-jetrel_20201222.zip", 5, lambda p: "32x32/" in p, 32, None),
    ("packs/oga_cc0_food-homohikka.zip", 5, lambda p: "32x32/" in p or "/16x16/" in p, 32, None),
    # ARoachIFoundOnMyPillow, CC0, 188 named 16x16 icons: last resort before "generic"
    ("packs/oga_188_food_icons_cc0.zip", 6, lambda p: True, 16, None),
]

# Words that are not foods or that collide with our own frames; never let a pack define them.
BLOCK = {"dish", "bowl", "plate", "napkin", "pile", "cup", "knife", "pan", "pot", "stove", "smoke", "steam", "piece", "splash",
         "bubble", "drop", "lid", "spoon", "generic", "water"}

def norm(name: str) -> str:
    n = os.path.basename(name).rsplit(".", 1)[0].lower()
    n = re.sub(r"[\s\-]+", "_", n)
    n = re.sub(r"[^a-z0-9_]", "", n)
    n = re.sub(r"^\d+_", "", n)           # leading counters: 05_apple_pie -> apple_pie
    n = re.sub(r"_?\d+$", "", n)          # trailing counters: tea_01 -> tea, cob_rolls_03 -> cob_rolls
    n = re.sub(r"_(dish|bowl|napkin|pile|whole)$", "", n)
    n = n.strip("_")
    return n

def _usable(im: Image.Image, max_size: int) -> bool:
    if im.width > max_size * 2 or im.height > max_size * 2: return False
    bbox = im.getbbox()
    if not bbox: return False
    w, h = bbox[2] - bbox[0], bbox[3] - bbox[1]
    return w >= 6 and h >= 6

# (zip, frame) pairs to skip: sprites that are drawn too small or oddly in that pack.
SKIP = {("free_ingredients_pack01.zip", "garlic")}

def catalog() -> dict[str, tuple[Image.Image, int]]:
    out: dict[str, tuple[Image.Image, int]] = {}
    for rel, prio, keep, max_size, _ in SOURCES:
        path = os.path.join(RAW, rel)
        if not os.path.exists(path): continue
        with zipfile.ZipFile(path) as z:
            names = [n for n in z.namelist() if n.lower().endswith(".png") and keep(n) and "__MACOSX" not in n]
            # prefer singular, counter-free file names: sort so "egg.png" beats "eggs_03.png"
            names.sort(key=lambda n: (len(os.path.basename(n)), n))
            for n in names:
                key = norm(n)
                if not key or key in BLOCK or (rel, key) in SKIP: continue
                if key in out and out[key][1] <= prio: continue
                try:
                    im = Image.open(io.BytesIO(z.read(n))).convert("RGBA")
                except Exception:
                    continue
                if not _usable(im, max_size): continue
                out[key] = (im, prio)
    return out

def fit(im: Image.Image, size: int) -> Image.Image:
    """Crop to bounds and scale by the largest whole number that fits `size` (down by 2 if needed)."""
    im = im.crop(im.getbbox())
    target = size - 4
    big = max(im.width, im.height)
    k = max(1, target // big)
    if k > 1: im = im.resize((im.width * k, im.height * k), Image.NEAREST)
    elif big > target: im = im.resize((max(1, im.width // 2), max(1, im.height // 2)), Image.BOX)
    out = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    out.alpha_composite(im, ((size - im.width) // 2, (size - im.height) // 2))
    return out

if __name__ == "__main__":
    c = catalog()
    print(len(c), "frames")
    by = {}
    for k, (_, p) in c.items(): by[p] = by.get(p, 0) + 1
    print(sorted(by.items()))
    print(sorted(c)[:80])
