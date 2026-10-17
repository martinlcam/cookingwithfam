/**
 * Phaser can't open the camera. A hidden <input type=file capture> can.
 * Returns a downscaled JPEG data URL, or null if the user cancelled.
 * iOS only lets you take one photo per tap, so the Pantry scene calls this
 * repeatedly to collect several.
 */
export function takePhoto(maxSide = 1280): Promise<string | null> {
  const input = document.getElementById("camera-input") as HTMLInputElement;
  return new Promise((resolve) => {
    const ctl = new AbortController();
    const done = (v: string | null) => {
      ctl.abort();
      resolve(v);
    };
    input.value = "";
    input.addEventListener(
      "change",
      async () => {
        const file = input.files?.[0];
        done(file ? await downscale(file, maxSide) : null);
      },
      { signal: ctl.signal },
    );
    input.addEventListener("cancel", () => done(null), { signal: ctl.signal });
    input.click();
  });
}

async function downscale(file: File, maxSide: number): Promise<string> {
  const bmp = await createImageBitmap(file);
  const scale = Math.min(1, maxSide / Math.max(bmp.width, bmp.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bmp.width * scale);
  canvas.height = Math.round(bmp.height * scale);
  canvas.getContext("2d")!.drawImage(bmp, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL("image/jpeg", 0.82);
}
