/**
 * Difficulty levels. Each one scales every minigame the same way, so a recipe plays
 * harder across the board rather than per verb:
 *
 *   time       multiplier on the seconds a step allows
 *   count      multiplier on how many cuts / stirs / taps a step needs
 *   tolerance  multiplier on timing windows (sweet spots, release lines)
 *   speed      multiplier on how fast meters and markers move
 *   bonus      score multiplier, so a hard gold is worth more than an easy one
 */
export interface DifficultyDef {
  id: string;
  label: string;
  /** One line shown under the name on the picker. */
  blurb: string;
  time: number;
  count: number;
  tolerance: number;
  speed: number;
  bonus: number;
}

export const DIFFICULTIES = [
  { id: "easy", label: "EASY", blurb: "lots of time, few cuts, wide targets", time: 1.6, count: 0.7, tolerance: 1.6, speed: 0.75, bonus: 0.9 },
  { id: "moderate", label: "MODERATE", blurb: "the recipe as written", time: 1, count: 1, tolerance: 1, speed: 1, bonus: 1 },
  { id: "hard", label: "HARD", blurb: "less time, more to do, tighter targets", time: 0.8, count: 1.3, tolerance: 0.75, speed: 1.25, bonus: 1.1 },
  { id: "extra_hard", label: "EXTRA HARD", blurb: "half the time, double the work", time: 0.6, count: 1.7, tolerance: 0.55, speed: 1.5, bonus: 1.25 },
  { id: "impossible", label: "IMPOSSIBLE", blurb: "good luck", time: 0.45, count: 2.3, tolerance: 0.35, speed: 2, bonus: 1.5 },
] as const satisfies readonly DifficultyDef[];

export type DifficultyId = (typeof DIFFICULTIES)[number]["id"];
export const DIFFICULTY_IDS = DIFFICULTIES.map((d) => d.id) as [DifficultyId, ...DifficultyId[]];
export const DIFFICULTY_BY_ID: Record<string, DifficultyDef> = Object.fromEntries(DIFFICULTIES.map((d) => [d.id, d]));
export const DEFAULT_DIFFICULTY: DifficultyId = "moderate";

/** Apply a level to a step's params: counts up, seconds down. Timing windows are left to the scene (use `tolerance`). */
export function scaleParams(params: Record<string, number>, d: DifficultyDef): Record<string, number> {
  const out = { ...params };
  for (const k of ["count", "rotations"]) if (out[k] !== undefined) out[k] = Math.max(1, Math.round(out[k]! * d.count));
  if (out.seconds !== undefined) out.seconds = Math.max(2, Math.round(out.seconds * d.time * 10) / 10);
  return out;
}
