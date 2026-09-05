#!/usr/bin/env python3
"""Render public/og.png in the SIGNAL palette, from the site's own typefaces.

    python3 scripts/make-og.py

Reads the self-hosted woff2 faces in public/fonts, decompresses them with
fontTools, instances the variable Chivo at the weights the page uses, and draws
the card with Pillow. No network access, no design tool, no stock asset.
"""
from __future__ import annotations

import io
import pathlib

from fontTools.ttLib import TTFont
from fontTools.varLib import instancer
from PIL import Image, ImageDraw, ImageFont

ROOT = pathlib.Path(__file__).resolve().parent.parent
FONTS = ROOT / "public" / "fonts"

BG_VOID = (7, 7, 6)
FG = (242, 240, 234)
FG_3 = (143, 138, 128)
ACCENT = (255, 176, 0)
RULE = (44, 44, 42)  # 10% white over --bg-void, flattened

W, H = 1200, 630


def face(filename: str, axes: dict[str, float] | None = None) -> bytes:
    font = TTFont(FONTS / filename)
    if axes:
        font = instancer.instantiateVariableFont(font, axes, inplace=False)
    font.flavor = None
    buf = io.BytesIO()
    font.save(buf)
    return buf.getvalue()


def sized(data: bytes, size: int) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(io.BytesIO(data), size)


def main() -> None:
    chivo900 = face("Chivo-var.woff2", {"wght": 900})
    chivo400 = face("Chivo-var.woff2", {"wght": 400})
    martian = face("MartianMono-var.woff2", {"wght": 500, "wdth": 112.5})

    img = Image.new("RGB", (W, H), BG_VOID)
    d = ImageDraw.Draw(img)

    pad = 64
    hero = sized(chivo900, 116)
    label = sized(martian, 17)
    lede = sized(chivo400, 26)

    # amber availability square, the one accent mark in the top rail
    d.rectangle([pad, pad + 4, pad + 9, pad + 13], fill=ACCENT)
    d.text((pad + 22, pad), "AVAILABLE FOR PROJECTS", font=label, fill=FG_3)

    y = 150
    for line in ("WE BUILD", "COMPLEX", "THINGS."):
        d.text((pad - 6, y), line, font=hero, fill=FG)
        y += 106

    d.line([(pad, 508), (W - pad, 508)], fill=RULE, width=1)
    d.text(
        (pad, 532),
        "Software for machines that have to work outside the lab.",
        font=lede,
        fill=FG_3,
    )

    right = "SOFTWARE  ·  AI  ·  ROBOTICS  ·  SYSTEMS"
    w = d.textlength(right, font=label)
    d.text((W - pad - w, pad), right, font=label, fill=FG_3)

    out = ROOT / "public" / "og.png"
    img.save(out, optimize=True)
    print(f"wrote {out} ({out.stat().st_size:,} bytes)")


if __name__ == "__main__":
    main()
