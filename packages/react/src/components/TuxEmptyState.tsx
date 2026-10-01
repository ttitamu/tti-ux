/**
 * TuxEmptyState — the "no data yet" pattern extracted.
 * React port of app/components/TuxEmptyState.vue.
 */

import React, { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import "./tux-empty-state.css";

export type TuxEmptyStateKind =
  | "no-data"
  | "no-results"
  | "not-found"
  | "no-permissions"
  | "first-run";

export interface TuxEmptyStateProps extends HTMLAttributes<HTMLDivElement> {
  /** Named preset. Pre-fills icon + title + description; explicit props override per-field. */
  kind?: TuxEmptyStateKind;
  /** Custom icon element. Overrides preset icon when set. */
  icon?: ReactNode;
  /** Heading text. Overrides preset title when set. */
  title?: string;
  /** Supporting copy. Overrides preset description when set. */
  description?: ReactNode;
  /** Drop the surrounding card frame. Default false. */
  noCard?: boolean;
  /** Smaller-scale variant for in-card / in-panel placements. */
  compact?: boolean;
  /** Action slot (e.g. CTA buttons). */
  children?: ReactNode;
}

const PRESETS: Record<
  TuxEmptyStateKind,
  { title: string; description: string; renderIcon: () => ReactNode }
> = {
  "no-data": {
    title: "No data yet",
    description: "When records arrive, they'll show up here.",
    renderIcon: () => (
      <svg className="tux-empty-state__icon" viewBox="0 0 24 24" aria-hidden="true">
        <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
        <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
      </svg>
    ),
  },
  "no-results": {
    title: "No matches",
    description: "Try a broader query, or clear the active filters.",
    renderIcon: () => (
      <svg className="tux-empty-state__icon" viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
        <line x1="8" y1="8" x2="14" y2="14" />
        <line x1="14" y1="8" x2="8" y2="14" />
      </svg>
    ),
  },
  "not-found": {
    title: "Not found",
    description: "The item you're looking for doesn't exist or has been removed.",
    renderIcon: () => (
      <svg className="tux-empty-state__icon" viewBox="0 0 24 24" aria-hidden="true">
        <path d="m2 2 20 20" />
        <path d="M8.35 2.69A10 10 0 0 1 21.3 15.65" />
        <path d="M19.08 19.08A10 10 0 1 1 4.92 4.92" />
      </svg>
    ),
  },
  "no-permissions": {
    title: "Access required",
    description:
      "You don't have permission to view this. Contact your administrator if you think that's a mistake.",
    renderIcon: () => (
      <svg className="tux-empty-state__icon" viewBox="0 0 24 24" aria-hidden="true">
        <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    ),
  },
  "first-run": {
    title: "Welcome",
    description: "Get started by creating your first item.",
    renderIcon: () => (
      <svg className="tux-empty-state__icon" viewBox="0 0 24 24" aria-hidden="true">
        <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z" />
      </svg>
    ),
  },
};

export const TuxEmptyState = forwardRef<HTMLDivElement, TuxEmptyStateProps>(
  function TuxEmptyState(
    {
      kind,
      icon,
      title,
      description,
      noCard = false,
      compact = false,
      children,
      className = "",
      ...restProps
    },
    ref,
  ) {
    const preset = kind ? PRESETS[kind] : undefined;

    const resolvedTitle = title ?? preset?.title ?? "";
    const resolvedDesc = description ?? preset?.description;
    const resolvedIcon = icon ?? (preset ? preset.renderIcon() : PRESETS["no-data"].renderIcon());

    const rootClasses = [
      "tux-empty-state",
      !noCard ? "tux-empty-state--card" : "",
      compact ? "tux-empty-state--compact" : "tux-empty-state--regular",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <div ref={ref} className={rootClasses} {...restProps}>
        <div className="tux-empty-state__icon-box">{resolvedIcon}</div>

        {resolvedTitle && <h3 className="tux-empty-state__title">{resolvedTitle}</h3>}

        {resolvedDesc && <p className="tux-empty-state__description">{resolvedDesc}</p>}

        {children && <div className="tux-empty-state__actions">{children}</div>}
      </div>
    );
  },
);
