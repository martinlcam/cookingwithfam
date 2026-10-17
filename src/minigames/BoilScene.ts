import { HoldGame } from "./inputs/HoldGame";

/**
 * boil (hold): hold the heat, release before overflow.
 * The mechanic lives in HoldGame; tune the feel here or override its hooks.
 */
export class BoilScene extends HoldGame {
  constructor() {
    super("mg:boil", { mode: "watch", vessel: "pot", tool: null, tolerance: 0.05 });
  }
}
