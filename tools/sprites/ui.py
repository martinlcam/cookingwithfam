"""UI chrome: nine-slice panels, buttons, meters, medals, icons."""
from raster import *
from palette import P

UI = {}  # name -> (w, h, fn)
def ui(name, w, h):
    def deco(fn): UI[name] = (w, h, fn); return fn
    return deco

def framed(c, w, h, fill, border, border_w=2, r=5, inner_hi=True):
    """Cream panel look: outline, coloured border band, highlight line, fill."""
    outer = rrect(0, 0, w, h, r, max(w, h))
    c.fill(outer, border)
    c.fill(edge(outer), OUTLINE)
    inner = rrect(1 + border_w, 1 + border_w, w - 1 - border_w, h - 1 - border_w, max(1, r - border_w), max(w, h))
    c.fill(inner, fill)
    c.fill(edge(inner), OUTLINE)
    if inner_hi:
        core = inner - edge(inner)
        top = {(x, y) for x, y in core if (x, y - 1) not in core or (x - 1, y) not in core}
        c.fill(top, hi(fill))

# --- nine-slice panels (32x32, slice at 10px) ---
@ui("panel", 32, 32)
def _(c): framed(c, 32, 32, P["cream"], P["pink"], border_w=3, r=7)

@ui("panel_white", 32, 32)
def _(c): framed(c, 32, 32, P["white"], P["cream"], border_w=2, r=7)

@ui("panel_dark", 32, 32)
def _(c): framed(c, 32, 32, P["black"], P["dkgrey"], border_w=2, r=7, inner_hi=False)

@ui("card", 32, 32)
def _(c):
    body = rrect(0, 0, 32, 32, 6)
    c.fill(body, P["cream"]); c.fill(edge(body), OUTLINE)
    core = body - edge(body)
    c.fill({(x, y) for x, y in core if (x, y - 1) not in core}, P["white"])
    c.fill({(x, y) for x, y in core if (x, y + 1) not in core or (x + 1, y) not in core}, sh(P["cream"]))

@ui("bubble", 32, 32)
def _(c):
    body = rrect(0, 0, 32, 32, 8)
    c.fill(body, P["white"]); c.fill(edge(body), OUTLINE)
    core = body - edge(body)
    c.fill({(x, y) for x, y in core if (x, y + 1) not in core or (x + 1, y) not in core}, P["cream"])

@ui("bubble_tail", 16, 16)
def _(c):
    t = poly([(2, 0), (14, 0), (6, 14)], 16)
    c.fill(t, P["white"]); c.fill(edge(t) - rect(3, 0, 13, 1, 16), OUTLINE)

def button(c, color, pressed=False):
    body = rrect(0, 0, 32, 32, 8)
    base = sh(color) if pressed else color
    c.fill(body, base); c.fill(edge(body), OUTLINE)
    core = body - edge(body)
    if pressed:
        c.fill({(x, y) for x, y in core if (x, y - 1) not in core or (x, y - 2) not in core}, sh(base))
    else:
        c.fill({(x, y) for x, y in core if (x, y + 1) not in core or (x, y + 2) not in core or (x, y + 3) not in core}, sh(color))
        c.fill({(x, y) for x, y in core if (x, y - 1) not in core or (x - 1, y) not in core}, hi(color))
        c.fill({(x, y) for x, y in core if (x, y - 2) not in core and (x, y - 1) in core and 3 < x < 28}, hi(color))

@ui("btn_pink", 32, 32)
def _(c): button(c, P["hotpink"])
@ui("btn_pink_down", 32, 32)
def _(c): button(c, P["hotpink"], True)
@ui("btn_green", 32, 32)
def _(c): button(c, P["green"])
@ui("btn_green_down", 32, 32)
def _(c): button(c, P["green"], True)
@ui("btn_blue", 32, 32)
def _(c): button(c, P["sky"])
@ui("btn_blue_down", 32, 32)
def _(c): button(c, P["sky"], True)
@ui("btn_yellow", 32, 32)
def _(c): button(c, P["yellow"])
@ui("btn_yellow_down", 32, 32)
def _(c): button(c, P["yellow"], True)
@ui("btn_grey", 32, 32)
def _(c): button(c, P["grey"])

# --- meters (nine-slice frame 16x16, fills 8x16) ---
@ui("meter_frame", 16, 16)
def _(c):
    body = rrect(0, 0, 16, 16, 5, 16)
    c.fill(body, P["white"]); c.fill(edge(body), OUTLINE)
    inner = rrect(2, 2, 14, 14, 3, 16)
    c.fill(inner, P["black"]); c.fill(edge(inner), sh(P["black"]))

