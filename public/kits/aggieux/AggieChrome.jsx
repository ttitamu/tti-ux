/* global React, LucideIcon */
/*
 * AggieChrome.jsx — layout scaffolding for the AggieUX reference kit.
 *
 * Two-pane layout: left sidebar (grouped families) + main content.
 * The header sits above both and includes a product tag + search stub.
 */

const { useState: _cUseState, useMemo: _cUseMemo, useEffect: _cUseEffect, useRef: _cUseRef } = React;

// Sidebar group order. Catalog entries can use any `page` value; new groups
// land at the end of this list (alphabetical fallback) so adding one is safe
// without touching this file. Reorder here when a group's priority changes.
const SIDEBAR_PAGE_ORDER = [
  "Foundations",
  "Status",
  "Navigation",
  "Components",
  "Sectioning",
  "Specialized",
  "Overlays",
  "Data viz",
  "Accessibility",
  "Templates",
];

// Groups that start collapsed by default. Foundations stays open so the kit
// has an obvious entry point on first load.
const SIDEBAR_DEFAULT_OPEN = new Set(["Foundations"]);

// ─── AggieHeader ────────────────────────────────────────────────────────────
function AggieHeader({ theme, onSetTheme, themes }) {
  return (
    <header style={{ position: "sticky", top: 0, zIndex: 20, background: "color-mix(in srgb, var(--surface-raised) 94%, transparent)", borderBottom: "1px solid var(--surface-border)", backdropFilter: "blur(6px)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 24, padding: "12px 28px", maxWidth: "100%" }}>
        <a href="#" onClick={(e) => e.preventDefault()} style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", color: "inherit" }}>
          <img src="../../assets/logo.svg" width="28" height="28" alt="" />
          <div>
            <div style={{ fontSize: "0.88rem", fontWeight: 700, letterSpacing: "0.01em" }}>
              tux <span style={{ color: "var(--text-muted)", fontWeight: 400 }}>·</span> aggieux reference
            </div>
            <div style={{ fontSize: "0.6rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "var(--tracking-wider)", marginTop: 1 }}>
              editorial component library · v1.7 source
            </div>
          </div>
        </a>

        <span style={{ fontSize: "0.68rem", padding: "3px 8px", borderRadius: 3, background: "color-mix(in srgb, var(--brand-accent) 20%, transparent)", color: "var(--brand-primary)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em" }}>
          Reference only
        </span>

        <div style={{ flex: 1 }} />

        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 10px", background: "var(--surface-sunken)", borderRadius: "var(--radius-md)", minWidth: 240 }}>
          <LucideIcon name="search" size={13} />
          <input
            placeholder="Search components…"
            style={{ flex: 1, border: "none", background: "transparent", outline: "none", fontSize: "0.8rem", fontFamily: "inherit", color: "var(--text-primary)" }}
          />
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", color: "var(--text-muted)", background: "var(--surface-raised)", padding: "2px 5px", borderRadius: 3, border: "1px solid var(--surface-border)" }}>⌘K</span>
        </div>

        <div role="radiogroup" aria-label="Theme" style={{ display: "inline-flex", padding: 3, background: "var(--surface-sunken)", borderRadius: "var(--radius-md)", border: "1px solid var(--surface-border)" }}>
          {themes.map(t => {
            const active = t.id === theme;
            return (
              <button
                key={t.id}
                role="radio"
                aria-checked={active}
                aria-label={t.label}
                onClick={() => onSetTheme(t.id)}
                title={t.label}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 6,
                  padding: "5px 10px", border: "none", cursor: "pointer",
                  background: active ? "var(--surface-raised)" : "transparent",
                  color: active ? "var(--brand-primary)" : "var(--text-secondary)",
                  fontFamily: "var(--font-body-bold)", fontWeight: 700,
                  fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.08em",
                  borderRadius: "calc(var(--radius-md) - 3px)",
                  boxShadow: active ? "var(--shadow-sm)" : "none",
                  transition: "background 120ms, color 120ms",
                }}
              >
                <LucideIcon name={t.icon} size={12} />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}

// ─── AggieSidebar ───────────────────────────────────────────────────────────
function AggieSidebar({ route, onNavigate }) {
  const catalog = window.AGGIE_CATALOG || [];
  const groups = _cUseMemo(() => {
    const map = new Map();
    for (const item of catalog) {
      if (!map.has(item.page)) map.set(item.page, []);
      map.get(item.page).push(item);
    }
    const entries = [...map.entries()];
    // Sort by SIDEBAR_PAGE_ORDER; unknown groups fall to the end alphabetically.
    entries.sort(([a], [b]) => {
      const ai = SIDEBAR_PAGE_ORDER.indexOf(a);
      const bi = SIDEBAR_PAGE_ORDER.indexOf(b);
      if (ai === -1 && bi === -1) return a.localeCompare(b);
      if (ai === -1) return 1;
      if (bi === -1) return -1;
      return ai - bi;
    });
    return entries;
  }, [catalog]);

  // Find which group contains the active route — that group always opens.
  const activeGroup = _cUseMemo(() => {
    for (const [page, items] of groups) {
      if (items.some(i => i.id === route)) return page;
    }
    return null;
  }, [groups, route]);

  // Open/closed state per group. Persists to localStorage so the user's
  // preference survives reloads. Defaults: Foundations open + active group.
  const [openGroups, setOpenGroups] = _cUseState(() => {
    let saved = {};
    try {
      const raw = localStorage.getItem("aggieux:sidebarOpen");
      if (raw) saved = JSON.parse(raw);
    } catch (e) { /* ignore */ }
    const init = {};
    for (const [page] of groups) {
      init[page] = saved[page] != null ? saved[page] : SIDEBAR_DEFAULT_OPEN.has(page);
    }
    return init;
  });

  // Whenever the active route changes, force its group open (without
  // collapsing anything else the user has already opened).
  _cUseEffect(() => {
    if (!activeGroup) return;
    setOpenGroups((prev) => prev[activeGroup] ? prev : { ...prev, [activeGroup]: true });
  }, [activeGroup]);

  const toggleGroup = (page) => {
    setOpenGroups((prev) => {
      const next = { ...prev, [page]: !prev[page] };
      try { localStorage.setItem("aggieux:sidebarOpen", JSON.stringify(next)); } catch (e) { /* ignore */ }
      return next;
    });
  };

  const expandAll = () => {
    const next = {};
    for (const [page] of groups) next[page] = true;
    setOpenGroups(next);
    try { localStorage.setItem("aggieux:sidebarOpen", JSON.stringify(next)); } catch (e) { /* ignore */ }
  };
  const collapseAll = () => {
    const next = {};
    for (const [page] of groups) next[page] = false;
    if (activeGroup) next[activeGroup] = true; // never hide the active route
    setOpenGroups(next);
    try { localStorage.setItem("aggieux:sidebarOpen", JSON.stringify(next)); } catch (e) { /* ignore */ }
  };

  // Auto-scroll the active sidebar item into view on route change. Only scrolls
  // when the active item is outside the visible viewport — avoids jitter on
  // every nav click.
  const asideRef = _cUseRef(null);
  _cUseEffect(() => {
    if (!route || !asideRef.current) return;
    const active = asideRef.current.querySelector(`a[data-route="${route}"]`);
    if (!active) return;
    const aside = asideRef.current;
    const aTop = active.offsetTop;
    const aBottom = aTop + active.offsetHeight;
    const sTop = aside.scrollTop;
    const sBottom = sTop + aside.clientHeight;
    if (aTop < sTop + 40 || aBottom > sBottom - 40) {
      aside.scrollTo({ top: aTop - aside.clientHeight / 2 + active.offsetHeight / 2, behavior: "smooth" });
    }
  }, [route, openGroups]);

  return (
    <aside ref={asideRef} style={{ width: 264, borderRight: "1px solid var(--surface-border)", background: "var(--surface-raised)", height: "calc(100vh - 61px)", position: "sticky", top: 61, overflowY: "auto" }}>
      {/* Expand/collapse-all controls */}
      <div style={{ display: "flex", gap: 6, padding: "14px 20px 8px", borderBottom: "1px solid var(--surface-border)", marginBottom: 10 }}>
        <button onClick={expandAll} style={sidebarBtn}>Expand all</button>
        <button onClick={collapseAll} style={sidebarBtn}>Collapse all</button>
      </div>
      <nav style={{ padding: "0 0 40px" }}>
        {groups.map(([page, items]) => {
          const isOpen = !!openGroups[page];
          const readyCount = items.filter(i => i.status === "ready").length;
          return (
            <div key={page} style={{ marginBottom: 4 }}>
              <button
                onClick={() => toggleGroup(page)}
                aria-expanded={isOpen}
                style={{
                  width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "8px 20px", border: "none", background: "transparent", cursor: "pointer",
                  fontSize: "0.64rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.11em",
                  color: "var(--text-muted)", fontFamily: "var(--font-body-bold)",
                  textAlign: "left",
                }}
              >
                <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                  <span style={{ display: "inline-block", width: 8, transition: "transform 120ms", transform: isOpen ? "rotate(90deg)" : "rotate(0deg)", color: "var(--text-muted)", fontSize: "0.7rem", lineHeight: 1 }}>▸</span>
                  {page}
                </span>
                <span style={{ fontFamily: "var(--font-mono)", fontWeight: 500, opacity: 0.65, fontSize: "0.62rem", letterSpacing: 0, textTransform: "none" }}>
                  {readyCount}/{items.length}
                </span>
              </button>
              {isOpen && items.map((item) => {
                const active = route === item.id;
                return (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    data-route={item.id}
                    onClick={(e) => { e.preventDefault(); onNavigate(item.id); }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 10,
                      padding: "7px 20px 7px 36px",
                      fontSize: "0.82rem",
                      fontWeight: active ? 600 : 400,
                      color: active ? "var(--brand-primary)" : "var(--text-secondary)",
                      background: active ? "color-mix(in srgb, var(--brand-primary) 6%, transparent)" : "transparent",
                      borderLeft: active ? "3px solid var(--brand-primary)" : "3px solid transparent",
                      textDecoration: "none",
                      transition: "background 120ms, color 120ms",
                    }}
                  >
                    <span>{item.label}</span>
                    {item.status === "ready" && (
                      <span style={{ fontSize: "0.6rem", color: "var(--color-success)", fontFamily: "var(--font-mono)" }}>●</span>
                    )}
                    {item.status === "in-progress" && (
                      <span style={{ fontSize: "0.6rem", color: "var(--brand-accent)", fontFamily: "var(--font-mono)" }}>◐</span>
                    )}
                  </a>
                );
              })}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}

const sidebarBtn = {
  flex: 1,
  padding: "5px 8px",
  fontSize: "0.62rem",
  fontWeight: 600,
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  color: "var(--text-secondary)",
  background: "var(--surface-sunken)",
  border: "1px solid var(--surface-border)",
  borderRadius: "var(--radius-sm)",
  cursor: "pointer",
  fontFamily: "var(--font-body-bold)",
};

// ─── PageShell — consistent header + intro for every component page ────────
function PageShell({ item, darkPreview, children }) {
  if (!item) return null;
  return (
    <div style={{ padding: "40px 48px 80px", maxWidth: 1060 }}>
      <div style={{ fontSize: "0.68rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.11em", color: "var(--text-muted)", fontFamily: "var(--font-body-bold)", marginBottom: 10 }}>
        {item.page} · {item.id}
      </div>
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: "2.4rem", fontWeight: 500, letterSpacing: "0.01em", margin: "0 0 14px", textTransform: "uppercase" }}>
        {item.label}
      </h1>
      <p style={{ fontSize: "1rem", lineHeight: 1.6, color: "var(--text-secondary)", maxWidth: 720, margin: "0 0 18px" }}>
        {item.blurb}
      </p>

      <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 8, marginBottom: 32, paddingBottom: 20, borderBottom: "1px solid var(--surface-border)" }}>
        <StatusChip status={item.status} />
        {item.styles && item.styles.length > 0 && <StyleChips styles={item.styles} />}
        {item.darkMode && <MetaChip icon="moon">Dark mode variant</MetaChip>}
        {item.figma && <MetaChip icon="figma">figma: <code>{item.figma.replace(/^\//, "")}</code></MetaChip>}
      </div>

      {children || <ScaffoldPlaceholder item={item} darkPreview={darkPreview} />}
    </div>
  );
}

function StatusChip({ status }) {
  const map = {
    scaffold:     { label: "Scaffold",     color: "var(--text-muted)",       bg: "var(--surface-sunken)" },
    "in-progress":{ label: "In progress",  color: "var(--brand-accent)",     bg: "color-mix(in srgb, var(--brand-accent) 14%, transparent)" },
    ready:        { label: "Ready",        color: "var(--color-success)",    bg: "color-mix(in srgb, var(--color-success) 14%, transparent)" },
  };
  const s = map[status] || map.scaffold;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 10px", borderRadius: "var(--radius-sm)", fontSize: "0.72rem", fontWeight: 600, color: s.color, background: s.bg, textTransform: "uppercase", letterSpacing: "0.05em" }}>
      {s.label}
    </span>
  );
}

function StyleChips({ styles }) {
  const colorFor = (s) => s === "default" ? "var(--text-secondary)" : s === "bold" ? "var(--brand-primary)" : "var(--brand-accent-deep, #8B6914)";
  return (
    <>
      {styles.map((s) => (
        <span key={s} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 10px", borderRadius: "var(--radius-sm)", fontSize: "0.72rem", fontWeight: 500, color: colorFor(s), background: "var(--surface-raised)", border: "1px solid var(--surface-border)", fontFamily: "var(--font-mono)" }}>
          {s}
        </span>
      ))}
    </>
  );
}

function MetaChip({ icon, children }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 10px", borderRadius: "var(--radius-sm)", fontSize: "0.72rem", color: "var(--text-secondary)", background: "transparent" }}>
      <LucideIcon name={icon} size={12} />
      <span>{children}</span>
    </span>
  );
}

// ─── ScaffoldPlaceholder — the "not built yet" state for each page ─────────
function ScaffoldPlaceholder({ item, darkPreview }) {
  const styles = item.styles && item.styles.length ? item.styles : ["default"];
  return (
    <div>
      <div style={{ padding: "18px 20px", marginBottom: 24, background: "color-mix(in srgb, var(--brand-accent) 8%, transparent)", border: "1px solid color-mix(in srgb, var(--brand-accent) 30%, transparent)", borderRadius: "var(--radius-md)", display: "flex", alignItems: "flex-start", gap: 12 }}>
        <LucideIcon name="hammer" size={16} />
        <div style={{ fontSize: "0.85rem", lineHeight: 1.55, color: "var(--text-primary)" }}>
          <strong>Not built yet.</strong> This page is scaffolded — placeholders for each {styles.length === 1 ? "variant" : `of the ${styles.length} style variants`}
          {item.darkMode ? ", plus an On Dark=True mirror" : ""} — will land here in a future pass.
          {item.figma && <> Source of truth: Figma path <code>{item.figma}</code>.</>}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(styles.length, 3)}, minmax(0, 1fr))`, gap: 24 }}>
        {styles.map((s) => (
          <StyleTile key={s} style={s} label={item.label} />
        ))}
      </div>

      {item.darkMode && (
        <>
          <div style={{ marginTop: 40, marginBottom: 14, fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.11em", color: "var(--text-muted)", fontFamily: "var(--font-body-bold)" }}>
            On dark
          </div>
          <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(styles.length, 3)}, minmax(0, 1fr))`, gap: 24 }}>
            {styles.map((s) => (
              <StyleTile key={s + "-dark"} style={s} label={item.label} onDark />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function StyleTile({ style, label, onDark }) {
  const accentFor = () => {
    if (style === "bold")    return "var(--brand-primary)";
    if (style === "elegant") return "var(--brand-accent)";
    return "var(--text-secondary)";
  };
  const pattern = () => {
    if (style === "bold") {
      return { backgroundImage: "repeating-linear-gradient(90deg, currentColor 0 3px, transparent 3px 10px)", height: 3, color: "var(--brand-primary)" };
    }
    if (style === "elegant") {
      return { backgroundImage: "repeating-linear-gradient(135deg, currentColor 0 1.5px, transparent 1.5px 8px)", height: 2, color: "var(--brand-accent)" };
    }
    return { background: "currentColor", height: 1, color: "var(--text-secondary)" };
  };
  const bg = onDark ? "var(--brand-primary)" : "var(--surface-raised)";
  const border = onDark ? "1px solid color-mix(in srgb, #fff 20%, transparent)" : "1px solid var(--surface-border)";
  const textColor = onDark ? "#fff" : "var(--text-primary)";
  const mutedColor = onDark ? "color-mix(in srgb, #fff 65%, transparent)" : "var(--text-muted)";
  const fontFamily = style === "elegant" ? "var(--font-elegant, Georgia, serif)" : style === "bold" ? "var(--font-body-bold)" : "var(--font-body)";

  return (
    <div style={{ background: bg, border, borderRadius: "var(--radius-md)", padding: "24px 22px", minHeight: 180, display: "flex", flexDirection: "column", gap: 14, position: "relative", overflow: "hidden" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: "0.62rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.11em", color: mutedColor, fontFamily: "var(--font-body-bold)" }}>
          style={style}
        </span>
        <span style={{ fontSize: "0.62rem", color: mutedColor, fontFamily: "var(--font-mono)" }}>
          {onDark ? "on dark" : "on light"}
        </span>
      </div>

      <div>
        <div style={{ ...pattern(), width: 48, marginBottom: 12 }} />
        <div style={{ fontFamily, fontSize: "1.2rem", fontWeight: style === "bold" ? 700 : style === "elegant" ? 400 : 500, fontStyle: style === "elegant" ? "italic" : "normal", color: textColor, lineHeight: 1.2 }}>
          {label}
        </div>
        <div style={{ fontSize: "0.82rem", color: mutedColor, marginTop: 6, lineHeight: 1.5 }}>
          Placeholder preview — replace with actual component mock in the next pass.
        </div>
      </div>

      <div style={{ flex: 1 }} />

      <div style={{ display: "flex", gap: 8, alignItems: "center", paddingTop: 12, borderTop: `1px dashed ${onDark ? "color-mix(in srgb, #fff 20%, transparent)" : "var(--surface-border)"}` }}>
        <span style={{ width: 8, height: 8, borderRadius: "50%", background: accentFor() }} />
        <span style={{ fontSize: "0.7rem", color: mutedColor, fontFamily: "var(--font-mono)" }}>
          accent · {style}
        </span>
      </div>
    </div>
  );
}

Object.assign(window, { AggieHeader, AggieSidebar, PageShell, ScaffoldPlaceholder, StatusChip, StyleChips });
