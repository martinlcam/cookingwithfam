"""Ingredient and tool icons, 32x32. Each function draws onto a Canvas."""
import raster
from raster import *
from palette import P

def core(m):
    """Mask minus its outline band (K px)."""
    for _ in range(raster.K): m = m - edge(m)
    return m


ITEMS = {}
def item(name):
    def deco(fn): ITEMS[name] = fn; return fn
    return deco

# ------------------------------------------------------------- ingredients
@item("tomato")
def _(c):
    c.part(circle(16, 18, 11.5), P["tomato"], shade=3)
    leaves = poly([(16, 6), (19, 11), (24, 9), (20, 13), (23, 16), (16, 13), (9, 16), (12, 13), (8, 9), (13, 11)])
    c.part(leaves, P["dkgreen"], shade=1, light=False)
    c.part(rect(15, 3, 17, 8), P["dkgreen"], shade=0, light=False)

@item("onion")
def _(c):
    body = ellipse(16, 18, 11, 10.5) | poly([(10, 12), (16, 3), (22, 12)])
    c.part(body, P["sand"], shade=3)
    for x in (12, 16, 20):
        c.stroke(line(x, 9 if x == 16 else 13, x, 27, 1) & (core(body)), sh(P["sand"]))
    c.part(poly([(13, 28), (19, 28), (17, 31), (15, 31)]), P["tan"], shade=0, light=False)

@item("egg")
def _(c):
    body = ellipse(16, 18, 9.5, 11) | ellipse(16, 14, 7.5, 10)
    c.part(body, P["white"], shade=3)

@item("carrot")
def _(c):
    body = poly([(10, 10), (22, 10), (17, 30), (15, 30)]) | ellipse(16, 10.5, 6, 3)
    c.part(body, P["orange"], shade=2)
    inner = core(body)
    for y in (15, 20, 25):
        c.stroke(line(13, y, 19, y, 1) & inner, sh(P["orange"]))
    for dx, ang in ((-5, 1), (0, 0), (5, -1)):
        c.part(poly([(16 + dx, 9), (16 + dx - 2 + ang, 1), (16 + dx + 2 + ang, 1)]), P["green"], shade=0, light=False)

@item("potato")
def _(c):
    body = ellipse(16, 17, 12, 9) | ellipse(12, 15, 8, 8) | ellipse(21, 19, 7, 7)
    c.part(body, P["tan"], shade=3)
    for x, y in ((11, 13), (19, 21), (22, 14), (14, 22)):
        c.stroke(pxs((x, y), (x + 1, y)), sh(P["tan"]))

@item("garlic")
def _(c):
    body = ellipse(16, 20, 11, 9) | poly([(9, 16), (16, 3), (23, 16)])
    c.part(body, P["cream"], shade=3)
    inner = core(body)
    c.stroke(line(16, 8, 16, 28, 1) & inner, sh(P["cream"]))
    c.stroke(line(11, 14, 12, 28, 1) & inner, sh(P["cream"]))
    c.stroke(line(21, 14, 20, 28, 1) & inner, sh(P["cream"]))

@item("pepper")
def _(c):
    body = ellipse(10, 19, 6.5, 10) | ellipse(22, 19, 6.5, 10) | ellipse(16, 18, 8, 11)
    c.part(body, P["green"], shade=3)
    c.part(rect(15, 3, 18, 9), P["dkgreen"], shade=0, light=False)

@item("mushroom")
def _(c):
    c.part(rrect(12, 16, 20, 29, 3), P["cream"], shade=2)
    cap = ellipse(16, 14, 12, 7.5) & rect(0, 0, 32, 16)
    cap |= rect(5, 14, 27, 17)
    c.part(cap, P["tan"], shade=2)
    c.stroke(pxs((11, 10), (12, 10), (11, 11), (19, 9), (20, 9), (15, 13)), hi(P["tan"]))

@item("cheese")
def _(c):
    body = poly([(3, 24), (29, 24), (29, 15), (16, 6), (3, 15)])
    c.part(body, P["yellow"], shade=3)
    c.part(rect(3, 24, 29, 28), P["gold"], shade=0, light=False)
    inner = core(body)
    for x, y, r in ((10, 18, 2), (20, 20, 1.6), (16, 13, 1.4)):
        c.stroke(circle(x, y, r) & inner, sh(P["yellow"]))

