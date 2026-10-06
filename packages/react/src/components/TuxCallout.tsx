/**
 * TuxCallout — pulled-aside editorial accent callout with brand left rule.
 * React port of app/components/TuxCallout.vue.
 */

import React, { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import "./tux-callout.css";

export type TuxCalloutKind = "fact" | "stat" | "quote";
export type TuxCalloutVariant = "default" | "bold" | "elegant";

export interface TuxCalloutProps extends HTMLAttributes<HTMLElement> {
  /** Eyebrow kind: fact ("Worth noting"), stat ("Key finding"), quote ("Voice"). */
  kind?: TuxCalloutKind;
  /** Custom eyebrow text (overrides kind default). */
  eyebrow?: string | null;
  /** Rule style variant. */
  variant?: TuxCalloutVariant;
  children?: ReactNode;
}

export const TuxCallout = forwardRef<HTMLElement, TuxCalloutProps>(
  function TuxCallout(
    {
      kind = "fact",
      eyebrow = null,
      variant = "default",
      className = "",
      children,
      ...restProps
    },
    ref,
  ) {
    const eyebrowLabel = (() => {
      if (eyebrow) return eyebrow;
      if (kind === "stat") return "Key finding";
      if (kind === "quote") return "Voice";
      return "Worth noting";
    })();

    const classes = [
      "tux-callout",
      `tux-callout--${variant}`,
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <aside ref={ref} role="note" className={classes} {...restProps}>
        <div className="tux-callout__rule" aria-hidden="true">
          {variant === "bold" && (
            <>
              <span className="tux-callout__bar tux-callout__bar--1" />
              <span className="tux-callout__bar tux-callout__bar--2" />
              <span className="tux-callout__bar tux-callout__bar--3" />
            </>
          )}
        </div>
        <div className="tux-callout__body">
          <p className="tux-callout__eyebrow">{eyebrowLabel}</p>
          <div className="tux-callout__content">
            {children}
          </div>
        </div>
      </aside>
    );
  },
);
