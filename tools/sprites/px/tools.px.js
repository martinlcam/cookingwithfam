// Tools, cookware and effects in the same DS cooking-game style as food.px.js:
// soft 4-5 tone volumes, dithered shading lit from the top-left, a highlight
// streak, and a pale tinted halo instead of a dark outline.
// Build: node ~/.claude/skills/pxl-pixel-art/bin/pxl.js build tools/sprites/px/tools.px.js
// Each sprite is drawn in a 44x44 box; gen.py centres them in the 64x64 hero frames.

pal({
  // halos (pale tints of the fill)
  P: "#ffb8a8", Q: "#bff0a0", S: "#f2eee8", V: "#ffe2b0", W: "#d8f0ff",
  // steel                dark -> light
  d: "#4a4a5a", e: "#8a8a9c", Z: "#c8c8d6", "!": "#f6f6fa",
  // cast iron / handles
  "1": "#16161e", "2": "#2c2c38", "3": "#4c4c5e", "4": "#7a7a92",
  // DS red enamel
  A: "#6e1414", B: "#b82222", C: "#e63c30", D: "#ff6e58", E: "#ffcfb8",
  // wood
  J: "#5a2a10", K: "#94501e", L: "#c4782e", M: "#e4a452", N: "#ffd99a",
  // ceramic white
  T: "#a09890", u: "#cfc8c0", v: "#f0ece6", w: "#ffffff",
  // blues (rims, arrows, water)
  n: "#1e4a8a", o: "#3a80d0", t: "#6ec0f8", y: "#c8ecff",
  // greens (ok mark)
  O: "#1c5618", p: "#2e8a28", q: "#4ec63a", s: "#a2f070",
  // flame
  F: "#b03a0a", G: "#e8641a", H: "#ff9a2e", I: "#ffd060", m: "#fff6b0",
  // translucent whites / greys for steam, smoke, bubbles
  a: "#ffffff70", b: "#ffffffb0", c: "#ffffffe0",
  f: "#6a6a7870", g: "#8c8c9aa8", h: "#b4b4c0d8",
})
ramps("d" + "eZ!", "1234", "ABCDE", "JKLMN", "Tuvw", "noty", "Opqs", "FGHIm")

// Lit from the top-left: three widening dithered shade passes, three light passes.
function volume(c, cx, cy, r) {
  c.shade([cx + r * 0.35, cy + r * 0.35, r * 1.05], 1, 0.3)
  c.shade([cx + r * 0.5, cy + r * 0.5, r * 0.8], 1, 0.55)
  c.shade([cx + r * 0.68, cy + r * 0.68, r * 0.5], 1, 0.9)
  c.light([cx - r * 0.3, cy - r * 0.3, r * 0.7], 1, 0.3)
  c.light([cx - r * 0.38, cy - r * 0.38, r * 0.45], 1, 0.6)
  c.light([cx - r * 0.45, cy - r * 0.45, r * 0.22], 1, 1)
}
// Soft shading on a box-ish shape: darker toward bottom-right, lighter top-left.
function slab(c, x, y, w, h) {
  c.shade([x + w * 0.45, y + h * 0.45, w * 0.55, h * 0.55], 1, 0.35)
  c.shade([x + w * 0.65, y + h * 0.65, w * 0.35, h * 0.35], 1, 0.7)
  c.light([x, y, w * 0.5, h * 0.45], 1, 0.35)
  c.light([x, y, w * 0.3, h * 0.25], 1, 0.7)
}

// ---- cutting tools -----------------------------------------------------------

sprite("knife", { w: 44, h: 44, outline: "S", crop: true }, (c) => {
  // chef's knife, tip lower-left, dark handle upper-right
  c.poly([2, 36, 6, 42, 29, 19, 24, 12], "Z")           // blade
  c.ellipse(4, 39, 3, 3, "Z")                            // rounded tip
  c.line(5, 41, 28, 18, "e", 1)                           // edge bevel
  c.light([6, 14, 16, 14], 1, 0.5); c.line(10, 28, 20, 18, "!", 2)
  c.shade([14, 26, 18, 16], 1, 0.4)
  c.poly([24, 12, 29, 19, 32, 16, 27, 9], "e")            // bolster
  c.poly([27, 9, 32, 16, 43, 5, 38, 0], "2")              // handle
  c.line(29, 10, 40, 1, "3", 1); c.px(33, 9, "4"); c.px(37, 5, "4")   // handle sheen + rivets
})

