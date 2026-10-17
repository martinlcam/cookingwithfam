import { SwipeGame } from "./inputs/SwipeGame";

/**
 * shred (swipe): drag across a grater.
 * The mechanic lives in SwipeGame; tune the feel here or override its hooks.
 */
export class ShredScene extends SwipeGame {
  constructor() {
    super("mg:shred", { tool: null, dir: "down", surface: "grater" });
  }
}
