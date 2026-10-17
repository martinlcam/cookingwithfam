# Cooking With Fam — Hackathon Design Doc

*2026-10-17 · 24-hour hackathon build*

A Cooking Mama-style pixel art web game. You photograph your pantry, Claude
classifies the ingredients, generates recipes from what you actually have, and
each recipe becomes a chain of touch minigames like the DS originals.

---

## 1. Does it fit in 24 hours?

**Yes, with the full verb library wired in from day one and only a few verbs given real art and feel.**
Every one of the ~43 verbs is already a valid recipe step. Verbs without their own scene run through a placeholder tap minigame, so any generated recipe is playable at hour 1. The hackathon is then spent replacing placeholders with real minigames in priority order.

The photo-to-recipe pipeline sounds like the hard part but it is two Claude
calls with a JSON schema, roughly 2 hours including the proxy. The real time
sink is the minigames. The scaffold ships one real scene per input type as
the target, starting with chop, and the placeholder covers the rest.

### In scope for the 24 hours

- Title screen, multi-photo pantry camera, ingredient confirm, recipe pick, kitchen loop, result screen
- All verbs accepted by the schema; placeholder minigame for any verb without a scene
- Real minigames in priority order: **chop** (swipe), **stir** (circular), **flip** (tap), **pour** (hold), then **toss**, **blow**, **plate**, one per input type, then the rest
- Claude vision for ingredients across several photos, Claude text for recipes, constrained to the verb library
- Bronze / silver / gold scoring with a Mama reaction sprite
- PWA manifest and offline cache so it installs on the judges' phones

### Cut

- Accounts, database, leaderboard. Scores live in the browser.
- Custom pixel art beyond the title screen, Mama, and the 4 minigame props. Everything else from free packs.
- Sound beyond one chime and one buzzer

---

## 2. Concept

1. **Photos.** Player shoots their pantry, fridge, and counter, as many photos as they like. iOS only allows one capture per tap, so the Pantry scene collects them one at a time.
2. **Classify.** All photos go to Claude in one request with a structured output schema. It merges duplicates across photos and returns ingredients with rough quantities and a confidence score.
3. **Confirm.** The player sees the detected ingredients as pixel icons and can toggle any off or bump quantities. No free-text input.
4. **Recipes.** Claude generates 3 to 5 recipes using only confirmed ingredients. Each recipe is a list of steps, and each step is a **minigame verb** from a fixed library plus parameters.
5. **Cook.** The player plays each step as a minigame. Each one is scored. Mama reacts.
6. **Result.** Total score, medal, and the finished dish sprite.

The key design constraint: **recipes are expressed only in minigame verbs the
game already has sprites and scenes for.** The model can invent any dish, but
it can only describe how to cook it using verbs we built. That is what makes
arbitrary recipes playable.

---

## 3. Decisions made so far

