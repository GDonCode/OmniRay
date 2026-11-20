"use client";

import { useEffect, useRef } from "react";

/* ---------- tunables (see README, "Hero effects") ---------- */
export const SIM_RES = 128; // velocity grid, px on the short side
export const DYE_RES = 512; // density grid, px on the short side
export const SPLAT_RADIUS = 0.25; // % of viewport area covered by one splat (~80-120px)
export const SPLAT_FORCE = 6000; // velocity injected per unit of normalised pointer travel
export const DENSITY_GAIN = 12; // dye added per unit of normalised pointer speed
export const DENSITY_MAX = 0.22; // clamp for dye added per frame
export const DENSITY_DISSIPATION = 0.99; // per frame at 60fps (time-based)
export const VELOCITY_DISSIPATION = 0.98; // per frame at 60fps (time-based)
export const PRESSURE = 0.8;
export const PRESSURE_ITERATIONS = 20;
export const CURL = 10;
export const GLOW_MAX_ALPHA = 0.75;
export const COLORS = { deep: "#7a2a00", orange: "#ff5f00", amber: "#ffb066" };
export const DOT_SPACING = 40; // px
export const DOT_BASE_OPACITY = 0.18; // CSS layer, everywhere
export const DOT_LIT_OPACITY = 0.7; // drawn in the shader, only inside the glow
export const DOT_COLOR = "232,220,200"; // cream
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
  display: head + `
uniform sampler2D uDye; uniform vec2 uTexel; uniform vec2 uSize; uniform float uDpr;
uniform vec3 uDeep; uniform vec3 uOrange; uniform vec3 uAmber; uniform vec3 uDotColor;
uniform float uMaxAlpha; uniform float uSpacing; uniform float uLitOpacity;
void main() {
  // Soft 5-tap blur of the density so the smoke edges never look hard.
  vec2 e = uTexel * 1.3;
  float d = (4.0 * texture(uDye, vUv).x
    + texture(uDye, vUv + vec2(e.x, 0.0)).x + texture(uDye, vUv - vec2(e.x, 0.0)).x
    + texture(uDye, vUv + vec2(0.0, e.y)).x + texture(uDye, vUv - vec2(0.0, e.y)).x) / 8.0;

  float t = 1.0 - exp(-1.1 * d);
  vec3 col = t < 0.5 ? mix(uDeep, uOrange, t * 2.0) : mix(uOrange, uAmber, (t - 0.5) * 2.0);
  float a = clamp(d * 1.2, 0.0, uMaxAlpha);

  // Dot grid drawn in the shader, aligned with the CSS grid (top-left origin, dot at cell centre).
  vec2 css = vec2(gl_FragCoord.x, uSize.y - gl_FragCoord.y) / uDpr;
  vec2 local = mod(css, uSpacing) - 0.5 * uSpacing;
  float dotMask = 1.0 - smoothstep(0.6, 1.3, length(local));
  float lit = dotMask * uLitOpacity * smoothstep(0.02, 0.5, d);

  vec3 rgb = col * a * (1.0 - lit) + uDotColor * lit;   // premultiplied
  o = vec4(rgb, a + lit * (1.0 - a));
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

function startGL(canvas: HTMLCanvasElement) {
  const gl = canvas.getContext("webgl2", { alpha: true, antialias: false, premultipliedAlpha: true });
  if (!gl) return null;

  const half = !!(gl.getExtension("EXT_color_buffer_float") || gl.getExtension("EXT_color_buffer_half_float"));
  let fmt = half
    ? { internal: gl.RGBA16F, type: gl.HALF_FLOAT }
    : { internal: gl.RGBA8, type: gl.UNSIGNED_BYTE };

  const makeTex = (w: number, h: number): Tex | null => {
    const tex = gl.createTexture();
    const fbo = gl.createFramebuffer();
    if (!tex || !fbo) return null;
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, fmt.internal, w, h, 0, gl.RGBA, fmt.type, null);
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
      console.warn("FluidBackground shader error:", gl.getShaderInfoLog(s));
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
      console.warn("FluidBackground link error:", gl.getProgramInfoLog(p));
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
  };
  if (Object.values(P).some((x) => !x)) return null;
  const pr = P as Record<keyof typeof P, Prog>;

  gl.disable(gl.BLEND);
  gl.disable(gl.DEPTH_TEST);

  const textures: Tex[] = [];
  const single = (w: number, h: number) => {
    const t = makeTex(w, h)!;
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

  const display = () => {
    const d = pr.display;
    bindProgram(d);
    gl.clearColor(0, 0, 0, 0);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.clear(gl.COLOR_BUFFER_BIT);
    tex(d, "uDye", dye.read, 0);
    gl.uniform2f(d.u.uTexel, dye.read.tx, dye.read.ty);
    gl.uniform2f(d.u.uSize, canvas.width, canvas.height);
    gl.uniform1f(d.u.uDpr, dpr);
    gl.uniform3fv(d.u.uDeep, hex(COLORS.deep));
    gl.uniform3fv(d.u.uOrange, hex(COLORS.orange));
    gl.uniform3fv(d.u.uAmber, hex(COLORS.amber));
    gl.uniform3fv(d.u.uDotColor, DOT_COLOR.split(",").map((n) => Number(n) / 255));
    gl.uniform1f(d.u.uMaxAlpha, GLOW_MAX_ALPHA);
    gl.uniform1f(d.u.uSpacing, DOT_SPACING);
    gl.uniform1f(d.u.uLitOpacity, DOT_LIT_OPACITY);
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
    programs.forEach((p) => gl.deleteProgram(p.p));
    shaders.forEach((s) => gl.deleteShader(s));
  };

  return { splat, step, display, build, wipe, dispose };
}

/* ---------- 2D fallback: stamped radial gradients that fade out ---------- */

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

/* ---------- component ---------- */

export function FluidBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    // Reduced motion: render nothing; the base dots and #111 are all that show.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const gl = startGL(canvas);
    const flat = gl ? null : start2D(canvas);
    if (!gl && !flat) return;

    // Pointer travel accumulated between frames, in viewport-normalised units.
    const ptr = { x: 0, y: 0, has: false }; // last position, px
    const pending = { dx: 0, dy: 0, x: 0, y: 0, moved: false };
    let lastSplat = -1e9;
    let raf = 0;
    let last = 0;

    const onPoint = (cx: number, cy: number) => {
      const r = canvas.getBoundingClientRect();
      const x = cx - r.left;
      const y = cy - r.top;
      if (ptr.has) {
        pending.dx += (x - ptr.x) / r.width;
        pending.dy += (ptr.y - y) / r.height; // GL y points up
        pending.moved = true;
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
        pending.dx = pending.dy = 0;
        pending.moved = false;
      }
      if (gl) {
        gl.step(dt);
        gl.display();
      } else if (flat) {
        flat.fade();
      }
      if (now - lastSplat > IDLE_MS) {
        // Nothing visible any more: clear and sleep until the pointer moves again.
        gl?.wipe();
        gl?.display();
        raf = 0;
        return;
      }
      raf = requestAnimationFrame(loop);
    };

    const onVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(raf);
        raf = 0;
      } else if (!raf && performance.now() - lastSplat < IDLE_MS) {
        last = performance.now();
        raf = requestAnimationFrame(loop);
      }
    };

    const ro = new ResizeObserver(() => {
      gl?.build();
      flat?.resize();
    });
    ro.observe(canvas);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("touchmove", onTouch, { passive: true });
    window.addEventListener("touchend", onEnd);
    window.addEventListener("pointerleave", onEnd);
    document.documentElement.addEventListener("mouseleave", onEnd);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
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
    <div aria-hidden className="pointer-events-none fixed inset-x-0 top-0 -z-[1] h-lvh">
      {/* Faint base dot grid, everywhere. The shader redraws brighter dots inside the glow. */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(${DOT_COLOR},${DOT_BASE_OPACITY}) 1px, transparent 1px)`,
          backgroundSize: `${DOT_SPACING}px ${DOT_SPACING}px`,
        }}
      />
      <canvas ref={canvasRef} className="absolute inset-0 block size-full" />
    </div>
  );
}
