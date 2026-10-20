#!/usr/bin/env python3
"""Build the point sets for /transinstrumentalism/ from the shadow performer meshes.

Every performer is sampled to the same number of surface points, normalised to
the same height and ordered the same way (by height band, then angle around the
body), so point i of one performer roughly matches point i of another. The page
can then morph between performers with a plain per-point mix on the GPU.

Outputs, under --out (default assets/ti/):
  points/<id>.bin      little-endian Int16, count*3 values (x y z interleaved),
                       value = round(p / scale * 32767); feet y=-1, head y=+1
  points/index.json    {"count", "scale", "performers": [{id, en, ja, section}]}
                       in manifest order
  img/still.png        1200x1500 white-dot render of one performer on #0A0A0A
                       (shown when WebGL is unavailable)
  img/og.jpg           1200x630 social image from the same render

`scale` is 2.0 unless some performer reaches further than that from the origin
(wide instruments), in which case it grows in steps of 0.1 to fit them all.

Usage:
  python scripts/ti_points.py --src <transinst>/models/shadow --out assets/ti
  python -m unittest discover -s scripts -p "test_ti.py"      # tests

Requires: pip install numpy pillow   (use the project venv)
"""
import argparse
import json
import math
from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
HEIGHT_BANDS = 64
BG = 10  # #0A0A0A
STILL_SIZE, OG_SIZE = (1200, 1500), (1200, 630)


def load_obj(path):
    """Parse `v x y z` and `f a//a b//b c//c` (1-based) lines; larger polygons are fanned into triangles."""
    verts, faces = [], []
    with open(path, encoding="utf-8") as f:
        for line in f:
            tag, _, rest = line.partition(" ")
            if tag == "v":
                verts.append([float(t) for t in rest.split()[:3]])
            elif tag == "f":
                idx = [int(t.split("/")[0]) - 1 for t in rest.split()]
                faces += [[idx[0], idx[i], idx[i + 1]] for i in range(1, len(idx) - 1)]
    return np.array(verts, dtype=np.float32), np.array(faces, dtype=np.int32)


def sample_surface(verts, faces, count, seed=0):
    """`count` points uniformly over the surface: area-weighted face choice, then uniform barycentric."""
    rng = np.random.default_rng(seed)
    tri = verts[faces].astype(np.float64)
    area = np.linalg.norm(np.cross(tri[:, 1] - tri[:, 0], tri[:, 2] - tri[:, 0]), axis=1)
    tri = tri[rng.choice(len(faces), count, p=area / area.sum())]
    r1, r2 = np.sqrt(rng.random(count)), rng.random(count)
    w = np.stack([1 - r1, r1 * (1 - r2), r1 * r2], axis=1)
    return np.einsum("nk,nkd->nd", w, tri).astype(np.float32)


def normalise(pts):
    """Feet on y=-1, head on y=+1, centred on x/z (OBJ is y-up)."""
    lo, hi = pts.min(0), pts.max(0)
    centre = (lo + hi) / 2
    centre[1] = lo[1]
    return (pts - centre) * (2.0 / (hi[1] - lo[1])) - np.array([0, 1, 0], dtype=np.float32)


