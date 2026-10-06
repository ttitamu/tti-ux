/**
 * TuxFormField — label + help + input + error stack wrapper.
 * React port of app/components/TuxFormField.vue.
 */

import React, { forwardRef, useId, type HTMLAttributes, type ReactNode } from "react";
import "./tux-form-field.css";

export interface TuxFormFieldRenderProps {
  inputId: string;
  descId?: string;
  errorId?: string;
  ariaDescribedby?: string;
  ariaInvalid?: boolean;
  ariaRequired?: boolean;
}

export interface TuxFormFieldProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  /** Field label. */
  label: string;
  /** Optional help text tooltip / info button. */
  help?: string;
  /** Inline hint text below the label. */
  hint?: string;
  /** Validation error message. */
  error?: string;
  /** Show required asterisk. */
  required?: boolean;
  /** Explicit input ID (auto-generated if omitted). */
  inputId?: string;
  /** Layout: stacked (default) or inline. */
  layout?: "stacked" | "inline";
  /** Child component or render prop function. */
  children?: ReactNode | ((props: TuxFormFieldRenderProps) => ReactNode);
}

export const TuxFormField = forwardRef<HTMLDivElement, TuxFormFieldProps>(
  function TuxFormField(
    {
      label,
      help,
      hint,
      error,
      required = false,
      inputId: explicitInputId,
      layout = "stacked",
      className = "",
      children,
      ...restProps
    },
    ref,
  ) {
    const generatedId = useId();
    const inputId = explicitInputId || `tux-field-${generatedId.replace(/:/g, "")}`;
    const descId = hint ? `${inputId}-desc` : undefined;
    const errorId = error ? `${inputId}-error` : undefined;

    const describedBy = [descId, errorId].filter(Boolean).join(" ") || undefined;

    const classes = [
      "tux-form-field",
      `tux-form-field--${layout}`,
      error ? "tux-form-field--invalid" : "",
      required ? "tux-form-field--required" : "",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    const renderProps: TuxFormFieldRenderProps = {
      inputId,
      descId,
      errorId,
      ariaDescribedby: describedBy,
      ariaInvalid: Boolean(error),
      ariaRequired: required,
    };

    return (
      <div ref={ref} className={classes} {...restProps}>
        <div className="tux-form-field__label-row">
          <label htmlFor={inputId} className="tux-form-field__label">
            {label}
            {required && (
              <span className="tux-form-field__required" aria-label="required">
                *
              </span>
            )}
          </label>
          {help && (
            <button
              type="button"
              className="tux-form-field__help-trigger"
              title={help}
              aria-label={`Help: ${label}`}
            >
              <svg
                viewBox="0 0 24 24"
                width="14"
                height="14"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 16v-4" />
                <path d="M12 8h.01" />
              </svg>
            </button>
          )}
        </div>

        {hint && (
          <p id={descId} className="tux-form-field__hint">
            {hint}
          </p>
        )}

        <div className="tux-form-field__input-wrap">
          {typeof children === "function" ? children(renderProps) : children}
        </div>

        {error && (
          <p id={errorId} role="alert" className="tux-form-field__error">
            <svg
              className="tux-form-field__error-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span>{error}</span>
          </p>
        )}
      </div>
    );
  },
);
