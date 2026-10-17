import { SwipeGame } from "./inputs/SwipeGame";

/**
 * scissor_cut (swipe): cut with scissors.
 * The mechanic lives in SwipeGame; tune the feel here or override its hooks.
 */
export class ScissorCutScene extends SwipeGame {
  constructor() {
    super("mg:scissor_cut", { tool: "knife", dir: "down" });
  }
}
