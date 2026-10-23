import { useEffect, useState } from "react";

interface LetterRevealProps {
  text: string;
  /** Base delay in ms before the first letter starts. */
  delay?: number;
  /** Per-letter stagger in ms. */
  stagger?: number;
  className?: string;
}

/**
 * Per-letter staggered reveal. Letters are real text (screen readers get the
 * untouched string via aria-label on the wrapper; decorative spans are hidden).
 */
export function LetterReveal({
  text,
  delay = 0,
  stagger = 28,
  className,
}: LetterRevealProps) {
  const [on, setOn] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setOn(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <span
      className={`letter-reveal${on ? " is-on" : ""}${className ? ` ${className}` : ""}`}
      aria-label={text}
      role="text"
    >
      {text.split("").map((char, i) => (
        <span
          key={`${char}-${i}`}
          aria-hidden="true"
          className="lr-letter"
          style={{ "--lr-delay": `${delay + i * stagger}ms` } as React.CSSProperties}
        >
          {char === " " ? " " : char}
        </span>
      ))}
    </span>
  );
}
