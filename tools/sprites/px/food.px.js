// Ingredients in the DS cooking-game style: soft 4-5 tone volumes, dithered shading,
// a highlight streak, and a pale tinted halo instead of a dark outline.
// Build: node ~/.claude/skills/pxl-pixel-art/bin/pxl.js build tools/sprites/px/food.px.js
// Each sprite is drawn in a 44x44 box; gen.py centres them in the 64x64 hero frames.

pal({
  // halos (light tints of the fill)
  P: "#ffb8a8", Q: "#bff0a0", R: "#d8c4ff", S: "#f2eee8", V: "#ffe2b0", X: "#ffd0d8",
  // tomato / red        dark -> light
  A: "#7a1818", B: "#c42626", C: "#ee4536", D: "#ff7a5e", E: "#ffd2b8",
  // carrot / orange
  F: "#a0460c", G: "#dc7418", H: "#ff9a2e", I: "#ffc66a",
  // onion / brown-gold
  J: "#5a2a10", K: "#9a4a1a", L: "#c8722c", M: "#e8a654", N: "#ffde9c",
  // greens
  O: "#1c5618", p: "#2e8a28", q: "#4ec63a", s: "#a2f070",
  // whites (egg, garlic)
  T: "#a09082", u: "#cfc2b4", v: "#f1ebe4", w: "#ffffff",
  // potato
  x: "#6a4a26", y: "#9c6c3a", z: "#caa05e", Y: "#ecc98a",
  // purple
  "1": "#2a1050", "2": "#4a2292", "3": "#7242c6", "4": "#b394e6",
  // mushroom / bread tan
  f: "#7a4a22", g: "#b07a3c", h: "#d8a664", i: "#f0d09a",
  // yellows (cheese, lemon, butter, corn, banana)
  j: "#a07010", k: "#d8a818", l: "#f8d040", m: "#fff0a0",
  // blues (fish, water, milk carton)
  n: "#1e4a8a", o: "#3a80d0", t: "#6ec0f8", W: "#c8ecff",
  // pinks (shrimp, pork, bacon)
  5: "#9a3a3a", 6: "#d86a6a", 7: "#f8a098", 8: "#ffd0c8",
  // reds for meat
  9: "#5a1414", 0: "#9c2424", a: "#cc3a3a", b: "#e86060",
  // greys / silver
  d: "#5a5a68", e: "#9a9aa8", Z: "#d0d0dc", "!": "#f4f4f8",
  // dark glass / soy
  "~": "#1a0e0c", "^": "#3a2018", "&": "#6a3a28", ":": "#a06040",
})
ramps("ABCDE", "FGHI", "JKLMN", "Opqs", "Tuvw", "xyzY", "1234", "fghi", "jklm", "notW", "5678", "90ab", "deZ!", "~^&:")

// ---- shared shading helpers --------------------------------------------------
// Lit from the top-left. Two nested dithered passes give a soft falloff like the DS art.
function volume(c, cx, cy, r) {
  // three widening dithered passes = smooth falloff, no hard terminator
  c.shade([cx + r * 0.35, cy + r * 0.35, r * 1.05], 1, 0.3)
  c.shade([cx + r * 0.5, cy + r * 0.5, r * 0.8], 1, 0.55)
  c.shade([cx + r * 0.68, cy + r * 0.68, r * 0.5], 1, 0.9)
  c.light([cx - r * 0.3, cy - r * 0.3, r * 0.7], 1, 0.3)
  c.light([cx - r * 0.38, cy - r * 0.38, r * 0.45], 1, 0.6)
  c.light([cx - r * 0.45, cy - r * 0.45, r * 0.22], 1, 1)
}