@item("bread")
def _(c):
    body = rrect(4, 11, 28, 27, 5) | ellipse(16, 12, 12, 5)
    c.part(body, P["tan"], shade=3)
    inner = core(body)
    for x in (10, 16, 22):
        c.stroke(line(x - 2, 10, x + 2, 15, 1.2) & inner, sh(P["tan"]))

@item("rice")
def _(c):
    mound = circle(16, 16, 9) & rect(0, 0, 32, 20)
    c.part(mound, P["white"], shade=2)
    for x, y in ((12, 12), (17, 10), (20, 14), (14, 16)): c.stroke(pxs((x, y)), sh(P["white"]))
    bowl = ellipse(16, 19, 12.5, 3.5) | (ellipse(16, 19, 12.5, 11) & rect(0, 19, 32, 32))
    c.part(bowl, P["blue"], shade=3, light_at=(9, 22))
    c.stroke((ellipse(16, 19, 10.5, 2) & rect(0, 0, 32, 20)) - edge(bowl), P["sky"])
@item("chicken")
def _(c):
    meat = ellipse(13, 15, 10, 9) | poly([(9, 20), (18, 22), (16, 25), (10, 23)])
    c.part(meat, P["tan"], shade=3)
    bone = line(20, 20, 26, 26, 3) | circle(27, 25, 2.5) | circle(25, 28, 2.5)
    c.part(bone, P["cream"], shade=1, light=False)

@item("fish")
def _(c):
    body = ellipse(14, 17, 11, 6.5)
    tail = poly([(23, 17), (30, 11), (29, 17), (30, 23)])
    c.part(tail, P["sky"], shade=1, light=False)
    c.part(body, P["sky"], shade=2)
    c.part(poly([(10, 11), (16, 7), (20, 11)]), P["sky"], shade=1, light=False)
    c.stroke(pxs((8, 15), (9, 15), (8, 16), (9, 16)), OUTLINE)
    c.stroke(pxs((9, 15)), P["white"])
    c.stroke(line(5, 20, 7, 22, 1), OUTLINE)
    c.stroke(line(14, 13, 15, 22, 1) & (core(body)), sh(P["sky"]))

@item("lettuce")
def _(c):
    base = circle(16, 17, 12)
    c.part(base, P["dkgreen"], shade=3, light=False)
    for cx, cy, r in ((10, 14, 6.5), (21, 13, 6), (16, 20, 7), (9, 21, 5), (23, 21, 5.5)):
        c.part(circle(cx, cy, r) & base, P["green"], shade=2)

@item("lemon")
def _(c):
    body = ellipse(16, 17, 11, 8) | circle(5.5, 17, 2.5) | circle(26.5, 17, 2.5)
    c.part(body, P["lemon"], shade=3)
    c.part(poly([(5, 10), (11, 7), (13, 11)]), P["green"], shade=0, light=False)

@item("apple")
def _(c):
    body = circle(12, 18, 8.5) | circle(20, 18, 8.5) | rect(10, 12, 22, 24)
    body -= circle(16, 8, 3)
    c.part(body, P["red"], shade=3)
    c.part(rect(15, 3, 17, 10), P["dkbrown"], shade=0, light=False)
    c.part(ellipse(21, 7, 4.5, 2.5), P["green"], shade=0, light=False)

@item("butter")
def _(c):
    top = poly([(8, 12), (14, 6), (29, 6), (23, 12)])
    front = rect(3, 12, 23, 24); side = poly([(23, 12), (29, 6), (29, 18), (23, 24)])
    c.part(side, sh(P["yellow"]), shade=0, light=False)
    c.part(top, hi(P["yellow"]), shade=0, light=False)
    c.part(front, P["yellow"], shade=2)

@item("milk")
def _(c):
    body = rect(9, 11, 23, 29); roof = poly([(9, 11), (16, 4), (23, 11)])
    c.part(roof, P["white"], shade=1, light=False)
    c.part(body, P["white"], shade=3)
    c.part(rect(10, 17, 22, 22), P["sky"], shade=0, light=False, outline=False)
    c.stroke(rect(16, 5, 17, 10), sh(P["white"]))

