# Art pipeline

Three sources: the PixelFoodThemedAssets pack for dishes and drinks, the ripped
Cooking Mama font sheet for text, and a generator for UI chrome and the raw
ingredient icons the pack does not have.

## Dishes and drinks: PixelFoodThemedAssets pack

```
python3 tools/sprites/pack.py
```

Reads `tools/raw/PixelFoodThemedAssets.zip` and writes `public/assets/food.png` + `.json`,
`src/assets/food_frames.ts` and `docs/food-preview.png`. It takes the outlined (`B`) variant
of every file in `32.32/`, `Drinks/` and `Other/`, splits the burger strip into layers, and
skips `Groceries/` (all real brands) and `MoviesNanimations/` (film and TV property). 84 frames.

Use them with `food(scene, x, y, frame)` from `src/ui.ts`. `dishFrame(recipe)` in
`src/assets/food.ts` picks one from the recipe name by keyword, then from the ingredients.

What the pack covers: finished dishes (sushi, ramen, pizza, lasagna, dumplings, sandwich,
taco, toast, bread), a large dessert set, drinks, and a handful of jars. What it does not
cover: raw ingredients. There is no onion, tomato, egg, chicken or carrot, so the confirm
screen and minigames still use the generated icons below until a raw-ingredient source lands.

## Text: our own bitmap font

```
python3 tools/font/build.py
```

Glyphs are hand-pixelled in `tools/font/glyphs.py` (6-wide grid, 10-row caps, 3-row
descenders) and built into two BMFont-format fonts under `public/assets/font/`: `mama` has a
light-to-gold vertical gradient with a dark outline, `mama_white` has a white fill so it can be
tinted at runtime. The look was modelled on the DS game's lettering; the shapes are ours.
`text()` uses gold for the default ink colour and tints white for any other colour; `label()`
is always gold. Sizes snap to 16, 32 or 48 px so glyphs stay on integer pixels.

## Raw ingredients: hand-drawn with pxl

```
node ~/.claude/skills/pxl-pixel-art/bin/pxl.js build tools/sprites/px/food.px.js
python3 tools/sprites/gen.py
```