sprite("tomato", { w: 44, h: 44, outline: "P", crop: true }, (c) => {
  c.ellipse(22, 25, 17, 15, "C")
  volume(c, 22, 25, 16)
  // top dimple + stem + five leaves
  c.ellipse(22, 12, 6, 2, "B")
  c.poly([22, 4, 24, 12, 20, 12], "O")
  c.poly([22, 10, 31, 8, 36, 14, 26, 13], "p"); c.poly([22, 10, 13, 8, 8, 14, 18, 13], "p")
  c.poly([22, 12, 30, 20, 24, 16], "p"); c.poly([22, 12, 14, 20, 20, 16], "p")
  c.light([16, 9, 12, 4], 1, 0.5)
  // specular streak
  c.line(13, 16, 15, 14, "E", 2); c.px(17, 13, "E")
})

sprite("onion", { w: 44, h: 44, outline: "V", crop: true }, (c) => {
  // golden-brown onion, pointed top, curved ribs following the form, root tuft
  c.ellipse(22, 27, 16, 14, "L")
  c.poly([9, 22, 22, 2, 35, 22], "L")
  volume(c, 22, 26, 15)
  // ribs: three-segment curves, darker line with a lighter line beside it
  const rib = (x0, x1, x2, k, k2) => {
    c.line(x0, 14, x1, 26, k, 1); c.line(x1, 26, x2, 39, k, 1)
    c.line(x0 + 1, 14, x1 + 1, 26, k2, 1); c.line(x1 + 1, 26, x2 + 1, 39, k2, 1)
  }
  rib(19, 13, 15, "K", "M"); rib(23, 22, 22, "K", "M"); rib(26, 31, 29, "K", "M")
  c.light([13, 16, 9, 9], 1, 0.5)
  c.line(14, 21, 16, 17, "N", 2)
  c.poly([19, 40, 25, 40, 24, 44, 20, 44], "J")
  c.poly([22, 2, 20, 9, 24, 9], "K")
})

sprite("egg", { w: 44, h: 44, outline: "S", crop: true }, (c) => {
  c.ellipse(22, 25, 14, 17, "v")
  c.ellipse(22, 17, 11, 11, "v")
  volume(c, 22, 24, 15)
  c.line(15, 15, 17, 11, "w", 3)
})

sprite("carrot", { w: 44, h: 44, outline: "P", crop: true }, (c) => {
  // fat diagonal taper, rounded tip lower-left, leaves top-right
  c.poly([4, 36, 9, 42, 38, 18, 30, 7], "H")
  c.ellipse(34, 12, 6, 6, "H"); c.ellipse(7, 39, 3, 3, "H")
  c.shade([24, 30, 24, 16], 1, 0.35); c.shade([16, 34, 18, 12], 1, 0.6); c.shade([8, 38, 10, 7], 1, 0.9)
  c.light([26, 9, 14, 12], 1, 0.5); c.light([29, 9, 8, 7], 1, 0.9)
  // ridges across the taper
  c.line(13, 27, 19, 33, "G", 1); c.line(19, 21, 25, 27, "G", 1); c.line(25, 15, 30, 20, "G", 1)
  c.line(30, 12, 34, 9, "I", 2)
  c.poly([35, 9, 37, 0, 40, 9], "p"); c.poly([35, 9, 28, 3, 33, 10], "p"); c.poly([36, 9, 43, 4, 39, 11], "p")
  c.light([30, 2, 12, 6], 1, 0.5)
})

sprite("garlic", { w: 44, h: 44, outline: "S", crop: true }, (c) => {
  c.ellipse(22, 29, 16, 12, "v")
  c.poly([8, 26, 22, 6, 36, 26], "v")
  volume(c, 22, 28, 14)
  for (const x of [13, 18, 26, 31]) c.line(x, 20 + Math.abs(22 - x) * 0.4, x, 38, "u", 1)
  c.line(22, 12, 22, 39, "u", 1)
  c.poly([22, 6, 20, 12, 24, 12], "T")
  c.light([14, 18, 7, 8], 1, 0.6)
})

