/**
 * TuxSectionHeader — signature TTI editorial section header.
 * React port of app/components/TuxSectionHeader.vue.
 */

import React, { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import "./tux-section-header.css";

export type TuxSectionHeaderVariant = "institutional" | "classic" | "rule-full" | "minimal";
export type TuxSectionHeaderLevel = 1 | 2 | 3 | 4;

export interface TuxSectionHeaderProps extends HTMLAttributes<HTMLElement> {
  level?: TuxSectionHeaderLevel;
  title?: string;
  subtitle?: ReactNode;
  kicker?: string;
  variant?: TuxSectionHeaderVariant;
  children?: ReactNode;
}

export const TuxSectionHeader = forwardRef<HTMLElement, TuxSectionHeaderProps>(
  function TuxSectionHeader(
    {
      level = 2,
      title,
      subtitle,
      kicker,
      variant = "institutional",
      children,
      className = "",
      ...restProps
    },
    ref,
  ) {
    const Tag = `h${level}` as "h1" | "h2" | "h3" | "h4";
    const content = children ?? title;

    const rootClasses = [
      "tux-section-header",
      `tux-section-header--${variant}`,
      className,
    ]
      .filter(Boolean)
      .join(" ");

    const titleClasses = [
      "tux-section-header__title",
      `tux-section-header__title--h${level}`,
    ].join(" ");

    const isInstitutionalOrRuleFull = variant === "institutional" || variant === "rule-full";

    return (
      <header ref={ref} className={rootClasses} {...restProps}>
        {kicker && <div className="tux-section-header__kicker">{kicker}</div>}

        {isInstitutionalOrRuleFull ? (
          <div className="tux-section-header__body">
            <Tag className={titleClasses}>{content}</Tag>
            <div className="tux-section-header__rule" role="presentation" />
          </div>
        ) : (
          <Tag className={titleClasses}>{content}</Tag>
        )}

        {subtitle && <p className="tux-section-header__subtitle">{subtitle}</p>}
      </header>
    );
  },
);
