import React from "react";

export interface GroundedSource {
  id: string | number;
  title: string;
  url?: string;
  snippet?: string;
  type?: "document" | "database" | "web" | "code";
  page?: string | number;
}

export interface TuxGroundedSourcesProps {
  sources: GroundedSource[];
  dlpLabel?: string;
  className?: string;
}

export const TuxGroundedSources: React.FC<TuxGroundedSourcesProps> = ({
  sources,
  dlpLabel = "TTI-INTERNAL",
  className = "",
}) => {
  return (
    <div
      className={`tux-grounded-sources mt-3 pt-3 border-t border-surface-border flex flex-col gap-2 ${className}`.trim()}
    >
      <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-text-muted">
        <div className="flex items-center gap-1.5">
          <span>Grounded Citations ({sources.length})</span>
        </div>
        {dlpLabel && (
          <div
            className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-surface-sunken border border-surface-border text-[10px] text-text-secondary"
            title="Data Loss Prevention & Security Classification"
          >
            <span>DLP: {dlpLabel}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {sources.map((src, idx) => (
          <a
            key={src.id}
            href={src.url || "#"}
            target={src.url ? "_blank" : undefined}
            rel={src.url ? "noopener noreferrer" : undefined}
            className="tux-grounded-sources__item group flex items-start gap-2.5 p-2 rounded-md border border-surface-border bg-surface-sunken/50 hover:bg-surface-raised hover:border-brand-primary/50 transition-all text-left no-underline"
          >
            <span className="flex-shrink-0 w-5 h-5 rounded bg-brand-primary/10 text-brand-primary font-mono text-[11px] font-bold flex items-center justify-center border border-brand-primary/20">
              {idx + 1}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <p className="text-xs font-semibold text-text-primary group-hover:text-brand-primary truncate m-0">
                  {src.title}
                </p>
              </div>
              {src.snippet && (
                <p className="text-[11px] text-text-muted line-clamp-1 mt-0.5 m-0">
                  {src.snippet}
                </p>
              )}
              {src.page !== undefined && (
                <span className="inline-block mt-1 text-[10px] font-mono text-text-muted bg-surface-page px-1 rounded border border-surface-border">
                  p. {src.page}
                </span>
              )}
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default TuxGroundedSources;
