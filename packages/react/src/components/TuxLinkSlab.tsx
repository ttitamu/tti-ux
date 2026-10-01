/**
 * TuxLinkSlab — full-width horizontal band of prominent links.
 * React port of app/components/TuxLinkSlab.vue.
 */

import React, { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import "./tux-link-slab.css";

export interface TuxLinkSlabLink {
  label: string;
  to?: string;
  href?: string;
  /** Optional icon element or node. */
  icon?: ReactNode;
  /** Optional subtitle below the label. */
  description?: string;
}

export interface TuxLinkSlabProps extends HTMLAttributes<HTMLElement> {
  links: TuxLinkSlabLink[];
  /** Background tone: "plain" | "neutral" | "maroon". */
  tone?: "plain" | "neutral" | "maroon";
  /** Accessible name for the nav landmark. Default "Section navigation". */
  ariaLabel?: string;
}

export const TuxLinkSlab = forwardRef<HTMLElement, TuxLinkSlabProps>(
  function TuxLinkSlab(
    {
      links,
      tone = "plain",
      ariaLabel = "Section navigation",
      className = "",
      ...restProps
    },
    ref,
  ) {
    const classes = [
      "tux-link-slab",
      `tux-link-slab--${tone}`,
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <nav ref={ref} className={classes} aria-label={ariaLabel} {...restProps}>
        <ul className="tux-link-slab__list">
          {links.map((link, idx) => {
            const targetUrl = link.to ?? link.href;

            const content = (
              <>
                {link.icon && (
                  <span className="tux-link-slab__icon" aria-hidden="true">
                    {link.icon}
                  </span>
                )}
                <span className="tux-link-slab__text">
                  <span className="tux-link-slab__label">{link.label}</span>
                  {link.description && (
                    <span className="tux-link-slab__description">
                      {link.description}
                    </span>
                  )}
                </span>
                <svg
                  className="tux-link-slab__arrow"
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </>
            );

            return (
              <li key={idx} className="tux-link-slab__item">
                {targetUrl ? (
                  <a href={targetUrl} className="tux-link-slab__link">
                    {content}
                  </a>
                ) : (
                  <span className="tux-link-slab__link">
                    {content}
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      </nav>
    );
  },
);
