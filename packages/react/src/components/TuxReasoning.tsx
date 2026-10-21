import React, { useState } from "react";

export interface TuxReasoningProps {
  duration?: number;
  tokensPerSec?: number;
  defaultOpen?: boolean;
  children?: React.ReactNode;
  className?: string;
}

export const TuxReasoning: React.FC<TuxReasoningProps> = ({
  duration = 3.4,
  tokensPerSec,
  defaultOpen = false,
  children,
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div
      className={`tux-reasoning my-2 rounded-md border border-surface-border bg-surface-sunken/60 overflow-hidden text-xs ${className}`.trim()}
    >
      <button
        type="button"
        className="w-full flex items-center justify-between px-3 py-2 text-left font-mono text-text-secondary hover:text-text-primary hover:bg-surface-sunken transition-colors"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <div className="flex items-center gap-2">
          <span className="font-semibold text-text-primary">
            Thought for {duration}s
          </span>
          {tokensPerSec !== undefined && (
            <span className="text-text-muted">({tokensPerSec} tok/s)</span>
          )}
        </div>
        <span className="text-[10px] uppercase tracking-wider text-text-muted">
          {isOpen ? "Hide trace" : "Show trace"}
        </span>
      </button>

      {isOpen && (
        <div className="px-3.5 py-2.5 border-t border-surface-border bg-surface-page/50 text-text-secondary font-mono text-[11px] leading-relaxed whitespace-pre-wrap border-l-2 border-l-brand-accent">
          {children ||
            "1. Parsing user telemetry request...\n2. Querying TxDOT PeMS corridor database...\n3. Synthesizing AASHTO geometric compliance metrics."}
        </div>
      )}
    </div>
  );
};

export default TuxReasoning;