sprite("potato", { w: 44, h: 44, outline: "V", crop: true }, (c) => {
  c.ellipse(22, 24, 18, 13, "z")
  c.ellipse(13, 21, 9, 10, "z"); c.ellipse(31, 27, 8, 9, "z")
  volume(c, 22, 24, 16)
  c.px(14, 18, "y"); c.px(15, 18, "y"); c.px(28, 30, "y"); c.px(29, 31, "y"); c.px(24, 22, "y"); c.px(33, 20, "y")
  c.line(13, 15, 16, 13, "Y", 2)
})

sprite("pepper", { w: 44, h: 44, outline: "Q", crop: true }, (c) => {
  // three lobes with soft seams and a lit rim on each lobe
  c.ellipse(13, 26, 9, 15, "q"); c.ellipse(31, 26, 9, 15, "q"); c.ellipse(22, 25, 11, 16, "q")
  volume(c, 22, 26, 17)
  c.shade([18, 14, 3, 26], 1, 0.6); c.shade([27, 14, 3, 26], 1, 0.6)
  c.light([9, 16, 3, 14], 1, 0.6); c.light([19, 13, 3, 14], 1, 0.6)
  c.rect(20, 5, 4, 8, "O"); c.px(21, 6, "p")
})

sprite("mushroom", { w: 44, h: 44, outline: "V", crop: true }, (c) => {
  // cap first (top half of an ellipse), then the stem under it
  c.ellipse(22, 21, 19, 12, "h")
  c.rect(0, 22, 44, 22, "_")
  c.rect(16, 22, 12, 17, "v"); c.ellipse(22, 39, 6, 3, "v")
  c.shade([24, 24, 8, 18], 1, 0.6)
  c.rect(3, 20, 38, 3, "g")
  c.light([4, 12, 20, 8], 1, 0.5); c.shade([26, 12, 16, 10], 1, 0.5)
  c.px(12, 15, "i"); c.px(13, 15, "i"); c.px(13, 16, "i"); c.px(27, 12, "i"); c.px(28, 12, "i"); c.px(19, 10, "i")
})


// ---- batch 2: the rest of the pantry -------------------------------------------
sprite("cheese", { w: 44, h: 44, outline: "V", crop: true }, (c) => {
  // wedge: top face, front face, side; holes on the top
  c.poly([4, 24, 26, 10, 40, 18, 18, 32], "l")
  c.poly([4, 24, 18, 32, 18, 40, 4, 32], "k")
  c.poly([18, 32, 40, 18, 40, 26, 18, 40], "j")
  c.light([8, 12, 14, 10], 1, 0.4)
  c.ellipse(14, 24, 3, 2, "k"); c.ellipse(26, 18, 2, 1, "k"); c.ellipse(22, 27, 2, 1, "k")
  c.px(13, 23, "j"); c.px(25, 18, "j")
})

sprite("bread", { w: 44, h: 44, outline: "V", crop: true }, (c) => {
  c.ellipse(22, 22, 19, 12, "h"); c.rect(3, 22, 38, 12, "h"); c.ellipse(22, 34, 19, 5, "h")
  volume(c, 22, 24, 17)
  c.line(10, 15, 14, 24, "g", 1); c.line(18, 12, 22, 21, "g", 1); c.line(26, 12, 30, 21, "g", 1)
  c.line(11, 14, 15, 23, "i", 1); c.line(19, 11, 23, 20, "i", 1); c.line(27, 11, 31, 20, "i", 1)
})

sprite("rice", { w: 44, h: 44, outline: "S", crop: true }, (c) => {
  // mound of rice in a blue bowl
  c.ellipse(22, 20, 13, 9, "v"); volume(c, 22, 20, 12)
  c.ellipse(22, 26, 17, 6, "o"); c.rect(5, 26, 34, 8, "o"); c.ellipse(22, 34, 17, 6, "o"); c.rect(5, 26, 34, 8, "o")
  c.ellipse(22, 26, 17, 6, "t"); c.ellipse(22, 26, 15, 4, "o")
  c.shade([30, 30, 16, 12], 1, 0.5); c.light([10, 28, 10, 8], 1, 0.5)
  c.rect(16, 39, 12, 3, "n")
  c.px(17, 16, "w"); c.px(24, 14, "w"); c.px(28, 19, "w"); c.px(14, 21, "w")
})

