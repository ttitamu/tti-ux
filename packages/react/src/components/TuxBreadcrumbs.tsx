/**
 * TuxBreadcrumbs — page-depth navigation trail.
 * React port of app/components/TuxBreadcrumbs.vue.
 */

import React, { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import "./tux-breadcrumbs.css";

export interface TuxCrumb {
  label: string;
  /** Where to navigate. Omit on the final crumb (current page). */
  to?: string;
  /** External href instead of a router to. */
  href?: string;
}

export interface TuxBreadcrumbsProps extends HTMLAttributes<HTMLElement> {
  trail: TuxCrumb[];
  /** Show the home icon on the first crumb. Default true. */
  homeIcon?: boolean;
  /** Use chevron separators at all sizes. */
  chevron?: boolean;
  /** Accessible name for the nav landmark. Default "Breadcrumb". */
  ariaLabel?: string;
}

export const TuxBreadcrumbs = forwardRef<HTMLElement, TuxBreadcrumbsProps>(
  function TuxBreadcrumbs(
    {
      trail,
      homeIcon = true,
      chevron = false,
      ariaLabel = "Breadcrumb",
      className = "",
      ...restProps
    },
    ref,
  ) {
    if (!trail || trail.length === 0) return null;

    const classes = [
      "tux-breadcrumbs",
      chevron ? "tux-breadcrumbs--chevron" : "",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <nav ref={ref} className={classes} aria-label={ariaLabel} {...restProps}>
        <ol className="tux-breadcrumbs__list">
          {trail.map((crumb, idx) => {
            const isFirst = idx === 0;
            const isLast = idx === trail.length - 1;
            const isIntermediate = !isFirst && !isLast;

            const itemClasses = [
              "tux-breadcrumbs__item",
              isFirst ? "tux-breadcrumbs__item--home" : "",
              isLast ? "tux-breadcrumbs__item--current" : "",
              isIntermediate ? "tux-breadcrumbs__item--intermediate" : "",
            ]
              .filter(Boolean)
              .join(" ");

            const targetUrl = crumb.href ?? crumb.to;

            return (
              <li key={idx} className={itemClasses}>
                {idx > 0 && (
                  <span className="tux-breadcrumbs__separator" aria-hidden="true">
                    {chevron ? "›" : ""}
                  </span>
                )}

                {isLast ? (
                  <span aria-current="page" className="tux-breadcrumbs__current">
                    {crumb.label}
                  </span>
                ) : isFirst ? (
                  <a
                    href={targetUrl ?? "/"}
                    className="tux-breadcrumbs__home"
                  >
                    {homeIcon && (
                      <svg
                        className="tux-breadcrumbs__home-icon"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                        <polyline points="9 22 9 12 15 12 15 22" />
                      </svg>
                    )}
                    <span>{crumb.label}</span>
                  </a>
                ) : (
                  <a
                    href={targetUrl}
                    className="tux-breadcrumbs__link"
                  >
                    {crumb.label}
                  </a>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    );
  },
);
