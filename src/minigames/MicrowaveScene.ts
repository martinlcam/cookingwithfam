import { HoldGame } from "./inputs/HoldGame";

/**
 * microwave (place): set the time and stop it.
 * The mechanic lives in HoldGame; tune the feel here or override its hooks.
 */
export class MicrowaveScene extends HoldGame {
  constructor() {
    super("mg:microwave", { mode: "watch", vessel: "pot", tool: null, tolerance: 0.08 });
  }
}