@item("flour")
def _(c):
    body = rrect(7, 9, 25, 29, 2)
    c.part(body, P["sand"], shade=3)
    c.part(rect(9, 5, 23, 10), P["sand"], shade=1, light=False)
    c.stroke(rect(11, 15, 21, 24), P["white"])
    c.stroke(rect(13, 18, 19, 19), P["blue"]); c.stroke(rect(14, 21, 18, 22), P["blue"])
@item("pasta")
def _(c):
    bundle = rect(9, 3, 24, 30)
    c.part(bundle, P["lemon"], shade=0, light=False)
    inner = core(bundle)
    for x in range(11, 23, 3): c.stroke(rect(x, 4, x + 1, 29) & inner, P["gold"])
    c.part(rect(6, 13, 26, 21), P["blue"], shade=1, light=False)
    c.stroke(rect(9, 15, 23, 19), P["white"])
    c.stroke(rect(11, 16, 21, 18), P["blue"])
@item("beef")
def _(c):
    fat = ellipse(16, 17, 12.5, 9.5) | ellipse(10, 14, 7, 7)
    c.part(fat, P["cream"], shade=1, light=False)
    meat = ellipse(16, 18, 10.5, 7.5) | ellipse(11, 15, 5.5, 5.5)
    c.part(meat, P["red"], shade=3)
    inner = core(meat)
    c.stroke(line(10, 20, 15, 15, 1) & inner, P["cream"]); c.stroke(line(16, 22, 23, 17, 1) & inner, P["cream"])

@item("shrimp")
def _(c):
    body = ring(16, 17, 11, 5.5) & rect(0, 6, 24, 30)
    body |= circle(14, 7, 4)
    tail = poly([(21, 25), (29, 22), (30, 28), (24, 30)])
    c.part(tail, P["tomato"], shade=1, light=False)
    c.part(body, P["peach"], shade=3)
    inner = core(body)
    for a in (0.3, 0.9, 1.5):
        x0, y0 = 16 + 6 * math.cos(a + 1.8), 17 + 6 * math.sin(a + 1.8)
        x1, y1 = 16 + 11 * math.cos(a + 1.8), 17 + 11 * math.sin(a + 1.8)
        c.stroke(line(x0, y0, x1, y1, 1) & inner, sh(P["peach"]))
    c.stroke(pxs((12, 6)), OUTLINE)

@item("broccoli")
def _(c):
    c.part(rrect(13, 18, 19, 30, 2), P["mint"], shade=2)
    crown = circle(16, 11, 8) | circle(8, 15, 5.5) | circle(24, 15, 5.5) | circle(12, 18, 5) | circle(20, 18, 5)
    c.part(crown, P["dkgreen"], shade=3)
    for x, y in ((11, 9), (18, 7), (21, 14), (8, 14), (14, 15)):
        c.stroke(pxs((x, y), (x + 1, y), (x, y + 1)), P["green"])

@item("corn")
def _(c):
    husk_l = poly([(4, 30), (9, 10), (14, 12), (11, 30)]); husk_r = poly([(28, 30), (23, 10), (18, 12), (21, 30)])
    c.part(husk_l, P["green"], shade=1, light=False); c.part(husk_r, P["green"], shade=1, light=False)
    cob = ellipse(16, 15, 6.5, 13)
    c.part(cob, P["yellow"], shade=2)
    inner = core(cob)
    for y in range(5, 28, 3): c.stroke(line(10, y, 22, y, 1) & inner, sh(P["yellow"]))
    for x in (13, 16, 19): c.stroke(line(x, 3, x, 28, 1) & inner, sh(P["yellow"]))

@item("banana")
def _(c):
    body = (circle(16, 10, 15) - circle(16, 7, 12)) & rect(3, 10, 29, 26)
    c.part(body, P["lemon"], shade=3)
    c.part(rect(3, 19, 6, 23) & body, P["dkbrown"], shade=0, light=False)
    c.part(rect(26, 19, 29, 23) & body, P["dkbrown"], shade=0, light=False)

