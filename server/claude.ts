import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { Pantry, RecipeList, type Pantry as PantryT, type RecipeList as RecipeListT } from "../shared/schema";
import { VERBS } from "../shared/verbs";
import { DISHES } from "../shared/dishes";

let cachedClient: Anthropic | undefined;
/** Lazy so the server boots (and serves the game) even before ANTHROPIC_API_KEY is set. */
const client = () => (cachedClient ??= new Anthropic());
const MODEL = process.env.CLAUDE_MODEL ?? "claude-opus-5-5";

type ImageMedia = "image/jpeg" | "image/png" | "image/webp" | "image/gif";

function splitDataUrl(dataUrl: string): { media_type: ImageMedia; data: string } {
  const m = /^data:(image\/(?:jpeg|png|webp|gif));base64,(.+)$/s.exec(dataUrl);
  if (!m) throw new Error("image must be a base64 data URL (jpeg/png/webp/gif)");
  return { media_type: m[1] as ImageMedia, data: m[2]! };
}

/** Merge several photos of the same pantry into one deduplicated list. */
export async function classifyPantry(images: string[]): Promise<PantryT> {
  const blocks: Anthropic.ContentBlockParam[] = images.map((img) => ({
    type: "image",
    source: { type: "base64", ...splitDataUrl(img) },
  }));
  blocks.push({
    type: "text",
    text:
      "These are photos of the same kitchen pantry, fridge, or counter. " +
      "List every food ingredient you can see across all photos. Merge duplicates " +
      "that appear in more than one photo. Use lowercase singular names. Skip " +
      "non-food items, cookware, and anything you are below 0.3 confidence on.",
  });

  const res = await client().messages.parse({
    model: MODEL,
    max_tokens: 4000,
    output_config: { effort: "low", format: zodOutputFormat(Pantry) },
    messages: [{ role: "user", content: blocks }],
  });
  if (res.stop_reason === "refusal") throw new Error("classification refused");
  if (!res.parsed_output) throw new Error("classification returned no JSON");
  return res.parsed_output;
}

const VERB_SHEET = VERBS.map((v) => `- ${v.verb} (${v.input}): ${v.hint}; default params ${JSON.stringify(v.params)}`).join("\n");

const DISH_SHEET = DISHES.map((d) => `- ${d.id}: ${d.hint}`).join("\n");

const RECIPE_SYSTEM = `You design recipes for a Cooking Mama style game. Each recipe is a
sequence of minigame steps. A step's "verb" MUST be one of the verbs below; there
are no other verbs. Pick 3 to 10 steps that feel like really cooking the dish, in
cooking order. Use only ingredients from the pantry plus pantry staples (salt,
pepper, oil, water). Never invent an ingredient the pantry doesn't have: no
pumpkin without a pumpkin, no cheese without cheese. Vary the input types
across a recipe so it is fun to play. Captions are short imperative
instructions like "Chop the onion".

Be honest about what the pantry can do. If it can't make at least one real
dish (only drinks and condiments, a single item, nothing that goes together)
return an empty "recipes" list and put one friendly sentence in "note" saying
what's missing, e.g. "Water and coffee only make coffee; grab a few real
ingredients and come back!". If it can only make one or two things, return
only those and use "note" to say the pantry is a bit thin. Never pad the list
with recipes that need things the player doesn't have. When the pantry is
fine, "note" is an empty string.

Each recipe's "dish" MUST be one of the dish ids below: pick the one whose
look is closest to the finished plate. There are no other dishes. If nothing
is close, use a generic dish_* id.

Available verbs:
${VERB_SHEET}

Available dishes:
${DISH_SHEET}`;

export async function generateRecipes(pantry: PantryT): Promise<RecipeListT> {
  const items = pantry.items.filter((i) => i.qty > 0);
  if (items.length === 0) return { recipes: [], note: "Your pantry is empty. Add a few ingredients first!" };
  const res = await client().messages.parse({
    model: MODEL,
    max_tokens: 8000,
    system: [{ type: "text", text: RECIPE_SYSTEM, cache_control: { type: "ephemeral" } }],
    output_config: { effort: "medium", format: zodOutputFormat(RecipeList) },
    messages: [
      {
        role: "user",
        content:
          "Pantry:\n" +
          items.map((i) => `- ${i.qty} ${i.unit} ${i.name}`).join("\n") +
          "\n\nGive me up to 5 recipes I can honestly cook from this, or none with a note if I can't.",
      },
    ],
  });
  if (res.stop_reason === "refusal") throw new Error("recipe generation refused");
  if (!res.parsed_output) throw new Error("recipe generation returned no JSON");
  return res.parsed_output;
}