def order(pts, bands=HEIGHT_BANDS):
    """Consistent ordering across performers: height band, then angle around the vertical axis."""
    band = np.minimum((np.argsort(np.argsort(pts[:, 1])) * bands) // len(pts), bands - 1)
    angle = np.arctan2(pts[:, 2], pts[:, 0])
    return np.lexsort((angle, band))


def pick_scale(clouds):
    """Smallest 0.1 step, at least 2.0, that holds every coordinate of every performer."""
    reach = max(float(np.abs(c).max()) for c in clouds)
    return max(2.0, math.ceil(reach * 10) / 10)


def quantise(pts, scale):
    """Little-endian Int16 with +-scale mapped to +-32767."""
    q = np.rint(np.asarray(pts, dtype=np.float64) / scale * 32767)
    return np.clip(q, -32767, 32767).astype("<i2")


def en_label(performer_id):
    return performer_id.replace("_", " ").capitalize()


def render_still(pts, size, yaw=0.35, fill=0.70):
    """Orthographic view, turned `yaw` rad about y: additive white dots on #0A0A0A, figure centred and `fill` of the height."""
    w, h = size
    x = pts[:, 0] * math.cos(yaw) + pts[:, 2] * math.sin(yaw)
    s = fill * h / 2  # y spans -1..+1
    ix = np.rint((x - (x.min() + x.max()) / 2) * s + w / 2).astype(int)
    iy = np.rint(h / 2 - pts[:, 1] * s).astype(int)
    # large renders get a 3x3 soft dot; small ones (og.jpg) single pixels, or the figure clots
    kernel, gain = (((-1, 0.5), (0, 1.0), (1, 0.5)), 0.5) if h >= 1000 else (((0, 1.0),), 0.85)
    acc = np.zeros(w * h)
    for dy, wy in kernel:
        for dx, wx in kernel:
            xx, yy = ix + dx, iy + dy
            ok = (xx >= 0) & (xx < w) & (yy >= 0) & (yy < h)
            acc += np.bincount(yy[ok] * w + xx[ok], minlength=w * h) * (wx * wy)
    grey = np.minimum(BG + 255 * gain * acc, 255).astype(np.uint8)
    return Image.fromarray(grey.reshape(h, w))


def main():
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument("--src", type=Path, required=True, help="folder of <id>.obj meshes (transinst/models/shadow)")
    p.add_argument("--out", type=Path, default=ROOT / "assets" / "ti")
    p.add_argument("--manifest", type=Path, help="default: <src>/../manifest.json")
    p.add_argument("--count", type=int, default=20480)
    p.add_argument("--seed", type=int, default=1)
    p.add_argument("--still", default="violin", help="performer drawn for still.png / og.jpg")
    args = p.parse_args()

    manifest = json.loads((args.manifest or args.src.parent / "manifest.json").read_text(encoding="utf-8"))
    performers = [m for m in manifest["performers"] if (args.src / f"{m['id']}.obj").exists()]
    for m in manifest["performers"]:
        if m not in performers:
            print(f"skip {m['id']}: no mesh")
    if not performers:
        raise SystemExit(f"no <id>.obj meshes found in {args.src}")

    clouds = {}
    for m in performers:
        verts, faces = load_obj(args.src / f"{m['id']}.obj")
        pts = normalise(sample_surface(verts, faces, args.count, args.seed))
        clouds[m["id"]] = pts[order(pts)]
        reach = np.abs(clouds[m["id"]]).max(0)
        print(f"{m['id']}: {len(verts)} verts, {len(faces)} faces, max |coord| {reach.max():.3f} (x {reach[0]:.3f}, z {reach[2]:.3f})")

    scale = pick_scale(clouds.values())
    points, img = args.out / "points", args.out / "img"
    points.mkdir(parents=True, exist_ok=True)
    img.mkdir(parents=True, exist_ok=True)
    for pid, pts in clouds.items():
        (points / f"{pid}.bin").write_bytes(quantise(pts, scale).tobytes())
    index = {
        "count": args.count,
        "scale": scale,
        "performers": [{"id": m["id"], "en": en_label(m["id"]), "ja": m["ja"], "section": m["section"]} for m in performers],
    }
    (points / "index.json").write_text(json.dumps(index, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")

    still = clouds[args.still if args.still in clouds else performers[0]["id"]]
    render_still(still, STILL_SIZE).save(img / "still.png", optimize=True)
    render_still(still, OG_SIZE).convert("RGB").save(img / "og.jpg", quality=85, optimize=True)
    print(f"{len(clouds)} performers x {args.count} points, scale {scale} -> {args.out}")


if __name__ == "__main__":
    main()
