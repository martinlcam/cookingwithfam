import { PlaceGame } from "./inputs/PlaceGame";

/**
 * form_ball (place): shape rice balls or meatballs.
 * The mechanic lives in PlaceGame; tune the feel here or override its hooks.
 */
export class FormBallScene extends PlaceGame {
  constructor() {
    super("mg:form_ball", { target: "plate" });
  }
}
