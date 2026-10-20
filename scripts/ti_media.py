#!/usr/bin/env python3
"""Prepare documentation photos for /transinstrumentalism/ as greyscale + dithered pairs.

For every source `name=path` this writes, under --out (default assets/ti/img):
  <name>.jpg     greyscale, long edge <= 1600 px (never upscaled), quality 80, progressive
  <name>-d.png   same size, 1-bit, white dots on black: an ordered 4x4 Bayer dither
                 computed on a 2x downscale and blown back up with nearest-neighbour,
                 so the dots read as 2x2 px blocks.
The page shows the dithered image and lets the original show through around the cursor.
A mild percentile levels stretch is applied before dithering (to the dither only,
never to the .jpg) so dark documentation photos still produce visible dots.

Usage:
  python scripts/ti_media.py --out assets/ti/img \\
      day0-yt=<dir>/day0-yt.jpg series-1=<dir>/series-1.png series-2=<dir>/series-2.png \\
      reverie-1=images/reverie.jpg reverie-3=<dir>/reverie-3.jpg reverie-4=<dir>/reverie-4.png \\
      reverie-yt=<dir>/reverie-yt.jpg \\
      babel-mockup=images/babel_installation_mockup_v2.jpg babel-canon=images/babel_canon_sample.jpg
  python -W error -m unittest discover -s scripts -p "test_ti.py"      # tests

Gathering the sources (run these yourself; this script does no network I/O). <dir> is any
scratch directory outside the repo:
  # YouTube thumbnails (fall back to hqdefault.jpg if maxresdefault.jpg is a 404)
  curl -L -o <dir>/day0-yt.jpg    https://img.youtube.com/vi/nVIiBWsJCFE/maxresdefault.jpg
  curl -L -o <dir>/reverie-yt.jpg https://img.youtube.com/vi/xRVBC2DTBSo/maxresdefault.jpg
  # RêVeRie post photos (GitHub attachments redirect, hence -L)
  curl -L -o <dir>/reverie-3.jpg https://github.com/user-attachments/assets/82f68685-e4f3-45ff-bb07-b21dd77f8d3a
  curl -L -o <dir>/reverie-4.png https://github.com/user-attachments/assets/3dd8f7fb-f3f4-4b33-bacf-31fce0db58b0
  # series stills: single frames without overlay text from the 2025 teaser (inspected by eye)
  ffmpeg -ss 3.5 -i images/trans-web.mp4 -frames:v 1 <dir>/series-1.png   # smoky head, red jacket
  ffmpeg -ss 0.0 -i images/trans-web.mp4 -frames:v 1 <dir>/series-2.png   # blue/pink smoke cube
  # reverie-1 is images/reverie.jpg. The RêVeRie post's other two attachments are not used:
  # assets/3cdec525-... is byte-identical to images/reverie.jpg and assets/a7fd2ed8-... ("mixte")
  # answers 404, so there is no reverie-2 or reverie-5; add one by passing reverie-N=<path>.

Looping clip (not made by this script): text-free frames only from the RêVeRie teaser, two
hard-cut segments (frames 366-433 = 12.2-14.43 s glass figure, then 252-285 = 8.4-9.5 s dark
room; every other stretch carries credits, titles or logos), 960 px wide, greyscale, no audio:
  ffmpeg -i images/small_GIFFxCONTRECHAMPS_TEASER-REVERIE_16-9.mp4 -an -filter_complex \\
    "[0:v]trim=start_frame=366:end_frame=434,setpts=PTS-STARTPTS[b];[0:v]trim=start_frame=252:end_frame=286,setpts=PTS-STARTPTS[a];[b][a]concat=n=2:v=1:a=0,scale=960:-2:flags=lanczos,format=gray,format=yuv420p" \\
    -c:v libx264 -preset slow -crf 30 -pix_fmt yuv420p -movflags +faststart assets/ti/video/reverie-loop.mp4
  # poster = first frame of the clip, greyscale JPEG quality 80
  ffmpeg -i assets/ti/video/reverie-loop.mp4 -frames:v 1 <dir>/loop-first.png
  python -c "from PIL import Image; Image.open('<dir>/loop-first.png').convert('L').save('assets/ti/video/reverie-loop.jpg', quality=80, progressive=True, optimize=True)"

Requires: pip install numpy pillow   (use the project venv)
"""
import argparse
import re
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parent.parent
MAX_EDGE = 1600
JPEG_QUALITY = 80
LOW_PCT, HIGH_PCT = 1.0, 99.0  # levels stretch: these percentiles map to black / white
NAME_RE = re.compile(r"^[a-z0-9][a-z0-9-]*$")

