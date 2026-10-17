import { CircularGame } from "./inputs/CircularGame";

/**
 * grind (circular): grind with pressure.
 * The mechanic lives in CircularGame; tune the feel here or override its hooks.
 */
export class GrindScene extends CircularGame {
  constructor() {
    super("mg:grind", { tool: "spoon", vessel: "bowl", radius: 28 });
  }
}
