// Post-processing for the point field (field.js): the points render as light into a
// single-channel float target; blurred, down-sampled copies of it make a soft halo
// (light bleeding into the black), and one composite pass tone-maps the light onto the
// page colour, so dense areas glow instead of clipping to flat white.
//
//   const glow = createGlow(gl, { mips: 3, blurFrom: 0 }); // null if the GPU can't
//   glow.resize(w, h);                                     // false: drop the glow
//   glow.begin(); /* draw points, blend ONE ONE */ glow.end({ exposure, strength, bg, ink });
//
// program() is shared with field.js: it links a program or throws with the info logs.

const QUAD = `#version 300 es
out vec2 vUv;
void main() { // one triangle that covers the viewport
  vec2 p = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2));
  vUv = p;
  gl_Position = vec4(p * 2. - 1., 0., 1.);
}`;

const COPY = `#version 300 es
precision highp float;
uniform sampler2D uTex;  // the level above, twice the size: one bilinear tap averages 2x2
in vec2 vUv;
out vec4 o;
void main() { o = texture(uTex, vUv); }`;

const BLUR = `#version 300 es
precision highp float;
uniform sampler2D uTex;
uniform vec2 uStep;      // one texel along the blur direction
in vec2 vUv;
out vec4 o;
void main() { // 9-tap Gaussian as 5 bilinear taps
  float c = texture(uTex, vUv).r * .227027;
  c += (texture(uTex, vUv + uStep * 1.384615).r + texture(uTex, vUv - uStep * 1.384615).r) * .316216;
  c += (texture(uTex, vUv + uStep * 3.230769).r + texture(uTex, vUv - uStep * 3.230769).r) * .070270;
  o = vec4(c);
}`;

const COMPOSITE = `#version 300 es
precision highp float;
uniform sampler2D uScene;          // sharp points, linear light
uniform sampler2D uB0, uB1, uB2;   // blurred levels (1/2, 1/4, 1/8)
uniform vec3 uW;                   // weight of each level (bloom strength folded in)
uniform float uExposure;           // tone curve: 1 - exp(-light * exposure)
uniform vec3 uBg;                  // page colour (no light)
uniform vec3 uInk;                 // the brightest the light may get
in vec2 vUv;
out vec4 o;
void main() {
  vec3 b = vec3(texture(uB0, vUv).r, texture(uB1, vUv).r, texture(uB2, vUv).r);
  float l = texture(uScene, vUv).r + dot(uW, b);
  o = vec4(mix(uBg, uInk, 1. - exp(-l * uExposure)), 1.);
}`;

/** Compile and link; throws an Error carrying the info logs. attribs: names bound to 0, 1, ... */
export function program(gl, vs, fs, attribs = []) {
  const p = gl.createProgram();
  const logs = [];
  for (const [type, src] of [[gl.VERTEX_SHADER, vs], [gl.FRAGMENT_SHADER, fs]]) {
    const s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) logs.push(gl.getShaderInfoLog(s));
    gl.attachShader(p, s);
  }
  attribs.forEach((name, i) => gl.bindAttribLocation(p, i, name));
  gl.linkProgram(p);
  if (gl.getProgramParameter(p, gl.LINK_STATUS)) return p;
  logs.push(gl.getProgramInfoLog(p));
  throw new Error(logs.filter(Boolean).join(' / '));
}

/**
 * mips: how many half-size levels (1/2, 1/4, ...; at most 3); blurFrom: the first level
 * that is blurred and added (mobile: 2 levels, blur only the 1/4 one).
 */
