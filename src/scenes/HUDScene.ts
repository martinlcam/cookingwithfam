import Phaser from "phaser";
import { text, PALETTE } from "../ui";

/** Persistent overlay: timer bar and score meter. Minigames talk to it via events. */
export class HUDScene extends Phaser.Scene {
  private timer!: Phaser.GameObjects.Rectangle;
  private score!: Phaser.GameObjects.Text;

  constructor() {
    super("HUD");
  }

  create() {
    this.add.rectangle(180, 610, 320, 10, PALETTE.dark).setStrokeStyle(2, PALETTE.cyan);
    this.timer = this.add.rectangle(20, 610, 320, 10, PALETTE.purple).setOrigin(0, 0.5);
    this.score = text(this, 340, 20, "", 8, "#6ecbf5", [1, 0.5]);

    this.game.events.on("hud:timer", (fraction: number) => this.timer.setSize(320 * fraction, 10));
    this.game.events.on("hud:score", (s: number) => this.score.setText(`${Math.round(s)}%`));
    this.game.events.on("hud:reset", () => {
      this.timer.setSize(320, 10);
      this.score.setText("");
    });
  }
}
