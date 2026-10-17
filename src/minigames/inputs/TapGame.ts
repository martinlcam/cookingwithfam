import Phaser from "phaser";
import type { ItemFrame } from "../../assets/frames";
import { itemFrame } from "../../assets/items";
import { hero, icon, item, meter, panel, text, COLOR } from "../../ui";
import { sfx } from "../../sfx";
import { BaseMinigame } from "../BaseMinigame";

export interface TapConfig {
  tool: ItemFrame | null;
  vessel: ItemFrame;
  /** Sweet-spot width as a fraction of the meter. */
  zone?: number;
  /** Marker speed in meter-widths per second. */
  speed?: number;
  /** What sits on the vessel: the step item (default) or the recipe's finished dish.
   *  In dish mode the step item becomes the shaker/tool when we have a sprite for it. */
  subject?: "item" | "dish";
}

/**
 * Input type "tap": a marker sweeps back and forth across a meter; tap while
 * it's in the sweet spot. params.count hits to finish. A miss costs nothing
 * but time. Covers flip, fry_flip, crack_egg, pierce, skewer, sprinkle, season.
 */
export class TapGame extends BaseMinigame {
  private hits = 0;
  private pos = 0;
  private dir = 1;
  private marker!: Phaser.GameObjects.Image;
  private target!: Phaser.GameObjects.Image;
  private readonly mx = 180;
  private readonly my = 520;
  private readonly mw = 280;

  constructor(key: string, protected cfg: TapConfig) {
    super(key);
  }

  setup() {
    this.hits = 0;
    this.pos = 0;
    this.dir = 1;
    const need = this.params.count ?? 3;
    const zone = this.cfg.zone ?? 0.22;

    panel(this, 180, 380, 310, 150, "board");
    item(this, 180, 380, this.cfg.vessel, 5);
    const frame = itemFrame(this.step.item);
    let tool = this.cfg.tool;
    if (this.cfg.subject === "dish") {
      this.target = this.dish(180, 355, 3).setDepth(1);
      if (frame !== "generic" && frame !== this.cfg.vessel) tool = frame;
    } else {
      this.target = hero(this, 180, 355, frame, 1.5).setDepth(1);
    }
    if (tool) item(this, 250, 300, tool, 3).setAngle(-30).setDepth(2);

    const m = meter(this, this.mx, this.my, this.mw, 18, "fill_yellow");
    m.set(1);
    const zx = this.mx - this.mw / 2 + this.mw * (0.5 - zone / 2);
    this.add.rectangle(zx, this.my, this.mw * zone, 12, 0x6fcf5a).setOrigin(0, 0.5).setDepth(2);
    this.marker = icon(this, this.mx, this.my, "sweet_spot", 2).setDepth(3);
    text(this, 180, 470, "TAP IN THE GREEN", 7, COLOR.muted);
    const counter = text(this, 180, 490, `0 / ${need}`, 8, COLOR.pink);

    this.input.on("pointerdown", () => {
      const inZone = Math.abs(this.pos - 0.5) < zone / 2;
      if (inZone) {
        this.hits += 1;
        counter.setText(`${this.hits} / ${need}`);
        this.onHit();
        this.progress(this.hits / need);
      } else {
        this.cameras.main.shake(80, 0.004);
        this.flash("mark_miss");
      }
    });
  }

  override update(t: number, dt: number) {
    super.update(t, dt);
    if (!this.marker) return;
    const speed = (this.cfg.speed ?? 0.9) + this.hits * 0.15;
    this.pos += (this.dir * speed * dt) / 1000;
    if (this.pos > 1) {
      this.pos = 1;
      this.dir = -1;
    } else if (this.pos < 0) {
      this.pos = 0;
      this.dir = 1;
    }
    this.marker.x = this.mx - this.mw / 2 + this.mw * this.pos;
  }

  private flash(frame: "mark_ok" | "mark_miss") {
    sfx.play(frame === "mark_ok" ? "ok" : "miss");
    const m = item(this, this.marker.x, this.my - 30, frame, 2).setDepth(20);
    this.tweens.add({ targets: m, y: m.y - 25, alpha: 0, duration: 400, onComplete: () => m.destroy() });
  }

  /** Feedback on a successful tap. Override per verb. */
  protected onHit() {
    this.flash("mark_ok");
    this.tweens.add({ targets: this.target, y: this.target.y - 50, angle: 180, yoyo: true, duration: 180, ease: "Quad.easeOut" });
  }
}
