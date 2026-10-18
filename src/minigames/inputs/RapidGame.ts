import type { ItemFrame } from "../../assets/frames";
import { itemFrame } from "../../assets/items";
import { item, meter, panel, text, COLOR } from "../../ui";
import { sfx } from "../../sfx";
import { BaseMinigame } from "../BaseMinigame";

export interface RapidConfig {
  vessel: ItemFrame;
  /** Overlay that fades as you win: steam for cooling, smoke for fanning. */
  fx: "steam" | "smoke";
}

/**
 * Input type "rapid": mash the screen. params.count taps, but progress decays
 * while idle so it has to be a burst. Stand-in for the DS mic blow.
 * Covers blow, cool, fan_grill.
 */
export class RapidGame extends BaseMinigame {
  private heat = 0;
  private bar!: ReturnType<typeof meter>;
  private fx: Phaser.GameObjects.Image[] = [];

  constructor(key: string, protected cfg: RapidConfig) {
    super(key);
  }

  setup() {
    this.heat = 0;
    const need = this.params.count ?? 12;
    panel(this, 180, 380, 310, 150, "board");
    item(this, 180, 390, this.cfg.vessel, 5);
    item(this, 180, 372, itemFrame(this.step.item), 3).setDepth(1);
    this.fx = [0, 1, 2].map((i) => item(this, 150 + i * 30, 330 - (i % 2) * 15, this.cfg.fx, 3).setDepth(2).setAlpha(0.9));
    this.bar = meter(this, 180, 520, 280, 18, "fill_blue");
    text(this, 180, 470, "TAP FAST!", 8, COLOR.muted);

    this.input.on("pointerdown", () => {
      sfx.play("bubble");
      this.heat = Math.min(1, this.heat + 1 / need);
      this.bar.set(this.heat);
      this.fx.forEach((f) => f.setAlpha(0.9 * (1 - this.heat)));
      this.progress(this.heat);
    });
  }

  override update(t: number, dt: number) {
    super.update(t, dt);
    if (!this.bar || this.heat >= 1) return;
    this.heat = Math.max(0, this.heat - (0.12 * this.difficulty.speed * dt) / 1000);
    this.bar.set(this.heat);
  }
}