@item("strawberry")
def _(c):
    body = circle(11, 13, 7) | circle(21, 13, 7) | poly([(4, 13), (28, 13), (16, 30)])
    c.part(body, P["red"], shade=3)
    inner = core(body)
    for x, y in ((11, 15), (17, 13), (14, 20), (20, 19), (16, 25), (9, 11), (22, 11)):
        c.stroke(pxs((x, y)) & inner, P["lemon"])
    leaves = poly([(16, 3), (18, 7), (24, 6), (20, 9), (22, 12), (16, 9), (10, 12), (12, 9), (8, 6), (14, 7)])
    c.part(leaves, P["dkgreen"], shade=0, light=False)

@item("cucumber")
def _(c):
    body = rrect(11, 2, 21, 30, 5)
    c.part(body, P["dkgreen"], shade=3)
    inner = core(body)
    c.stroke(line(14, 6, 14, 26, 1) & inner, P["green"]); c.stroke(line(18, 8, 18, 24, 1) & inner, P["green"])

@item("chili")
def _(c):
    body = (circle(8, 24, 20) - circle(6, 24, 15.5)) & rect(4, 5, 30, 30) & poly([(4, 30), (30, 30), (30, 2), (8, 2)])
    body = {p for p in body if p[1] >= 6}
    c.part(body, P["red"], shade=3, light_at=(24, 10))
    c.part(poly([(15, 8), (19, 1), (21, 3), (19, 9)]), P["dkgreen"], shade=0, light=False)
@item("salt")
def _(c):
    body = rrect(10, 10, 22, 30, 3)
    c.part(body, P["white"], shade=3)
    cap = rrect(11, 3, 21, 11, 2)
    c.part(cap, P["silver"], shade=1, light=False)
    for x, y in ((14, 6), (16, 5), (18, 6), (15, 8), (17, 8)): c.stroke(pxs((x, y)), OUTLINE)
    c.stroke(rect(13, 17, 19, 23), P["sky"])

@item("oil")
def _(c):
    body = rrect(9, 12, 23, 30, 4) | rect(13, 5, 19, 13)
    c.part(body, P["gold"], shade=3)
    c.part(rrect(12, 2, 20, 6, 1), P["dkbrown"], shade=0, light=False)
    c.stroke(rect(12, 18, 20, 24), P["cream"])

@item("sugar")
def _(c):
    for x0, y0 in ((8, 16), (18, 16), (13, 7)):
        cube = rect(x0, y0, x0 + 9, y0 + 9)
        c.part(cube, P["white"], shade=2)

@item("ketchup")
def _(c):
    body = rrect(10, 11, 22, 30, 3)
    c.part(body, P["tomato"], shade=3)
    c.part(rect(13, 2, 19, 11), P["red"], shade=1, light=False)
    c.stroke(rect(13, 17, 19, 24), P["white"])

@item("water")
def _(c):
    body = rrect(10, 9, 22, 30, 3) | rect(13, 3, 19, 10)
    c.part(body, P["sky"], shade=3)
    c.part(rrect(12, 1, 20, 4, 1), P["blue"], shade=0, light=False)
    c.stroke(rect(13, 20, 19, 27), P["blue"])

@item("generic")
def _(c):
    bag = rect(7, 11, 25, 30)
    c.part(bag, P["tan"], shade=3)
    c.part(rect(7, 8, 25, 12), P["tan"], shade=1, light=False)
    c.stroke(rect(10, 8, 12, 11), sh(P["tan"])); c.stroke(rect(20, 8, 22, 11), sh(P["tan"]))
    c.part(circle(12, 7, 3.5), P["green"], shade=1, light=False)
    c.part(circle(20, 6, 4), P["tomato"], shade=1, light=False)

# -------------------------------------------------------------------- tools
@item("knife")
def _(c):
    blade = poly([(1, 13), (7, 7), (20, 7), (20, 17), (6, 17)])
    c.part(blade, P["silver"], shade=2, light_at=(9, 10))
    c.stroke(line(4, 14, 18, 14, 1) & (core(blade)), sh(P["silver"]))
    c.part(rect(19, 8, 22, 17), P["dkgrey"], shade=0, light=False)
    c.part(rrect(21, 9, 31, 16, 2), P["dkbrown"], shade=2, light=False)
    c.stroke(pxs((25, 12), (28, 12)), sh(P["dkbrown"]))
