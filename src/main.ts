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
import { CreditsScene } from "./scenes/CreditsScene";
import { MINIGAME_SCENES } from "./minigames/registry";

registerSW({ immediate: true });

/**
 * Design size. Every scene lays out against a 360x640 frame; the canvas itself takes the
 * device's real shape (see fit()) and the design frame is centred inside it with view().
 */
export const W = 360;
export const H = 640;

/**
 * Pick a whole-number zoom in DEVICE pixels so pixel art and the bitmap font stay even, and
 * size the logical canvas to fill the viewport at that zoom. On phones the zoom matches the
 * devicePixelRatio (one game pixel per CSS pixel); on a 430-wide phone the canvas is 430
 * game pixels wide, on a 360-wide phone 360. Desktop gets a letterboxed 480x1000 max.
 */
export function computeFit() {
  const dpr = window.devicePixelRatio || 1;
  const wd = window.innerWidth * dpr;
  const hd = window.innerHeight * dpr;
  let z = Math.max(1, Math.round(wd / W));
  while (z > 1 && wd / z < 300) z--; // never shrink the design below 300 logical px wide
  while (z > 1 && hd / z < 560) z--; // ...or so short that the layout cannot fit
  const w = Math.min(480, Math.round(wd / z));
  const h = Math.min(1000, Math.round(hd / z));
  return { w, h, zoom: z / dpr };
}

const first = computeFit();

export const game = new Phaser.Game({
  type: Phaser.AUTO,
  parent: "game",
  width: first.w,
  height: first.h,
  backgroundColor: "#f8a8c0",
  // Smooth text over nearest-neighbour sprites, like the DS games. Atlases get NEAREST in Boot.
  pixelArt: false,
  antialias: true,
  roundPixels: true,
  scale: { mode: Phaser.Scale.NONE, zoom: first.zoom, autoCenter: Phaser.Scale.CENTER_BOTH },
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
    CreditsScene,
    ...MINIGAME_SCENES,
  ],
});

let resizeTimer = 0;
window.addEventListener("resize", () => {
  window.clearTimeout(resizeTimer);
  resizeTimer = window.setTimeout(() => {
    const f = computeFit();
    game.scale.resize(f.w, f.h);
    game.scale.setZoom(f.zoom);
    // Re-centre the design frame in every running scene.
    for (const s of game.scene.getScenes(true)) s.cameras.main.setScroll(W / 2 - f.w / 2, f.h >= H ? H / 2 - f.h / 2 : 0);
  }, 100);
});
