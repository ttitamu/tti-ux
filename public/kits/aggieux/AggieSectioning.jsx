/*
 * AggieSectioning.jsx — Batch 24
 *
 * Three families:
 *   • tabs-horizontal — underline (default), segmented (bold), pill-rule (elegant)
 *   • tabs-vertical   — left-rail tabs with status badges, descriptions
 *   • side-sheet      — slide-in panels (modal scrim variant + inline variant)
 *
 * Helper prefix: SC.
 */

function SCSectionLabel({ children }) {
  return <div style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em", color: "var(--text-muted)", fontFamily: "var(--font-body-bold)", marginBottom: 14, marginTop: 28 }}>{children}</div>;
}
function SCIntro({ children }) {
  return <div style={{ background: "var(--surface-raised)", borderLeft: "3px solid var(--brand-primary)", padding: "16px 20px", marginBottom: 30, fontSize: "0.92rem", lineHeight: 1.6, color: "var(--text-secondary)" }}>{children}</div>;
}
function SCBox({ label, dark, children }) {
  return (
    <div style={{ marginBottom: 32 }}>
      {label && <div style={{ fontSize: "0.66rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--text-muted)", fontFamily: "var(--font-body-bold)", marginBottom: 10 }}>{label}</div>}
      <div style={{ background: dark ? "#0E1216" : "var(--surface-base)", border: "1px solid var(--surface-border)", padding: 24, borderRadius: "var(--radius-md)" }}>{children}</div>
    </div>
  );
}
function SCSpec({ label, value, note }) {
  return (
    <div style={{ padding: "16px 18px", borderRight: "1px solid var(--surface-border)" }}>
      <div style={{ fontSize: "0.62rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--text-muted)", fontFamily: "var(--font-body-bold)", marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: "0.82rem", fontFamily: "var(--font-body-bold)", fontWeight: 600, color: "var(--text-primary)", marginBottom: 4 }}>{value}</div>
      {note && <div style={{ fontSize: "0.74rem", color: "var(--text-muted)", lineHeight: 1.45 }}>{note}</div>}
    </div>
  );
}
function SCSpecRow({ children }) {
  return <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", border: "1px solid var(--surface-border)", borderRadius: "var(--radius-md)", overflow: "hidden", background: "var(--surface-raised)" }}>{children}</div>;
}

// ═══════════════════════════════════════════════════════════════════════
// 1. UNDERLINE TABS (default style)
// ═══════════════════════════════════════════════════════════════════════

