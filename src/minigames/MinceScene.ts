import { SwipeGame } from "./inputs/SwipeGame";

/**
 * mince (swipe): rapid short cuts.
 * The mechanic lives in SwipeGame; tune the feel here or override its hooks.
 */
export class MinceScene extends SwipeGame {
  constructor() {
    super("mg:mince", { tool: "knife", dir: "down", surface: "cutting_board", minLen: 25 });
  }
}
