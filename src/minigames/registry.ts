import type { Verb } from "@shared/verbs";
import { ChopScene } from "./ChopScene";
import { PlaceholderScene } from "./PlaceholderScene";

/** Verb -> Phaser scene key. Anything not listed uses the placeholder. */
const MAP: Partial<Record<Verb, string>> = {
  chop: "mg:chop",
  // stir: "mg:stir",
  // flip: "mg:flip",
  // pour: "mg:pour",
};

export function sceneKeyFor(verb: Verb): string {
  return MAP[verb] ?? "mg:placeholder";
}

export const MINIGAME_SCENES = [ChopScene, PlaceholderScene];
