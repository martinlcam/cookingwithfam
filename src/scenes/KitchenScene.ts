import Phaser from "phaser";
import { run } from "../state/store";
import { sceneKeyFor } from "../minigames/registry";
import { itemFrame } from "../assets/items";
import { bg, floor, hero, icon, panel, text, go, COLOR } from "../ui";
import { DIFFICULTY_BY_ID } from "@shared/difficulty";

/**
 * Hub that walks through the recipe steps. Launches each minigame on top of
 * itself, sleeps, and wakes when the minigame reports a score.
 */
export class KitchenScene extends Phaser.Scene {
  constructor() {
    super("Kitchen");
  }

  create() {
    this.cameras.main.fadeIn(200);
    const recipe = run.recipe!;
    const step = recipe.steps[run.stepIndex];

    if (!step) {
      go(this, "Result");
      return;
    }

    bg(this, "bg_tile");
    floor(this, 484);

    panel(this, 180, 50, 320, 64, "panel");
    text(this, 180, 42, recipe.name.toUpperCase().slice(0, 24), 9, COLOR.pink);
    const diff = DIFFICULTY_BY_ID[run.difficulty];
    text(this, 180, 64, `step ${run.stepIndex + 1} / ${recipe.steps.length}  ·  ${diff?.label ?? ""}`, 7, COLOR.muted);
    if (diff) this.add.image(312, 50, `diff_${diff.id}`).setScale(1.5);

    // Step dots.
    recipe.steps.forEach((_, i) => {
      const x = 180 + (i - (recipe.steps.length - 1) / 2) * 18;
      icon(this, x, 96, i < run.stepIndex ? "star" : i === run.stepIndex ? "dot_pink" : "dot_grey", i === run.stepIndex ? 2 : 1);
    });

    const sprite = hero(this, 180, 300, itemFrame(step.item), 2);
    this.add.image(180, 365, "ui", "shadow").setAlpha(0.25).setScale(2, 1).setDepth(-1);
    this.tweens.add({ targets: sprite, y: 292, duration: 600, yoyo: true, repeat: -1, ease: "Sine.easeInOut" });

    panel(this, 180, 420, 300, 70, "bubble");
    this.add.image(180, 462, "ui", "bubble_tail").setFlipY(true).setScale(1.5);
    text(this, 180, 412, step.caption.toUpperCase(), 10);
    text(this, 180, 436, "tap to start", 6, COLOR.muted);

    if (!this.scene.isActive("HUD")) this.scene.launch("HUD");

    this.input.once("pointerup", () => {
      this.scene.launch(sceneKeyFor(step.verb), { step });
      this.scene.bringToTop("HUD");
      this.scene.sleep();
    });

    // Minigame finished: record score, advance, restart this scene.
    this.events.once(Phaser.Scenes.Events.WAKE, (_sys: unknown, data: { score: number }) => {
      run.scores.push(data?.score ?? 0);
      run.stepIndex += 1;
      this.scene.restart();
    });
  }
}
