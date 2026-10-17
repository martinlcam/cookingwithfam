import Phaser from "phaser";
import { takePhoto } from "../camera";
import { api } from "../api/client";
import { run } from "../state/store";
import { button, go, text, PALETTE } from "../ui";

/** Collect several photos of the pantry, then send them all for classification. */
export class PantryScene extends Phaser.Scene {
  private thumbs!: Phaser.GameObjects.Container;
  private status!: Phaser.GameObjects.Text;
  private busy = false;

  constructor() {
    super("Pantry");
  }

  create() {
    this.cameras.main.fadeIn(200);
    text(this, 180, 60, "PANTRY PHOTOS", 14, "#c252e1");
    text(this, 180, 95, "snap shelves, fridge, counter.\nas many as you like.", 7, "#6ecbf5");

    this.thumbs = this.add.container(0, 0);
    this.status = text(this, 180, 420, "", 8);
    this.renderThumbs();

    button(this, 180, 480, "+ ADD PHOTO", () => this.addPhoto());
    button(this, 180, 530, "ANALYZE", () => this.analyze());
    button(this, 180, 590, "BACK", () => go(this, "Title"), 120, 32);
  }

  private async addPhoto() {
    if (this.busy) return;
    const photo = await takePhoto();
    if (photo) {
      run.photos.push(photo);
      this.renderThumbs();
    }
  }

  private renderThumbs() {
    this.thumbs.removeAll(true);
    run.photos.forEach((_, i) => {
      const x = 60 + (i % 4) * 80;
      const y = 180 + Math.floor(i / 4) * 80;
      const r = this.add.rectangle(x, y, 64, 64, PALETTE.dark).setStrokeStyle(2, PALETTE.cyan);
      const t = text(this, x, y, `#${i + 1}`, 8);
      this.thumbs.add([r, t]);
    });
    this.status.setText(run.photos.length ? `${run.photos.length} photo(s)` : "no photos yet");
  }

  private async analyze() {
    if (this.busy || run.photos.length === 0) return;
    this.busy = true;
    this.status.setText("mama is looking...");
    try {
      run.pantry = await api.classify(run.photos);
      go(this, "Confirm");
    } catch (e) {
      this.status.setText("couldn't read that. try again?");
      console.error(e);
    } finally {
      this.busy = false;
    }
  }
}
