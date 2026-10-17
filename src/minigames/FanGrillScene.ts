import { RapidGame } from "./inputs/RapidGame";

/**
 * fan_grill (rapid): fan the grill.
 * The mechanic lives in RapidGame; tune the feel here or override its hooks.
 */
export class FanGrillScene extends RapidGame {
  constructor() {
    super("mg:fan_grill", { vessel: "pan", fx: "smoke" });
  }
}
