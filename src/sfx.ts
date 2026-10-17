/**
 * Sound effects, synthesized with Web Audio in the style of a DS cooking game: short square
 * and triangle blips for UI, filtered noise for knives, water and sizzling, little arpeggios
 * for results. No audio files, nothing to license, ~2 KB.
 *
 *   sfx.play("chop")            one-shot
 *   const stop = sfx.loop("sizzle"); ... stop()
 *   sfx.muted = true            persisted in localStorage
 *
 * The AudioContext is created lazily and resumed on the first pointer event (browser rule).
 */

type Wave = OscillatorType;

let ctx: AudioContext | null = null;
let master: GainNode | null = null;

function ac(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return null;
    ctx = new Ctor();
    master = ctx.createGain();
    master.gain.value = 0.25;
    master.connect(ctx.destination);
  }
  if (ctx.state === "suspended") ctx.resume().catch(() => {});
  return ctx;
}

/** Unlock audio on the first user gesture. Call once at boot. */
export function unlockAudio() {
  const resume = () => {
    ac();
    window.removeEventListener("pointerdown", resume);
    window.removeEventListener("keydown", resume);
  };
  window.addEventListener("pointerdown", resume);
  window.addEventListener("keydown", resume);
}

let noiseBuffer: AudioBuffer | null = null;
function noiseSrc(c: AudioContext) {
  if (!noiseBuffer) {
    noiseBuffer = c.createBuffer(1, c.sampleRate, c.sampleRate);
    const d = noiseBuffer.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  }
  const s = c.createBufferSource();
  s.buffer = noiseBuffer;
  s.loop = true;
  return s;
}

/** A single oscillator note. `slide` glides the pitch to that value over the duration. */
function tone(c: AudioContext, at: number, freq: number, dur: number, wave: Wave = "square", vol = 0.5, slide?: number) {
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = wave;
  o.frequency.setValueAtTime(freq, at);
  if (slide !== undefined) o.frequency.exponentialRampToValueAtTime(Math.max(20, slide), at + dur);
  g.gain.setValueAtTime(0.0001, at);
  g.gain.exponentialRampToValueAtTime(vol, at + 0.005);
  g.gain.exponentialRampToValueAtTime(0.0001, at + dur);
  o.connect(g).connect(master!);
  o.start(at);
  o.stop(at + dur + 0.02);
}

/** A burst of filtered noise. The filter frequency sweeps from `f0` to `f1`. */
function hiss(c: AudioContext, at: number, dur: number, type: BiquadFilterType, f0: number, f1: number, vol = 0.5, q = 1) {
  const s = noiseSrc(c);
  const f = c.createBiquadFilter();
  const g = c.createGain();
  f.type = type;
  f.Q.value = q;
  f.frequency.setValueAtTime(f0, at);
  f.frequency.exponentialRampToValueAtTime(Math.max(40, f1), at + dur);
  g.gain.setValueAtTime(0.0001, at);
  g.gain.exponentialRampToValueAtTime(vol, at + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, at + dur);
  s.connect(f).connect(g).connect(master!);
  s.start(at);
  s.stop(at + dur + 0.05);
}

const N = { C5: 523, D5: 587, E5: 659, G5: 784, A5: 880, C6: 1047, E6: 1319, G6: 1568, A3: 220, E3: 165 };

