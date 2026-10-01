/**
 * TuxDescriptionList — term / definition pairs in semantic dl structure.
 * React port of app/components/TuxDescriptionList.vue.
 */

import React, { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import "./tux-description-list.css";

export interface TuxDescriptionListItem {
  /** Term name. */
  term: string;
  /** Value string or ReactNode. */
  value?: ReactNode;
}

export type TuxDescriptionListLayout = "inline" | "stacked";
export type TuxDescriptionListEmphasis = "editorial" | "data";

export interface TuxDescriptionListProps extends HTMLAttributes<HTMLDivElement> {
  /** List of term-value pairs. */
  items: TuxDescriptionListItem[];
  /** Layout mode: inline (grid) or stacked. */
  layout?: TuxDescriptionListLayout;
  /** Style emphasis: editorial (uppercase tracked) or data (mono terms). */
  emphasis?: TuxDescriptionListEmphasis;
  /** Optional header title above the list. */
  title?: string;
}

export const TuxDescriptionList = forwardRef<HTMLDivElement, TuxDescriptionListProps>(
  function TuxDescriptionList(
    {
      items,
      layout = "inline",
      emphasis = "editorial",
      title,
      className = "",
      ...restProps
    },
    ref,
  ) {
    const dlClasses = [
      "tux-dl",
      `tux-dl--${layout}`,
      `tux-dl--${emphasis}`,
    ].join(" ");

    return (
      <div ref={ref} className={`tux-dl-wrap ${className}`.trim()} {...restProps}>
        {title && <h3 className="tux-dl__title">{title}</h3>}
        <dl className={dlClasses}>
          {items.map((item, idx) => (
            <React.Fragment key={idx}>
              <dt className="tux-dl__term">{item.term}</dt>
              <dd className="tux-dl__value">{item.value}</dd>
            </React.Fragment>
          ))}
        </dl>
      </div>
    );
  },
);
