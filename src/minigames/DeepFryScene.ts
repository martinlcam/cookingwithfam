import { HoldGame } from "./inputs/HoldGame";

/**
 * deep_fry (hold): hold until golden.
 * The mechanic lives in HoldGame; tune the feel here or override its hooks.
 */
export class DeepFryScene extends HoldGame {
  constructor() {
    super("mg:deep_fry", { mode: "watch", vessel: "pan", tool: null });
  }
}
