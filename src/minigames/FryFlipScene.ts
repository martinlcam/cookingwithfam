import { TapGame } from "./inputs/TapGame";

/**
 * fry_flip (tap): fry, then flip at the right moment.
 * The mechanic lives in TapGame; tune the feel here or override its hooks.
 */
export class FryFlipScene extends TapGame {
  constructor() {
    super("mg:fry_flip", { tool: "spatula", vessel: "pan", speed: 1.1 });
  }
}
