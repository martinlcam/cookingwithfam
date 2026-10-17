import Phaser from "phaser";
import { bg, button, floor, go, hero, icon, panel, text, view, COLOR } from "../ui";
import { sfx } from "../sfx";
import { resetRun } from "../state/store";

export class TitleScene extends Phaser.Scene {
  constructor() {
    super("Title");
  }

  create() {
    this.cameras.main.fadeIn(200);
    if (!location.search.includes("demo")) resetRun();
    bg(this, "bg_tile");

    // Counter top along the bottom third, like the DS kitchen, down to the screen edge.
    floor(this, 484);

    // Title card. Mama's portrait goes above it once drawn.
    panel(this, 180, 180, 300, 150, "panel");
    text(this, 180, 150, "COOKING", 22);
    text(this, 180, 190, "WITH FAM", 22);
    text(this, 180, 222, "snap your pantry, cook what you have", 6, COLOR.muted);
    icon(this, 50, 120, "star", 2);
    icon(this, 310, 120, "star", 2);
    icon(this, 40, 240, "heart", 2);
    icon(this, 320, 240, "heart", 2);

    // A few props on the counter so the screen isn't empty before Mama exists.
    hero(this, 60, 540, "pot", 1.5);
    hero(this, 150, 548, "cutting_board", 1.5);
    hero(this, 150, 530, "tomato", 1);
    hero(this, 250, 540, "pan", 1.5);
    hero(this, 320, 545, "bowl", 1.25);

    // Art attribution lives on its own screen (docs/CREDITS.md); just a small link here.
    const v = view(this);
    text(this, v.right - 8, v.bottom - 10, "credits", 6, COLOR.cream, [1, 1])
      .setAlpha(0.9)
      .setInteractive({ useHandCursor: true })
      .on("pointerup", () => go(this, "Credits"));

    // Sound toggle, top-left, remembered across sessions.
    const soundLabel = () => (sfx.muted ? "sound: off" : "sound: on");
    const snd = text(this, v.left + 8, v.top + 12, soundLabel(), 6, COLOR.cream, [0, 0.5]).setInteractive({ useHandCursor: true });
    snd.on("pointerup", () => {
      sfx.muted = !sfx.muted;
      snd.setText(soundLabel());
      if (!sfx.muted) sfx.play("confirm");
    });

    button(this, 180, 330, "TAKE PHOTOS", () => go(this, "Pantry"), 260, 52, "pink", "camera");
    button(this, 180, 400, "LAST PANTRY", () => go(this, "Confirm", { useSaved: true }), 260, 48, "blue");

  }
}
