/* global React, LucideIcon, TuxBadge */
/*
 * StructuredOutput.jsx — Batch F. Primitives for AI-generated structured tool
 * output rendered inline in the conversation. Anatomy lineage: MCP Apps for
 * Claude (inline-card, inline-carousel, full-screen response). Translated to
 * tti-ux's typography, color, and signature language.
 *
 *   • InlineCard      — single structured card embedded in a message
 *   • InlineCarousel  — horizontal strip of InlineCards (3–8 results)
 *   • ResponseCard    — full-width "expanded" card; a card-level container
 *                       for tool output that needs its own header + body +
 *                       footer + actions, sitting inside an assistant turn
 */

const { useState: _soUseState, useRef: _soUseRef, useEffect: _soUseEffect } = React;

// ─── InlineCard ────────────────────────────────────────────────────────────
// Anatomy: optional eyebrow, title, optional supporting line(s), optional
// metadata strip, optional thumb (left), optional trailing affordance (chevron).
// Used standalone or inside InlineCarousel.
function InlineCard({
  eyebrow,
  title,
  subtitle,
  meta,           // [{label, value}] — small metadata strip below body
  thumb,          // {src, alt} or {glyph: <node>} — leading visual
  badge,          // <node> — top-right badge slot (TuxBadge, etc)
  href,
  onClick,
  trailingIcon = "arrow-up-right",
  variant = "default", // "default" | "compact" | "media"
  width,          // optional fixed width (used by carousel)
  children,       // optional body block
}) {
  const [hover, setHover] = _soUseState(false);
  const interactive = !!(href || onClick);
  const Tag = href ? "a" : interactive ? "button" : "div";
  const isMedia = variant === "media";
  const isCompact = variant === "compact";

  const props = {
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    onClick: onClick,
    href: href,
    style: {
      display: "block",
      width: width || "100%",
      textAlign: "left",
      border: "1px solid",
      borderColor: hover && interactive ? "var(--brand-primary)" : "var(--surface-border)",
      borderRadius: "var(--radius-md)",
      background: "var(--surface-raised)",
      padding: 0,
      overflow: "hidden",
      cursor: interactive ? "pointer" : "default",
      fontFamily: "inherit",
      color: "var(--text-primary)",
      textDecoration: "none",
      transition: "border-color 150ms, box-shadow 150ms, transform 150ms",
      boxShadow: hover && interactive ? "var(--shadow-md)" : "var(--shadow-sm)",
      transform: hover && interactive ? "translateY(-1px)" : "translateY(0)",
      flexShrink: 0,
    },
  };

  return (
    <Tag {...props}>
      {/* Media variant: thumb on top */}
      {isMedia && thumb ? (
        <div style={{ width: "100%", aspectRatio: "16 / 9", background: "var(--surface-sunken)", overflow: "hidden", borderBottom: "1px solid var(--surface-border)" }}>
          {thumb.src ? (
            <img src={thumb.src} alt={thumb.alt || ""} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          ) : (
            <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)" }}>
              {thumb.glyph}
            </div>
          )}
        </div>
      ) : null}

      <div style={{ display: "flex", gap: isCompact ? 10 : 12, padding: isCompact ? "10px 12px" : "14px 16px", alignItems: "flex-start" }}>
        {/* Inline thumb (default + compact) */}
        {!isMedia && thumb ? (
          <div style={{ flexShrink: 0, width: isCompact ? 32 : 40, height: isCompact ? 32 : 40, borderRadius: 4, background: "var(--surface-sunken)", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-secondary)" }}>
            {thumb.src ? (
              <img src={thumb.src} alt={thumb.alt || ""} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              thumb.glyph
            )}
          </div>
        ) : null}

        <div style={{ flex: 1, minWidth: 0 }}>
          {eyebrow ? (
            <div className="eyebrow" style={{ marginBottom: 4, fontSize: "0.65rem" }}>
              {eyebrow}
            </div>
          ) : null}
          <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: isCompact ? "0.85rem" : "0.9rem", fontWeight: 600, lineHeight: 1.35, color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
                {title}
              </div>
              {subtitle ? (
                <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: 3, lineHeight: 1.5, overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
                  {subtitle}
                </div>
              ) : null}
            </div>
            {badge ? <div style={{ flexShrink: 0 }}>{badge}</div> : null}
            {!badge && interactive && trailingIcon && !isCompact ? (
              <div style={{ flexShrink: 0, color: hover ? "var(--brand-primary)" : "var(--text-muted)", marginTop: 1, transition: "color 150ms" }}>
                <LucideIcon name={trailingIcon} size={14} />
              </div>
            ) : null}
          </div>

          {children ? (
            <div style={{ marginTop: 10, fontSize: "0.8rem", color: "var(--text-secondary)", lineHeight: 1.55 }}>
              {children}
            </div>
          ) : null}

          {meta && meta.length ? (
            <div style={{ marginTop: 10, display: "flex", gap: 14, flexWrap: "wrap", paddingTop: 8, borderTop: "1px dashed var(--surface-border)" }}>
              {meta.map((m, i) => (
                <div key={i} style={{ display: "flex", flexDirection: "column" }}>
                  <span style={{ fontSize: "0.62rem", textTransform: "uppercase", letterSpacing: "var(--tracking-wider)", color: "var(--text-muted)", fontWeight: 600 }}>
                    {m.label}
                  </span>
                  <span style={{ fontSize: "0.78rem", color: "var(--text-primary)", fontFamily: m.mono ? "var(--font-mono)" : "inherit", marginTop: 1 }}>
                    {m.value}
                  </span>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </Tag>
  );
}

// ─── InlineCarousel ────────────────────────────────────────────────────────
// Horizontal scrollable strip of cards. Maroon edge-fade gradients on left/right
// when scrolled. Keyboard nav via arrow keys when focused.
function InlineCarousel({
  title,
  eyebrow,
  cardWidth = 280,
  gap = 12,
  count,           // optional total count override (e.g. "3 of 47 results")
  totalCount,
  children,
}) {
  const trackRef = _soUseRef(null);
  const [atStart, setAtStart] = _soUseState(true);
  const [atEnd, setAtEnd] = _soUseState(false);

  const updateEdges = () => {
    const el = trackRef.current;
    if (!el) return;
    setAtStart(el.scrollLeft <= 4);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 4);
  };

  _soUseEffect(() => {
    updateEdges();
    const el = trackRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateEdges, { passive: true });
    window.addEventListener("resize", updateEdges);
    return () => {
      el.removeEventListener("scroll", updateEdges);
      window.removeEventListener("resize", updateEdges);
    };
  }, []);

  const scroll = (dir) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * (cardWidth + gap) * 2, behavior: "smooth" });
  };

  const itemCount = React.Children.count(children);
  const shownCount = count != null ? count : itemCount;

  return (
    <div style={{ width: "100%" }}>
      {(title || eyebrow) ? (
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 10, gap: 10 }}>
          <div style={{ minWidth: 0 }}>
            {eyebrow ? <div className="eyebrow" style={{ marginBottom: 2 }}>{eyebrow}</div> : null}
            {title ? <div style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--text-primary)" }}>{title}</div> : null}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {totalCount != null ? (
              <span style={{ fontSize: "0.7rem", fontFamily: "var(--font-mono)", color: "var(--text-muted)" }}>
                {shownCount} of {totalCount}
              </span>
            ) : null}
            <div style={{ display: "flex", gap: 4 }}>
              <button
                onClick={() => scroll(-1)}
                disabled={atStart}
                title="Scroll left"
                style={{ border: "1px solid var(--surface-border)", background: "var(--surface-raised)", padding: "5px 7px", borderRadius: 4, cursor: atStart ? "not-allowed" : "pointer", color: atStart ? "var(--text-muted)" : "var(--text-primary)", opacity: atStart ? 0.4 : 1, display: "inline-flex", alignItems: "center" }}
              >
                <LucideIcon name="chevron-left" size={14} />
              </button>
              <button
                onClick={() => scroll(1)}
                disabled={atEnd}
                title="Scroll right"
                style={{ border: "1px solid var(--surface-border)", background: "var(--surface-raised)", padding: "5px 7px", borderRadius: 4, cursor: atEnd ? "not-allowed" : "pointer", color: atEnd ? "var(--text-muted)" : "var(--text-primary)", opacity: atEnd ? 0.4 : 1, display: "inline-flex", alignItems: "center" }}
              >
                <LucideIcon name="chevron-right" size={14} />
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <div style={{ position: "relative" }}>
        <div
          ref={trackRef}
          style={{
            display: "flex",
            gap,
            overflowX: "auto",
            scrollSnapType: "x proximity",
            paddingBottom: 4,
            scrollbarWidth: "thin",
          }}
        >
          {React.Children.map(children, (child, i) => (
            <div key={i} style={{ scrollSnapAlign: "start", flexShrink: 0, width: cardWidth }}>
              {React.isValidElement(child) ? React.cloneElement(child, { width: cardWidth }) : child}
            </div>
          ))}
        </div>
        {/* Edge fades */}
        {!atStart ? (
          <div style={{ position: "absolute", left: 0, top: 0, bottom: 4, width: 24, pointerEvents: "none", background: "linear-gradient(90deg, var(--surface-page) 20%, transparent)" }} />
        ) : null}
        {!atEnd ? (
          <div style={{ position: "absolute", right: 0, top: 0, bottom: 4, width: 24, pointerEvents: "none", background: "linear-gradient(270deg, var(--surface-page) 20%, transparent)" }} />
        ) : null}
      </div>
    </div>
  );
}

