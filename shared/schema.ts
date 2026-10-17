import { z } from "zod";
import { VERB_NAMES } from "./verbs";
import { DISH_IDS } from "./dishes";

export const PantryItem = z.object({
  name: z.string().describe("lowercase singular ingredient name, e.g. 'onion'"),
  qty: z.number().describe("approximate count or units visible"),
  unit: z.string().describe("'pcs', 'g', 'ml', 'bunch', 'jar', etc."),
  confidence: z.number().min(0).max(1),
});
export type PantryItem = z.infer<typeof PantryItem>;

export const Pantry = z.object({ items: z.array(PantryItem) });
export type Pantry = z.infer<typeof Pantry>;

export const Step = z.object({
  verb: z.enum(VERB_NAMES),
  item: z.string().describe("the ingredient or vessel being acted on, lowercase"),
  params: z.record(z.string(), z.number()).describe("numbers only; count, rotations, seconds, target"),
  caption: z.string().describe("short on-screen instruction, max 6 words"),
});
export type Step = z.infer<typeof Step>;

export const Recipe = z.object({
  name: z.string(),
  description: z.string().describe("one sentence"),
  dish: z.enum(DISH_IDS).describe("the plated-dish sprite that looks closest to the finished recipe"),
  ingredients: z.array(z.string()),
  steps: z.array(Step).min(3).max(10),
});
export type Recipe = z.infer<typeof Recipe>;

export const RecipeList = z.object({
  /** Empty when the pantry can't make a real dish. */
  recipes: z.array(Recipe).max(5),
  /** A friendly one-sentence note to the player: why there's nothing (or little) to cook, or "" when all is well. */
  note: z.string().describe("one friendly sentence to the player when the pantry is too thin to cook much, otherwise an empty string"),
});
export type RecipeList = z.infer<typeof RecipeList>;

// Request bodies
export const ClassifyRequest = z.object({
  /** Data URLs: "data:image/jpeg;base64,...". Several photos of the same pantry. */
  images: z.array(z.string()).min(1).max(8),
});
/** Only items the player kept, each with a real amount. */
export const RecipesRequest = z.object({
  pantry: z.object({ items: z.array(PantryItem.extend({ qty: z.number().positive() })).min(1).max(40) }),
});
