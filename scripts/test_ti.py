import tempfile, unittest
from pathlib import Path

import numpy as np
from PIL import Image
import ti_media as tm
import ti_points as tp

TRI = (np.array([[0,0,0],[1,0,0],[0,1,0],[0,0,1]], np.float32), np.array([[0,1,2],[0,1,3]], np.int32))


class Points(unittest.TestCase):
    def test_sample_count_and_on_surface(self):
        p = tp.sample_surface(*TRI, 1000, seed=1)
        self.assertEqual(p.shape, (1000, 3))
        self.assertTrue(np.all(np.isclose(p.min(1), 0, atol=1e-6)))  # each point lies on z=0 or y=0 plane

    def test_sample_is_area_weighted_and_uniform(self):
        # small triangle on z=0 (area 0.5), big one on z=1 (area 4.5): the big one should take 90%
        verts = np.array([[0,0,0],[1,0,0],[0,1,0],[0,0,1],[3,0,1],[0,3,1]], np.float32)
        p = tp.sample_surface(verts, np.array([[0,1,2],[3,4,5]], np.int32), 4000, seed=3)
        big = p[p[:,2] > 0.5]
        self.assertAlmostEqual(len(big) / 4000, 0.9, delta=0.02)
        np.testing.assert_allclose(big.mean(0), [1, 1, 1], atol=0.06)  # uniform: centroid of the big triangle

    def test_normalise_height(self):
        p = tp.normalise(np.random.default_rng(0).random((500, 3)).astype(np.float32))
        self.assertAlmostEqual(float(p[:,1].min()), -1, 5); self.assertAlmostEqual(float(p[:,1].max()), 1, 5)

    def test_order_bands_monotonic(self):
        p = tp.normalise(np.random.default_rng(0).random((640, 3)).astype(np.float32))
        q = p[tp.order(p, bands=8)]
        means = q[:,1].reshape(8, -1).mean(1)
        self.assertTrue(np.all(np.diff(means) > 0))

    def test_quantise_roundtrip(self):
        p = np.random.default_rng(1).uniform(-1.9, 1.9, (100, 3)).astype(np.float32)
        q = tp.quantise(p, 2.0)
        self.assertEqual(q.dtype, np.dtype('<i2'))
        self.assertLess(np.abs(q.reshape(-1,3) / 32767 * 2.0 - p).max(), 1e-4)


