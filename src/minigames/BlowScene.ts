import { RapidGame } from "./inputs/RapidGame";

/**
 * blow (rapid): cool hot food.
 * The mechanic lives in RapidGame; tune the feel here or override its hooks.
 */
export class BlowScene extends RapidGame {
  constructor() {
    super("mg:blow", { vessel: "plate", fx: "steam" });
  }
}
