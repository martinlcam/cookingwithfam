import Phaser from "phaser";
import type { Step } from "@shared/schema";
import { VERB_BY_NAME } from "@shared/verbs";
import { dishSprite } from "../assets/food";
import { run } from "../state/store";
import { bg, floor, icon, panel, text, COLOR } from "../ui";

/**
 * Every minigame extends this. It owns the countdown, the progress-to-score
 * mapping, the HUD events, and handing control back to the Kitchen scene.
 * Subclasses implement `setup()` and call `progress(fraction)` as the player
 * does the thing; `finish()` fires automatically at 1.0 or when time runs out.
 */
export abstract class BaseMinigame extends Phaser.Scene {
  protected step!: Step;
  protected params!: Record<string, number>;
  protected seconds = 10;
  private elapsed = 0;
  private done = false;
  private frac = 0;

  init(data: { step: Step }) {
    this.step = data.step;
    this.params = { ...VERB_BY_NAME[data.step.verb]?.params, ...data.step.params };
    this.seconds = this.params.seconds ?? 10;
    this.elapsed = 0;
    this.done = false;
    this.frac = 0;
  }

  create() {
    this.game.events.emit("hud:reset");
    bg(this, "bg_tile");
    floor(this, 364);
    panel(this, 180, 34, 320, 44, "bubble");
    text(this, 180, 34, this.step.caption.toUpperCase(), 9, COLOR.pink);
    this.setup();
  }

  abstract setup(): void;

  /**
   * The recipe's finished dish, for verbs that build the final plate (plate, sprinkle,
   * season, stuff, wrap, form_ball). Reads run.recipe.dish; a scene launched without a
   * run falls back to keyword matching on the step item. `scale` is per 32px frame.
   */
  protected dish(x: number, y: number, scale = 3) {
    const recipe = run.recipe ?? { name: this.step.item, ingredients: [this.step.item] };
    return dishSprite(this, x, y, recipe, scale);
  }

  /** Report how far along the task is, 0..1. */
  protected progress(fraction: number) {
    this.frac = Phaser.Math.Clamp(fraction, 0, 1);
    this.game.events.emit("hud:score", this.frac * 100);
    if (this.frac >= 1) this.finish();
  }

  update(_t: number, dt: number) {
    if (this.done) return;
    this.elapsed += dt / 1000;
    this.game.events.emit("hud:timer", 1 - this.elapsed / this.seconds);
    if (this.elapsed >= this.seconds) this.finish();
  }

  /** Score = progress, with a small bonus for finishing fast. Subclasses may override. */
  protected score(): number {
    const speed = this.frac >= 1 ? Math.max(0, 1 - this.elapsed / this.seconds) * 15 : 0;
    return Math.min(100, this.frac * 85 + speed);
  }

  protected finish() {
    if (this.done) return;
    this.done = true;
    const s = this.score();
    const good = s >= 60;
    panel(this, 180, 320, 240, 70, "panel").setDepth(50);
    text(this, 180, 320, s >= 85 ? "PERFECT!" : good ? "GOOD" : "HMM...", 16, good ? COLOR.green : COLOR.pink).setDepth(51);
    if (s >= 85) {
      for (let i = 0; i < 6; i++) {
        const sp = icon(this, 80 + Math.random() * 200, 290 + Math.random() * 60, "sparkle", 2).setDepth(52);
        this.tweens.add({ targets: sp, scale: 0, y: sp.y - 30, duration: 500, delay: i * 60 });
      }
    }
    this.time.delayedCall(700, () => {
      this.scene.wake("Kitchen", { score: s });
      this.scene.stop();
    });
  }
}
