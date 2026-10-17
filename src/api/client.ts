import type { Pantry, RecipeList } from "@shared/schema";

async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(path, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`${path} failed: ${res.status} ${await res.text()}`);
  return res.json() as Promise<T>;
}

export const api = {
  classify: (images: string[]) => post<Pantry>("/api/classify", { images }),
  recipes: (pantry: Pantry) => post<RecipeList>("/api/recipes", { pantry }),
};