# 4x4 Bayer matrix, thresholds spread evenly over (0, 255)
BAYER4 = np.array([[0, 8, 2, 10],
                   [12, 4, 14, 6],
                   [3, 11, 1, 9],
                   [15, 7, 13, 5]], np.float32)
THRESHOLD = (BAYER4 + 0.5) / 16.0 * 255.0


def stretch(a, low=LOW_PCT, high=HIGH_PCT):
    """Linear levels stretch of a float array so the given percentiles map to 0 and 255."""
    lo, hi = np.percentile(a, [low, high])
    if hi - lo < 1.0:  # flat image: nothing to stretch
        return a
    return np.clip((a - lo) / (hi - lo) * 255.0, 0.0, 255.0)


def dither(img):
    """Ordered 4x4 Bayer dither of a greyscale image; same size, mode "1", white = light.

    The dither runs on a 2x downscale and is upscaled with nearest-neighbour, so every
    dot is a 2x2 block of identical pixels.
    """
    w, h = img.size
    small = np.asarray(img.convert("L").reduce(2), dtype=np.float32)  # box-average, ceil(w/2) x ceil(h/2)
    small = stretch(small)
    sh, sw = small.shape
    reps = (-(-sh // 4), -(-sw // 4))
    on = small > np.tile(THRESHOLD, reps)[:sh, :sw]
    big = np.repeat(np.repeat(on, 2, axis=0), 2, axis=1)[:h, :w]
    return Image.fromarray(big.astype(np.uint8) * 255, "L").convert("1", dither=Image.Dither.NONE)


def prepare(src, name, out):
    """Write <out>/<name>.jpg and <out>/<name>-d.png from the image at src; return both paths."""
    out = Path(out)
    out.mkdir(parents=True, exist_ok=True)
    with Image.open(src) as im:
        g = ImageOps.exif_transpose(im).convert("L")
    scale = min(1.0, MAX_EDGE / max(g.size))  # never upscale
    if scale < 1.0:
        g = g.resize((max(1, round(g.width * scale)), max(1, round(g.height * scale))), Image.Resampling.LANCZOS)
    jpg, png = out / f"{name}.jpg", out / f"{name}-d.png"
    g.save(jpg, quality=JPEG_QUALITY, progressive=True, optimize=True)
    dither(g).save(png, optimize=True)
    return jpg, png


def main(argv=None):
    ap = argparse.ArgumentParser(description="Make greyscale + dithered image pairs for /transinstrumentalism/.")
    ap.add_argument("--out", default=str(ROOT / "assets" / "ti" / "img"), help="output directory (default assets/ti/img)")
    ap.add_argument("pairs", nargs="+", metavar="name=path", help="output name and source image")
    args = ap.parse_args(argv)
    todo = []
    for item in args.pairs:
        name, sep, src = item.partition("=")
        if not sep or not NAME_RE.match(name) or not src:
            ap.error(f"expected name=path with a lowercase-dashed name, got {item!r}")
        todo.append((name, src))
    for name, src in todo:
        jpg, png = prepare(src, name, args.out)
        print(f"{name}: {jpg.stat().st_size / 1024:.0f} KB jpg, {png.stat().st_size / 1024:.0f} KB png")
    return 0


if __name__ == "__main__":
    sys.exit(main())
