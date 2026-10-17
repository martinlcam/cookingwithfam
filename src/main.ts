import Phaser from "phaser";
import { registerSW } from "virtual:pwa-register";
import { unlockAudio } from "./sfx";
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

// autoUpdate installs new versions in the background, but a PWA that stays open never asks.
// Poll every minute and reload as soon as a new service worker takes over, so play-testers
// always run the latest deploy instead of a cached bundle.
registerSW({
  immediate: true,
  onRegisteredSW(_url, registration) {
    if (!registration) return;
    setInterval(() => registration.update().catch(() => {}), 60_000);
  },
});
navigator.serviceWorker?.addEventListener("controllerchange", () => window.location.reload());

/**
 * Design size. Every scene lays out against a 360x640 frame; the canvas itself takes the
 * device's real shape (see fit()) and the design frame is centred inside it with view().
 */
export const W = 360;
export const H = 640;

/**
 * Zoom so the 336px band that every screen's widest element fits in (330px cards) fills the
 * device width, and size the logical canvas to the viewport at that zoom. A whole-number
 * device zoom keeps pixel art perfectly even, so snap to one when it costs under 6%;
 * otherwise take the fractional zoom, which reads bigger on phones. Desktop is letterboxed
 * to 480x1000 max.
 */
const MIN_W = 336;
export function computeFit() {
  const dpr = window.devicePixelRatio || 1;
  const wd = window.innerWidth * dpr;
  const hd = window.innerHeight * dpr;
  let z = Math.max(1, Math.min(wd / MIN_W, hd / H)); // never shorter than the design
  const whole = Math.floor(z);
  if (whole >= 1 && whole / z > 0.94) z = whole;
  const w = Math.min(480, Math.round(wd / z));
  const h = Math.min(1000, Math.round(hd / z));
  return { w, h, zoom: z / dpr };
}

unlockAudio();

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

// In a plain browser tab (not installed), go fullscreen on the first tap so the system bars
// get out of the way on Android. Installed PWAs already run fullscreen via the manifest; iOS
// has no fullscreen API for pages, so this is a no-op there.
const installed = matchMedia("(display-mode: fullscreen), (display-mode: standalone)").matches;
if (!installed && document.fullscreenEnabled) {
  document.addEventListener("pointerup", () => void document.documentElement.requestFullscreen({ navigationUI: "hide" }).catch(() => {}), { once: true });
}

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
