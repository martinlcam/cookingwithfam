import type Phaser from "phaser";
import type { ItemFrame } from "../../assets/frames";
import { itemFrame } from "../../assets/items";
import { hero, item, meter, panel, text, COLOR } from "../../ui";
import { sfx } from "../../sfx";
import { BaseMinigame } from "../BaseMinigame";

export interface HoldConfig {
  /** hold: the meter fills while the finger is down, release on the line.
   *  watch: the meter fills by itself, tap when it reaches the line. */
  mode: "hold" | "watch";
  vessel: ItemFrame;
  tool: ItemFrame | null;
  /** How close to the target counts as perfect. */
  tolerance?: number;
}

/**
 * Input type "hold": one-shot timing against a fill meter. params.target is
 * the line (0..1); in watch mode params.seconds sets how long the fill takes.
 * Covers pour, squeeze, simmer, boil, deep_fry, microwave, bake.
 */
export class HoldGame extends BaseMinigame {
  private fill = 0;
  private holding = false;
  private fired = false;
  private bar!: ReturnType<typeof meter>;
  private contents!: Phaser.GameObjects.Image;
  private flame?: Phaser.GameObjects.Image;
  private flameIdx = 0;
  private stopLoop = () => {};

  constructor(key: string, protected cfg: HoldConfig) {
    super(key);
  }

  setup() {
    this.fill = 0;
    this.holding = false;
    this.fired = false;
    const target = this.params.target ?? (this.cfg.mode === "watch" ? 0.85 : 0.7);

    panel(this, 180, 380, 310, 150, "board");
    if (this.cfg.mode === "watch") {
      item(this, 180, 410, "stove", 5).setDepth(0);
      this.flame = item(this, 180, 400, "flame_0", 3).setDepth(0.5);
      this.time.addEvent({ delay: 120, loop: true, callback: () => this.flame?.setFrame(`flame_${(this.flameIdx = (this.flameIdx + 1) % 3)}`) });
    }
    item(this, 180, 385, this.cfg.vessel, 5).setDepth(1);
    this.contents = hero(this, 180, 365, itemFrame(this.step.item), 1.2).setDepth(2);
    if (this.cfg.tool) item(this, 120, 290, this.cfg.tool, 3).setAngle(this.cfg.mode === "hold" ? 40 : 0).setDepth(2);

    this.bar = meter(this, 180, 520, 280, 18, this.cfg.mode === "watch" ? "fill_red" : "fill_blue");
    this.bar.set(0);
    this.add.rectangle(180 - 140 + 280 * target, 520, 3, 26, 0x3a2118).setDepth(3);
    text(this, 180, 470, this.cfg.mode === "hold" ? "HOLD, RELEASE AT THE LINE" : "TAP WHEN IT REACHES THE LINE", 7, COLOR.muted);

    // Watch mode cooks on its own: the pan sizzles or the pot bubbles until the player taps.
    if (this.cfg.mode === "watch") this.stopLoop = this.loop(this.cfg.vessel === "pan" ? "sizzle" : "boil");

    this.input.on("pointerdown", () => {
      if (this.cfg.mode === "hold") {
        this.holding = true;
        sfx.play("pour");
      } else this.release(target);
    });
    this.input.on("pointerup", () => {
      if (this.cfg.mode === "hold" && this.holding) this.release(target);
    });
  }

  override update(t: number, dt: number) {
    super.update(t, dt);
    if (this.fired || !this.bar) return;
    const rate = this.cfg.mode === "watch" ? 1 / Math.max(2, this.seconds * 0.8) : 0.5;
    if (this.cfg.mode === "watch" || this.holding) this.fill = Math.min(1.2, this.fill + (rate * dt) / 1000);
    this.bar.set(this.fill);
    this.contents.setScale(1.2 + this.fill * 0.4);
    if (this.fill >= 1.2) this.release(this.params.target ?? 0.85); // overflowed / burnt
  }

  private release(target: number) {
    if (this.fired) return;
    this.fired = true;
    this.holding = false;
    this.stopLoop();
    const diff = Math.abs(this.fill - target);
    const tol = this.cfg.tolerance ?? 0.06;
    const result = diff <= tol ? 1 : Math.max(0, 1 - (diff - tol) * 3);
    if (result < 1) this.cameras.main.shake(120, 0.006);
    sfx.play(result === 1 ? "ok" : "miss");
    this.progress(result);
    if (result < 1) this.finish();
  }
}
