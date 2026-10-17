import { RapidGame } from "./inputs/RapidGame";

/**
 * cool (rapid): fan to cool.
 * The mechanic lives in RapidGame; tune the feel here or override its hooks.
 */
export class CoolScene extends RapidGame {
  constructor() {
    super("mg:cool", { vessel: "bowl", fx: "steam" });
  }
}
