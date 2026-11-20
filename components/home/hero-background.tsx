"use client";

import { useEffect, useRef } from "react";

/**
 * Hero background: black with a grid of geometric dots. The cursor leaves a
 * glowing trail that fades from brand orange (#FF5200) to olive ochre (#D1BD19)
 * and lights up and swells the dots it passes over. Falls back to plain black
 * if WebGL is unavailable; reduced motion renders the still dot grid only.
 */

const TRAIL = 48; // trail points
const LIFE = 1.4; // seconds a trail point lasts

const VERT = `
attribute vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
`;

const FRAG = `
precision highp float;
#define TRAIL ${TRAIL}
uniform vec2 uRes;
uniform float uDpr;
uniform vec3 uTrail[TRAIL]; // xy = position in px (origin bottom-left), z = life 0..1

const vec3 ORANGE = vec3(1.0, 0.3216, 0.0);        // #FF5200
const vec3 OCHRE  = vec3(0.8196, 0.7412, 0.0980);  // #D1BD19

void main() {
  vec2 frag = gl_FragCoord.xy;
  float radius = 150.0 * uDpr;
  float k = 1.0 / (radius * radius);

  // Trail glow: young points are orange, old points fade towards ochre.
  vec3 glow = vec3(0.0);
  float amount = 0.0;
  for (int i = 0; i < TRAIL; i++) {
    vec2 d = frag - uTrail[i].xy;
    float life = uTrail[i].z;
    float f = exp(-dot(d, d) * k) * life * life * 0.22;
    glow += f * mix(OCHRE, ORANGE, life);
    amount += f;
  }

  // Dot grid: round dots on a square lattice, swelling and glowing in the trail.
  float cell = 34.0 * uDpr;
  vec2 g = frag / cell;
  vec2 local = (fract(g) - 0.5) * cell;
  float r = (1.5 + 2.6 * min(amount, 1.0)) * uDpr;
  float dot_ = 1.0 - smoothstep(r - 0.8 * uDpr, r + 0.4 * uDpr, length(local));

  vec3 dotCol = mix(vec3(0.30), glow / max(amount, 0.0001) * 1.15, min(amount * 2.5, 1.0));
  vec3 col = dotCol * dot_;
  col += glow * 0.6; // soft blurred trail behind the dots

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
    const uDpr = gl.getUniformLocation(prog, "uDpr");
    const uTrail = gl.getUniformLocation(prog, "uTrail[0]");

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    // Ring buffer of trail points: position in canvas px and birth time (ms).
    const pts = Array.from({ length: TRAIL }, () => ({ x: 0, y: 0, born: -1e9 }));
    let head = 0;
    const cursor = { x: 0, y: 0, has: false }; // latest pointer, canvas px
    const smooth = { x: 0, y: 0, has: false }; // eased follower of the pointer
    const data = new Float32Array(TRAIL * 3);
    let w = 1;
    let h = 1;
    let dpr = 1;
    let raf = 0;
    let visible = true;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const r = canvas.getBoundingClientRect();
      w = Math.max(1, Math.round(r.width * dpr));
      h = Math.max(1, Math.round(r.height * dpr));
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
    };

    const draw = (now: number) => {
      if (cursor.has) {
        if (!smooth.has) {
          smooth.x = cursor.x;
          smooth.y = cursor.y;
          smooth.has = true;
        }
        const px = smooth.x;
        const py = smooth.y;
        smooth.x += (cursor.x - smooth.x) * 0.3;
        smooth.y += (cursor.y - smooth.y) * 0.3;
        // Drop points along the eased path; skip when the pointer is at rest.
        const dist = Math.hypot(smooth.x - px, smooth.y - py);
        const steps = Math.min(4, Math.ceil(dist / (14 * dpr)));
        if (dist > 0.5 * dpr) {
          for (let s = 1; s <= steps; s++) {
            const t = s / steps;
            const p = pts[head];
            p.x = px + (smooth.x - px) * t;
            p.y = py + (smooth.y - py) * t;
            p.born = now;
            head = (head + 1) % TRAIL;
          }
        }
      }
      for (let i = 0; i < TRAIL; i++) {
        const p = pts[i];
        const life = Math.max(0, 1 - (now - p.born) / (LIFE * 1000));
        data[i * 3] = p.x;
        data[i * 3 + 1] = p.y;
        data[i * 3 + 2] = life;
      }
      gl.uniform2f(uRes, w, h);
      gl.uniform1f(uDpr, dpr);
      gl.uniform3fv(uTrail, data);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const loop = (now: number) => {
      draw(now);
      raf = visible ? requestAnimationFrame(loop) : 0;
    };

    // The page content sits above the canvas, so listen on the window.
    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      cursor.has = e.clientY >= r.top && e.clientY <= r.bottom && e.clientX >= r.left && e.clientX <= r.right;
      if (!cursor.has) {
        smooth.has = false;
        return;
      }
      cursor.x = (e.clientX - r.left) * dpr;
      cursor.y = (r.bottom - e.clientY) * dpr;
    };

    resize();
    const ro = new ResizeObserver(() => {
      resize();
      if (reduce.matches) draw(0);
    });
    ro.observe(canvas);

    let io: IntersectionObserver | undefined;
    if (reduce.matches) {
      draw(0); // still dot grid, no trail
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
    <div aria-hidden className="pointer-events-none absolute inset-0 bg-black">
      <canvas ref={canvasRef} className="size-full" />
    </div>
  );
}
