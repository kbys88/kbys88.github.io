import tempfile, unittest
from pathlib import Path

import numpy as np
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


if __name__ == "__main__":
    unittest.main()
