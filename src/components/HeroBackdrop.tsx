import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface Blob {
  color: [number, number, number];
  alpha: number;
  /** Radius as a fraction of the largest viewport dimension. */
  radius: number;
  phaseX: number;
  phaseY: number;
  speed: number;
  /** Pointer parallax strength in px (sign sets direction). */
  parallax: number;
}

/* Deep-blue aurora: three soft light fields drifting out of phase. */
const BLOBS: Blob[] = [
  { color: [61, 139, 255], alpha: 0.17, radius: 0.62, phaseX: 0.0, phaseY: 1.3, speed: 0.11, parallax: 26 },
  { color: [56, 225, 255], alpha: 0.1, radius: 0.46, phaseX: 2.1, phaseY: 4.0, speed: 0.07, parallax: -34 },
  { color: [24, 48, 120], alpha: 0.3, radius: 0.78, phaseX: 4.4, phaseY: 2.6, speed: 0.05, parallax: 14 },
];

/**
 * Animated hero atmosphere: slow aurora blobs on a 2D canvas (no WebGL
 * needed), vignette and film grain on top. Renders one static frame under
 * prefers-reduced-motion; pauses off-screen.
 */
export function HeroBackdrop() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let visible = true;
    let w = 0;
    let h = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const pointer = { x: 0, y: 0, tx: 0, ty: 0 };

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

    const draw = (t: number) => {
      pointer.x += (pointer.tx - pointer.x) * 0.04;
      pointer.y += (pointer.ty - pointer.y) * 0.04;
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";
      for (const blob of BLOBS) {
        const cx = w * (0.5 + 0.28 * Math.sin(t * blob.speed + blob.phaseX)) + pointer.x * blob.parallax;
        const cy = h * (0.46 + 0.24 * Math.cos(t * blob.speed * 0.9 + blob.phaseY)) + pointer.y * blob.parallax;
        const r = Math.max(w, h) * blob.radius;
        const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
        const [cr, cg, cb] = blob.color;
        gradient.addColorStop(0, `rgba(${cr}, ${cg}, ${cb}, ${blob.alpha})`);
        gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, w, h);
      }
      ctx.globalCompositeOperation = "source-over";
    };

    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      if (visible) draw(now / 1000);
    };

    const visibilityObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    visibilityObserver.observe(canvas);

    const onPointer = (e: PointerEvent) => {
      pointer.tx = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.ty = (e.clientY / window.innerHeight) * 2 - 1;
    };

    if (reducedMotion) {
      draw(0);
    } else {
      window.addEventListener("pointermove", onPointer, { passive: true });
      raf = requestAnimationFrame(loop);
    }

    return () => {
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      window.removeEventListener("pointermove", onPointer);
    };
  }, [reducedMotion]);

  return (
    <div aria-hidden="true" className="absolute inset-0 z-0">
      <canvas ref={canvasRef} className="h-full w-full" />
      {/* vignette keeps edges dark and cinematic */}
      <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_40%,transparent_52%,hsl(var(--background))_100%)]" />
      <div className="hero-grain absolute inset-0 opacity-[0.05]" />
    </div>
  );
}