@item("pan")
def _(c):
    handle = line(22, 20, 31, 29, 4.5)
    c.part(handle, P["dkbrown"], shade=1, light=False)
    c.part(circle(14, 16, 11.5), P["black"], shade=3)
    c.part(circle(14, 16, 8), P["dkgrey"], shade=2)

@item("pot")
def _(c):
    c.part(rrect(2, 11, 8, 15, 1), P["dkgrey"], shade=0, light=False)
    c.part(rrect(24, 11, 30, 15, 1), P["dkgrey"], shade=0, light=False)
    body = rrect(6, 10, 26, 29, 3)
    c.part(body, P["grey"], shade=3)
    lid = ellipse(16, 10, 11.5, 3) | rect(14, 4, 18, 8)
    c.part(lid, P["silver"], shade=1)

@item("bowl")
def _(c):
    body = ellipse(16, 14, 13.5, 7) | (ellipse(16, 14, 13.5, 13) & rect(0, 14, 32, 32))
    c.part(body, P["blue"], shade=3)
    c.part(ellipse(16, 14, 10.5, 4.5), P["sky"], shade=1, light=False)
    c.part(rect(11, 27, 21, 30), P["blue"], shade=1, light=False)

@item("cup")
def _(c):
    c.part(ring(24, 17, 5.5, 2.5) & rect(23, 0, 32, 32), P["white"], shade=1, light=False)
    body = rrect(6, 6, 24, 28, 3)
    c.part(body, P["white"], shade=3)
    c.part(rect(8, 7, 22, 12), P["pink"], shade=0, light=False, outline=False)

@item("spoon")
def _(c):
    c.part(line(17, 14, 27, 28, 3.5), P["silver"], shade=1, light=False)
    c.part(ellipse(11, 10, 7, 8.5), P["silver"], shade=2)
    c.part(ellipse(11, 10, 4, 5.5), P["grey"], shade=1, light=False, outline=False)

@item("cutting_board")
def _(c):
    body = rrect(3, 6, 29, 28, 3)
    c.part(body, P["tan"], shade=3)
    c.part(circle(25, 10, 2), P["cream"], shade=0, light=False)
    inner = core(body)
    c.stroke(line(6, 12, 22, 12, 1) & inner, sh(P["tan"])); c.stroke(line(6, 20, 26, 20, 1) & inner, sh(P["tan"]))

@item("plate")
def _(c):
    c.part(ellipse(16, 17, 14.5, 9), P["white"], shade=3)
    c.part(ellipse(16, 16, 9.5, 5.5), P["cream"], shade=1, light=False)
    c.stroke(ellipse(16, 17, 12.5, 7) - ellipse(16, 17, 11.5, 6), P["sky"])

@item("spatula")
def _(c):
    c.part(line(17, 14, 27, 28, 3.5), P["dkbrown"], shade=1, light=False)
    head = rrect(3, 3, 17, 17, 2)
    c.part(head, P["silver"], shade=2)
    for x in (7, 10, 13): c.stroke(line(x, 6, x, 14, 1) & (core(head)), sh(P["silver"]))

@item("whisk")
def _(c):
    c.part(line(20, 18, 28, 29, 3.5), P["dkbrown"], shade=1, light=False)
    loops = set()
    for cx, cy in ((10, 11), (13, 9), (8, 14)): loops |= (ellipse(cx, cy, 6.5, 8) - ellipse(cx, cy, 5, 6.5))
    c.part(loops | line(14, 16, 20, 20, 2), P["silver"], shade=0, light=False)

@item("grater")
def _(c):
    body = poly([(8, 10), (24, 10), (28, 30), (4, 30)])
    c.part(body, P["silver"], shade=3)
    c.part(rrect(11, 2, 21, 11, 2), P["dkgrey"], shade=1, light=False)
    for y in range(14, 28, 4):
        for x in range(9, 24, 4): c.stroke(pxs((x, y), (x + 1, y + 1)), OUTLINE)

@item("rolling_pin")
def _(c):
    c.part(rrect(1, 13, 7, 19, 2), P["dkbrown"], shade=1, light=False)
    c.part(rrect(25, 13, 31, 19, 2), P["dkbrown"], shade=1, light=False)
    body = rrect(6, 9, 26, 23, 4)
    c.part(body, P["tan"], shade=3)


