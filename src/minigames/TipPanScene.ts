import { TiltGame } from "./inputs/TiltGame";

/**
 * tip_pan (tilt): tilt the pan.
 * The mechanic lives in TiltGame; tune the feel here or override its hooks.
 */
export class TipPanScene extends TiltGame {
  constructor() {
    super("mg:tip_pan", { vessel: "pan", axis: "side" });
  }
}