sprite("cutting_board", { w: 44, h: 44, outline: "V", crop: true }, (c) => {
  // warm wood plank seen from above-front, thick front edge, handle hole top-right
  c.rect(2, 10, 40, 26, "M"); c.ellipse(2, 23, 3, 13, "M"); c.ellipse(41, 23, 3, 13, "M")
  slab(c, 0, 10, 44, 26)
  for (const y of [15, 20, 26, 31]) c.line(5, y, 39, y + (y % 2 ? 1 : -1), "L", 1)   // grain
  c.line(8, 13, 20, 13, "N", 1)
  c.rect(2, 36, 40, 4, "K"); c.ellipse(2, 38, 3, 2, "K"); c.ellipse(41, 38, 3, 2, "K")   // front edge
  c.line(4, 39, 40, 39, "J", 1)
  c.circ(37, 15, 2, "K"); c.px(37, 14, "J")   // handle hole
})

sprite("rolling_pin", { w: 44, h: 44, outline: "V", crop: true }, (c) => {
  c.rect(8, 15, 28, 14, "M"); c.ellipse(8, 22, 3, 7, "M"); c.ellipse(36, 22, 3, 7, "M")
  c.shade([8, 24, 28, 6], 1, 0.5); c.shade([8, 27, 28, 3], 1, 0.9)
  c.light([8, 16, 28, 4], 1, 0.6); c.line(12, 17, 30, 17, "N", 1)
  c.ellipse(36, 22, 3, 7, "L"); c.ellipse(8, 22, 3, 7, "L")
  c.rect(0, 20, 7, 5, "K"); c.rect(37, 20, 7, 5, "K")   // handles
  c.light([0, 20, 7, 2], 1, 0.6); c.light([37, 20, 7, 2], 1, 0.6)
})

// ---- utensils ----------------------------------------------------------------

sprite("spoon", { w: 44, h: 44, outline: "S", crop: true }, (c) => {
  c.line(14, 16, 40, 42, "Z", 5)                          // handle
  c.ellipse(13, 13, 9, 11, "Z")                            // bowl
  volume(c, 13, 13, 9)
  c.ellipse(13, 13, 5, 7, "e"); c.light([9, 8, 5, 6], 1, 0.6)   // dish of the spoon
  c.line(20, 22, 34, 36, "!", 1); c.shade([22, 26, 20, 18], 1, 0.4)
})

sprite("spatula", { w: 44, h: 44, outline: "S", crop: true }, (c) => {
  c.rect(2, 20, 18, 22, "Z"); c.ellipse(11, 20, 9, 3, "Z")   // head
  c.shade([12, 30, 10, 14], 1, 0.35); c.light([2, 18, 9, 10], 1, 0.5)
  for (const x of [6, 11, 16]) c.line(x, 25, x, 38, "e", 1)   // slots
  c.line(11, 17, 20, 8, "e", 3)                              // neck
  c.line(20, 8, 40, -2, "2", 5); c.line(22, 6, 36, -1, "3", 1)   // handle
})

sprite("whisk", { w: 44, h: 44, outline: "S", crop: true }, (c) => {
  // wire balloon lower-left, dark handle upper-right
  for (const [rx, ry, ang] of [[12, 15, 0], [8, 15, 0], [12, 10, 0]]) c.ellipse(14, 28, rx, ry, "e", true)
  c.ellipse(14, 28, 4, 15, "e", true); c.ellipse(14, 28, 12, 5, "e", true)
  c.light([4, 14, 12, 12], 1, 0.6)
  c.line(14, 13, 24, 9, "Z", 3)                            // ferrule
  c.line(24, 9, 42, 1, "2", 5); c.line(26, 7, 38, 2, "3", 1)
})

