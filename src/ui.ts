import Phaser from "phaser";

export const PALETTE = {
  bg: 0x1a1a1a,
  purple: 0xc252e1,
  cyan: 0x6ecbf5,
  cream: 0xfff1d6,
  dark: 0x2a2a2a,
  good: 0x7bd88f,
  bad: 0xe06c75,
};

export const FONT = '"Press Start 2P"';

export function text(
  scene: Phaser.Scene,
  x: number,
  y: number,
  str: string,
  size = 10,
  color = "#fff1d6",
  origin: [number, number] = [0.5, 0.5],
) {
  return scene.add
    .text(x, y, str, { fontFamily: FONT, fontSize: `${size}px`, color, align: "center", wordWrap: { width: 320 } })
    .setOrigin(origin[0], origin[1])
    .setResolution(2);
}

/** A chunky pixel button. */
export function button(scene: Phaser.Scene, x: number, y: number, label: string, onClick: () => void, w = 220, h = 40) {
  const c = scene.add.container(x, y);
  const bg = scene.add.rectangle(0, 0, w, h, PALETTE.purple).setStrokeStyle(3, PALETTE.cyan);
  const t = text(scene, 0, 0, label, 10);
  c.add([bg, t]);
  c.setSize(w, h).setInteractive({ useHandCursor: true });
  c.on("pointerdown", () => bg.setFillStyle(PALETTE.cyan));
  c.on("pointerup", () => {
    bg.setFillStyle(PALETTE.purple);
    onClick();
  });
  c.on("pointerout", () => bg.setFillStyle(PALETTE.purple));
  return c;
}

/** Fade out, start next scene with data. */
export function go(scene: Phaser.Scene, key: string, data?: object) {
  scene.cameras.main.fadeOut(150, 26, 26, 26);
  scene.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => scene.scene.start(key, data));
}
