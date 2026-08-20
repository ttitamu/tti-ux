/**
 * TuxBigStat — single oversized statistic. React port of
 * app/components/TuxBigStat.vue (the port ledger records the source
 * hash this was generated against — kit/ports/manifest.json).
 *
 * The institutional "headline metric" pattern: one big number, one
 * tracked label. Companion to TuxFactoid. Same props, same class
 * names, same token spellings as the Vue original — the CSS in
 * ./tux-big-stat.css is byte-equivalent to the SFC's style block, so
 * both frameworks render identically off kit/css/tux-tokens.css.
 */
import type { CSSProperties, ReactElement } from "react";
import "./tux-big-stat.css";

export interface TuxBigStatProps {
  value: string | number;
  /** Trailing unit. Renders smaller, in Work Sans, anchored to the baseline. */
  suffix?: string | null;
  /** Tracked-out label below the value. */
  label: string;
  /** Optional attribution / source line, italic 11px. */
  source?: string | null;
  /** Numeral face. Defaults to 'default' (Open Sans heavy). */
  variant?: "default" | "bold" | "elegant";
  /** Color of the numeral. Maroon is canonical; gold for emphasis;
   *  neutral for supporting metrics that shouldn't compete with brand stats. */
  tone?: "maroon" | "gold" | "neutral";
  /** Numeral size tier. `lg` = 144px (landing hero), `md` = 96px (dashboard
   *  hero), `sm` = 64px (in-card metric, sidebar widget). */
  size?: "lg" | "md" | "sm";
}

const SIZES = {
  lg: { num: "9rem", suf: "3rem", lab: "1rem" },
  md: { num: "6rem", suf: "2.25rem", lab: "0.9375rem" },
  sm: { num: "4rem", suf: "1.5rem", lab: "0.875rem" },
} as const;

const NUMERAL: Record<NonNullable<TuxBigStatProps["variant"]>, CSSProperties> = {
  bold: {
    fontFamily: "var(--font-bold)",
    fontWeight: 800,
    fontStyle: "italic",
    letterSpacing: "-0.015em",
  },
  elegant: {
    fontFamily: "var(--font-elegant)",
    fontWeight: 400,
    fontStyle: "italic",
    letterSpacing: "-0.025em",
  },
  default: {
    fontFamily: "var(--font-body)",
    fontWeight: 700,
    fontStyle: "normal",
    letterSpacing: "-0.01em",
  },
};

const TONE = {
  maroon: "var(--brand-primary)",
  gold: "var(--brand-accent)",
  neutral: "var(--text-primary)",
} as const;

export function TuxBigStat({
  value,
  suffix = null,
  label,
  source = null,
  variant = "default",
  tone = "maroon",
  size = "md",
}: TuxBigStatProps): ReactElement {
  const sized = SIZES[size];
  return (
    <div className="tux-big-stat">
      <span
        className="tux-big-stat__value"
        style={{ ...NUMERAL[variant], fontSize: sized.num, color: TONE[tone] }}
      >
        {value}
        {suffix != null && suffix !== "" && (
          <span className="tux-big-stat__suffix" style={{ fontSize: sized.suf }}>
            {suffix}
          </span>
        )}
      </span>
      <p className="tux-big-stat__label" style={{ fontSize: sized.lab }}>
        {label}
      </p>
      {source != null && source !== "" && (
        <p className="tux-big-stat__source">{source}</p>
      )}
    </div>
  );
}
