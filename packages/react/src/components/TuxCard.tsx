/**
 * TuxCard — TTI-flavored card component.
 * React port of app/components/TuxCard.vue.
 *
 * Implements `.card-static` and `.card-linked` chrome:
 *   - Static block by default
 *   - When `to` or `href` is provided, renders an anchor with corner hover-arrow
 *   - When `linked={true}`, renders the linked chrome on a <div> (for cards with internal links)
 */

import React, { forwardRef, type HTMLAttributes, type AnchorHTMLAttributes } from "react";
import "./tux-card.css";

export interface TuxCardProps extends HTMLAttributes<HTMLElement> {
  /** Navigation URL; renders as an anchor <a> when supplied */
  to?: string;
  href?: string;
  /** Whether the card includes standard padding (p-6 / 1.5rem). Default true. */
  padded?: boolean;
  /** Renders linked-card chrome without wrapping in an anchor. Default false. */
  linked?: boolean;
}

export const TuxCard = forwardRef<HTMLElement, TuxCardProps>(
  function TuxCard(
    {
      to,
      href,
      padded = true,
      linked = false,
      className = "",
      children,
      ...restProps
    },
    ref,
  ) {
    const targetUrl = to || href;
    const isAnchor = Boolean(targetUrl);
    const isLinkedChrome = isAnchor || linked;

    const baseClass = isLinkedChrome ? "card-linked" : "card-static";
    const paddingClass = padded ? "card-padded" : "";

    const classes = [baseClass, paddingClass, className].filter(Boolean).join(" ");

    const arrowIcon = (
      <span className="card-linked__arrow" aria-hidden="true">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="7" y1="17" x2="17" y2="7" />
          <polyline points="7 7 17 7 17 17" />
        </svg>
      </span>
    );

    if (isAnchor) {
      return (
        <a
          ref={ref as React.Ref<HTMLAnchorElement>}
          href={targetUrl}
          className={classes}
          {...(restProps as AnchorHTMLAttributes<HTMLAnchorElement>)}
        >
          {arrowIcon}
          {children}
        </a>
      );
    }

    return (
      <div
        ref={ref as React.Ref<HTMLDivElement>}
        className={classes}
        {...(restProps as HTMLAttributes<HTMLDivElement>)}
      >
        {linked && arrowIcon}
        {children}
      </div>
    );
  },
);
