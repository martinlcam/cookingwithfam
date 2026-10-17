import { CircularGame } from "./inputs/CircularGame";

/**
 * whisk (circular): fast tight circles.
 * The mechanic lives in CircularGame; tune the feel here or override its hooks.
 */
export class WhiskScene extends CircularGame {
  constructor() {
    super("mg:whisk", { tool: "whisk", vessel: "bowl", radius: 32 });
  }
}