export function createGlow(gl, { mips = 3, blurFrom = 0 } = {}) {
  let copy, blur, comp;
  try {
    copy = program(gl, QUAD, COPY);
    blur = program(gl, QUAD, BLUR);
    comp = program(gl, QUAD, COMPOSITE);
  } catch (e) {
    console.warn('glow.js: post-processing shader failed, drawing without bloom.', e.message);
    return null;
  }
  const loc = (p, n) => gl.getUniformLocation(p, n);
  const U = {
    copyTex: loc(copy, 'uTex'), blurTex: loc(blur, 'uTex'), step: loc(blur, 'uStep'),
    scene: loc(comp, 'uScene'), b: ['uB0', 'uB1', 'uB2'].map((n) => loc(comp, n)),
    w: loc(comp, 'uW'), exposure: loc(comp, 'uExposure'), bg: loc(comp, 'uBg'), ink: loc(comp, 'uInk'),
  };
  const vao = gl.createVertexArray(); // no attributes: the quad comes from gl_VertexID
  let fmt = gl.getExtension('EXT_color_buffer_float') ? [gl.R16F, gl.HALF_FLOAT] : [gl.R8, gl.UNSIGNED_BYTE];
  let scene = null;
  let levels = []; // [{a, b}] ping-pong targets per level

  const target = (w, h) => {
    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texImage2D(gl.TEXTURE_2D, 0, fmt[0], w, h, 0, gl.RED, fmt[1], null);
    for (const [k, v] of [[gl.TEXTURE_MIN_FILTER, gl.LINEAR], [gl.TEXTURE_MAG_FILTER, gl.LINEAR],
      [gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE], [gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE]]) gl.texParameteri(gl.TEXTURE_2D, k, v);
    const fbo = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
    return { tex, fbo, w, h };
  };
  const free = (t) => { if (t) { gl.deleteTexture(t.tex); gl.deleteFramebuffer(t.fbo); } };
  const pass = (prog, texLoc, src, dst) => {
    gl.useProgram(prog);
    gl.bindFramebuffer(gl.FRAMEBUFFER, dst.fbo);
    gl.viewport(0, 0, dst.w, dst.h);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, src.tex);
    gl.uniform1i(texLoc, 0);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };

  return {
    /** (Re)allocate for a w x h canvas; false when no usable render target exists. */
    resize(w, h) {
      free(scene);
      levels.forEach((l) => { free(l.a); free(l.b); });
      scene = target(w, h);
      if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE && fmt[0] !== gl.R8) {
        free(scene);
        fmt = [gl.R8, gl.UNSIGNED_BYTE]; // float targets refused: clamped light, still soft
        scene = target(w, h);
      }
      const ok = gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE;
      levels = Array.from({ length: Math.min(mips, 3) }, (_, i) => {
        const lw = Math.max(1, Math.ceil(w / 2 ** (i + 1))), lh = Math.max(1, Math.ceil(h / 2 ** (i + 1)));
        return { a: target(lw, lh), b: target(lw, lh) };
      });
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      return ok;
    },
    /** Bind the light target, cleared to no light; the caller draws the points. */
    begin() {
      gl.bindFramebuffer(gl.FRAMEBUFFER, scene.fbo);
      gl.viewport(0, 0, scene.w, scene.h);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
    },
    /** Blur and composite onto the canvas. strength scales the halo; bg / ink are RGB 0..1. */
    end({ exposure, strength, bg, ink }) {
      gl.disable(gl.BLEND);
      gl.bindVertexArray(vao);
      levels.forEach((l, i) => pass(copy, U.copyTex, i ? levels[i - 1].a : scene, l.a));
      levels.forEach((l, i) => {
        if (i < blurFrom) return;
        gl.useProgram(blur);
        gl.uniform2f(U.step, 1 / l.a.w, 0);
        pass(blur, U.blurTex, l.a, l.b);
        gl.uniform2f(U.step, 0, 1 / l.a.h);
        pass(blur, U.blurTex, l.b, l.a);
      });
      gl.useProgram(comp);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.viewport(0, 0, scene.w, scene.h);
      const base = [.5, .32, .22];
      const w = [0, 1, 2].map((i) => (levels[i] && i >= blurFrom ? base[i] * strength : 0));
      const tex = [0, 1, 2].map((i) => (levels[i] ?? levels[levels.length - 1])?.a ?? scene); // unused slots: weight 0
      [scene, ...tex].forEach((t, unit) => { gl.activeTexture(gl.TEXTURE0 + unit); gl.bindTexture(gl.TEXTURE_2D, t.tex); });
      gl.uniform1i(U.scene, 0);
      U.b.forEach((l, i) => gl.uniform1i(l, i + 1));
      gl.uniform3f(U.w, w[0], w[1], w[2]);
      gl.uniform1f(U.exposure, exposure);
      gl.uniform3f(U.bg, ...bg);
      gl.uniform3f(U.ink, ...ink);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      gl.activeTexture(gl.TEXTURE0);
    },
  };
}
