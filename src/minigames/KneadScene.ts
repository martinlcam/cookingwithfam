import { CircularGame } from "./inputs/CircularGame";

/**
 * knead (circular): press and fold dough.
 * The mechanic lives in CircularGame; tune the feel here or override its hooks.
 */
export class KneadScene extends CircularGame {
  constructor() {
    super("mg:knead", { tool: null, vessel: "cutting_board", radius: 30 });
  }
}
