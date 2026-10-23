import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

type RGB = [number, number, number];

interface ScrollBlob {
  colorTop: RGB;
  colorEnd: RGB;
  alphaTop: number;
  alphaEnd: number;
  /** Radius as a fraction of the largest viewport dimension. */
  radius: number;
  phaseX: number;
  phaseY: number;
  speed: number;
  /** How far the blob travels vertically across the page, in viewport heights. */
  driftY: number;
}

/* Blue family at the top (echoes the hero aurora), indigo/violet depth at
   the bottom of the page — the palette morphs with overall scroll progress. */
const BLOBS: ScrollBlob[] = [
  { colorTop: [61, 139, 255], colorEnd: [88, 86, 214], alphaTop: 0.2, alphaEnd: 0.24, radius: 0.55, phaseX: 0.0, phaseY: 1.3, speed: 0.09, driftY: -0.32 },
  { colorTop: [56, 225, 255], colorEnd: [34, 211, 238], alphaTop: 0.11, alphaEnd: 0.14, radius: 0.4, phaseX: 2.1, phaseY: 4.0, speed: 0.06, driftY: 0.26 },
  { colorTop: [20, 40, 105], colorEnd: [44, 36, 110], alphaTop: 0.34, alphaEnd: 0.4, radius: 0.85, phaseX: 4.4, phaseY: 2.6, speed: 0.045, driftY: -0.18 },
  { colorTop: [30, 80, 200], colorEnd: [124, 58, 237], alphaTop: 0.11, alphaEnd: 0.16, radius: 0.5, phaseX: 5.6, phaseY: 0.7, speed: 0.075, driftY: 0.38 },
];

const MOTE_COUNT = 46;

interface Mote {
  x: number;
  y: number;
  r: number;
  speed: number;
  wobble: number;
}

/* Deterministic PRNG so the mote field is identical on every mount. */
function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/**
 * Global scroll-reactive atmosphere: a fixed aurora field that fades in past
 * the hero, morphs palette and drifts with page progress, plus slow dust
 * motes that streak briefly when the user scrolls fast. Canvas 2D only.
 * Renders a static frame under prefers-reduced-motion.
 */
export function ScrollBackdrop() {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let w = 0;
    let h = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const scroll = { y: window.scrollY, target: window.scrollY, boost: 0 };

    const rand = mulberry32(20261024);
    const motes: Mote[] = Array.from({ length: MOTE_COUNT }, () => ({
      x: rand(),
      y: rand(),
      r: 0.6 + rand() * 1.1,
      speed: 3 + rand() * 7,
      wobble: rand() * Math.PI * 2,
    }));

    const resize = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.max(1, Math.round(w * dpr));
      canvas.height = Math.max(1, Math.round(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);

    const pageProgress = () => {
      const doc = document.documentElement.scrollHeight - window.innerHeight;
      return doc > 0 ? clamp01(scroll.y / doc) : 0;
    };

    /* Fades in across the first stretch of scroll so the hero keeps its own
       backdrop; fully present from ~90% of one viewport onward. */
    const fade = () => clamp01((scroll.y - window.innerHeight * 0.3) / (window.innerHeight * 0.6));

    const draw = (t: number) => {
      const p = pageProgress();
      wrap.style.opacity = fade().toFixed(3);
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";

      for (const blob of BLOBS) {
        const cr = Math.round(lerp(blob.colorTop[0], blob.colorEnd[0], p));
        const cg = Math.round(lerp(blob.colorTop[1], blob.colorEnd[1], p));
        const cb = Math.round(lerp(blob.colorTop[2], blob.colorEnd[2], p));
        const alpha = lerp(blob.alphaTop, blob.alphaEnd, p);
        const cx =
          w * (0.5 + 0.3 * Math.sin(t * blob.speed + blob.phaseX) + 0.06 * Math.sin(p * Math.PI * 2 + blob.phaseX));
        const cy =
          h * (0.5 + 0.24 * Math.cos(t * blob.speed * 0.9 + blob.phaseY)) + (p - 0.5) * h * blob.driftY;
        const r = Math.max(w, h) * blob.radius;
        const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
        gradient.addColorStop(0, `rgba(${cr}, ${cg}, ${cb}, ${alpha})`);
        gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, w, h);
      }

      for (const mote of motes) {
        const mx = mote.x * w + Math.sin(t * 0.5 + mote.wobble) * 8;
        ctx.beginPath();
        ctx.arc(mx, mote.y * h, mote.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(190, 225, 255, 0.2)";
        ctx.fill();
      }

      ctx.globalCompositeOperation = "source-over";
    };

    const onScroll = () => {
      const dy = window.scrollY - scroll.target;
      scroll.target = window.scrollY;
      scroll.boost = Math.min(Math.abs(dy) * 0.15, 6);
      if (reducedMotion) {
        scroll.y = scroll.target;
        draw(0);
      }
    };

    if (reducedMotion) {
      draw(0);
      window.addEventListener("scroll", onScroll, { passive: true });
    } else {
      const loop = (now: number) => {
        raf = requestAnimationFrame(loop);
        scroll.y += (scroll.target - scroll.y) * 0.08;
        for (const mote of motes) {
          mote.y -= (mote.speed + scroll.boost * 30) / Math.max(h, 1) / 60;
          if (mote.y < -0.02) {
            mote.y = 1.02;
            mote.x = rand();
          }
        }
        scroll.boost *= 0.92;
        draw(now / 1000);
      };
      window.addEventListener("scroll", onScroll, { passive: true });
      raf = requestAnimationFrame(loop);
    }

    return () => {
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, [reducedMotion]);

  return (
    <div
      ref={wrapRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10"
      style={{ opacity: 0 }}
    >
      <canvas ref={canvasRef} className="h-full w-full" />
      {/* vignette + grain, same recipe as the hero */}
      <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_45%,transparent_60%,hsl(var(--background))_100%)]" />
      <div className="hero-grain absolute inset-0 opacity-[0.04]" />
    </div>
  );
}
