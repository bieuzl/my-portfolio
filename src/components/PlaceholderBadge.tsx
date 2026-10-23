import { useTranslation } from "react-i18next";

/**
 * Small mono tag marking sample content, so placeholders never read as fact.
 */
export function PlaceholderBadge() {
  const { t } = useTranslation();
  return (
    <span className="inline-flex items-center gap-1.5 border border-dashed border-primary/60 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-widest text-primary">
      {t("a11y.placeholderBadge")}
    </span>
  );
}
