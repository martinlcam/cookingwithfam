import Phaser from "phaser";
import { run, saved } from "../state/store";
import { dishFrame } from "../assets/food";
import { bg, button, food, go, icon, item, panel, text, COLOR } from "../ui";

export class ResultScene extends Phaser.Scene {
  constructor() {
    super("Result");
  }

  async create() {
    this.cameras.main.fadeIn(200);
    this.scene.stop("HUD");
    bg(this, "bg_tile");
    const avg = run.scores.length ? run.scores.reduce((a, b) => a + b, 0) / run.scores.length : 0;
    const medal = avg >= 85 ? "GOLD" : avg >= 65 ? "SILVER" : "BRONZE";
    const medalFrame = avg >= 85 ? "medal_gold" : avg >= 65 ? "medal_silver" : "medal_bronze";
    const stars = avg >= 85 ? 3 : avg >= 65 ? 2 : 1;
    await saved.recordScore(run.recipe!.name, avg);

    panel(this, 180, 200, 300, 300, "panel");
    const dish = food(this, 180, 160, dishFrame(run.recipe!), 3);
    for (let i = 0; i < 3; i++) {
      const steam = item(this, 160 + i * 20, 110 - i * 6, "steam", 1.5).setAlpha(0.7);
      this.tweens.add({ targets: steam, y: steam.y - 20, alpha: 0, duration: 1400 + i * 300, repeat: -1, delay: i * 200 });
    }
    text(this, 180, 240, run.recipe!.name.toUpperCase().slice(0, 26), 9, COLOR.pink);
    for (let i = 0; i < 3; i++) {
      const s = icon(this, 140 + i * 40, 290, i < stars ? "star_big" : "star", i < stars ? 1.2 : 1);
      if (i < stars) {
        s.setScale(0);
        this.tweens.add({ targets: s, scale: 1.2, duration: 300, delay: 300 + i * 200, ease: "Back.easeOut" });
      } else s.setFrame("star_off");
    }
    text(this, 180, 332, `${Math.round(avg)}%`, 20);

    panel(this, 180, 410, 220, 70, "card");
    icon(this, 110, 410, medalFrame, 1.6);
    text(this, 195, 410, medal, 14, COLOR.pink);
    this.tweens.add({ targets: dish, scale: 3.25, duration: 800, yoyo: true, repeat: -1, ease: "Sine.easeInOut" });

    button(this, 180, 500, "COOK ANOTHER", () => go(this, "RecipePick"), 260, 48, "pink", "arrow_r");
    button(this, 180, 560, "NEW PANTRY", () => go(this, "Title"), 260, 48, "blue", "camera");
  }
}
