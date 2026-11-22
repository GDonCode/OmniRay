"use client";

import { useEffect, useRef } from "react";

/* ---------- tunables (see README, "Hero effects") ---------- */
export const SIM_RES = 128; // velocity grid, px on the short side
export const DYE_RES = 512; // density grid, px on the short side
export const SPLAT_RADIUS = 0.25; // % of viewport area covered by one splat (~80-120px)
export const SPLAT_FORCE = 6000; // velocity injected per unit of normalised pointer travel
export const DENSITY_GAIN = 9; // dye added per unit of normalised pointer speed
export const DENSITY_MAX = 0.18; // clamp for dye added per frame
export const DENSITY_DISSIPATION = 0.99; // per frame at 60fps (time-based)
export const VELOCITY_DISSIPATION = 0.98; // per frame at 60fps (time-based)
export const PRESSURE = 0.8;
export const PRESSURE_ITERATIONS = 20;
export const CURL = 10;
export const GLOW_MAX_ALPHA = 0.6;
// Nebula ramp: dust lane -> deep rust -> orange -> amber -> white-hot gold on the densest ridges.
export const COLORS = { dust: "#1f0a02", deep: "#7a2a00", orange: "#ff5f00", amber: "#ffb066", hot: "#ffd9a0" };
export const NEBULA_SCALE = 260; // css px per noise cell: bigger = broader clouds
export const NEBULA_DUST = 0.55; // 0-1: how much dark dust lanes cut into the glow
export const NEBULA_HOT = 0.55; // 0-1: white-hot highlight on the densest filaments
// Warp: the pointer bends the stars (and the smoke, and any scene texture) themselves.
export const WARP_ENABLED = true;
export const WARP_FLOW_SCALE = 0.1; // css px of displacement per velocity unit
export const WARP_MAX_PX = 12; // clamp for the flow warp
export const LENS_RADIUS = 140; // css px
export const LENS_STRENGTH = 0.25; // magnification pull inside the lens
export const LENS_SPEED_REF = 40; // pointer css px per frame (60fps) that gives a full lens
export const LENS_RISE = 0.3; // per frame at 60fps, when the pointer speeds up
export const LENS_FALL = 0.04; // per frame at 60fps, when it slows down
export const POINTER_LERP = 0.2; // smoothed pointer for the lens, per frame at 60fps
// Drift: stars float on a slow, smooth field, so neighbours move slightly differently. Lines move with them.
export const STAR_DRIFT_PX = 7; // peak displacement, css px (0 turns the drift off); constellations move as rigid blocks
export const STAR_DRIFT_SPEED = 1.8; // 1 = one sway every ~25-30s
export const STAR_TWINKLE = 0.35; // 0-1: how far a star dips in brightness as it twinkles (0 = steady)
export const IDLE_FPS = 30; // frame rate once the smoke has faded: only the stars drift, so this is cheap
// Star field: two layers, both drawn in the shader (no grid; jittered, rotated cells).
export const STAR_COLOR = "232,220,200"; // cream, the base star colour
export const FAR_STAR_SPACING = 30; // css px per cell, dim dense layer
export const FAR_STAR_CHANCE = 0.55; // share of cells holding a star
export const FAR_STAR_OPACITY = 0.6; // brightest far star, at rest
export const STAR_SPACING = 88; // css px per cell, bright sparse layer (carries constellations)
export const STAR_CHANCE = 0.55;
export const STAR_OPACITY = 0.95; // brightest near star, at rest
export const STAR_LIT_BOOST = 1.7; // star brightness multiplier inside the glow
export const STAR_SIZE = 1; // css px core radius of a typical near star
// Constellations: faint lines joining the stars of some blocks of cells.
export const CONSTELLATION_BLOCK = 4; // cells per block side
export const CONSTELLATION_CHANCE = 0.4; // share of blocks that hold a constellation
export const CONSTELLATION_EDGES = 0.6; // share of possible links drawn inside a block
export const LINE_WIDTH = 1; // css px
export const LINE_BASE_OPACITY = 0.12; // everywhere
export const LINE_LIT_OPACITY = 0.32; // inside the glow
/** Stop simulating this long after the last splat (the dye has faded to nothing by then). */
const IDLE_MS = 7000;

const hex = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);

/* ---------- shaders (GLSL ES 3.00, full-screen triangle from gl_VertexID) ---------- */

const VERT = `#version 300 es
precision highp float;
uniform vec2 uTexel;
out vec2 vUv; out vec2 vL; out vec2 vR; out vec2 vT; out vec2 vB;
void main() {
  vec2 p = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2));
  vUv = p;
  vL = p - vec2(uTexel.x, 0.0); vR = p + vec2(uTexel.x, 0.0);
  vT = p + vec2(0.0, uTexel.y); vB = p - vec2(0.0, uTexel.y);
  gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
}`;

const head = `#version 300 es
precision highp float; precision highp sampler2D;
in vec2 vUv; in vec2 vL; in vec2 vR; in vec2 vT; in vec2 vB;
out vec4 o;
`;

/** Noise and hash helpers shared by the two bake shaders (they run once per resize, so ALU noise is fine). */
const LIB = `
float hash21(vec2 p) { vec3 q = fract(vec3(p.xyx) * 0.1031); q += dot(q, q.yzx + 33.33); return fract((q.x + q.y) * q.z); }
vec2 hash22(vec2 p) { vec3 q = fract(vec3(p.xyx) * vec3(0.1031, 0.1030, 0.0973)); q += dot(q, q.yxz + 33.33); return fract((q.xx + q.yz) * q.zy); }
mat2 rot(float a) { float c = cos(a), s = sin(a); return mat2(c, -s, s, c); }
float vnoise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash21(i), hash21(i + vec2(1.0, 0.0)), u.x),
             mix(hash21(i + vec2(0.0, 1.0)), hash21(i + vec2(1.0, 1.0)), u.x), u.y);
}
float fbm(vec2 p, int oct) {
  float a = 0.5, s = 0.0;
  for (int i = 0; i < 4; i++) {
    if (i >= oct) break;
    s += a * vnoise(p);
    p = p * 2.03 + vec2(17.1, 9.3);
    a *= 0.5;
  }
  return s / (1.0 - pow(0.5, float(oct)));                  // normalised to 0..1
}
// Distance from p to segment a-b, and the distance to the nearer end point.
vec2 seg(vec2 p, vec2 a, vec2 b) {
  vec2 pa = p - a, ba = b - a;
  float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
  return vec2(length(pa - ba * h), min(length(pa), length(p - b)));
}
`;

