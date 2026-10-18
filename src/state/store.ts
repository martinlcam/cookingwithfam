import { get, set } from "idb-keyval";
import type { Pantry, Recipe, RecipeList } from "@shared/schema";
import { DEFAULT_DIFFICULTY, DIFFICULTY_BY_ID, type DifficultyId } from "@shared/difficulty";

/** In-memory run state passed between scenes. Persisted bits go to IndexedDB. */
export const run = {
  photos: [] as string[],
  pantry: null as Pantry | null,
  recipes: null as RecipeList | null,
  recipe: null as Recipe | null,
  stepIndex: 0,
  scores: [] as number[],
  /** Chosen on the Difficulty screen; remembered on the device. */
  difficulty: loadDifficulty(),
};

const DIFF_KEY = "cwf.difficulty";
function loadDifficulty(): DifficultyId {
  try {
    const v = localStorage.getItem(DIFF_KEY);
    if (v && DIFFICULTY_BY_ID[v]) return v as DifficultyId;
  } catch { /* private mode */ }
  return DEFAULT_DIFFICULTY;
}
export function setDifficulty(id: DifficultyId) {
  run.difficulty = id;
  try { localStorage.setItem(DIFF_KEY, id); } catch { /* private mode */ }
}

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
