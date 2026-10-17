import { PlaceGame } from "./inputs/PlaceGame";

/**
 * plate (place): arrange items on a plate.
 * The mechanic lives in PlaceGame; tune the feel here or override its hooks.
 */
export class PlateScene extends PlaceGame {
  constructor() {
    super("mg:plate", { target: "plate", radius: 60, subject: "dish" });
  }
}
