"""Build public/assets/{items,ui}.png + .json (Phaser JSONHash) and a 4x preview sheet.

    python3 tools/sprites/gen.py
"""
from __future__ import annotations
import json, os, sys
sys.path.insert(0, os.path.dirname(__file__))
from PIL import Image, ImageDraw
import raster
from raster import Canvas
from items import ITEMS
from ui import UI

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
OUT = os.path.join(ROOT, "public", "assets")
os.makedirs(OUT, exist_ok=True)

def render(name, w, h, fn, k=1):
    raster.set_scale(k)
    c = Canvas(w * k, h * k); fn(c); im = c.image()
    raster.set_scale(1)
    return im

def pack(sprites, max_w=512, pad=1):
    """Shelf packer. sprites: list of (name, PIL.Image). Returns (sheet, frames)."""
    sprites = sorted(sprites, key=lambda s: (-s[1].height, -s[1].width, s[0]))
    x = y = shelf_h = 0; frames = {}; placed = []
    for name, im in sprites:
        if x + im.width + pad > max_w:
            x = 0; y += shelf_h + pad; shelf_h = 0
        placed.append((name, im, x, y)); frames[name] = (x, y, im.width, im.height)
        x += im.width + pad; shelf_h = max(shelf_h, im.height)
    H = y + shelf_h
    sheet = Image.new("RGBA", (max_w, H), (0, 0, 0, 0))
    for name, im, px, py in placed: sheet.paste(im, (px, py))
    return sheet, frames

def atlas_json(frames, image, w, h):
    return {
        "frames": {
            n: {"frame": {"x": x, "y": y, "w": fw, "h": fh}, "rotated": False, "trimmed": False,
                "spriteSourceSize": {"x": 0, "y": 0, "w": fw, "h": fh}, "sourceSize": {"w": fw, "h": fh}}
            for n, (x, y, fw, fh) in frames.items()
        },
        "meta": {"app": "tools/sprites/gen.py", "image": image, "format": "RGBA8888", "size": {"w": w, "h": h}, "scale": "1"},
    }

def write_atlas(name, sprites):
    sheet, frames = pack(sprites)
    sheet.save(os.path.join(OUT, f"{name}.png"))
    with open(os.path.join(OUT, f"{name}.json"), "w") as f:
        json.dump(atlas_json(frames, f"{name}.png", sheet.width, sheet.height), f, indent=1)
    return sheet, frames

