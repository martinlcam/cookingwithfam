import Phaser from "phaser";
import type { ItemFrame } from "../../assets/frames";
import { itemFrame } from "../../assets/items";
import { item, panel, text, COLOR } from "../../ui";
import { BaseMinigame } from "../BaseMinigame";

export interface CircularConfig {
  /** Sprite that orbits with the finger. null = bare hand. */
  tool: ItemFrame | null;
  /** Bowl, pot, board... drawn under the item. */
  vessel: ItemFrame;
  /** Orbit radius in px. */
  radius?: number;
}

/**
 * Input type "circular": drag in circles around the vessel. Progress is
 * accumulated angle / (2π · params.rotations). Direction doesn't matter.
 * Covers stir, mix, knead, whisk, grate, grind, mash, roll_dough, roll_sushi.
 */
export class CircularGame extends BaseMinigame {
  private acc = 0;
  private last: number | null = null;
  private tool?: Phaser.GameObjects.Image;
  private contents!: Phaser.GameObjects.Image;
  protected readonly cx = 180;
  protected readonly cy = 370;

  constructor(key: string, protected cfg: CircularConfig) {
    super(key);
  }

  setup() {
    this.acc = 0;
    this.last = null;
    const need = (this.params.rotations ?? 6) * Math.PI * 2;
    const r = this.cfg.radius ?? 48;

    panel(this, 180, 380, 310, 150, "board");
    item(this, this.cx, this.cy + 10, this.cfg.vessel, 5);
    this.contents = item(this, this.cx, this.cy - 6, itemFrame(this.step.item), 2.5).setDepth(1);
    if (this.cfg.tool) this.tool = item(this, this.cx + r, this.cy, this.cfg.tool, 3).setDepth(5);
    const hint = item(this, this.cx, this.cy, "hint_circle", 2).setAlpha(0.7).setDepth(4);
    this.tweens.add({ targets: hint, angle: 360, repeat: -1, duration: 1600 });
    text(this, 180, 470, "DRAG IN CIRCLES", 7, COLOR.muted);
    const counter = text(this, 180, 500, `0 / ${this.params.rotations ?? 6}`, 8, COLOR.pink);

    this.input.on("pointerdown", (p: Phaser.Input.Pointer) => (this.last = this.angle(p)));
    this.input.on("pointerup", () => (this.last = null));
    this.input.on("pointermove", (p: Phaser.Input.Pointer) => {
      if (!p.isDown || this.last === null) return;
      const a = this.angle(p);
      const d = Phaser.Math.Angle.Wrap(a - this.last);
      this.last = a;
      if (Math.abs(d) > 0.8) return; // teleport, ignore
      this.acc += Math.abs(d);
      hint.setAlpha(Math.max(0, 0.7 - this.acc / need));
      this.tool?.setPosition(this.cx + Math.cos(a) * r, this.cy + Math.sin(a) * r);
      this.contents.setAngle(this.contents.angle + Phaser.Math.RadToDeg(d) * 0.3);
      counter.setText(`${Math.floor(this.acc / (Math.PI * 2))} / ${this.params.rotations ?? 6}`);
      this.progress(this.acc / need);
    });
  }

  private angle(p: Phaser.Input.Pointer) {
    return Math.atan2(p.worldY - this.cy, p.worldX - this.cx);
  }
}
