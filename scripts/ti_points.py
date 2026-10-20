#!/usr/bin/env python3
"""Build the point sets for /transinstrumentalism/ from the shadow performer meshes.

Every performer is sampled to the same number of surface points, normalised to
the same height and ordered the same way (by height band, then angle around the
body), so point i of one performer roughly matches point i of another. The page
can then morph between performers with a plain per-point mix on the GPU.

Outputs, under --out (default assets/ti/):
  points/<id>.bin      little-endian Int16, count*3 values (x y z interleaved),
                       value = round(p / scale * 32767); feet y=-1, head y=+1
  points/<id>.nrm      Int8, count*3 values (nx ny nz interleaved), the outward
                       normal of the triangle each point was sampled from,
                       value = round(n * 127); same order as the .bin
  points/index.json    {"count", "scale", "performers": [{id, en, ja, section}]}
                       in manifest order
  img/still.png        1200x1500 soft, shaded render of one performer on #0A0A0A,
                       in the page field's look (shown when WebGL is unavailable)
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


def sample_surface(verts, faces, count, seed=0, with_normals=False):
    """`count` points uniformly over the surface: area-weighted face choice, then uniform barycentric.

    with_normals: also return each point's unit triangle normal (from the winding, which
    is outward on the shadow meshes). The positions are the same either way.
    """
    rng = np.random.default_rng(seed)
    tri = verts[faces].astype(np.float64)
    cross = np.cross(tri[:, 1] - tri[:, 0], tri[:, 2] - tri[:, 0])
    area = np.linalg.norm(cross, axis=1)
    pick = rng.choice(len(faces), count, p=area / area.sum())
    tri = tri[pick]
    r1, r2 = np.sqrt(rng.random(count)), rng.random(count)
    w = np.stack([1 - r1, r1 * (1 - r2), r1 * r2], axis=1)
    pts = np.einsum("nk,nkd->nd", w, tri).astype(np.float32)
    if not with_normals:
        return pts
    return pts, (cross[pick] / area[pick, None]).astype(np.float32)  # picked faces have area > 0


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


def build_cloud(verts, faces, count, seed=0):
    """Sampled, normalised and ordered points of one mesh, with their normals in the same order.

    normalise() is a uniform scale plus a shift, so normals keep their direction.
    """
    pts, nrm = sample_surface(verts, faces, count, seed, with_normals=True)
    pts = normalise(pts)
    idx = order(pts)
    return pts[idx], nrm[idx]


def pick_scale(clouds):
    """Smallest 0.1 step, at least 2.0, that holds every coordinate of every performer."""
    reach = max(float(np.abs(c).max()) for c in clouds)
    return max(2.0, math.ceil(reach * 10) / 10)


def quantise(pts, scale):
    """Little-endian Int16 with +-scale mapped to +-32767."""
    q = np.rint(np.asarray(pts, dtype=np.float64) / scale * 32767)
    return np.clip(q, -32767, 32767).astype("<i2")


def quantise_normals(nrm):
    """Int8 with +-1 mapped to +-127."""
    return np.clip(np.rint(np.asarray(nrm, dtype=np.float64) * 127), -127, 127).astype("i1")


def en_label(performer_id):
    return performer_id.replace("_", " ").capitalize()


def _blur(a, r):
    """Approximate Gaussian blur (sigma ~ r): three box blurs of radius r along each axis."""
    r = max(1, int(round(r)))
    for axis in (0, 1):
        for _ in range(3):
            c = np.cumsum(np.pad(a, [(r + 1, r) if ax == axis else (0, 0) for ax in (0, 1)]), axis=axis)
            a = (np.take(c, range(2 * r + 1, c.shape[axis]), axis=axis) - np.take(c, range(0, c.shape[axis] - 2 * r - 1), axis=axis)) / (2 * r + 1)
    return a


def shade(nrm, y):
    """field.js's point light (keep in step with its LOOK): wrapped key from the upper
    front-left, darker far side and feet, faint rim, edge-on surfaces weighted by |n.z|."""
    key = np.maximum(nrm @ np.array([-0.544, 0.593, 0.593]) + 0.5, 0) / 1.5
    nz = nrm[:, 2]
    step = lambda e0, e1, x: (lambda t: t * t * (3 - 2 * t))(np.clip((x - e0) / (e1 - e0), 0, 1))
    lit = (0.06 + 0.94 * key) * (0.22 + 0.78 * step(-0.5, 0.35, nz)) + 0.12 * (1 - np.abs(nz)) ** 3
    return lit * (0.6 + 0.4 * step(-1, 0.15, y)) * (0.3 + 0.7 * np.abs(nz))


def render_still(pts, size, yaw=0.35, fill=0.70, normals=None):
    """Orthographic view turned `yaw` rad about y, in field.js's look: Gaussian dots of light
    sized with the figure, shaded by `normals` when given, with depth of field, a faint halo
    and the page's tone curve from #0A0A0A up to #EDEDED. Figure centred, `fill` of the height."""
    w, h = size
    c, sn = math.cos(yaw), math.sin(yaw)
    x, z = pts[:, 0] * c + pts[:, 2] * sn, -pts[:, 0] * sn + pts[:, 2] * c
    s = fill * h / 2  # px per unit: y spans -1..+1
    k = s / 220       # this figure against the page's hero (~220 px per unit)
    fx = (x - (x.min() + x.max()) / 2) * s + w / 2
    fy = h / 2 - pts[:, 1] * s
    lit = np.ones(len(pts))
    if normals is not None:
        n = np.asarray(normals, dtype=np.float64)
        lit = shade(np.stack([n[:, 0] * c + n[:, 2] * sn, n[:, 1], -n[:, 0] * sn + n[:, 2] * c], axis=1), pts[:, 1])
    # the page's dot: 5.2 px x (.8 + .35 lit), grown by depth of field (9 px per unit off the
    # centre plane) with the same light spread over it; Gaussian with sigma = .177 x diameter
    d0 = 5.2 * k * (0.8 + 0.35 * lit)
    dia = np.hypot(d0, 9 * k * np.abs(z))
    peak = 0.24 * lit * (d0 / dia) ** 2
    ix, iy = np.floor(fx).astype(int), np.floor(fy).astype(int)
    ox, oy = fx - ix, fy - iy
    acc = np.zeros(w * h)
    edges = np.quantile(dia, [0, 0.3, 0.6, 0.85, 1])  # a few blur sizes instead of one per point
    band = np.clip(np.searchsorted(edges, dia, side="right") - 1, 0, len(edges) - 2)
    for b in range(len(edges) - 1):
        sel = band == b
        if not sel.any():
            continue
        sigma = max(0.45, 0.177 * float(dia[sel].mean()))
        r = int(np.ceil(3 * sigma))
        for dy in range(-r, r + 1):
            for dx in range(-r, r + 1):
                g = np.exp(-((dx + 0.5 - ox[sel]) ** 2 + (dy + 0.5 - oy[sel]) ** 2) / (2 * sigma * sigma))
                xx, yy = ix[sel] + dx, iy[sel] + dy
                ok = (xx >= 0) & (xx < w) & (yy >= 0) & (yy < h)
                acc += np.bincount(yy[ok] * w + xx[ok], weights=(peak[sel] * g)[ok], minlength=w * h)
    light = acc.reshape(h, w)
    # the page's halo (glow.js): blurred copies at about 3, 6 and 13 px, scaled to this figure
    light = light + sum(wt * _blur(light, rad * k) for wt, rad in ((0.5, 3.2), (0.32, 6.4), (0.22, 12.8)))
    grey = BG + (237 - BG) * (1 - np.exp(-2.2 * light))
    return Image.fromarray(np.rint(grey).astype(np.uint8))


