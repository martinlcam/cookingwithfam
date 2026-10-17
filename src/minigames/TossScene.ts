import { TiltGame } from "./inputs/TiltGame";

/**
 * toss (tilt): stir fry toss.
 * The mechanic lives in TiltGame; tune the feel here or override its hooks.
 */
export class TossScene extends TiltGame {
  constructor() {
    super("mg:toss", { vessel: "pan", axis: "up" });
  }
}