`tools/sprites/px/food.px.js` draws every raw ingredient in the pxl DSL (the `pxl-pixel-art`
Claude skill, https://github.com/crsolver/claude-pxl): ~44px forms, four or five tones per
material, two or three dithered `shade`/`light` passes for a soft falloff, a highlight streak,
and a pale tinted halo as the outline. That is the look of the DS ingredient icons. `gen.py`
prefers a pxl sprite over its generated one whenever `tools/sprites/px/out/sprites/<name>.png`
exists: as drawn in the 64px atlas, box-downsampled for the 32px icons. The `out/` folder is
gitignored; the `.px.js` is the source.

To add or fix an ingredient: edit the sprite in `food.px.js`, rebuild with `--only name`, look
at `tools/sprites/px/out/_preview/name.png`, then run `gen.py`.

## UI chrome, tools, fx, dishes: generated

Everything not covered above is generated, not hand-drawn. One Python script bakes every icon,
panel and tile from shape primitives with a shared palette. Item blobs get a lit-volume
shade: a top-left to bottom-right gradient in five bands, edge darkening, a placed specular
highlight, and an outline in a darker shade of the fill rather than black. That is the look
of the DS ingredient art and the main thing that separates "cheap" from "cute" here.

Every item is defined once in 32x32 space and rendered twice: `items` (32x32, for list
icons) and `items64` (64x64 with 2px outlines, for the kitchen hub and minigames, via
`hero()`). Set `K` in `raster.py` to render at other scales.

```
python3 tools/sprites/gen.py     # needs Pillow (python3 -m pip install pillow)
```

Outputs:

| File | What |
|------|------|
| `public/assets/items.png` + `.json` | Phaser atlas, 32x32: raw ingredients, tools, fx (`steam`, `smoke`, `piece`, `splash`, `flame_0..2`, `bubble`, `drop`), hint marks (`hint_v`, `hint_h`, `hint_circle`, `mark_ok`, `mark_miss`) |
| `public/assets/items64.png` + `.json` | The same frames at 64x64 |
| `public/assets/ui.png` + `.json` | Phaser atlas: nine-slice panels/buttons/meters, medals, icons, background tiles |
| `src/assets/frames.ts` | Generated frame-name unions (`ItemFrame`, `UiFrame`) so typos fail typecheck |
| `docs/sprites-preview.png` | Every sprite at 4x with labels, for eyeballing |
| `docs/screens-preview.png` | Every screen in demo mode, for eyeballing |

## Files

- `tools/sprites/raster.py` — mask primitives (`circle`, `ellipse`, `rrect`, `poly`, `line`, `ring`) and `Canvas.part()`, which fills a mask, adds the bottom-right shadow rim, the top-left highlight blob and the inward outline.
- `tools/sprites/palette.py` — the only place colours live. `src/ui.ts` `PALETTE` mirrors it.
- `tools/sprites/items.py` — one function per item, registered with `@item("name")`.
- `tools/sprites/ui.py` — one function per UI frame, registered with `@ui("name", w, h)`.

## Adding a sprite

```python
@item("avocado")
def _(c):
    c.part(ellipse(16, 18, 9, 12), P["dkgreen"], shade=3)   # body
    c.part(circle(16, 20, 4), P["brown"], shade=1)          # pit
```

Run the generator, check `docs/sprites-preview.png`, done. The frame is immediately
usable as `item(scene, x, y, "avocado")` and `itemFrame()` will resolve the name.

## Using it in scenes (`src/ui.ts`)

- `bg(scene, "bg_tile" | "bg_tile_blue" | "bg_check")` tiled background.
- `panel(scene, x, y, w, h, "panel" | "card" | "bubble" | "board" | ...)` nine-slice.
- `button(scene, x, y, label, onClick, w, h, "pink" | "green" | "blue" | "yellow", iconFrame?)`.
- `meter(scene, x, y, w)` returns `{ set(frac), setFill(frame) }`.
- `item(scene, x, y, frame, scale)` / `icon(scene, x, y, frame, scale)`.
- `itemFrame(name)` in `src/assets/items.ts` maps whatever the model wrote ("cherry tomatoes", "chicken breast") onto a frame we have, falling back to `generic`.

## Reference: the cartridge (never committed)

`Cooking Mama.zip` in the project root is a dump of the DS cartridge and is gitignored, as is
everything extracted from it. It is used as a visual reference only; nothing from it is copied
into the game.

```
python3 -I tools/rip/extract_nds.py "Cooking Mama.zip" tools/raw/cartridge/
python3 -I tools/rip/render_nitro.py tools/raw/cartridge/data tools/raw/cartridge_png
```

The first unpacks the ROM file system. The second decodes the Nitro graphics formats (NCLR
palettes, NCGR/NCBR tiles and bitmaps, NCER sprite cells, NSCR tilemaps) into PNGs with a
labelled `_cells.png` contact sheet per folder. Useful folders: `is/food/bg` (every finished
dish screen), `is/game/obj` and `yama/sp` (minigame ingredients and cut animations),
`tonaki/obj` (eggs, meat, fire, pans), `com/obj` (meters, pots, plates, flames, steam).

## Demo mode

Any screen can be opened without the API, which is also the live-demo fallback:

```
/?demo&scene=Confirm
/?demo&scene=RecipePick
/?demo&scene=Kitchen&step=2
/?demo&scene=Result
```

Canned pantry and recipes live in `src/state/demo.ts`.

## Not done yet

- More ingredient shapes tuned against the reference sheets (onion, garlic and cheese are the weakest).

- Mama / the Fam character and reaction faces. `mama_placeholder` in the UI atlas holds the spot.
- Per-item chopped halves. Chop currently pops a generic `piece` chunk.
- Animation frames for stir / flip / pour once those scenes exist.
