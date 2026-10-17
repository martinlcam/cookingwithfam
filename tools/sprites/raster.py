"""Tiny pixel-art raster lib. Shapes -> masks -> shaded, outlined parts -> PNG.

Every part gets: base colour, auto bottom-right shadow rim, small top-left
highlight, and a 1px inward outline. That is the whole Cooking Mama look:
thick dark outlines, flat pastel fills, one highlight blob.
"""
from __future__ import annotations
import colorsys, math
from PIL import Image

OUTLINE = (58, 33, 24)

# Render scale. Item definitions are written in 32x32 space; K=2 renders the same
# shapes at 64x64 with 2px outlines and proportionally deeper shading.
K = 1
def set_scale(k: int):
    global K
    K = k

def _clamp(v): return max(0, min(255, int(round(v))))

def shift(rgb, dl, ds=0.0):
    r, g, b = [c / 255 for c in rgb]
    h, l, s = colorsys.rgb_to_hls(r, g, b)
    l = max(0, min(1, l + dl)); s = max(0, min(1, s + ds))
    r, g, b = colorsys.hls_to_rgb(h, l, s)
    return (_clamp(r * 255), _clamp(g * 255), _clamp(b * 255))

def hi(rgb): return shift(rgb, 0.18, -0.05)
def sh(rgb): return shift(rgb, -0.16, 0.05)

# ---- masks (sets of (x, y)) ----------------------------------------------

def ellipse(cx, cy, rx, ry, size=32):
    cx, cy, rx, ry, size = cx * K, cy * K, rx * K, ry * K, size * K
    m = set()
    for y in range(size):
        for x in range(size):
            dx = (x + 0.5 - cx) / rx; dy = (y + 0.5 - cy) / ry
            if dx * dx + dy * dy <= 1.0: m.add((x, y))
    return m

def circle(cx, cy, r, size=32): return ellipse(cx, cy, r, r, size)

def rect(x0, y0, x1, y1, size=32):
    x0, y0, x1, y1, size = x0 * K, y0 * K, x1 * K, y1 * K, size * K
    return {(x, y) for y in range(max(0, int(y0)), min(size, int(y1))) for x in range(max(0, int(x0)), min(size, int(x1)))}

def rrect(x0, y0, x1, y1, r, size=32):
    """Rounded rect, r in px."""
    x0, y0, x1, y1, r, size = x0 * K, y0 * K, x1 * K, y1 * K, r * K, size * K
    m = set()
    for y in range(size):
        for x in range(size):
            px, py = x + 0.5, y + 0.5
            if not (x0 <= px <= x1 and y0 <= py <= y1): continue
            qx = max(x0 + r - px, px - (x1 - r), 0); qy = max(y0 + r - py, py - (y1 - r), 0)
            if qx * qx + qy * qy <= r * r: m.add((x, y))
    return m

def poly(pts, size=32):
    pts = [(x * K, y * K) for x, y in pts]; size = size * K
    m = set(); n = len(pts)
    for y in range(size):
        for x in range(size):
            px, py = x + 0.5, y + 0.5; inside = False
            for i in range(n):
                x0, y0 = pts[i]; x1, y1 = pts[(i + 1) % n]
                if (y0 > py) != (y1 > py):
                    xi = x0 + (py - y0) * (x1 - x0) / (y1 - y0)
                    if px < xi: inside = not inside
            if inside: m.add((x, y))
    return m

def line(x0, y0, x1, y1, w=1.0, size=32):
    x0, y0, x1, y1, w, size = x0 * K, y0 * K, x1 * K, y1 * K, w * K, size * K
    m = set(); r = w / 2
    for y in range(size):
        for x in range(size):
            px, py = x + 0.5, y + 0.5
            dx, dy = x1 - x0, y1 - y0; L2 = dx * dx + dy * dy
            t = 0 if L2 == 0 else max(0, min(1, ((px - x0) * dx + (py - y0) * dy) / L2))
            qx, qy = x0 + t * dx - px, y0 + t * dy - py
            if qx * qx + qy * qy <= r * r: m.add((x, y))
    return m

def ring(cx, cy, r_out, r_in, size=32): return circle(cx, cy, r_out, size) - circle(cx, cy, r_in, size)

