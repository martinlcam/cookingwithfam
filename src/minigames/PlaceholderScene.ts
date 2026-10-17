import { BaseMinigame } from "./BaseMinigame";
import { PALETTE, text } from "../ui";

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
    const target = this.add.rectangle(180, 350, 120, 120, PALETTE.purple).setStrokeStyle(4, PALETTE.cyan);
    text(this, 180, 350, this.step.verb.toUpperCase(), 8);
    text(this, 180, 450, `${this.step.item}  (tap x${need})`, 7, "#6ecbf5");

    target.setInteractive().on("pointerdown", () => {
      this.taps += 1;
      this.tweens.add({ targets: target, scale: 0.9, yoyo: true, duration: 50 });
      this.progress(this.taps / need);
    });
  }
}
