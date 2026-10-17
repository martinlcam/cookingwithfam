import { TapGame } from "./inputs/TapGame";

/**
 * crack_egg (tap): tap to crack, drag apart.
 * The mechanic lives in TapGame; tune the feel here or override its hooks.
 */
export class CrackEggScene extends TapGame {
  constructor() {
    super("mg:crack_egg", { tool: null, vessel: "bowl", zone: 0.3 });
  }
}
