import { OpenAPIHono, createRoute, z } from "@hono/zod-openapi";
import { swaggerUI } from "@hono/swagger-ui";
import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { logger } from "hono/logger";
import { ClassifyRequest, Pantry, RecipeList, RecipesRequest } from "../shared/schema";
import { classifyPantry, generateRecipes } from "./claude";

const app = new OpenAPIHono({
  // Validation failures return the same { error } shape the spec documents.
  defaultHook: (result, c) => (result.success ? undefined : c.json({ error: result.error.issues }, 400)),
});
app.use(logger());

const ErrorBody = z.object({ error: z.unknown() });
const err = (description: string) => ({ content: { "application/json": { schema: ErrorBody } }, description });

const health = createRoute({
  method: "get",
  path: "/api/health",
  tags: ["ops"],
  responses: { 200: { content: { "application/json": { schema: z.object({ ok: z.boolean() }) } }, description: "Service is up" } },
});

const classify = createRoute({
  method: "post",
  path: "/api/classify",
  tags: ["pantry"],
  summary: "Classify pantry photos into ingredients",
  description: "Send 1 to 8 photos of the same pantry as base64 data URLs. Duplicates across photos are merged.",
  request: { body: { content: { "application/json": { schema: ClassifyRequest } }, required: true } },
  responses: {
    200: { content: { "application/json": { schema: Pantry } }, description: "Detected ingredients" },
    400: err("Invalid request body"),
    502: err("Claude call failed"),
  },
});

const recipes = createRoute({
  method: "post",
  path: "/api/recipes",
  tags: ["pantry"],
  summary: "Generate recipes from a confirmed pantry",
  description: "Returns up to 5 recipes; an empty list plus a note when the pantry can't make a real dish. Items must have a positive qty. Every step uses a verb from the minigame library.",
  request: { body: { content: { "application/json": { schema: RecipesRequest } }, required: true } },
  responses: {
    200: { content: { "application/json": { schema: RecipeList } }, description: "Playable recipes, or none with a note" },
    400: err("Invalid request body"),
    502: err("Claude call failed"),
  },
});

app.openapi(health, (c) => c.json({ ok: true }, 200));

app.openapi(classify, async (c) => {
  try {
    return c.json(await classifyPantry(c.req.valid("json").images), 200);
  } catch (e) {
    console.error(e);
    return c.json({ error: (e as Error).message }, 502);
  }
});

app.openapi(recipes, async (c) => {
  try {
    return c.json(await generateRecipes(c.req.valid("json").pantry), 200);
  } catch (e) {
    console.error(e);
    return c.json({ error: (e as Error).message }, 502);
  }
});

app.doc("/api/openapi.json", {
  openapi: "3.1.0",
  info: { title: "Cooking With Fam API", version: "0.1.0" },
});
app.get("/api/docs", swaggerUI({ url: "/api/openapi.json" }));

// Production: serve the built Phaser app from dist/. In dev, Vite serves it.
app.use("/*", serveStatic({ root: "./dist" }));
app.get("*", serveStatic({ root: "./dist", path: "index.html" }));

const port = Number(process.env.PORT ?? 3000);
serve({ fetch: app.fetch, port }, () => console.log(`server on :${port}`));
