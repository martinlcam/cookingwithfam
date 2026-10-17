import { TiltGame } from "./inputs/TiltGame";

/**
 * strain (tilt): shake to strain.
 * The mechanic lives in TiltGame; tune the feel here or override its hooks.
 */
export class StrainScene extends TiltGame {
  constructor() {
    super("mg:strain", { vessel: "pot", axis: "side" });
  }
}
