/**
 * TuxFactoid — institutional "by the numbers" block.
 * React port of app/components/TuxFactoid.vue.
 */

import React, { forwardRef, type HTMLAttributes } from "react";
import "./tux-factoid.css";

export interface TuxFactoidItem {
  value: string | number;
  suffix?: string | null;
  label: string;
  source?: string | null;
}

export type TuxFactoidVariant = "default" | "bold" | "elegant";

export interface TuxFactoidProps extends HTMLAttributes<HTMLElement> {
  items: TuxFactoidItem[];
  /** Numeral face. Defaults to 'default' (Open Sans heavy). */
  variant?: TuxFactoidVariant;
  /** Number of columns / sizing tier: 3 | 4 | 5. */
  columns?: 3 | 4 | 5;
  /** Eyebrow text shown above the title. Optional. */
  eyebrow?: string;
  /** Block heading. Optional. */
  title?: string;
  /** 1–2 sentence dek under the heading. Optional. */
  dek?: string;
}

const sizes = {
  3: { num: "6rem", suf: "2.25rem", lab: "0.9375rem", gap: "2.5rem", min: "16rem" },
  4: { num: "4.5rem", suf: "1.75rem", lab: "0.875rem", gap: "1.75rem", min: "12rem" },
  5: { num: "3.5rem", suf: "1.375rem", lab: "0.8125rem", gap: "1.5rem", min: "9.5rem" },
} as const;

export const TuxFactoid = forwardRef<HTMLElement, TuxFactoidProps>(
  function TuxFactoid(
    {
      items,
      variant = "default",
      columns = 3,
      eyebrow,
      title,
      dek,
      className = "",
      ...restProps
    },
    ref,
  ) {
    const sized = sizes[columns] ?? sizes[3];

    const numeralStyle: React.CSSProperties = (() => {
      if (variant === "bold") {
        return {
          fontFamily: "var(--font-bold)",
          fontWeight: 800,
          fontStyle: "italic",
          letterSpacing: "-0.015em",
        };
      }
      if (variant === "elegant") {
        return {
          fontFamily: "var(--font-elegant)",
          fontWeight: 400,
          fontStyle: "italic",
          letterSpacing: "-0.025em",
        };
      }
      return {
        fontFamily: "var(--font-body)",
        fontWeight: 700,
        fontStyle: "normal",
        letterSpacing: "-0.01em",
      };
    })();

    const headingClass = (() => {
      if (variant === "bold") return "heading--bold";
      if (variant === "elegant") return "heading--elegant heading--elegant--italic";
      return "heading--display";
    })();

    const visibleItems = items.slice(0, columns);

    const classes = [
      "tux-factoid",
      `tux-factoid--${variant}`,
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <section ref={ref} className={classes} {...restProps}>
        {(eyebrow || title || dek) && (
          <header className="tux-factoid__header">
            {eyebrow && <p className="eyebrow tux-factoid__eyebrow">{eyebrow}</p>}
            {title && (
              <h2 className={`tux-factoid__title ${headingClass}`.trim()}>
                {title}
              </h2>
            )}
            {dek && <p className="tux-factoid__dek">{dek}</p>}
          </header>
        )}

        <div
          className="tux-factoid__grid"
          style={{
            gridTemplateColumns: `repeat(auto-fit, minmax(${sized.min}, 1fr))`,
            gap: sized.gap,
          }}
        >
          {visibleItems.map((item, idx) => (
            <article key={idx} className="tux-factoid__cell">
              <span
                className="tux-factoid__value"
                style={{ ...numeralStyle, fontSize: sized.num }}
              >
                {item.value}
                {item.suffix && (
                  <span
                    className="tux-factoid__suffix"
                    style={{ fontSize: sized.suf }}
                  >
                    {item.suffix}
                  </span>
                )}
              </span>
              <p
                className="tux-factoid__label"
                style={{ fontSize: sized.lab }}
              >
                {item.label}
              </p>
              {item.source && (
                <p className="tux-factoid__source">{item.source}</p>
              )}
            </article>
          ))}
        </div>
      </section>
    );
  },
);
