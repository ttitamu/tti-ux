/**
 * TuxEventCalendarRow — React 19 JSX component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
import React from 'react';

export interface TuxEventCalendarRowProps {
  day: string;
  month: string;
  title: string;
  time?: string;
  location?: string;
  category?: string;
  to?: string;
  href?: string;
  actionText?: string;
  chipTone?: "green" | "maroon" | "blue" | "gold";
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const TuxEventCalendarRow: React.FC<TuxEventCalendarRowProps> = ({
  day, month, title, time = "", location = "", category = "", to = "", href = "", actionText = "View Event", chipTone = "green", children, className = '', style
}) => {
  return (
    <article className={`tux-event-calendar-row ${className}`.trim()} style={style}>
      {title !== undefined && String(title) !== "" && <div className="tux-event-calendar-row__title" style={{ fontWeight: 600, color: "var(--text-primary, #191919)" }}>{String(title)}</div>}
      {children}
    </article>
  );
};

export default TuxEventCalendarRow;
