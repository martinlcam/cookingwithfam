import Phaser from "phaser";
import type { ItemFrame } from "../../assets/frames";
import { itemFrame } from "../../assets/items";
import { item, panel, text, COLOR } from "../../ui";
import { sfx } from "../../sfx";
import { BaseMinigame } from "../BaseMinigame";

export interface TiltConfig {
  vessel: ItemFrame;
  /** up: fast upward flick (toss). side: fast horizontal flick (tip, shake). */
  axis: "up" | "side";
}

/**
 * Input type "tilt": quick flicks of the whole pan. params.count flicks.
 * On a phone this is a fast swipe; device-motion can be wired in later.
 * Covers toss, tip_pan, strain.
 */
export class TiltGame extends BaseMinigame {
  private flicks = 0;
  private vessel!: Phaser.GameObjects.Image;
  private bits: Phaser.GameObjects.Image[] = [];

  constructor(key: string, protected cfg: TiltConfig) {
    super(key);
  }

  setup() {
    this.flicks = 0;
    const need = this.params.count ?? 4;
    panel(this, 180, 380, 310, 150, "board");
    this.vessel = item(this, 180, 390, this.cfg.vessel, 5);
    this.bits = [0, 1, 2].map((i) => item(this, 160 + i * 20, 370, itemFrame(this.step.item), 2).setDepth(1));
    text(this, 180, 470, this.cfg.axis === "up" ? "FLICK UP FAST" : "FLICK SIDEWAYS", 7, COLOR.muted);
    const counter = text(this, 180, 500, `0 / ${need}`, 8, COLOR.pink);

    let sx = 0, sy = 0, st = 0;
    this.input.on("pointerdown", (p: Phaser.Input.Pointer) => {
      sx = p.worldX; sy = p.worldY; st = p.downTime;
    });
    this.input.on("pointerup", (p: Phaser.Input.Pointer) => {
      const dx = p.worldX - sx, dy = p.worldY - sy, ms = p.upTime - st;
      const fast = ms < 350;
      const ok = this.cfg.axis === "up" ? dy < -60 && fast : Math.abs(dx) > 60 && fast;
      if (!ok) return;
      this.flicks += 1;
      sfx.play(this.cfg.axis === "up" ? "flip" : "splash");
      counter.setText(`${this.flicks} / ${need}`);
      const k = this.cfg.axis === "up" ? { y: this.vessel.y - 30 } : { x: this.vessel.x + Math.sign(dx) * 30, angle: Math.sign(dx) * 15 };
      this.tweens.add({ targets: this.vessel, ...k, yoyo: true, duration: 120 });
      this.bits.forEach((b, i) =>
        this.tweens.add({ targets: b, y: b.y - 70 - i * 10, angle: 360, yoyo: true, duration: 260, delay: i * 30, ease: "Quad.easeOut" }),
      );
      this.progress(this.flicks / need);
    });
  }
}
