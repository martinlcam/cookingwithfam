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
  // Integer zoom only. FIT scales the canvas by a fraction, which smears the pixel art and
  // makes the bitmap font uneven. MAX_ZOOM picks the largest whole multiple that fits.
  scale: { mode: Phaser.Scale.NONE, zoom: Phaser.Scale.Zoom.MAX_ZOOM, autoCenter: Phaser.Scale.CENTER_BOTH },
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

/** MAX_ZOOM is only computed at boot; keep the whole-number zoom in step with the window. */
function fitZoom() {
  const z = Math.max(1, Math.floor(Math.min(window.innerWidth / W, window.innerHeight / H)));
  if (game.scale.zoom !== z) game.scale.setZoom(z);
}
window.addEventListener("resize", fitZoom);