sprite("chicken", { w: 44, h: 44, outline: "P", crop: true }, (c) => {
  // drumstick: meat blob lower-left, bone upper-right
  c.ellipse(17, 26, 13, 12, "h"); c.poly([22, 18, 30, 12, 34, 16, 26, 26], "h")
  volume(c, 17, 26, 13)
  c.line(29, 15, 37, 7, "v", 4); c.ellipse(38, 5, 3, 3, "v"); c.ellipse(35, 9, 3, 3, "v")
  c.shade([37, 8, 8, 8], 1, 0.4)
  c.line(10, 18, 13, 15, "i", 2)
})

sprite("fish", { w: 44, h: 44, outline: "W", crop: true }, (c) => {
  c.ellipse(19, 24, 15, 9, "t"); c.poly([30, 24, 42, 15, 40, 24, 42, 33], "o")
  c.poly([14, 16, 20, 9, 25, 16], "o")
  volume(c, 19, 24, 14)
  c.line(17, 18, 18, 31, "o", 1); c.line(23, 18, 24, 31, "o", 1)
  c.ellipse(10, 22, 2, 2, "n"); c.px(10, 21, "w"); c.line(5, 26, 8, 28, "n", 1)
})

sprite("lettuce", { w: 44, h: 44, outline: "Q", crop: true }, (c) => {
  c.ellipse(22, 24, 18, 16, "p")
  c.ellipse(13, 20, 9, 9, "q"); c.ellipse(29, 18, 8, 8, "q"); c.ellipse(22, 28, 10, 9, "q"); c.ellipse(11, 30, 6, 6, "q"); c.ellipse(32, 29, 7, 7, "q")
  volume(c, 22, 24, 17)
  c.line(14, 14, 17, 12, "s", 2); c.px(27, 12, "s")
})

sprite("lemon", { w: 44, h: 44, outline: "V", crop: true }, (c) => {
  c.ellipse(22, 24, 16, 11, "l"); c.ellipse(6, 24, 3, 3, "l"); c.ellipse(38, 24, 3, 3, "l")
  volume(c, 22, 24, 14)
  c.poly([6, 16, 14, 12, 16, 18], "p")
  c.line(12, 20, 15, 18, "m", 2)
})

sprite("apple", { w: 44, h: 44, outline: "P", crop: true }, (c) => {
  c.ellipse(15, 25, 12, 13, "C"); c.ellipse(29, 25, 12, 13, "C"); c.rect(14, 12, 16, 26, "C")
  c.ellipse(22, 12, 4, 3, "B")
  volume(c, 22, 26, 17)
  c.rect(21, 3, 2, 10, "f"); c.ellipse(28, 9, 6, 3, "p")
  c.line(11, 19, 14, 15, "E", 2)
})

sprite("butter", { w: 44, h: 44, outline: "V", crop: true }, (c) => {
  c.poly([8, 18, 20, 8, 42, 8, 30, 18], "m")
  c.rect(2, 18, 28, 16, "l")
  c.poly([30, 18, 42, 8, 42, 24, 30, 34], "k")
  c.shade([2, 28, 28, 6], 1, 0.5); c.light([4, 20, 10, 6], 1, 0.6)
})

sprite("milk", { w: 44, h: 44, outline: "S", crop: true }, (c) => {
  c.rect(12, 16, 20, 26, "v"); c.poly([12, 16, 22, 5, 32, 16], "u")
  c.poly([22, 5, 22, 16, 32, 16], "v")
  c.shade([24, 16, 8, 26], 1, 0.5)
  c.rect(13, 24, 18, 7, "t"); c.rect(13, 24, 18, 2, "o")
  c.rect(21, 6, 2, 9, "T")
})