function UnderlineTabs({ tabs, defaultIndex = 0, dark, onChange }) {
  const [i, setI] = React.useState(defaultIndex);
  const text = dark ? "rgba(255,255,255,0.92)" : "var(--text-primary)";
  const muted = dark ? "rgba(255,255,255,0.55)" : "var(--text-muted)";
  const border = dark ? "rgba(255,255,255,0.12)" : "var(--surface-border)";
  const accent = dark ? "#E89B7E" : "var(--brand-primary)";

  return (
    <div>
      <div role="tablist" style={{ display: "flex", gap: 0, borderBottom: `1px solid ${border}`, position: "relative" }}>
        {tabs.map((t, idx) => {
          const active = idx === i;
          return (
            <button
              key={idx}
              role="tab"
              aria-selected={active}
              onClick={() => { setI(idx); onChange && onChange(idx); }}
              style={{
                background: "transparent",
                border: "none",
                padding: "12px 18px",
                fontSize: "0.82rem",
                fontFamily: "var(--font-body)",
                fontWeight: active ? 600 : 500,
                color: active ? text : muted,
                cursor: "pointer",
                borderBottom: `2px solid ${active ? accent : "transparent"}`,
                marginBottom: -1,
                display: "flex",
                alignItems: "center",
                gap: 8,
                transition: "color 0.15s",
              }}
            >
              {t.label}
              {t.count !== undefined && (
                <span style={{ background: active ? accent : (dark ? "rgba(255,255,255,0.1)" : "var(--surface-sunken)"), color: active ? "white" : muted, padding: "1px 7px", borderRadius: 10, fontSize: "0.68rem", fontFamily: "var(--font-mono)", fontWeight: 700 }}>
                  {t.count}
                </span>
              )}
            </button>
          );
        })}
      </div>
      {tabs[i] && tabs[i].body && (
        <div style={{ padding: "20px 4px", color: text, fontSize: "0.88rem", lineHeight: 1.6 }}>
          {tabs[i].body}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// 2. SEGMENTED CONTROL (bold style)
// ═══════════════════════════════════════════════════════════════════════

function SegmentedTabs({ tabs, defaultIndex = 0, dark, fullWidth }) {
  const [i, setI] = React.useState(defaultIndex);
  const text = dark ? "white" : "var(--text-primary)";
  const muted = dark ? "rgba(255,255,255,0.6)" : "var(--text-muted)";
  const trackBg = dark ? "#171D24" : "var(--surface-sunken)";
  const trackBorder = dark ? "rgba(255,255,255,0.1)" : "var(--surface-border)";
  const accent = "var(--brand-primary)";

  return (
    <div>
      <div role="tablist" style={{ display: "inline-flex", padding: 3, background: trackBg, border: `1px solid ${trackBorder}`, borderRadius: 0, ...(fullWidth ? { width: "100%" } : {}) }}>
        {tabs.map((t, idx) => {
          const active = idx === i;
          return (
            <button
              key={idx}
              role="tab"
              aria-selected={active}
              onClick={() => setI(idx)}
              style={{
                flex: fullWidth ? 1 : "initial",
                background: active ? accent : "transparent",
                color: active ? "white" : muted,
                border: "none",
                padding: "9px 22px",
                fontSize: "0.74rem",
                fontFamily: "var(--font-body-bold)",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                cursor: "pointer",
                transition: "background 0.15s, color 0.15s",
              }}
            >
              {t.label}
            </button>
          );
        })}
      </div>
      {tabs[i] && tabs[i].body && (
        <div style={{ padding: "20px 4px", color: text, fontSize: "0.88rem", lineHeight: 1.6 }}>
          {tabs[i].body}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// 3. PILL TABS (elegant style)
// ═══════════════════════════════════════════════════════════════════════

function PillTabs({ tabs, defaultIndex = 0, dark }) {
  const [i, setI] = React.useState(defaultIndex);
  const text = dark ? "white" : "var(--text-primary)";
  const muted = dark ? "rgba(255,255,255,0.55)" : "var(--text-muted)";
  const border = dark ? "rgba(255,255,255,0.18)" : "var(--surface-border)";
  const accent = dark ? "#E89B7E" : "var(--brand-primary)";

  return (
    <div>
      <div role="tablist" style={{ display: "flex", gap: 6, alignItems: "center", borderBottom: `1px solid ${border}`, paddingBottom: 12 }}>
        {tabs.map((t, idx) => {
          const active = idx === i;
          return (
            <button
              key={idx}
              role="tab"
              aria-selected={active}
              onClick={() => setI(idx)}
              style={{
                background: active ? (dark ? "rgba(232,155,126,0.16)" : "color-mix(in srgb, var(--brand-primary) 8%, transparent)") : "transparent",
                color: active ? accent : muted,
                border: `1px solid ${active ? accent : "transparent"}`,
                padding: "7px 18px",
                fontSize: "0.85rem",
                fontFamily: "Georgia, var(--font-serif), serif",
                fontStyle: "italic",
                fontWeight: 500,
                cursor: "pointer",
                borderRadius: 999,
                transition: "all 0.15s",
              }}
            >
              {t.label}
            </button>
          );
        })}
      </div>
      {tabs[i] && tabs[i].body && (
        <div style={{ padding: "20px 4px", color: text, fontSize: "0.88rem", lineHeight: 1.6 }}>
          {tabs[i].body}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// SCROLLABLE OVERFLOW TABS
// ═══════════════════════════════════════════════════════════════════════

function ScrollableTabs({ tabs, defaultIndex = 0 }) {
  const [i, setI] = React.useState(defaultIndex);
  const ref = React.useRef(null);
  const [showLeft, setShowLeft] = React.useState(false);
  const [showRight, setShowRight] = React.useState(true);

  const onScroll = () => {
    const el = ref.current;
    if (!el) return;
    setShowLeft(el.scrollLeft > 4);
    setShowRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  };

  React.useEffect(() => { onScroll(); }, []);

  const scrollBy = (dx) => {
    if (ref.current) ref.current.scrollBy({ left: dx, behavior: "smooth" });
  };

  return (
    <div style={{ position: "relative" }}>
      {showLeft && (
        <button onClick={() => scrollBy(-200)} aria-label="Scroll tabs left" style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 36, background: "linear-gradient(90deg, var(--surface-base), transparent)", border: "none", cursor: "pointer", zIndex: 2, display: "flex", alignItems: "center", justifyContent: "flex-start", paddingLeft: 6 }}>
          <LucideIcon name="chevron-left" size={16} />
        </button>
      )}
      {showRight && (
        <button onClick={() => scrollBy(200)} aria-label="Scroll tabs right" style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 36, background: "linear-gradient(270deg, var(--surface-base), transparent)", border: "none", cursor: "pointer", zIndex: 2, display: "flex", alignItems: "center", justifyContent: "flex-end", paddingRight: 6 }}>
          <LucideIcon name="chevron-right" size={16} />
        </button>
      )}
      <div ref={ref} onScroll={onScroll} style={{ overflowX: "auto", scrollbarWidth: "none", borderBottom: "1px solid var(--surface-border)" }}>
        <style>{`.tabs-scroll-row::-webkit-scrollbar { display: none; }`}</style>
        <div className="tabs-scroll-row" role="tablist" style={{ display: "flex", gap: 0, minWidth: "max-content" }}>
          {tabs.map((t, idx) => {
            const active = idx === i;
            return (
              <button
                key={idx}
                role="tab"
                aria-selected={active}
                onClick={() => setI(idx)}
                style={{
                  background: "transparent", border: "none", padding: "12px 18px", whiteSpace: "nowrap",
                  fontSize: "0.82rem", fontFamily: "var(--font-body)", fontWeight: active ? 600 : 500,
                  color: active ? "var(--text-primary)" : "var(--text-muted)", cursor: "pointer",
                  borderBottom: `2px solid ${active ? "var(--brand-primary)" : "transparent"}`, marginBottom: -1,
                }}>
                {t.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// VERTICAL TABS (left rail)
// ═══════════════════════════════════════════════════════════════════════

function VerticalTabs({ sections: initialSections, defaultId, dark, withDescriptions = true, closeable = false, onAdd }) {
  const [sections, setSections] = React.useState(initialSections);
  const flat = sections.flatMap(s => s.items);
  const [active, setActive] = React.useState(defaultId || flat[0]?.id);
  const closeItem = (id) => {
    const all = sections.flatMap(s => s.items);
    const idx = all.findIndex(it => it.id === id);
    const next = sections.map(s => ({ ...s, items: s.items.filter(it => it.id !== id) })).filter(s => s.items.length > 0);
    setSections(next);
    if (id === active) {
      const remaining = next.flatMap(s => s.items);
      if (remaining.length) setActive(remaining[Math.max(0, idx - 1)]?.id || remaining[0].id);
    }
  };
  const text = dark ? "rgba(255,255,255,0.92)" : "var(--text-primary)";
  const muted = dark ? "rgba(255,255,255,0.55)" : "var(--text-muted)";
  const border = dark ? "rgba(255,255,255,0.1)" : "var(--surface-border)";
  const accent = dark ? "#E89B7E" : "var(--brand-primary)";
  const railBg = dark ? "#0E1216" : "var(--surface-raised)";

  const current = flat.find(it => it.id === active);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", border: `1px solid ${border}`, minHeight: 360 }}>
      <nav role="tablist" aria-orientation="vertical" style={{ background: railBg, borderRight: `1px solid ${border}`, padding: "16px 0" }}>
        {sections.map((s, si) => (
          <div key={si} style={{ marginBottom: 14 }}>
            {s.label && (
              <div style={{ fontSize: "0.62rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em", color: muted, fontFamily: "var(--font-body-bold)", padding: "0 18px 8px" }}>
                {s.label}
              </div>
            )}
            {s.items.map((it, ii) => {
              const sel = it.id === active;
              return (
                <button
                  key={ii}
                  role="tab"
                  aria-selected={sel}
                  onClick={() => setActive(it.id)}
                  style={{
                    width: "100%", background: sel ? (dark ? "rgba(232,155,126,0.08)" : "color-mix(in srgb, var(--brand-primary) 6%, transparent)") : "transparent",
                    border: "none", textAlign: "left", padding: "10px 18px", cursor: "pointer",
                    color: sel ? text : muted, fontSize: "0.85rem", fontFamily: "var(--font-body)",
                    borderLeft: `3px solid ${sel ? accent : "transparent"}`,
                    display: "flex", alignItems: "center", gap: 10, fontWeight: sel ? 600 : 500,
                  }}>
                  {it.icon && <LucideIcon name={it.icon} size={15} />}
                  <span style={{ flex: 1 }}>{it.label}</span>
                  {it.count !== undefined && (
                    <span style={{
                      fontSize: "0.65rem", padding: "1px 7px", borderRadius: 10,
                      background: sel ? accent : (dark ? "rgba(255,255,255,0.1)" : "var(--surface-sunken)"),
                      color: sel ? "white" : muted, fontFamily: "var(--font-mono)", fontWeight: 700,
                      minWidth: 18, textAlign: "center",
                    }}>{it.count}</span>
                  )}
                  {it.badge && (
                    <span style={{ fontSize: "0.65rem", padding: "2px 7px", borderRadius: 10, background: it.badgeTone === "danger" ? "var(--brand-primary)" : (dark ? "rgba(255,255,255,0.1)" : "var(--surface-sunken)"), color: it.badgeTone === "danger" ? "white" : muted, fontFamily: "var(--font-mono)", fontWeight: 700 }}>{it.badge}</span>
                  )}
                  {closeable && it.closeable !== false && (
                    <span
                      role="button"
                      aria-label={`Close ${it.label}`}
                      tabIndex={0}
                      onClick={(e) => { e.stopPropagation(); closeItem(it.id); }}
                      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); e.stopPropagation(); closeItem(it.id); } }}
                      style={{
                        display: "inline-flex", alignItems: "center", justifyContent: "center",
                        width: 18, height: 18, borderRadius: 3, color: muted, cursor: "pointer", transition: "background 0.12s",
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = dark ? "rgba(255,255,255,0.1)" : "var(--surface-sunken)"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                    >
                      <LucideIcon name="x" size={11} strokeWidth={2.5} />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </nav>
      <div style={{ padding: 28, color: text, background: dark ? "#0A0E12" : "transparent" }}>
        {current && (
          <>
            <div style={{ fontSize: "0.66rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em", color: muted, fontFamily: "var(--font-body-bold)", marginBottom: 8 }}>
              {current.eyebrow || "Section"}
            </div>
            <h3 style={{ margin: 0, fontSize: "1.45rem", fontFamily: "var(--font-display)", fontWeight: 600, color: text, marginBottom: 6 }}>
              {current.label}
            </h3>
            {withDescriptions && current.description && (
              <p style={{ fontSize: "0.92rem", color: muted, marginTop: 0, marginBottom: 18, lineHeight: 1.6 }}>
                {current.description}
              </p>
            )}
            <div style={{ height: 2, background: accent, width: 48, marginBottom: 22 }} />
            {current.body || (
              <div style={{ color: muted, fontSize: "0.88rem", lineHeight: 1.65 }}>
                Sample panel content. Pair with description-list for settings, with form-text for editable preferences, or with a callout for empty states.
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// SIDE SHEET — modal (with scrim) and inline (no scrim)
// ═══════════════════════════════════════════════════════════════════════

function SideSheetModal({ open, onClose, title, eyebrow, footer, width = 440, children }) {
  if (!open) return null;
  return (
    <div role="dialog" aria-modal="true" aria-label={title} style={{ position: "absolute", inset: 0, zIndex: 50, pointerEvents: "auto" }}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(8, 12, 16, 0.5)", backdropFilter: "blur(2px)" }} />
      <aside style={{ position: "absolute", top: 0, right: 0, bottom: 0, width, background: "var(--surface-base)", boxShadow: "-12px 0 32px rgba(0,0,0,0.18)", display: "flex", flexDirection: "column" }}>
        <header style={{ padding: "20px 24px", borderBottom: "1px solid var(--surface-border)" }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              {eyebrow && <div style={{ fontSize: "0.62rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em", color: "var(--text-muted)", fontFamily: "var(--font-body-bold)", marginBottom: 6 }}>{eyebrow}</div>}
              <h3 style={{ margin: 0, fontSize: "1.2rem", fontFamily: "var(--font-display)", fontWeight: 600, color: "var(--text-primary)" }}>{title}</h3>
              <div style={{ height: 2, background: "var(--brand-primary)", width: 36, marginTop: 10 }} />
            </div>
            <button onClick={onClose} aria-label="Close" style={{ background: "transparent", border: "1px solid var(--surface-border)", width: 32, height: 32, borderRadius: 0, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <LucideIcon name="x" size={14} />
            </button>
          </div>
        </header>
        <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px" }}>{children}</div>
        {footer && (
          <footer style={{ padding: "14px 24px", borderTop: "1px solid var(--surface-border)", background: "var(--surface-raised)", display: "flex", justifyContent: "flex-end", gap: 10 }}>
            {footer}
          </footer>
        )}
      </aside>
    </div>
  );
}

function SideSheetInline({ title, eyebrow, footer, children, width = 360 }) {
  return (
    <aside style={{ width, background: "var(--surface-raised)", borderLeft: "1px solid var(--surface-border)", display: "flex", flexDirection: "column", height: "100%" }}>
      <header style={{ padding: "16px 20px", borderBottom: "1px solid var(--surface-border)" }}>
        {eyebrow && <div style={{ fontSize: "0.62rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em", color: "var(--text-muted)", fontFamily: "var(--font-body-bold)", marginBottom: 4 }}>{eyebrow}</div>}
        <h4 style={{ margin: 0, fontSize: "1.05rem", fontFamily: "var(--font-display)", fontWeight: 600, color: "var(--text-primary)" }}>{title}</h4>
        <div style={{ height: 2, background: "var(--brand-primary)", width: 28, marginTop: 8 }} />
      </header>
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px" }}>{children}</div>
      {footer && <footer style={{ padding: "12px 20px", borderTop: "1px solid var(--surface-border)", display: "flex", justifyContent: "flex-end", gap: 8 }}>{footer}</footer>}
    </aside>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// SAMPLE PANEL CONTENT for tab demos
// ═══════════════════════════════════════════════════════════════════════

function SamplePanel({ heading, copy }) {
  return (
    <div>
      <h4 style={{ margin: 0, marginBottom: 8, fontFamily: "var(--font-display)", fontSize: "1.05rem", fontWeight: 600 }}>{heading}</h4>
      <p style={{ margin: 0, color: "var(--text-secondary)", fontSize: "0.88rem", lineHeight: 1.7 }}>{copy}</p>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// PAGES
// ═══════════════════════════════════════════════════════════════════════
// Refit: closeable tabs (Ant/Fabric anatomy — workspace + browser-style)
// ═══════════════════════════════════════════════════════════════════════
function CloseableTabs({ initialTabs, dark = false, addable = true }) {
  const [tabs, setTabs] = React.useState(initialTabs);
  const [activeId, setActiveId] = React.useState(initialTabs[0]?.id);
  const text = dark ? "rgba(255,255,255,0.92)" : "var(--text-primary)";
  const muted = dark ? "rgba(255,255,255,0.55)" : "var(--text-muted)";
  const border = dark ? "rgba(255,255,255,0.12)" : "var(--surface-border)";
  const accent = dark ? "#E89B7E" : "var(--brand-primary)";
  const activeBg = dark ? "rgba(255,255,255,0.04)" : "var(--surface-page)";

  const close = (e, id) => {
    e.stopPropagation();
    const i = tabs.findIndex(t => t.id === id);
    const next = tabs.filter(t => t.id !== id);
    setTabs(next);
    if (id === activeId && next.length) setActiveId(next[Math.max(0, i - 1)].id);
  };
  const add = () => {
    const nid = "tab-" + (Date.now() % 100000);
    const nt = { id: nid, label: "Untitled query", count: 0, body: <SamplePanel heading="Untitled query" copy="A blank workspace tab. Build a filter, run a query, save when ready." /> };
    setTabs([...tabs, nt]);
    setActiveId(nid);
  };

  const active = tabs.find(t => t.id === activeId);
  return (
    <div>
      <div role="tablist" style={{ display: "flex", alignItems: "stretch", borderBottom: `1px solid ${border}`, gap: 0 }}>
        {tabs.map(t => {
          const isAct = t.id === activeId;
          return (
            <button
              key={t.id}
              role="tab"
              aria-selected={isAct}
              onClick={() => setActiveId(t.id)}
              style={{
                position: "relative",
                display: "inline-flex", alignItems: "center", gap: 8,
                padding: "10px 12px 10px 14px",
                background: isAct ? activeBg : "transparent",
                border: "none",
                borderTop: `1px solid ${isAct ? border : "transparent"}`,
                borderLeft: `1px solid ${isAct ? border : "transparent"}`,
                borderRight: `1px solid ${isAct ? border : "transparent"}`,
                borderBottom: `1px solid ${isAct ? activeBg : "transparent"}`,
                marginBottom: -1,
                color: isAct ? text : muted,
                fontFamily: "var(--font-body)",
                fontSize: "0.82rem",
                fontWeight: isAct ? 600 : 500,
                cursor: "pointer",
                borderRadius: "var(--radius-sm) var(--radius-sm) 0 0",
                transition: "color 0.15s",
              }}
            >
              {/* Active top accent */}
              {isAct && <span aria-hidden style={{ position: "absolute", top: -1, left: 0, right: 0, height: 2, background: accent }} />}
              {t.icon && <LucideIcon name={t.icon} size={13} strokeWidth={1.8} />}
              <span>{t.label}</span>
              {t.count !== undefined && (
                <span style={{
                  fontFamily: "var(--font-mono)", fontSize: "0.7rem", fontWeight: 700,
                  padding: "1px 7px", borderRadius: 10,
                  background: isAct ? accent : (dark ? "rgba(255,255,255,0.1)" : "var(--surface-sunken)"),
                  color: isAct ? "white" : muted,
                  minWidth: 18, textAlign: "center",
                }}>{t.count}</span>
              )}
              {t.dirty && <span aria-hidden title="Unsaved changes" style={{ width: 6, height: 6, borderRadius: "50%", background: accent }} />}
              <span
                role="button"
                aria-label={`Close ${t.label}`}
                tabIndex={0}
                onClick={(e) => close(e, t.id)}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); close(e, t.id); } }}
                style={{
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  width: 18, height: 18, marginLeft: 2, padding: 0,
                  borderRadius: 3,
                  color: muted,
                  cursor: "pointer",
                  transition: "background 0.12s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = dark ? "rgba(255,255,255,0.1)" : "var(--surface-sunken)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
              >
                <LucideIcon name="x" size={11} strokeWidth={2.5} />
              </span>
            </button>
          );
        })}
        {addable && (
          <button onClick={add} aria-label="New tab" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 32, padding: "10px 0", background: "transparent", border: "none", color: muted, cursor: "pointer", borderRadius: 3 }}>
            <LucideIcon name="plus" size={13} strokeWidth={2} />
          </button>
        )}
      </div>
      <div role="tabpanel" style={{ background: activeBg, padding: 24, border: `1px solid ${border}`, borderTop: "none", borderRadius: "0 0 var(--radius-md) var(--radius-md)" }}>
        {active ? active.body : <div style={{ color: muted, fontStyle: "italic", textAlign: "center", padding: "32px 0" }}>No tabs open. Press + to start.</div>}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// TabsHorizontalPage
// ═══════════════════════════════════════════════════════════════════════

function TabsHorizontalPage() {
  const item = AGGIE_CATALOG.find(c => c.id === "tabs-horizontal");

  const reportTabs = [
    { label: "Overview",     count: 12, body: <SamplePanel heading="Overview" copy="Annual VMT, congestion costs, and fatality rates summarized at the system level. The numbers most often quoted in the press release version of the report." /> },
    { label: "Methodology",  count: 4,  body: <SamplePanel heading="Methodology" copy="Data sources, weighting, exclusions, and uncertainty quantification. Required for any peer-review submission." /> },
    { label: "Findings",     count: 27, body: <SamplePanel heading="Findings" copy="Significant results organized by corridor, mode, and time-of-day. Each finding links to the supporting figure." /> },
    { label: "Appendices",   count: 8,  body: <SamplePanel heading="Appendices" copy="Full data tables, model parameters, sensitivity analyses, and survey instruments." /> },
  ];

  const segmentTabs = [
    { label: "Daily",  body: <SamplePanel heading="Daily view" copy="Trip volumes, mode share, and average travel time aggregated by day of week." /> },
    { label: "Weekly", body: <SamplePanel heading="Weekly view" copy="Week-over-week trends with seasonal adjustments." /> },
    { label: "Yearly", body: <SamplePanel heading="Yearly view" copy="Annual roll-ups for long-term trend analysis. Decade-comparison series available." /> },
  ];

  const pillTabs = [
    { label: "Editor's note",   body: <SamplePanel heading="Editor's note" copy="A short framing piece from TTI's communications director. Reads like the introduction to a long-form essay." /> },
    { label: "Featured study",  body: <SamplePanel heading="Featured study" copy="The headline research piece for this issue. Hand-picked, 800–1,200 words, with an inline figure." /> },
    { label: "Field notes",     body: <SamplePanel heading="Field notes" copy="Short dispatches from researchers in the field. Photographs, observations, work-in-progress." /> },
    { label: "Letters",         body: <SamplePanel heading="Letters" copy="Reader responses to recent issues. Curated, lightly edited, attributed." /> },
  ];

  const overflowTabs = ["Bryan", "College Station", "Houston", "Dallas–Fort Worth", "San Antonio", "Austin", "El Paso", "Lubbock", "Amarillo", "Corpus Christi", "Beaumont–Port Arthur", "Tyler", "Waco", "Killeen–Temple", "Laredo"].map(label => ({ label }));

  return (
    <PageShell item={item}>
      <SCIntro>
        Three tab styles, one per visual variant. The <strong>underline</strong> tab is the workhorse — quiet on the page, leaves room for the panel below. The <strong>segmented control</strong> is for binary or short enumerations where the choices feel like settings, not navigation. The <strong>pill</strong> tab is editorial — used inside an article, not as primary navigation.
      </SCIntro>

      <SCSectionLabel>1 · Underline tabs — default style</SCSectionLabel>
      <SCBox label="Workhorse pattern. Long labels, optional counts, primary navigation inside a page.">
        <UnderlineTabs tabs={reportTabs} />
      </SCBox>
      <SCBox label="On dark — slide deck or app surface" dark>
        <UnderlineTabs tabs={reportTabs.map(t => ({ ...t, body: <div style={{ color: "rgba(255,255,255,0.85)" }}>{t.body.props.children}</div> }))} dark />
      </SCBox>

      <SCSectionLabel>2 · Segmented control — bold style</SCSectionLabel>
      <SCBox label="Inline-flex pill — 2–4 short, equal-weight options. Athletic capitalization.">
        <SegmentedTabs tabs={segmentTabs} />
      </SCBox>
      <SCBox label="Full-width variant — when the segment IS the section header">
        <SegmentedTabs tabs={segmentTabs} fullWidth />
      </SCBox>

      <SCSectionLabel>3 · Pill tabs — elegant style</SCSectionLabel>
      <SCBox label="Editorial flow inside a magazine-style page. Italic Georgia at body-size.">
        <PillTabs tabs={pillTabs} />
      </SCBox>

      <SCSectionLabel>4 · Overflow tabs — horizontal scroll</SCSectionLabel>
      <SCBox label="When tabs exceed container width: horizontal scroll with affordance arrows. Never wrap to a second row.">
        <ScrollableTabs tabs={overflowTabs} />
      </SCBox>

      <SCSectionLabel>Don't do this</SCSectionLabel>
      <CompareGoodBad
        goodTitle="One row, scroll on overflow"
        goodWhy="When tabs don't fit, scroll horizontally. The visual hierarchy stays one-row-of-equal-things."
        badTitle="Wrapping to a second row"
        badWhy="Two rows of tabs implies a hierarchy that doesn't exist. Users can't tell whether row-2 items are children of row-1 items, or peers."
        good={<div style={{ overflow: "hidden" }}><ScrollableTabs tabs={overflowTabs.slice(0, 8)} /></div>}
        bad={
          <div style={{ borderBottom: "1px solid var(--surface-border)", display: "flex", flexWrap: "wrap" }}>
            {overflowTabs.slice(0, 12).map((t, i) => (
              <div key={i} style={{ padding: "10px 14px", fontSize: "0.78rem", color: i === 0 ? "var(--text-primary)" : "var(--text-muted)", borderBottom: i === 0 ? "2px solid var(--brand-primary)" : "none", marginBottom: -1, fontFamily: "var(--font-body)" }}>{t.label}</div>
            ))}
          </div>
        }
      />

      <SCSectionLabel>5 · Closeable tabs — workspace + browser-style</SCSectionLabel>
      <SCBox label="Refit: counter badges + close affordance + new-tab button. Anatomy from Ant + Fabric tab close patterns.">
        <CloseableTabs initialTabs={[
          { id: "q1", label: "Active filters", icon: "filter", count: 4, body: <SamplePanel heading="Active filters" copy="Saved query: corridors with delay > 18 min and freight share > 20%. Updates every 15 minutes." /> },
          { id: "q2", label: "Houston region", icon: "map", count: 12, dirty: true, body: <SamplePanel heading="Houston region" copy="Unsaved scratch query — narrow to Houston district. Press save when done." /> },
          { id: "q3", label: "FY 2025 drafts", icon: "file-text", count: 28, body: <SamplePanel heading="FY 2025 drafts" copy="Reports in draft state by lead author. Sortable by last-modified." /> },
        ]} />
      </SCBox>

      <SCSectionLabel>Spec</SCSectionLabel>
      <SCSpecRow>
        <SCSpec label="Underline weight" value="2px" note="On 1px container border. The 2px reads through any anti-aliasing." />
        <SCSpec label="Hit target" value="≥ 44px tall" note="Including padding. Touch-friendly without being chunky." />
        <SCSpec label="Active color" value="brand primary" note="Underline + label. Inactive is text-muted." />
        <SCSpec label="Counter badge" value="mono 11px · 18px min-w" note="Pill on inactive uses sunken bg; active swaps to brand fill, white text." />
        <SCSpec label="Width mode" value="Fixed · Intrinsic" note="Fixed = equal-width cells (mobile, segments); Intrinsic = content-fit (long labels). Lineage: Base Gallery Tabs." />
        <SCSpec label="Default style" value="underline" note="Reach for segmented / pill only when the style variant demands it." />
      </SCSpecRow>
    </PageShell>
  );
}

function TabsVerticalPage() {
  const item = AGGIE_CATALOG.find(c => c.id === "tabs-vertical");

  const settingsSections = [
    {
      label: "Account",
      items: [
        { id: "profile",       label: "Profile",          icon: "user",       eyebrow: "Account",   description: "Your name, title, contact information, and public bio. Visible on the staff directory." },
        { id: "credentials",   label: "Credentials",      icon: "key-round",  eyebrow: "Account",   description: "Password, MFA settings, recovery codes, and active sessions across devices." },
        { id: "notifications", label: "Notifications",    icon: "bell",       eyebrow: "Account",   description: "Email, in-app, and digest preferences for project alerts, mentions, and weekly summaries.", badge: "3", badgeTone: "danger" },
      ],
    },
    {
      label: "Workspace",
      items: [
        { id: "team",     label: "Team members",   icon: "users",        eyebrow: "Workspace", description: "Invite collaborators, assign roles, and manage workspace permissions." },
        { id: "billing",  label: "Billing",        icon: "credit-card",  eyebrow: "Workspace", description: "Subscription tier, invoices, payment methods, and usage." },
        { id: "api",      label: "API & tokens",   icon: "key",          eyebrow: "Workspace", description: "Personal access tokens, rate limits, and webhook endpoints. Tokens are shown once at creation." },
      ],
    },
    {
      label: "Advanced",
      items: [
        { id: "data",     label: "Data export",    icon: "database",     eyebrow: "Advanced",  description: "Download all workspace data as JSON or CSV. Exports are queued and emailed when ready." },
        { id: "danger",   label: "Danger zone",    icon: "alert-octagon",eyebrow: "Advanced",  description: "Archive workspace, transfer ownership, or permanently delete account. These actions cannot be undone." },
      ],
    },
  ];

  return (
    <PageShell item={item}>
      <SCIntro>
        Vertical tabs anchor a left rail to a wide content panel. Use them for <strong>settings</strong>, <strong>documentation</strong> with many sub-pages, or any layout where the tab labels run too long for a horizontal row. Sections + section labels group related items; status badges flag items that need attention.
      </SCIntro>

      <SCSectionLabel>1 · Settings page pattern</SCSectionLabel>
      <SCBox label="Three sections, eight items, one with a danger-tone badge">
        <VerticalTabs sections={settingsSections} defaultId="notifications" />
      </SCBox>

      <SCSectionLabel>2 · On dark</SCSectionLabel>
      <SCBox label="Same component on the dark slate surface" dark>
        <VerticalTabs sections={settingsSections} defaultId="profile" dark />
      </SCBox>

      <SCSectionLabel>3 · Compact — without descriptions</SCSectionLabel>
      <SCBox label="When the panel content speaks for itself, drop the description block">
        <VerticalTabs sections={settingsSections.slice(0, 2)} defaultId="team" withDescriptions={false} />
      </SCBox>

      <SCSectionLabel>4 · Workspace pattern — counters + closeable items</SCSectionLabel>
      <SCBox label="Refit: counts on tabs, close affordance per item. Anatomy from Ant + Fabric vertical-tab close patterns.">
        <VerticalTabs
          closeable
          sections={[
            {
              label: "Saved queries",
              items: [
                { id: "q-active", label: "Active filters", icon: "filter", count: 4, eyebrow: "Saved queries", description: "Corridors with delay > 18 min and freight share > 20%. Refreshes every 15 minutes.", closeable: false },
                { id: "q-houston", label: "Houston region", icon: "map", count: 12, eyebrow: "Saved queries", description: "Narrowed to Houston district — IH-10, IH-45, US-59 corridors plus Beltway 8." },
                { id: "q-fy25", label: "FY 2025 drafts", icon: "file-text", count: 28, eyebrow: "Saved queries", description: "Reports in draft state by lead author. Sortable by last-modified date." },
              ],
            },
            {
              label: "Open documents",
              items: [
                { id: "doc-tti", label: "TTI annual review", icon: "book-open", count: 3, eyebrow: "Open documents", description: "Three unresolved comments from peer reviewers. Last opened 2 hours ago." },
                { id: "doc-corridor", label: "I-35 corridor study", icon: "route", count: 7, eyebrow: "Open documents", description: "Field data from October — 7 cross-sections still need uncertainty bounds." },
              ],
            },
          ]}
          defaultId="q-houston"
        />
      </SCBox>

      <SCSectionLabel>Don't do this</SCSectionLabel>
      <CompareGoodBad
        goodTitle="Section labels, descriptions, hierarchy"
        goodWhy="Sections cluster related items. Descriptions tell the reader what each tab covers without a click. Status badges flag urgency."
        badTitle="Flat list of 12 unlabeled items"
        badWhy="Without grouping, the reader scans every label trying to find the right one. Worse on mobile where the rail compresses."
        good={<div style={{ minHeight: 240 }}><VerticalTabs sections={settingsSections.slice(0, 2)} defaultId="profile" withDescriptions={false} /></div>}
        bad={
          <div style={{ display: "grid", gridTemplateColumns: "240px 1fr", border: "1px solid var(--surface-border)", minHeight: 240 }}>
            <nav style={{ background: "var(--surface-raised)", padding: "8px 0" }}>
              {["Profile","Credentials","Notifications","Email preferences","Push notifications","Team members","Roles","Permissions","Billing","Invoices","API tokens","Webhooks","Data export","Danger zone"].map((l, i) => (
                <div key={i} style={{ padding: "8px 18px", fontSize: "0.82rem", color: i === 0 ? "var(--text-primary)" : "var(--text-muted)", borderLeft: i === 0 ? "3px solid var(--brand-primary)" : "3px solid transparent" }}>{l}</div>
              ))}
            </nav>
            <div style={{ padding: 20, color: "var(--text-muted)", fontSize: "0.84rem" }}>Panel</div>
          </div>
        }
      />

      <SCSectionLabel>Spec</SCSectionLabel>
      <SCSpecRow>
        <SCSpec label="Rail width" value="260px" note="Comfortable for two-line labels with a leading icon and a trailing badge." />
        <SCSpec label="Active marker" value="3px left border" note="On a tinted background. Two reinforcements — color-blind safe." />
        <SCSpec label="Section grouping" value="Required" note="Use a section label whenever the rail has > 5 items. Otherwise scanning fails." />
        <SCSpec label="Description" value="≤ 2 lines" note="If you can't summarize it in two lines, the panel itself should clarify, not the rail copy." />
      </SCSpecRow>
    </PageShell>
  );
}

function SideSheetPage() {
  const item = AGGIE_CATALOG.find(c => c.id === "side-sheet");
  const [openA, setOpenA] = React.useState(false);
  const [openB, setOpenB] = React.useState(false);

  return (
    <PageShell item={item}>
      <SCIntro>
        A side sheet slides in from the right edge. Use it for <strong>detail views</strong> next to a list, <strong>filter forms</strong>, and <strong>quick edit</strong> tasks where pulling the user to a new page would lose context. <strong>Modal</strong> variant uses a scrim — the rest of the page is paused. <strong>Inline</strong> variant is permanent — split-pane layout where the sheet is part of the chrome.
      </SCIntro>

      <SCSectionLabel>1 · Modal side sheet — opens over content</SCSectionLabel>
      <SCBox label="Click the row → sheet slides in. Scrim dims the page; close to dismiss.">
        <div style={{ position: "relative", minHeight: 380, border: "1px solid var(--surface-border)", overflow: "hidden", background: "var(--surface-base)" }}>
          {/* Fake list */}
          <div style={{ padding: 24 }}>
            <h4 style={{ margin: 0, marginBottom: 12, fontFamily: "var(--font-display)" }}>Active research projects</h4>
            <div style={{ border: "1px solid var(--surface-border)" }}>
              {[
                { id: "p1", title: "Connected vehicle pilot — I-35 corridor", lead: "Dr. M. Hernández", status: "Phase 2" },
                { id: "p2", title: "Pedestrian safety at midblock crossings", lead: "Dr. R. Park", status: "Field study" },
                { id: "p3", title: "Freight bottleneck analysis · Houston Port", lead: "Dr. T. Olawale", status: "Reporting" },
                { id: "p4", title: "Rural transit ridership in Brazos Valley", lead: "Dr. J. Aiyer", status: "Phase 1" },
              ].map((p, i, arr) => (
                <button key={p.id} onClick={() => setOpenA(true)} style={{ display: "grid", gridTemplateColumns: "1fr auto auto", gap: 18, alignItems: "center", padding: "14px 18px", width: "100%", background: "transparent", border: "none", borderBottom: i < arr.length - 1 ? "1px solid var(--surface-border)" : "none", textAlign: "left", cursor: "pointer", fontFamily: "inherit" }}>
                  <div>
                    <div style={{ fontSize: "0.92rem", fontWeight: 600, color: "var(--text-primary)" }}>{p.title}</div>
                    <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: 2 }}>{p.lead}</div>
                  </div>
                  <span style={{ fontSize: "0.7rem", padding: "3px 9px", background: "var(--surface-sunken)", border: "1px solid var(--surface-border)", color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.08em", fontFamily: "var(--font-body-bold)", fontWeight: 700 }}>{p.status}</span>
                  <LucideIcon name="chevron-right" size={14} />
                </button>
              ))}
            </div>
          </div>

          <SideSheetModal
            open={openA}
            onClose={() => setOpenA(false)}
            eyebrow="Project"
            title="Connected vehicle pilot"
            footer={
              <>
                <button onClick={() => setOpenA(false)} style={{ background: "transparent", border: "1px solid var(--surface-border)", padding: "8px 16px", fontSize: "0.74rem", fontFamily: "var(--font-body-bold)", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700, cursor: "pointer", color: "var(--text-primary)" }}>Cancel</button>
                <button style={{ background: "var(--brand-primary)", color: "white", border: "none", padding: "8px 18px", fontSize: "0.74rem", fontFamily: "var(--font-body-bold)", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700, cursor: "pointer" }}>View full report</button>
              </>
            }
          >
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: "0.66rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--text-muted)", fontFamily: "var(--font-body-bold)", marginBottom: 6 }}>Principal Investigator</div>
              <div style={{ fontSize: "0.95rem", color: "var(--text-primary)" }}>Dr. María Hernández</div>
            </div>
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: "0.66rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--text-muted)", fontFamily: "var(--font-body-bold)", marginBottom: 6 }}>Funding</div>
              <div style={{ fontSize: "0.95rem", color: "var(--text-primary)" }}>USDOT FHWA · $1.42M · 36 months</div>
            </div>
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: "0.66rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--text-muted)", fontFamily: "var(--font-body-bold)", marginBottom: 6 }}>Summary</div>
              <p style={{ fontSize: "0.88rem", color: "var(--text-secondary)", lineHeight: 1.65, margin: 0 }}>
                A 24-month pilot equipping 60 vehicles with V2X communication along the I-35 corridor between Austin and San Antonio. Partners include TxDOT, Continental, and three municipal traffic operations centers. Phase 2 is currently expanding the equipped fleet from 30 to 60 vehicles.
              </p>
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {["Connected vehicles", "I-35", "V2X", "Phase 2"].map(t => (
                <span key={t} style={{ fontSize: "0.72rem", padding: "4px 10px", border: "1px solid var(--surface-border)", color: "var(--text-secondary)" }}>{t}</span>
              ))}
            </div>
          </SideSheetModal>
        </div>
      </SCBox>

      <SCSectionLabel>2 · Inline side sheet — split-pane</SCSectionLabel>
      <SCBox label="Permanent right rail. The list and detail are siblings, both visible at once.">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", border: "1px solid var(--surface-border)", minHeight: 380, background: "var(--surface-base)" }}>
          <div style={{ padding: 24 }}>
            <h4 style={{ margin: 0, marginBottom: 12, fontFamily: "var(--font-display)" }}>Recent reports</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 0, border: "1px solid var(--surface-border)" }}>
              {[
                { title: "Q4 mobility outlook · 2024", date: "Dec 18, 2024", selected: true },
                { title: "Texas freight congestion index", date: "Dec 02, 2024" },
                { title: "Rural transit annual update", date: "Nov 15, 2024" },
                { title: "Pedestrian safety bulletin · vol 12", date: "Oct 28, 2024" },
              ].map((r, i, arr) => (
                <div key={i} style={{ padding: "12px 16px", borderBottom: i < arr.length - 1 ? "1px solid var(--surface-border)" : "none", background: r.selected ? "color-mix(in srgb, var(--brand-primary) 6%, transparent)" : "transparent", borderLeft: `3px solid ${r.selected ? "var(--brand-primary)" : "transparent"}` }}>
                  <div style={{ fontSize: "0.88rem", fontWeight: r.selected ? 600 : 500, color: "var(--text-primary)" }}>{r.title}</div>
                  <div style={{ fontSize: "0.74rem", color: "var(--text-muted)", marginTop: 2 }}>{r.date}</div>
                </div>
              ))}
            </div>
          </div>
          <SideSheetInline
            eyebrow="Selected report"
            title="Q4 mobility outlook"
            footer={
              <button style={{ background: "var(--brand-primary)", color: "white", border: "none", padding: "7px 14px", fontSize: "0.72rem", fontFamily: "var(--font-body-bold)", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700, cursor: "pointer" }}>Open PDF</button>
            }
          >
            <div style={{ fontSize: "0.84rem", lineHeight: 1.65, color: "var(--text-secondary)", marginBottom: 16 }}>
              The end-of-year outlook synthesizes congestion, freight, and safety data into a single forward-looking briefing for legislative staff and agency leadership.
            </div>
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: "0.62rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--text-muted)", fontFamily: "var(--font-body-bold)", marginBottom: 4 }}>Pages</div>
              <div style={{ fontSize: "0.92rem", color: "var(--text-primary)" }}>54</div>
            </div>
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: "0.62rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--text-muted)", fontFamily: "var(--font-body-bold)", marginBottom: 4 }}>Authors</div>
              <div style={{ fontSize: "0.88rem", color: "var(--text-primary)" }}>M. Hernández, R. Park, J. Aiyer</div>
            </div>
            <div>
              <div style={{ fontSize: "0.62rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--text-muted)", fontFamily: "var(--font-body-bold)", marginBottom: 4 }}>DOI</div>
              <div style={{ fontSize: "0.84rem", color: "var(--text-primary)", fontFamily: "var(--font-mono)" }}>10.1234/tti.2024.04.q4</div>
            </div>
          </SideSheetInline>
        </div>
      </SCBox>

      <SCSectionLabel>3 · Side sheet for filters</SCSectionLabel>
      <SCBox label="Common pattern: button opens a filter sheet, scrim dims the list while the user picks">
        <div style={{ position: "relative", minHeight: 320, border: "1px solid var(--surface-border)", overflow: "hidden", background: "var(--surface-base)" }}>
          <div style={{ padding: 24 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
              <h4 style={{ margin: 0, fontFamily: "var(--font-display)" }}>Faculty directory</h4>
              <button onClick={() => setOpenB(true)} style={{ display: "flex", alignItems: "center", gap: 8, background: "transparent", border: "1px solid var(--surface-border)", padding: "8px 14px", fontSize: "0.74rem", fontFamily: "var(--font-body-bold)", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700, cursor: "pointer", color: "var(--text-primary)" }}>
                <LucideIcon name="filter" size={13} />
                Filter <span style={{ background: "var(--brand-primary)", color: "white", borderRadius: 10, padding: "1px 7px", fontSize: "0.66rem" }}>3</span>
              </button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} style={{ border: "1px solid var(--surface-border)", padding: 14 }}>
                  <div style={{ width: 40, height: 40, background: "var(--surface-sunken)", marginBottom: 10 }} />
                  <div style={{ fontSize: "0.86rem", fontWeight: 600 }}>{["Dr. Hernández","Dr. Park","Dr. Olawale","Dr. Aiyer","Dr. Whitfield","Dr. Chen"][i]}</div>
                  <div style={{ fontSize: "0.74rem", color: "var(--text-muted)" }}>Senior research scientist</div>
                </div>
              ))}
            </div>
          </div>

          <SideSheetModal
            open={openB}
            onClose={() => setOpenB(false)}
            eyebrow="Refine"
            title="Filter directory"
            footer={
              <>
                <button onClick={() => setOpenB(false)} style={{ background: "transparent", border: "1px solid var(--surface-border)", padding: "8px 16px", fontSize: "0.74rem", fontFamily: "var(--font-body-bold)", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700, cursor: "pointer", color: "var(--text-primary)" }}>Reset</button>
                <button onClick={() => setOpenB(false)} style={{ background: "var(--brand-primary)", color: "white", border: "none", padding: "8px 18px", fontSize: "0.74rem", fontFamily: "var(--font-body-bold)", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700, cursor: "pointer" }}>Apply (3)</button>
              </>
            }
            width={400}
          >
            <div style={{ marginBottom: 22 }}>
              <div style={{ fontSize: "0.66rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--text-muted)", fontFamily: "var(--font-body-bold)", marginBottom: 10 }}>Research area</div>
              {["Connected & autonomous", "Freight & logistics", "Pedestrian safety", "Public transit", "Infrastructure"].map((opt, i) => (
                <label key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", fontSize: "0.86rem", color: "var(--text-primary)", cursor: "pointer" }}>
                  <input type="checkbox" defaultChecked={i < 2} />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
            <div style={{ marginBottom: 22 }}>
              <div style={{ fontSize: "0.66rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--text-muted)", fontFamily: "var(--font-body-bold)", marginBottom: 10 }}>Title</div>
              {["Senior research scientist", "Research scientist", "Engineer", "Postdoctoral fellow"].map((opt, i) => (
                <label key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", fontSize: "0.86rem", color: "var(--text-primary)", cursor: "pointer" }}>
                  <input type="checkbox" defaultChecked={i === 0} />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
          </SideSheetModal>
        </div>
      </SCBox>

      <SCSectionLabel>Don't do this</SCSectionLabel>
      <CompareGoodBad
        goodTitle="Sheet for inspection / quick edit"
        goodWhy="Selecting a row opens a sheet with details. Reader stays in the list — context preserved, fast triage."
        badTitle="Sheet for primary navigation"
        badWhy="Using a sheet as the second-level nav means every click hides the list. Use vertical tabs or a sidebar instead."
        good={<div style={{ position: "relative", height: 200, background: "var(--surface-raised)", overflow: "hidden", border: "1px solid var(--surface-border)" }}>
          <div style={{ padding: 12, fontSize: "0.78rem", color: "var(--text-muted)" }}>List ← context preserved</div>
          <div style={{ position: "absolute", top: 0, right: 0, bottom: 0, width: 140, background: "var(--surface-base)", borderLeft: "1px solid var(--surface-border)", padding: 12, fontSize: "0.78rem" }}>Detail</div>
        </div>}
        bad={<div style={{ position: "relative", height: 200, background: "rgba(8,12,16,0.4)", overflow: "hidden", border: "1px solid var(--surface-border)" }}>
          <div style={{ padding: 12, fontSize: "0.78rem", color: "rgba(255,255,255,0.5)" }}>List ← obscured by scrim</div>
          <div style={{ position: "absolute", top: 0, right: 0, bottom: 0, width: 200, background: "var(--surface-base)", padding: 12, fontSize: "0.78rem" }}>Nav menu (wrong widget)</div>
        </div>}
      />

      <SCSectionLabel>Spec</SCSectionLabel>
      <SCSpecRow>
        <SCSpec label="Width" value="360–480px" note="Narrower for filters; wider for editing forms. Never wider than 50% viewport." />
        <SCSpec label="Header" value="Eyebrow + title + 36px rule" note="Same anatomy as a page header — rebrands the sheet as a focused micro-page." />
        <SCSpec label="Modal scrim" value="rgba(8,12,16,0.5)" note="With a 2px backdrop blur. Click scrim or Esc to dismiss." />
        <SCSpec label="Inline" value="No scrim" note="Permanent right rail in split-pane layouts. Border, not shadow." />
      </SCSpecRow>
    </PageShell>
  );
}

window.TabsHorizontalPage = TabsHorizontalPage;
window.TabsVerticalPage   = TabsVerticalPage;
window.SideSheetPage      = SideSheetPage;
window.UnderlineTabs      = UnderlineTabs;
window.SegmentedTabs      = SegmentedTabs;
window.PillTabs           = PillTabs;
window.VerticalTabs       = VerticalTabs;
window.SideSheetModal     = SideSheetModal;
window.SideSheetInline    = SideSheetInline;
