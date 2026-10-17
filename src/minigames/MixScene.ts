import { CircularGame } from "./inputs/CircularGame";

/**
 * mix (circular): mix with direction changes.
 * The mechanic lives in CircularGame; tune the feel here or override its hooks.
 */
export class MixScene extends CircularGame {
  constructor() {
    super("mg:mix", { tool: "spoon", vessel: "bowl" });
  }
}