/** Rotation of the near-star cell grid. The bake shader and the display shader must agree on it. */
const NEAR_ANGLE = -0.23;

const FRAG = {
  splat: head + `
uniform sampler2D uTarget; uniform float uAspect; uniform vec3 uColor; uniform vec2 uPoint; uniform float uRadius;
void main() {
  vec2 p = vUv - uPoint; p.x *= uAspect;
  vec3 splat = exp(-dot(p, p) / uRadius) * uColor;
  o = vec4(texture(uTarget, vUv).xyz + splat, 1.0);
}`,
  advect: head + `
uniform sampler2D uVelocity; uniform sampler2D uSource; uniform vec2 uTexel; uniform float uDt; uniform float uDecay;
void main() {
  vec2 coord = vUv - uDt * texture(uVelocity, vUv).xy * uTexel;
  o = uDecay * texture(uSource, coord);
}`,
  divergence: head + `
uniform sampler2D uVelocity;
void main() {
  float L = texture(uVelocity, vL).x, R = texture(uVelocity, vR).x;
  float T = texture(uVelocity, vT).y, B = texture(uVelocity, vB).y;
  vec2 C = texture(uVelocity, vUv).xy;
  if (vL.x < 0.0) L = -C.x; if (vR.x > 1.0) R = -C.x;
  if (vT.y > 1.0) T = -C.y; if (vB.y < 0.0) B = -C.y;
  o = vec4(0.5 * (R - L + T - B), 0.0, 0.0, 1.0);
}`,
  curl: head + `
uniform sampler2D uVelocity;
void main() {
  float L = texture(uVelocity, vL).y, R = texture(uVelocity, vR).y;
  float T = texture(uVelocity, vT).x, B = texture(uVelocity, vB).x;
  o = vec4(0.5 * (R - L - T + B), 0.0, 0.0, 1.0);
}`,
  vorticity: head + `
uniform sampler2D uVelocity; uniform sampler2D uCurl; uniform float uCurlAmt; uniform float uDt;
void main() {
  float L = texture(uCurl, vL).x, R = texture(uCurl, vR).x;
  float T = texture(uCurl, vT).x, B = texture(uCurl, vB).x;
  float C = texture(uCurl, vUv).x;
  vec2 f = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
  f /= length(f) + 0.0001;
  f *= uCurlAmt * C; f.y *= -1.0;
  vec2 v = texture(uVelocity, vUv).xy + f * uDt;
  o = vec4(clamp(v, -1000.0, 1000.0), 0.0, 1.0);
}`,
  pressure: head + `
uniform sampler2D uPressure; uniform sampler2D uDivergence;
void main() {
  float L = texture(uPressure, vL).x, R = texture(uPressure, vR).x;
  float T = texture(uPressure, vT).x, B = texture(uPressure, vB).x;
  float div = texture(uDivergence, vUv).x;
  o = vec4((L + R + B + T - div) * 0.25, 0.0, 0.0, 1.0);
}`,
  gradient: head + `
uniform sampler2D uPressure; uniform sampler2D uVelocity;
void main() {
  float L = texture(uPressure, vL).x, R = texture(uPressure, vR).x;
  float T = texture(uPressure, vT).x, B = texture(uPressure, vB).x;
  vec2 v = texture(uVelocity, vUv).xy - vec2(R - L, T - B);
  o = vec4(v, 0.0, 1.0);
}`,
  clear: head + `
uniform sampler2D uTexture; uniform float uValue;
void main() { o = uValue * texture(uTexture, vUv); }`,
  // ---- baked once per resize (static in screen space; the display pass only looks them up) ----
  stars: head + LIB + `
uniform vec2 uViewport; uniform vec3 uStarColor;
uniform float uFarSpacing; uniform float uFarChance; uniform float uFarOpacity;
uniform float uSpacing; uniform float uChance; uniform float uStarOpacity; uniform float uStarSize;
uniform float uBlock; uniform float uBlockChance; uniform float uEdgeChance; uniform float uLineWidth;
uniform float uPass; // 0 = far stars, 1 = near stars + constellation lines

// One star: crisp core, soft halo and, for the brightest, a faint diffraction cross.
// dpx is the offset from the star centre in css px; size the core radius; mag 0..1 its brightness.
float starShape(vec2 dpx, float size, float mag, float aa) {
  float d = length(dpx);
  float core = 1.0 - smoothstep(size - aa, size + aa, d);
  float halo = exp(-d / (size * 2.2)) * 0.4 * mag;
  float spikes = 0.0;
  if (mag > 0.72) {
    float len = size * (5.0 + 9.0 * (mag - 0.72));
    vec2 a = abs(dpx);
    spikes = (exp(-a.y / 0.45) * exp(-a.x / len) + exp(-a.x / 0.45) * exp(-a.y / len)) * 0.55 * (mag - 0.6);
  }
  return clamp(core + halo + spikes, 0.0, 1.0);
}

// Warm-white with a little spread: mostly cream, some amber, a few pale cool whites.
vec3 starTint(float h) {
  vec3 amber = vec3(1.0, 0.78, 0.55), cool = vec3(0.82, 0.88, 1.0);
  return h < 0.22 ? mix(uStarColor, amber, 0.8) : h > 0.9 ? mix(uStarColor, cool, 0.7) : uStarColor;
}

// Near-layer cell: is there a star, where (in cells), how bright. Stars inside a
// constellation block always exist, so the links never end on nothing.
bool nearStar(vec2 c, out vec2 pos, out float mag) {
  vec2 h = hash22(c);
  float inBlock = step(hash21(floor(c / uBlock) + 9.1), uBlockChance);
  pos = c + 0.2 + 0.6 * h;
  mag = hash21(c + 3.3);
  mag = mix(mag, 0.55 + 0.45 * mag, inBlock);
  return inBlock > 0.5 || hash21(c + 7.7) < uChance;
}

void main() {
  vec2 px = vec2(vUv.x, 1.0 - vUv.y) * uViewport;           // css px, y down
  float aa = max(fwidth(px.x) * 0.5, 0.35);

  // far stars: dim, dense, one per cell at most; cells rotated so no axis shows
  vec2 fq = (rot(0.41) * px) / uFarSpacing;
  vec2 fc = floor(fq);
  vec2 fh = hash22(fc);
  float fm = hash21(fc + 3.3);
  float fpresent = step(hash21(fc + 7.7), uFarChance);
  vec2 fd = (fract(fq) - (0.2 + 0.6 * fh)) * uFarSpacing;
  float fsize = mix(0.42, 0.8, fm);
  float fa = fpresent * starShape(fd, fsize, fm * 0.5, aa) * mix(0.3, 1.0, fm * fm) * uFarOpacity;
  vec3 farRGB = starTint(hash21(fc + 1.3));

  // near stars + constellations
  vec2 nq = (rot(${NEAR_ANGLE.toFixed(2)}) * px) / uSpacing;
  vec2 nc = floor(nq);
  vec2 npos; float nmag;
  float na = 0.0;
  vec3 nearRGB = uStarColor;
  if (nearStar(nc, npos, nmag)) {
    float size = uStarSize * mix(0.7, 1.55, nmag);
    na = starShape((nq - npos) * uSpacing, size, nmag, aa) * mix(0.35, 1.0, nmag) * uStarOpacity;
    nearRGB = starTint(hash21(nc + 1.3));
  }

  // Links only point right, down or diagonally, so a pixel is only reached by links that
  // start in its own cell or in the cells to its left / above.
  float line = 0.0;
  for (int k = 0; k < 4; k++) {
    vec2 c = nc - vec2(float(k & 1), float(k >> 1));
    vec2 blk = floor(c / uBlock);
    if (hash21(blk + 9.1) > uBlockChance) continue;
    if (hash21(c + 8.8) > uEdgeChance) continue;
    float kd = hash21(c + 1.7);
    vec2 dir = kd < 0.34 ? vec2(1.0, 0.0) : kd < 0.67 ? vec2(0.0, 1.0) : vec2(1.0, 1.0);
    vec2 nb = c + dir;
    if (floor(nb / uBlock) != blk) continue;
    vec2 pa, pb; float ma, mb;
    nearStar(c, pa, ma);
    nearStar(nb, pb, mb);
    vec2 sd = seg(nq * uSpacing, pa * uSpacing, pb * uSpacing);
    float laa = max(aa * 0.7, 0.4);
    float m = 1.0 - smoothstep(0.5 * uLineWidth - laa, 0.5 * uLineWidth + laa, sd.x);
    m *= smoothstep(4.0, 9.0, sd.y);                        // lines stop short of the stars
    line = max(line, m);
  }
  // rgb: premultiplied star light (unboosted). a: constellation line coverage (near pass only).
  o = uPass < 0.5 ? vec4(min(farRGB * fa, vec3(1.0)), 0.0) : vec4(min(nearRGB * na, vec3(1.0)), line);
}`,
  nebula: head + LIB + `
uniform vec2 uViewport; uniform float uNebScale;
void main() {
  vec2 px = vec2(vUv.x, 1.0 - vUv.y) * uViewport;
  vec2 q = px / uNebScale;
  vec2 w = vec2(fbm(q + vec2(1.7, 9.2), 2), fbm(q + vec2(8.3, 2.8), 2));
  float n = fbm(q + 1.7 * (w - 0.5) * 2.0, 4);                          // cloud body
  float r = 1.0 - abs(2.0 * fbm(q * 1.8 + 2.2 * w + 5.1, 3) - 1.0);     // filaments, 1 on the ridge
  float dust = smoothstep(0.5, 0.85, 1.0 - r) * smoothstep(0.55, 0.3, n);  // dark lanes
  o = vec4(n, r, dust, 1.0);
}`,
  display: head + `
uniform sampler2D uDye; uniform sampler2D uVelocity; uniform sampler2D uScene; uniform sampler2D uStars; uniform sampler2D uFar; uniform sampler2D uNeb;
uniform vec2 uTexel; uniform vec2 uViewport; uniform vec2 uPointer;
uniform float uLens; uniform float uWarpOn; uniform float uFlowScale; uniform float uWarpMax;
uniform float uLensRadius; uniform float uLensStrength; uniform float uHasScene;
uniform vec3 uDust; uniform vec3 uDeep; uniform vec3 uOrange; uniform vec3 uAmber; uniform vec3 uHot; uniform vec3 uStarColor;
uniform float uMaxAlpha; uniform float uNebDust; uniform float uNebHot;
uniform float uLitBoost; uniform float uLineBase; uniform float uLineLit;
uniform float uTime; uniform float uDrift; uniform float uTwinkle; uniform float uSpacing; uniform float uBlock;

void main() {
  // Everything below is sampled at a displaced position, so stars, smoke and scene bend together.
  vec2 pPx = vec2(vUv.x, 1.0 - vUv.y) * uViewport;          // css px, y down
  vec2 flow = clamp(texture(uVelocity, vUv).xy * uFlowScale, -uWarpMax, uWarpMax);
  flow.y = -flow.y;                                          // to screen space
  vec2 dd = pPx - uPointer;
  float f = exp(-dot(dd, dd) / (uLensRadius * uLensRadius));
  // Magnifier: each pixel reads from a point nearer the pointer, so content spreads outward.
  vec2 lens = dd * uLensStrength * uLens * f;
  vec2 warp = (flow + lens) * uWarpOn;
  vec2 srcPx = pPx - warp;
  vec2 srcUv = vec2(srcPx.x, uViewport.y - srcPx.y) / uViewport;

  // Soft 5-tap blur of the density so the smoke edges never look hard.
  vec2 e = uTexel * 1.3;
  float d = (4.0 * texture(uDye, srcUv).x
    + texture(uDye, srcUv + vec2(e.x, 0.0)).x + texture(uDye, srcUv - vec2(e.x, 0.0)).x
    + texture(uDye, srcUv + vec2(0.0, e.y)).x + texture(uDye, srcUv - vec2(0.0, e.y)).x) / 8.0;
  float lit = smoothstep(0.02, 0.5, d);

  // Nebula: the dye is the mask; the baked field gives it gas filaments and dark dust lanes.
  vec4 neb = vec4(0.0);
  if (d > 0.004) {
    vec3 nf = texture(uNeb, srcUv).xyz;                      // n (body), r (ridge), dust lane
    float n = nf.x, r = nf.y, dust = nf.z * uNebDust;
    float body = d * (0.25 + 1.6 * n);
    // Tone follows the cloud structure (not just density) so dense smoke keeps its filaments.
    float t = (1.0 - exp(-2.2 * d)) * (0.2 + 0.95 * n) + uNebHot * r * r * r * smoothstep(0.15, 0.7, d) * 0.3;
    t = clamp(t, 0.0, 1.0);
    vec3 col = t < 0.4 ? mix(uDeep, uOrange, t / 0.4)
             : t < 0.8 ? mix(uOrange, uAmber, (t - 0.4) / 0.4)
             : mix(uAmber, mix(uAmber, uHot, 0.5), (t - 0.8) / 0.2);   // hot gold stays warm, never white
    col = mix(col, uDust, dust);
    float a = clamp(body * 1.35, 0.0, uMaxAlpha);
    a *= 1.0 - 0.4 * smoothstep(0.7, 1.0, t) * (1.0 - dust);   // the brightest gold stays translucent: text stays readable
    neb = vec4(col * 0.88 * a, a);                           // slightly under-exposed so white text stays readable
  }

  // Stars and constellation lines, baked; brighter inside the glow, as the dots used to be.
  // Drift moves the star lookups only (smoke and scene stay put), and adds to the warp above, so the
  // pointer still bends the stars as before.
  // Loose far stars: a sway with a broad and a finer component, so neighbours move differently.
  vec2 broad = vec2(sin(uTime * 0.23 + srcPx.y * 0.007) + 0.6 * sin(uTime * 0.11 + srcPx.x * 0.013 + 1.7),
                    cos(uTime * 0.19 + srcPx.x * 0.006) + 0.6 * cos(uTime * 0.13 + srcPx.y * 0.011));
  vec2 fine = vec2(sin(uTime * 0.61 + srcPx.y * 0.052 + srcPx.x * 0.021),
                   cos(uTime * 0.53 + srcPx.x * 0.047 - srcPx.y * 0.026));
  vec2 farPx = srcPx + (broad * 0.55 + fine * 0.45) * (uDrift / 1.6);

  // Near stars and constellations: every pixel of a constellation block gets the SAME offset, so the
  // block moves as one rigid piece and its lines stay straight. Blocks are the baked 4x4-cell squares
  // of the (rotated) near grid; the margin around each constellation's stars is empty, so the seams
  // between blocks never cut anything.
  float na = ${NEAR_ANGLE.toFixed(2)}, ca = cos(na), sa = sin(na);
  vec2 blk = floor(floor(mat2(ca, -sa, sa, ca) * srcPx / uSpacing) / uBlock);
  float h1 = fract(sin(dot(blk, vec2(127.1, 311.7))) * 43758.5453);
  float h2 = fract(sin(dot(blk, vec2(269.5, 183.3))) * 43758.5453);
  vec2 blockSway = vec2(sin(uTime * (0.31 + 0.22 * h1) + 6.2832 * h2),
                        cos(uTime * (0.27 + 0.22 * h2) + 6.2832 * h1));
  vec2 nearPx = srcPx + blockSway * uDrift;

  vec3 farRGB = texture(uFar, vec2(farPx.x, uViewport.y - farPx.y) / uViewport).rgb;
  vec4 nearT = texture(uStars, vec2(nearPx.x, uViewport.y - nearPx.y) / uViewport);
  // Twinkle: each ~20px cell gets its own phase and rate, so stars dip and recover out of step.
  vec2 fc = floor(farPx / 20.0), nc = floor(nearPx / 20.0);
  float fph = fract(sin(dot(fc, vec2(127.1, 311.7))) * 43758.5453);
  float nph = fract(sin(dot(nc, vec2(127.1, 311.7))) * 43758.5453);
  float ftw = 1.0 - uTwinkle * (0.5 + 0.5 * sin(uTime * (1.1 + 1.6 * fph) + 6.2832 * fph));
  float ntw = 1.0 - uTwinkle * (0.5 + 0.5 * sin(uTime * (1.1 + 1.6 * nph) + 6.2832 * nph));
  vec3 starRGB = min((farRGB * ftw + nearT.rgb * ntw) * mix(1.0, uLitBoost, lit), vec3(1.0));
  float starA = max(starRGB.r, max(starRGB.g, starRGB.b));
  float lineA = nearT.a * mix(uLineBase, uLineLit, lit);

  // Premultiplied composite: nebula first, then lines and stars on top.
  vec3 ink = uStarColor * lineA + starRGB;
  float inkA = clamp(lineA + starA, 0.0, 1.0);
  vec3 rgb = neb.rgb * (1.0 - inkA) + min(ink, vec3(inkA));
  vec4 over = vec4(rgb, inkA + neb.a * (1.0 - inkA));
  vec4 scene = uHasScene > 0.5 ? texture(uScene, srcUv) : vec4(0.0);
  o = over + scene * (1.0 - over.a);
}`,
};

