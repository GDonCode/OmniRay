"use client";

import { useEffect, useRef } from "react";

/* ---------- tunables (see README, "Hero effects") ---------- */
export const PARTICLE_CONFIG = {
  /** Latitude rings x points per ring = total points (~12.6k). */
  latRings: 90,
  pointsPerRing: 140,
  /** Sphere diameter as a share of viewport width (420px at 1536px). */
  sizeVw: 0.273,
  /** Never let the sphere get smaller than this many CSS px across. */
  minDiameter: 260,
  /** Sphere centre as a share of viewport width / height. */
  centerX: 0.72,
  centerY: 0.5,
  /** Radius displacement from 3D simplex noise (fraction of radius). */
  noiseAmplitude: 0.18,
  /** Speed of the shape morph. */
  noiseSpeed: 0.22,
  /** Y rotation, radians per second. */
  rotationSpeed: 0.07,
  /** Fixed tilt of the rotation axis, radians. */
  tilt: 0.28,
  /** Point size range in CSS px. */
  pointMin: 1.5,
  pointMax: 5,
  /** Share of orange points (rest are cream); more orange at the rim. */
  orangeShare: 0.55,
  /** Pointer parallax strength in radians (0 disables). */
  parallax: 0.12,
  /** Glow canvas is the viewport divided by this. */
  glowDivisor: 16,
  maxDpr: 2,
} as const;

const C = PARTICLE_CONFIG;

const VERT = `
attribute vec3 aDir;
attribute vec4 aRnd; // x size, y colour pick, z brightness, w alpha
uniform float uTime;
uniform float uRadius;
uniform vec2 uView;    // viewport in CSS px
uniform vec2 uCenter;  // sphere centre in CSS px
uniform vec2 uParallax;
uniform float uDpr;
varying vec4 vCol;

// 3D simplex noise (Ashima Arts / Ian McEwan, MIT)
vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1.0/6.0,1.0/3.0);
  const vec4 D=vec4(0.0,0.5,1.0,2.0);
  vec3 i=floor(v+dot(v,C.yyy));
  vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz);
  vec3 l=1.0-g;
  vec3 i1=min(g.xyz,l.zxy);
  vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx;
  vec3 x2=x0-i2+C.yyy;
  vec3 x3=x0-D.yyy;
  i=mod289(i);
  vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));
  float n_=0.142857142857;
  vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.0*floor(p*ns.z*ns.z);
  vec4 x_=floor(j*ns.z);
  vec4 y_=floor(j-7.0*x_);
  vec4 x=x_*ns.x+ns.yyyy;
  vec4 y=y_*ns.x+ns.yyyy;
  vec4 h=1.0-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy);
  vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.0+1.0;
  vec4 s1=floor(b1)*2.0+1.0;
  vec4 sh=-step(h,vec4(0.0));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;
  vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x);
  vec3 p1=vec3(a0.zw,h.y);
  vec3 p2=vec3(a1.xy,h.z);
  vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
  vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);
  m=m*m;
  return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}

void main() {
  float t = uTime * ${C.noiseSpeed.toFixed(3)};

  // Low-frequency noise morphs the radius; a slow global term tapers / skews it.
  float n = 0.75 * snoise(aDir * 0.95 + vec3(0.0, t, 0.0))
          + 0.25 * snoise(aDir * 1.7 + vec3(5.0, 0.0, t * 0.8));
  float shape = snoise(vec3(t * 0.6, 3.0, 1.0));
  vec3 p = aDir * (1.0 + ${C.noiseAmplitude.toFixed(3)} * n);
  p.x *= 1.0 - 0.22 * shape * p.y;   // leaf-like taper
  p.x += 0.14 * shape * p.y;         // skew

  // Slow spin about Y plus a fixed tilt and a little pointer parallax.
  float a = uTime * ${C.rotationSpeed.toFixed(3)} + uParallax.x;
  float ca = cos(a), sa = sin(a);
  p = vec3(ca * p.x + sa * p.z, p.y, -sa * p.x + ca * p.z);
  float tl = ${C.tilt.toFixed(3)} + uParallax.y;
  float ct = cos(tl), st = sin(tl);
  p = vec3(p.x, ct * p.y - st * p.z, st * p.y + ct * p.z);

  float facing = normalize(p).z;            // -1 back .. 1 front
  float rim = 1.0 - abs(facing);            // 1 at the silhouette

  float persp = 1.0 / (1.0 - p.z * 0.12);
  vec2 px = vec2(uCenter.x + p.x * uRadius * persp, uCenter.y - p.y * uRadius * persp);
  gl_Position = vec4(px.x / uView.x * 2.0 - 1.0, 1.0 - px.y / uView.y * 2.0, 0.0, 1.0);

  float size = mix(${C.pointMin.toFixed(2)}, ${C.pointMax.toFixed(2)}, aRnd.x * aRnd.x) * (0.75 + 0.55 * rim);
  gl_PointSize = size * uDpr;

  // Rim is denser, brighter and more orange; the middle is sparse and dark.
  float orangeP = ${C.orangeShare.toFixed(2)} + 0.25 * rim;
  vec3 orange = vec3(1.0, 0.372, 0.0);   // #ff5f00
  vec3 cream  = vec3(0.910, 0.863, 0.784); // #e8dcc8
  vec3 col = mix(cream, orange, step(aRnd.y, orangeP)) * (0.7 + 0.5 * aRnd.z);
  float alpha = (0.35 + 0.65 * aRnd.w) * (0.18 + 0.82 * pow(rim, 1.2)) * mix(0.55, 1.0, facing * 0.5 + 0.5);
  vCol = vec4(col, alpha);
}
`;

