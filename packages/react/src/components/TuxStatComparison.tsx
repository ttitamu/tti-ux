import React from "react";
import "./tux-stat-comparison.css";

export interface TuxStatComparisonProps {
  eyebrow?: string;
  current: number;
  previous: number;
  suffix?: string;
  label?: string;
  layout?: "row" | "stacked" | "inline";
  decimals?: number;
  polarity?: "direct" | "invert" | "neutral";
  deltaFormat?: "abs+pct" | "abs" | "pct";
  className?: string;
}

export const TuxStatComparison: React.FC<TuxStatComparisonProps> = ({
  eyebrow,
  current,
  previous,
  suffix,
  label,
  layout = "row",
  decimals = 1,
  polarity = "direct",
  deltaFormat = "abs+pct",
  className = "",
}) => {
  const delta = current - previous;
  const pct = previous === 0 ? null : (delta / Math.abs(previous)) * 100;

  const direction: "up" | "down" | "flat" =
    delta === 0 ? "flat" : delta > 0 ? "up" : "down";

  let tone: "success" | "error" | "neutral" = "neutral";
  if (polarity !== "neutral" && direction !== "flat") {
    const good = polarity === "direct" ? direction === "up" : direction === "down";
    tone = good ? "success" : "error";
  }

  const fmt = (n: number) =>
    n.toLocaleString(undefined, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });

  const ariaLabel = `${
    direction === "up" ? "Up" : direction === "down" ? "Down" : "Unchanged"
  } from ${fmt(previous)}${suffix ?? ""}`;

  return (
    <div
      className={`tux-stat-comparison tux-stat-comparison--${layout} tux-stat-comparison--${tone} ${className}`.trim()}
    >
      {eyebrow && <p className="tux-stat-comparison__eyebrow">{eyebrow}</p>}

      <div className="tux-stat-comparison__row">
        <span className="tux-stat-comparison__value">
          {fmt(current)}
          {suffix && <span className="tux-stat-comparison__suffix">{suffix}</span>}
        </span>

        <span className="tux-stat-comparison__delta" aria-label={ariaLabel}>
          {direction === "up" && (
            <svg
              className="tux-stat-comparison__arrow"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <line x1="7" y1="17" x2="17" y2="7" />
              <polyline points="7 7 17 7 17 17" />
            </svg>
          )}
          {direction === "down" && (
            <svg
              className="tux-stat-comparison__arrow"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <line x1="7" y1="7" x2="17" y2="17" />
              <polyline points="17 7 17 17 7 17" />
            </svg>
          )}
          {direction === "flat" && (
            <svg
              className="tux-stat-comparison__arrow"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          )}

          <span className="tux-stat-comparison__delta-num">
            {deltaFormat !== "pct" && (
              <>
                {delta > 0 ? "+" : ""}
                {fmt(delta)}
                {suffix && <span>{suffix}</span>}
              </>
            )}
            {deltaFormat === "abs+pct" && pct !== null && (
              <span className="tux-stat-comparison__delta-pct">
                ({pct > 0 ? "+" : ""}
                {pct.toFixed(1)}%)
              </span>
            )}
            {deltaFormat === "pct" && pct !== null && (
              <>
                {pct > 0 ? "+" : ""}
                {pct.toFixed(1)}%
              </>
            )}
          </span>
        </span>
      </div>

      {label && <p className="tux-stat-comparison__label">{label}</p>}
    </div>
  );
};
