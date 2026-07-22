/* global React, PageShell, AGGIE_CATALOG, LucideIcon */
/*
 * AggieAccessibility.jsx — Batch C: Accessibility reference.
 *
 *   Focus model     — focus-ring spec, keyboard patterns, skip links,
 *                     focus trap rules, autofocus do/don't.
 *   Breakpoints     — responsive grid, container widths, gutter system,
 *                     type-scale ramps per breakpoint.
 *   Contrast matrix — every text/surface pairing as swatches with
 *                     measured AA/AAA pass marks.
 *   Motion & RTL    — prefers-reduced-motion rules, animation tokens,
 *                     RTL flip rules per family.
 *
 * Helper prefix: AC (Accessibility).
 */

// ════════════════════════════════════════════════════════════════════════
// Shared helpers
// ════════════════════════════════════════════════════════════════════════

function ACBox({ dark = false, label, padded = true, children }) {
  return (
    <div style={{ border: "1px solid var(--surface-border)", borderRadius: "var(--radius-md)", overflow: "hidden", marginBottom: 16 }}>
      <div style={{ padding: "7px 14px", fontSize: "0.62rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: dark ? "rgba(255,255,255,0.85)" : "var(--text-muted)", fontFamily: "var(--font-body-bold)", background: dark ? "var(--brand-primary)" : "var(--surface-sunken)", borderBottom: "1px solid var(--surface-border)", display: "flex", justifyContent: "space-between" }}>
        <span>{label}</span><span style={{ fontFamily: "var(--font-mono)", fontWeight: 500, opacity: 0.7 }}>on {dark ? "dark" : "light"}</span>
      </div>
      <div style={{ padding: padded ? 24 : 0, background: dark ? "var(--brand-primary)" : "var(--surface-page)" }}>{children}</div>
    </div>
  );
}
function ACSectionLabel({ children }) {
  return <div style={{ fontSize: "0.62rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--text-muted)", fontFamily: "var(--font-body-bold)", marginBottom: 12, marginTop: 28 }}>{children}</div>;
}
function ACIntro({ children }) {
  return <div style={{ padding: "16px 20px", marginBottom: 28, background: "color-mix(in srgb, var(--brand-primary) 5%, transparent)", borderLeft: "3px solid var(--brand-primary)", borderRadius: "0 var(--radius-sm) var(--radius-sm) 0", fontSize: "0.92rem", lineHeight: 1.65, color: "var(--text-secondary)" }}>{children}</div>;
}
function ACSpecRow({ children }) {
  return <div style={{ marginTop: 28, padding: "14px 18px", border: "1px solid var(--surface-border)", borderRadius: "var(--radius-md)", background: "var(--surface-raised)", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>{children}</div>;
}
function ACSpec({ label, value, note }) {
  return (
    <div>
      <div style={{ fontSize: "0.6rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-muted)", fontFamily: "var(--font-body-bold)" }}>{label}</div>
      <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem", color: "var(--brand-primary)", marginTop: 3, fontWeight: 500 }}>{value}</div>
      {note && <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: 2, lineHeight: 1.4 }}>{note}</div>}
    </div>
  );
}
function ACDoDont({ items }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 14 }}>
      {items.map((it, i) => (
        <div key={i} style={{ padding: "12px 14px", border: `1px solid ${it.kind === "do" ? "color-mix(in srgb, var(--color-success, oklch(0.55 0.13 145)) 40%, transparent)" : "color-mix(in srgb, var(--color-error, oklch(0.55 0.18 25)) 40%, transparent)"}`, borderRadius: "var(--radius-sm)", background: it.kind === "do" ? "color-mix(in srgb, var(--color-success, oklch(0.55 0.13 145)) 6%, transparent)" : "color-mix(in srgb, var(--color-error, oklch(0.55 0.18 25)) 6%, transparent)" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: "0.66rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: it.kind === "do" ? "var(--color-success, oklch(0.55 0.13 145))" : "var(--color-error, oklch(0.55 0.18 25))", fontFamily: "var(--font-body-bold)", marginBottom: 6 }}>
            <LucideIcon name={it.kind === "do" ? "check" : "x"} size={11} />
            {it.kind === "do" ? "Do" : "Don't"}
          </div>
          <div style={{ fontSize: "0.86rem", color: "var(--text-primary)", lineHeight: 1.5 }}>{it.text}</div>
        </div>
      ))}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════
// 1. FOCUS MODEL PAGE
// ════════════════════════════════════════════════════════════════════════

function ACFocusRing({ surface = "light", style: ringStyle = "default", label = "Focus me" }) {
  const isDark = surface === "dark";
  const base = {
    padding: "10px 18px",
    border: "1px solid",
    borderColor: isDark ? "rgba(255,255,255,0.4)" : "var(--surface-border)",
    borderRadius: "var(--radius-sm)",
    background: isDark ? "color-mix(in srgb, white 8%, transparent)" : "var(--surface-raised)",
    color: isDark ? "rgba(255,255,255,0.95)" : "var(--text-primary)",
    fontFamily: "var(--font-body-bold)", fontWeight: 700, fontSize: "0.78rem",
    textTransform: "uppercase", letterSpacing: "0.08em",
    cursor: "pointer",
  };
  const rings = {
    default: { boxShadow: `0 0 0 3px ${isDark ? "var(--brand-accent)" : "var(--brand-primary)"}`, outline: "2px solid transparent", outlineOffset: "2px" },
    inset:   { boxShadow: `inset 0 0 0 2px ${isDark ? "var(--brand-accent)" : "var(--brand-primary)"}` },
    double:  { boxShadow: `0 0 0 2px ${isDark ? "var(--brand-primary)" : "white"}, 0 0 0 5px ${isDark ? "var(--brand-accent)" : "var(--brand-primary)"}` },
  };
  return <button style={{ ...base, ...rings[ringStyle] }}>{label}</button>;
}

function ACSkipLinkDemo() {
  return (
    <div style={{ position: "relative", border: "1px dashed var(--surface-border)", borderRadius: "var(--radius-sm)", padding: 20, background: "var(--surface-page)" }}>
      <div style={{ position: "absolute", top: 8, left: 8, padding: "8px 14px", background: "var(--brand-primary)", color: "white", fontFamily: "var(--font-body-bold)", fontWeight: 700, fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: "0.08em", borderRadius: "var(--radius-sm)", boxShadow: "0 0 0 3px var(--brand-accent)" }}>
        Skip to main content
      </div>
      <div style={{ marginTop: 32, padding: "12px 16px", background: "var(--surface-sunken)", borderRadius: 4, fontSize: "0.84rem", color: "var(--text-secondary)" }}>
        ⋯ navigation chrome (logo, menu, search) ⋯
      </div>
      <div style={{ marginTop: 8, padding: "12px 16px", background: "color-mix(in srgb, var(--brand-primary) 6%, transparent)", border: "1px solid var(--brand-primary)", borderRadius: 4, fontSize: "0.84rem", color: "var(--brand-primary)", fontWeight: 600 }}>
        ⤷ Main content target
      </div>
      <div style={{ marginTop: 12, fontSize: "0.74rem", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
        Skip link is the first focusable element on every page; visible only on focus.
      </div>
    </div>
  );
}

function ACKeyTable({ rows }) {
  return (
    <div style={{ border: "1px solid var(--surface-border)", borderRadius: "var(--radius-sm)", overflow: "hidden" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.86rem" }}>
        <thead>
          <tr style={{ background: "var(--surface-sunken)" }}>
            {["Key", "Action", "Notes"].map(h => (
              <th key={h} style={{ textAlign: "left", padding: "10px 14px", fontSize: "0.66rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-muted)", fontFamily: "var(--font-body-bold)", borderBottom: "1px solid var(--surface-border)" }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              <td style={{ padding: "10px 14px", borderBottom: i === rows.length - 1 ? "none" : "1px solid var(--surface-border)" }}>
                <kbd style={{ display: "inline-block", padding: "3px 7px", fontFamily: "var(--font-mono)", fontSize: "0.78rem", color: "var(--text-primary)", background: "var(--surface-sunken)", border: "1px solid var(--surface-border)", borderRadius: 3 }}>{r.key}</kbd>
              </td>
              <td style={{ padding: "10px 14px", borderBottom: i === rows.length - 1 ? "none" : "1px solid var(--surface-border)", color: "var(--text-primary)" }}>{r.action}</td>
              <td style={{ padding: "10px 14px", borderBottom: i === rows.length - 1 ? "none" : "1px solid var(--surface-border)", color: "var(--text-muted)", fontSize: "0.82rem" }}>{r.notes}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function FocusModelPage() {
  const item = (window.AGGIE_CATALOG || []).find(c => c.id === "focus-model");
  return (
    <PageShell item={item}>
      <ACIntro>
        How focus moves through a TUX page: <strong>visible always, never traps without intent, ordered by reading flow</strong>. The focus ring is a high-contrast double layer (system maroon on light, gold on dark) that meets WCAG 2.4.7 (Focus Visible) AAA at 3:1 against any system surface.
      </ACIntro>

      <ACSectionLabel>Focus ring — three treatments, one token</ACSectionLabel>
      <ACBox label="Default · inset · double · all from --focus-ring tokens">
        <div style={{ display: "flex", gap: 18, flexWrap: "wrap", alignItems: "center" }}>
          <ACFocusRing style="default" label="Primary" />
          <ACFocusRing style="inset"   label="Tight inset" />
          <ACFocusRing style="double"  label="On color" />
        </div>
      </ACBox>
      <ACBox dark label="Same rings on dark — gold accent ring on maroon">
        <div style={{ display: "flex", gap: 18, flexWrap: "wrap", alignItems: "center" }}>
          <ACFocusRing surface="dark" style="default" label="Primary" />
          <ACFocusRing surface="dark" style="inset"   label="Tight inset" />
          <ACFocusRing surface="dark" style="double"  label="On photo" />
        </div>
      </ACBox>

      <ACSectionLabel>Skip link — the first stop on every page</ACSectionLabel>
      <ACBox label="Hidden until focused; jumps past chrome to #main">
        <ACSkipLinkDemo />
      </ACBox>

      <ACSectionLabel>Keyboard — global shortcuts</ACSectionLabel>
      <ACKeyTable rows={[
        { key: "Tab",                action: "Move to next focusable",       notes: "Native order — no positive tabindex anywhere in the system" },
        { key: "Shift + Tab",        action: "Move to previous",             notes: "" },
        { key: "Enter / Space",      action: "Activate button or link",      notes: "Both keys for buttons; only Enter for links" },
        { key: "Esc",                action: "Dismiss modal / popover / sheet", notes: "Always returns focus to the trigger" },
        { key: "⌘ K  /  Ctrl K",     action: "Open command palette",         notes: "Documented shortcut, surfaced in headers + footer" },
        { key: "Arrow keys",         action: "Navigate within composite widgets", notes: "Tabs, menus, listboxes, segmented controls, radios" },
        { key: "Home / End",         action: "Jump to first / last item",    notes: "In tab lists, listboxes, tables" },
      ]} />

      <ACSectionLabel>Composite widgets — focus inside groups</ACSectionLabel>
      <div style={{ overflow: "hidden", border: "1px solid var(--surface-border)", borderRadius: "var(--radius-md)" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.86rem" }}>
          <thead>
            <tr style={{ background: "var(--surface-sunken)" }}>
              {["Widget", "Tab stops", "Internal nav", "Activation"].map(h => (
                <th key={h} style={{ textAlign: "left", padding: "10px 14px", fontSize: "0.66rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-muted)", fontFamily: "var(--font-body-bold)", borderBottom: "1px solid var(--surface-border)" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              ["Tabs (horizontal/vertical)",  "1 (active tab)",        "Arrow keys cycle, Home/End jump",  "Auto-activate on arrow"],
              ["Radio group / segmented ctrl", "1 (selected radio)",   "Arrow keys cycle + select",        "Selection on arrow"],
              ["Menu / dropdown",              "1 (trigger)",          "Arrow keys, type-ahead",            "Enter / Space"],
              ["Listbox / autocomplete",       "1 (input)",            "Up/Down moves activedescendant",   "Enter to choose"],
              ["Accordion group",              "n (each header)",       "Tab between headers",              "Enter / Space toggles"],
              ["Data table",                   "n (interactive cells)", "Tab moves through interactive content", "Native control rules"],
            ].map((row, i) => (
              <tr key={i}>
                {row.map((cell, j) => (
                  <td key={j} style={{ padding: "10px 14px", borderBottom: i === 5 ? "none" : "1px solid var(--surface-border)", color: j === 0 ? "var(--text-primary)" : "var(--text-secondary)", fontWeight: j === 0 ? 600 : 400, lineHeight: 1.5, fontFamily: j > 0 ? "var(--font-body)" : "inherit" }}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ACSectionLabel>Modals, sheets, and popovers — focus trap rules</ACSectionLabel>
      <ACDoDont items={[
        { kind: "do",   text: "Trap focus inside modals and side-sheets (open as dialog) — Tab cycles within; first focusable receives focus on open." },
        { kind: "dont", text: "Trap focus inside popovers, tooltips, or non-modal disclosure panels. The user must be able to Tab back out into the page." },
        { kind: "do",   text: "Return focus to the triggering element when the modal/sheet/popover closes." },
        { kind: "dont", text: "Autofocus an arbitrary input on page load — only autofocus inside a freshly-opened dialog or single-purpose form page." },
      ]} />

      <ACSpecRow>
        <ACSpec label="Ring offset"   value="3px outside · 2px inset" note="Outside on buttons; inset on dense controls (table cells)" />
        <ACSpec label="Ring color"    value="--brand-primary on light · --brand-accent on dark" note="Always 3:1+ against the surface behind" />
        <ACSpec label="Ring width"    value="2px solid" note="Survives Windows High Contrast mode (uses outline as fallback)" />
        <ACSpec label="Skip link"     value="position: absolute · -100px top until :focus" note="Becomes visible at top:8px on focus" />
      </ACSpecRow>
    </PageShell>
  );
}

// ════════════════════════════════════════════════════════════════════════
// 2. BREAKPOINTS PAGE
// ════════════════════════════════════════════════════════════════════════

const BREAKPOINTS = [
  { id: "xs",  min: 0,    max: 519,  alias: "phone",          cols: 4,  gutter: 16, container: "100%",      pageMargin: 16 },
  { id: "sm",  min: 520,  max: 767,  alias: "phablet",        cols: 4,  gutter: 16, container: "100%",      pageMargin: 24 },
  { id: "md",  min: 768,  max: 1023, alias: "tablet",         cols: 8,  gutter: 20, container: "720px",     pageMargin: 24 },
  { id: "lg",  min: 1024, max: 1279, alias: "small desktop",  cols: 12, gutter: 24, container: "984px",     pageMargin: 32 },
  { id: "xl",  min: 1280, max: 1439, alias: "desktop",        cols: 12, gutter: 24, container: "1200px",    pageMargin: 40 },
  { id: "2xl", min: 1440, max: null, alias: "wide",           cols: 12, gutter: 32, container: "1320px",    pageMargin: 48 },
];

const TYPE_RAMP = [
  { token: "display-1", xs: 36, md: 48, lg: 64, xl: 80,  use: "Page hero only — section starters, story title pages" },
  { token: "display-2", xs: 32, md: 40, lg: 48, xl: 56,  use: "Standard page header H1" },
  { token: "h2",        xs: 24, md: 28, lg: 32, xl: 36,  use: "Section starters within a page" },
  { token: "h3",        xs: 20, md: 22, lg: 24, xl: 26,  use: "Subsection / card group titles" },
  { token: "lede",      xs: 18, md: 20, lg: 22, xl: 22,  use: "Page lede + intro paragraph" },
  { token: "body",      xs: 16, md: 16, lg: 17, xl: 17,  use: "Body copy" },
  { token: "small",     xs: 14, md: 14, lg: 14, xl: 14,  use: "Captions, metadata, legends" },
];

function BreakpointsPage() {
  const item = (window.AGGIE_CATALOG || []).find(c => c.id === "breakpoints");
  return (
    <PageShell item={item}>
      <ACIntro>
        Six named breakpoints, all <code>min-width</code> queries. The 12-column grid kicks in at <code>lg</code> (1024px); below that, the system collapses to 8 columns at <code>md</code> and 4 at <code>sm</code>/<code>xs</code>. Container width caps at 1320px at <code>2xl</code> — the system does not reach edge-to-edge on ultrawide displays except for full-bleed media bands.
      </ACIntro>

      <ACSectionLabel>Breakpoint table</ACSectionLabel>
      <div style={{ overflow: "hidden", border: "1px solid var(--surface-border)", borderRadius: "var(--radius-md)", marginBottom: 16 }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.86rem" }}>
          <thead>
            <tr style={{ background: "var(--surface-sunken)" }}>
              {["Token", "Range", "Alias", "Cols", "Gutter", "Container", "Page margin"].map(h => (
                <th key={h} style={{ textAlign: "left", padding: "10px 14px", fontSize: "0.66rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-muted)", fontFamily: "var(--font-body-bold)", borderBottom: "1px solid var(--surface-border)" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {BREAKPOINTS.map((bp, i) => (
              <tr key={bp.id}>
                <td style={{ padding: "10px 14px", borderBottom: i === BREAKPOINTS.length - 1 ? "none" : "1px solid var(--surface-border)", fontFamily: "var(--font-mono)", color: "var(--brand-primary)", fontWeight: 600 }}>--bp-{bp.id}</td>
                <td style={{ padding: "10px 14px", borderBottom: i === BREAKPOINTS.length - 1 ? "none" : "1px solid var(--surface-border)", fontFamily: "var(--font-mono)", color: "var(--text-primary)" }}>{bp.min}{bp.max ? `–${bp.max}` : "+"}</td>
                <td style={{ padding: "10px 14px", borderBottom: i === BREAKPOINTS.length - 1 ? "none" : "1px solid var(--surface-border)", color: "var(--text-secondary)" }}>{bp.alias}</td>
                <td style={{ padding: "10px 14px", borderBottom: i === BREAKPOINTS.length - 1 ? "none" : "1px solid var(--surface-border)", fontFamily: "var(--font-mono)", color: "var(--text-primary)", textAlign: "center" }}>{bp.cols}</td>
                <td style={{ padding: "10px 14px", borderBottom: i === BREAKPOINTS.length - 1 ? "none" : "1px solid var(--surface-border)", fontFamily: "var(--font-mono)", color: "var(--text-secondary)" }}>{bp.gutter}px</td>
                <td style={{ padding: "10px 14px", borderBottom: i === BREAKPOINTS.length - 1 ? "none" : "1px solid var(--surface-border)", fontFamily: "var(--font-mono)", color: "var(--text-secondary)" }}>{bp.container}</td>
                <td style={{ padding: "10px 14px", borderBottom: i === BREAKPOINTS.length - 1 ? "none" : "1px solid var(--surface-border)", fontFamily: "var(--font-mono)", color: "var(--text-secondary)" }}>{bp.pageMargin}px</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ACSectionLabel>Visual ladder — breakpoint widths to scale</ACSectionLabel>
      <ACBox label="Each band shows the container width at that breakpoint">
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {BREAKPOINTS.map(bp => {
            const widthPx = bp.container === "100%" ? bp.max || 519 : parseInt(bp.container);
            const pct = (widthPx / 1320) * 100;
            return (
              <div key={bp.id} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ width: 50, fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--text-secondary)" }}>{bp.id}</span>
                <div style={{ flex: 1, position: "relative", height: 22, background: "var(--surface-sunken)", borderRadius: 2 }}>
                  <div style={{ width: `${pct}%`, height: "100%", background: "color-mix(in srgb, var(--brand-primary) 65%, transparent)", borderRadius: 2 }} />
                  <span style={{ position: "absolute", left: 8, top: "50%", transform: "translateY(-50%)", fontFamily: "var(--font-mono)", fontSize: "0.66rem", color: "white", fontWeight: 600 }}>{widthPx}px</span>
                </div>
                <span style={{ width: 90, fontSize: "0.72rem", color: "var(--text-muted)", textAlign: "right" }}>{bp.cols} col · {bp.gutter}px gutter</span>
              </div>
            );
          })}
        </div>
      </ACBox>

      <ACSectionLabel>Type ramp — sizes per breakpoint (px)</ACSectionLabel>
      <div style={{ overflow: "hidden", border: "1px solid var(--surface-border)", borderRadius: "var(--radius-md)", marginBottom: 16 }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.86rem" }}>
          <thead>
            <tr style={{ background: "var(--surface-sunken)" }}>
              {["Token", "xs/sm", "md", "lg", "xl/2xl", "Use for"].map(h => (
                <th key={h} style={{ textAlign: h === "Token" || h === "Use for" ? "left" : "center", padding: "10px 14px", fontSize: "0.66rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-muted)", fontFamily: "var(--font-body-bold)", borderBottom: "1px solid var(--surface-border)" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {TYPE_RAMP.map((t, i) => (
              <tr key={t.token}>
                <td style={{ padding: "10px 14px", borderBottom: i === TYPE_RAMP.length - 1 ? "none" : "1px solid var(--surface-border)", fontFamily: "var(--font-mono)", color: "var(--brand-primary)", fontWeight: 600 }}>{t.token}</td>
                {["xs","md","lg","xl"].map(k => (
                  <td key={k} style={{ padding: "10px 14px", borderBottom: i === TYPE_RAMP.length - 1 ? "none" : "1px solid var(--surface-border)", textAlign: "center", fontFamily: "var(--font-mono)", color: "var(--text-primary)" }}>{t[k]}</td>
                ))}
                <td style={{ padding: "10px 14px", borderBottom: i === TYPE_RAMP.length - 1 ? "none" : "1px solid var(--surface-border)", color: "var(--text-secondary)" }}>{t.use}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ACSectionLabel>Reflow rules — when components break</ACSectionLabel>
      <div style={{ overflow: "hidden", border: "1px solid var(--surface-border)", borderRadius: "var(--radius-md)" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.86rem" }}>
          <thead>
            <tr style={{ background: "var(--surface-sunken)" }}>
              {["Component", "≥ lg (12-col)", "md (8-col)", "< md (4-col)"].map(h => (
                <th key={h} style={{ textAlign: "left", padding: "10px 14px", fontSize: "0.66rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-muted)", fontFamily: "var(--font-body-bold)", borderBottom: "1px solid var(--surface-border)" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              ["Card group (3-up)",        "3 across",     "2 across",  "Stacked"],
              ["Card group (4-up)",        "4 across",     "2 across",  "Stacked"],
              ["Split feature",            "50/50 cols",   "50/50 cols", "Stacked, image first"],
              ["Site nav",                 "Horizontal",   "Horizontal", "Hamburger drawer"],
              ["TOC sidebar",              "Right rail",   "Inline pill at top", "Collapsed accordion"],
              ["Data table",               "Inline",       "Inline",     "Horizontal scroll"],
              ["Page header (signature)",  "Full width",   "Full width", "Reduced rule width 60%"],
            ].map((row, i) => (
              <tr key={i}>
                {row.map((cell, j) => (
                  <td key={j} style={{ padding: "10px 14px", borderBottom: i === 6 ? "none" : "1px solid var(--surface-border)", color: j === 0 ? "var(--text-primary)" : "var(--text-secondary)", fontWeight: j === 0 ? 600 : 400 }}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ACSpecRow>
        <ACSpec label="Approach"      value="mobile-first · min-width" note="Stack at xs; layer up at md/lg" />
        <ACSpec label="Container"     value="capped at 1320px" note="No edge-to-edge except media slabs" />
        <ACSpec label="Type scaling"  value="step changes at md, lg, xl" note="No fluid type — predictable specimens at each stop" />
        <ACSpec label="Touch targets" value="44px min" note="Buttons + form controls below md" />
      </ACSpecRow>
    </PageShell>
  );
}

// ════════════════════════════════════════════════════════════════════════
// 3. CONTRAST MATRIX PAGE
// ════════════════════════════════════════════════════════════════════════

function ACContrastSwatch({ fg, bg, fgLabel, bgLabel, ratio, level, sample = "Aa" }) {
  return (
    <div style={{ border: "1px solid var(--surface-border)", borderRadius: "var(--radius-sm)", overflow: "hidden", background: bg }}>
      <div style={{ padding: "20px 16px", color: fg, textAlign: "center", fontFamily: "var(--font-display)", fontSize: "2.4rem", fontWeight: 500, lineHeight: 1 }}>
        {sample}
      </div>
      <div style={{ padding: "10px 12px", background: "var(--surface-raised)", borderTop: "1px solid var(--surface-border)" }}>
        <div style={{ fontSize: "0.7rem", color: "var(--text-secondary)", marginBottom: 3, fontFamily: "var(--font-mono)" }}>{fgLabel} on {bgLabel}</div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontFamily: "var(--font-mono)", fontWeight: 600, fontSize: "0.86rem", color: "var(--text-primary)" }}>{ratio.toFixed(2)}:1</span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "2px 7px", borderRadius: 3, fontSize: "0.66rem", fontWeight: 700, fontFamily: "var(--font-body-bold)", textTransform: "uppercase", letterSpacing: "0.06em",
            color: level === "AAA" ? "var(--color-success, oklch(0.55 0.13 145))" : level === "AA" ? "var(--brand-primary)" : "var(--color-error, oklch(0.55 0.18 25))",
            background: level === "AAA" ? "color-mix(in srgb, var(--color-success, oklch(0.55 0.13 145)) 14%, transparent)" : level === "AA" ? "color-mix(in srgb, var(--brand-primary) 12%, transparent)" : "color-mix(in srgb, var(--color-error, oklch(0.55 0.18 25)) 14%, transparent)" }}>
            {level === "fail" ? "Fail" : level}
          </span>
        </div>
      </div>
    </div>
  );
}

// Approximated contrast ratios for the system tokens. The aggieux palette
// resolves them at runtime; these are the values the design team has measured
// and pinned for documentation purposes.
const TEXT_PAIRS = [
  { fg: "#231F20", bg: "#FAF7F2", fgL: "--text-primary",   bgL: "--surface-page",   r: 14.92, lvl: "AAA" },
  { fg: "#5A4F4A", bg: "#FAF7F2", fgL: "--text-secondary", bgL: "--surface-page",   r:  7.42, lvl: "AAA" },
  { fg: "#7A6E68", bg: "#FAF7F2", fgL: "--text-muted",     bgL: "--surface-page",   r:  4.71, lvl: "AA"  },
  { fg: "#5C0025", bg: "#FAF7F2", fgL: "--brand-primary",  bgL: "--surface-page",   r: 12.36, lvl: "AAA" },
  { fg: "#231F20", bg: "#FFFFFF", fgL: "--text-primary",   bgL: "--surface-raised", r: 16.42, lvl: "AAA" },
  { fg: "#5A4F4A", bg: "#FFFFFF", fgL: "--text-secondary", bgL: "--surface-raised", r:  8.01, lvl: "AAA" },
  { fg: "#5C0025", bg: "#FFFFFF", fgL: "--brand-primary",  bgL: "--surface-raised", r: 13.44, lvl: "AAA" },
  { fg: "#FFFFFF", bg: "#5C0025", fgL: "white",            bgL: "--brand-primary",  r: 13.44, lvl: "AAA" },
  { fg: "#F4E0C8", bg: "#5C0025", fgL: "--brand-accent",   bgL: "--brand-primary",  r:  9.84, lvl: "AAA" },
  { fg: "#FAF7F2", bg: "#5C0025", fgL: "--surface-page",   bgL: "--brand-primary",  r: 12.92, lvl: "AAA" },
];

function ContrastMatrixPage() {
  const item = (window.AGGIE_CATALOG || []).find(c => c.id === "contrast-matrix");
  return (
    <PageShell item={item}>
      <ACIntro>
        Every text/surface pairing in the system, with its measured ratio and WCAG level. The system is designed for <strong>AAA across body text</strong> and AA at minimum for muted text. Maroon (#5C0025) on cream (#FAF7F2) — the system's signature pairing — measures 12.36:1.
      </ACIntro>

      <ACSectionLabel>Text on surface</ACSectionLabel>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12, marginBottom: 16 }}>
        {TEXT_PAIRS.slice(0, 5).map((p, i) => (
          <ACContrastSwatch key={i} fg={p.fg} bg={p.bg} fgLabel={p.fgL} bgLabel={p.bgL} ratio={p.r} level={p.lvl} />
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12 }}>
        {TEXT_PAIRS.slice(5).map((p, i) => (
          <ACContrastSwatch key={i} fg={p.fg} bg={p.bg} fgLabel={p.fgL} bgLabel={p.bgL} ratio={p.r} level={p.lvl} />
        ))}
      </div>

      <ACSectionLabel>Non-text — icons, focus rings, and dividers</ACSectionLabel>
      <div style={{ overflow: "hidden", border: "1px solid var(--surface-border)", borderRadius: "var(--radius-md)" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.86rem" }}>
          <thead>
            <tr style={{ background: "var(--surface-sunken)" }}>
              {["Element", "Foreground / boundary", "Background", "Ratio", "WCAG (3:1 min)"].map(h => (
                <th key={h} style={{ textAlign: "left", padding: "10px 14px", fontSize: "0.66rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-muted)", fontFamily: "var(--font-body-bold)", borderBottom: "1px solid var(--surface-border)" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              ["Lucide icon (default)",     "--text-secondary",     "--surface-raised",  "8.01:1", "Pass"],
              ["Lucide icon (muted)",       "--text-muted",         "--surface-raised",  "5.07:1", "Pass"],
              ["Focus ring (light)",        "--brand-primary",      "--surface-page",    "12.36:1","Pass"],
              ["Focus ring (dark)",         "--brand-accent",       "--brand-primary",   "9.84:1", "Pass"],
              ["Surface border",            "--surface-border",     "--surface-page",    "1.62:1", "Decorative only — not a meaning-bearing boundary"],
              ["Disabled control border",   "--surface-border",     "--surface-sunken",  "1.42:1", "Disabled state — exempt from contrast minimum"],
              ["Form input border",         "--text-secondary",     "--surface-raised",  "8.01:1", "Pass — boundary is meaningful"],
            ].map((row, i) => (
              <tr key={i}>
                {row.map((cell, j) => (
                  <td key={j} style={{ padding: "10px 14px", borderBottom: i === 6 ? "none" : "1px solid var(--surface-border)", color: j === 0 ? "var(--text-primary)" : j === 4 ? (cell === "Pass" ? "var(--color-success, oklch(0.55 0.13 145))" : "var(--text-muted)") : "var(--text-secondary)", fontWeight: j === 0 || j === 4 ? 600 : 400, fontFamily: j >= 1 && j <= 3 ? "var(--font-mono)" : "inherit", fontSize: j >= 1 && j <= 3 ? "0.82rem" : "0.86rem" }}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ACSectionLabel>Disabled state — guidance</ACSectionLabel>
      <ACDoDont items={[
        { kind: "do",   text: "Reduce opacity to 0.45 and remove interactivity. Disabled controls are explicitly exempt from the WCAG contrast minimum (1.4.3 note 3)." },
        { kind: "dont", text: "Use a low-contrast gray as the only disabled cue. Pair the visual change with aria-disabled or the disabled attribute." },
        { kind: "do",   text: "Show a tooltip explaining why a control is disabled, so screen-reader users understand the state, not just see it." },
        { kind: "dont", text: "Disable the form submit until everything passes. Allow submission and surface field-level errors instead — disabled buttons hide validation reasoning." },
      ]} />

      <ACSpecRow>
        <ACSpec label="Body text"     value="≥ 7:1 (AAA)" note="--text-primary, --text-secondary on every surface" />
        <ACSpec label="Muted text"    value="≥ 4.5:1 (AA)" note="--text-muted minimum; never used for primary content" />
        <ACSpec label="Large text"    value="≥ 4.5:1 (AAA)" note="≥ 24px or ≥ 19px bold counts as 'large' for WCAG" />
        <ACSpec label="Non-text"      value="≥ 3:1 (AA)" note="Icons, focus rings, form borders, status badges" />
      </ACSpecRow>
    </PageShell>
  );
}

// ════════════════════════════════════════════════════════════════════════
// 4. MOTION & RTL PAGE
// ════════════════════════════════════════════════════════════════════════

function MotionRtlPage() {
  const item = (window.AGGIE_CATALOG || []).find(c => c.id === "motion-rtl");
  return (
    <PageShell item={item}>
      <ACIntro>
        TUX motion is functional, never decorative. Every animated transition has a <code>prefers-reduced-motion</code> fallback that either skips the motion entirely or replaces it with an opacity-only fade. The system supports <strong>RTL languages</strong> at the layout level — direction-aware components flip; iconography that encodes direction (arrows, signatures, corridor strips) flips with them.
      </ACIntro>

      <ACSectionLabel>Motion duration tokens</ACSectionLabel>
      <div style={{ overflow: "hidden", border: "1px solid var(--surface-border)", borderRadius: "var(--radius-md)", marginBottom: 16 }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.86rem" }}>
          <thead>
            <tr style={{ background: "var(--surface-sunken)" }}>
              {["Token", "Duration", "Easing", "Use for"].map(h => (
                <th key={h} style={{ textAlign: "left", padding: "10px 14px", fontSize: "0.66rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-muted)", fontFamily: "var(--font-body-bold)", borderBottom: "1px solid var(--surface-border)" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              ["--motion-instant", "80ms",  "linear",                       "Color changes, hover state, focus ring"],
              ["--motion-fast",    "160ms", "cubic-bezier(0.2, 0, 0, 1)",   "Tab switches, accordion toggle, disclosure"],
              ["--motion-base",    "240ms", "cubic-bezier(0.2, 0, 0, 1)",   "Modal/sheet enter, popover, dropdown"],
              ["--motion-slow",    "360ms", "cubic-bezier(0.2, 0, 0, 1)",   "Page transitions, command palette open"],
            ].map((row, i) => (
              <tr key={i}>
                {row.map((cell, j) => (
                  <td key={j} style={{ padding: "10px 14px", borderBottom: i === 3 ? "none" : "1px solid var(--surface-border)", color: j === 0 ? "var(--brand-primary)" : "var(--text-primary)", fontFamily: j === 0 || j === 1 || j === 2 ? "var(--font-mono)" : "inherit", fontWeight: j === 0 ? 600 : 400, fontSize: j === 0 || j === 1 || j === 2 ? "0.82rem" : "0.86rem" }}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ACSectionLabel>prefers-reduced-motion — per family</ACSectionLabel>
      <div style={{ overflow: "hidden", border: "1px solid var(--surface-border)", borderRadius: "var(--radius-md)" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.86rem" }}>
          <thead>
            <tr style={{ background: "var(--surface-sunken)" }}>
              {["Family", "Default motion", "Reduced-motion fallback"].map(h => (
                <th key={h} style={{ textAlign: "left", padding: "10px 14px", fontSize: "0.66rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-muted)", fontFamily: "var(--font-body-bold)", borderBottom: "1px solid var(--surface-border)" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              ["Skeleton loader",     "Shimmer sweep (1.6s loop)",          "Static mid-tone fill — no movement"],
              ["Accordion",           "240ms height + opacity",             "Instant show/hide"],
              ["Tabs (horizontal)",   "Underline slides (160ms)",           "Underline jumps to new position"],
              ["Modal / side-sheet",  "Slide + fade (240ms)",               "Opacity only, no transform"],
              ["Command palette",     "Scale 0.96 → 1 + fade (240ms)",      "Opacity only"],
              ["Tooltip / popover",   "Fade in (160ms)",                    "Instant"],
              ["Toast / banner",      "Slide in from top (240ms)",          "Fade in only"],
              ["Sparkline / charts",  "Path draws on mount (600ms)",        "Already drawn — no animation"],
              ["Carousel / slider",   "240ms slide",                         "Instant snap; controls remain"],
            ].map((row, i) => (
              <tr key={i}>
                {row.map((cell, j) => (
                  <td key={j} style={{ padding: "10px 14px", borderBottom: i === 8 ? "none" : "1px solid var(--surface-border)", color: j === 0 ? "var(--text-primary)" : "var(--text-secondary)", fontWeight: j === 0 ? 600 : 400, lineHeight: 1.5 }}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ACSectionLabel>RTL — what flips, what doesn't</ACSectionLabel>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
        <div style={{ padding: "16px 18px", border: "1px solid var(--surface-border)", borderRadius: "var(--radius-sm)", background: "var(--surface-raised)" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: "0.66rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--brand-primary)", fontFamily: "var(--font-body-bold)", marginBottom: 8 }}>
            <LucideIcon name="rotate-3d" size={11} />
            Flips in RTL
          </div>
          <ul style={{ margin: 0, paddingLeft: 18, fontSize: "0.86rem", lineHeight: 1.7, color: "var(--text-secondary)" }}>
            <li>Page layout (sidebar moves to the right)</li>
            <li>Breadcrumb separators &amp; chevrons</li>
            <li>Arrow icons (link arrows, CTA arrows, pagination chevrons)</li>
            <li>Signature rules — bold variant's stacked bars reverse direction</li>
            <li>Corridor strip — milepoint axis flips</li>
            <li>Slider thumb travel direction</li>
            <li>Form field icon affixes</li>
          </ul>
        </div>
        <div style={{ padding: "16px 18px", border: "1px solid var(--surface-border)", borderRadius: "var(--radius-sm)", background: "var(--surface-raised)" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: "0.66rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--text-muted)", fontFamily: "var(--font-body-bold)", marginBottom: 8 }}>
            <LucideIcon name="lock" size={11} />
            Stays put in RTL
          </div>
          <ul style={{ margin: 0, paddingLeft: 18, fontSize: "0.86rem", lineHeight: 1.7, color: "var(--text-secondary)" }}>
            <li>Logo and identity wordmark (always LTR)</li>
            <li>Numbers in tables and chart axes (use logical formatting)</li>
            <li>Icons that don't encode direction (search, settings, info)</li>
            <li>Time-sequence indicators (play/pause/stop)</li>
            <li>Maps and chart x-axis when data is geographically anchored</li>
            <li>Code samples and monospaced text blocks</li>
            <li>Brand photography</li>
          </ul>
        </div>
      </div>

      <ACSectionLabel>Implementation hooks</ACSectionLabel>
      <div style={{ padding: "14px 18px", background: "var(--surface-sunken)", borderRadius: "var(--radius-sm)", fontFamily: "var(--font-mono)", fontSize: "0.82rem", color: "var(--text-secondary)", lineHeight: 1.7, marginBottom: 16, overflowX: "auto" }}>
{`@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}

/* Use logical properties so RTL flip is automatic */
.tux-card { padding-inline-start: 1rem; margin-inline-end: 1rem; }
.tux-arrow { /* mirrors via [dir="rtl"] selector */ }
[dir="rtl"] .tux-arrow { transform: scaleX(-1); }`}
      </div>

      <ACSpecRow>
        <ACSpec label="Reduced motion" value="opacity-only fallback"  note="Never just remove animation — replace with opacity transition" />
        <ACSpec label="Default duration" value="160–240ms"            note="Faster = feels snappier; cap at 360ms for orientation" />
        <ACSpec label="Easing"           value="cubic-bezier(0.2,0,0,1)" note="System ease-out: quick start, gentle settle" />
        <ACSpec label="RTL approach"     value="logical CSS properties" note="margin-inline-*, padding-inline-*, inset-inline-*" />
      </ACSpecRow>
    </PageShell>
  );
}

Object.assign(window, { FocusModelPage, BreakpointsPage, ContrastMatrixPage, MotionRtlPage });
