import { useInView } from "@/hooks/useInView";

interface SectionHeadingProps {
  id: string;
  index: string;
  title: string;
}

/**
 * Section header: mono index + display-serif title + animated red rule.
 */
export function SectionHeading({ id, index, title }: SectionHeadingProps) {
  const { ref, inView } = useInView<HTMLDivElement>();

  return (
    <div ref={ref} className="mb-12 md:mb-16">
      <div className="flex items-baseline gap-4">
        <span className="font-mono text-xs text-primary">{index}</span>
        <h2
          id={id}
          className={`rv font-display text-3xl font-light tracking-tight text-foreground md:text-5xl${inView ? " in-view" : ""}`}
        >
          {title}
        </h2>
      </div>
      <div className={`accent-line mt-6${inView ? " in-view" : ""}`} aria-hidden="true">
        <span />
      </div>
    </div>
  );
}