# --------------------------------------------------------------- fx
@item("steam")
def _(c):
    puff = circle(11, 20, 6) | circle(19, 17, 7) | circle(14, 12, 6) | circle(21, 24, 5)
    c.part(puff, P["white"], shade=1, light=False, outline_color=sh(P["cream"]))

@item("smoke")
def _(c):
    puff = circle(11, 20, 6) | circle(19, 17, 7) | circle(14, 12, 6) | circle(21, 24, 5)
    c.part(puff, P["grey"], shade=1, light=False)

@item("piece")
def _(c):
    """Generic chopped chunk, tinted at runtime."""
    c.part(rrect(8, 10, 24, 22, 3), P["white"], shade=2)

@item("splash")
def _(c):
    drops = circle(16, 16, 3) | circle(8, 10, 2) | circle(24, 9, 2.2) | circle(6, 22, 1.8) | circle(26, 22, 2) | circle(16, 6, 1.6)
    c.part(drops, P["sky"], shade=0, light=False)

# ------------------------------------------------------ more pantry staples
@item("tofu")
def _(c):
    top = poly([(6, 12), (14, 6), (28, 6), (20, 12)])
    front = rect(4, 12, 20, 26); side = poly([(20, 12), (28, 6), (28, 20), (20, 26)])
    c.part(side, shift(P["cream"], -0.08), shade=1, dome=0.4)
    c.part(top, P["white"], shade=1, dome=0.4)
    c.part(front, P["cream"], shade=1, dome=0.4)

@item("avocado")
def _(c):
    body = ellipse(16, 18, 9.5, 12) | ellipse(16, 12, 6.5, 8)
    c.part(body, P["dkgreen"], shade=2)
    flesh = ellipse(16, 18, 7, 9.5) | ellipse(16, 13, 4.5, 6)
    c.part(flesh, (200, 220, 110), shade=1, dome=0.5, outline=False)
    c.part(circle(16, 20, 4), P["brown"], shade=2)

@item("bacon")
def _(c):
    body = poly([(3, 12), (9, 7), (15, 12), (21, 7), (29, 12), (29, 20), (21, 25), (15, 20), (9, 25), (3, 20)])
    c.part(body, (230, 120, 110), shade=1, dome=0.5)
    inner = core(body)
    c.stroke(poly([(5, 15), (9, 11), (15, 15), (21, 11), (27, 15), (27, 17), (21, 13), (15, 17), (9, 13), (5, 17)]) & inner, P["cream"])

@item("sausage")
def _(c):
    body = rrect(3, 11, 29, 21, 5)
    c.part(body, (200, 100, 70), shade=2)
    c.stroke(line(12, 12, 12, 20, 1) & core(body), shift((200, 100, 70), -0.2))
    c.stroke(line(20, 12, 20, 20, 1) & core(body), shift((200, 100, 70), -0.2))

@item("peas")
def _(c):
    pod = ellipse(16, 17, 13, 6)
    c.part(pod, P["green"], shade=2, dome=0.6)
    for x in (8, 14, 20, 25): c.part(circle(x, 17, 3.2) & pod, P["green"], shade=2)

@item("eggplant")
def _(c):
    body = ellipse(17, 20, 8.5, 10) | ellipse(14, 12, 5, 7)
    c.part(body, P["purple"], shade=3)
    c.part(poly([(9, 7), (14, 4), (19, 7), (17, 10), (12, 10)]), P["dkgreen"], shade=1)

@item("orange")
def _(c):
    c.part(circle(16, 17, 12), P["orange"], shade=3)
    c.part(ellipse(18, 6, 3.5, 2), P["green"], shade=0, light=False)

@item("yogurt")
def _(c):
    body = poly([(8, 10), (24, 10), (22, 29), (10, 29)])
    c.part(body, P["white"], shade=2, dome=0.5)
    c.part(rrect(6, 6, 26, 11, 1), P["sky"], shade=1, dome=0.3)
    c.stroke(rect(11, 16, 21, 24), P["pink"])

