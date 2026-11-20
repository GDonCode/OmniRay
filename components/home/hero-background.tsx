"use client";

import { useEffect, useRef } from "react";

/**
 * Hero background: a WebGL shader that blends brand orange (#FF5200), olive
 * ochre (#D1BD19) and black (#000000) with slow flowing noise. The cursor drags
 * a trail of warped colour through it. Falls back to a static CSS gradient when
 * WebGL is unavailable, and renders a single still frame for reduced motion.
 */

const TRAIL = 8;

const VERT = `
attribute vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
`;

const FRAG = `
precision highp float;
#define TRAIL ${TRAIL}
uniform vec2 uRes;
uniform float uTime;
uniform vec3 uTrail[TRAIL]; // xy = position (aspect-corrected), z = strength

const vec3 ORANGE = vec3(1.0, 0.3216, 0.0);   // #FF5200
const vec3 OCHRE  = vec3(0.8196, 0.7412, 0.0980); // #D1BD19
const vec3 BLACK  = vec3(0.0);

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), f.x),
             mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), f.x), f.y);
}
float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p = p * 2.02 + vec2(17.1, 9.2);
    a *= 0.5;
  }
  return v;
}

void main() {
  vec2 p = (gl_FragCoord.xy - 0.5 * uRes) / uRes.y;
  float t = uTime * 0.06;

  // Cursor trail: swirl the sample point around each trail node and add glow.
  vec2 q = p;
  float glow = 0.0;
  for (int i = 0; i < TRAIL; i++) {
    vec2 d = p - uTrail[i].xy;
    float f = exp(-dot(d, d) * 7.0) * uTrail[i].z;
    q += vec2(-d.y, d.x) * f * 0.9 - d * f * 0.35;
    glow += f;
  }

  // Domain-warped noise gives the liquid, blended look.
  vec2 w = vec2(fbm(q * 1.6 + vec2(t, -t)), fbm(q * 1.6 + vec2(-t, t) + 5.2));
  float n = fbm(q * 1.2 + 2.2 * w + t);
  float m = fbm(q * 0.9 - 1.6 * w + vec2(3.1, -t));

  // black -> orange -> ochre, with black always keeping a strong share.
  vec3 col = mix(BLACK, ORANGE, smoothstep(0.30, 0.68, n));
  col = mix(col, OCHRE, smoothstep(0.44, 0.72, m) * smoothstep(0.32, 0.55, n));
  col += glow * 0.22 * mix(ORANGE, OCHRE, smoothstep(0.4, 1.4, glow));

  // Darken the middle band so white copy stays readable on the bright blends.
  vec2 uv = gl_FragCoord.xy / uRes;
  float shade = smoothstep(0.95, 0.12, length((uv - vec2(0.5, 0.54)) * vec2(1.0, 1.7)));
  col *= 1.0 - 0.62 * shade;

  // Soft edge vignette and a little film grain to avoid banding.
  col *= 1.0 - 0.35 * smoothstep(0.55, 1.1, length(uv - 0.5));
  col += (hash(gl_FragCoord.xy + fract(uTime)) - 0.5) * 0.025;

  gl_FragColor = vec4(col, 1.0);
}
`;

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const s = gl.createShader(type);
  if (!s) return null;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    gl.deleteShader(s);
    return null;
  }
  return s;
}

export function HeroBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", { antialias: false, alpha: false });
    if (!gl) return;

    const vs = compile(gl, gl.VERTEX_SHADER, VERT);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    const prog = gl.createProgram();
    if (!vs || !fs || !prog) return;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "aPos");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, "uRes");
    const uTime = gl.getUniformLocation(prog, "uTime");
    const uTrail = gl.getUniformLocation(prog, "uTrail[0]");

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const trail = Array.from({ length: TRAIL }, () => ({ x: 0.15, y: 0.1, s: 0 }));
    const mouse = { x: 0, y: 0, active: false, last: 0 };
    const data = new Float32Array(TRAIL * 3);
    let w = 1;
    let h = 1;
    let raf = 0;
    let visible = true;
    const start = performance.now();

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const r = canvas.getBoundingClientRect();
      w = Math.max(1, Math.round(r.width * dpr));
      h = Math.max(1, Math.round(r.height * dpr));
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
    };

    const draw = (now: number) => {
      const time = (now - start) / 1000;
      const aspect = w / h;
      // With no recent pointer movement, a slow drift keeps the surface alive.
      const idle = !mouse.active || now - mouse.last > 2500;
      const tx = idle ? Math.sin(time * 0.35) * 0.35 * aspect : mouse.x;
      const ty = idle ? Math.cos(time * 0.27) * 0.25 : mouse.y;
      let px = tx;
      let py = ty;
      for (let i = 0; i < TRAIL; i++) {
        const n = trail[i];
        const k = idle ? 0.04 : 0.28 - i * 0.02;
        const nx = n.x + (px - n.x) * k;
        const ny = n.y + (py - n.y) * k;
        const speed = Math.hypot(nx - n.x, ny - n.y) * 40;
        n.s += (Math.min(1, speed + (idle ? 0.25 : 0.4)) * (1 - i / (TRAIL * 1.4)) - n.s) * 0.1;
        n.x = nx;
        n.y = ny;
        px = nx;
        py = ny;
        data[i * 3] = nx;
        data[i * 3 + 1] = ny;
        data[i * 3 + 2] = n.s;
      }
      gl.uniform2f(uRes, w, h);
      gl.uniform1f(uTime, time);
      gl.uniform3fv(uTrail, data);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const loop = (now: number) => {
      draw(now);
      raf = visible ? requestAnimationFrame(loop) : 0;
    };

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      if (
        e.clientX < r.left || e.clientX > r.right ||
        e.clientY < r.top || e.clientY > r.bottom
      ) {
        mouse.active = false;
        return;
      }
      const aspect = r.width / r.height;
      mouse.x = ((e.clientX - r.left) / r.width - 0.5) * aspect;
      mouse.y = 0.5 - (e.clientY - r.top) / r.height;
      mouse.active = true;
      mouse.last = performance.now();
    };

    resize();
    const ro = new ResizeObserver(() => {
      resize();
      if (reduce.matches) draw(start + 4000);
    });
    ro.observe(canvas);

    let io: IntersectionObserver | undefined;
    if (reduce.matches) {
      draw(start + 4000); // one still frame, no animation
    } else {
      window.addEventListener("pointermove", onMove, { passive: true });
      io = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
        if (visible && !raf) raf = requestAnimationFrame(loop);
      });
      io.observe(canvas);
      raf = requestAnimationFrame(loop);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      ro.disconnect();
      io?.disconnect();
      gl.deleteProgram(prog);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteBuffer(buf);
    };
  }, []);

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 bg-black [background-image:radial-gradient(60%_80%_at_15%_20%,#FF5200_0%,transparent_70%),radial-gradient(50%_70%_at_85%_80%,#D1BD19_0%,transparent_70%)]"
    >
      <canvas ref={canvasRef} className="size-full" />
    </div>
  );
}
