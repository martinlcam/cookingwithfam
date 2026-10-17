import Phaser from "phaser";
import { run } from "../state/store";
import { dishFrame } from "../assets/food";
import { bg, food, go, icon, panel, text, COLOR } from "../ui";

export class RecipePickScene extends Phaser.Scene {
  constructor() {
    super("RecipePick");
  }

  create() {
    this.cameras.main.fadeIn(200);
    bg(this, "bg_tile");
    panel(this, 180, 40, 320, 50, "panel");
    text(this, 180, 40, "PICK A DISH", 13, COLOR.pink);
    run.recipes!.recipes.forEach((r, i) => {
      const y = 128 + i * 108;
      const card = panel(this, 180, y, 330, 100, "card");
      card.setInteractive({ useHandCursor: true }).on("pointerup", () => {
        run.recipe = r;
        run.stepIndex = 0;
        run.scores = [];
        go(this, "Kitchen");
      });
      food(this, 56, y, dishFrame(r), 2);
      text(this, 100, y - 36, r.name.toUpperCase().slice(0, 26), 8, COLOR.pink, [0, 0.5]);
      this.add.bitmapText(100, y - 20, "mama", r.description.length > 46 ? r.description.slice(0, 44).trimEnd() + "..." : r.description, 16).setMaxWidth(205);
      text(this, 320, y + 36, `${r.steps.length} STEPS`, 6, COLOR.muted, [1, 0.5]);
      icon(this, 322, y + 6, "arrow_r", 1.2);
    });
  }
}
