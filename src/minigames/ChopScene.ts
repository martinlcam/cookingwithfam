import Phaser from "phaser";
import { BaseMinigame } from "./BaseMinigame";
import { itemFrame } from "../assets/items";
import { hero, panel, text, COLOR } from "../ui";

/** Swipe vertically across the item N times. Reference implementation for the "swipe" input type. */
export class ChopScene extends BaseMinigame {
  private cuts = 0;
  private item!: Phaser.GameObjects.Image;
  private knife!: Phaser.GameObjects.Image;

  constructor() {
    super("mg:chop");
  }

  setup() {
    this.cuts = 0;
    const need = this.params.count ?? 6;
    panel(this, 180, 380, 310, 150, "board");
    this.item = hero(this, 180, 360, itemFrame(this.step.item), 2);
    this.knife = hero(this, 240, 250, "knife", 1.5).setAngle(-70).setDepth(5);
    text(this, 180, 470, this.step.item.toUpperCase(), 8, COLOR.ink);
    const counter = text(this, 180, 500, `0 / ${need}`, 8, COLOR.pink);

    let startY = 0;
    this.input.on("pointerdown", (p: Phaser.Input.Pointer) => (startY = p.y));
    this.input.on("pointermove", (p: Phaser.Input.Pointer) => {
      if (p.isDown) this.knife.setPosition(p.x + 30, p.y - 40);
    });
    this.input.on("pointerup", (p: Phaser.Input.Pointer) => {
      const dy = p.y - startY;
      const overItem = Math.abs(p.x - 180) < 90;
      if (dy > 40 && overItem) {
        this.cuts += 1;
        counter.setText(`${this.cuts} / ${need}`);
        // Cut line on the item, then a chunk pops off to the side.
        this.add.rectangle(Phaser.Math.Clamp(p.x, 130, 230), 360, 4, 110, 0x3a2118).setDepth(2).setAlpha(0.8);
        const piece = hero(this, this.item.x + 30, 360, "piece", 1).setDepth(3);
        this.tweens.add({ targets: piece, x: 300 + Math.random() * 30, y: 420, angle: 90, duration: 300, ease: "Quad.easeOut" });
        this.tweens.add({ targets: this.item, scaleY: 1.7, yoyo: true, duration: 60 });
        this.tweens.add({ targets: this.knife, y: this.knife.y + 20, yoyo: true, duration: 50 });
        this.progress(this.cuts / need);
      }
    });
  }
}
