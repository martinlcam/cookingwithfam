import { SwipeGame } from "./inputs/SwipeGame";

/**
 * spread (place): spread butter or sauce.
 * The mechanic lives in SwipeGame; tune the feel here or override its hooks.
 */
export class SpreadScene extends SwipeGame {
  constructor() {
    super("mg:spread", { tool: "knife", dir: "across", surface: "plate" });
  }
}
