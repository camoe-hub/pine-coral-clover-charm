#!/usr/bin/env python3
"""Draw original teaching diagrams for public/figures/p*.jpg.

These are not tracings of factory pages. Facts are the ones already in the book.
The shipped 28RB and Globetrotter circuit tables (p86, p87, p90–p93) are not
redrawn here. Those files are simplified lists, not this script's block sketches.
"""
from __future__ import annotations

import math
import shutil
import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path("/workspace")
PUBLIC = ROOT / "public" / "figures"
BEFORE = ROOT / "artifacts" / "figure-before"
DIFF = ROOT / "artifacts" / "figure-diffs"
FONT = "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf"
BOLD = "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf"

W = 1100
NAVY = (22, 48, 84)
INK = (28, 36, 48)
MUTED = (90, 84, 74)
PAPER = (246, 242, 234)
SHEET = (255, 252, 247)
LINE = (214, 204, 188)
COPPER = (166, 92, 48)
SAGE = (46, 102, 78)
DANGER = (140, 48, 40)
WHITE = (255, 252, 247)
BLUE = (36, 78, 140)

F = {
    "n": ImageFont.truetype(BOLD, 22),
    "h": ImageFont.truetype(BOLD, 34),
    "b": ImageFont.truetype(BOLD, 24),
    "p": ImageFont.truetype(FONT, 24),
    "s": ImageFont.truetype(FONT, 20),
    "sb": ImageFont.truetype(BOLD, 20),
    "t": ImageFont.truetype(BOLD, 18),
}


def wrap(draw, text, font, width):
    lines, cur = [], ""
    for word in text.split():
        trial = (cur + " " + word).strip()
        if draw.textlength(trial, font=font) <= width:
            cur = trial
        else:
            if cur:
                lines.append(cur)
            cur = word
    if cur:
        lines.append(cur)
    return lines or [""]


def rr(d, box, fill, outline=None, width=2, radius=18):
    d.rounded_rectangle(box, radius=radius, fill=fill, outline=outline, width=width)


def arrow(d, x1, y1, x2, y2, fill=NAVY):
    d.line((x1, y1, x2, y2), fill=fill, width=4)
    ang = math.atan2(y2 - y1, x2 - x1)
    for da in (2.6, -2.6):
        d.line(
            (x2, y2, x2 - 16 * math.cos(ang + da), y2 - 16 * math.sin(ang + da)),
            fill=fill,
            width=4,
        )


def chip(d, xy, text, fill=NAVY):
    x, y = xy
    tw = d.textlength(text, font=F["t"])
    rr(d, (x, y, x + tw + 28, y + 36), fill, radius=12)
    d.text((x + 14, y + 8), text, font=F["t"], fill=WHITE)
    return tw + 36


class Board:
    def __init__(self):
        self.im = Image.new("RGB", (W, 2800), PAPER)
        self.d = ImageDraw.Draw(self.im)
        self.y = 0

    def header(self, num, title):
        self.d.rectangle((0, 0, W, 8), fill=COPPER)
        self.d.text((40, 28), num, font=F["n"], fill=COPPER)
        self.y = 64
        for line in wrap(self.d, title, F["h"], W - 80):
            self.d.text((40, self.y), line, font=F["h"], fill=NAVY)
            self.y += 42
        self.y += 8
        self.d.line((40, self.y, W - 40, self.y), fill=LINE, width=2)
        self.y += 22

    def note(self, text, fill=MUTED):
        for line in wrap(self.d, text, F["s"], W - 80):
            self.d.text((40, self.y), line, font=F["s"], fill=fill)
            self.y += 28
        self.y += 8

    def bullets(self, items):
        for item in items:
            warn = item.startswith("!")
            text = item[1:] if warn else item
            color = DANGER if warn else INK
            lines = wrap(self.d, text, F["p"], W - 110)
            self.d.ellipse((44, self.y + 8, 58, self.y + 22), fill=COPPER if not warn else DANGER)
            for i, line in enumerate(lines):
                self.d.text((72, self.y), line, font=F["p"], fill=color)
                self.y += 32
            self.y += 8

    def panel(self, h):
        y0 = self.y
        rr(self.d, (36, y0, W - 36, y0 + h), SHEET, LINE, 2, 22)
        self.y = y0 + h + 18
        return 52, y0 + 16, W - 104, h - 32

    def footer(self):
        self.y += 6
        self.d.line((40, self.y, W - 40, self.y), fill=LINE, width=2)
        self.y += 14
        self.d.text(
            (40, self.y),
            "Generated diagram. Not a factory page. Confirm on your coach.",
            font=F["s"],
            fill=MUTED,
        )
        self.y += 36
        self.im = self.im.crop((0, 0, W, self.y + 16))
        return self.im


def star(d, cx, cy, r, labels, title):
    d.text((cx - r, cy - r - 36), title, font=F["sb"], fill=NAVY)
    d.ellipse((cx - r, cy - r, cx + r, cy + r), outline=NAVY, width=4)
    d.ellipse((cx - 14, cy - 14, cx + 14, cy + 14), fill=NAVY)
    badge = 16 if len(labels) > 6 else 22
    for ang, lab in labels:
        a = math.radians(ang)
        x, y = cx + r * math.cos(a), cy + r * math.sin(a)
        d.ellipse((x - badge, y - badge, x + badge, y + badge), fill=COPPER)
        tw = d.textlength(lab, font=F["sb"])
        d.text((x - tw / 2, y - 12), lab, font=F["sb"], fill=WHITE)


def flow(d, box, steps):
    x, y, w, h = box
    n = len(steps)
    gap = 14
    bh = min(78, (h - gap * (n - 1)) / n)
    yy = y
    for i, (kind, text) in enumerate(steps):
        fill = (255, 244, 230) if kind == "ask" else (232, 240, 234) if kind == "go" else SHEET
        outline = COPPER if kind == "ask" else SAGE if kind == "go" else NAVY
        rr(d, (x, yy, x + w, yy + bh), fill, outline, 3, 16)
        lines = wrap(d, text, F["s"], w - 28)[:2]
        ty = yy + (bh - 24 * len(lines)) / 2
        for line in lines:
            d.text((x + 14, ty), line, font=F["s"], fill=INK)
            ty += 24
        if i < n - 1:
            arrow(d, x + w / 2, yy + bh, x + w / 2, yy + bh + gap - 2)
        yy += bh + gap


def blocks(d, box, nodes, edges):
    x, y, w, h = box
    pos = {}
    for name, (fx, fy) in nodes:
        bw, bh = 210, 64
        px, py = x + fx * (w - bw), y + fy * (h - bh)
        pos[name] = (px + bw / 2, py + bh / 2, px, py, bw, bh)
    for a, b in edges:
        ax, ay = pos[a][0], pos[a][1]
        bx, by = pos[b][0], pos[b][1]
        arrow(d, ax, ay, bx, by, NAVY)
    for name, _ in nodes:
        _, _, px, py, bw, bh = pos[name]
        rr(d, (px, py, px + bw, py + bh), SHEET, NAVY, 3, 14)
        lines = wrap(d, name, F["sb"], bw - 16)[:2]
        ty = py + (bh - 22 * len(lines)) / 2
        for line in lines:
            tw = d.textlength(line, font=F["sb"])
            d.text((px + (bw - tw) / 2, ty), line, font=F["sb"], fill=NAVY)
            ty += 22


