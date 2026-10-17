import { TapGame } from "./inputs/TapGame";

/**
 * flip (tap): flip when the meter hits the sweet spot.
 * The mechanic lives in TapGame; tune the feel here or override its hooks.
 */
export class FlipScene extends TapGame {
  constructor() {
    super("mg:flip", { tool: "spatula", vessel: "pan" });
  }
}
