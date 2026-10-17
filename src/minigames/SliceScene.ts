import { SwipeGame } from "./inputs/SwipeGame";

/**
 * slice (swipe): angled slices.
 * The mechanic lives in SwipeGame; tune the feel here or override its hooks.
 */
export class SliceScene extends SwipeGame {
  constructor() {
    super("mg:slice", { tool: "knife", dir: "any", surface: "cutting_board" });
  }
}
