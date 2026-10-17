import { HoldGame } from "./inputs/HoldGame";

/**
 * bake (place): bake or broil, pull at the right moment.
 * The mechanic lives in HoldGame; tune the feel here or override its hooks.
 */
export class BakeScene extends HoldGame {
  constructor() {
    super("mg:bake", { mode: "watch", vessel: "pot", tool: null });
  }
}
