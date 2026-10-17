import Phaser from "phaser";
import { sfx } from "../../sfx";

const FW = 64; // hero frame size

/**
 * A hero sprite that can be cut into pieces. Every cut re-splits the image into cropped
 * cells (vertical and horizontal cuts form a grid) and the cells drift apart a little so the
 * cuts read. Pure crop + tween: works on any static sprite.
 */
export class Cuttable {
  private vcuts: number[] = [];
  private hcuts: number[] = [];
  private cells: Phaser.GameObjects.Image[] = [];

  constructor(
    private scene: Phaser.Scene,
    public x: number,
    public y: number,
    private frame: string,
    public scale = 2,
    private depth = 2,
  ) {
    this.rebuild(false);
  }

  /** Screen (world) x/y -> frame-space coords, 0..FW. */
  toFrame(wx: number, wy: number) {
    return { fx: Math.round((wx - this.x) / this.scale + FW / 2), fy: Math.round((wy - this.y) / this.scale + FW / 2) };
  }

  /** True if a world point is over the sprite's box. */
  over(wx: number, wy: number, pad = 8) {
    const { fx, fy } = this.toFrame(wx, wy);
    return fx > -pad && fx < FW + pad && fy > -pad && fy < FW + pad;
  }

  /** Add a cut through frame-space x (vertical) or y (horizontal). Returns false if it lands on an existing cut. */
  cut(at: number, dir: "vertical" | "horizontal") {
    const list = dir === "vertical" ? this.vcuts : this.hcuts;
    at = Phaser.Math.Clamp(at, 6, FW - 6);
    if (list.some((c) => Math.abs(c - at) < 4)) return false;
    list.push(at);
    list.sort((a, b) => a - b);
    this.rebuild(true);
    sfx.play("chop");
    return true;
  }

  get pieces() {
    return (this.vcuts.length + 1) * (this.hcuts.length + 1);
  }

  /** Squash feedback on the whole thing. */
  bounce() {
    this.scene.tweens.add({ targets: this.cells, scaleY: this.scale * 0.92, yoyo: true, duration: 70 });
  }

  destroy() {
    for (const c of this.cells) c.destroy();
    this.cells = [];
  }

  private rebuild(animate: boolean) {
    this.destroy();
    const xs = [0, ...this.vcuts, FW];
    const ys = [0, ...this.hcuts, FW];
    const gap = 2 * this.scale;
    for (let j = 0; j < ys.length - 1; j++) {
      for (let i = 0; i < xs.length - 1; i++) {
        const img = this.scene.add.image(this.x, this.y, "items64", this.frame).setScale(this.scale).setDepth(this.depth);
        img.setCrop(xs[i]!, ys[j]!, xs[i + 1]! - xs[i]!, ys[j + 1]! - ys[j]!);
        const dx = (i - (xs.length - 2) / 2) * gap;
        const dy = (j - (ys.length - 2) / 2) * gap;
        if (animate) this.scene.tweens.add({ targets: img, x: this.x + dx, y: this.y + dy, duration: 120, ease: "Quad.easeOut" });
        else img.setPosition(this.x + dx, this.y + dy);
        this.cells.push(img);
      }
    }
  }
}

/**
 * Peeling: each stroke lifts a strip of skin off the sprite. The strip is a cropped copy of
 * the item that tears away and falls off the board, and the band it leaves behind is drawn
 * lighter (screen blend) so the flesh shows through. Works on any static sprite.
 */
export class Peelable {
  private taken: number[] = [];

  constructor(
    private scene: Phaser.Scene,
    private target: Phaser.GameObjects.Image,
    private fleshTint = 0x7a6a50,
  ) {}

  /** Peel a band around frame-space y (for "across" strokes) or x (for "down" strokes). */
  peel(at: number, dir: "across" | "down", width = 9) {
    at = Phaser.Math.Clamp(at, 0, FW - width);
    if (this.taken.some((t) => Math.abs(t - at) < width * 0.7)) return false;
    this.taken.push(at);
    sfx.play("peel");
    const t = this.target;
    const copy = () => this.scene.add.image(t.x, t.y, "items64", t.frame.name).setScale(t.scaleX, t.scaleY);
    // 1. the flesh left behind: same band, lightened
    const flesh = copy().setDepth(t.depth + 1).setBlendMode(Phaser.BlendModes.SCREEN).setTint(this.fleshTint).setAlpha(0);
    if (dir === "across") flesh.setCrop(0, at, FW, width);
    else flesh.setCrop(at, 0, width, FW);
    this.scene.tweens.add({ targets: flesh, alpha: 1, duration: 120 });
    // 2. the skin strip that comes off: curls up, flies to the side and drops
    const strip = copy().setDepth(t.depth + 3);
    if (dir === "across") strip.setCrop(0, at, FW, width);
    else strip.setCrop(at, 0, width, FW);
    const side = Math.random() < 0.5 ? -1 : 1;
    this.scene.tweens.add({
      targets: strip,
      x: t.x + side * (90 + Math.random() * 40),
      y: t.y + 70 + Math.random() * 30,
      angle: side * (40 + Math.random() * 50),
      scaleY: t.scaleY * 0.5,
      alpha: 0,
      duration: 550,
      ease: "Quad.easeIn",
      onComplete: () => strip.destroy(),
    });
    return true;
  }
}

/** Throw off a few bits cropped from the sprite itself (shreds, gratings, scales). */
export function shaveBits(scene: Phaser.Scene, target: Phaser.GameObjects.Image, fromX: number, fromY: number, n = 3) {
  sfx.play("shave");
  for (let i = 0; i < n; i++) {
    const w = 6 + Math.floor(Math.random() * 6);
    const h = 4 + Math.floor(Math.random() * 6);
    const cx = Phaser.Math.Clamp(Math.round((fromX - target.x) / target.scaleX + FW / 2) + Math.floor(Math.random() * 16 - 8), 8, FW - 8 - w);
    const cy = Phaser.Math.Clamp(Math.round((fromY - target.y) / target.scaleY + FW / 2) + Math.floor(Math.random() * 16 - 8), 8, FW - 8 - h);
    const bit = scene.add.image(target.x, target.y, "items64", target.frame.name).setScale(target.scaleX, target.scaleY).setDepth(target.depth + 2);
    bit.setCrop(cx, cy, w, h);
    const dx = (Math.random() - 0.5) * 120;
    scene.tweens.add({
      targets: bit,
      x: bit.x + dx,
      y: bit.y + 60 + Math.random() * 40,
      angle: (Math.random() - 0.5) * 180,
      alpha: 0,
      duration: 500 + Math.random() * 200,
      ease: "Quad.easeIn",
      onComplete: () => bit.destroy(),
    });
  }
}

/** A dashed dark line along the stroke that fades (debone, devein, score). */
export function strokeLine(scene: Phaser.Scene, x0: number, y0: number, x1: number, y1: number, color = 0x3a2118) {
  sfx.play("slice");
  const g = scene.add.graphics().setDepth(4);
  g.lineStyle(3, color, 0.8);
  const n = 8;
  for (let i = 0; i < n; i += 2) {
    g.beginPath();
    g.moveTo(x0 + ((x1 - x0) * i) / n, y0 + ((y1 - y0) * i) / n);
    g.lineTo(x0 + ((x1 - x0) * (i + 1)) / n, y0 + ((y1 - y0) * (i + 1)) / n);
    g.strokePath();
  }
  scene.tweens.add({ targets: g, alpha: 0, duration: 900, delay: 300, onComplete: () => g.destroy() });
}
