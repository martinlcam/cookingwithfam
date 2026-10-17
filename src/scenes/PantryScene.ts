import Phaser from "phaser";
import { takePhoto } from "../camera";
import { api } from "../api/client";
import { run } from "../state/store";
import { bg, button, go, icon, panel, text, COLOR, type Txt } from "../ui";

/** Collect several photos of the pantry, then send them all for classification. */
export class PantryScene extends Phaser.Scene {
  private thumbs!: Phaser.GameObjects.Container;
  private status!: Txt;
  private busy = false;

  constructor() {
    super("Pantry");
  }

  create() {
    this.cameras.main.fadeIn(200);
    bg(this, "bg_tile_blue");
    panel(this, 180, 70, 320, 80, "panel");
    text(this, 180, 58, "PANTRY PHOTOS", 13, COLOR.pink);
    text(this, 180, 86, "snap shelves, fridge, counter.", 6, COLOR.muted);

    panel(this, 180, 270, 320, 280, "card");
    this.thumbs = this.add.container(0, 0);
    this.status = text(this, 180, 430, "", 8);
    this.renderThumbs();

    button(this, 180, 490, "ADD PHOTO", () => this.addPhoto(), 260, 48, "blue", "camera");
    button(this, 180, 548, "ANALYZE", () => this.analyze(), 260, 48, "pink", "check");
    button(this, 180, 605, "BACK", () => go(this, "Title"), 140, 36, "yellow", "arrow_l");
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
    if (run.photos.length === 0) {
      this.thumbs.add(icon(this, 180, 250, "camera", 3).setAlpha(0.5));
      this.thumbs.add(text(this, 180, 310, "no photos yet", 8, COLOR.muted));
    }
    run.photos.forEach((_, i) => {
      const x = 60 + (i % 4) * 80;
      const y = 180 + Math.floor(i / 4) * 80;
      const r = panel(this, x, y, 64, 64, "panel_white");
      const t = text(this, x, y, `#${i + 1}`, 8, COLOR.blue);
      this.thumbs.add([r, t]);
    });
    this.status.setText(run.photos.length ? `${run.photos.length} photo(s)` : "");
  }

  private async analyze() {
    if (this.busy || run.photos.length === 0) return;
    this.busy = true;
    this.status.setText("looking...");
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