sprite("grater", { w: 44, h: 44, outline: "S", crop: true }, (c) => {
  c.rect(10, 8, 24, 34, "Z"); c.ellipse(22, 42, 12, 2, "Z")
  slab(c, 10, 8, 24, 34)
  for (let y = 13; y < 40; y += 5) for (let x = 13 + ((y / 5) % 2 ? 3 : 0); x < 31; x += 6) { c.px(x, y, "d"); c.px(x + 1, y, "e") }
  c.rect(16, 2, 12, 7, "2"); c.rect(18, 4, 8, 3, "_")      // handle
  c.line(17, 3, 27, 3, "3", 1)
})

// ---- cookware ----------------------------------------------------------------

sprite("pan", { w: 44, h: 44, outline: "S", crop: true }, (c) => {
  // dark frying pan from above-front, glossy rim, long handle to the right
  c.ellipse(17, 26, 16, 12, "3")                           // rim
  c.ellipse(17, 27, 13, 9, "2")                            // inside wall
  c.ellipse(17, 28, 11, 7, "1")                            // cooking surface
  c.light([4, 16, 16, 8], 1, 0.6); c.line(7, 20, 15, 16, "4", 2)   // rim gloss
  c.shade([20, 30, 14, 10], 1, 0.5)
  c.line(32, 24, 43, 18, "2", 5); c.line(33, 23, 41, 19, "3", 1)   // handle
})

sprite("pot", { w: 44, h: 44, outline: "P", crop: true }, (c) => {
  // DS red enamel stock pot, chunky, glossy band under the rim, two side handles
  c.rect(7, 12, 30, 26, "C"); c.ellipse(22, 38, 15, 4, "C")
  slab(c, 7, 12, 30, 28)
  c.ellipse(22, 12, 16, 4, "D"); c.ellipse(22, 12, 13, 2, "B")   // rim + dark opening
  c.line(10, 17, 30, 17, "D", 2); c.line(11, 19, 20, 19, "E", 1)  // gloss band
  c.rect(1, 18, 7, 4, "B"); c.rect(36, 18, 7, 4, "B")            // handles
  c.light([1, 18, 6, 2], 1, 0.6); c.light([36, 18, 6, 2], 1, 0.6)
  c.shade([30, 24, 7, 14], 1, 0.6)
})

sprite("lid", { w: 44, h: 44, outline: "S", crop: true }, (c) => {
  c.ellipse(22, 28, 19, 12, "Z"); c.rect(0, 29, 44, 15, "_")   // dome = top half
  c.ellipse(22, 28, 19, 3, "e")                                // brim
  c.light([6, 18, 16, 8], 1, 0.6); c.line(9, 22, 17, 18, "!", 2)
  c.shade([24, 20, 16, 9], 1, 0.5)
  c.ellipse(22, 14, 4, 3, "2"); c.rect(21, 15, 2, 3, "2"); c.px(21, 13, "4")   // knob
})

sprite("stove", { w: 44, h: 44, outline: "S", crop: true }, (c) => {
  // single gas burner: dark hob, steel grate ring, red knob at the front
  c.rect(2, 10, 40, 26, "2"); c.ellipse(2, 23, 3, 13, "2"); c.ellipse(41, 23, 3, 13, "2")
  slab(c, 0, 10, 44, 26)
  c.ellipse(22, 22, 14, 8, "e", true); c.ellipse(22, 22, 9, 5, "e", true)   // grate rings
  for (const [x0, y0, x1, y1] of [[8, 22, 13, 22], [31, 22, 36, 22], [22, 14, 22, 17], [22, 27, 22, 30]]) c.line(x0, y0, x1, y1, "e", 1)
  c.light([8, 14, 10, 4], 1, 0.6)
  c.rect(2, 36, 40, 5, "1"); c.ellipse(2, 38, 3, 3, "1"); c.ellipse(41, 38, 3, 3, "1")   // front face
  c.circ(22, 38, 2, "C"); c.px(22, 37, "D")   // knob
})

