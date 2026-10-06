/**
 * TuxAlert — TTI-flavored callout with Docusaurus-style left-bar admonitions.
 * React port of app/components/TuxAlert.vue.
 */

import React, { forwardRef, useState, type HTMLAttributes, type ReactNode } from "react";
import "./tux-alert.css";

export type TuxAlertVariant =
  | "note"
  | "tip"
  | "info"
  | "important"
  | "success"
  | "warning"
  | "danger"
  | "compliance";

export interface TuxAlertProps extends HTMLAttributes<HTMLElement> {
  variant?: TuxAlertVariant;
  title?: string;
  description?: string;
  icon?: ReactNode;
  dismissible?: boolean;
  onClose?: () => void;
}

export const TuxAlert = forwardRef<HTMLElement, TuxAlertProps>(
  function TuxAlert(
    {
      variant = "info",
      title,
      description,
      icon,
      dismissible = false,
      onClose,
      className = "",
      children,
      ...restProps
    },
    ref,
  ) {
    const [closed, setClosed] = useState(false);

    if (closed) return null;

    const role = variant === "warning" || variant === "danger" ? "alert" : "status";

    const classes = [
      "tux-alert",
      `tux-alert--${variant}`,
      className,
    ]
      .filter(Boolean)
      .join(" ");

    const handleClose = () => {
      setClosed(true);
      onClose?.();
    };

    return (
      <aside ref={ref} role={role} className={classes} {...restProps}>
        {(title || icon) && (
          <div className="tux-alert__header">
            {icon && <span className="tux-alert__icon" aria-hidden="true">{icon}</span>}
            {title && <h4 className="tux-alert__title">{title}</h4>}
          </div>
        )}
        {(description || children) && (
          <div className="tux-alert__body">
            {description && <p style={{ margin: 0 }}>{description}</p>}
            {children}
          </div>
        )}
        {dismissible && (
          <button
            type="button"
            className="tux-alert__close"
            onClick={handleClose}
            aria-label="Dismiss alert"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
      </aside>
    );
  },
);