def side_trailer(d, box, pins):
    x, y, w, h = box
    body = (x + 80, y + 50, x + w - 40, y + h - 90)
    d.rounded_rectangle(body, radius=40, outline=NAVY, width=4)
    d.polygon([(body[0] - 50, body[3] - 20), (body[0], body[1] + 30), (body[0], body[3] - 20)], outline=NAVY)
    for wx in (body[0] + 180, body[0] + 300):
        d.ellipse((wx, body[3] - 10, wx + 70, body[3] + 60), outline=INK, width=4)
    for i, (fx, label) in enumerate(pins):
        px = body[0] + fx * (body[2] - body[0])
        py = body[1] + 8
        d.ellipse((px - 14, py - 14, px + 14, py + 14), fill=COPPER)
        tw = d.textlength(str(i + 1), font=F["t"])
        d.text((px - tw / 2, py - 10), str(i + 1), font=F["t"], fill=WHITE)
        d.text((px - 20, body[3] + 70), label, font=F["s"], fill=INK)


def seven(d, box):
    x, y, w, h = box
    labels = [
        ("White", "Ground", (230, 230, 226)),
        ("Blue", "Brakes", (48, 92, 170)),
        ("Green", "Tail", (46, 120, 78)),
        ("Black", "+12 V", (40, 40, 44)),
        ("Red", "Left turn", (160, 42, 42)),
        ("Brown", "Right turn", (120, 72, 40)),
        ("Yellow", "Backup", (190, 150, 40)),
    ]
    cols = 4
    cw, ch = (w - 20) / cols, 88
    for i, (name, job, color) in enumerate(labels):
        c, r = i % cols, i // cols
        px, py = x + c * cw, y + r * ch
        d.ellipse((px, py, px + 36, py + 36), fill=color, outline=NAVY)
        d.text((px + 46, py), name, font=F["sb"], fill=INK)
        d.text((px + 46, py + 26), job, font=F["s"], fill=MUTED)
    d.text((x, y + 2 * ch + 8), "Looking into the tow-vehicle socket. Read the molded letters if they differ.", font=F["s"], fill=MUTED)


def valves(d, box, rows):
    x, y, w, h = box
    rh = h / max(1, len(rows))
    for i, (name, cells) in enumerate(rows):
        py = y + i * rh
        d.text((x, py + 8), name, font=F["sb"], fill=NAVY)
        for j, (lab, open_) in enumerate(cells):
            px = x + 250 + j * 150
            fill = (110, 106, 98) if open_ is None else SAGE if open_ else DANGER
            word = "TAG" if open_ is None else "OPEN" if open_ else "SHUT"
            rr(d, (px, py, px + 130, py + 54), fill, radius=12)
            d.text((px + 12, py + 4), f"{lab}", font=F["t"], fill=WHITE)
            d.text((px + 12, py + 26), word, font=F["sb"], fill=WHITE)


def table(d, box, headers, rows):
    x, y, w, h = box
    cols = len(headers)
    cw = w / cols
    rh = h / (len(rows) + 1)
    d.rectangle((x, y, x + w, y + rh), fill=NAVY)
    for i, head in enumerate(headers):
        d.text((x + i * cw + 10, y + 10), head, font=F["sb"], fill=WHITE)
    for r, row in enumerate(rows):
        py = y + (r + 1) * rh
        if r % 2 == 0:
            d.rectangle((x, py, x + w, py + rh), fill=(236, 232, 222))
        for i, cell in enumerate(row):
            d.text((x + i * cw + 10, py + 10), cell, font=F["s"], fill=INK)


def build(num, title, lines, sketch=None, sketch_h=380):
    # measure
    probe = ImageDraw.Draw(Image.new("RGB", (W, 10)))
    title_lines = wrap(probe, title, F["h"], W - 80)
    body_h = 0
    for item in lines:
        text = item[1:] if item.startswith("!") else item
        body_h += 32 * len(wrap(probe, text, F["p"], W - 110)) + 8
    h = 78 + 42 * len(title_lines) + 30 + (sketch_h + 18 if sketch else 0) + body_h + 80
    b = Board()
    b.im = Image.new("RGB", (W, max(h, 400)), PAPER)
    b.d = ImageDraw.Draw(b.im)
    b.header(num, title)
    if sketch:
        box = b.panel(sketch_h)
        sketch(b.d, box)
    b.bullets(lines)
    b.footer()
    return b.im


def lug_labels(order):
    # order: list of angles in draw order 1..n
    return [(ang, str(i + 1)) for i, ang in enumerate(order)]


SPECS = []
# These four lists are drawn in the app. Do not write a replacement image over them.
KEEP = {"p86-1", "p87-1", "p90-1", "p91-1", "p92-1", "p93-1"}


def add(fid, num, title, lines, sketch=None, sketch_h=380):
    SPECS.append((fid, num, title, lines, sketch, sketch_h))


def s_lugs6(d, box):
    star(d, box[0] + 220, box[1] + box[3] / 2 + 10, 120, lug_labels([-90, 90, 150, -30, 30, 210]), "Order, not around the circle")
    d.text((box[0] + 460, box[1] + 40), "1 top", font=F["p"], fill=INK)
    d.text((box[0] + 460, box[1] + 80), "2 bottom", font=F["p"], fill=INK)
    d.text((box[0] + 460, box[1] + 120), "3 upper left", font=F["p"], fill=INK)
    d.text((box[0] + 460, box[1] + 160), "4 lower right", font=F["p"], fill=INK)
    d.text((box[0] + 460, box[1] + 200), "5 lower left", font=F["p"], fill=INK)
    d.text((box[0] + 460, box[1] + 240), "6 upper right", font=F["p"], fill=INK)


def s_stages(d, box):
    x, y, w, h = box
    rows = [("Hand tight", "Start every nut by hand", 0.35), ("20–25 ft-lb", "Dexter first stage", 0.5), ("50–60 ft-lb", "Dexter second stage", 0.7), ("110 / 100", "Aluminum wheel / steel spare", 0.92)]
    for i, (a, b, f) in enumerate(rows):
        py = y + i * 78
        d.rectangle((x, py + 10, x + int((w - 280) * f), py + 48), fill=NAVY if i < 3 else COPPER)
        d.text((x + 12, py + 18), a, font=F["sb"], fill=WHITE)
        d.text((x + w - 260, py + 18), b, font=F["s"], fill=INK)


def s_patterns(d, box):
    x, y, _, _ = box
    patterns = [
        ("4-lug", [-90, 90, 180, 0]),
        ("5-lug", [-90, -18, 54, 126, 198]),
        ("6-lug", [-90, 90, 150, -30, 30, 210]),
        ("8-lug", [-90, 90, 180, 0, -45, 135, 45, -135]),
    ]
    for i, (name, angs) in enumerate(patterns):
        star(d, x + 110 + i * 230, y + 170, 78, lug_labels(angs), name)


def s_dot(d, box):
    x, y, w, h = box
    d.rounded_rectangle((x + 40, y + 30, x + w - 40, y + 150), radius=70, outline=INK, width=6)
    d.text((x + 80, y + 70), "DOT  …  2623", font=F["h"], fill=NAVY)
    d.text((x + 80, y + 180), "26 = week", font=F["b"], fill=INK)
    d.text((x + 280, y + 180), "23 = 2023", font=F["b"], fill=INK)
    d.text((x + 520, y + 180), "Replace at 5 years", font=F["b"], fill=DANGER)


def s_rotate(d, box):
    x, y, w, h = box
    # two axles, same-side swap
    for side, ox in (("Left", x + 80), ("Right", x + w / 2 + 40)):
        d.text((ox, y), side, font=F["b"], fill=NAVY)
        d.rounded_rectangle((ox, y + 50, ox + 180, y + 280), radius=16, outline=NAVY, width=3)
        d.text((ox + 50, y + 80), "Front", font=F["sb"], fill=INK)
        d.text((ox + 50, y + 190), "Rear", font=F["sb"], fill=INK)
        arrow(d, ox + 90, y + 120, ox + 90, y + 175, SAGE)
        arrow(d, ox + 130, y + 175, ox + 130, y + 120, SAGE)