def pxs(*pts):
    """Single pixels in 32-space; each becomes a KxK block."""
    return {(x * K + i, y * K + j) for x, y in pts for i in range(K) for j in range(K)}

def translate(m, dx, dy): return {(x + dx * K, y + dy * K) for x, y in m}

def inflate(m):
    out = set(m)
    for x, y in m: out |= {(x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)}
    return out

def edge(m):
    """Pixels of m with a 4-neighbour outside m."""
    return {(x, y) for x, y in m if not all(n in m for n in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)))}

# ---- canvas ----------------------------------------------------------------

class Canvas:
    def __init__(self, w=32, h=32):
        self.w, self.h = w, h
        self.px: dict[tuple[int, int], tuple[int, int, int]] = {}

    def _in(self, p): return 0 <= p[0] < self.w and 0 <= p[1] < self.h

    def fill(self, m, color):
        for p in m:
            if self._in(p): self.px[p] = color

    def part(self, m, color, shade=2, light=True, outline=True, light_at=None, outline_color=None, shade_dir=(1, 1), dome=1.0, levels=7):
        """Draw a rounded, lit blob (the Cooking Mama look: soft volume, dark edge, highlight).

        shade=0 gives a flat fill. `dome` controls how puffy the volume is (0.5 flat-ish, 1.5 ball).
        outline_color defaults to a darker shade of the fill, like the DS art, not black.
        """
        if not m: return
        m = {p for p in m if self._in(p)}
        if not m: return
        oc = outline_color if outline_color is not None else shift(color, -0.32, 0.1)
        if shade == 0:
            self.fill(m, color)
            if outline: self.fill(self._rim(m, K), oc)
            return
        # distance to edge by BFS
        D = {p: 0 for p in edge(m)}
        frontier = list(D)
        while frontier:
            nxt = []
            for x, y in frontier:
                for q in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)):
                    if q in m and q not in D:
                        D[q] = D[(x, y)] + 1; nxt.append(q)
            frontier = nxt
        dmax = max(D.values()) + 1
        xs = [p[0] for p in m]; ys = [p[1] for p in m]
        cx, cy = (min(xs) + max(xs)) / 2, (min(ys) + max(ys)) / 2
        r = max(1.0, ((max(xs) - min(xs)) ** 2 + (max(ys) - min(ys)) ** 2) ** 0.5 / 2)
        lx, ly = -0.6, -0.8
        bands = [shift(color, -0.3, 0.1), shift(color, -0.16, 0.06), color, shift(color, 0.1, -0.03), shift(color, 0.2, -0.06)]
        # specular spot: top-left, size relative to the blob
        sx, sy = cx + lx * r * 0.42, cy + ly * r * 0.42
        srx, sry = max(1.0, r * 0.16), max(1.0, r * 0.11)
        for (x, y) in m:
            u = ((x - cx) * lx + (y - cy) * ly) / r          # -1 (shadow side) .. 1 (lit side)
            d = min(1.0, D[(x, y)] / dmax)                  # 0 edge .. 1 centre
            v = 0.52 + 0.38 * u * dome + 0.3 * (d - 0.4)
            idx = 0 if v < 0.32 else 1 if v < 0.48 else 2 if v < 0.68 else 3 if v < 0.86 else 4
            c = bands[idx]
            if light and ((x + 0.5 - sx) / srx) ** 2 + ((y + 0.5 - sy) / sry) ** 2 <= 1.0 and D[(x, y)] >= K:
                c = bands[4] if idx < 4 else (255, 255, 255)
                c = tuple(_clamp(ch + (255 - ch) * 0.5) for ch in c)
            self.px[(x, y)] = c
        if outline: self.fill(self._rim(m, K), oc)

    def _rim(self, m, k):
        rim = set(); inner = set(m)
        for _ in range(k):
            e = edge(inner); rim |= e; inner = inner - e
        return rim

    def stroke(self, m, color): self.fill(m, color)

    def image(self):
        im = Image.new("RGBA", (self.w, self.h), (0, 0, 0, 0))
        for (x, y), c in self.px.items(): im.putpixel((x, y), (*c, 255))
        return im