@item("soy_sauce")
def _(c):
    body = rrect(10, 10, 22, 30, 3) | rect(13, 4, 19, 11)
    c.part(body, (70, 40, 35), shade=2)
    c.part(rrect(12, 2, 20, 5, 1), P["red"], shade=0, light=False)
    c.stroke(rect(13, 17, 19, 25), P["cream"])

@item("ginger")
def _(c):
    body = ellipse(14, 18, 8, 6) | ellipse(21, 13, 5.5, 5) | ellipse(8, 14, 4.5, 4.5) | ellipse(22, 22, 4, 4)
    c.part(body, P["sand"], shade=2)

@item("pork")
def _(c):
    fat = ellipse(16, 17, 12.5, 9) ; c.part(fat, P["cream"], shade=1, dome=0.4)
    meat = ellipse(16, 18, 10.5, 7); c.part(meat, (235, 150, 150), shade=2, dome=0.6)

@item("noodles")
def _(c):
    bundle = ellipse(16, 17, 12, 9)
    c.part(bundle, P["lemon"], shade=2, dome=0.6)
    inner = core(bundle)
    for x0, y0, x1, y1 in ((6, 18, 14, 12), (10, 22, 20, 13), (16, 23, 26, 15), (20, 24, 27, 20)):
        c.stroke(line(x0, y0, x1, y1, 1) & inner, P["gold"])

# ---------------------------------------------------------- kitchen fx/props
def _flame(c, k):
    outer = poly([(16, 2 + k), (23, 12), (26, 20), (22, 29), (10, 29), (6, 20), (9, 12), (12, 8 + k), (14, 14), (16, 6 + k)])
    c.part(outer, P["orange"], shade=1, dome=0.4, outline_color=P["red"])
    inner = poly([(16, 12 + k), (20, 19), (19, 27), (13, 27), (12, 19)])
    c.part(inner, P["yellow"], shade=0, light=False, outline=False)

@item("flame_0")
def _(c): _flame(c, 0)
@item("flame_1")
def _(c): _flame(c, 3)
@item("flame_2")
def _(c): _flame(c, -2)

@item("bubble")
def _(c):
    c.part(circle(16, 16, 9), (200, 235, 255), shade=1, dome=0.3, outline_color=P["sky"])

@item("drop")
def _(c):
    body = circle(16, 20, 7) | poly([(10, 18), (16, 4), (22, 18)])
    c.part(body, P["sky"], shade=2)

@item("lid")
def _(c):
    c.part(ellipse(16, 20, 14.5, 6), P["silver"], shade=2, dome=0.5)
    c.part(rect(13, 10, 19, 16), P["dkgrey"], shade=1)
    c.part(ellipse(16, 10, 5, 2.5), P["dkgrey"], shade=1)

@item("mark_ok")
def _(c):
    c.part(ring(16, 16, 12, 7), P["tomato"], shade=0, light=False, outline_color=P["red"])

@item("mark_miss")
def _(c):
    c.part(line(5, 5, 27, 27, 4) | line(27, 5, 5, 27, 4), P["blue"], shade=0, light=False, outline_color=P["navy"])

@item("hint_v")
def _(c):
    """Up-down swipe hint arrow."""
    body = rect(14, 8, 18, 24) | poly([(9, 10), (16, 2), (23, 10)]) | poly([(9, 22), (16, 30), (23, 22)])
    c.part(body, P["sky"], shade=0, light=False, outline_color=P["blue"])

@item("hint_h")
def _(c):
    body = rect(8, 14, 24, 18) | poly([(10, 9), (2, 16), (10, 23)]) | poly([(22, 9), (30, 16), (22, 23)])
    c.part(body, P["sky"], shade=0, light=False, outline_color=P["blue"])

@item("hint_circle")
def _(c):
    body = ring(16, 16, 11, 7) - poly([(16, 16), (16, 0), (32, 0), (32, 12)])
    body |= poly([(24, 2), (31, 10), (22, 12)])
    c.part(body, P["sky"], shade=0, light=False, outline_color=P["blue"])

@item("stove")
def _(c):
    c.part(rrect(2, 10, 30, 26, 3), P["dkgrey"], shade=1, dome=0.3)
    c.part(ring(16, 18, 9, 6), P["black"], shade=0, light=False)
    c.part(ring(16, 18, 5, 3), P["black"], shade=0, light=False)