sprite("flour", { w: 44, h: 44, outline: "V", crop: true }, (c) => {
  c.rect(9, 12, 26, 30, "i"); c.rect(12, 6, 20, 7, "h")
  c.shade([24, 12, 11, 30], 1, 0.5); c.light([10, 14, 8, 20], 1, 0.4)
  c.rect(14, 20, 16, 13, "v"); c.rect(17, 24, 10, 2, "o"); c.rect(18, 28, 8, 2, "o")
})

sprite("pasta", { w: 44, h: 44, outline: "V", crop: true }, (c) => {
  c.rect(13, 3, 18, 40, "l")
  for (let x = 14; x < 31; x += 3) c.vline(x, 3, 40, "k")
  c.rect(8, 17, 28, 11, "o"); c.rect(11, 19, 22, 7, "v"); c.rect(13, 21, 18, 3, "o")
  c.shade([24, 3, 8, 40], 1, 0.4)
})

sprite("beef", { w: 44, h: 44, outline: "P", crop: true }, (c) => {
  c.ellipse(22, 24, 18, 13, "8"); c.ellipse(13, 19, 9, 9, "8")
  c.ellipse(22, 25, 15, 10, "a"); c.ellipse(14, 20, 7, 7, "a")
  volume(c, 22, 24, 16)
  c.line(12, 28, 20, 20, "8", 1); c.line(20, 31, 30, 23, "8", 1)
  c.line(10, 20, 13, 17, "b", 2)
})

sprite("shrimp", { w: 44, h: 44, outline: "X", crop: true }, (c) => {
  // curled body: thick arc from the head (top-left) round to the tail (bottom-right)
  for (let i = 0; i < 9; i++) {
    const a0 = -Math.PI * 0.95 + i * 0.25, a1 = a0 + 0.3
    c.line(22 + Math.cos(a0) * 12, 23 + Math.sin(a0) * 12, 22 + Math.cos(a1) * 12, 23 + Math.sin(a1) * 12, "7", 9)
  }
  c.ellipse(11, 20, 6, 6, "7")
  volume(c, 22, 23, 16)
  for (let i = 1; i < 8; i++) { const a = -Math.PI * 0.95 + i * 0.25; c.line(22 + Math.cos(a) * 8, 23 + Math.sin(a) * 8, 22 + Math.cos(a) * 16, 23 + Math.sin(a) * 16, "6", 1) }
  c.poly([29, 30, 40, 26, 42, 36, 33, 39], "6"); c.line(31, 32, 34, 35, "7", 2)
  c.px(9, 18, "9"); c.line(7, 17, 2, 11, "6", 1)
})

sprite("broccoli", { w: 44, h: 44, outline: "Q", crop: true }, (c) => {
  c.rect(18, 26, 8, 16, "s"); c.shade([22, 26, 4, 16], 1, 0.5)
  c.ellipse(22, 15, 12, 10, "p"); c.ellipse(10, 20, 7, 7, "p"); c.ellipse(34, 20, 7, 7, "p"); c.ellipse(15, 25, 7, 6, "p"); c.ellipse(29, 25, 7, 6, "p")
  volume(c, 22, 18, 15)
  for (const [x, y] of [[14, 11], [24, 8], [30, 15], [9, 18], [19, 19], [35, 22]]) { c.px(x, y, "q"); c.px(x + 1, y, "q"); c.px(x, y + 1, "q") }
})

