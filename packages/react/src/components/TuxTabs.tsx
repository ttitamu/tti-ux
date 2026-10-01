import React, { useState } from "react";
import "./tux-tabs.css";

export interface TabItem {
  value: string | number;
  label: string;
  badge?: string | number;
  disabled?: boolean;
  content?: React.ReactNode;
}

export interface TuxTabsProps {
  items: TabItem[];
  value?: string | number;
  defaultValue?: string | number;
  onChange?: (value: string | number) => void;
  orientation?: "horizontal" | "vertical";
  size?: "slim" | "md";
  variant?: "default" | "bold";
  className?: string;
  children?: React.ReactNode;
}

export const TuxTabs: React.FC<TuxTabsProps> = ({
  items,
  value,
  defaultValue,
  onChange,
  orientation = "horizontal",
  size = "md",
  variant = "default",
  className = "",
  children,
}) => {
  const [internalValue, setInternalValue] = useState<string | number>(
    defaultValue ?? items[0]?.value ?? ""
  );

  const activeValue = value !== undefined ? value : internalValue;

  const handleSelect = (val: string | number) => {
    if (value === undefined) {
      setInternalValue(val);
    }
    onChange?.(val);
  };

  const activeItem = items.find((i) => i.value === activeValue);

  return (
    <div
      className={`tux-tabs tux-tabs--${orientation} ${className}`.trim()}
    >
      <div
        className={`tux-tabs__list tux-tabs__list--${orientation} tux-tabs__list--${size}`}
        role="tablist"
        aria-orientation={orientation}
      >
        {items.map((item) => {
          const isActive = item.value === activeValue;
          return (
            <button
              key={item.value}
              type="button"
              role="tab"
              aria-selected={isActive}
              data-state={isActive ? "active" : "inactive"}
              disabled={item.disabled}
              className={`tux-tabs__trigger tux-tabs__trigger--${variant}`}
              onClick={() => !item.disabled && handleSelect(item.value)}
            >
              <span>{item.label}</span>
              {item.badge !== undefined && (
                <span className="tux-tabs__badge">{item.badge}</span>
              )}
              {isActive && <span className="tux-tabs__indicator" />}
            </button>
          );
        })}
      </div>

      <div className="tux-tabs__content" role="tabpanel">
        {children || (activeItem && activeItem.content)}
      </div>
    </div>
  );
};
