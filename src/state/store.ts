import { get, set } from "idb-keyval";
import type { Pantry, Recipe, RecipeList } from "@shared/schema";

/** In-memory run state passed between scenes. Persisted bits go to IndexedDB. */
export const run = {
  photos: [] as string[],
  pantry: null as Pantry | null,
  recipes: null as RecipeList | null,
  recipe: null as Recipe | null,
  stepIndex: 0,
  scores: [] as number[],
};

export function resetRun() {
  run.photos = [];
  run.pantry = null;
  run.recipes = null;
  run.recipe = null;
  run.stepIndex = 0;
  run.scores = [];
}

export const saved = {
  lastPantry: () => get<Pantry>("lastPantry"),
  setLastPantry: (p: Pantry) => set("lastPantry", p),
  bestScores: () => get<Record<string, number>>("bestScores"),
  recordScore: async (recipeName: string, score: number) => {
    const all = (await get<Record<string, number>>("bestScores")) ?? {};
    if ((all[recipeName] ?? 0) < score) all[recipeName] = score;
    await set("bestScores", all);
  },
};