def preview(groups, path, scale=4, cols=8):
    """Labelled contact sheet so a human can eyeball every sprite at game scale."""
    cell = 32 * scale + 8; label_h = 14
    rows = []
    for title, sprites in groups:
        rows.append(("title", title, None))
        for i in range(0, len(sprites), cols): rows.append(("row", None, sprites[i:i + cols]))
    H = sum(24 if r[0] == "title" else cell + label_h for r in rows) + 16
    W = cols * cell + 16
    im = Image.new("RGBA", (W, H), (255, 244, 220, 255)); d = ImageDraw.Draw(im)
    y = 8
    for kind, title, sprites in rows:
        if kind == "title":
            d.text((8, y + 4), title, fill=(58, 33, 24)); y += 24; continue
        for i, (name, spr) in enumerate(sprites):
            x = 8 + i * cell
            sc = max(1, min(scale, 128 // max(spr.width, spr.height)))
            big = spr.resize((spr.width * sc, spr.height * sc), Image.NEAREST)
            im.alpha_composite(big, (x + (cell - 8 - big.width) // 2, y + (cell - 8 - big.height) // 2))
            d.text((x, y + cell - 4), name[:18], fill=(58, 33, 24))
        y += cell + label_h
    im.save(path)

PX_DIR = os.path.join(ROOT, "tools", "sprites", "px", "out", "sprites")
PACK_ZIP = os.path.join(ROOT, "tools", "raw", "free_ingredients_pack01.zip")

# Our frame name -> basename (lowercase, no extension) of a 64x64 sprite in caiomarcelpixel's
# Free Ingredients Pack (CC BY 4.0, see docs/CREDITS.md). Highest-priority art source.
PACK_MAP = {
    "tomato": "tomato", "onion": "onion", "garlic": "garlic", "carrot": "carrot", "potato": "potato",
    "pepper": "bell pepper green", "broccoli": "broccoli", "lettuce": "lettuce", "cucumber": "cucumber",
    "eggplant": "eggplant", "corn": "corn", "apple": "apple", "avocado": "avocado", "banana": "banana",
    "lemon": "lemon", "orange": "orange", "strawberry": "strawberry", "bacon": "bacon strip",
    "chicken": "chicken drumstick", "beef": "t bone", "pork": "porchetta", "butter": "butter",
    "cheese": "cheese gouda", "milk": "milk carton", "yogurt": "yogurt", "fish": "trout", "shrimp": "shrimp",
    # extra frames that only exist thanks to the pack
    "cabbage": "cabbage", "asparagus": "asparagus", "beetroot": "beetroot", "pumpkin": "pumpkin",
    "radish": "radish", "sweet_potato": "sweet potato", "parsnip": "parsnip", "red_onion": "onion red",
    "red_pepper": "bell pepper red", "yellow_pepper": "bell pepper yellow", "lime": "lime", "mango": "mango",
    "melon": "melon", "peach": "peach", "pear": "pear", "pineapple": "pineapple", "grapes": "grapes",
    "cherry": "cherry", "coconut": "coconut", "kiwi": "kiwi", "blueberry": "blueberry", "raspberry": "raspberry",
    "watermelon": "watermelon", "salmon": "salmon filet", "tuna": "tuna steak", "squid": "squid",
    "octopus": "octopus tentacle", "lobster": "lobster", "clam": "clam", "oyster": "oyster", "sardine": "sardine",
    "chicken_breast": "chicken breast", "chicken_wing": "chicken wing", "steak": "new york strip",
    "ribs": "short ribs", "patty": "patty", "duck": "duck breast", "lamb": "shank", "brisket": "brisket",
    "mozzarella": "cheese mozzarella", "brie": "cheese brie", "blue_cheese": "cheese blue gorgonzola",
    "milk_bottle": "milk bottle",
}
_pack_cache = None

def _pack_sprites():
    """basename -> PIL image for every 64x64 png in the pack zip."""
    global _pack_cache
    if _pack_cache is not None: return _pack_cache
    _pack_cache = {}
    if not os.path.exists(PACK_ZIP): return _pack_cache
    import io, zipfile
    with zipfile.ZipFile(PACK_ZIP) as z:
        for n in z.namelist():
            if not n.lower().endswith(".png") or "/original/" not in n: continue
            im = Image.open(io.BytesIO(z.read(n))).convert("RGBA")
            if im.size == (64, 64): _pack_cache[os.path.basename(n)[:-4].lower()] = im
    return _pack_cache

def pack_override(name, size):
    """Pack sprite for this frame, cropped to its bounds and scaled by a whole number to fit `size`."""
    key = PACK_MAP.get(name)
    if not key: return None
    src = _pack_sprites().get(key)
    if src is None:
        # tolerate small filename differences ("cheese blue gorg...")
        hits = [k for k in _pack_sprites() if k.startswith(key[:12])]
        if not hits: return None
        src = _pack_sprites()[hits[0]]
    bbox = src.getbbox()
    if not bbox: return None
    im = src.crop(bbox)
    target = size - 4  # breathing room inside the frame
    big = max(im.width, im.height)
    k = max(1, target // big)  # largest whole-number upscale that fits (small source art stays crisp)
    if k > 1: im = im.resize((im.width * k, im.height * k), Image.NEAREST)
    elif big > target: im = im.resize((max(1, im.width // 2), max(1, im.height // 2)), Image.BOX)
    out = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    out.alpha_composite(im, ((size - im.width) // 2, (size - im.height) // 2))
    return out

def px_override(name, size):
    """Hand-drawn pxl sprite for this item, centred in a size x size frame. 64: as drawn; 32: box-downsampled."""
    path = os.path.join(PX_DIR, name + ".png")
    if not os.path.exists(path): return None
    im = Image.open(path).convert("RGBA")
    if size == 32: im = im.resize((max(1, im.width // 2), max(1, im.height // 2)), Image.BOX)
    out = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    out.alpha_composite(im, ((size - im.width) // 2, (size - im.height) // 2))
    return out

def main():
    # Priority per frame: CC-BY ingredient pack > hand-drawn pxl sprite > generated shape.
    names = list(ITEMS) + [n for n in PACK_MAP if n not in ITEMS]
    def pick(n, size):
        im = pack_override(n, size) or px_override(n, size)
        if im is None and n in ITEMS: im = render(n, 32, 32, ITEMS[n], k=size // 32)
        return im
    items = [(n, pick(n, 32)) for n in names]
    items64 = [(n, pick(n, 64)) for n in names]
    uis = [(n, render(n, w, h, fn)) for n, (w, h, fn) in UI.items()]
    write_atlas("items", items); write_atlas("items64", items64); write_atlas("ui", uis)
    with open(os.path.join(ROOT, "src", "assets", "frames.ts"), "w") as f:
        f.write("// Generated by tools/sprites/gen.py. Do not edit.\n")
        f.write("export const ITEM_FRAMES = " + json.dumps(sorted(names), indent=0).replace("\n", " ") + " as const;\n")
        f.write("export const UI_FRAMES = " + json.dumps(sorted(UI), indent=0).replace("\n", " ") + " as const;\n")
        f.write("export type ItemFrame = (typeof ITEM_FRAMES)[number];\nexport type UiFrame = (typeof UI_FRAMES)[number];\n")
    preview([("ITEMS 64x64 (hero, shown 2x)", items64), ("ITEMS 32x32 (icons, shown 4x)", items), ("UI", uis)], os.path.join(ROOT, "docs", "sprites-preview.png"))
    print(f"items: {len(items)} (+64px)  ui: {len(uis)}  -> public/assets, docs/sprites-preview.png")

if __name__ == "__main__":
    main()
