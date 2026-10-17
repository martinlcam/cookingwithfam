import Phaser from "phaser";
import { run } from "../state/store";
import { dishSprite } from "../assets/food";
import { bg, go, icon, panel, text, COLOR } from "../ui";

export class RecipePickScene extends Phaser.Scene {
  constructor() {
    super("RecipePick");
  }

  create() {
    this.cameras.main.fadeIn(200);
    bg(this, "bg_tile");
    panel(this, 180, 40, 320, 50, "panel");
    text(this, 180, 40, "PICK A DISH", 13, COLOR.pink);
    const list = run.recipes!.recipes;
    const note = run.recipes!.note?.trim();
    // A thin-pantry note gets its own panel and the cards move down to make room.
    let first = 128;
    if (note) {
      panel(this, 180, 96, 330, 44, "panel_white");
      text(this, 180, 96, note.slice(0, 110), 6, COLOR.muted).setMaxWidth(300).setCenterAlign();
      first = 182;
    }
    // Squeeze the spacing a little rather than run off the bottom with 5 cards.
    const gap = list.length > 1 ? Math.min(108, (580 - first) / (list.length - 1)) : 108;
    list.forEach((r, i) => {
      const y = first + i * gap;
      const card = panel(this, 180, y, 330, 100, "card");
      card.setInteractive({ useHandCursor: true }).on("pointerup", () => {
        run.recipe = r;
        run.stepIndex = 0;
        run.scores = [];
        go(this, "Kitchen");
      });
      dishSprite(this, 56, y, r, 2);
      const name = r.name.toUpperCase();
      text(this, 100, y - 36, name.slice(0, 36), name.length > 25 ? 6 : 8, COLOR.pink, [0, 0.5]);
      this.add.bitmapText(100, y - 20, "mama", r.description.length > 46 ? r.description.slice(0, 44).trimEnd() + "..." : r.description, 16).setMaxWidth(205);
      text(this, 320, y + 36, `${r.steps.length} STEPS`, 6, COLOR.muted, [1, 0.5]);
      icon(this, 322, y + 6, "arrow_r", 1.2);
    });
  }
}
