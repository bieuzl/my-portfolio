import type { ReactNode } from "react";
import { useMagnetic } from "@/hooks/useMagnetic";

interface MagneticProps {
  children: ReactNode;
  /** 0..1 — fraction of the cursor offset applied to the element. */
  strength?: number;
  className?: string;
}

/**
 * Inline wrapper that drifts toward the cursor on hover. Lives INSIDE the
 * animated element so its transform never fights entrance keyframes.
 */
export function Magnetic({ children, strength = 0.3, className = "" }: MagneticProps) {
  const ref = useMagnetic<HTMLSpanElement>(strength);
  return (
    <span
      ref={ref}
      className={`inline-block transition-transform duration-300 ease-[var(--ease-out-expo)] ${className}`}
    >
      {children}
    </span>
  );
}