sprite("corn", { w: 44, h: 44, outline: "Q", crop: true }, (c) => {
  c.poly([6, 42, 12, 12, 20, 16, 16, 42], "q"); c.poly([38, 42, 32, 12, 24, 16, 28, 42], "q")
  c.ellipse(22, 22, 9, 18, "l")
  c.shade([26, 22, 6, 18], 1, 0.5); c.light([19, 12, 5, 10], 1, 0.6)
  for (let y = 7; y < 38; y += 4) c.hline(15, y, 14, "k")
  for (const x of [18, 22, 26]) c.vline(x, 5, 34, "k")
  c.shade([6, 30, 12, 12], 1, 0.5); c.shade([28, 30, 10, 12], 1, 0.5)
})

sprite("banana", { w: 44, h: 44, outline: "V", crop: true }, (c) => {
  // crescent built from arc points, stem ends darker
  const top = [], bot = []
  for (let i = 0; i <= 12; i++) { const t = i / 12, x = 3 + t * 38, b = Math.sin(t * Math.PI); top.push(x, 24 - b * 12); bot.push(x, 24 - b * 2 + 1) }
  const pts = [...top]; for (let i = bot.length - 2; i >= 0; i -= 2) pts.push(bot[i], bot[i + 1])
  c.poly(pts, "l")
  c.shade([22, 24, 22, 4], 1, 0.5); c.light([12, 15, 14, 5], 1, 0.5)
  c.rect(2, 22, 4, 4, "f"); c.rect(38, 22, 4, 4, "f")
})

sprite("strawberry", { w: 44, h: 44, outline: "P", crop: true }, (c) => {
  c.ellipse(15, 18, 10, 9, "C"); c.ellipse(29, 18, 10, 9, "C"); c.poly([5, 18, 39, 18, 22, 42], "C")
  volume(c, 22, 24, 17)
  for (const [x, y] of [[14, 20], [23, 18], [19, 27], [28, 26], [22, 34], [11, 14], [31, 14], [26, 22]]) c.px(x, y, "m")
  c.poly([22, 3, 25, 9, 33, 8, 27, 12, 30, 17, 22, 12, 14, 17, 17, 12, 11, 8, 19, 9], "p")
  c.light([12, 10, 10, 6], 1, 0.4)
})

sprite("cucumber", { w: 44, h: 44, outline: "Q", crop: true }, (c) => {
  c.line(10, 36, 34, 8, "p", 12)
  c.shade([28, 22, 18, 20], 1, 0.4); c.shade([16, 32, 12, 12], 1, 0.6)
  c.light([14, 10, 14, 14], 1, 0.4)
  c.line(13, 30, 30, 12, "q", 1); c.line(17, 33, 33, 16, "q", 1)
})

sprite("chili", { w: 44, h: 44, outline: "P", crop: true }, (c) => {
  c.ellipse(12, 30, 26, 24, "C"); c.ellipse(9, 30, 20, 18, "_"); c.rect(0, 0, 44, 8, "_"); c.rect(0, 30, 44, 14, "_"); c.rect(0, 0, 10, 44, "_")
  c.ellipse(35, 11, 3, 4, "C")
  c.shade([30, 24, 14, 12], 1, 0.5); c.light([32, 8, 6, 8], 1, 0.6)
  c.poly([33, 9, 36, 2, 39, 4, 37, 11], "p")
})

sprite("salt", { w: 44, h: 44, outline: "S", crop: true }, (c) => {
  c.rect(14, 14, 16, 26, "v"); c.ellipse(22, 40, 8, 2, "v")
  c.rect(15, 5, 14, 10, "Z"); c.ellipse(22, 5, 7, 2, "Z")
  c.shade([24, 5, 6, 35], 1, 0.5); c.light([15, 15, 5, 20], 1, 0.4)
  for (const [x, y] of [[18, 7], [22, 6], [26, 7], [20, 10], [24, 10]]) c.px(x, y, "d")
  c.rect(17, 22, 10, 8, "t")
})

