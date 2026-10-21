import React, { useState } from "react";

export type TuxToolCallStatus = "running" | "completed" | "failed";

export interface TuxToolCallProps {
  verb: string;
  arg?: string;
  status?: TuxToolCallStatus;
  elapsedMs?: number;
  diff?: string;
  icon?: string;
  defaultOpen?: boolean;
  children?: React.ReactNode;
  className?: string;
}

export const TuxToolCall: React.FC<TuxToolCallProps> = ({
  verb,
  arg,
  status = "completed",
  elapsedMs,
  diff,
  defaultOpen = false,
  children,
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const hasPayload = Boolean(diff || children);

  return (
    <div
      className={`tux-tool-call my-1.5 rounded-md border border-surface-border bg-surface-raised overflow-hidden text-xs font-mono ${className}`.trim()}
    >
      <div
        className={`flex items-center justify-between px-3 py-1.5 select-none ${
          hasPayload ? "cursor-pointer hover:bg-surface-sunken transition-colors" : ""
        }`.trim()}
        role={hasPayload ? "button" : undefined}
        tabIndex={hasPayload ? 0 : undefined}
        aria-expanded={hasPayload ? isOpen : undefined}
        onClick={() => hasPayload && setIsOpen((prev) => !prev)}
        onKeyDown={(e) => {
          if (hasPayload && (e.key === "Enter" || e.key === " ")) {
            e.preventDefault();
            setIsOpen((prev) => !prev);
          }
        }}
      >
        <div className="flex items-center gap-2 min-w-0">
          <span
            className="text-[11px] font-bold uppercase tracking-wider text-text-muted"
            data-status={status}
          >
            {verb}
          </span>
          {arg && (
            <span className="text-text-primary truncate font-medium">
              {arg}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 flex-shrink-0 ml-2">
          {elapsedMs !== undefined && (
            <span className="text-[10px] text-text-muted">{elapsedMs}ms</span>
          )}
        </div>
      </div>

      {isOpen && hasPayload && (
        <div className="border-t border-surface-border bg-surface-sunken p-2.5 overflow-x-auto text-[11px] leading-relaxed">
          {diff ? (
            <pre className="m-0 font-mono">{diff}</pre>
          ) : (
            children
          )}
        </div>
      )}
    </div>
  );
};

export default TuxToolCall;
