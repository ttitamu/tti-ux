/**
 * TuxLinkList — categorized resource list.
 * React port of app/components/TuxLinkList.vue.
 */

import React, { forwardRef, type HTMLAttributes } from "react";
import "./tux-link-list.css";

export interface TuxLinkListItem {
  label: string;
  to?: string;
  href?: string;
  /** Short subtitle / description shown beneath the label. */
  description?: string;
  /** Mark as external — adds the up-right arrow glyph. Auto-detected when href starts with http. */
  external?: boolean;
  /** Render with a maroon left-bar emphasis. */
  featured?: boolean;
}

export interface TuxLinkListGroup {
  heading?: string;
  items: TuxLinkListItem[];
}

export interface TuxLinkListProps extends HTMLAttributes<HTMLDivElement> {
  /** Array of grouped link blocks. */
  groups: TuxLinkListGroup[];
  /** Layout — columns lays the groups side-by-side; stacked runs them top-to-bottom. */
  layout?: "columns" | "stacked";
  /** When layout="columns", target column count. Auto-fits to viewport. */
  columns?: 2 | 3 | 4;
}

export const TuxLinkList = forwardRef<HTMLDivElement, TuxLinkListProps>(
  function TuxLinkList(
    {
      groups,
      layout = "columns",
      columns = 3,
      className = "",
      ...restProps
    },
    ref,
  ) {
    const isItemExternal = (item: TuxLinkListItem): boolean => {
      if (item.external !== undefined) return item.external;
      return Boolean(item.href && /^https?:/.test(item.href));
    };

    const classes = [
      "tux-link-list",
      `tux-link-list--${layout}`,
      layout === "columns" ? `tux-link-list--cols-${columns}` : "",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <div ref={ref} className={classes} {...restProps}>
        {groups.map((group, gIdx) => (
          <section key={gIdx} className="tux-link-list__group">
            {group.heading && (
              <h3 className="tux-link-list__heading">{group.heading}</h3>
            )}
            <ul className="tux-link-list__items">
              {group.items.map((item, iIdx) => {
                const targetUrl = item.to ?? item.href;
                const external = isItemExternal(item);
                const itemClasses = [
                  "tux-link-list__item",
                  item.featured ? "tux-link-list__item--featured" : "",
                ]
                  .filter(Boolean)
                  .join(" ");

                return (
                  <li key={iIdx} className={itemClasses}>
                    {targetUrl ? (
                      <a
                        href={targetUrl}
                        target={external ? "_blank" : undefined}
                        rel={external ? "noopener noreferrer" : undefined}
                        className="tux-link-list__link"
                      >
                        <span className="tux-link-list__label">
                          {item.label}
                          {external && (
                            <svg
                              className="tux-link-list__external-icon"
                              aria-hidden="true"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M7 7h10v10" />
                              <path d="M7 17 17 7" />
                            </svg>
                          )}
                        </span>
                        {item.description && (
                          <span className="tux-link-list__description">
                            {item.description}
                          </span>
                        )}
                      </a>
                    ) : (
                      <span className="tux-link-list__link">
                        <span className="tux-link-list__label">{item.label}</span>
                        {item.description && (
                          <span className="tux-link-list__description">
                            {item.description}
                          </span>
                        )}
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>
    );
  },
);
