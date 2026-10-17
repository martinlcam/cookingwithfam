import Phaser from "phaser";
import { icon, meter, text, view, COLOR, type Txt } from "../ui";
import { sfx } from "../sfx";

/** Persistent overlay: timer bar and score meter. Minigames talk to it via events. */
export class HUDScene extends Phaser.Scene {
  private score!: Txt;

  constructor() {
    super("HUD");
  }

  create() {
    // Pinned to the real bottom and right edges of the screen.
    const v = view(this);
    const y = v.bottom - 28;
    const timer = meter(this, 190, y, 300, 18, "fill_green");
    icon(this, 26, y, "clock", 1.5);
    this.score = text(this, v.right - 16, v.top + 20, "", 8, COLOR.pink, [1, 0.5]);

    let lastTick = -1;
    this.game.events.on("hud:timer", (fraction: number) => {
      // tick once per second during the last quarter, faster in the last tenth
      if (fraction > 0 && fraction < 0.25) {
        const slot = Math.floor(fraction * (fraction < 0.1 ? 80 : 40));
        if (slot !== lastTick) {
          lastTick = slot;
          sfx.play("tick");
        }
      } else lastTick = -1;
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