| # | Decision | Why |
|---|----------|-----|
| 1 | **All-Phaser, no React.** Every screen including menus is a Phaser Scene. | One canvas, one input system, one loop. No DOM tug of war, no loading hitch between "website" screens and "game" screens. Menus feel like part of the game, which is the Cooking Mama charm. |
| 2 | **Vite + TypeScript + Phaser 3**, no Next.js. | No SSR, no hydration, nothing to fight. `vite-plugin-pwa` handles the manifest and service worker. |
| 3 | **Ship as a PWA.** | Camera is the entry point, so it must feel like a phone app. Installable from the browser, cached offline. |
| 4 | **32x32 icons plus 64x64 hero sprites, nearest-neighbor, integer scale.** | Generated from one definition at two scales (`tools/sprites/gen.py`). Smooth text over NEAREST sprites, see docs/ART.md. |
| 5 | **Mixed assets: free packs plus custom.** | Speed. But every free asset gets re-palettized in Aseprite to one shared palette and one outline rule before it enters the repo. Three art styles in one scene reads as cheap faster than anything else. |
| 6 | **Our own bitmap font for all text** (`public/assets/font/mama*.xml`, glyphs in `tools/font/glyphs.py`). | Changed 2026-10-17: Press Start 2P and Fredoka both looked wrong. Drawn in the style of the DS lettering, original shapes, so it can ship. |
| 7 | **Camera via hidden `<input type="file" accept="image/*" capture="environment">`** triggered from a Phaser button, called once per photo. | Phaser cannot open the camera. This works on iOS and Android without any framework. Multiple photos are collected into one classify request. |
| 8 | **Ingredient editing is toggles and steppers, not text fields.** | Phaser's text input is weak, and icon toggles are more Cooking Mama anyway. |
| 9 | **Claude Opus 5.5 for both calls**, overridable with `CLAUDE_MODEL` (Sonnet 5.5 or Haiku 5.5 if cost matters). | Vision for the pantry photos at low effort, text for recipe generation at medium. Both use `messages.parse` with a Zod output format, so an unknown verb never gets through. |
| 10 | **Tiny backend proxy holds the API key.** One Node/Hono service. | Never ship the key to the client. The same service serves the built Phaser `dist` as static files, so it is one deploy. |
| 11 | **Host on Railway Free, personal workspace.** | $0/month with $1 usage credit. A Node static+API server idles around 70 MB RAM, roughly $0.70/month. Turn on Railway's Serverless setting so it sleeps when idle. Personal workspace is `martinlcam's Projects`, not the Futurity team. |
| 12 | **No database for the hackathon.** Pantry, recipes, and scores in IndexedDB on the device. | Postgres idles at 100 to 150 MB RAM, which alone blows the Free credit. Upgrade path: SQLite on a 0.5 GB volume in the same service, then Railway Hobby ($5/mo) with Postgres if accounts or shared recipes are ever needed. |
| 13 | **Whole verb library in the schema from day one, placeholder scene for unbuilt verbs.** | The model can use all ~43 verbs immediately. Real scenes replace the placeholder in priority order, one per input type first. |
| 14 | **Shared base minigame scene.** | Every minigame extends one class that owns the timer, score meter, and Mama reaction. A persistent HUD scene runs on top so minigames never redraw it. |
| 15 | **oxlint + tsc + Vite build in GitHub Actions, then a `deploy` job runs `railway up` on push to main.** | oxlint is fast and has no Phaser-specific needs. Deploy only happens after checks pass. The GitHub source is disconnected from the Railway service, so CI is the only deploy path. Needs a `RAILWAY_TOKEN` project token in GitHub secrets. Do not use watch patterns to block pushes: they also block `railway up`. |
| 16 | **Conventional commits.** | `feat:`, `fix:`, `chore:`, `docs:`, `ci:`. |
| 17 | **OpenAPI via `@hono/zod-openapi`, not tsoa.** | tsoa targets Express/Koa, needs decorators and a codegen step, and derives types from TS interfaces instead of our shared Zod schemas. Hono's own layer takes the Zod schemas directly: spec at `/api/openapi.json`, Swagger UI at `/api/docs`, automatic request validation. |

---

## 4. Tech stack and architecture

### Stack

| Layer | Choice |
|-------|--------|
| Game engine | Phaser 3 (TypeScript) |
| Build | Vite + `vite-plugin-pwa` |
| Validation | Zod (shared schemas between client and server) |
| Backend | Node + Hono with `@hono/zod-openapi`, single service, serves `dist/` and `/api/*`. OpenAPI 3.1 spec at `/api/openapi.json`, Swagger UI at `/api/docs` |
| AI | Claude Sonnet 5.5 via the Anthropic SDK, structured output |
| Hosting | Railway Free, personal workspace, Serverless on |
| Storage | IndexedDB on device (via `idb-keyval` or similar) |
| Art | Aseprite, 32x32, one shared palette, texture atlas via free-tex-packer |
| Font | Own bitmap font, `tools/font/build.py` |

### Scene structure

```
Boot          load atlas, audio, font
Title         start screen, camera button
Pantry        photo upload, loading animation while Claude classifies
Confirm       ingredient icons as toggles + quantity steppers
RecipePick    3 to 5 recipe cards
Kitchen       hub: shows recipe steps, launches each minigame in order
  HUD         persistent overlay: timer, score meter, Mama portrait
  Minigame/*  one scene per verb, all extend BaseMinigame
Result        medal, dish sprite, play again
```

Phaser's scene manager runs scenes in parallel and can sleep/wake them, so
Kitchen stays warm while a minigame runs on top, and HUD never unloads.

### Data model

```ts
type Verb = (typeof VERBS)[number]['verb'];     // all ~43 verbs, see shared/verbs.ts

interface Step {
  verb: Verb;
  item: string;          // sprite key, e.g. 'onion'
  params: Record<string, number>;  // e.g. { cuts: 6 } or { seconds: 8 }
}

interface Recipe {
  name: string;
  dishSprite: string;
  ingredients: string[];
  steps: Step[];         // 4 to 8 steps
}

interface Pantry {
  items: { name: string; qty: number; confidence: number }[];
}
```

### API

| Route | In | Out |
|-------|----|-----|
| `POST /api/classify` | `{ images: string[] }` data URLs, 1 to 8 photos | `Pantry`, merged across photos |
| `POST /api/recipes` | `Pantry` (confirmed) | `Recipe[]`, each validated against the verb enum |

The recipe prompt includes the verb list and the available item sprite keys,
and asks for JSON matching the schema. Server validates with Zod and retries
once on failure.

---

## 5. Cooking Mama minigame library

Every minigame from the DS and 3DS games, grouped by input type. All of them
are valid recipe steps already. **MVP** marks the first real scene per input
type; everything else runs on the placeholder until its scene exists. The
canonical list with verb ids and default params is `shared/verbs.ts`.

### Swipe / slash

| Verb | MVP | Input |
|------|-----|-------|
| Chop | **MVP** | Vertical swipes across the item, N cuts |
| Slice | | Angled swipes |
| Mince | | Rapid short swipes |
| Peel | | Long drags along the item |
| Shred | | Repeated drags across a grater |
| Scale a fish | | Drags against the grain |
| Cut with scissors | | Pinch-swipe |
| Debone | | Trace a line |
| Devein shrimp | | Short precise drag |

### Circular drag

| Verb | MVP | Input |
|------|-----|-------|
| Stir | **MVP** | Circles in the bowl, keep rhythm |
| Mix | | Circles, direction changes |
| Knead | | Press and drag alternating |
| Whisk | | Fast tight circles |
| Grate | | Up-down drag on a grater |
| Grind | | Circles with pressure |
| Mash | | Press-drag repeatedly |
| Roll dough | | Horizontal back-and-forth |
| Roll sushi | | Single smooth drag |

### Tap timing

| Verb | MVP | Input |
|------|-----|-------|
| Flip | **MVP** | Tap when the meter hits the sweet spot |
| Fry and flip | | Flip plus a watch phase |
| Crack eggs | | Tap-tap then drag apart |
| Pierce | | Tap targets |
| Skewer | | Tap items in order |
| Sprinkle | | Tap repeatedly over the dish |
| Season | | Tap-shake |

### Hold and release

| Verb | MVP | Input |
|------|-----|-------|
| Pour | **MVP** | Hold to pour, release at the line |
| Squeeze lemon | | Hold and twist |
| Simmer and lift lid | | Wait, release at the right moment |
| Boil and watch | | Hold the heat, release before overflow |
| Deep fry and lift | | Hold until golden |

### Tilt / shake

| Verb | MVP | Input |
|------|-----|-------|
| Stir-fry toss | **MVP** | Flick up |
| Tip the pan | | Tilt gesture |
| Strain | | Shake |

### Blow / rapid tap

| Verb | MVP | Input |
|------|-----|-------|
| Blow on hot food | **MVP** | Rapid taps (mic blow on DS) |
| Cool down | | Fan taps |
| Fan the grill | | Rapid alternating taps |

### Shape and place

| Verb | MVP | Input |
|------|-----|-------|
| Form rice balls | | Press and shape |
| Wrap gyoza | | Fold drags |
| Stuff | | Drag filling in |
| Spread butter | | Paint drag |
| Plate and arrange | **MVP** | Drag items to targets |
| Microwave timing | | Set and stop |
| Bake and broil watch | | Wait and pull at the right moment |

---

## 6. 24-hour build plan

Assumes 2 to 3 people. One on game, one on art, one on API and infra. Solo,
halve the minigame count to 2.

| Hours | Game | Art | API / infra |
|-------|------|-----|-------------|
| 0–2 | Vite + Phaser + TS scaffold, Boot and Title scenes, pixelArt config, PWA plugin | Palette locked, Mama portrait, title screen | Hono proxy with `/api/classify`, Claude vision call, Zod schema |
| 2–5 | Pantry scene, camera input, loading animation, Confirm scene with toggles | Ingredient icon set, 16 to 20 common items | `/api/recipes`, verb-constrained prompt, validation and retry |
| 5–8 | RecipePick, Kitchen hub, BaseMinigame, HUD | Bowl, pan, knife, cup sprites, medal icons | Serve `dist/` from the same service, deploy to Railway Free, Serverless on |
| 8–12 | Stir and flip minigames (chop ships with the scaffold) | Chop and stir animation frames | End-to-end test on a real phone over HTTPS |
| 12–16 | Pour, toss, blow, plate minigames | Flip and pour frames, dish sprites | IndexedDB save for scores and last pantry |
| 16–19 | Result scene, scoring, Mama reactions, transitions | Mama reaction frames (happy, neutral, sad) | Prompt tuning on real pantry photos |
| 19–22 | Polish pass: sound, juice, bug fixes | Fill gaps, consistency pass on free assets | Cold-start check, PWA install test |
| 22–24 | Demo recipe rehearsed, fallback pantry photo on disk | | Freeze |

---

## 7. Risks and fallbacks

| Risk | Fallback |
|------|----------|
| Classification is fuzzy on bulk bins and partial labels | Confirm screen lets the player fix it. Keep a known-good pantry photo in the repo for the demo. |
| Claude returns a recipe with an unknown verb | Zod rejects, server retries once with the error in the prompt, then falls back to a hand-written recipe. |
| Railway cold start during the demo | Hit the URL 30 seconds before presenting. Or run locally on a laptop with a tunnel. |
| Unverified Railway account blocks outbound to Anthropic | Verify GitHub at railway.com/verify before hour 8. If still blocked, run the proxy on a Cloudflare Worker instead. |
| Free assets clash in style | Re-palettize everything through the one Aseprite palette the moment it is added. Owner: art. |
| Minigames eat all the time | Nothing breaks. Unbuilt verbs stay on the placeholder and the loop is still playable end to end. |
| iOS Safari camera or PWA quirk | Test on a real iPhone by hour 8, not hour 20. |
