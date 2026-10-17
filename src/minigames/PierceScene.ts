import { TapGame } from "./inputs/TapGame";

/**
 * pierce (tap): tap targets.
 * The mechanic lives in TapGame; tune the feel here or override its hooks.
 */
export class PierceScene extends TapGame {
  constructor() {
    super("mg:pierce", { tool: "knife", vessel: "cutting_board", zone: 0.18, speed: 1.2 });
  }
}