sprite("oil", { w: 44, h: 44, outline: "V", crop: true }, (c) => {
  c.rect(13, 16, 18, 24, "k"); c.ellipse(22, 40, 9, 2, "k"); c.rect(18, 6, 8, 11, "k")
  c.rect(17, 3, 10, 4, "f")
  c.shade([26, 6, 6, 34], 1, 0.5); c.light([15, 18, 5, 18], 1, 0.6)
  c.rect(16, 24, 12, 8, "m")
})

sprite("sugar", { w: 44, h: 44, outline: "S", crop: true }, (c) => {
  for (const [x, y] of [[8, 22], [24, 22], [16, 10]]) {
    c.rect(x, y, 12, 12, "v"); c.light([x, y, 4, 4], 1, 0.6); c.shade([x + 8, y + 8, 4, 4], 1, 0.6); c.rect(x + 11, y + 1, 1, 11, "u"); c.rect(x + 1, y + 11, 11, 1, "u")
  }
})

sprite("ketchup", { w: 44, h: 44, outline: "P", crop: true }, (c) => {
  c.rect(13, 14, 18, 26, "C"); c.ellipse(22, 40, 9, 2, "C"); c.rect(17, 3, 10, 12, "B")
  c.shade([26, 3, 6, 38], 1, 0.5); c.light([15, 16, 5, 18], 1, 0.5)
  c.rect(16, 22, 12, 9, "w"); c.rect(18, 25, 8, 3, "C")
})

sprite("water", { w: 44, h: 44, outline: "W", crop: true }, (c) => {
  c.rect(13, 12, 18, 28, "t"); c.ellipse(22, 40, 9, 2, "t"); c.rect(17, 4, 10, 9, "t"); c.rect(16, 2, 12, 4, "o")
  c.shade([26, 4, 6, 38], 1, 0.5); c.light([15, 14, 5, 20], 1, 0.6)
  c.rect(16, 24, 12, 8, "o")
})

sprite("generic", { w: 44, h: 44, outline: "V", crop: true }, (c) => {
  // paper grocery bag with a leaf and a tomato peeking out
  c.rect(8, 16, 28, 26, "h"); c.rect(8, 12, 28, 5, "g")
  c.rect(12, 10, 3, 4, "g"); c.rect(29, 10, 3, 4, "g")
  c.shade([26, 16, 10, 26], 1, 0.5); c.light([10, 18, 6, 18], 1, 0.4)
  c.ellipse(16, 9, 5, 4, "p"); c.ellipse(27, 8, 5, 5, "C"); c.light([25, 6, 3, 3], 1, 0.8)
})

sprite("tofu", { w: 44, h: 44, outline: "S", crop: true }, (c) => {
  c.poly([8, 18, 20, 8, 40, 8, 28, 18], "w")
  c.rect(4, 18, 24, 18, "v")
  c.poly([28, 18, 40, 8, 40, 26, 28, 36], "u")
  c.shade([4, 30, 24, 6], 1, 0.4)
})

sprite("avocado", { w: 44, h: 44, outline: "Q", crop: true }, (c) => {
  c.ellipse(22, 27, 14, 16, "O"); c.ellipse(22, 14, 9, 10, "O")
  c.ellipse(22, 27, 11, 13, "s"); c.ellipse(22, 15, 6, 7, "s")
  c.shade([30, 34, 10, 10], 1, 0.5)
  c.ellipse(22, 29, 6, 6, "f"); c.light([19, 26, 3, 3], 1, 0.8)
})

sprite("bacon", { w: 44, h: 44, outline: "X", crop: true }, (c) => {
  // one wavy strip, fat streaks running along it
  const wave = (y, k, w) => { c.line(3, y, 12, y - 4, k, w); c.line(12, y - 4, 22, y + 3, k, w); c.line(22, y + 3, 32, y - 4, k, w); c.line(32, y - 4, 41, y + 1, k, w) }
  wave(22, "6", 11); wave(20, "8", 3); wave(25, "7", 2)
  c.shade([22, 26, 22, 6], 1, 0.4)
})

