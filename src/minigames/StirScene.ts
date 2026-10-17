import { CircularGame } from "./inputs/CircularGame";

/**
 * stir (circular): stir in a bowl or pot.
 * The mechanic lives in CircularGame; tune the feel here or override its hooks.
 */
export class StirScene extends CircularGame {
  constructor() {
    super("mg:stir", { tool: "spoon", vessel: "bowl" });
  }
}