// ---- tableware ----------------------------------------------------------------

sprite("plate", { w: 44, h: 44, outline: "S", crop: true }, (c) => {
  // white plate, blue rim, seen from above-front
  c.ellipse(22, 24, 21, 13, "v"); c.ellipse(22, 24, 21, 13, "o", true)
  c.ellipse(22, 24, 19, 11, "w"); c.ellipse(22, 24, 14, 8, "v")
  c.shade([24, 30, 16, 6], 1, 0.25); c.light([6, 13, 18, 8], 1, 0.35)
  c.line(8, 18, 16, 14, "w", 2)
  c.ellipse(22, 37, 12, 2, "u")   // foot shadow
})

sprite("bowl", { w: 44, h: 44, outline: "S", crop: true }, (c) => {
  // blue ceramic bowl: elliptical opening, round belly, small foot
  c.ellipse(22, 28, 17, 11, "o"); c.rect(0, 0, 44, 17, "_")
  c.ellipse(22, 17, 17, 6, "o")                            // rim
  volume(c, 22, 26, 16)
  c.ellipse(22, 17, 14, 4, "y"); c.ellipse(22, 18, 11, 2, "t")   // inside
  c.line(8, 15, 16, 12, "t", 2)
  c.rect(14, 38, 16, 4, "n"); c.ellipse(22, 42, 8, 2, "n")   // foot
})

sprite("cup", { w: 44, h: 44, outline: "S", crop: true }, (c) => {
  c.rect(8, 10, 24, 28, "v"); c.ellipse(20, 38, 12, 3, "v")   // mug body
  slab(c, 8, 10, 24, 30)
  c.ellipse(20, 10, 12, 4, "w"); c.ellipse(20, 10, 10, 2, "u")   // opening
  c.rect(8, 22, 24, 5, "o"); c.light([8, 22, 8, 2], 1, 0.6)    // blue band
  c.ellipse(34, 24, 7, 9, "v"); c.ellipse(34, 24, 4, 6, "_"); c.rect(27, 14, 6, 21, "_"); c.rect(31, 14, 2, 21, "v")   // D handle
  c.shade([34, 26, 8, 8], 1, 0.4)
  c.line(12, 14, 12, 32, "w", 2)
})

// ---- effects ------------------------------------------------------------------

for (let i = 0; i < 3; i++) {
  sprite("flame_" + i, { w: 44, h: 44, outline: "V", crop: true }, (c) => {
    const tip = 8 - i * 3, lean = (i - 1) * 4
    c.poly([10, 42, 22 + lean, tip, 34, 42], "G")
    c.ellipse(22, 34, 13, 9, "G")
    c.poly([14, 42, 22 + lean * 0.6, tip + 10, 30, 42], "H")
    c.ellipse(22, 36, 9, 6, "H")
    c.poly([17, 42, 22 + lean * 0.3, tip + 19, 27, 42], "I")
    c.ellipse(22, 38, 5, 4, "m")
    c.light([13, 28, 9, 8], 1, 0.5)
    c.px(14 - lean, 24 - i * 3, "I"); c.px(31 + lean, 20 + i * 2, "H")   // sparks
  })
}

sprite("steam", { w: 44, h: 44, crop: true }, (c) => {
  for (const [x, y, r, k] of [[12, 30, 8, "a"], [26, 24, 10, "a"], [20, 12, 7, "a"], [34, 12, 6, "a"]]) c.circ(x, y, r, k)
  for (const [x, y, r] of [[14, 29, 5], [27, 23, 7], [21, 11, 4]]) c.circ(x, y, r, "b")
  c.circ(25, 21, 3, "c"); c.circ(13, 27, 2, "c")
})

sprite("smoke", { w: 44, h: 44, crop: true }, (c) => {
  for (const [x, y, r] of [[12, 32, 9], [27, 26, 11], [19, 12, 8], [35, 12, 6]]) c.circ(x, y, r, "f")
  for (const [x, y, r] of [[12, 31, 6], [27, 25, 8], [19, 11, 5]]) c.circ(x, y, r, "g")
  c.circ(24, 22, 4, "h"); c.circ(16, 9, 2, "h")
})