/* ---------- GL helpers ---------- */

type Tex = { tex: WebGLTexture; fbo: WebGLFramebuffer; w: number; h: number; tx: number; ty: number };
type Double = { read: Tex; write: Tex; swap: () => void };
type Prog = { p: WebGLProgram; u: Record<string, WebGLUniformLocation | null> };

function resolution(res: number, w: number, h: number) {
  let aspect = w / h;
  if (aspect < 1) aspect = 1 / aspect;
  const min = Math.round(res);
  const max = Math.round(res * aspect);
  return w > h ? { w: max, h: min } : { w: min, h: max };
}

type SceneSource = HTMLCanvasElement | HTMLVideoElement | ImageBitmap;
type DisplayState = { lens: number; px: number; py: number };

function startGL(canvas: HTMLCanvasElement) {
  const gl = canvas.getContext("webgl2", { alpha: true, antialias: false, premultipliedAlpha: true });
  if (!gl) return null;

  const half = !!(gl.getExtension("EXT_color_buffer_float") || gl.getExtension("EXT_color_buffer_half_float"));
  let fmt = half
    ? { internal: gl.RGBA16F, type: gl.HALF_FLOAT }
    : { internal: gl.RGBA8, type: gl.UNSIGNED_BYTE };

  const makeTex = (w: number, h: number, rgba8 = false): Tex | null => {
    const tex = gl.createTexture();
    const fbo = gl.createFramebuffer();
    if (!tex || !fbo) return null;
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, rgba8 ? gl.RGBA8 : fmt.internal, w, h, 0, gl.RGBA, rgba8 ? gl.UNSIGNED_BYTE : fmt.type, null);
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
    gl.viewport(0, 0, w, h);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    return { tex, fbo, w, h, tx: 1 / w, ty: 1 / h };
  };

  // If half-float targets are not renderable, drop to RGBA8.
  const probe = makeTex(4, 4);
  if (!probe || gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE) {
    fmt = { internal: gl.RGBA8, type: gl.UNSIGNED_BYTE };
  }
  if (probe) {
    gl.deleteTexture(probe.tex);
    gl.deleteFramebuffer(probe.fbo);
  }

  const compile = (type: number, src: string) => {
    const s = gl.createShader(type)!;
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      console.warn("GlowBackground shader error:", gl.getShaderInfoLog(s));
      return null;
    }
    return s;
  };
  const vs = compile(gl.VERTEX_SHADER, VERT);
  if (!vs) return null;
  const shaders: WebGLShader[] = [vs];
  const programs: Prog[] = [];
  const make = (frag: string): Prog | null => {
    const fs = compile(gl.FRAGMENT_SHADER, frag);
    const p = gl.createProgram();
    if (!fs || !p) return null;
    shaders.push(fs);
    gl.attachShader(p, vs);
    gl.attachShader(p, fs);
    gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
      console.warn("GlowBackground link error:", gl.getProgramInfoLog(p));
      return null;
    }
    const u: Prog["u"] = {};
    const n = gl.getProgramParameter(p, gl.ACTIVE_UNIFORMS) as number;
    for (let i = 0; i < n; i++) {
      const name = gl.getActiveUniform(p, i)!.name;
      u[name] = gl.getUniformLocation(p, name);
    }
    const prog = { p, u };
    programs.push(prog);
    return prog;
  };

  const P = {
    splat: make(FRAG.splat), advect: make(FRAG.advect), divergence: make(FRAG.divergence),
    curl: make(FRAG.curl), vorticity: make(FRAG.vorticity), pressure: make(FRAG.pressure),
    gradient: make(FRAG.gradient), clear: make(FRAG.clear), display: make(FRAG.display),
    stars: make(FRAG.stars), nebula: make(FRAG.nebula),
  };
  if (Object.values(P).some((x) => !x)) return null;
  const pr = P as Record<keyof typeof P, Prog>;

  gl.disable(gl.BLEND);
  gl.disable(gl.DEPTH_TEST);

  const textures: Tex[] = [];
  const single = (w: number, h: number, rgba8 = false) => {
    const t = makeTex(w, h, rgba8)!;
    textures.push(t);
    return t;
  };
  const dbl = (w: number, h: number): Double => {
    const d: Double = { read: single(w, h), write: single(w, h), swap() { [d.read, d.write] = [d.write, d.read]; } };
    return d;
  };
  const free = () => {
    textures.forEach((t) => {
      gl.deleteTexture(t.tex);
      gl.deleteFramebuffer(t.fbo);
    });
    textures.length = 0;
  };

  let velocity!: Double, dye!: Double, pressure!: Double, divergence!: Tex, curl!: Tex;
  let starTex!: Tex, farTex!: Tex, nebTex!: Tex; // baked, static in screen space
  let aspect = 1;
  let cssW = 1, cssH = 1, dpr = 1;

  const build = () => {
    free();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    cssW = Math.max(1, canvas.clientWidth);
    cssH = Math.max(1, canvas.clientHeight);
    canvas.width = Math.round(cssW * dpr);
    canvas.height = Math.round(cssH * dpr);
    aspect = canvas.width / canvas.height;
    const sim = resolution(SIM_RES, canvas.width, canvas.height);
    const dyeR = resolution(DYE_RES, canvas.width, canvas.height);
    velocity = dbl(sim.w, sim.h);
    pressure = dbl(sim.w, sim.h);
    divergence = single(sim.w, sim.h);
    curl = single(sim.w, sim.h);
    dye = dbl(dyeR.w, dyeR.h);
    starTex = single(canvas.width, canvas.height, true); // near stars + lines, 1:1 with the canvas: pixel-exact at rest
    farTex = single(canvas.width, canvas.height, true); // loose far stars
    nebTex = single(Math.ceil(canvas.width / 2), Math.ceil(canvas.height / 2)); // smooth, half res is plenty
  };
  build();

  const bindProgram = (p: Prog) => gl.useProgram(p.p);
  const tex = (p: Prog, name: string, t: Tex, unit: number) => {
    gl.activeTexture(gl.TEXTURE0 + unit);
    gl.bindTexture(gl.TEXTURE_2D, t.tex);
    gl.uniform1i(p.u[name], unit);
  };
  const blit = (target: Tex | null) => {
    if (target) {
      gl.bindFramebuffer(gl.FRAMEBUFFER, target.fbo);
      gl.viewport(0, 0, target.w, target.h);
    } else {
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.viewport(0, 0, canvas.width, canvas.height);
    }
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };

  const splat = (x: number, y: number, dx: number, dy: number, density: number) => {
    let r = SPLAT_RADIUS / 100;
    if (aspect > 1) r *= aspect;
    bindProgram(pr.splat);
    gl.uniform2f(pr.splat.u.uTexel, velocity.read.tx, velocity.read.ty);
    gl.uniform1f(pr.splat.u.uAspect, aspect);
    gl.uniform2f(pr.splat.u.uPoint, x, y);
    gl.uniform1f(pr.splat.u.uRadius, r);
    tex(pr.splat, "uTarget", velocity.read, 0);
    gl.uniform3f(pr.splat.u.uColor, dx, dy, 0);
    blit(velocity.write);
    velocity.swap();
    tex(pr.splat, "uTarget", dye.read, 0);
    gl.uniform3f(pr.splat.u.uColor, density, density, density);
    blit(dye.write);
    dye.swap();
  };

  const step = (dt: number) => {
    const frames = dt * 60; // time-based dissipation: the constants are per frame at 60fps
    bindProgram(pr.curl);
    gl.uniform2f(pr.curl.u.uTexel, velocity.read.tx, velocity.read.ty);
    tex(pr.curl, "uVelocity", velocity.read, 0);
    blit(curl);

    bindProgram(pr.vorticity);
    gl.uniform2f(pr.vorticity.u.uTexel, velocity.read.tx, velocity.read.ty);
    tex(pr.vorticity, "uVelocity", velocity.read, 0);
    tex(pr.vorticity, "uCurl", curl, 1);
    gl.uniform1f(pr.vorticity.u.uCurlAmt, CURL);
    gl.uniform1f(pr.vorticity.u.uDt, dt);
    blit(velocity.write);
    velocity.swap();

    bindProgram(pr.divergence);
    gl.uniform2f(pr.divergence.u.uTexel, velocity.read.tx, velocity.read.ty);
    tex(pr.divergence, "uVelocity", velocity.read, 0);
    blit(divergence);

    bindProgram(pr.clear);
    gl.uniform2f(pr.clear.u.uTexel, pressure.read.tx, pressure.read.ty);
    tex(pr.clear, "uTexture", pressure.read, 0);
    gl.uniform1f(pr.clear.u.uValue, PRESSURE);
    blit(pressure.write);
    pressure.swap();

    bindProgram(pr.pressure);
    gl.uniform2f(pr.pressure.u.uTexel, velocity.read.tx, velocity.read.ty);
    tex(pr.pressure, "uDivergence", divergence, 1);
    for (let i = 0; i < PRESSURE_ITERATIONS; i++) {
      tex(pr.pressure, "uPressure", pressure.read, 0);
      blit(pressure.write);
      pressure.swap();
    }

    bindProgram(pr.gradient);
    gl.uniform2f(pr.gradient.u.uTexel, velocity.read.tx, velocity.read.ty);
    tex(pr.gradient, "uPressure", pressure.read, 0);
    tex(pr.gradient, "uVelocity", velocity.read, 1);
    blit(velocity.write);
    velocity.swap();

    bindProgram(pr.advect);
    gl.uniform2f(pr.advect.u.uTexel, velocity.read.tx, velocity.read.ty);
    tex(pr.advect, "uVelocity", velocity.read, 0);
    tex(pr.advect, "uSource", velocity.read, 1);
    gl.uniform1f(pr.advect.u.uDt, dt);
    gl.uniform1f(pr.advect.u.uDecay, Math.pow(VELOCITY_DISSIPATION, frames));
    blit(velocity.write);
    velocity.swap();

    tex(pr.advect, "uVelocity", velocity.read, 0);
    tex(pr.advect, "uSource", dye.read, 1);
    gl.uniform1f(pr.advect.u.uDecay, Math.pow(DENSITY_DISSIPATION, frames));
    blit(dye.write);
    dye.swap();
  };

  /** Draw the static layers (stars + constellations, nebula field) once. Call after every build(). */
  const bake = () => {
    const rgb = (c: string) => c.split(",").map((n) => Number(n) / 255);
    let p = pr.stars;
    bindProgram(p);
    gl.uniform2f(p.u.uViewport, cssW, cssH);
    gl.uniform3fv(p.u.uStarColor, rgb(STAR_COLOR));
    gl.uniform1f(p.u.uFarSpacing, FAR_STAR_SPACING);
    gl.uniform1f(p.u.uFarChance, FAR_STAR_CHANCE);
    gl.uniform1f(p.u.uFarOpacity, FAR_STAR_OPACITY);
    gl.uniform1f(p.u.uSpacing, STAR_SPACING);
    gl.uniform1f(p.u.uChance, STAR_CHANCE);
    gl.uniform1f(p.u.uStarOpacity, STAR_OPACITY);
    gl.uniform1f(p.u.uStarSize, STAR_SIZE);
    gl.uniform1f(p.u.uBlock, CONSTELLATION_BLOCK);
    gl.uniform1f(p.u.uBlockChance, CONSTELLATION_CHANCE);
    gl.uniform1f(p.u.uEdgeChance, CONSTELLATION_EDGES);
    gl.uniform1f(p.u.uLineWidth, LINE_WIDTH);
    gl.uniform1f(p.u.uPass, 0);
    blit(farTex);
    gl.uniform1f(p.u.uPass, 1);
    blit(starTex);
    p = pr.nebula;
    bindProgram(p);
    gl.uniform2f(p.u.uViewport, cssW, cssH);
    gl.uniform1f(p.u.uNebScale, NEBULA_SCALE);
    blit(nebTex);
  };
  bake();

  let sceneTex: WebGLTexture | null = null;
  const display = (st: DisplayState, scene: SceneSource | null) => {
    const d = pr.display;
    bindProgram(d);
    gl.clearColor(0, 0, 0, 0);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clear(gl.COLOR_BUFFER_BIT);
    tex(d, "uDye", dye.read, 0);
    tex(d, "uVelocity", velocity.read, 1);
    tex(d, "uStars", starTex, 3);
    tex(d, "uFar", farTex, 5);
    tex(d, "uNeb", nebTex, 4);
    if (scene) {
      // Optional scene: uploaded every frame, premultiplied, y-up, sampled at the warped uv.
      if (!sceneTex) {
        sceneTex = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, sceneTex);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      }
      gl.activeTexture(gl.TEXTURE2);
      gl.bindTexture(gl.TEXTURE_2D, sceneTex);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, scene);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
      gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
      gl.uniform1i(d.u.uScene, 2);
    }
    gl.uniform1f(d.u.uHasScene, scene ? 1 : 0);
    gl.uniform2f(d.u.uTexel, dye.read.tx, dye.read.ty);
    gl.uniform2f(d.u.uViewport, cssW, cssH);
    gl.uniform2f(d.u.uPointer, st.px, st.py);
    gl.uniform1f(d.u.uLens, st.lens);
    gl.uniform1f(d.u.uWarpOn, WARP_ENABLED ? 1 : 0);
    gl.uniform1f(d.u.uFlowScale, WARP_FLOW_SCALE);
    gl.uniform1f(d.u.uWarpMax, WARP_MAX_PX);
    gl.uniform1f(d.u.uLensRadius, LENS_RADIUS);
    gl.uniform1f(d.u.uLensStrength, LENS_STRENGTH);
    gl.uniform3fv(d.u.uDust, hex(COLORS.dust));
    gl.uniform3fv(d.u.uDeep, hex(COLORS.deep));
    gl.uniform3fv(d.u.uOrange, hex(COLORS.orange));
    gl.uniform3fv(d.u.uAmber, hex(COLORS.amber));
    gl.uniform3fv(d.u.uHot, hex(COLORS.hot));
    gl.uniform3fv(d.u.uStarColor, STAR_COLOR.split(",").map((n) => Number(n) / 255));
    gl.uniform1f(d.u.uMaxAlpha, GLOW_MAX_ALPHA);
    gl.uniform1f(d.u.uNebDust, NEBULA_DUST);
    gl.uniform1f(d.u.uNebHot, NEBULA_HOT);
    gl.uniform1f(d.u.uLitBoost, STAR_LIT_BOOST);
    gl.uniform1f(d.u.uTime, (performance.now() / 1000) * STAR_DRIFT_SPEED);
    gl.uniform1f(d.u.uDrift, STAR_DRIFT_PX);
    gl.uniform1f(d.u.uSpacing, STAR_SPACING);
    gl.uniform1f(d.u.uBlock, CONSTELLATION_BLOCK);
    gl.uniform1f(d.u.uTwinkle, STAR_TWINKLE);
    gl.uniform1f(d.u.uLineBase, LINE_BASE_OPACITY);
    gl.uniform1f(d.u.uLineLit, LINE_LIT_OPACITY);
    blit(null);
  };

  const wipe = () => {
    [velocity, pressure, dye].forEach((d) => [d.read, d.write].forEach((t) => {
      gl.bindFramebuffer(gl.FRAMEBUFFER, t.fbo);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
    }));
  };

  const dispose = () => {
    free();
    if (sceneTex) gl.deleteTexture(sceneTex);
    programs.forEach((p) => gl.deleteProgram(p.p));
    shaders.forEach((s) => gl.deleteShader(s));
  };

  const rebuild = () => {
    build();
    bake();
  };

  return { splat, step, display, build: rebuild, wipe, dispose };
}

