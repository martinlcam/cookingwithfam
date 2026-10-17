import { TapGame } from "./inputs/TapGame";

/**
 * season (tap): shake seasoning.
 * The mechanic lives in TapGame; tune the feel here or override its hooks.
 */
export class SeasonScene extends TapGame {
  constructor() {
    super("mg:season", { tool: "salt", vessel: "pan", zone: 0.3, speed: 1.3 });
  }
}