sprite("bubble", { w: 44, h: 44, crop: true }, (c) => {
  c.circ(22, 22, 9, "a"); c.ring(22, 22, 9, "b"); c.ring(22, 22, 10, "W")
  c.line(16, 20, 18, 17, "c", 2); c.px(26, 27, "b")
})

sprite("drop", { w: 44, h: 44, outline: "W", crop: true }, (c) => {
  c.poly([22, 6, 32, 26, 12, 26], "t"); c.circ(22, 28, 10, "t")
  volume(c, 22, 27, 10)
  c.line(17, 26, 18, 20, "y", 2)
})

sprite("splash", { w: 44, h: 44, crop: true }, (c) => {
  c.ellipse(22, 36, 18, 5, "t"); c.ellipse(22, 36, 12, 3, "y")
  for (const [x0, y0, x1, y1] of [[10, 34, 4, 18], [22, 34, 22, 10], [34, 34, 40, 18], [15, 33, 12, 24], [29, 33, 32, 24]]) c.line(x0, y0, x1, y1, "t", 2)
  for (const [x, y] of [[4, 15], [22, 7], [40, 15], [12, 21], [32, 21]]) c.circ(x, y, 2, "y")
  c.px(3, 14, "w"); c.px(21, 6, "w"); c.px(39, 14, "w")
})

sprite("piece", { w: 44, h: 44, outline: "S", crop: true }, (c) => {
  // a generic chopped chunk: a cream wedge with a cut face
  c.poly([8, 30, 20, 10, 36, 16, 34, 34, 14, 38], "v")
  volume(c, 22, 24, 13)
  c.poly([20, 10, 36, 16, 30, 20, 18, 16], "w")   // cut face catches the light
  c.line(12, 30, 14, 20, "u", 1)
})

// ---- UI marks and hints -------------------------------------------------------

sprite("mark_ok", { w: 44, h: 44, outline: "Q", crop: true }, (c) => {
  c.line(8, 24, 18, 34, "q", 7); c.line(18, 34, 38, 10, "q", 7)
  c.shade([14, 28, 26, 12], 1, 0.4)
  c.line(9, 22, 17, 30, "s", 2); c.line(19, 29, 35, 11, "s", 2)
})

sprite("mark_miss", { w: 44, h: 44, outline: "P", crop: true }, (c) => {
  c.line(10, 10, 34, 34, "C", 7); c.line(34, 10, 10, 34, "C", 7)
  c.shade([12, 24, 28, 14], 1, 0.4)
  c.line(12, 10, 20, 18, "E", 2); c.line(32, 10, 26, 16, "E", 2)
})

// DS-style blue double arrows for the swipe hints.
sprite("hint_v", { w: 44, h: 44, outline: "S", crop: true }, (c) => {
  c.line(22, 10, 22, 34, "o", 5)
  c.poly([12, 12, 22, 1, 32, 12], "o"); c.poly([12, 32, 22, 43, 32, 32], "o")
  c.light([10, 0, 12, 44], 1, 0.5); c.line(20, 12, 20, 30, "y", 1)
})
sprite("hint_h", { base: "hint_v", rot: 90 })

sprite("hint_circle", { w: 44, h: 44, outline: "S", crop: true }, (c) => {
  c.ring(22, 22, 15, "o"); c.ring(22, 22, 14, "o"); c.ring(22, 22, 13, "o"); c.ring(22, 22, 16, "o")
  c.poly([22, 1, 40, 1, 40, 22, 22, 22], "_")                 // gap in the top-right quadrant
  c.poly([22, 1, 36, 8, 28, 16], "o")                          // arrowhead
  c.light([4, 4, 18, 18], 1, 0.5); c.ring(22, 22, 14, "y")
  c.poly([22, 1, 40, 1, 40, 22, 22, 22], "_"); c.poly([22, 1, 36, 8, 28, 16], "o"); c.px(24, 4, "y")
})
