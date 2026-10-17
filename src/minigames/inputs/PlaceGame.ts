import Phaser from "phaser";
import type { ItemFrame } from "../../assets/frames";
import { itemFrame } from "../../assets/items";
import { item, panel, text, COLOR } from "../../ui";
import { BaseMinigame } from "../BaseMinigame";

export interface PlaceConfig {
  /** Where pieces must be dropped. */
  target: ItemFrame;
  /** Drop radius in px. */
  radius?: number;
}

/**
 * Input type "place": drag params.count pieces from the tray into the target.
 * Covers form_ball, wrap, stuff, plate.
 */
export class PlaceGame extends BaseMinigame {
  private placed = 0;
  private readonly tx = 180;
  private readonly ty = 360;

  constructor(key: string, protected cfg: PlaceConfig) {
    super(key);
  }

  setup() {
    this.placed = 0;
    const need = this.params.count ?? 4;
    const r = this.cfg.radius ?? 50;
    panel(this, 180, 380, 310, 150, "board");
    item(this, this.tx, this.ty + 15, this.cfg.target, 5);
    text(this, 180, 470, "DRAG EACH ONE IN", 7, COLOR.muted);
    const counter = text(this, 180, 500, `0 / ${need}`, 8, COLOR.pink);

    for (let i = 0; i < need; i++) {
      const sx = 60 + (i % 5) * 60;
      const sy = 560 + Math.floor(i / 5) * 40;
      const piece = item(this, sx, sy, itemFrame(this.step.item), 2.5).setDepth(10).setInteractive({ useHandCursor: true, draggable: true });
      piece.on("drag", (_p: Phaser.Input.Pointer, x: number, y: number) => piece.setPosition(x, y));
      piece.on("dragend", () => {
        if (Phaser.Math.Distance.Between(piece.x, piece.y, this.tx, this.ty) < r) {
          piece.disableInteractive().setDepth(2);
          this.tweens.add({ targets: piece, x: this.tx + (Math.random() - 0.5) * 40, y: this.ty + (Math.random() - 0.5) * 20, scale: 2, duration: 120 });
          this.placed += 1;
          counter.setText(`${this.placed} / ${need}`);
          this.progress(this.placed / need);
        } else {
          this.tweens.add({ targets: piece, x: sx, y: sy, duration: 150 });
        }
      });
    }
  }
}