def main():
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument("--src", type=Path, required=True, help="folder of <id>.obj meshes (transinst/models/shadow)")
    p.add_argument("--out", type=Path, default=ROOT / "assets" / "ti")
    p.add_argument("--manifest", type=Path, help="default: <src>/../manifest.json")
    p.add_argument("--count", type=int, default=28672)
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

    clouds, normals = {}, {}
    for m in performers:
        verts, faces = load_obj(args.src / f"{m['id']}.obj")
        clouds[m["id"]], normals[m["id"]] = build_cloud(verts, faces, args.count, args.seed)
        reach = np.abs(clouds[m["id"]]).max(0)
        print(f"{m['id']}: {len(verts)} verts, {len(faces)} faces, max |coord| {reach.max():.3f} (x {reach[0]:.3f}, z {reach[2]:.3f})")

    scale = pick_scale(clouds.values())
    points, img = args.out / "points", args.out / "img"
    points.mkdir(parents=True, exist_ok=True)
    img.mkdir(parents=True, exist_ok=True)
    for pid, pts in clouds.items():
        (points / f"{pid}.bin").write_bytes(quantise(pts, scale).tobytes())
        (points / f"{pid}.nrm").write_bytes(quantise_normals(normals[pid]).tobytes())
    index = {
        "count": args.count,
        "scale": scale,
        "performers": [{"id": m["id"], "en": en_label(m["id"]), "ja": m["ja"], "section": m["section"]} for m in performers],
    }
    (points / "index.json").write_text(json.dumps(index, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")

    sid = args.still if args.still in clouds else performers[0]["id"]
    still, still_n = clouds[sid], normals[sid]
    render_still(still, STILL_SIZE, normals=still_n).save(img / "still.png", optimize=True)
    render_still(still, OG_SIZE, normals=still_n).convert("RGB").save(img / "og.jpg", quality=85, optimize=True)
    print(f"{len(clouds)} performers x {args.count} points, scale {scale} -> {args.out}")


if __name__ == "__main__":
    main()
