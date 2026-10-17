# Cooking With Fam

Cooking Mama, but you photograph your real pantry first. Claude classifies the
ingredients, generates recipes from what you have, and each recipe becomes a
chain of pixel-art touch minigames. All-Phaser PWA with a tiny Hono proxy.

Design doc and decisions: [`docs/DESIGN.md`](docs/DESIGN.md).

## Run it

```bash
cp .env.example .env     # add your ANTHROPIC_API_KEY
npm install
npm run dev              # Vite on :5173, Hono API on :3000, /api proxied
```

Open http://localhost:5173 on your phone via your LAN IP for the camera. The
camera input needs HTTPS off localhost, so for phone testing use a tunnel
(`npx localtunnel --port 5173` or similar).

## Scripts

| Script | What |
|---|---|
| `npm run dev` | client + server with reload |
| `npm run build` | Vite build to `dist/` with the PWA service worker |
| `npm run start` | Hono serves `dist/` and `/api/*` on `$PORT` (what Railway runs) |
| `npm run lint` | oxlint |
| `npm run typecheck` | tsc for client and server |

## Layout

```
shared/   verbs.ts (full minigame library) + schema.ts (zod, shared by both sides)
server/   Hono + zod-openapi: /api/classify (photos -> pantry), /api/recipes (pantry -> recipes)
          spec at /api/openapi.json, Swagger UI at /api/docs
src/      Phaser. scenes/ are the app screens, minigames/ are the verbs
```

## Adding a minigame

1. Create `src/minigames/StirScene.ts` extending `BaseMinigame`, key `mg:stir`.
2. Implement `setup()`, call `this.progress(0..1)` as the player works.
3. Register it in `src/minigames/registry.ts`. Until then the verb uses the placeholder.

## Deploy

GitHub Actions deploys on every push to `main` after lint, typecheck, and
build pass, by running `railway up` against the `web` service. Railway builds
with Railpack and starts `npm run start` (see `railway.json`). Serverless sleep
is on so it costs nothing idle on the Free plan.

One-time setup: create a project token in Railway (Project → Settings →
Tokens, environment `production`) and add it as the `RAILWAY_TOKEN` secret:

```bash
gh secret set RAILWAY_TOKEN
```

`ANTHROPIC_API_KEY` and `CLAUDE_MODEL` live in the Railway service variables.