def s_wear(d, box):
    table(
        d,
        box,
        ["Look", "Often"],
        [
            ["Center bald", "Pressure high"],
            ["Both edges", "Pressure low"],
            ["Inside edge", "Toe or camber"],
            ["One spot", "Brake or balance"],
            ["Cupping", "Worn suspension"],
        ],
    )


def s_bearing_choice(d, box):
    flow(
        d,
        box,
        [
            ("ask", "Grease fitting or a rubber plug in the cap?"),
            ("stop", "Yes: E-Z Lube or conventional. Clean and repack. Do not mix greases."),
            ("go", "No fitting, sealed cartridge: Nev-R-Lube. Look. Do not pump grease in."),
        ],
    )


def s_cutaway(d, box):
    x, y, w, h = box
    cx, cy, r = x + 220, y + h / 2, 120
    d.ellipse((cx - r, cy - r, cx + r, cy + r), outline=NAVY, width=8)
    d.ellipse((cx - 70, cy - 70, cx + 70, cy + 70), outline=COPPER, width=6)
    d.rectangle((cx - 16, cy - r - 10, cx + 16, cy + r + 10), fill=NAVY)
    d.text((x + 420, y + 40), "Sealed cartridge", font=F["b"], fill=NAVY)
    d.text((x + 420, y + 90), "No grease fitting", font=F["p"], fill=INK)
    d.text((x + 420, y + 130), "Opposed tapered rollers", font=F["p"], fill=INK)
    d.text((x + 420, y + 170), "A weep can be normal", font=F["p"], fill=INK)
    d.text((x + 420, y + 210), "A stream is not", font=F["p"], fill=DANGER)


