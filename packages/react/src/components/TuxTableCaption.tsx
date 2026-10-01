import React from "react";
import "./tux-table-caption.css";

export interface TuxTableCaptionProps {
  label?: string;
  number: number | string;
  caption?: React.ReactNode;
  source?: React.ReactNode;
  placement?: "above" | "below";
  className?: string;
  children?: React.ReactNode;
}

export const TuxTableCaption: React.FC<TuxTableCaptionProps> = ({
  label = "Table",
  number,
  caption,
  source,
  placement = "above",
  className = "",
  children,
}) => {
  const captionElement = (caption || source) && (
    <figcaption className="tux-table-caption__caption">
      <span className="tux-table-caption__label">
        {label} {number}.
      </span>
      {caption}
      {source && (
        <span className="tux-table-caption__source">{source}</span>
      )}
    </figcaption>
  );

  return (
    <figure className={`tux-table-caption ${className}`.trim()}>
      {placement === "above" && captionElement}
      <div className="tux-table-caption__content">{children}</div>
      {placement === "below" && captionElement}
    </figure>
  );
};
