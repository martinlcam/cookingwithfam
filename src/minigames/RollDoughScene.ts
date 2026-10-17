import { CircularGame } from "./inputs/CircularGame";

/**
 * roll_dough (circular): roll dough flat.
 * The mechanic lives in CircularGame; tune the feel here or override its hooks.
 */
export class RollDoughScene extends CircularGame {
  constructor() {
    super("mg:roll_dough", { tool: "rolling_pin", vessel: "cutting_board", radius: 40 });
  }
}