def s_ez(d, box):
    labels = ["Spindle", "Inner bearing", "Seal", "Hub", "Outer bearing", "D washer", "Nut", "Retainer", "Cap"]
    x, y, w, _ = box
    for i, name in enumerate(labels):
        px = x + (i % 5) * (w / 5)
        py = y + (i // 5) * 150
        d.rounded_rectangle((px + 8, py + 10, px + 180, py + 110), radius=16, outline=NAVY, width=3)
        d.text((px + 24, py + 28), str(i + 1), font=F["h"], fill=COPPER)
        d.text((px + 24, py + 70), name, font=F["s"], fill=INK)


def s_brake(d, box):
    x, y, w, h = box
    cx, cy, r = x + 200, y + h / 2, 110
    d.arc((cx - r, cy - r, cx + r, cy + r), 200, 340, fill=NAVY, width=16)
    d.arc((cx - r, cy - r, cx + r, cy + r), 20, 160, fill=NAVY, width=16)
    d.ellipse((cx - 28, cy + 70, cx + 28, cy + 110), outline=COPPER, width=4)
    d.text((cx - 18, cy + 78), "star", font=F["t"], fill=COPPER)
    d.rounded_rectangle((cx - 70, cy - 24, cx - 20, cy + 24), outline=SAGE, width=3)
    d.text((x + 400, y + 36), "Magnet on the lever", font=F["p"], fill=INK)
    d.text((x + 400, y + 80), "Shoes and springs", font=F["p"], fill=INK)
    d.text((x + 400, y + 124), "Star wheel at the bottom", font=F["p"], fill=INK)
    d.text((x + 400, y + 168), "Left side shown, teaching sketch", font=F["s"], fill=MUTED)


def s_star_steps(d, box):
    flow(
        d,
        box,
        [
            ("go", "Only if the brakes are not self-adjusting."),
            ("ask", "Tighten the star until the wheel drags."),
            ("go", "Back off until it turns freely with a light brush."),
            ("stop", "Nev-R-Adjust still gets a yearly look."),
        ],
    )


def s_seal(d, box):
    side_trailer(
        d,
        box,
        [(0.15, "Front seam"), (0.4, "Roof / A/C"), (0.62, "Windows"), (0.85, "Bumper lids")],
    )


def s_valves(d, box):
    valves(
        d,
        box,
        [
            ("Normal", [("1", True), ("2", True), ("3", True), ("4", False)]),
            ("Bypass", [("1", False), ("2", False), ("3", False), ("4", True)]),
            ("Drain lines", [("1", True), ("2", True), ("3", True), ("4", True)]),
            ("Blow out", [("1", False), ("2", False), ("3", None), ("4", None)]),
        ],
    )


def s_temp(d, box):
    x, y, w, h = box
    d.rectangle((x + 40, y + 40, x + w - 40, y + 90), fill=NAVY)
    d.rectangle((x + 40, y + 40, x + 280, y + 90), fill=DANGER)
    d.text((x + 60, y + 52), "Do not charge under 32 °F", font=F["sb"], fill=WHITE)
    d.text((x + 40, y + 120), "Heater ON if it will drop under about 35 °F. It shuts off near 45 °F.", font=F["p"], fill=INK)
    d.text((x + 40, y + 170), "Store full. Negative cable off for storage charging rules in the lithium procedure.", font=F["p"], fill=INK)


def s_alde_tanks(d, box):
    table(
        d,
        box,
        ["Floor", "Where to look"],
        [
            ["28RB", "Confirm on your coach"],
            ["30RB", "False panel above the toilet"],
            ["33FB", "Confirm on your coach"],
            ["Cold", "About 0.4 in above MIN"],
        ],
    )


def s_break(d, box):
    blocks(
        d,
        box,
        [("House battery", (0, 0.1)), ("Breakaway switch", (0.45, 0.1)), ("Brake magnets", (0.9, 0.55))],
        [("House battery", "Breakaway switch"), ("Breakaway switch", "Brake magnets")],
    )


def s_jacks(d, box):
    side_trailer(d, box, [(0.22, "Stabilizer"), (0.55, "JACK pad"), (0.78, "Axle — no")])


def s_under(d, box):
    x, y, w, h = box
    d.rounded_rectangle((x + 30, y + 40, x + w - 30, y + h - 40), radius=20, outline=NAVY, width=4)
    marks = [("JACK pad", SAGE, 0.25), ("Frame", SAGE, 0.45), ("Axle tube", DANGER, 0.7), ("Belly skin", DANGER, 0.88)]
    for name, color, fx in marks:
        px = x + 50 + fx * (w - 120)
        d.ellipse((px, y + 80, px + 28, y + 108), fill=color)
        d.text((px - 10, y + 120), name, font=F["s"], fill=INK)


def s_ramp(d, box):
    x, y, w, h = box
    d.polygon([(x + 80, y + h - 60), (x + 360, y + h - 60), (x + 360, y + 80)], outline=NAVY)
    d.ellipse((x + 300, y + 40, x + 390, y + 130), outline=SAGE, width=5)
    d.text((x + 300, y + 70), "good", font=F["t"], fill=SAGE)
    d.ellipse((x + 520, y + h - 150, x + 610, y + h - 60), outline=COPPER, width=5)
    d.text((x + 640, y + h - 130), "flat lifts clear", font=F["p"], fill=COPPER)
    d.line((x + 80, y + h - 40, x + w - 40, y + h - 40), fill=INK, width=3)


def s_awning(d, box):
    x, y, w, h = box
    rr(d, (x + 20, y + 20, x + w - 20, y + h - 20), (32, 36, 42), radius=20)
    for i, name in enumerate(["Extend", "Stop", "Retract"]):
        px = x + 80 + i * 250
        rr(d, (px, y + 70, px + 180, y + 150), COPPER if i == 1 else NAVY, radius=14)
        tw = d.textlength(name, font=F["b"])
        d.text((px + (180 - tw) / 2, y + 96), name, font=F["b"], fill=WHITE)
    d.text((x + 40, y + h - 70), "Teaching panel. Your switch labels win.", font=F["s"], fill=WHITE)


def s_retract(d, box):
    flow(d, box, [("stop", "Power off before you pull a manual crank."), ("ask", "Will the motor run?"), ("go", "If not, use the manual retract in the awning booklet."), ("go", "Hold the fabric until the arms are locked.")])


def s_dip(d, box):
    x, y, _, _ = box
    for i, (name, job) in enumerate([("ON/OFF", "Switch plate"), ("D3", "Max temp, confirm the plate"), ("D4", "Max temp, confirm the plate"), ("Data plate", "Model before any step")]):
        px = x + (i % 2) * 460
        py = y + (i // 2) * 140
        rr(d, (px, py, px + 420, py + 110), SHEET, NAVY, 3, 16)
        d.text((px + 20, py + 24), name, font=F["b"], fill=COPPER)
        d.text((px + 20, py + 62), job, font=F["p"], fill=INK)


def s_panel(d, box):
    x, y, w, h = box
    rr(d, (x, y, x + 420, y + h - 10), NAVY, radius=18)
    d.text((x + 30, y + 30), "Control", font=F["h"], fill=WHITE)
    d.text((x + 30, y + 90), "Read the badge.", font=F["p"], fill=WHITE)
    d.text((x + 30, y + 130), "Not every coach has this panel.", font=F["s"], fill=(220, 220, 210))
    d.text((x + 460, y + 40), "Inside switch", font=F["b"], fill=NAVY)
    d.text((x + 460, y + 90), "Heater in the bay", font=F["b"], fill=NAVY)
    d.text((x + 460, y + 150), "Two different places.", font=F["p"], fill=INK)


def s_shunt(d, box):
    blocks(
        d,
        box,
        [("Battery minus", (0, 0.2)), ("Shunt BATTERY side", (0.42, 0.2)), ("Loads and chargers", (0.82, 0.7))],
        [("Battery minus", "Shunt BATTERY side"), ("Shunt BATTERY side", "Loads and chargers")],
    )


def s_led(d, box):
    rows = [("Off", "No sun or no battery"), ("Slow blink", "Charging"), ("Solid", "Float or idle — read the book"), ("Fast blink", "A fault. Note the pattern.")]
    x, y, w, h = box
    for i, (name, job) in enumerate(rows):
        py = y + i * (h / 4)
        d.ellipse((x + 10, py + 8, x + 36, py + 34), fill=SAGE if i < 3 else DANGER)
        d.text((x + 52, py + 6), name, font=F["sb"], fill=INK)
        d.text((x + 280, py + 6), job, font=F["s"], fill=MUTED)


def s_cerbo(d, box):
    blocks(
        d,
        box,
        [("Cerbo GX", (0.35, 0.0)), ("SmartShunt", (0, 0.7)), ("MPPT", (0.4, 0.7)), ("Inverter", (0.8, 0.7))],
        [("SmartShunt", "Cerbo GX"), ("MPPT", "Cerbo GX"), ("Inverter", "Cerbo GX")],
    )


def s_power(kind):
    def draw(d, box):
        if kind == "12":
            nodes = [("Battery", (0, 0.15)), ("Disconnect", (0.4, 0.15)), ("Fuses", (0.8, 0.15)), ("Loads", (0.4, 0.75))]
            edges = [("Battery", "Disconnect"), ("Disconnect", "Fuses"), ("Fuses", "Loads")]
        elif kind == "120-50":
            nodes = [("50 A pedestal", (0, 0.2)), ("Main", (0.4, 0.2)), ("Branches", (0.8, 0.15)), ("Converter", (0.8, 0.7))]
            edges = [("50 A pedestal", "Main"), ("Main", "Branches"), ("Branches", "Converter")]
        elif kind == "120-30":
            nodes = [("30 A pedestal", (0, 0.2)), ("Main breaker", (0.42, 0.2)), ("One hot leg", (0.84, 0.2)), ("Outlets", (0.42, 0.75))]
            edges = [("30 A pedestal", "Main breaker"), ("Main breaker", "One hot leg"), ("One hot leg", "Outlets")]
        elif kind == "solar":
            nodes = [("Roof panels", (0, 0.2)), ("MPPT", (0.4, 0.2)), ("Lithium bank", (0.82, 0.2)), ("Shunt", (0.4, 0.75))]
            edges = [("Roof panels", "MPPT"), ("MPPT", "Lithium bank"), ("Lithium bank", "Shunt")]
        elif kind == "furnace":
            nodes = [("12 V", (0, 0.15)), ("Thermostat", (0.4, 0.15)), ("Sail switch", (0.8, 0.15)), ("Board", (0.4, 0.75))]
            edges = [("12 V", "Thermostat"), ("Thermostat", "Sail switch"), ("Sail switch", "Board")]
        else:
            nodes = [("12 V", (0, 0.2)), ("Control", (0.4, 0.2)), ("Heater", (0.8, 0.55))]
            edges = [("12 V", "Control"), ("Control", "Heater")]
        blocks(d, box, nodes, edges)
    return draw


def s_tanks(d, box):
    """Fresh, gray, and black. Not the propane path (that is Fig 6.5)."""
    x, y, w, h = box
    rows = [
        ("FRESH", SAGE, ["City inlet", "Fresh tank", "Pump", "Faucets"]),
        ("GRAY", (70, 110, 130), ["Sinks / shower", "Gray tank", "Gray valve"]),
        ("BLACK", (55, 58, 64), ["Toilet", "Black tank", "Black valve"]),
    ]
    rh = (h - 36) / 3
    for i, (name, color, nodes) in enumerate(rows):
        py = y + i * rh
        d.text((x, py + 18), name, font=F["sb"], fill=NAVY)
        cw = (w - 130) / len(nodes)
        for j, label in enumerate(nodes):
            px = x + 118 + j * cw
            rr(d, (px, py + 8, px + cw - 18, py + rh - 16), SHEET, outline=color, width=3)
            d.text((px + 10, py + rh / 2 - 16), label, font=F["s"], fill=INK)
            if j:
                mid = py + rh / 2
                arrow(d, px - 16, mid, px - 2, mid, NAVY)
    d.text((x, y + h - 28), "Water tanks. Not propane. Gray and black do not share a valve.", font=F["sb"], fill=NAVY)


def s_water(alde):
    def draw(d, box):
        nodes = [("City inlet", (0, 0.1)), ("Fresh tank", (0.4, 0.1)), ("Pump", (0.8, 0.1)), ("Heater", (0.4, 0.65)), ("Faucets", (0.8, 0.65))]
        edges = [("City inlet", "Fresh tank"), ("Fresh tank", "Pump"), ("Pump", "Heater"), ("Heater", "Faucets")]
        blocks(d, box, nodes, edges)
        if alde:
            d.text((box[0], box[1] + box[3] - 28), "Classic: set Alde valves before air. See the valve diagram.", font=F["s"], fill=MUTED)
    return draw


def s_lp(d, box):
    blocks(
        d,
        box,
        [("Cylinders", (0, 0.2)), ("Regulator", (0.4, 0.2)), ("Appliances", (0.82, 0.2)), ("Drop test", (0.4, 0.75))],
        [("Cylinders", "Regulator"), ("Regulator", "Appliances"), ("Appliances", "Drop test")],
    )


def s_alde_loop(d, box):
    blocks(
        d,
        box,
        [("Boiler", (0.35, 0.0)), ("Pump", (0, 0.65)), ("Convectors", (0.45, 0.65)), ("Expansion tank", (0.85, 0.25))],
        [("Boiler", "Pump"), ("Pump", "Convectors"), ("Convectors", "Boiler"), ("Boiler", "Expansion tank")],
    )


def s_tag(d, box):
    x, y, w, h = box
    rr(d, (x + 40, y + 20, x + w / 2 - 20, y + h - 20), SAGE, radius=18)
    rr(d, (x + w / 2 + 20, y + 20, x + w - 40, y + h - 20), COPPER, radius=18)
    d.text((x + 70, y + 50), "NORMAL USE", font=F["h"], fill=WHITE)
    d.text((x + 70, y + 110), "Camping", font=F["p"], fill=WHITE)
    d.text((x + w / 2 + 50, y + 50), "WINTERIZING", font=F["h"], fill=WHITE)
    d.text((x + w / 2 + 50, y + 110), "Blow-out or pink", font=F["p"], fill=WHITE)


def s_remote(d, box):
    x, y, w, h = box
    rr(d, (x + 180, y + 10, x + w - 180, y + h - 10), (24, 28, 34), radius=24)
    for i, (name, sub) in enumerate([("Power", "On / off"), ("Select", "Mode"), ("Fault", "Stop and read"), ("Shore", "120 V present")]):
        py = y + 28 + i * 70
        d.text((x + 220, py), name, font=F["b"], fill=WHITE)
        d.text((x + 460, py), sub, font=F["p"], fill=(220, 210, 190))


def s_dump(d, box):
    labels = ["1 Gray valve", "2 Light", "3 Switch", "4 Waste valve", "5 Cap"]
    x, y, w, _ = box
    for i, name in enumerate(labels):
        px = x + i * (w / 5)
        d.rounded_rectangle((px + 8, y + 40, px + w / 5 - 16, y + 200), radius=16, outline=NAVY, width=3)
        d.text((px + 20, y + 70), str(i + 1), font=F["h"], fill=COPPER)
        for j, line in enumerate(wrap(d, name, F["s"], w / 5 - 36)):
            d.text((px + 18, y + 120 + j * 26), line, font=F["s"], fill=INK)


def s_locator(pins):
    def draw(d, box):
        side_trailer(d, box, pins)
    return draw


def s_cal(d, box):
    months = ["Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov"]
    jobs = ["De-winterize", "Sealant look", "A/C filters", "Bearings look", "Anode / descale", "Tire date", "Furnace test", "Roof wash", "Winterize"]
    x, y, w, h = box
    cw = w / 9
    for i, (m, job) in enumerate(zip(months, jobs)):
        px = x + i * cw
        d.rectangle((px + 4, y + 10, px + cw - 6, y + 44), fill=NAVY)
        d.text((px + 10, y + 16), m, font=F["t"], fill=WHITE)
        for j, line in enumerate(wrap(d, job, F["s"], cw - 12)[:3]):
            d.text((px + 8, y + 60 + j * 24), line, font=F["s"], fill=INK)


def s_flow(steps):
    def draw(d, box):
        flow(d, box, steps)
    return draw


# Content. Lines starting with ! render in the warning color.
add("p14-1", "Figure 2.1", "Maintenance intervals, one glance", [
    "Trip: tire pressure, lugs look, 7-way, a short brake test.",
    "5, 10, 25, 50 miles after a wheel is installed.",
    "10,000 miles or 6 months: rotate tires. Brakes get the shorter list.",
    "12 months or 12,000 miles: bearing look, or a repack if the hub is not sealed.",
    "5 years from the DOT date: replace the tires even with tread left.",
], lambda d, b: table(d, b, ["When", "Job"], [["Each trip", "Pressure, lights, brakes"], ["After a wheel", "5 / 10 / 25 / 50 mi"], ["6 months", "Rotate, brake look"], ["12 months", "Bearings"], ["5 years", "New tires"]]), 280)

add("p15-1", "Figure 2.2", "Axle care by interval", [
    "Weekly is a look, not a teardown.",
    "3 months or 3,000 miles: brake adjust if they are not self-adjusting.",
    "6 months or 6,000 miles: magnets and linings get the shorter Dexter interval.",
    "12 months or 12,000 miles: Nev-R-Lube visual, or clean-and-repack on a serviceable hub.",
    "!Do not grease a sealed cartridge.",
], lambda d, b: table(d, b, ["Interval", "Do"], [["Week", "Walk-around"], ["3 mo / 3,000", "Adjust if manual"], ["6 mo / 6,000", "Magnets"], ["12 mo / 12,000", "Bearings"]]), 260)

add("p18-1", "Figure 3.1", "6-lug tighten order, then the road checks", [
    "Thread every nut by hand first.",
    "Re-torque at 5, 10, 25, and 50 miles. That covers the manual’s 5/25/50 and Dexter’s 10.",
    "!Never final-torque with an impact.",
], s_lugs6, 420)

add("p19-1", "Figure 3.2", "Three stages, then the wheel’s own final", [
    "Dexter stages for 1/2-20 studs on 14–16 in wheels: 20–25, then 50–60, then the final.",
    "Airstream aluminum wheels finish at 110 ft-lb. The steel spare finishes at 100.",
    "Dexter’s third stage can read 90–120. Do not go past the wheel spec.",
    "!An impact wrench is not the final stage.",
], s_stages, 340)

add("p19-2", "Figure 3.3", "Star patterns. The full stud table stays in the axle book.", [
    "Tighten opposite nuts. The numbers are the order.",
    "This sketch does not copy the Dexter torque table. Stud size changes the final number.",
    "On these coaches the wheel still stops at 110 aluminum or 100 on the steel spare.",
], s_patterns, 340)

add("p20-1", "Figure 3.4", "Tire date code", [
    "The last four digits of the DOT TIN are week and year.",
    "2623 means week 26 of 2023.",
    "Replace at 5 years from that date, even with tread left.",
    "Store cool, dry, covered, out of the sun.",
], s_dot, 280)

add("p20-2", "Figure 3.5", "Rotate radials on the same side", [
    "Every 10,000 miles or 6 months.",
    "Swap front and rear on the same side.",
    "!Do not cross left to right unless the tire maker says so for that tire.",
    "Rebalance when a tire is changed. Mark a forged wheel on its drum.",
], s_rotate, 360)

add("p21-1", "Figure 3.6", "Read the tread before you blame the axle", [
    "Inside-edge wear can be toe or camber. Current manuals: toe-in 1/16 in each side, camber 3/4° positive, both about ± the same.",
    "Dexter will not weld a torsion axle, and the tube must not be heated.",
    "A tire that ran more than 20% low comes off and is inspected in a cage.",
], s_wear, 300)

add("p22-1", "Figure 3.7", "Which hub do you have?", [
    "No fitting and a sealed cartridge is Nev-R-Lube. Visual check. Do not repack.",
    "A rubber plug in the cap is E-Z Lube or conventional. Clean and repack yearly and after water.",
    "The two spindle-nut methods in the books disagree. Follow the hub you have.",
], s_bearing_choice, 340)

add("p22-2", "Figure 3.8", "Sealed drum, teaching cutaway", [
    "Opposed tapered rollers in a cartridge. No grease path.",
    "A slight weep can be normal. A stream is not.",
    "The cartridge is not meant to sit in water.",
    "Spindle nut on a replacement is 145–155 ft-lb. Verify the cartridge by VIN.",
], s_cutaway, 340)

add("p23-1", "Figure 3.8a", "Serviceable hub, parts in order", [
    "After spring 2002 the E-Z Lube stack uses a D washer, nut, and retainer.",
    "Hand-pack until grease comes out the other side. Never spin a bearing with compressed air.",
    "Keep grease off the shoes. New cotter pin every service.",
    "This is a parts order, not the factory illustration.",
], s_ez, 320)

add("p23-2", "Figure 3.9", "Electric brake, left side, teaching sketch", [
    "Magnet, lever, shoes, springs, star wheel at the bottom.",
    "About 3 A per magnet is the field check. Match the size stamped on the backing plate.",
    "!Do not blow lining dust with compressed air.",
], s_brake, 320)

add("p24-1", "Figure 3.10", "Star-wheel adjust, only when it is manual", [
    "Dexter: adjust at 200 miles on new brakes, then about every 3,000 miles.",
    "Self-adjusting brakes still get a yearly inspection.",
], s_star_steps, 360)

add("p25-1", "Figure 3.11", "Where sealant actually fails", [
    "Look at roof fans, the A/C shroud, antennas, solar feet, marker lights, window frames, the front locker seam, compartment doors, and rear bumper lids.",
    "A hard, cracked bead is due. A growing gap at the front seam is structural. Do not hide that with sealant.",
    "Not to scale. Your coach’s seams are the map.",
], s_seal, 300)

add("p26-1", "Figure 3.12", "Classic Alde valves, 28 and 30", [
    "Normal use: 1, 2, and 3 open. 4 closed.",
    "Bypass before air or pink: 1, 2, and 3 closed. 4 open.",
    "Blow-out: close 1 and 2. Confirm 3 and 4 on the tag in the coach before you add air.",
    "Gray cells on the blow-out row mean “read the tag,” not a guess.",
], s_valves, 300)

add("p28-1", "Figure 3.13", "Lithium charge temperature", [
    "Do not charge below 32 °F. One 2027 manual says charging may stop near 35 °F.",
    "The heater switch should be ON if the battery will see about 35 °F. It shuts off near 45 °F.",
    "A BMS that will not wake on shore power is a call-a-pro item.",
], s_temp, 240)

add("p29-1", "Figure 3.14", "Alde expansion tank, cold check", [
    "On a 30 ft Classic the tank is behind a false panel above the toilet.",
    "28 and 33: find it on your coach before you trust a diagram.",
    "Cold level about 0.4 in (1 cm) above MIN. Same glycol only. Do not overfill.",
    "Full exchange is an Alde-trained job.",
], s_alde_tanks, 250)

add("p32-1", "Figure 3A.1", "Breakaway path", [
    "The house battery powers the brakes. The 2027 books do not show a separate breakaway battery.",
    "Pull the pin and try to roll. Brakes must lock. Reinsert within 20–30 seconds.",
    "Cross the chains under the tongue.",
    "!Do not use the breakaway switch as a parking brake.",
], s_break, 260)

add("p32-2", "Figure 3A.2", "7-way blade colors", [
    "White ground, blue brakes, green tail, black +12 V, red left, brown right, yellow backup.",
    "A 6-circuit plug is not this picture. Count the blades.",
    "Clean with contact cleaner, then a little dielectric grease after it dries. No WD-40.",
], seven, 260)

add("p35-1", "Figure 3A.4", "Stabilizer is not a jack", [
    "1. Stabilizer jacks stop rocking. They do not lift and they do not level.",
    "2. The JACK label is a frame pad behind the axle. That is the wheel-change lift point.",
    "!Never lift on the axle tube. Never go under a trailer that is only on a jack.",
], s_jacks, 300)

add("p35-2", "Figure 3A.5", "Lift points, underside, not to scale", [
    "Green: frame and the marked JACK pad.",
    "Red: axle tube and belly skin are not lift points.",
    "Chock the other wheels. Stands under the frame before the wheel comes off.",
    "Positions differ by floor. The label on your frame wins.",
], s_under, 280)

add("p36-1", "Figure 3A.6", "Ramp method on a tandem", [
    "Drive the good tire up a ramp or a block so the flat lifts clear.",
    "The 2027 manuals describe a block under the good tire.",
    "It is not a substitute for stands if you will be under the trailer.",
], s_ramp, 300)

add("p39-1", "Figure 3A.9", "Magnet current, without a copied chart", [
    "About 3 A per magnet is the field check in this book.",
    "The brake size is stamped on the backing plate. Use that size, not a neighbor’s axle.",
    "This diagram does not reprint the Dexter amp table.",
    "One cold drum after a drive is an open circuit. One very hot drum is dragging.",
])

add("p44-1", "Figure 3A.2a", "Power awning, teaching panel", [
    "Classic power awnings in this book are Zip Dee. Read the switch on yours.",
    "Stop is a command, not a suggestion, if a arm is about to hit something.",
    "Lubrication lives in the lube procedure, not in forcing a dry arm.",
], s_awning, 280)

add("p44-2", "Figure 3A.2b", "Awning will not move", [
    "Kill power before a manual retract.",
    "The factory emergency steps are in the awning booklet for that hardware.",
    "Do not leave it half out in wind.",
], s_retract, 340)

add("p50-1", "Figure 3A.11", "Tankless controls. Read the plate first.", [
    "ON/OFF is not the same part as the DIP switches.",
    "D3 and D4 set a maximum temperature on the IW60-series guide. Confirm you have that heater.",
    "A 2025 Globetrotter book lists an ST-65RL, which is not this diagram.",
], s_dip, 300)

add("p51-1", "Figure 3A.12", "Switch inside, heater in the bay", [
    "The wall switch and the heater are in two places.",
    "Confirm the model on the data plate before you order parts or follow an IW60 step.",
    "Tankless heaters have no anode.",
], s_panel, 260)

add("p51-2", "Fig 3A.12b", "Heater bay, what you are looking at", [
    "Access door, burner area, and the data plate.",
    "Gas and electric off, and cool, before you open it.",
    "Spiders in a burner tube are a reason to stop, not to keep resetting.",
], s_panel, 240)

add("p52-1", "Figure 3A.13", "Where a 30 ft Classic hides bleeders", [
    "Behind the sofa, behind the extinguisher cabinet, and in the front compartment.",
    "Look on your own trailer before you open one.",
    "Run the circulation pump, stop, and bleed. Repeat until the convectors actually get hot.",
])

add("p54-1", "Figure 3A.13a", "Furnace 12 V, teaching sketch", [
    "Thermostat, then sail switch, then the board. The blower has to prove airflow.",
    "Left-side pictorials in factory books are not redrawn here.",
    "!Verify DFMD or DFSD on the data plate. A wrong board is a wrong diagram.",
], s_power("furnace"), 260)

add("p56-1", "Figure 3A.13b", "12 V compressor fridge controls", [
    "The parts books do not name an N8 or N10 on a Classic or Globetrotter.",
    "Read the badge. A dark blue light on that family is fuse or polarity, not a reason to keep resetting.",
    "Freezer cold and fridge warm is a known pattern. Do not run both compartments at 5.",
], s_panel, 240)

add("p58-1", "Figure 3A.14", "Inverter remote, the lamps that matter", [
    "Fault means stop and read the code, not reset in a loop.",
    "Shore means 120 V is present at the inverter’s view of it.",
    "E-codes for low battery, high battery, and overload are in Fault codes. This sketch is the buttons.",
], s_remote, 320)

add("p60-1", "Figure 3A.15", "SmartShunt, which side is which", [
    "Battery negative lands on the side marked for the battery.",
    "Every load and charger lands on the other side. One stray wire makes the current read backward.",
    "A reading with everything off is a reason to find that wire.",
], s_shunt, 260)

add("p60-2", "Figure 3A.16", "MPPT lamp, then the manual", [
    "Write down the blink before you reset.",
    "Err 80 and the self-clearing errors are in the solar fault chart, not on this picture.",
    "Classic books name a Victron SmartSolar. Confirm the label.",
], s_led, 260)

add("p61-1", "Figure 3A.17", "Cerbo, what plugs into it", [
    "Shunt, solar controller, and inverter report to the Cerbo. The screen is only a window.",
    "Owners have found a Cerbo that was never mounted. Look before you buy another.",
    "This is a connection sketch, not the factory pinout.",
], s_cerbo, 280)

add("p81-1", "Fig 6.1", "12 V, teaching blocks", [
    "Battery, disconnect, fuse panel, then the loads.",
    "The converter charges the battery. It is not a substitute for a dead disconnect.",
    "Not the factory schematic.",
], s_power("12"), 260)

add("p82-1", "Fig 6.2", "120 V, teaching blocks", [
    "Pedestal, cord, main breaker, branch breakers, converter and outlets.",
    "A 30 A service is about 3,600 W. A 50 A service is not a faster battery charger.",
    "Not the factory schematic.",
], s_power("120-50"), 260)

add("p82-2", "Fig 6.3", "Solar into a lithium bank", [
    "Panels, controller, bank, shunt on the battery negative.",
    "The air conditioner does not run off this picture.",
], s_power("solar"), 260)

add("p83-1", "Fig 6.4", "Fresh, gray, and black — water, not LP", [
    "Three separate paths. Fresh is city water, the tank, the pump, and the faucets.",
    "Gray is sinks and the shower. Black is the toilet. Each tank has its own dump valve.",
    "Propane is Fig 6.5. Do not use this drawing to trace LP.",
], s_tanks, 320)

add("p83-2", "Fig 6.5", "LP, from the cylinders out", [
    "Two cylinders, one regulator, then the appliances.",
    "A drop test is how you know it holds. Soap is not the whole test.",
    "!If you smell propane: shut the cylinders, ventilate, do not reset the alarm until you find it.",
], s_lp, 260)

add("p84-1", "Fig 6.6", "Alde loop, teaching sketch", [
    "Boiler, pump, convectors, expansion tank.",
    "Wrong glycol makes a white precipitate. Do not mix types.",
    "Classic only. A Globetrotter does not have this loop.",
], s_alde_loop, 280)

add("p84-2", "Fig 6.7", "7-way colors again, at the plug", [
    "Same RVIA colors as the breakaway figure: white, blue, green, black, red, brown, yellow.",
    "Look into the tow-vehicle socket.",
], seven, 250)

add("p85-1", "Fig 6.8", "Classic 12 V, teaching sketch", [
    "2027 Classic: battery box on the A-frame, disconnect, then the panel.",
    "This is not the 12-volt main print. Wire numbers live in your manual.",
], s_power("12"), 250)

add("p86-1", "Fig 6.9", "28RB 50 A circuit list, not redrawn here", [
    "The shipped file is a simplified list of circuit names from a factory diagram.",
    "This script does not replace that file.",
], s_power("120-50"), 250)

add("p87-1", "Fig 6.10", "28RB 50 A CSA list, not redrawn here", [
    "The shipped CSA file is the same kind of list, not this block sketch.",
    "This script does not replace that file.",
], s_power("120-50"), 250)

add("p88-1", "Fig 6.11", "Classic fresh water and the Alde valves", [
    "City inlet, fresh tank, pump, Alde, faucets.",
    "Set the valves before air. Blow-out closes valves 1 and 2. Confirm 3 and 4 on the tag.",
], s_water(True), 300)

add("p89-1", "Fig 6.12", "Globetrotter 12 V, teaching sketch", [
    "27FB shown as blocks. 30 A and 50 A coaches share the 12 V idea and not the 120 V panel.",
    "Not the factory 12-volt print.",
], s_power("12"), 250)

add("p90-1", "Fig 6.13", "Globetrotter 30 A circuit list, not redrawn here", [
    "The shipped file is a simplified list of circuit names from a factory diagram.",
    "This script does not replace that file.",
], s_power("120-30"), 250)

add("p91-1", "Fig 6.14", "Globetrotter 30 A CSA list, not redrawn here", [
    "The shipped CSA file is the same kind of list, not this block sketch.",
    "This script does not replace that file.",
], s_power("120-30"), 240)

add("p92-1", "Fig 6.15", "Globetrotter 50 A circuit list, drawn in the app", [
    "The app draws this list as a table. This script does not write an image for it.",
], s_power("120-50"), 240)

add("p93-1", "Fig 6.16", "Globetrotter 50 A CSA list, drawn in the app", [
    "The app draws this list as a table. This script does not write an image for it.",
], s_power("120-50"), 240)

add("p94-1", "Fig 6.17", "Globetrotter fresh water", [
    "No Alde manifold. Tank or tankless heater, per the data plate.",
    "Blow-out limit on a Globetrotter is 30 psi.",
], s_water(False), 280)

add("p94-2", "Fig 6.18", "LP, the rest of the path", [
    "After the regulator: furnace or Alde, water heater, cooktop.",
    "Two regulators in series starve the appliance. Remove the extra one.",
], s_lp, 250)

add("p95-1", "Fig 6.M2", "Dometic furnace wiring, teaching sketch", [
    "12 V, thermostat, sail switch, board.",
    "Verify DF-series on the plate. AFMD shares LEDs and not every code.",
], s_power("furnace"), 250)

add("p96-1", "Fig 6.M3", "On-demand heater wiring, teaching sketch", [
    "12 V and the control board, then the heater.",
    "IW60 steps are not ST-65RL steps. A 2025 Globetrotter book lists the ST.",
], s_power("heater"), 240)

add("p96-2", "Fig 6.P1", "Alde manifold, 28/30 on top, 33 under", [
    "28RB and 30RB share the four-valve story in the valve procedure.",
    "33FB is the lower row in the factory page. Confirm the numbers on that tag before you copy the 30.",
    "Normal: 1, 2, 3 open and 4 shut. Bypass: the opposite.",
], s_valves, 300)

add("p97-1", "Fig 6.P3", "Winterize kit handle", [
    "The tag says WINTERIZING or NORMAL USE.",
    "Put it back on NORMAL USE when you are done. A kit left in winterize is no water at the faucet.",
    "Both Classic and Globetrotter use a kit. The valves behind it are not the same.",
], s_tag, 240)

add("p98-1", "Fig 6.P7", "Inverter remote", [
    "Power, Select, Fault, Shore.",
    "Fault is a stop. Shore only means the inverter sees 120 V.",
], s_remote, 320)

add("p98-2", "Fig 6.P8", "Dump outlet, five pieces", [
    "Gray valve and waste valve are different handles.",
    "Cap on before you tow. Light is for the bay, not a level gauge.",
], s_dump, 260)

add("p119-1", "Figure 11.1", "No 12 V", [
    "Disconnect on? Battery voltage? Main fuse?",
    "Then the branch fuse for the dead load.",
    "A converter can be fine while the disconnect is off.",
], s_flow([("ask", "Is the battery disconnect ON?"), ("ask", "Any voltage at the battery?"), ("go", "Check the fuse for that load."), ("stop", "Still dead: stop. Do not keep swapping fuses.")]), 360)

add("p120-1", "Figure 11.2", "No shore power", [
    "Pedestal first, then the cord, then the trailer inlet.",
    "GFCI and the main breaker are different tests.",
    "!Never use a dryer outlet.",
], s_flow([("ask", "Does the pedestal have power?"), ("ask", "Does a breaker or GFCI trip?"), ("go", "Cord, then the inlet."), ("stop", "Heat or a burning smell: unplug.")]), 360)

add("p121-1", "Figure 11.3", "No water", [
    "City valve, pump switch, then an empty tank.",
    "Winterize kit left on WINTERIZING gives you nothing.",
    "A pump that will not prime may be air or a stuck check valve.",
], s_flow([("ask", "Is the winterize kit on NORMAL USE?"), ("ask", "Is the fresh tank holding water?"), ("go", "Pump on. Bleed a faucet."), ("stop", "Leak: pump off.")]), 360)

add("p122-1", "Figure 11.4", "No hot water", [
    "Tank or tankless? The data plate decides the path.",
    "A bypass left in winterize is cold water only.",
    "Fill a tank heater before heat. An on-demand heater needs flow.",
], s_flow([("ask", "Tank with a drain plug?"), ("go", "Bypass perpendicular, tank full."), ("ask", "On-demand? Open the hot tap fully."), ("stop", "Smell gas: cylinders off.")]), 360)

add("p123-1", "Figure 11.5", "Alde will not heat", [
    "Classic only.",
    "Cold glycol about 1 cm above MIN. Wrong fluid makes a white precipitate.",
    "Bleed until the convectors get hot, not just the pump.",
], s_flow([("ask", "Glycol above MIN when cold?"), ("ask", "Plug icon, 120 V present?"), ("go", "Run the pump and bleed."), ("stop", "White precipitate: stop mixing fluids.")]), 360)

add("p124-1", "Figure 11.6", "Furnace will not stay lit", [
    "Sail switch, then LP, then the board.",
    "Pet hair on a sail switch is owner-reported: fan runs, then quits.",
    "Confirm the furnace model. DF and Suburban are different codes.",
], s_flow([("ask", "Does the blower start?"), ("ask", "Does it ignite, then die?"), ("go", "Sail switch and return air."), ("stop", "Gas smell: cylinders off.")]), 360)

add("p125-1", "Figure 11.7", "Air conditioner will not cool", [
    "Filter and a frozen coil before a charge diagnosis.",
    "Breaker trips with the water heater on electric: that pair can exceed 30 A.",
    "A warm compressor is a technician job.",
], s_flow([("ask", "Does the breaker trip?"), ("ask", "Is the filter dirty or the coil iced?"), ("go", "Thaw it. Do not caulk the ceiling opening."), ("stop", "Soft-start smell on a 2024 Trade Wind: stop.")]), 380)

add("p126-1", "Figure 11.8", "Compressor fridge warm", [
    "Freezer cold and box warm points at the board or the fan.",
    "Level and vents before parts.",
    "An ammonia smell is a stop. That is the absorption path, not this one.",
], s_flow([("ask", "Freezer cold, fridge warm?"), ("go", "Board, fan, vents, door latch."), ("ask", "Ammonia or yellow residue?"), ("stop", "If yes: off, ventilate, leave.")]), 360)

add("p127-1", "Figure 11.9", "LP", [
    "Smell: cylinders off, ventilate, no alarm reset until you find it.",
    "A drop test comes before a new regulator.",
    "Two regulators in series starve the heater.",
], s_flow([("stop", "Smell or alarm: cylinders off."), ("ask", "Does a drop test hold?"), ("go", "One regulator, clear vent."), ("ask", "Stove flame dips when the heater fires?")]), 360)

add("p128-1", "Figure 11.10", "Brakes", [
    "7-way seated. Controller so the trailer brakes lead slightly.",
    "Breakaway pin out for a few seconds only.",
    "One cold drum is not applying. One hot drum is dragging.",
], s_flow([("ask", "Does the trailer tug when you slide the controller?"), ("go", "Check the 7-way and the ground."), ("ask", "One drum cold or hot?"), ("stop", "Howl or no brakes: do not tow.")]), 360)

add("p129-1", "Figure 11.11", "MyAirstream, 2025 and newer Classic", [
    "Owner-reported path. The app is not a substitute for the breaker.",
    "No communication is power and the panel before a new module.",
    "Confirm the year. Older coaches do not have this app.",
], s_flow([("ask", "Does the panel have power?"), ("ask", "Phone on the coach’s network?"), ("go", "Restart the panel, then the phone."), ("stop", "Do not pair a stranger’s coach.")]), 360)

add("p130-1", "Figure 11.12", "Classic 28, where to start looking", [
    "Approximate. Not to scale.",
    "Batteries behind the LP cover. Power center low on the refrigerator. Alde under the dinette area. Confirm before you cut a panel.",
], s_locator([(0.12, "LP / batteries"), (0.4, "Alde"), (0.62, "Power"), (0.86, "Dump")]), 300)

add("p130-2", "Figure 11.13", "Globetrotter 27, where to start looking", [
    "Approximate. Not to scale.",
    "No Alde. Water heater is in a bay. Batteries on the A-frame. Pump location is in the coach notes.",
], s_locator([(0.12, "Batteries"), (0.48, "Heater bay"), (0.78, "Dump")]), 280)

add("p131-1", "Figure 11.14", "A freezing-winter year, example only", [
    "Move the months if you do not live in a freeze.",
    "Intervals still come from the schedule, not from this calendar.",
    "Winterize before a hard freeze. De-winterize is a flush, not just a valve.",
], s_cal, 200)


def save_jpg(im, path):
    im.convert("RGB").save(path, "JPEG", quality=90, optimize=True)


def diff_page(fid, before, after):
    bh = 760
    def fit(im):
        scale = bh / im.height
        nw = max(1, int(im.width * scale))
        if nw > 1000:
            scale = 1000 / im.width
            nw = 1000
        nh = int(im.height * scale)
        return im.resize((nw, nh), Image.Resampling.LANCZOS)
    b, a = fit(before), fit(after)
    pad = 28
    w = pad * 3 + b.width + a.width
    h = 90 + pad + max(b.height, a.height) + 36
    page = Image.new("RGB", (w, h), (28, 32, 38))
    d = ImageDraw.Draw(page)
    d.text((pad, 22), f"{fid}    BEFORE  scanned page", font=F["b"], fill=(230, 210, 190))
    d.text((pad * 2 + b.width, 22), "AFTER  generated diagram", font=F["b"], fill=(190, 220, 190))
    page.paste(b, (pad, 80))
    page.paste(a, (pad * 2 + b.width, 80))
    return page


def main():
    only = set(sys.argv[1:])
    BEFORE.mkdir(parents=True, exist_ok=True)
    DIFF.mkdir(parents=True, exist_ok=True)
    pages = []
    missing = []
    for fid, num, title, lines, sketch, sketch_h in SPECS:
        if only and fid not in only:
            continue
        if fid in KEEP:
            print("kept", fid)
            continue
        src = PUBLIC / f"{fid}.jpg"
        if not src.exists():
            missing.append(fid)
            continue
        backup = BEFORE / f"{fid}.jpg"
        if not backup.exists():
            shutil.copy2(src, backup)
        before = Image.open(backup).convert("RGB")
        after = build(num, title, lines, sketch, sketch_h)
        save_jpg(after, src)
        page = diff_page(fid, before, after)
        save_jpg(page, DIFF / f"{fid}.jpg")
        pages.append(page.convert("RGB"))
        print(fid, after.size)
    if missing and not only:
        raise SystemExit(f"missing {missing}")
    if only:
        print("updated", " ".join(sorted(only)))
        return
    pdf = ROOT / "artifacts" / "figure-mock-diff.pdf"
    pages[0].save(pdf, save_all=True, append_images=pages[1:], resolution=90.0)
    print("pdf", pdf, "pages", len(pages))


if __name__ == "__main__":
    main()
