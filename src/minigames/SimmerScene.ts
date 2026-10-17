import { HoldGame } from "./inputs/HoldGame";

/**
 * simmer (hold): wait and lift the lid in time.
 * The mechanic lives in HoldGame; tune the feel here or override its hooks.
 */
export class SimmerScene extends HoldGame {
  constructor() {
    super("mg:simmer", { mode: "watch", vessel: "pot", tool: null });
  }
}
