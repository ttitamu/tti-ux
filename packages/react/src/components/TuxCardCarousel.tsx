/**
 * TuxCardCarousel — React 19 JSX component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
import React from 'react';

export interface TuxCardCarouselProps {
  items?: string;
  eyebrow?: string;
  title?: string;
  bare?: boolean;
  arrows?: boolean;
  dots?: boolean;
  loop?: boolean;
  slidesToScroll?: number;
  align?: "start" | "center" | "end";
  gap?: string;
  ariaLabel?: string;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const TuxCardCarousel: React.FC<TuxCardCarouselProps> = ({
  items, eyebrow, title, bare = false, arrows = true, dots = false, loop = false, slidesToScroll = 1, align = "start", gap = "1rem", ariaLabel = "Carousel", children, className = '', style
}) => {
  return (
    <section className={`tux-card-carousel ${className}`.trim()} style={style}>
      {eyebrow !== undefined && String(eyebrow) !== "" && <div className="tux-card-carousel__eyebrow" style={{ fontSize: "0.75rem", fontFamily: "var(--font-mono, monospace)", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--brand-primary, #500000)" }}>{String(eyebrow)}</div>}
      {title !== undefined && String(title) !== "" && <div className="tux-card-carousel__title" style={{ fontWeight: 600, color: "var(--text-primary, #191919)" }}>{String(title)}</div>}
      {children}
    </section>
  );
};

export default TuxCardCarousel;
