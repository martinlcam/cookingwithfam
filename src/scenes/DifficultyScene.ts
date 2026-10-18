import Phaser from "phaser";
import { DIFFICULTIES, type DifficultyId } from "@shared/difficulty";
import { run, setDifficulty } from "../state/store";
import { bg, go, icon, panel, text, COLOR } from "../ui";
import { sfx } from "../sfx";

/**
 * Pick how hard the recipe plays. Shown after choosing a dish, before the kitchen.
 * Five portraits, one per level; the last choice is remembered on the device.
 */
export class DifficultyScene extends Phaser.Scene {
  constructor() {
    super("Difficulty");
  }

  create() {
    this.cameras.main.fadeIn(200);
    bg(this, "bg_tile");
    panel(this, 180, 44, 320, 56, "panel");
    text(this, 180, 36, "HOW HARD?", 13, COLOR.pink);
    text(this, 180, 58, run.recipe ? run.recipe.name.toUpperCase().slice(0, 26) : "", 6, COLOR.muted);

    DIFFICULTIES.forEach((d, i) => {
      const y = 122 + i * 92;
      const chosen = run.difficulty === d.id;
      const card = panel(this, 180, y, 330, 82, chosen ? "panel" : "card");
      card.setInteractive({ useHandCursor: true }).on("pointerup", () => this.pick(d.id));
      const face = this.add.image(50, y, `diff_${d.id}`).setScale(2);
      if (chosen) this.tweens.add({ targets: face, y: y - 4, duration: 500, yoyo: true, repeat: -1, ease: "Sine.easeInOut" });
      text(this, 92, y - 20, d.label, 9, chosen ? COLOR.pink : COLOR.ink, [0, 0.5]);
      this.add.bitmapText(92, y - 4, "mama", d.blurb, 16).setMaxWidth(200);
      text(this, 322, y - 20, `x${d.bonus} score`, 6, COLOR.muted, [1, 0.5]);
      if (chosen) icon(this, 322, y + 24, "check", 1.2);
    });
  }

  private pick(id: DifficultyId) {
    setDifficulty(id);
    sfx.play("confirm");
    run.stepIndex = 0;
    run.scores = [];
    go(this, "Kitchen");
  }
}