def meter_fill(c, color):
    c.fill(rect(0, 0, 8, 16, 16), color)
    c.fill(rect(0, 3, 8, 5, 16), hi(color))
    c.fill(rect(0, 11, 8, 13, 16), sh(color))

@ui("fill_green", 8, 16)
def _(c): meter_fill(c, P["green"])
@ui("fill_yellow", 8, 16)
def _(c): meter_fill(c, P["yellow"])
@ui("fill_red", 8, 16)
def _(c): meter_fill(c, P["tomato"])
@ui("fill_pink", 8, 16)
def _(c): meter_fill(c, P["hotpink"])
@ui("fill_blue", 8, 16)
def _(c): meter_fill(c, P["sky"])

@ui("sweet_spot", 8, 16)
def _(c):
    c.fill(rect(0, 0, 8, 16, 16), P["gold"])
    c.fill(rect(0, 0, 8, 2, 16) | rect(0, 14, 8, 16, 16), OUTLINE)
    c.fill(rect(0, 3, 8, 5, 16), hi(P["gold"]))

# --- medals ---
def medal(c, color):
    rib = poly([(9, 0), (23, 0), (23, 12), (16, 16), (9, 12)])
    c.part(rib, P["red"], shade=1, light=False)
    c.stroke(line(16, 1, 16, 14, 2) & (rib - edge(rib)), P["tomato"])
    c.part(circle(16, 20, 10.5), color, shade=3)
    c.part(circle(16, 20, 7), color, shade=0, light=False, outline_color=sh(color))
    star = poly([(16, 14.5), (17.7, 18.3), (21.8, 18.5), (18.6, 21.2), (19.6, 25.3), (16, 23), (12.4, 25.3), (13.4, 21.2), (10.2, 18.5), (14.3, 18.3)])
    c.fill(star, hi(color))

@ui("medal_gold", 32, 32)
def _(c): medal(c, P["gold"])
@ui("medal_silver", 32, 32)
def _(c): medal(c, P["silver"])
@ui("medal_bronze", 32, 32)
def _(c): medal(c, P["bronze"])

# --- small icons 16x16 ---
def star_pts(cx, cy, r1, r2):
    pts = []
    for i in range(10):
        a = -math.pi / 2 + i * math.pi / 5; r = r1 if i % 2 == 0 else r2
        pts.append((cx + r * math.cos(a), cy + r * math.sin(a)))
    return pts

@ui("star", 16, 16)
def _(c): c.part(poly(star_pts(8, 8.5, 7.8, 3.6), 16), P["yellow"], shade=1, light=False)
@ui("star_off", 16, 16)
def _(c): c.part(poly(star_pts(8, 8.5, 7.8, 3.6), 16), P["grey"], shade=1, light=False)
@ui("star_big", 32, 32)
def _(c): c.part(poly(star_pts(16, 17, 15.5, 7.2)), P["yellow"], shade=2)

@ui("heart", 16, 16)
def _(c):
    h = circle(5, 5.5, 4.2, 16) | circle(11, 5.5, 4.2, 16) | poly([(1.2, 7), (14.8, 7), (8, 15)], 16)
    c.part(h, P["hotpink"], shade=1, light=False)
    c.stroke(pxs((4, 4), (5, 3)), hi(P["hotpink"]))

@ui("check", 16, 16)
def _(c): c.part(line(3, 8, 7, 12, 3, 16) | line(7, 12, 13, 4, 3, 16), P["green"], shade=0, light=False)
@ui("cross", 16, 16)
def _(c): c.part(line(3, 3, 13, 13, 3, 16) | line(13, 3, 3, 13, 3, 16), P["tomato"], shade=0, light=False)
@ui("plus", 16, 16)
def _(c): c.part(rect(6, 2, 10, 14, 16) | rect(2, 6, 14, 10, 16), P["white"], shade=0, light=False)
@ui("minus", 16, 16)
def _(c): c.part(rect(2, 6, 14, 10, 16), P["white"], shade=0, light=False)
@ui("arrow_r", 16, 16)
def _(c): c.part(poly([(3, 2), (14, 8), (3, 14)], 16), P["white"], shade=0, light=False)
@ui("arrow_l", 16, 16)
def _(c): c.part(poly([(13, 2), (2, 8), (13, 14)], 16), P["white"], shade=0, light=False)
@ui("arrow_down", 16, 16)
def _(c): c.part(poly([(2, 3), (14, 3), (8, 14)], 16), P["white"], shade=0, light=False)

@ui("clock", 16, 16)
def _(c):
    c.part(circle(8, 8, 7.5, 16), P["white"], shade=1, light=False)
    c.stroke(line(8, 8, 8, 4, 1, 16) | line(8, 8, 11, 10, 1, 16), OUTLINE)
    c.stroke(pxs((8, 8)), P["tomato"])