class Normals(unittest.TestCase):
    def test_flat_triangle_gives_its_plane_normal(self):
        # TRI: face 0 lies on z=0 (normal +z), face 1 on y=0 (normal -y, from its winding)
        p, n = tp.sample_surface(*TRI, 2000, seed=1, with_normals=True)
        self.assertEqual(n.shape, (2000, 3))
        on_z0 = (np.abs(p[:, 2]) < 1e-6) & (p[:, 1] > 1e-4)
        on_y0 = (np.abs(p[:, 1]) < 1e-6) & (p[:, 2] > 1e-4)
        self.assertGreater(on_z0.sum(), 500); self.assertGreater(on_y0.sum(), 500)
        np.testing.assert_allclose(n[on_z0], np.tile([0, 0, 1], (on_z0.sum(), 1)), atol=1e-6)
        np.testing.assert_allclose(n[on_y0], np.tile([0, -1, 0], (on_y0.sum(), 1)), atol=1e-6)

    def test_same_positions_with_or_without_normals(self):
        a = tp.sample_surface(*TRI, 300, seed=4)
        b, _ = tp.sample_surface(*TRI, 300, seed=4, with_normals=True)
        np.testing.assert_array_equal(a, b)

    def test_normals_unit_length_after_decode(self):
        v = np.random.default_rng(5).normal(size=(500, 3))
        v /= np.linalg.norm(v, axis=1, keepdims=True)
        q = tp.quantise_normals(v)
        self.assertEqual(q.dtype, np.dtype('i1'))
        self.assertLessEqual(int(np.abs(q.astype(int)).max()), 127)
        d = q.astype(np.float64) / 127
        self.assertLess(np.abs(np.linalg.norm(d, axis=1) - 1).max(), 0.01)
        u = d / np.linalg.norm(d, axis=1, keepdims=True)
        self.assertGreater(np.einsum('ij,ij->i', u, v).min(), 0.9999)  # direction within ~0.8 deg

    def test_ordering_is_applied_to_normals(self):
        # after normalising, face 0 is the plane at the lowest z (normal +z) and face 1 the
        # plane at the lowest y, the feet (normal -y)
        p, n = tp.build_cloud(*TRI, 2000, seed=2)
        band = np.minimum((np.argsort(np.argsort(p[:, 1], kind='stable'), kind='stable') * tp.HEIGHT_BANDS) // len(p), tp.HEIGHT_BANDS - 1)
        self.assertTrue(np.all(np.diff(band) >= 0), 'points come out in height-band order')
        z0, y0 = p[:, 2].min(), p[:, 1].min()
        face0 = (np.abs(p[:, 2] - z0) < 1e-5) & (p[:, 1] > y0 + 1e-3)
        face1 = (np.abs(p[:, 1] - y0) < 1e-5) & (p[:, 2] > z0 + 1e-3)
        self.assertGreater(face0.sum(), 500); self.assertGreater(face1.sum(), 500)
        np.testing.assert_allclose(n[face0], np.tile([0, 0, 1], (face0.sum(), 1)), atol=1e-6)
        np.testing.assert_allclose(n[face1], np.tile([0, -1, 0], (face1.sum(), 1)), atol=1e-6)


class Files(unittest.TestCase):
    def test_load_obj_reads_vertices_and_zero_based_faces(self):
        obj = "# comment\nv 0 0 0\nv 1 0 0\nv 0 1 0\nv 0 0 1\nvn 0 0 1\nvn 0 1 0\nvn 1 0 0\nvn 0 0 1\nf 1//1 2//2 3//3\nf 1//1 4//4 3//3\n"
        with tempfile.TemporaryDirectory() as d:
            path = Path(d) / "tri.obj"
            path.write_text(obj)
            verts, faces = tp.load_obj(path)
        self.assertEqual(verts.shape, (4, 3))
        self.assertEqual(verts.dtype, np.float32)
        np.testing.assert_array_equal(faces, [[0, 1, 2], [0, 3, 2]])

    def test_en_label_from_id(self):
        self.assertEqual(tp.en_label("violin"), "Violin")
        self.assertEqual(tp.en_label("double_bass"), "Double bass")
        self.assertEqual(tp.en_label("english_horn"), "English horn")


class Scale(unittest.TestCase):
    def test_scale_never_below_two(self):
        self.assertEqual(tp.pick_scale([np.full((4, 3), 1.5, np.float32)]), 2.0)

    def test_scale_covers_widest_performer_to_a_tenth(self):
        narrow, wide = np.full((4, 3), 1.2, np.float32), np.array([[0, 0, -2.34]], np.float32)
        self.assertAlmostEqual(tp.pick_scale([narrow, wide]), 2.4)


class Still(unittest.TestCase):
    def test_still_is_centred_figure_on_background(self):
        # a tall thin figure: x/z within 0.2, y from -1 to +1
        rng = np.random.default_rng(2)
        pts = tp.normalise((rng.random((4000, 3)) * [0.2, 1.0, 0.2]).astype(np.float32))
        for w, h in [(300, 400), (1200, 1500)]:  # small renders use 1px dots, large ones a soft 3x3 dot
            with self.subTest(size=(w, h)):
                img = tp.render_still(pts, (w, h))
                self.assertEqual(img.size, (w, h))
                a = np.asarray(img.convert("RGB"), dtype=np.int32)
                self.assertEqual(tuple(a[0, 0]), (10, 10, 10))  # #0A0A0A
                lit = a.max(2) > 40
                self.assertTrue(lit.any())
                rows, cols = np.flatnonzero(lit.any(1)), np.flatnonzero(lit.any(0))
                self.assertAlmostEqual((rows[-1] - rows[0]) / h, 0.70, delta=0.03)  # ~70% of image height
                self.assertAlmostEqual((rows[0] + rows[-1]) / 2 / h, 0.5, delta=0.02)
                self.assertAlmostEqual((cols[0] + cols[-1]) / 2 / w, 0.5, delta=0.02)
                # greyscale dots: no tint
                self.assertTrue(np.all(a[..., 0] == a[..., 1]) and np.all(a[..., 1] == a[..., 2]))


class Media(unittest.TestCase):
    def test_dither_is_two_tone_and_same_size(self):
        g = Image.linear_gradient('L').resize((300, 200))
        d = tm.dither(g)
        self.assertEqual(d.size, (300, 200))
        # Image.getdata() is deprecated in Pillow 13 and the suite runs with -W error
        self.assertLessEqual(len(np.unique(np.asarray(d))), 2)

    def test_dither_dots_are_2x2_blocks_and_white_is_light(self):
        g = Image.linear_gradient('L').resize((301, 203))  # odd size: the 2x upscale must be cropped back
        d = tm.dither(g)
        self.assertEqual(d.size, (301, 203))
        a = np.asarray(d.convert('L')) > 0
        blocks = a[:202, :300].reshape(101, 2, 150, 2)
        self.assertTrue(np.all(blocks == blocks[:, :1, :, :1]))  # every 2x2 block is uniform
        self.assertGreater(a[-40:].mean(), 0.8)  # gradient runs black (top) to white (bottom)
        self.assertLess(a[:40].mean(), 0.2)

    def test_dither_stretches_dark_photos(self):
        dark = Image.linear_gradient('L').resize((200, 200)).point(lambda v: v // 6)  # all values 0..42
        self.assertGreater((np.asarray(tm.dither(dark).convert('L')) > 0).mean(), 0.3)

    def test_prepare_writes_pair_never_upscales_and_caps_long_edge(self):
        with tempfile.TemporaryDirectory() as d:
            big, small = Path(d) / "big.png", Path(d) / "small.png"
            Image.new('RGB', (3200, 1000), (200, 40, 40)).save(big)
            Image.new('RGB', (400, 300), (40, 40, 200)).save(small)
            for src, name, size in [(big, "a", (1600, 500)), (small, "b", (400, 300))]:
                jpg, png = tm.prepare(src, name, Path(d) / "out")
                self.assertEqual((jpg.name, png.name), (f"{name}.jpg", f"{name}-d.png"))
                with Image.open(jpg) as j, Image.open(png) as p:
                    self.assertEqual((j.size, j.mode), (size, "L"))
                    self.assertEqual((p.size, p.mode), (size, "1"))


if __name__ == "__main__":
    unittest.main()
