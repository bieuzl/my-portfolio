import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { mountAtmosphere } from "@/scene3d/atmosphere";

type RGB = [number, number, number];

interface FallbackBlob {
  colorTop: RGB;
  colorEnd: RGB;
  alphaTop: number;
  alphaEnd: number;
  radius: number;
  phaseX: number;
  phaseY: number;
  speed: number;
  driftY: number;
}

/* 2D fallback palette, same arc as the shader: blue -> indigo/violet. */
const FALLBACK_BLOBS: FallbackBlob[] = [
  { colorTop: [61, 139, 255], colorEnd: [88, 86, 214], alphaTop: 0.2, alphaEnd: 0.24, radius: 0.55, phaseX: 0.0, phaseY: 1.3, speed: 0.09, driftY: -0.32 },
  { colorTop: [56, 225, 255], colorEnd: [34, 211, 238], alphaTop: 0.11, alphaEnd: 0.14, radius: 0.4, phaseX: 2.1, phaseY: 4.0, speed: 0.06, driftY: 0.26 },
  { colorTop: [20, 40, 105], colorEnd: [44, 36, 110], alphaTop: 0.34, alphaEnd: 0.4, radius: 0.85, phaseX: 4.4, phaseY: 2.6, speed: 0.045, driftY: -0.18 },
  { colorTop: [30, 80, 200], colorEnd: [124, 58, 237], alphaTop: 0.11, alphaEnd: 0.16, radius: 0.5, phaseX: 5.6, phaseY: 0.7, speed: 0.075, driftY: 0.38 },
];

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

const pageProgress = () => {
  const doc = document.documentElement.scrollHeight - window.innerHeight;
  return doc > 0 ? clamp01(window.scrollY / doc) : 0;
};

/* Canvas-2D aurora for browsers without WebGL2: same blobs the hero and the
   scroll backdrop used to paint, now unified and always present. */
function startFallback2D(canvas: HTMLCanvasElement, reducedMotion: boolean): () => void {
  const ctx = canvas.getContext("2d");
  if (!ctx) return () => {};

  let raf = 0;
  let w = 0;
  let h = 0;
  const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

  const resize = () => {
    w = canvas.clientWidth;
    h = canvas.clientHeight;
    canvas.width = Math.max(1, Math.round(w * dpr));
    canvas.height = Math.max(1, Math.round(h * dpr));
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  resize();
  const resizeObserver = new ResizeObserver(() => {
    resize();
    if (reducedMotion) draw(0);
  });
  resizeObserver.observe(canvas);

  const draw = (t: number) => {
    const p = pageProgress();
    ctx.clearRect(0, 0, w, h);
    ctx.globalCompositeOperation = "lighter";
    for (const blob of FALLBACK_BLOBS) {
      const cr = Math.round(lerp(blob.colorTop[0], blob.colorEnd[0], p));
      const cg = Math.round(lerp(blob.colorTop[1], blob.colorEnd[1], p));
      const cb = Math.round(lerp(blob.colorTop[2], blob.colorEnd[2], p));
      const alpha = lerp(blob.alphaTop, blob.alphaEnd, p);
      const cx = w * (0.5 + 0.3 * Math.sin(t * blob.speed + blob.phaseX) + 0.06 * Math.sin(p * Math.PI * 2 + blob.phaseX));
      const cy = h * (0.5 + 0.24 * Math.cos(t * blob.speed * 0.9 + blob.phaseY)) + (p - 0.5) * h * blob.driftY;
      const r = Math.max(w, h) * blob.radius;
      const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
      gradient.addColorStop(0, `rgba(${cr}, ${cg}, ${cb}, ${alpha})`);
      gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, w, h);
    }
    ctx.globalCompositeOperation = "source-over";
  };

  const onScroll = () => {
    if (reducedMotion) draw(0);
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  if (reducedMotion) {
    draw(0);
  } else {
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      draw(now / 1000);
    };
    raf = requestAnimationFrame(loop);
  }

  return () => {
    cancelAnimationFrame(raf);
    resizeObserver.disconnect();
    window.removeEventListener("scroll", onScroll);
  };
}

/**
 * The single atmosphere behind the whole page: a fixed WebGL aurora shader
 * (liquid northern lights + parallax stars) that morphs palette with scroll
 * and bends around the cursor. Falls back to a 2D canvas aurora without
 * WebGL2; renders a static frame under prefers-reduced-motion.
 */
export function Atmosphere() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const glHandle = mountAtmosphere(canvas);
    if (!glHandle) {
      return startFallback2D(canvas, reducedMotion);
    }

    glHandle.setReducedMotion(reducedMotion);
    glHandle.setScroll(pageProgress(), 0);

    let lastY = window.scrollY;
    const onScroll = () => {
      const dy = window.scrollY - lastY;
      lastY = window.scrollY;
      /* gust in viewport heights: a full-screen flick reads as ~0.5 */
      glHandle.setScroll(pageProgress(), Math.min(Math.abs(dy) / window.innerHeight, 0.5));
    };
    const onPointer = (e: PointerEvent) => {
      glHandle.setPointer(
        (e.clientX / window.innerWidth) * 2 - 1,
        -((e.clientY / window.innerHeight) * 2 - 1),
      );
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    if (!reducedMotion) window.addEventListener("pointermove", onPointer, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onPointer);
      glHandle.dispose();
    };
  }, [reducedMotion]);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10">
      <canvas ref={canvasRef} className="h-full w-full" />
      {/* film grain keeps the gradients from banding */}
      <div className="hero-grain absolute inset-0 opacity-[0.045]" />
    </div>
  );
}
