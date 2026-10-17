import Phaser from "phaser";
import { run } from "../state/store";
import { go, text, PALETTE } from "../ui";

export class RecipePickScene extends Phaser.Scene {
  constructor() {
    super("RecipePick");
  }

  create() {
    this.cameras.main.fadeIn(200);
    text(this, 180, 40, "PICK A DISH", 14, "#c252e1");
    run.recipes!.recipes.forEach((r, i) => {
      const y = 110 + i * 100;
      const card = this.add.rectangle(180, y, 320, 88, PALETTE.dark).setStrokeStyle(3, PALETTE.purple);
      card.setInteractive({ useHandCursor: true }).on("pointerup", () => {
        run.recipe = r;
        run.stepIndex = 0;
        run.scores = [];
        go(this, "Kitchen");
      });
      text(this, 180, y - 24, r.name.toUpperCase(), 9, "#6ecbf5");
      text(this, 180, y + 2, r.description, 6);
      text(this, 180, y + 30, `${r.steps.length} steps`, 6, "#c252e1");
    });
  }
}