/* ---------- 2D fallback: stamped radial gradients that fade out ----------
 * No warp here: the fallback has no velocity field, and the dots stay on the CSS grid. */

function start2D(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  canvas.style.filter = "blur(18px)";
  const resize = () => {
    canvas.width = Math.max(1, canvas.clientWidth);
    canvas.height = Math.max(1, canvas.clientHeight);
  };
  resize();
  return {
    resize,
    stamp(x: number, y: number, speed: number) {
      const r = 70;
      const a = Math.min(0.5, speed * 12);
      const g = ctx.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, `rgba(255,176,102,${a})`);
      g.addColorStop(0.45, `rgba(255,95,0,${a * 0.7})`);
      g.addColorStop(1, "rgba(255,95,0,0)");
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = g;
      ctx.fillRect(x - r, y - r, r * 2, r * 2);
    },
    fade() {
      ctx.globalCompositeOperation = "destination-out";
      ctx.fillStyle = "rgba(0,0,0,0.04)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    },
  };
}

/* CSS fallback stars: [x%, y%, radius px, opacity, tile px]. */
const STAR_TILES = [
  [13, 21, 0.7, 0.5, 131], [71, 64, 0.6, 0.4, 131], [42, 88, 0.5, 0.35, 131],
  [58, 12, 1.0, 0.7, 197], [9, 74, 0.7, 0.45, 197], [86, 41, 0.6, 0.4, 197],
  [33, 47, 0.5, 0.3, 83], [78, 9, 0.5, 0.3, 83], [20, 93, 0.5, 0.3, 83],
  [64, 37, 1.2, 0.75, 311], [27, 81, 0.9, 0.55, 311],
] as const;

