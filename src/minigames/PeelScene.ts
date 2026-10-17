import { SwipeGame } from "./inputs/SwipeGame";

/**
 * peel (swipe): long drags to peel skin.
 * The mechanic lives in SwipeGame; tune the feel here or override its hooks.
 */
export class PeelScene extends SwipeGame {
  constructor() {
    super("mg:peel", { tool: "knife", dir: "across", surface: "cutting_board" });
  }
}
