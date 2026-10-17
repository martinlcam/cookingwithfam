import Phaser from "phaser";
import type { ItemFrame } from "../../assets/frames";
import { itemFrame } from "../../assets/items";
import { hero, item, panel, text, COLOR } from "../../ui";
import { BaseMinigame } from "../BaseMinigame";

export interface SwipeConfig {
  /** Sprite that follows the finger. null = bare hand. */
  tool: ItemFrame | null;
  /** Which stroke counts. */
  dir: "down" | "across" | "any";
  /** What the item sits on. */
  surface?: ItemFrame;
  /** Minimum stroke length in px. */
  minLen?: number;
}

/**
 * Input type "swipe": drag a stroke across the item N times (params.count).
 * Covers slice, mince, peel, shred, scale_fish, scissor_cut, debone, devein, spread.
 */
export class SwipeGame extends BaseMinigame {
  private strokes = 0;
  private target!: Phaser.GameObjects.Image;
  private tool?: Phaser.GameObjects.Image;

  constructor(key: string, protected cfg: SwipeConfig) {
    super(key);
  }

  setup() {
    this.strokes = 0;
    const need = this.params.count ?? 5;
    const minLen = this.cfg.minLen ?? 40;

    panel(this, 180, 380, 310, 150, "board");
    if (this.cfg.surface) item(this, 180, 380, this.cfg.surface, 5).setAlpha(0.9);
    this.target = hero(this, 180, 360, itemFrame(this.step.item), 2);
    const hint = item(this, 180, 270, this.cfg.dir === "across" ? "hint_h" : "hint_v", 2).setAlpha(0.8);
    this.tweens.add({ targets: hint, alpha: 0.3, yoyo: true, repeat: -1, duration: 500 });
    if (this.cfg.tool) this.tool = item(this, 240, 250, this.cfg.tool, 3).setAngle(-70).setDepth(5);
    text(this, 180, 470, this.step.item.toUpperCase(), 8, COLOR.ink);
    const counter = text(this, 180, 500, `0 / ${need}`, 8, COLOR.pink);

    let sx = 0;
    let sy = 0;
    this.input.on("pointerdown", (p: Phaser.Input.Pointer) => {
      sx = p.x;
      sy = p.y;
    });
    this.input.on("pointermove", (p: Phaser.Input.Pointer) => {
      if (p.isDown && this.tool) this.tool.setPosition(p.x + 30, p.y - 40);
    });
    this.input.on("pointerup", (p: Phaser.Input.Pointer) => {
      const dx = p.x - sx;
      const dy = p.y - sy;
      const over = Math.abs(p.x - 180) < 110 && Math.abs(p.y - 360) < 110;
      const ok =
        this.cfg.dir === "down" ? dy > minLen && Math.abs(dx) < dy
        : this.cfg.dir === "across" ? Math.abs(dx) > minLen && Math.abs(dy) < Math.abs(dx)
        : Math.hypot(dx, dy) > minLen;
      if (!ok || !over) return;
      this.strokes += 1;
      counter.setText(`${this.strokes} / ${need}`);
      this.onStroke(p, dx, dy);
      this.progress(this.strokes / need);
    });
  }

  /** Visual feedback per successful stroke. Override for verb-specific flair. */
  protected onStroke(p: Phaser.Input.Pointer, _dx: number, _dy: number) {
    const piece = item(this, this.target.x + 30, 360, "piece", 2).setDepth(3);
    this.tweens.add({ targets: piece, x: 300 + Math.random() * 30, y: 420, angle: 90, duration: 300, ease: "Quad.easeOut" });
    this.tweens.add({ targets: this.target, scaleY: 1.7, yoyo: true, duration: 60 });
    const ok = item(this, p.x, p.y - 20, "mark_ok", 2).setDepth(20);
    this.tweens.add({ targets: ok, y: ok.y - 30, alpha: 0, duration: 400, onComplete: () => ok.destroy() });
    if (this.cfg.dir === "down") this.add.rectangle(Phaser.Math.Clamp(p.x, 130, 230), 360, 4, 110, 0x3a2118).setDepth(2).setAlpha(0.8);
  }
}
