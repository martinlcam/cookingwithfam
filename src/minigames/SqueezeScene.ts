import { HoldGame } from "./inputs/HoldGame";

/**
 * squeeze (hold): squeeze a lemon or tube.
 * The mechanic lives in HoldGame; tune the feel here or override its hooks.
 */
export class SqueezeScene extends HoldGame {
  constructor() {
    super("mg:squeeze", { mode: "hold", vessel: "bowl", tool: "lemon", tolerance: 0.08 });
  }
}