sprite("sausage", { w: 44, h: 44, outline: "P", crop: true }, (c) => {
  c.line(8, 22, 36, 22, "a", 12)
  volume(c, 22, 22, 14)
  c.vline(17, 16, 12, "0"); c.vline(27, 16, 12, "0")
})

sprite("peas", { w: 44, h: 44, outline: "Q", crop: true }, (c) => {
  c.ellipse(22, 24, 19, 8, "p")
  for (const x of [10, 18, 26, 34]) { c.ellipse(x, 24, 5, 5, "q"); c.light([x - 2, 22, 2, 2], 1, 0.9); c.shade([x + 2, 26, 3, 3], 1, 0.5) }
})

sprite("eggplant", { w: 44, h: 44, outline: "R", crop: true }, (c) => {
  c.ellipse(24, 28, 12, 14, "3"); c.ellipse(19, 16, 7, 10, "3")
  volume(c, 23, 26, 15)
  c.poly([12, 10, 19, 5, 27, 10, 24, 14, 15, 14], "O"); c.rect(18, 2, 3, 5, "O")
  c.line(14, 20, 16, 16, "4", 2)
})

sprite("orange", { w: 44, h: 44, outline: "V", crop: true }, (c) => {
  c.ellipse(22, 25, 17, 16, "H"); volume(c, 22, 25, 16)
  c.ellipse(26, 9, 5, 3, "p"); c.px(22, 9, "F")
  c.line(12, 18, 14, 15, "I", 2)
})

sprite("yogurt", { w: 44, h: 44, outline: "W", crop: true }, (c) => {
  c.poly([11, 14, 33, 14, 30, 40, 14, 40], "v"); c.rect(9, 9, 26, 6, "t"); c.rect(9, 9, 26, 2, "o")
  c.shade([26, 14, 8, 26], 1, 0.5); c.light([13, 16, 5, 20], 1, 0.4)
  c.rect(15, 22, 14, 10, "7")
})

sprite("soy_sauce", { w: 44, h: 44, outline: "V", crop: true }, (c) => {
  c.rect(13, 16, 18, 24, "^"); c.ellipse(22, 40, 9, 2, "^"); c.rect(18, 6, 8, 11, "^"); c.rect(17, 3, 10, 4, "C")
  c.light([15, 18, 4, 18], 1, 0.6); c.shade([26, 6, 6, 34], 1, 0.6)
  c.rect(16, 24, 12, 9, "v"); c.rect(18, 27, 8, 3, "C")
})

sprite("ginger", { w: 44, h: 44, outline: "V", crop: true }, (c) => {
  c.ellipse(18, 26, 11, 8, "Y"); c.ellipse(30, 18, 8, 7, "Y"); c.ellipse(10, 20, 6, 6, "Y"); c.ellipse(32, 30, 6, 5, "Y")
  volume(c, 22, 24, 15)
  c.line(14, 28, 22, 24, "z", 1); c.line(26, 16, 32, 20, "z", 1)
})

sprite("pork", { w: 44, h: 44, outline: "X", crop: true }, (c) => {
  c.ellipse(22, 24, 18, 13, "8"); c.ellipse(22, 25, 15, 10, "7")
  volume(c, 22, 24, 16)
  c.line(12, 28, 22, 20, "8", 1); c.line(20, 31, 31, 23, "8", 1)
})

sprite("noodles", { w: 44, h: 44, outline: "V", crop: true }, (c) => {
  c.ellipse(22, 24, 17, 13, "l"); volume(c, 22, 24, 15)
  for (const [x0, y0, x1, y1] of [[8, 26, 18, 16], [14, 32, 28, 18], [22, 34, 36, 22], [28, 34, 38, 28], [6, 22, 14, 14]]) c.line(x0, y0, x1, y1, "k", 1)
})

sheet("food", ["*"], { pad: 1 })
