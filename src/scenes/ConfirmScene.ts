import Phaser from "phaser";
import type { Pantry } from "@shared/schema";
import { formatQty } from "@shared/format";
import { api } from "../api/client";
import { run, saved } from "../state/store";
import { itemFrame } from "../assets/items";
import { bg, button, fitLines, fitWidth, go, icon, item, panel, text, COLOR, type Txt } from "../ui";

/** Toggle detected ingredients on/off and nudge quantities. No text input on purpose. */
export class ConfirmScene extends Phaser.Scene {
  private enabled: boolean[] = [];
  private status!: Txt;
  private list!: Phaser.GameObjects.Container;

  constructor() {
    super("Confirm");
  }

  async create(data: { useSaved?: boolean }) {
    this.cameras.main.fadeIn(200);
    bg(this, "bg_tile_blue");
    if (data?.useSaved) run.pantry = (await saved.lastPantry()) ?? null;
    if (!run.pantry || run.pantry.items.length === 0) {
      panel(this, 180, 300, 280, 120, "panel");
      text(this, 180, 290, "nothing found.\ntry more photos", 9);
      button(this, 180, 400, "BACK", () => go(this, "Pantry"), 200, 44, "yellow", "arrow_l");
      return;
    }

    panel(this, 180, 50, 320, 64, "panel");
    text(this, 180, 42, "WHAT I SEE", 13, COLOR.pink);
    text(this, 180, 64, "tap to toggle, +/- for amount", 6, COLOR.muted);
    this.enabled = run.pantry.items.map((i) => i.confidence >= 0.5);
    this.list = this.add.container(0, 0);
    this.render();

    this.status = text(this, 180, 546, "", 7);
    button(this, 180, 596, "FIND RECIPES", () => this.findRecipes(), 260, 48, "pink", "check");
  }

  private render() {
    this.list.removeAll(true);
    const items = run.pantry!.items;
    items.slice(0, 12).forEach((ing, i) => {
      const y = 112 + i * 36;
      const on = this.enabled[i]!;
      const row = panel(this, 180, y, 330, 34, on ? "card" : "panel_white");
      row.setInteractive({ useHandCursor: true }).on("pointerup", () => {
        this.enabled[i] = !this.enabled[i];
        this.render();
      });
      const ic = item(this, 36, y, itemFrame(ing.name), 1.0).setAlpha(on ? 1 : 0.4);
      const lbl = fitWidth(text(this, 58, y, formatQty(ing.qty, ing.unit, ing.name), 7, on ? COLOR.ink : COLOR.muted, [0, 0.5]), 192);
      const chk = icon(this, 262, y, on ? "check" : "cross", 1.2);
      const minus = icon(this, 292, y, "dot_pink", 2.8).setInteractive({ useHandCursor: true }).on("pointerup", () => {
        ing.qty = Math.max(1, ing.qty - 1); // 0 is "toggle it off", not an amount
        this.render();
      });
      const minusGlyph = icon(this, 292, y, "minus", 1);
      const plus = icon(this, 322, y, "dot_pink", 2.8).setInteractive({ useHandCursor: true }).on("pointerup", () => {
        ing.qty += 1;
        this.render();
      });
      const plusGlyph = icon(this, 322, y, "plus", 1);
      this.list.add([row, ic, lbl, chk, minus, minusGlyph, plus, plusGlyph]);
    });
  }

  /** Two lines at most, wrapped above the button. */
  private note(msg: string) {
    this.status.setMaxWidth(300).setText(msg);
    fitLines(this.status, 2);
  }

  private async findRecipes() {
    const pantry: Pantry = { items: run.pantry!.items.filter((_, i) => this.enabled[i] && _.qty > 0) };
    if (pantry.items.length === 0) return this.status.setText("pick at least one");
    this.status.setText("thinking...");
    try {
      await saved.setLastPantry(pantry);
      const list = await api.recipes(pantry);
      if (list.recipes.length === 0) {
        // Nothing honest to cook. Keep the player here so they can rethink the pantry.
        this.note(list.note || "not much to cook with that. add a few more things?");
        return;
      }
      run.recipes = list;
      go(this, "RecipePick");
    } catch (e) {
      this.status.setText("no recipes came back. retry?");
      console.error(e);
    }
  }
}
