import Phaser from "phaser";
import type { Pantry } from "@shared/schema";
import { api } from "../api/client";
import { run, saved } from "../state/store";
import { button, go, text, PALETTE } from "../ui";

/** Toggle detected ingredients on/off and nudge quantities. No text input on purpose. */
export class ConfirmScene extends Phaser.Scene {
  private enabled: boolean[] = [];
  private status!: Phaser.GameObjects.Text;
  private list!: Phaser.GameObjects.Container;

  constructor() {
    super("Confirm");
  }

  async create(data: { useSaved?: boolean }) {
    this.cameras.main.fadeIn(200);
    if (data?.useSaved) run.pantry = (await saved.lastPantry()) ?? null;
    if (!run.pantry || run.pantry.items.length === 0) {
      text(this, 180, 300, "nothing found.\ntry more photos", 9);
      button(this, 180, 400, "BACK", () => go(this, "Pantry"));
      return;
    }

    text(this, 180, 40, "WHAT I SEE", 14, "#c252e1");
    text(this, 180, 70, "tap to toggle, +/- for amount", 7, "#6ecbf5");
    this.enabled = run.pantry.items.map((i) => i.confidence >= 0.5);
    this.list = this.add.container(0, 0);
    this.render();

    this.status = text(this, 180, 540, "", 8);
    button(this, 180, 590, "FIND RECIPES", () => this.findRecipes());
  }

  private render() {
    this.list.removeAll(true);
    const items = run.pantry!.items;
    items.slice(0, 12).forEach((item, i) => {
      const y = 110 + i * 34;
      const on = this.enabled[i]!;
      const row = this.add.rectangle(130, y, 220, 28, on ? PALETTE.dark : PALETTE.bg).setStrokeStyle(2, on ? PALETTE.cyan : 0x444444);
      row.setInteractive().on("pointerup", () => {
        this.enabled[i] = !this.enabled[i];
        this.render();
      });
      const label = text(this, 30, y, `${item.qty}${item.unit === "pcs" ? "" : item.unit} ${item.name}`, 8, on ? "#fff1d6" : "#666666", [0, 0.5]);
      const minus = text(this, 270, y, "-", 12, "#c252e1").setInteractive().on("pointerup", () => {
        item.qty = Math.max(0, item.qty - 1);
        this.render();
      });
      const plus = text(this, 310, y, "+", 12, "#6ecbf5").setInteractive().on("pointerup", () => {
        item.qty += 1;
        this.render();
      });
      this.list.add([row, label, minus, plus]);
    });
  }

  private async findRecipes() {
    const pantry: Pantry = { items: run.pantry!.items.filter((_, i) => this.enabled[i]) };
    if (pantry.items.length === 0) return this.status.setText("pick at least one");
    this.status.setText("mama is thinking...");
    try {
      await saved.setLastPantry(pantry);
      run.recipes = await api.recipes(pantry);
      go(this, "RecipePick");
    } catch (e) {
      this.status.setText("no recipes came back. retry?");
      console.error(e);
    }
  }
}
