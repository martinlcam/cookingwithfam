import Phaser from "phaser";
import { takePhoto } from "../camera";
import { api } from "../api/client";
import { run } from "../state/store";
import { bg, button, go, icon, panel, text, COLOR, type Txt } from "../ui";

const MAX_PHOTOS = 8; // matches ClassifyRequest

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
    if (run.photos.length >= MAX_PHOTOS) return this.status.setText(`${MAX_PHOTOS} photos max`);
    const photo = await takePhoto();
    if (photo) {
      run.photos.push(photo);
      this.renderThumbs();
    }
  }

  private removePhoto(i: number) {
    if (this.busy) return;
    run.photos.splice(i, 1);
    this.renderThumbs();
  }

  private renderThumbs() {
    this.thumbs.removeAll(true);
    if (run.photos.length === 0) {
      this.thumbs.add(icon(this, 180, 250, "camera", 3).setAlpha(0.5));
      this.thumbs.add(text(this, 180, 310, "no photos yet", 8, COLOR.muted));
    }
    run.photos.forEach((src, i) => {
      const x = 60 + (i % 4) * 80;
      const y = 180 + Math.floor(i / 4) * 80;
      const r = panel(this, x, y, 64, 64, "panel_white");
      const img = this.add.image(x, y, "ui", "camera").setAlpha(0.4);
      this.loadThumb(src, img);
      // Little cross in the corner removes this photo.
      const del = icon(this, x + 26, y - 26, "dot_pink", 2.4).setInteractive({ useHandCursor: true });
      del.on("pointerup", () => this.removePhoto(i));
      const glyph = icon(this, x + 26, y - 26, "cross", 1);
      this.thumbs.add([r, img, del, glyph]);
    });
    this.status.setText(run.photos.length ? `${run.photos.length} photo(s)` : "");
  }

  /** Decode the photo into a texture (once) and show it cropped to a 56px square. */
  private loadThumb(src: string, img: Phaser.GameObjects.Image) {
    const key = `photo:${src.length}:${src.slice(-24)}`;
    const show = () => {
      if (!img.active) return;
      img.setTexture(key).setAlpha(1);
      const f = img.frame;
      const s = Math.max(56 / f.width, 56 / f.height);
      const cw = 56 / s;
      const ch = 56 / s;
      img.setScale(s).setCrop((f.width - cw) / 2, (f.height - ch) / 2, cw, ch);
    };
    if (this.textures.exists(key)) return show();
    const onAdd = (added: string) => {
      if (added !== key) return;
      this.textures.off(Phaser.Textures.Events.ADD, onAdd);
      show();
    };
    this.textures.on(Phaser.Textures.Events.ADD, onAdd);
    this.textures.addBase64(key, src);
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
