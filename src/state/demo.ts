import type { Pantry, RecipeList } from "@shared/schema";
import { run } from "./store";

/**
 * Canned pantry + recipes so any screen can be opened without the API:
 *   /?demo&scene=RecipePick   /?demo&scene=Kitchen   /?demo&scene=Result
 * Also the fallback for the live demo if the network dies.
 */
export const DEMO_PANTRY: Pantry = {
  items: [
    { name: "onion", qty: 2, unit: "pcs", confidence: 0.95 },
    { name: "cherry tomatoes", qty: 8, unit: "pcs", confidence: 0.9 },
    { name: "eggs", qty: 6, unit: "pcs", confidence: 0.98 },
    { name: "chicken breast", qty: 2, unit: "pcs", confidence: 0.8 },
    { name: "spaghetti", qty: 500, unit: "g", confidence: 0.85 },
    { name: "parmesan", qty: 1, unit: "pcs", confidence: 0.7 },
    { name: "garlic", qty: 1, unit: "pcs", confidence: 0.9 },
    { name: "olive oil", qty: 1, unit: "jar", confidence: 0.6 },
    { name: "spinach", qty: 1, unit: "bunch", confidence: 0.4 },
    { name: "chips", qty: 1, unit: "bag", confidence: 0.8 },
    { name: "welch's fruit snacks", qty: 1, unit: "pack", confidence: 0.7 },
    { name: "capri sun fruit punch", qty: 1, unit: "pouch", confidence: 0.7 },
    { name: "soft chewy granola bar", qty: 2, unit: "pcs", confidence: 0.6 },
    { name: "mystery jar", qty: 1, unit: "jar", confidence: 0.3 },
  ],
};

export const DEMO_RECIPES: RecipeList = {
  recipes: [
    {
      name: "Garlic Chicken Pasta",
      dish: "dish_pasta",
      description: "Pan-seared chicken tossed with spaghetti, garlic and tomatoes.",
      ingredients: ["chicken", "spaghetti", "garlic", "tomato", "olive oil"],
      steps: [
        { verb: "chop", item: "onion", params: { count: 6 }, caption: "Chop the onion" },
        { verb: "mince", item: "garlic", params: { count: 10 }, caption: "Mince the garlic" },
        { verb: "slice", item: "chicken", params: { count: 5 }, caption: "Slice the chicken" },
        { verb: "peel", item: "potato", params: { count: 4 }, caption: "Peel the potato" },
        { verb: "shred", item: "cabbage", params: { count: 6 }, caption: "Shred the cabbage" },
        { verb: "boil", item: "pasta", params: { seconds: 6 }, caption: "Boil the pasta" },
        { verb: "stir", item: "pan", params: { rotations: 6 }, caption: "Stir it all" },
        { verb: "plate", item: "plate", params: { count: 3 }, caption: "Plate it up" },
      ],
    },
    {
      name: "Tomato Omelette",
      dish: "dish_eggs",
      description: "Fluffy eggs folded over tomato and cheese.",
      ingredients: ["egg", "tomato", "cheese"],
      steps: [
        { verb: "crack_egg", item: "egg", params: { count: 3 }, caption: "Crack the eggs" },
        { verb: "whisk", item: "bowl", params: { rotations: 10 }, caption: "Whisk them" },
        { verb: "chop", item: "tomato", params: { count: 4 }, caption: "Chop the tomato" },
        { verb: "flip", item: "pan", params: { count: 1 }, caption: "Flip it!" },
      ],
    },
    {
      name: "Spinach Salad",
      dish: "dish_salad",
      description: "Fresh greens with tomato and shaved parmesan.",
      ingredients: ["spinach", "tomato", "parmesan", "olive oil"],
      steps: [
        { verb: "chop", item: "tomato", params: { count: 4 }, caption: "Chop the tomato" },
        { verb: "grate", item: "cheese", params: { rotations: 6 }, caption: "Grate the cheese" },
        { verb: "pour", item: "oil", params: { target: 0.6 }, caption: "Drizzle the oil" },
        { verb: "toss", item: "bowl", params: { count: 5 }, caption: "Toss the salad" },
      ],
    },
  ],
};

/** If the URL asks for it, seed run state and return the scene to open. */
export function demoStart(): string | null {
  const q = new URLSearchParams(location.search);
  if (!q.has("demo")) return null;
  run.pantry = structuredClone(DEMO_PANTRY);
  run.recipes = structuredClone(DEMO_RECIPES);
  run.recipe = run.recipes.recipes[0]!;
  run.stepIndex = Number(q.get("step") ?? 0);
  run.scores = [92, 70, 88];
  return q.get("scene") ?? "Title";
}