const FRAG = `
precision mediump float;
varying vec4 vCol;
void main() {
  float d = length(gl_PointCoord - 0.5) * 2.0;
  float a = 1.0 - smoothstep(0.5, 1.0, d);
  float alpha = vCol.a * a;
  gl_FragColor = vec4(vCol.rgb * alpha, alpha); // premultiplied
}
`;

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const s = gl.createShader(type);
  if (!s) return null;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    console.warn("ParticleBackground shader error:", gl.getShaderInfoLog(s));
    gl.deleteShader(s);
    return null;
  }
  return s;
}

/** Latitude/longitude lattice: visible rings and columns, jittered size and colour only. */
function buildLattice() {
  const total = C.latRings * C.pointsPerRing;
  const dir = new Float32Array(total * 3);
  const rnd = new Float32Array(total * 4);
  let k = 0;
  for (let i = 0; i < C.latRings; i++) {
    const theta = ((i + 0.5) / C.latRings) * Math.PI;
    const y = Math.cos(theta);
    const ring = Math.sin(theta);
    for (let j = 0; j < C.pointsPerRing; j++) {
      const phi = (j / C.pointsPerRing) * Math.PI * 2;
      dir[k * 3] = ring * Math.cos(phi);
      dir[k * 3 + 1] = y;
      dir[k * 3 + 2] = ring * Math.sin(phi);
      rnd[k * 4] = Math.random();
      rnd[k * 4 + 1] = Math.random();
      rnd[k * 4 + 2] = Math.random();
      rnd[k * 4 + 3] = Math.random();
      k++;
    }
  }
  return { dir, rnd, total };
}

