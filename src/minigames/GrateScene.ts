import { CircularGame } from "./inputs/CircularGame";

/**
 * grate (circular): up and down on a grater.
 * The mechanic lives in CircularGame; tune the feel here or override its hooks.
 */
export class GrateScene extends CircularGame {
  constructor() {
    super("mg:grate", { tool: "grater", vessel: "bowl" });
  }
}