/* ---------- component ---------- */

export function GlowBackground({ sceneTexture = null }: { sceneTexture?: SceneSource | null }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<SceneSource | null>(sceneTexture);
  useEffect(() => {
    sceneRef.current = sceneTexture;
  }, [sceneTexture]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    // Reduced motion: no loop, no warp; the CSS dot grid and #111 are all that show.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const gl = startGL(canvas);
    const flat = gl ? null : start2D(canvas);
    if (!gl && !flat) return;

    // Pointer travel accumulated between frames, in viewport-normalised units (and px for the lens).
    const ptr = { x: 0, y: 0, has: false }; // last position, css px
    const pending = { dx: 0, dy: 0, px: 0, x: 0, y: 0, moved: false };
    const smooth = { x: 0, y: 0, lens: 0 }; // smoothed pointer and lens intensity
    let lastSplat = -1e9;
    let settled = false; // sim textures already cleared for the idle sky
    let lastDraw = 0;
    let raf = 0;
    let last = 0;

    const rest = (): DisplayState => ({ lens: 0, px: smooth.x, py: smooth.y });
    /** One static frame: zero density, zero warp. Also carries the dots. */
    const drawStill = () => {
      smooth.lens = 0;
      gl?.wipe();
      gl?.display(rest(), sceneRef.current);
    };

    const onPoint = (cx: number, cy: number) => {
      const r = canvas.getBoundingClientRect();
      const x = cx - r.left;
      const y = cy - r.top;
      if (ptr.has) {
        pending.dx += (x - ptr.x) / r.width;
        pending.dy += (ptr.y - y) / r.height; // GL y points up
        pending.px += Math.hypot(x - ptr.x, y - ptr.y);
        pending.moved = true;
      } else {
        smooth.x = x; // snap the lens to the pointer when it (re)enters
        smooth.y = y;
      }
      ptr.x = x;
      ptr.y = y;
      ptr.has = true;
      pending.x = x / r.width;
      pending.y = 1 - y / r.height;
      if (!raf && !document.hidden) {
        last = performance.now();
        raf = requestAnimationFrame(loop);
      }
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "touch") onPoint(e.clientX, e.clientY);
    };
    const onTouch = (e: TouchEvent) => {
      const t = e.touches[0];
      if (t) onPoint(t.clientX, t.clientY);
    };
    const onEnd = () => {
      ptr.has = false;
    };

    const loop = (now: number) => {
      const dt = Math.min((now - last) / 1000, 1 / 30);
      last = now;
      const frames = dt * 60; // all smoothing is per-frame-at-60fps, made time-based
      const movedPx = pending.px;
      if (pending.moved) {
        const aspect = canvas.clientWidth / canvas.clientHeight;
        // Same units for both axes: fractions of the viewport, aspect-corrected.
        let dx = pending.dx;
        let dy = pending.dy;
        const speed = Math.hypot(dx, dy * (aspect > 1 ? 1 / aspect : 1));
        if (speed > 0.0004) {
          if (aspect < 1) dx *= aspect;
          if (aspect > 1) dy /= aspect;
          if (gl) {
            const density = Math.min(speed * DENSITY_GAIN, DENSITY_MAX);
            gl.splat(pending.x, pending.y, dx * SPLAT_FORCE, dy * SPLAT_FORCE, density);
          } else if (flat) {
            flat.stamp(ptr.x, ptr.y, speed);
          }
          lastSplat = now;
        }
        pending.dx = pending.dy = pending.px = 0;
        pending.moved = false;
      }

      // Smoke has faded: stop the fluid sim, keep the sky drifting at a low frame rate.
      const idle = now - lastSplat > IDLE_MS && !sceneRef.current;
      if (idle && gl) {
        if (!settled) {
          settled = true;
          drawStill(); // clears the sim textures once
        } else if (now - lastDraw >= 1000 / IDLE_FPS - 2) {
          lastDraw = now;
          gl.display(rest(), null);
        }
        raf = requestAnimationFrame(loop);
        return;
      }
      settled = false;

      // Lens: eased pointer, and an intensity that rises fast on movement and relaxes slowly.
      const kp = 1 - Math.pow(1 - POINTER_LERP, frames);
      smooth.x += (ptr.x - smooth.x) * kp;
      smooth.y += (ptr.y - smooth.y) * kp;
      const target = ptr.has ? Math.min(movedPx / Math.max(frames, 0.25) / LENS_SPEED_REF, 1) : 0;
      const rate = target > smooth.lens ? LENS_RISE : LENS_FALL;
      smooth.lens += (target - smooth.lens) * (1 - Math.pow(1 - rate, frames));

      if (gl) {
        gl.step(dt);
        gl.display({ lens: smooth.lens, px: smooth.x, py: smooth.y }, sceneRef.current);
      } else if (flat) {
        flat.fade();
      }
      // The 2D fallback has no drift, so it still sleeps once its trail has faded.
      if (!gl && idle) {
        raf = 0;
        return;
      }
      raf = requestAnimationFrame(loop);
    };

    const onVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(raf);
        raf = 0;
      } else if (!raf && (gl || sceneRef.current || performance.now() - lastSplat < IDLE_MS)) {
        last = performance.now();
        raf = requestAnimationFrame(loop);
      }
    };

    const ro = new ResizeObserver(() => {
      if (gl) {
        gl.build();
        if (raf) gl.display({ lens: smooth.lens, px: smooth.x, py: smooth.y }, sceneRef.current);
        else drawStill();
      }
      flat?.resize();
    });
    ro.observe(canvas);

    // First frame: the shader draws the stars, so hide the CSS star field in the same task (no double dots).
    if (gl) {
      drawStill();
      wrap.dataset.gl = "true";
      // The loop always runs with WebGL: it drifts the stars, and drops to IDLE_FPS once the smoke is gone.
      raf = requestAnimationFrame((t) => { last = t; settled = true; loop(t); });
    }

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("touchmove", onTouch, { passive: true });
    window.addEventListener("touchend", onEnd);
    window.addEventListener("pointerleave", onEnd);
    document.documentElement.addEventListener("mouseleave", onEnd);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      delete wrap.dataset.gl;
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("touchmove", onTouch);
      window.removeEventListener("touchend", onEnd);
      window.removeEventListener("pointerleave", onEnd);
      document.documentElement.removeEventListener("mouseleave", onEnd);
      document.removeEventListener("visibilitychange", onVisibility);
      gl?.dispose();
    };
  }, []);

  return (
    <div ref={wrapRef} aria-hidden className="group/glow pointer-events-none fixed inset-x-0 top-0 -z-[1] h-lvh">
      {/* CSS star field: fallback only (no WebGL, or reduced motion). Coprime tile sizes keep it from reading as a grid. */}
      <div
        className="absolute inset-0 group-data-[gl=true]/glow:hidden"
        style={{
          backgroundImage: STAR_TILES.map(
            ([x, y, r, a]) => `radial-gradient(circle at ${x}% ${y}%, rgba(${STAR_COLOR},${a}) ${r}px, transparent ${r + 0.8}px)`,
          ).join(","),
          backgroundSize: STAR_TILES.map(([, , , , tile]) => `${tile}px ${tile}px`).join(","),
        }}
      />
      <canvas ref={canvasRef} className="absolute inset-0 block size-full" />
    </div>
  );
}
