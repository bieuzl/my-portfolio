/**
 * Raw WebGL2 atmosphere renderer — no Three.js, so it stays out of the main
 * bundle (Atmosphere.tsx imports this file directly, never via scene3d/index,
 * which pulls in three for the sculpture chunk).
 *
 * The fragment shader paints a domain-warped fbm smoke field ("liquid
 * northern lights"), advected by page scroll so rolling down travels through
 * the fog, with two parallax star layers, a palette that morphs from blue to
 * indigo/violet as progress advances, and a soft lens around the cursor.
 */

export interface AtmosphereHandle {
  /** Normalized pointer, -1..1 on both axes (y up). */
  setPointer(x: number, y: number): void;
  /** Page scroll progress 0..1 plus a transient gust (in viewport heights)
      that pushes the fog and settles with inertia. */
  setScroll(progress: number, gust: number): void;
  setReducedMotion(reduced: boolean): void;
  dispose(): void;
}

const VERTEX_SRC = `#version 300 es
void main() {
  vec2 v = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2));
  gl_Position = vec4(v * 2.0 - 1.0, 0.0, 1.0);
}
`;

const FRAGMENT_SRC = `#version 300 es
precision highp float;
out vec4 outColor;

uniform vec2 uRes;
uniform float uTime;
uniform float uProgress;
uniform vec2 uPointer;
uniform float uGust;

float hash21(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float a = hash21(i);
  float b = hash21(i + vec2(1.0, 0.0));
  float c = hash21(i + vec2(0.0, 1.0));
  float d = hash21(i + vec2(1.0, 1.0));
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

float fbm(vec2 p) {
  float v = 0.0;
  float amp = 0.55;
  mat2 rot = mat2(0.8, 0.6, -0.6, 0.8);
  for (int i = 0; i < 5; i++) {
    v += amp * noise(p);
    p = rot * p * 2.03 + vec2(3.1, 1.7);
    amp *= 0.5;
  }
  return v;
}

/* Sparse twinkling stars on a hash grid; parallax drifts the layer with scroll. */
vec3 starLayer(vec2 uv, float scale, float parallax, float t) {
  vec2 st = uv * scale + vec2(0.0, parallax * uProgress * 4.0);
  vec2 id = floor(st);
  vec2 gv = fract(st) - 0.5;
  float h = hash21(id);
  if (h < 0.93) return vec3(0.0);
  float tw = 0.5 + 0.5 * sin(t * (1.0 + hash21(id + 7.0) * 3.0) + h * 40.0);
  vec2 off = (vec2(hash21(id + 1.0), hash21(id + 2.0)) - 0.5) * 0.55;
  float d = length(gv - off);
  float star = smoothstep(0.09, 0.0, d) * (0.35 + 0.65 * tw);
  return vec3(0.72, 0.85, 1.0) * star * 0.85;
}

void main() {
  vec2 uv = gl_FragCoord.xy / uRes;
  vec2 p = (gl_FragCoord.xy - 0.5 * uRes) / uRes.y;
  float t = uTime * 0.05;

  /* scrolling advects the whole field: rolling down travels through the
     fog, and a fast flick adds a gust that settles back with inertia */
  vec2 advect = vec2(sin(uProgress * 2.2) * 0.18, uProgress * 1.5 + uGust * 0.5);
  vec2 sp = p * 1.25 + advect;

  /* the cursor gently bends the field around itself — displacement
     proportional to dp keeps it smooth at the center (no pinch) */
  vec2 ptr = uPointer * vec2(0.5 * uRes.x / uRes.y, 0.5);
  vec2 dp = p - ptr;
  sp -= dp * 0.08 * exp(-dot(dp, dp) * 3.0);

  /* domain-warped fbm blended toward billow — smokier, softer filaments */
  vec2 q = vec2(fbm(sp + vec2(0.0, t)), fbm(sp + vec2(5.2, t * 1.15)));
  vec2 r = vec2(
    fbm(sp + 2.2 * q + vec2(1.7, 9.2) + 0.5 * t),
    fbm(sp + 2.2 * q + vec2(8.3, 2.8) - 0.35 * t)
  );
  float f = fbm(sp + 2.4 * r);
  float billow = 1.0 - abs(2.0 * f - 1.0);
  float smoke = mix(f, billow, 0.45);
  smoke = smoke * smoke * (3.0 - 2.0 * smoke);

  /* palette morphs with page progress: blue -> indigo/violet */
  vec3 deep = mix(vec3(0.028, 0.045, 0.125), vec3(0.052, 0.038, 0.145), uProgress);
  vec3 blue = mix(vec3(0.240, 0.545, 1.000), vec3(0.410, 0.380, 0.960), uProgress);
  vec3 cyan = mix(vec3(0.220, 0.885, 1.000), vec3(0.560, 0.450, 1.000), uProgress);

  vec3 col = deep * (0.28 + 0.85 * smoke);
  float wisp = smoothstep(0.40, 0.82, smoke);
  col += blue * wisp * (0.28 + 0.32 * q.y) * 0.8;
  col += cyan * smoothstep(0.55, 0.95, fbm(sp * 1.7 - 1.8 * r + vec2(0.0, t * 0.6))) * 0.26;

  col += starLayer(uv, 55.0, 0.4, uTime);
  col += starLayer(uv, 105.0, 1.0, uTime * 1.3);

  /* cinematic vignette + master dim keep type comfortable over the smoke */
  float vig = 1.0 - 0.48 * length((uv - vec2(0.5, 0.45)) * vec2(1.05, 1.0));
  col *= vig * 0.85;

  /* soft tonemap keeps highlights silky instead of clipped */
  col = 1.0 - exp(-col * 1.35);
  outColor = vec4(col, 1.0);
}
`;

