import Phaser from "phaser";
import { BaseMinigame } from "./BaseMinigame";
import { itemFrame } from "../assets/items";
import { hero, panel, text, COLOR } from "../ui";

const SCALE = 3;
const FW = 64; // hero frame size
const CX = 180;
const CY = 360;

/**
 * Swipe vertically across the item N times. Each swipe really cuts the sprite:
 * the hero image is re-split into cropped slices at every cut x and the slices
 * slide apart a few pixels so the cuts read. Reference implementation for "swipe".
 */
export class ChopScene extends BaseMinigame {
  private cuts: number[] = []; // frame-space x positions, 0..FW
  private slices: Phaser.GameObjects.Image[] = [];
  private frame = "generic";
  private knife!: Phaser.GameObjects.Image;

  constructor() {
    super("mg:chop");
  }

  setup() {
    this.cuts = [];
    this.slices = [];
    const need = this.params.count ?? 6;
    this.frame = itemFrame(this.step.item);
    panel(this, CX, 380, 310, 150, "board");
    this.add.image(CX, CY + 44, "ui", "shadow").setAlpha(0.2).setScale(3, 1.2);
    this.rebuild(false);
    this.knife = hero(this, 240, 250, "knife", 1.5).setAngle(-70).setDepth(5);
    text(this, CX, 470, this.step.item.toUpperCase(), 8, COLOR.ink);
    const counter = text(this, CX, 500, `0 / ${need}`, 8, COLOR.pink);

    let startY = 0;
    this.input.on("pointerdown", (p: Phaser.Input.Pointer) => (startY = p.y));
    this.input.on("pointermove", (p: Phaser.Input.Pointer) => {
      if (p.isDown) this.knife.setPosition(p.x + 30, p.y - 40);
    });
    this.input.on("pointerup", (p: Phaser.Input.Pointer) => {
      const dy = p.y - startY;
      const fx = Math.round((p.x - CX) / SCALE + FW / 2);
      const overItem = fx > 6 && fx < FW - 6;
      if (dy > 40 && overItem) {
        if (this.cuts.some((c) => Math.abs(c - fx) < 3)) return; // same place twice
        this.cuts.push(fx);
        this.cuts.sort((a, b) => a - b);
        counter.setText(`${this.cuts.length} / ${need}`);
        this.rebuild(true);
        this.tweens.add({ targets: this.knife, y: this.knife.y + 24, yoyo: true, duration: 50 });
        this.progress(this.cuts.length / need);
      }
    });
  }

  /** Re-create the slices from the cut list. With `animate`, slices slide out from the whole. */
  private rebuild(animate: boolean) {
    for (const s of this.slices) s.destroy();
    this.slices = [];
    const bounds = [0, ...this.cuts, FW];
    const n = bounds.length - 1;
    const gap = 2 * SCALE; // on-screen px between slices
    for (let i = 0; i < n; i++) {
      const x0 = bounds[i]!;
      const x1 = bounds[i + 1]!;
      const img = this.add.image(CX, CY, "items64", this.frame).setScale(SCALE).setDepth(2);
      img.setCrop(x0, 0, x1 - x0, FW);
      const spread = (i - (n - 1) / 2) * gap;
      if (animate) {
        this.tweens.add({ targets: img, x: CX + spread, duration: 120, ease: "Quad.easeOut" });
        this.tweens.add({ targets: img, scaleY: SCALE * 0.92, yoyo: true, duration: 70 });
      } else img.x = CX + spread;
      this.slices.push(img);
    }
  }
}
