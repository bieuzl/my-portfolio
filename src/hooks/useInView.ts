import { useEffect, useRef, useState } from "react";

/**
 * Observes an element and reports when it enters the viewport (once).
 * Used to trigger scroll entrances without any animation library.
 */
export function useInView<T extends HTMLElement>(threshold = 0.2) {
  const ref = useRef<T | null>(null);
  /* Without IntersectionObserver, entrances are shown immediately. */
  const [inView, setInView] = useState(
    () => typeof IntersectionObserver !== "function",
  );

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver !== "function") return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, inView };
}
