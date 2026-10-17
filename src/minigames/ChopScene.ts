import Phaser from "phaser";
import { BaseMinigame } from "./BaseMinigame";
import { PALETTE, text } from "../ui";

/** Swipe vertically across the item N times. Reference implementation for the "swipe" input type. */
export class ChopScene extends BaseMinigame {
  private cuts = 0;
  private item!: Phaser.GameObjects.Rectangle;

  constructor() {
    super("mg:chop");
  }

  setup() {
    this.cuts = 0;
    const need = this.params.count ?? 6;
    this.add.rectangle(180, 360, 300, 140, 0x8b5a2b); // board
    this.item = this.add.rectangle(180, 350, 160, 60, PALETTE.good); // swap for item sprite
    text(this, 180, 450, this.step.item.toUpperCase(), 8);
    const counter = text(this, 180, 480, `0 / ${need}`, 8, "#6ecbf5");

    let startY = 0;
    this.input.on("pointerdown", (p: Phaser.Input.Pointer) => (startY = p.y));
    this.input.on("pointerup", (p: Phaser.Input.Pointer) => {
      const dy = p.y - startY;
      const overItem = Math.abs(p.x - 180) < 90;
      if (dy > 40 && overItem) {
        this.cuts += 1;
        counter.setText(`${this.cuts} / ${need}`);
        this.add.rectangle(p.x, 350, 3, 60, 0x1a1a1a);
        this.tweens.add({ targets: this.item, scaleY: 0.85, yoyo: true, duration: 60 });
        this.progress(this.cuts / need);
      }
    });
  }
}
