import { SwipeGame } from "./inputs/SwipeGame";

/**
 * debone (swipe): trace along a bone.
 * The mechanic lives in SwipeGame; tune the feel here or override its hooks.
 */
export class DeboneScene extends SwipeGame {
  constructor() {
    super("mg:debone", { tool: "knife", dir: "across", surface: "cutting_board", minLen: 80 });
  }
}
