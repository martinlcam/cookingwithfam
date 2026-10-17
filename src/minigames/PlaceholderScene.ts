import { BaseMinigame } from "./BaseMinigame";
import { itemFrame } from "../assets/items";
import { hero, panel, text, COLOR } from "../ui";

/**
 * Stand-in for any verb without its own scene yet: tap the item N times.
 * Keeps every generated recipe playable while real minigames are built.
 */
export class PlaceholderScene extends BaseMinigame {
  private taps = 0;

  constructor() {
    super("mg:placeholder");
  }

  setup() {
    this.taps = 0;
    const need = this.params.count ?? this.params.rotations ?? Math.ceil(this.params.seconds ?? 5);
    const target = hero(this, 180, 330, itemFrame(this.step.item), 2);
    this.add.image(180, 400, "ui", "shadow").setAlpha(0.25).setScale(2, 1);
    panel(this, 180, 470, 260, 50, "card");
    text(this, 180, 462, this.step.verb.toUpperCase().replace(/_/g, " "), 9, COLOR.pink);
    text(this, 180, 482, `tap x${need}`, 6, COLOR.muted);

    target.setInteractive({ useHandCursor: true }).on("pointerdown", () => {
      this.taps += 1;
      this.tweens.add({ targets: target, scale: 1.75, yoyo: true, duration: 50 });
      this.progress(this.taps / need);
    });
  }
}
