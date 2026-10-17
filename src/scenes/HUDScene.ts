import Phaser from "phaser";
import { icon, meter, text, COLOR, type Txt } from "../ui";

/** Persistent overlay: timer bar and score meter. Minigames talk to it via events. */
export class HUDScene extends Phaser.Scene {
  private score!: Txt;

  constructor() {
    super("HUD");
  }

  create() {
    const timer = meter(this, 190, 612, 300, 18, "fill_green");
    icon(this, 26, 612, "clock", 1.5);
    this.score = text(this, 344, 20, "", 8, COLOR.pink, [1, 0.5]);

    this.game.events.on("hud:timer", (fraction: number) => {
      timer.set(fraction);
      timer.setFill(fraction > 0.5 ? "fill_green" : fraction > 0.25 ? "fill_yellow" : "fill_red");
    });
    this.game.events.on("hud:score", (s: number) => this.score.setText(`${Math.round(s)}%`));
    this.game.events.on("hud:reset", () => {
      timer.set(1);
      timer.setFill("fill_green");
      this.score.setText("");
    });
  }
}
