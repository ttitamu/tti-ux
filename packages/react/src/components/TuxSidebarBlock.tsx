/**
 * TuxSidebarBlock — Stacked sidebar module block with eyebrow, heading, and variant styling.
 * React port of app/components/TuxSidebarBlock.vue.
 */
import React, { forwardRef, type HTMLAttributes, type ReactNode } from "react";

export interface TuxSidebarBlockProps extends Omit<HTMLAttributes<HTMLElement>, "title"> {
  title: string;
  eyebrow?: string;
  icon?: ReactNode;
  variant?: "default" | "bordered" | "filled";
  footer?: ReactNode;
  children?: ReactNode;
}

export const TuxSidebarBlock = forwardRef<HTMLElement, TuxSidebarBlockProps>(
  function TuxSidebarBlock(
    {
      title,
      eyebrow,
      icon,
      variant = "default",
      footer,
      children,
      className = "",
      style,
      ...restProps
    },
    ref,
  ) {
    const variantStyle: React.CSSProperties =
      variant === "bordered"
        ? {
            background: "var(--surface-raised, #ffffff)",
            border: "1px solid var(--surface-border, #d6d3d1)",
            borderLeft: "4px solid var(--brand-primary, #500000)",
          }
        : variant === "filled"
          ? {
              background: "var(--surface-sunken, #f5f5f4)",
              border: "1px solid var(--surface-border, #d6d3d1)",
            }
          : {
              background: "var(--surface-raised, #ffffff)",
              border: "1px solid var(--surface-border, #d6d3d1)",
            };

    return (
      <section
        ref={ref}
        aria-label={title}
        className={`tux-sidebar-block tux-sidebar-block--${variant} ${className}`.trim()}
        style={{
          padding: "1.25rem",
          borderRadius: "0.75rem",
          fontFamily: "var(--font-body, system-ui, sans-serif)",
          color: "var(--text-primary, #191919)",
          ...variantStyle,
          ...style,
        }}
        {...restProps}
      >
        {eyebrow && (
          <div
            className="tux-sidebar-block__eyebrow"
            style={{
              fontSize: "0.75rem",
              fontFamily: "var(--font-mono, monospace)",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              color: "var(--brand-primary, #500000)",
              marginBottom: "0.25rem",
            }}
          >
            {eyebrow}
          </div>
        )}

        <h3
          className="tux-sidebar-block__title"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            margin: "0 0 0.75rem 0",
            fontFamily: "var(--font-display, system-ui, sans-serif)",
            fontSize: "1rem",
            fontWeight: 600,
            color: "var(--text-primary, #191919)",
          }}
        >
          {icon && (
            <span
              className="tux-sidebar-block__icon"
              aria-hidden="true"
              style={{ color: "var(--brand-primary, #500000)", display: "inline-flex" }}
            >
              {icon}
            </span>
          )}
          <span>{title}</span>
        </h3>

        <div
          className="tux-sidebar-block__body"
          style={{
            fontSize: "0.875rem",
            lineHeight: 1.6,
            color: "var(--text-secondary, #44403c)",
          }}
        >
          {children}
        </div>

        {footer && (
          <div
            className="tux-sidebar-block__footer"
            style={{
              marginTop: "1rem",
              paddingTop: "0.75rem",
              borderTop: "1px solid var(--surface-border, #d6d3d1)",
            }}
          >
            {footer}
          </div>
        )}
      </section>
    );
  },
);

export default TuxSidebarBlock;
