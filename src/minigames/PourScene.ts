import { HoldGame } from "./inputs/HoldGame";

/**
 * pour (hold): hold to pour, release at the line.
 * The mechanic lives in HoldGame; tune the feel here or override its hooks.
 */
export class PourScene extends HoldGame {
  constructor() {
    super("mg:pour", { mode: "hold", vessel: "bowl", tool: "water" });
  }
}
