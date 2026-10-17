import Phaser from "phaser";
import { PALETTE, text } from "../ui";

export class BootScene extends Phaser.Scene {
  constructor() {
    super("Boot");
  }

  preload() {
    // Load sprite atlases and audio here once art exists, e.g.:
    // this.load.atlas("food", "assets/food.png", "assets/food.json");
    const bar = this.add.rectangle(180, 320, 0, 8, PALETTE.cyan);
    this.load.on("progress", (p: number) => bar.setSize(240 * p, 8));
    text(this, 180, 290, "LOADING", 10);
  }

  async create() {
    // Make sure the pixel font is ready before any scene draws text.
    await document.fonts.load('10px "Press Start 2P"').catch(() => {});
    this.scene.start("Title");
  }
}
