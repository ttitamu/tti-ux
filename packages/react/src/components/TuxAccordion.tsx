import React, { useId } from "react";
import "./tux-accordion.css";

export interface AccordionItem {
  title: string;
  eyebrow?: string;
  meta?: string;
  content?: React.ReactNode;
  defaultOpen?: boolean;
}

export interface TuxAccordionProps {
  items: AccordionItem[];
  kind?: "faq" | "publication";
  single?: boolean;
  className?: string;
}

export const TuxAccordion: React.FC<TuxAccordionProps> = ({
  items,
  kind = "faq",
  single = false,
  className = "",
}) => {
  const instanceId = useId();
  const groupName = single ? `tux-accordion-${instanceId}` : undefined;

  return (
    <div className={`tux-accordion tux-accordion--${kind} ${className}`.trim()}>
      {items.map((item, idx) => (
        <details
          key={idx}
          name={groupName}
          open={item.defaultOpen}
          className="tux-accordion__item"
        >
          <summary className="tux-accordion__summary">
            <div className="tux-accordion__summary-content">
              {item.eyebrow && (
                <span className="tux-accordion__eyebrow">{item.eyebrow}</span>
              )}
              <span className="tux-accordion__title">{item.title}</span>
              {item.meta && (
                <span className="tux-accordion__meta">{item.meta}</span>
              )}
            </div>
            <svg
              className="tux-accordion__chevron"
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </summary>
          <div className="tux-accordion__content">
            {typeof item.content === "string" ? <p>{item.content}</p> : item.content}
          </div>
        </details>
      ))}
    </div>
  );
};
