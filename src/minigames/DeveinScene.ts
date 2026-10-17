import { SwipeGame } from "./inputs/SwipeGame";

/**
 * devein (swipe): short precise drag on shrimp.
 * The mechanic lives in SwipeGame; tune the feel here or override its hooks.
 */
export class DeveinScene extends SwipeGame {
  constructor() {
    super("mg:devein", { tool: "knife", dir: "across", minLen: 30 });
  }
}
