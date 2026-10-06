import React, { useState, useRef, useEffect } from "react";
import "./tux-dropdown.css";

export interface DropdownItem {
  label: string;
  to?: string;
  href?: string;
  description?: string;
  onClick?: () => void;
}

export interface TuxDropdownProps {
  label: string;
  items: DropdownItem[];
  to?: string;
  href?: string;
  className?: string;
}

export const TuxDropdown: React.FC<TuxDropdownProps> = ({
  label,
  items,
  to,
  href,
  className = "",
}) => {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setOpen(true);
  };

  const hide = (delay = 120) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setOpen(false);
      timerRef.current = null;
    }, delay);
  };

  const toggle = () => setOpen((prev) => !prev);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setOpen(false);
      (rootRef.current?.querySelector("button, a") as HTMLElement | null)?.focus();
    }
  };

  const handleFocusOut = (e: React.FocusEvent) => {
    if (!rootRef.current?.contains(e.relatedTarget as Node)) {
      hide(0);
    }
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const triggerTarget = to || href;

  return (
    <div
      ref={rootRef}
      className={`tux-dropdown ${className}`.trim()}
      onMouseEnter={show}
      onMouseLeave={() => hide()}
      onFocusCapture={() => {}}
      onBlur={handleFocusOut}
      onKeyDown={handleKeyDown}
    >
      {triggerTarget ? (
        <a
          href={triggerTarget}
          className="tux-dropdown__trigger"
          aria-expanded={open}
          aria-haspopup="true"
        >
          <span>{label}</span>
          <svg
            className={`tux-dropdown__chevron ${open ? "tux-dropdown__chevron--open" : ""}`}
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </a>
      ) : (
        <button
          type="button"
          className="tux-dropdown__trigger"
          aria-expanded={open}
          aria-haspopup="true"
          onClick={toggle}
        >
          <span>{label}</span>
          <svg
            className={`tux-dropdown__chevron ${open ? "tux-dropdown__chevron--open" : ""}`}
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
      )}

      {open && (
        <div className="tux-dropdown__panel" role="menu">
          <ul className="tux-dropdown__list">
            {items.map((item, idx) => {
              const itemTarget = item.to || item.href;
              return (
                <li key={idx} className="tux-dropdown__item" role="none">
                  {itemTarget ? (
                    <a
                      href={itemTarget}
                      className="tux-dropdown__link"
                      role="menuitem"
                      onClick={() => {
                        item.onClick?.();
                        setOpen(false);
                      }}
                    >
                      <span className="tux-dropdown__link-label">{item.label}</span>
                      {item.description && (
                        <span className="tux-dropdown__link-description">
                          {item.description}
                        </span>
                      )}
                    </a>
                  ) : (
                    <button
                      type="button"
                      className="tux-dropdown__link"
                      role="menuitem"
                      style={{ width: "100%", textAlign: "left", background: "none", border: 0 }}
                      onClick={() => {
                        item.onClick?.();
                        setOpen(false);
                      }}
                    >
                      <span className="tux-dropdown__link-label">{item.label}</span>
                      {item.description && (
                        <span className="tux-dropdown__link-description">
                          {item.description}
                        </span>
                      )}
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};
