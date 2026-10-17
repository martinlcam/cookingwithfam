import Phaser from "phaser";
import { run, saved } from "../state/store";
import { button, go, text, PALETTE } from "../ui";

export class ResultScene extends Phaser.Scene {
  constructor() {
    super("Result");
  }

  async create() {
    this.cameras.main.fadeIn(200);
    this.scene.stop("HUD");
    const avg = run.scores.length ? run.scores.reduce((a, b) => a + b, 0) / run.scores.length : 0;
    const medal = avg >= 85 ? "GOLD" : avg >= 65 ? "SILVER" : "BRONZE";
    const face = avg >= 85 ? ":D" : avg >= 65 ? ":)" : ":|";
    await saved.recordScore(run.recipe!.name, avg);

    this.add.rectangle(180, 180, 96, 96, PALETTE.purple).setStrokeStyle(4, PALETTE.cyan);
    text(this, 180, 180, face, 24);
    text(this, 180, 270, run.recipe!.name.toUpperCase(), 10, "#6ecbf5");
    text(this, 180, 320, `${Math.round(avg)}%`, 24);
    text(this, 180, 360, medal, 14, "#c252e1");

    button(this, 180, 460, "COOK ANOTHER", () => go(this, "RecipePick"));
    button(this, 180, 520, "NEW PANTRY", () => go(this, "Title"));
  }
}
