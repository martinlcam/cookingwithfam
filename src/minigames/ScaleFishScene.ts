import { SwipeGame } from "./inputs/SwipeGame";

/**
 * scale_fish (swipe): drag against the grain of a fish.
 * The mechanic lives in SwipeGame; tune the feel here or override its hooks.
 */
export class ScaleFishScene extends SwipeGame {
  constructor() {
    super("mg:scale_fish", { tool: "knife", dir: "across", surface: "cutting_board" });
  }
}
