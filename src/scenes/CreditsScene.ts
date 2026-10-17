import Phaser from "phaser";
import { bg, button, floor, go, hero, panel, text, COLOR } from "../ui";

/** Third-party art attribution. Mirrors docs/CREDITS.md. */
const CREDITS: { title: string; lines: string[] }[] = [
  {
    title: "INGREDIENT ART",
    lines: ["caiomarcelpixel", "Free Ingredients Pack", "CC BY 4.0, opengameart.org"],
  },
  {
    title: "DISHES & DRINKS",
    lines: ["PixelFoodThemedAssets"],
  },
  {
    title: "EVERYTHING ELSE",
    lines: ["UI, font, cookware, tools, effects", "drawn for this game"],
  },
];

export class CreditsScene extends Phaser.Scene {
  constructor() {
    super("Credits");
  }

  create() {
    this.cameras.main.fadeIn(200);
    bg(this, "bg_tile");
    floor(this, 520);

    panel(this, 180, 60, 240, 50, "bubble");
    text(this, 180, 60, "CREDITS", 16);

    panel(this, 180, 260, 310, 290, "panel");
    let y = 140;
    for (const c of CREDITS) {
      text(this, 180, y, c.title, 9, COLOR.pink);
      y += 22;
      for (const l of c.lines) {
        text(this, 180, y, l, 7, COLOR.muted);
        y += 16;
      }
      y += 18;
    }
    text(this, 180, 382, "full list: docs/CREDITS.md", 6, COLOR.muted);

    hero(this, 50, 570, "pot", 1.5);
    hero(this, 315, 575, "pan", 1.5);

    button(this, 180, 580, "BACK", () => go(this, "Title"), 150, 44, "blue");
  }
}