/* Render below native resolution: gradients upscale cleanly and stars stay
   soft, while fill-rate cost drops by ~3x. */
const RESOLUTION_SCALE = 0.6;

function compile(gl: WebGL2RenderingContext, type: number, src: string): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, src);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

/** Returns null when WebGL2 (or shader compilation) is unavailable. */
export function mountAtmosphere(canvas: HTMLCanvasElement): AtmosphereHandle | null {
  const gl = canvas.getContext("webgl2", { alpha: false, antialias: false, depth: false, stencil: false });
  if (!gl) return null;

  const vs = compile(gl, gl.VERTEX_SHADER, VERTEX_SRC);
  const fs = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT_SRC);
  if (!vs || !fs) return null;
  const program = gl.createProgram();
  if (!program) return null;
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return null;
  gl.useProgram(program);

  const uRes = gl.getUniformLocation(program, "uRes");
  const uTime = gl.getUniformLocation(program, "uTime");
  const uProgress = gl.getUniformLocation(program, "uProgress");
  const uPointer = gl.getUniformLocation(program, "uPointer");
  const uGust = gl.getUniformLocation(program, "uGust");

  const state = {
    raf: 0,
    reduced: false,
    time: 0,
    lastNow: 0,
    progress: 0,
    targetProgress: 0,
    gust: 0,
    pointer: { x: 0, y: 0, tx: 0, ty: 0 },
    disposed: false,
  };

  const resize = () => {
    const scale = Math.min(window.devicePixelRatio || 1, 1.5) * RESOLUTION_SCALE;
    const w = Math.max(1, Math.round(canvas.clientWidth * scale));
    const h = Math.max(1, Math.round(canvas.clientHeight * scale));
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
    }
  };
  resize();
  const resizeObserver = new ResizeObserver(() => {
    resize();
    if (state.reduced) renderFrame();
  });
  resizeObserver.observe(canvas);

  function renderFrame() {
    gl!.uniform2f(uRes, canvas.width, canvas.height);
    gl!.uniform1f(uTime, state.time);
    gl!.uniform1f(uProgress, state.progress);
    gl!.uniform2f(uPointer, state.pointer.x, state.pointer.y);
    gl!.uniform1f(uGust, state.gust);
    gl!.drawArrays(gl!.TRIANGLES, 0, 3);
  }

  const loop = (now: number) => {
    if (state.disposed) return;
    state.raf = requestAnimationFrame(loop);
    const dt = Math.min((now - state.lastNow) / 1000, 0.1);
    state.lastNow = now;
    state.time += dt;
    state.progress += (state.targetProgress - state.progress) * 0.05;
    state.gust *= 0.93;
    state.pointer.x += (state.pointer.tx - state.pointer.x) * 0.06;
    state.pointer.y += (state.pointer.ty - state.pointer.y) * 0.06;
    renderFrame();
  };

  const start = () => {
    cancelAnimationFrame(state.raf);
    if (state.reduced) {
      state.progress = state.targetProgress;
      renderFrame();
    } else {
      state.lastNow = performance.now();
      state.raf = requestAnimationFrame(loop);
    }
  };
  start();

  return {
    setPointer(x, y) {
      state.pointer.tx = x;
      state.pointer.ty = y;
    },
    setScroll(progress, gust) {
      state.targetProgress = Math.min(1, Math.max(0, progress));
      state.gust = Math.min(1, state.gust + gust);
      if (state.reduced) {
        state.progress = state.targetProgress;
        state.gust = 0;
        renderFrame();
      }
    },
    setReducedMotion(reduced) {
      if (state.reduced === reduced) return;
      state.reduced = reduced;
      start();
    },
    dispose() {
      state.disposed = true;
      cancelAnimationFrame(state.raf);
      resizeObserver.disconnect();
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    },
  };
}