@ui("camera", 32, 32)
def _(c):
    body = rrect(2, 9, 30, 28, 4)
    c.part(body, P["sky"], shade=3)
    c.part(rrect(10, 5, 22, 11, 2), P["sky"], shade=1, light=False)
    c.part(circle(16, 19, 6.5), P["white"], shade=1, light=False)
    c.part(circle(16, 19, 3.5), P["navy"], shade=0, light=False, outline=False)
    c.stroke(pxs((15, 17)), P["white"])
    c.stroke(rect(5, 12, 8, 14), P["white"])

@ui("sparkle", 8, 8)
def _(c):
    c.fill(rect(3, 0, 5, 8, 8) | rect(0, 3, 8, 5, 8), P["white"])
    c.fill(rect(3, 3, 5, 5, 8), P["lemon"])

@ui("hand", 32, 32)
def _(c):
    """Pointing finger, for tutorial hints."""
    palm = rrect(9, 14, 25, 30, 5)
    finger = rrect(12, 2, 18, 18, 3)
    c.part(palm | finger, P["peach"], shade=2)
    c.stroke(line(18, 15, 18, 20, 1) | line(21, 16, 21, 21, 1), sh(P["peach"]))

@ui("mama_placeholder", 32, 32)
def _(c):
    """Blank face token so layout can be built before the character is drawn."""
    c.part(circle(16, 16, 13), P["pink"], shade=2)
    c.stroke(pxs((12, 14), (20, 14)), OUTLINE)
    c.stroke(line(12, 20, 20, 20, 1), OUTLINE)


# --- background tiles (tileable 16x16) ---
@ui("bg_tile", 16, 16)
def _(c):
    c.fill(rect(0, 0, 16, 16, 16), (255, 221, 234))
    c.fill(rect(0, 0, 16, 1, 16) | rect(0, 0, 1, 16, 16), (255, 240, 246))
    c.fill(rect(0, 15, 16, 16, 16) | rect(15, 0, 16, 16, 16), (236, 180, 204))

@ui("bg_tile_blue", 16, 16)
def _(c):
    c.fill(rect(0, 0, 16, 16, 16), (214, 238, 252))
    c.fill(rect(0, 0, 16, 1, 16) | rect(0, 0, 1, 16, 16), (240, 250, 255))
    c.fill(rect(0, 15, 16, 16, 16) | rect(15, 0, 16, 16, 16), (170, 205, 230))

@ui("bg_counter", 16, 16)
def _(c):
    c.fill(rect(0, 0, 16, 16, 16), P["tan"])
    c.fill(rect(0, 0, 16, 1, 16), hi(P["tan"]))
    c.fill(rect(0, 7, 16, 8, 16), sh(P["tan"]))
    c.fill(rect(0, 15, 16, 16, 16), sh(P["tan"]))
    c.fill(pxs((3, 3), (4, 3), (11, 11), (12, 11), (8, 5)), sh(P["tan"]))

@ui("bg_check", 16, 16)
def _(c):
    c.fill(rect(0, 0, 16, 16, 16), P["cream"])
    c.fill(rect(0, 0, 8, 8, 16) | rect(8, 8, 16, 16, 16), (255, 236, 200))

@ui("counter_edge", 16, 16)
def _(c):
    c.fill(rect(0, 0, 16, 16, 16), P["dkbrown"])
    c.fill(rect(0, 0, 16, 2, 16), OUTLINE)
    c.fill(rect(0, 2, 16, 4, 16), hi(P["dkbrown"]))
    c.fill(rect(0, 12, 16, 16, 16), sh(P["dkbrown"]))

@ui("shadow", 32, 16)
def _(c):
    c.fill(ellipse(16, 8, 14, 5, 32) & rect(0, 0, 32, 16, 32), (120, 60, 60))

@ui("dot_pink", 8, 8)
def _(c): c.part(circle(4, 4, 3.6, 8), P["hotpink"], shade=0, light=False)
@ui("dot_grey", 8, 8)
def _(c): c.part(circle(4, 4, 3.6, 8), P["grey"], shade=0, light=False)

@ui("board", 32, 32)
def _(c):
    """Nine-slice cutting board so minigames can stretch it cleanly."""
    body = rrect(0, 0, 32, 32, 6)
    c.fill(body, P["tan"]); c.fill(edge(body), OUTLINE)
    core = body - edge(body)
    c.fill({(x, y) for x, y in core if (x, y - 1) not in core}, hi(P["tan"]))
    c.fill({(x, y) for x, y in core if (x, y + 1) not in core or (x, y + 2) not in core}, sh(P["tan"]))
    c.fill(rect(2, 11, 30, 12), sh(P["tan"])); c.fill(rect(2, 21, 30, 22), sh(P["tan"]))
