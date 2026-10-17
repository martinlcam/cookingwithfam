import Phaser from "phaser";
import { run } from "../state/store";
import { sceneKeyFor } from "../minigames/registry";
import { text, go } from "../ui";

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

    text(this, 180, 40, recipe.name.toUpperCase(), 10, "#c252e1");
    text(this, 180, 70, `step ${run.stepIndex + 1} / ${recipe.steps.length}`, 7, "#6ecbf5");
    text(this, 180, 300, step.caption.toUpperCase(), 12);
    text(this, 180, 340, "tap to start", 7, "#6ecbf5");

    if (!this.scene.isActive("HUD")) this.scene.launch("HUD");

    this.input.once("pointerup", () => {
      this.scene.launch(sceneKeyFor(step.verb), { step });
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