export function ParticleBackground() {
  const mainRef = useRef<HTMLCanvasElement>(null);
  const glowRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = mainRef.current;
    const glow = glowRef.current;
    if (!canvas || !glow) return;
    const gl = canvas.getContext("webgl", { alpha: true, antialias: false, premultipliedAlpha: true });
    const glowCtx = glow.getContext("2d");
    if (!gl || !glowCtx) return;

    const vs = compile(gl, gl.VERTEX_SHADER, VERT);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    const prog = gl.createProgram();
    if (!vs || !fs || !prog) return;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.warn("ParticleBackground link error:", gl.getProgramInfoLog(prog));
      return;
    }
    gl.useProgram(prog);

    const { dir, rnd, total } = buildLattice();
    const dirBuf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, dirBuf);
    gl.bufferData(gl.ARRAY_BUFFER, dir, gl.STATIC_DRAW);
    const aDir = gl.getAttribLocation(prog, "aDir");
    gl.enableVertexAttribArray(aDir);
    gl.vertexAttribPointer(aDir, 3, gl.FLOAT, false, 0, 0);

    const rndBuf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, rndBuf);
    gl.bufferData(gl.ARRAY_BUFFER, rnd, gl.STATIC_DRAW);
    const aRnd = gl.getAttribLocation(prog, "aRnd");
    gl.enableVertexAttribArray(aRnd);
    gl.vertexAttribPointer(aRnd, 4, gl.FLOAT, false, 0, 0);

    const u = (n: string) => gl.getUniformLocation(prog, n);
    const uTime = u("uTime");
    const uRadius = u("uRadius");
    const uView = u("uView");
    const uCenter = u("uCenter");
    const uParallax = u("uParallax");
    const uDpr = u("uDpr");

    gl.disable(gl.DEPTH_TEST);
    gl.depthMask(false);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.clearColor(0, 0, 0, 0);

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    let cssW = 1;
    let cssH = 1;
    let dpr = 1;
    let raf = 0;
    const pointer = { x: 0, y: 0 }; // target, -0.5..0.5
    const par = { x: 0, y: 0 };
    const t0 = performance.now();

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, C.maxDpr);
      cssW = Math.max(1, canvas.clientWidth);
      cssH = Math.max(1, canvas.clientHeight);
      canvas.width = Math.round(cssW * dpr);
      canvas.height = Math.round(cssH * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
      glow.width = Math.ceil(cssW / C.glowDivisor);
      glow.height = Math.ceil(cssH / C.glowDivisor);
    };

    const render = (now: number) => {
      const time = reduce.matches ? 8 : (now - t0) / 1000;
      par.x += (pointer.x * C.parallax - par.x) * 0.05;
      par.y += (pointer.y * C.parallax - par.y) * 0.05;
      const diameter = Math.max(C.minDiameter, cssW * C.sizeVw);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform1f(uTime, time);
      gl.uniform1f(uRadius, diameter / 2);
      gl.uniform2f(uView, cssW, cssH);
      gl.uniform2f(uCenter, cssW * C.centerX, cssH * C.centerY);
      gl.uniform2f(uParallax, par.x, par.y);
      gl.uniform1f(uDpr, dpr);
      gl.drawArrays(gl.POINTS, 0, total);
      // Cheap bloom: the tiny glow canvas is scaled up and blurred by CSS.
      glowCtx.clearRect(0, 0, glow.width, glow.height);
      glowCtx.drawImage(canvas, 0, 0, glow.width, glow.height);
    };

    const loop = (now: number) => {
      render(now);
      raf = requestAnimationFrame(loop);
    };
    const start = () => {
      if (!raf && !reduce.matches && !document.hidden) raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };

    const onVisibility = () => (document.hidden ? stop() : start());
    const onMove = (e: PointerEvent) => {
      pointer.x = e.clientX / window.innerWidth - 0.5;
      pointer.y = e.clientY / window.innerHeight - 0.5;
    };

    resize();
    const ro = new ResizeObserver(() => {
      resize();
      if (!raf) render(performance.now());
    });
    ro.observe(canvas);

    if (reduce.matches) {
      render(performance.now()); // single static frame
    } else {
      document.addEventListener("visibilitychange", onVisibility);
      window.addEventListener("pointermove", onMove, { passive: true });
      start();
    }

    return () => {
      stop();
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pointermove", onMove);
      gl.deleteBuffer(dirBuf);
      gl.deleteBuffer(rndBuf);
      gl.deleteProgram(prog);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    };
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-x-0 top-0 -z-[1] h-lvh">
      <canvas ref={mainRef} className="absolute inset-0 block size-full" />
      <canvas
        ref={glowRef}
        className="absolute inset-0 block size-full opacity-95 mix-blend-screen blur-[14px] saturate-[1.2]"
      />
    </div>
  );
}
