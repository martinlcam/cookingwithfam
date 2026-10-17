import { PlaceGame } from "./inputs/PlaceGame";

/**
 * wrap (place): fold dumplings.
 * The mechanic lives in PlaceGame; tune the feel here or override its hooks.
 */
export class WrapScene extends PlaceGame {
  constructor() {
    super("mg:wrap", { target: "plate", radius: 40, subject: "dish" });
  }
}
