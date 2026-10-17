import { PlaceGame } from "./inputs/PlaceGame";

/**
 * stuff (place): drag filling into a shell.
 * The mechanic lives in PlaceGame; tune the feel here or override its hooks.
 */
export class StuffScene extends PlaceGame {
  constructor() {
    super("mg:stuff", { target: "bowl", radius: 40 });
  }
}
