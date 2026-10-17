import Phaser from "phaser";
import type { Step } from "@shared/schema";
import { VERB_BY_NAME } from "@shared/verbs";
import { text } from "../ui";

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
    text(this, 180, 30, this.step.caption.toUpperCase(), 9, "#c252e1");
    this.setup();
  }

  abstract setup(): void;

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
    text(this, 180, 320, s >= 85 ? "PERFECT!" : s >= 60 ? "GOOD" : "HMM...", 16, s >= 60 ? "#7bd88f" : "#e06c75");
    this.time.delayedCall(700, () => {
      this.scene.wake("Kitchen", { score: s });
      this.scene.stop();
    });
  }
}