/** Every one-shot the game uses. Each is a few notes or bursts. */
const SOUNDS: Record<string, (c: AudioContext, t: number) => void> = {
  // --- ui ---
  tap: (c, t) => tone(c, t, 900, 0.05, "square", 0.3),
  confirm: (c, t) => { tone(c, t, N.C5, 0.07, "square", 0.35); tone(c, t + 0.07, N.G5, 0.12, "square", 0.35); },
  back: (c, t) => { tone(c, t, N.G5, 0.06, "square", 0.3); tone(c, t + 0.06, N.C5, 0.1, "square", 0.3); },
  swoosh: (c, t) => hiss(c, t, 0.18, "bandpass", 400, 2400, 0.25, 0.7),
  toggle: (c, t) => tone(c, t, 1200, 0.04, "triangle", 0.35, 1600),
  shutter: (c, t) => { hiss(c, t, 0.04, "highpass", 3000, 6000, 0.5); tone(c, t + 0.05, 2400, 0.03, "square", 0.25); hiss(c, t + 0.09, 0.05, "highpass", 2000, 4000, 0.4); },
  // --- cooking ---
  chop: (c, t) => { hiss(c, t, 0.06, "lowpass", 2500, 300, 0.7); tone(c, t, 140, 0.09, "triangle", 0.6, 60); },
  slice: (c, t) => hiss(c, t, 0.14, "bandpass", 500, 3500, 0.45, 1.5),
  peel: (c, t) => { hiss(c, t, 0.2, "bandpass", 1800, 600, 0.4, 2); tone(c, t, 700, 0.18, "triangle", 0.15, 300); },
  shave: (c, t) => hiss(c, t, 0.1, "highpass", 2500, 5000, 0.4),
  pour: (c, t) => { hiss(c, t, 0.5, "lowpass", 600, 1800, 0.4); for (let i = 0; i < 5; i++) tone(c, t + 0.06 + i * 0.09, 500 + Math.random() * 600, 0.05, "sine", 0.12, 900 + Math.random() * 800); },
  splash: (c, t) => { hiss(c, t, 0.25, "lowpass", 2500, 400, 0.6); tone(c, t + 0.02, 900, 0.1, "sine", 0.2, 300); },
  bubble: (c, t) => tone(c, t, 500 + Math.random() * 300, 0.09, "sine", 0.3, 1200),
  stir: (c, t) => hiss(c, t, 0.25, "bandpass", 300, 900, 0.3, 1),
  sizzle_hit: (c, t) => hiss(c, t, 0.35, "highpass", 3000, 2000, 0.5),
  flip: (c, t) => { hiss(c, t, 0.12, "bandpass", 300, 1500, 0.35); tone(c, t + 0.1, 400, 0.08, "triangle", 0.3, 250); },
  crack: (c, t) => { hiss(c, t, 0.03, "highpass", 1500, 4000, 0.7); tone(c, t + 0.02, 300, 0.06, "square", 0.3, 120); },
  thud: (c, t) => tone(c, t, 120, 0.12, "triangle", 0.6, 50),
  tick: (c, t) => tone(c, t, 1400, 0.03, "square", 0.25),
  alarm: (c, t) => { tone(c, t, 1600, 0.08, "square", 0.3); tone(c, t + 0.1, 1600, 0.08, "square", 0.3); },
  sparkle: (c, t) => { tone(c, t, 1800, 0.08, "sine", 0.25, 2600); tone(c, t + 0.06, 2400, 0.1, "sine", 0.2, 3200); },
  // --- feedback ---
  ok: (c, t) => { tone(c, t, N.A5, 0.05, "square", 0.3); tone(c, t + 0.05, N.E6, 0.08, "square", 0.3); },
  miss: (c, t) => { tone(c, t, 110, 0.18, "square", 0.35, 80); },
  perfect: (c, t) => { [N.C5, N.E5, N.G5, N.C6, N.E6].forEach((f, i) => tone(c, t + i * 0.07, f, 0.12, "square", 0.3)); tone(c, t + 0.4, N.G6, 0.3, "triangle", 0.3); },
  good: (c, t) => { tone(c, t, N.E5, 0.1, "square", 0.3); tone(c, t + 0.1, N.A5, 0.18, "square", 0.3); },
  hmm: (c, t) => { tone(c, t, N.E5, 0.12, "square", 0.3); tone(c, t + 0.14, N.C5, 0.22, "square", 0.3, 440); },
  medal: (c, t) => { [N.C5, N.C5, N.C5, N.E5, N.G5].forEach((f, i) => tone(c, t + i * 0.1, f, 0.09, "square", 0.3)); [N.C6, N.E6, N.G6].forEach((f, i) => tone(c, t + 0.55 + i * 0.12, f, 0.25, "triangle", 0.3)); },
  start: (c, t) => { tone(c, t, N.C5, 0.08, "square", 0.3); tone(c, t + 0.08, N.E5, 0.08, "square", 0.3); tone(c, t + 0.16, N.G5, 0.16, "square", 0.3); },
};

export type SfxName = keyof typeof SOUNDS;

/** Continuous sounds for hold-type minigames. Returns a stop function. */
const LOOPS: Record<string, (c: AudioContext) => () => void> = {
  sizzle: (c) => {
    const s = noiseSrc(c);
    const f = c.createBiquadFilter();
    f.type = "highpass";
    f.frequency.value = 2500;
    const g = c.createGain();
    g.gain.value = 0.0001;
    // crackle: random amplitude steps
    const crackle = c.createGain();
    crackle.gain.value = 0.35;
    s.connect(f).connect(crackle).connect(g).connect(master!);
    s.start();
    g.gain.exponentialRampToValueAtTime(1, c.currentTime + 0.3);
    const timer = window.setInterval(() => (crackle.gain.value = 0.2 + Math.random() * 0.3), 60);
    return () => {
      window.clearInterval(timer);
      g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + 0.2);
      s.stop(c.currentTime + 0.25);
    };
  },
  boil: (c) => {
    let on = true;
    const bubble = () => {
      if (!on) return;
      tone(c, c.currentTime, 300 + Math.random() * 400, 0.1, "sine", 0.18, 700 + Math.random() * 600);
      window.setTimeout(bubble, 90 + Math.random() * 180);
    };
    bubble();
    return () => (on = false);
  },
  stir: (c) => {
    let on = true;
    const whoosh = () => {
      if (!on) return;
      hiss(c, c.currentTime, 0.3, "bandpass", 250, 800, 0.2, 1);
      window.setTimeout(whoosh, 320);
    };
    whoosh();
    return () => (on = false);
  },
};

export type LoopName = keyof typeof LOOPS;

const KEY = "cwf.muted";

export const sfx = {
  get muted() {
    try { return localStorage.getItem(KEY) === "1"; } catch { return false; }
  },
  set muted(v: boolean) {
    try { localStorage.setItem(KEY, v ? "1" : "0"); } catch { /* private mode */ }
    if (master) master.gain.value = v ? 0 : 0.25;
  },
  play(name: SfxName) {
    if (this.muted) return;
    const c = ac();
    if (!c || !master) return;
    try { SOUNDS[name]!(c, c.currentTime); } catch { /* never let audio break the game */ }
  },
  loop(name: LoopName): () => void {
    if (this.muted) return () => {};
    const c = ac();
    if (!c || !master) return () => {};
    try { return LOOPS[name]!(c); } catch { return () => {}; }
  },
};
