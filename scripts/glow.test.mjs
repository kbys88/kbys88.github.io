import test from 'node:test';
import assert from 'node:assert/strict';
import { createGlow } from '../assets/ti/js/glow.js';

// WebGL resource lifecycle without a GPU; shader compilation always succeeds.
function context(extensions = [], complete = true) {
  const textures = new Set(), framebuffers = new Set(), formats = [];
  let bound, size;
  const gl = new Proxy({
    R16F: 1, HALF_FLOAT: 2, R8: 3, UNSIGNED_BYTE: 4, FRAMEBUFFER_COMPLETE: 5,
    getExtension: name => extensions.includes(name) ? {} : null,
    getShaderParameter: () => true, getProgramParameter: () => true,
    createTexture() { const t = {}; textures.add(t); return t; },
    createFramebuffer() { const f = {}; framebuffers.add(f); return f; },
    deleteTexture: t => textures.delete(t), deleteFramebuffer: f => framebuffers.delete(f),
    bindFramebuffer: (_, f) => { bound = f; },
    texImage2D: (_, __, format, w, h) => { formats.push(format); size = [w, h]; },
    framebufferTexture2D: () => { bound.size = size; },
    checkFramebufferStatus: () => complete ? 5 : 0,
  }, { get: (o, k) => k in o ? o[k] : () => ({}) });
  return { gl, textures, framebuffers, formats };
}

test('glow accepts half-float colour buffers', () => {
  const c = context(['EXT_color_buffer_half_float']);
  assert.equal(createGlow(c.gl).resize(64, 32), true);
  assert.equal(c.formats[0], c.gl.R16F);
});

test('failed resize frees all render targets', () => {
  const c = context([], false);
  assert.equal(createGlow(c.gl).resize(64, 32), false);
  assert.equal(c.textures.size, 0);
  assert.equal(c.framebuffers.size, 0);
});

test('zero size preserves targets and float format until a usable resize', () => {
  const c = context(['EXT_color_buffer_float']);
  const glow = createGlow(c.gl);
  assert.equal(glow.resize(0, 0), true);
  assert.equal(c.formats.length, 0);
  glow.resize(64, 32);
  const old = [...c.textures];
  const allocations = c.formats.length;
  assert.equal(glow.resize(0, 0), true);
  assert.deepEqual([...c.textures], old);
  assert.equal(c.formats.length, allocations);
  glow.resize(32, 16);
  assert.equal(c.formats.at(-1), c.gl.R16F);
  assert.equal(c.textures.size, old.length);
  assert.ok(old.every(t => !c.textures.has(t)));
});
