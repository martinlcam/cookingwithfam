import Phaser from "phaser";
import { registerSW } from "virtual:pwa-register";
import { BootScene } from "./scenes/BootScene";
import { TitleScene } from "./scenes/TitleScene";
import { PantryScene } from "./scenes/PantryScene";
import { ConfirmScene } from "./scenes/ConfirmScene";
import { RecipePickScene } from "./scenes/RecipePickScene";
import { KitchenScene } from "./scenes/KitchenScene";
import { HUDScene } from "./scenes/HUDScene";
import { ResultScene } from "./scenes/ResultScene";
import { MINIGAME_SCENES } from "./minigames/registry";

registerSW({ immediate: true });

/** Logical resolution. Portrait, phone-shaped, scaled with integer zoom where possible. */
export const W = 360;
export const H = 640;

export const game = new Phaser.Game({
  type: Phaser.AUTO,
  parent: "game",
  width: W,
  height: H,
  backgroundColor: "#1a1a1a",
  // Smooth text over nearest-neighbour sprites, like the DS games. Atlases get NEAREST in Boot.
  pixelArt: false,
  antialias: true,
  roundPixels: true,
  scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
  input: { activePointers: 2 },
  scene: [
    BootScene,
    TitleScene,
    PantryScene,
    ConfirmScene,
    RecipePickScene,
    KitchenScene,
    HUDScene,
    ResultScene,
    ...MINIGAME_SCENES,
  ],
});
