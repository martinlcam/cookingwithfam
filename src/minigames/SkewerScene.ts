import { TapGame } from "./inputs/TapGame";

/**
 * skewer (tap): tap items in order.
 * The mechanic lives in TapGame; tune the feel here or override its hooks.
 */
export class SkewerScene extends TapGame {
  constructor() {
    super("mg:skewer", { tool: null, vessel: "plate", zone: 0.2 });
  }
}
