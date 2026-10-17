import { TapGame } from "./inputs/TapGame";

/**
 * sprinkle (tap): tap over the dish.
 * The mechanic lives in TapGame; tune the feel here or override its hooks.
 */
export class SprinkleScene extends TapGame {
  constructor() {
    super("mg:sprinkle", { tool: "salt", vessel: "plate", zone: 0.3, speed: 1.3 });
  }
}
