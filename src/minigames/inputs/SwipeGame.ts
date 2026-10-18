import Phaser from "phaser";
import type { ItemFrame } from "../../assets/frames";
import { itemFrame } from "../../assets/items";
import { hero, item, text, COLOR } from "../../ui";
import { BaseMinigame } from "../BaseMinigame";
import { Cuttable, Peelable, shaveBits, strokeLine } from "./effects";

export interface SwipeConfig {
  /** Sprite that follows the finger. null = bare hand. */
  tool: ItemFrame | null;
  /** Stroke axis. "down" accepts up or down, "across" left or right, "any" anything long enough. */
  dir: "down" | "across" | "any";
  /** What the item sits on. */
  surface?: ItemFrame;
  /** Minimum stroke length in px. */
  minLen?: number;
  /** What a stroke does to the item. Defaults by verb (see effectFor). */
  effect?: "cut" | "peel" | "shave" | "line" | "spread";
}

const CX = 180;
const CY = 360;
const SCALE = 3;

/** Which visual a verb gets when the scene does not say. */
function effectFor(verb: string): NonNullable<SwipeConfig["effect"]> {
  if (/chop|slice|mince|scissor/.test(verb)) return "cut";
  if (/peel/.test(verb)) return "peel";
  if (/shred|grate|scale/.test(verb)) return "shave";
  if (/debone|devein/.test(verb)) return "line";
  if (/spread/.test(verb)) return "spread";
  return "cut";
}

/**
 * Input type "swipe": drag a stroke across the item N times (params.count).
 * Strokes count in either direction along the configured axis. Each stroke really
 * changes the item: cuts split it into pieces, peels reveal flesh, shreds throw off bits.
 * Covers slice, mince, peel, shred, scale_fish, scissor_cut, debone, devein, spread.
 */
export class SwipeGame extends BaseMinigame {
  private strokes = 0;
  private target!: Phaser.GameObjects.Image;
  private cuttable?: Cuttable;
  private peelable?: Peelable;
  private tool?: Phaser.GameObjects.Image;
  private effect: NonNullable<SwipeConfig["effect"]> = "cut";

  constructor(key: string, protected cfg: SwipeConfig) {
    super(key);
  }

  setup() {
    this.strokes = 0;
    const need = this.params.count ?? 5;
    // harder levels want longer, more deliberate strokes
    const minLen = Math.min(120, (this.cfg.minLen ?? 40) / this.difficulty.tolerance);
    this.effect = this.cfg.effect ?? effectFor(this.step.verb);
    const frame = itemFrame(this.step.item);

    // the big hand-pixelled board, 158x70 at 2x
    this.add.image(CX, 380, "ui", "board_big").setScale(2);
    if (this.cfg.surface && this.cfg.surface !== "cutting_board") item(this, CX, 380, this.cfg.surface, 5).setAlpha(0.9);
    this.add.image(CX, CY + 44, "ui", "shadow").setAlpha(0.2).setScale(3, 1.2);
    if (this.effect === "cut") {
      this.cuttable = new Cuttable(this, CX, CY, frame, SCALE);
      // keep a hidden stand-in so the hit test and bits have a sprite to measure against
      this.target = hero(this, CX, CY, frame, SCALE).setVisible(false);
    } else {
      this.target = hero(this, CX, CY, frame, SCALE);
      if (this.effect === "peel") this.peelable = new Peelable(this, this.target);
    }
    const hint = item(this, CX, 270, this.cfg.dir === "across" ? "hint_h" : "hint_v", 2).setAlpha(0.8);
    this.tweens.add({ targets: hint, alpha: 0.3, yoyo: true, repeat: -1, duration: 500 });
    if (this.cfg.tool) this.tool = hero(this, 240, 250, this.cfg.tool, 1.5).setAngle(-70).setDepth(5);
    text(this, CX, 470, this.step.item.toUpperCase(), 8, COLOR.ink);
    const counter = text(this, CX, 500, `0 / ${need}`, 8, COLOR.pink);

    let sx = 0;
    let sy = 0;
    this.input.on("pointerdown", (p: Phaser.Input.Pointer) => {
      sx = p.worldX;
      sy = p.worldY;
    });
    this.input.on("pointermove", (p: Phaser.Input.Pointer) => {
      if (p.isDown && this.tool) this.tool.setPosition(p.worldX + 30, p.worldY - 40);
    });
    this.input.on("pointerup", (p: Phaser.Input.Pointer) => {
      const dx = p.worldX - sx;
      const dy = p.worldY - sy;
      // the stroke must pass over the item: test its midpoint, generously
      const mx = (sx + p.worldX) / 2;
      const my = (sy + p.worldY) / 2;
      const over = Math.abs(mx - CX) < 120 && Math.abs(my - CY) < 120;
      const ok =
        this.cfg.dir === "down" ? Math.abs(dy) > minLen && Math.abs(dy) >= Math.abs(dx)
        : this.cfg.dir === "across" ? Math.abs(dx) > minLen && Math.abs(dx) >= Math.abs(dy)
        : Math.hypot(dx, dy) > minLen;
      if (!ok || !over) return;
      if (!this.apply(sx, sy, p.worldX, p.worldY)) return; // e.g. cut on top of an existing cut
      this.strokes += 1;
      counter.setText(`${this.strokes} / ${need}`);
      const mark = item(this, p.worldX, p.worldY - 20, "mark_ok", 2).setDepth(20);
      this.tweens.add({ targets: mark, y: mark.y - 30, alpha: 0, duration: 400, onComplete: () => mark.destroy() });
      if (this.tool) this.tweens.add({ targets: this.tool, y: this.tool.y + 20, yoyo: true, duration: 50 });
      this.onStroke(p, dx, dy);
      this.progress(this.strokes / need);
    });
  }

  /** Change the item for one stroke. Returns false if the stroke did nothing (so it doesn't count). */
  private apply(x0: number, y0: number, x1: number, y1: number): boolean {
    const mx = (x0 + x1) / 2;
    const my = (y0 + y1) / 2;
    const across = this.cfg.dir === "across" || (this.cfg.dir === "any" && Math.abs(x1 - x0) > Math.abs(y1 - y0));
    const f = { fx: Math.round((mx - CX) / SCALE + 32), fy: Math.round((my - CY) / SCALE + 32) };
    switch (this.effect) {
      case "cut": {
        const done = this.cuttable!.cut(across ? f.fy : f.fx, across ? "horizontal" : "vertical");
        if (done) this.cuttable!.bounce();
        return done;
      }
      case "peel":
        this.peelable!.peel(across ? f.fy : f.fx, across ? "across" : "down");
        return true;
      case "shave":
        shaveBits(this, this.target, mx, my, 4);
        this.tweens.add({ targets: this.target, scaleX: SCALE * 0.95, yoyo: true, duration: 60 });
        return true;
      case "line":
        strokeLine(this, x0, y0, x1, y1);
        return true;
      case "spread":
        strokeLine(this, x0, y0, x1, y1, 0xffd93d);
        return true;
    }
  }

  /** Extra verb-specific flair after a counted stroke. Override in a scene if wanted. */
  protected onStroke(_p: Phaser.Input.Pointer, _dx: number, _dy: number) {}
}
