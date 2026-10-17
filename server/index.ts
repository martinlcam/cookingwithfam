import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { logger } from "hono/logger";
import { ClassifyRequest, RecipesRequest } from "../shared/schema";
import { classifyPantry, generateRecipes } from "./claude";

const app = new Hono();
app.use(logger());

app.get("/api/health", (c) => c.json({ ok: true }));

app.post("/api/classify", async (c) => {
  const parsed = ClassifyRequest.safeParse(await c.req.json());
  if (!parsed.success) return c.json({ error: parsed.error.issues }, 400);
  try {
    return c.json(await classifyPantry(parsed.data.images));
  } catch (e) {
    console.error(e);
    return c.json({ error: (e as Error).message }, 502);
  }
});

app.post("/api/recipes", async (c) => {
  const parsed = RecipesRequest.safeParse(await c.req.json());
  if (!parsed.success) return c.json({ error: parsed.error.issues }, 400);
  try {
    return c.json(await generateRecipes(parsed.data.pantry));
  } catch (e) {
    console.error(e);
    return c.json({ error: (e as Error).message }, 502);
  }
});

// Production: serve the built Phaser app from dist/. In dev, Vite serves it.
app.use("/*", serveStatic({ root: "./dist" }));
app.get("*", serveStatic({ root: "./dist", path: "index.html" }));

const port = Number(process.env.PORT ?? 3000);
serve({ fetch: app.fetch, port }, () => console.log(`server on :${port}`));
