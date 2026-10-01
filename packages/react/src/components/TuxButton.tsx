/**
 * TuxButton — TTI-flavored button component.
 * React port of app/components/TuxButton.vue.
 *
 * Implements the semantic `intent` prop:
 *   - primary     · brand maroon fill (#500000)
 *   - secondary   · neutral outline
 *   - ghost       · transparent chrome-like
 *   - destructive · error outline filling solid red on hover
 *
 * Implements the `shape` prop:
 *   - sharp / square · 0px border radius (Kadence brand alignment)
 *   - pill           · fully rounded pill
 *   - default        · standard token border radius
 */

import React, { forwardRef, type ButtonHTMLAttributes, type AnchorHTMLAttributes, type ReactNode } from "react";
import "./tux-button.css";

export type TuxButtonIntent = "primary" | "secondary" | "ghost" | "destructive";
export type TuxButtonShape = "default" | "sharp" | "square" | "pill";
export type TuxButtonSize = "xs" | "sm" | "md" | "lg" | "xl";

export interface TuxButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "color"> {
  /** Semantic role of the button */
  intent?: TuxButtonIntent;
  /** Shape geometry */
  shape?: TuxButtonShape;
  /** Sizing tier */
  size?: TuxButtonSize;
  /** Leading icon or element */
  icon?: ReactNode;
  /** Trailing icon or element */
  trailingIcon?: ReactNode;
  /** Optional link navigation URL; renders as an anchor <a> when supplied */
  to?: string;
  href?: string;
  /** Loading state indicator */
  loading?: boolean;
}

export const TuxButton = forwardRef<HTMLButtonElement | HTMLAnchorElement, TuxButtonProps>(
  function TuxButton(
    {
      intent = "primary",
      shape = "default",
      size = "md",
      icon,
      trailingIcon,
      to,
      href,
      loading = false,
      disabled = false,
      className = "",
      children,
      ...restProps
    },
    ref,
  ) {
    const targetUrl = to || href;
    const isAnchor = Boolean(targetUrl);

    const classes = [
      "tux-button",
      `tux-button--${intent}`,
      `tux-button--${shape}`,
      `tux-button--${size}`,
      disabled || loading ? "tux-button--disabled" : "",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    const content = (
      <>
        {loading && (
          <span className="tux-button__icon tux-button__spinner" aria-hidden="true">
            <svg
              className="animate-spin"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="12" y1="2" x2="12" y2="6" />
              <line x1="12" y1="18" x2="12" y2="22" />
              <line x1="4.93" y1="4.93" x2="7.76" y2="7.76" />
              <line x1="16.24" y1="16.24" x2="19.07" y2="19.07" />
              <line x1="2" y1="12" x2="6" y2="12" />
              <line x1="18" y1="12" x2="22" y2="12" />
              <line x1="4.93" y1="19.07" x2="7.76" y2="16.24" />
              <line x1="16.24" y1="7.76" x2="19.07" y2="4.93" />
            </svg>
          </span>
        )}
        {!loading && icon && <span className="tux-button__icon">{icon}</span>}
        {children && <span className="tux-button__label">{children}</span>}
        {trailingIcon && <span className="tux-button__icon tux-button__trailing-icon">{trailingIcon}</span>}
      </>
    );

    if (isAnchor) {
      return (
        <a
          ref={ref as React.Ref<HTMLAnchorElement>}
          href={targetUrl}
          className={classes}
          aria-disabled={disabled || loading ? "true" : undefined}
          {...(restProps as AnchorHTMLAttributes<HTMLAnchorElement>)}
        >
          {content}
        </a>
      );
    }

    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        type={restProps.type || "button"}
        disabled={disabled || loading}
        className={classes}
        {...restProps}
      >
        {content}
      </button>
    );
  },
);
