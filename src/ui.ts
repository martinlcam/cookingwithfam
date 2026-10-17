import Phaser from "phaser";
import type { UiFrame } from "./assets/frames";
import type { FoodFrame } from "./assets/food_frames";

/** Cooking-Mama-ish palette. Mirrors tools/sprites/palette.py. */
export const PALETTE = {
  bg: 0x1a1a1a,
  cream: 0xfff4dc,
  white: 0xffffff,
  pink: 0xff9bc0,
  hotpink: 0xf26a9a,
  deeppink: 0xd13f78,
  sky: 0x7fd1f7,
  blue: 0x4e9be8,
  green: 0x6fcf5a,
  yellow: 0xffd93d,
  tomato: 0xff5a4a,
  brown: 0xa86a3c,
  outline: 0x3a2118,
  // kept for older call sites
  purple: 0xf26a9a,
  cyan: 0x7fd1f7,
  dark: 0x463c4b,
  good: 0x6fcf5a,
  bad: 0xff5a4a,
};

export const COLOR = {
  ink: "#3a2118",
  pink: "#d13f78",
  blue: "#3a7bc8",
  green: "#3e9a3a",
  white: "#ffffff",
  muted: "#d9c3a8",
  cream: "#fff4dc",
};

/** Bitmap fonts built from tools/raw by tools/font/build.py: "mama" (gold, the game's look) and "mama_white" (tintable). */
export const FONT_GOLD = "mama";
export const FONT_WHITE = "mama_white";
/** Call sites pass Press-Start-era sizes; snap them to integer multiples of the 16px glyph row. */
const px = (size: number) => (size < 12 ? 16 : size < 20 ? 32 : 48);
export type Txt = Phaser.GameObjects.BitmapText;

export function text(
  scene: Phaser.Scene,
  x: number,
  y: number,
  str: string,
  size = 10,
  color = COLOR.ink,
  origin: [number, number] = [0.5, 0.5],
): Txt {
  // Ink = the gold gradient face, the game's default. Anything else tints the white face.
  const gold = color === COLOR.ink;
  const t = scene.add.bitmapText(x, y, gold ? FONT_GOLD : FONT_WHITE, str, px(size)).setOrigin(origin[0], origin[1]).setMaxWidth(320);
  if (origin[0] === 0) t.setLeftAlign();
  else if (origin[0] === 1) t.setRightAlign();
  else t.setCenterAlign();
  if (!gold) t.setTint(Phaser.Display.Color.HexStringToColor(color).color);
  return t;
}

/** Gold outlined text for buttons and headings. */
export function label(scene: Phaser.Scene, x: number, y: number, str: string, size = 10): Txt {
  return scene.add.bitmapText(x, y, FONT_GOLD, str, px(size)).setOrigin(0.5).setCenterAlign();
}

/** Full-screen tiled background. */
export function bg(scene: Phaser.Scene, frame: UiFrame = "bg_tile") {
  return scene.add.tileSprite(180, 320, 360, 640, "ui", frame).setDepth(-10);
}

/** Nine-slice panel from the UI atlas. */
export function panel(scene: Phaser.Scene, x: number, y: number, w: number, h: number, frame: UiFrame = "panel") {
  const s = frame.startsWith("meter") ? 5 : frame === "board" ? 8 : 10;
  return scene.add.nineslice(x, y, "ui", frame, w, h, s, s, s, s);
}

export function icon(scene: Phaser.Scene, x: number, y: number, frame: UiFrame, scale = 2) {
  return scene.add.image(x, y, "ui", frame).setScale(scale);
}

export function item(scene: Phaser.Scene, x: number, y: number, frame: string, scale = 2) {
  return scene.add.image(x, y, "items", frame).setScale(scale);
}

/** Hero-size (64x64) version of an item, for the kitchen hub and minigames. */
export function hero(scene: Phaser.Scene, x: number, y: number, frame: string, scale = 2) {
  return scene.add.image(x, y, "items64", frame).setScale(scale);
}

/** A dish or drink from the PixelFoodThemedAssets pack (public/assets/food.png). */
export function food(scene: Phaser.Scene, x: number, y: number, frame: FoodFrame, scale = 2) {
  return scene.add.image(x, y, "food", frame).setScale(scale);
}

type ButtonColor = "pink" | "green" | "blue" | "yellow";

/** A chunky nine-slice button that squashes down when pressed. */
export function button(
  scene: Phaser.Scene,
  x: number,
  y: number,
  str: string,
  onClick: () => void,
  w = 240,
  h = 48,
  color: ButtonColor = "pink",
  iconFrame?: UiFrame,
) {
  const c = scene.add.container(x, y);
  const up = `btn_${color}` as UiFrame;
  const down = `btn_${color}_down` as UiFrame;
  const face = scene.add.nineslice(0, 0, "ui", up, w, h, 10, 10, 10, 10);
  const parts: Phaser.GameObjects.GameObject[] = [face];
  let tx = 0;
  if (iconFrame) {
    parts.push(scene.add.image(-w / 2 + 28, 0, "ui", iconFrame).setScale(1.5));
    tx = 12;
  }
  const t = label(scene, tx, -1, str, h >= 44 ? 10 : 8);
  parts.push(t);
  c.add(parts);
  c.setSize(w, h).setInteractive({ useHandCursor: true });
  const press = () => {
    face.setFrame(down);
    t.y = 2;
  };
  const release = () => {
    face.setFrame(up);
    t.y = -1;
  };
  c.on("pointerdown", press);
  c.on("pointerup", () => {
    release();
    onClick();
  });
  c.on("pointerout", release);
  return c;
}

/** Horizontal meter with a nine-slice frame and a tiled fill. */
export function meter(scene: Phaser.Scene, x: number, y: number, w: number, h = 16, fill: UiFrame = "fill_green") {
  const frame = scene.add.nineslice(x, y, "ui", "meter_frame", w, h, 5, 5, 5, 5);
  const inner = w - 6;
  const bar = scene.add.tileSprite(x - w / 2 + 3, y, inner, h - 6, "ui", fill).setOrigin(0, 0.5);
  return {
    frame,
    bar,
    set(frac: number) {
      bar.width = Math.max(0, Math.round(inner * Phaser.Math.Clamp(frac, 0, 1)));
      bar.setVisible(bar.width > 0);
    },
    setFill(f: UiFrame) {
      bar.setFrame(f);
    },
    setDepth(d: number) {
      frame.setDepth(d);
      bar.setDepth(d + 1);
    },
  };
}

/** Fade out, start next scene with data. */
export function go(scene: Phaser.Scene, key: string, data?: object) {
  scene.cameras.main.fadeOut(150, 255, 244, 220);
  scene.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => scene.scene.start(key, data));
}
