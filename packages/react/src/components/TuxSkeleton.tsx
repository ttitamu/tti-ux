import React from "react";
import "./tux-skeleton.css";

export type TuxSkeletonVariant = "block" | "text" | "circle";
export type TuxSkeletonKind =
  | "primitive"
  | "card"
  | "list"
  | "table"
  | "article"
  | "media"
  | "stat";
export type TuxSkeletonAnimation = "shimmer" | "pulse" | "never";

export interface TuxSkeletonProps {
  kind?: TuxSkeletonKind;
  variant?: TuxSkeletonVariant;
  /** CSS width — e.g. '100%', '12rem', '40ch' */
  width?: string;
  /** CSS height — e.g. '1em', '2.5rem', '12rem' */
  height?: string;
  /** Border radius override */
  radius?: string;
  /** Number of repeat lines (applies to list, article, table) */
  count?: number;
  animated?: TuxSkeletonAnimation;
  /** Accessible label announced by AT */
  label?: string;
  className?: string;
}

export const TuxSkeleton: React.FC<TuxSkeletonProps> = ({
  kind = "primitive",
  variant = "block",
  width = "100%",
  height,
  radius,
  count = 3,
  animated = "shimmer",
  label = "Loading…",
  className = "",
}) => {
  const computedHeight = height
    ? height
    : variant === "text"
    ? "0.75em"
    : variant === "circle"
    ? width
    : "1.25rem";

  const computedRadius = radius
    ? radius
    : variant === "circle"
    ? "50%"
    : "var(--radius-sm)";

  const repeatLines = Array.from({ length: count });

  return (
    <div
      className={`tux-skeleton-wrap tux-skeleton-wrap--${kind} tux-skeleton-wrap--${animated} ${className}`.trim()}
      role="status"
      aria-label={label}
      aria-live="polite"
    >
      <span className="sr-only">{label}</span>

      {/* Primitive */}
      {kind === "primitive" && (
        <span
          className="tux-skeleton"
          style={{ width, height: computedHeight, borderRadius: computedRadius }}
          aria-hidden="true"
        />
      )}

      {/* Card */}
      {kind === "card" && (
        <div className="tux-skeleton__card" aria-hidden="true">
          <span className="tux-skeleton tux-skeleton__media" />
          <span className="tux-skeleton tux-skeleton__heading" />
          <span className="tux-skeleton tux-skeleton__line" />
          <span className="tux-skeleton tux-skeleton__line tux-skeleton__line--short" />
        </div>
      )}

      {/* List */}
      {kind === "list" && (
        <ul className="tux-skeleton__list" aria-hidden="true">
          {repeatLines.map((_, i) => (
            <li key={i} className="tux-skeleton__list-item">
              <span className="tux-skeleton tux-skeleton__avatar" />
              <span className="tux-skeleton__list-text">
                <span className="tux-skeleton tux-skeleton__heading" />
                <span className="tux-skeleton tux-skeleton__line tux-skeleton__line--short" />
              </span>
            </li>
          ))}
        </ul>
      )}

      {/* Table */}
      {kind === "table" && (
        <div className="tux-skeleton__table" aria-hidden="true">
          <div className="tux-skeleton__table-row tux-skeleton__table-row--head">
            {[1, 2, 3, 4].map((i) => (
              <span key={i} className="tux-skeleton tux-skeleton__cell" />
            ))}
          </div>
          {repeatLines.map((_, i) => (
            <div key={i} className="tux-skeleton__table-row">
              {[1, 2, 3, 4].map((c) => (
                <span key={c} className="tux-skeleton tux-skeleton__cell" />
              ))}
            </div>
          ))}
        </div>
      )}

      {/* Article */}
      {kind === "article" && (
        <div className="tux-skeleton__article" aria-hidden="true">
          <span className="tux-skeleton tux-skeleton__title" />
          <span className="tux-skeleton tux-skeleton__meta" />
          {repeatLines.map((_, i) => (
            <span
              key={i}
              className={`tux-skeleton tux-skeleton__line ${
                i === repeatLines.length - 1 ? "tux-skeleton__line--short" : ""
              }`.trim()}
            />
          ))}
        </div>
      )}

      {/* Media */}
      {kind === "media" && (
        <div className="tux-skeleton__media-wrap" aria-hidden="true">
          <span className="tux-skeleton tux-skeleton__media tux-skeleton__media--full" />
        </div>
      )}

      {/* Stat */}
      {kind === "stat" && (
        <div className="tux-skeleton__stat" aria-hidden="true">
          <span className="tux-skeleton tux-skeleton__stat-eyebrow" />
          <span className="tux-skeleton tux-skeleton__stat-value" />
          <span className="tux-skeleton tux-skeleton__stat-label" />
        </div>
      )}
    </div>
  );
};
