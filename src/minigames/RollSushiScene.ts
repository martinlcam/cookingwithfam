import { CircularGame } from "./inputs/CircularGame";

/**
 * roll_sushi (circular): one smooth roll.
 * The mechanic lives in CircularGame; tune the feel here or override its hooks.
 */
export class RollSushiScene extends CircularGame {
  constructor() {
    super("mg:roll_sushi", { tool: "rolling_pin", vessel: "cutting_board", radius: 56 });
  }
}
