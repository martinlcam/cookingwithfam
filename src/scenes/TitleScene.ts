import Phaser from "phaser";
import { button, go, text, PALETTE } from "../ui";
import { resetRun } from "../state/store";

export class TitleScene extends Phaser.Scene {
  constructor() {
    super("Title");
  }

  create() {
    this.cameras.main.fadeIn(200);
    resetRun();

    // Placeholder "Mama": swap for a sprite once drawn.
    this.add.rectangle(180, 200, 96, 96, PALETTE.purple).setStrokeStyle(4, PALETTE.cyan);
    text(this, 180, 200, ":)", 24);

    text(this, 180, 300, "COOKING\nWITH FAM", 20, "#c252e1");
    text(this, 180, 350, "snap your pantry, cook what you have", 7, "#6ecbf5");

    button(this, 180, 440, "TAKE PHOTOS", () => go(this, "Pantry"));
    button(this, 180, 500, "LAST PANTRY", () => go(this, "Confirm", { useSaved: true }));
  }
}