// ─── ResponseCard ──────────────────────────────────────────────────────────
// Larger, full-width "tool result" container. Header (icon + title + optional
// status chip + actions), body slot, footer slot. Used when a tool returns
// something substantive enough to deserve its own framed surface.
function ResponseCard({
  toolName,        // e.g. "search.docs", "linear.create_issue"
  title,
  status,          // "success" | "warning" | "running" | "error"
  statusLabel,     // optional override
  icon = "zap",
  actions,         // <node> — right-side action area in header
  footer,          // <node> — full-width footer (e.g. "View all → ", citations)
  children,        // body
  collapsible = false,
  defaultOpen = true,
}) {
  const [open, setOpen] = _soUseState(defaultOpen);
  const statusMap = {
    success: { color: "#1F8A5B", bg: "color-mix(in srgb, #1F8A5B 10%, transparent)", label: "complete" },
    warning: { color: "var(--brand-accent)", bg: "color-mix(in srgb, var(--brand-accent) 14%, transparent)", label: "needs review" },
    running: { color: "var(--text-secondary)", bg: "var(--surface-sunken)", label: "running…" },
    error:   { color: "#B23A3A", bg: "color-mix(in srgb, #B23A3A 10%, transparent)", label: "failed" },
  };
  const s = status ? statusMap[status] : null;

  return (
    <div style={{ border: "1px solid var(--surface-border)", borderRadius: "var(--radius-md)", background: "var(--surface-raised)", boxShadow: "var(--shadow-sm)", overflow: "hidden" }}>
      <header style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", borderBottom: open ? "1px solid var(--surface-border)" : "none", background: "var(--surface-page)" }}>
        <div style={{ flexShrink: 0, width: 28, height: 28, borderRadius: 4, background: "color-mix(in srgb, var(--brand-primary) 8%, var(--surface-raised))", color: "var(--brand-primary)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <LucideIcon name={icon} size={14} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          {toolName ? (
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", color: "var(--text-muted)", textTransform: "lowercase", letterSpacing: "0.02em" }}>
              tool · {toolName}
            </div>
          ) : null}
          <div style={{ fontSize: "0.875rem", fontWeight: 700, color: "var(--text-primary)", lineHeight: 1.3, marginTop: toolName ? 1 : 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {title}
          </div>
        </div>
        {s ? (
          <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "3px 8px", borderRadius: 999, fontSize: "0.68rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "var(--tracking-wider)", color: s.color, background: s.bg, flexShrink: 0 }}>
            <span style={{ width: 5, height: 5, borderRadius: 5, background: s.color }} />
            {statusLabel || s.label}
          </span>
        ) : null}
        {actions ? <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>{actions}</div> : null}
        {collapsible ? (
          <button
            onClick={() => setOpen((o) => !o)}
            title={open ? "Collapse" : "Expand"}
            style={{ border: "none", background: "transparent", padding: 4, cursor: "pointer", color: "var(--text-muted)", display: "inline-flex" }}
          >
            <LucideIcon name={open ? "chevron-up" : "chevron-down"} size={14} />
          </button>
        ) : null}
      </header>

      {open ? (
        <>
          <div style={{ padding: "14px 16px" }}>
            {children}
          </div>
          {footer ? (
            <footer style={{ padding: "10px 16px", borderTop: "1px solid var(--surface-border)", background: "var(--surface-page)", fontSize: "0.78rem", color: "var(--text-secondary)" }}>
              {footer}
            </footer>
          ) : null}
        </>
      ) : null}
    </div>
  );
}

Object.assign(window, {
  InlineCard,
  InlineCarousel,
  ResponseCard,
});
