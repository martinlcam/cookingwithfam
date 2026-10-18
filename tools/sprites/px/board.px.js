// Big cutting board for the swipe minigames, drawn as one sprite (not a nine-slice): a thick
// wooden board seen from above-front with end grain, a bevelled edge, a hanging hole and a
// few knife scores. 160x76, shown at 2x.
pal({
  o: "#5a3418", // dark edge
  d: "#9c6230", // shadow face
  m: "#c98a4c", // top face
  l: "#e2ab6b", // light grain
  h: "#f1c88c", // highlight
  s: "#7a4a22", // knife scores / hole
  k: "#3a2010", // hole inside
})
ramps("odmlh")

sprite("board_big", { w: 160, h: 76, outline: "o", crop: true }, (c) => {
  // front edge (thickness) and the top face
  c.rect(2, 58, 156, 14, "d")
  c.rect(2, 4, 156, 56, "m")
  // rounded corners: knock out the four corner pixels
  for (const [x, y] of [[2, 4], [157, 4], [2, 71], [157, 71]]) { c.px(x, y, "_"); c.px(x + (x < 80 ? 1 : -1), y, "_"); c.px(x, y + (y < 40 ? 1 : -1), "_") }
  // long grain lines across the top, slightly wavy
  for (let i = 0; i < 9; i++) {
    const y = 9 + i * 6, off = (i % 3) - 1
    c.line(6, y, 60, y + off, "l", 1); c.line(60, y + off, 110, y, "l", 1); c.line(110, y, 152, y - off, "l", 1)
    if (i % 2 === 0) c.line(20 + i * 6, y + 3, 70 + i * 6, y + 3, "d", 1)
  }
  // bevel: light top/left edge, dark bottom/right of the top face
  c.rect(2, 4, 156, 2, "h"); c.rect(2, 4, 2, 54, "h")
  c.rect(2, 56, 156, 2, "d"); c.rect(156, 4, 2, 54, "d")
  // end-grain stripes on the front edge
  for (let x = 6; x < 156; x += 8) c.vline(x, 59, 12, "o")
  // hanging hole, top-right
  c.circ(146, 14, 4, "o"); c.circ(146, 14, 3, "k"); c.px(144, 12, "s")
  // old knife scores
  c.line(30, 30, 58, 24, "s", 1); c.line(70, 40, 100, 34, "s", 1); c.line(44, 46, 62, 44, "s", 1)
})

// Tileable counter planks (32x32) and the counter's front lip (32x16), same wood.
sprite("bg_counter", { w: 32, h: 32 }, (c) => {
  c.rect(0, 0, 32, 32, "m")
  // two planks per tile with a dark seam, offset joints
  c.hline(0, 15, 32, "d"); c.hline(0, 16, 32, "o"); c.hline(0, 31, 32, "o"); c.hline(0, 30, 32, "d")
  c.vline(23, 16, 15, "o")  // one joint per tile pair, so it reads as long planks, not brick
  // grain
  for (const [x, y, len] of [[1, 4, 6], [12, 7, 14], [27, 3, 4], [2, 11, 5], [15, 12, 9], [0, 21, 7], [10, 19, 10], [25, 24, 6], [4, 27, 8], [17, 26, 5]]) c.hline(x, y, len, "l")
  for (const [x, y, len] of [[3, 8, 4], [19, 9, 6], [6, 23, 5], [26, 20, 4]]) c.hline(x, y, len, "d")
  // nails at the joints
  c.px(2, 2, "s"); c.px(2, 12, "s"); c.px(26, 18, "s"); c.px(26, 28, "s")
})

sprite("counter_edge", { w: 32, h: 16 }, (c) => {
  c.rect(0, 0, 32, 16, "d")
  c.rect(0, 0, 32, 2, "o"); c.rect(0, 2, 32, 2, "h"); c.rect(0, 4, 32, 1, "l")
  c.rect(0, 12, 32, 4, "o")
  for (let x = 2; x < 32; x += 8) c.vline(x, 5, 7, "o")
})

