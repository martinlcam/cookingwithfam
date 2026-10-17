import { CircularGame } from "./inputs/CircularGame";

/**
 * mash (circular): mash repeatedly.
 * The mechanic lives in CircularGame; tune the feel here or override its hooks.
 */
export class MashScene extends CircularGame {
  constructor() {
    super("mg:mash", { tool: "spoon", vessel: "bowl", radius: 36 });
  }
}
