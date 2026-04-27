/* global React, PageShell, LucideIcon, AGGIE_CATALOG */
/*
 * AggieMenus.jsx — the Menus component family.
 *
 * AggieUX splits "menu" into several distinct patterns. We collect them here:
 *
 *   1. Sidebar menu        — in-page left-rail nav for a section, with "back to parent" link
 *   2. In-page nav menu    — sticky on-this-page anchor list, numbered/rule-separated
 *   3. Dropdown menu       — site-header top-nav dropdown (AggieUX v2.0)
 *   4. Mega menu           — site-header expanded panel (AggieUX v2.0)
 *
 * Each has on-light + on-dark variants.
 */

function MenusPage() {
  const item = (window.AGGIE_CATALOG || []).find(c => c.id === "menus");
  return (
    <PageShell item={item}>
      <MenusIntro>
        The Menus family covers four distinct patterns. <strong>Sidebar menu</strong> and <strong>in-page nav</strong> are for content-level wayfinding inside a section or article. <strong>Dropdown</strong> and <strong>mega menu</strong> (new in AggieUX v2.0) are for site-level navigation in the header, and pair with either lockup identity or text identity for four navigation combinations total.
      </MenusIntro>

      {/* ── Sidebar menu ─────────────────────────────────────────── */}
      <PatternHeading eyebrow="01 · section wayfinding" title="Sidebar menu" sub="Left-rail navigation for a content section. Heavy 3px border, monospace-friendly hit areas, sits alongside body copy." />
      <DualPreview light={<SidebarMenu dark={false} />} dark={<SidebarMenu dark={true} />} />
      <SpecRow>
        <SpecItem label="Border" value="3px solid" note="maroon on light / gold on dark" />
        <SpecItem label="Row height" value="40px" />
        <SpecItem label="Back link" value="Work Sans 700 italic" note="teal / underlined" />
        <SpecItem label="Active row" value="left maroon bar" note="4px wide, fills row" />
      </SpecRow>

      {/* ── In-page nav menu ─────────────────────────────────────── */}
      <PatternHeading eyebrow="02 · anchor nav" title="In-page nav menu" sub="Sticky on-this-page anchor list. Numbered or rule-separated rows. Pins to the right rail on wide viewports." />
      <DualPreview light={<InPageNav dark={false} />} dark={<InPageNav dark={true} />} />
      <SpecRow>
        <SpecItem label="Row height" value="32px" />
        <SpecItem label="Numbering" value="optional" note="01 · 02 · 03 prefix" />
        <SpecItem label="Active row" value="left accent bar + bold" />
        <SpecItem label="Behavior" value="position: sticky" note="top offset = header height" />
      </SpecRow>

      {/* ── Dropdown menu ──────────────────────────────────────── */}
      <PatternHeading eyebrow="03 · v2.0 · site header" title="Dropdown menu" sub="Top-nav item with a vertical dropdown. Short list of child routes. Use when a section has fewer than ~8 children." v2 />
      <DualPreview light={<DropdownMenu dark={false} />} dark={<DropdownMenu dark={true} />} tall />
      <SpecRow>
        <SpecItem label="Trigger" value="nav link + caret" />
        <SpecItem label="Dropdown width" value="min 220px" />
        <SpecItem label="Max items" value="~8" note="beyond that, use mega menu" />
        <SpecItem label="Keyboard" value="arrow keys + Esc" />
      </SpecRow>

      {/* ── Mega menu ────────────────────────────────────────── */}
      <PatternHeading eyebrow="04 · v2.0 · site header" title="Mega menu" sub="Full-width expanded panel with grouped links, optional feature block (image + lede) on the right. Use when a section has broad content territory to surface." v2 />
      <DualPreview light={<MegaMenu dark={false} />} dark={<MegaMenu dark={true} />} tall wide />
      <SpecRow>
        <SpecItem label="Width" value="100vw" note="full-bleed panel" />
        <SpecItem label="Columns" value="3–4 link groups" />
        <SpecItem label="Feature slot" value="optional" note="image + title + lede + CTA" />
        <SpecItem label="Keyboard" value="full focus trap + Esc" />
      </SpecRow>

      {/* ── Navigation combinations v2.0 ─────────────────────────── */}
      <PatternHeading eyebrow="matrix" title="Four navigation combinations" sub="AggieUX v2.0 defines navigation by the pairing of menu type and identity type. Four valid combinations." />
      <ComboGrid />
    </PageShell>
  );
}

// ─── Intro ────────────────────────────────────────────────────────
function MenusIntro({ children }) {
  return (
    <div style={{ padding: "16px 20px", marginBottom: 36, background: "color-mix(in srgb, var(--brand-primary) 5%, transparent)", borderLeft: "3px solid var(--brand-primary)", borderRadius: "0 var(--radius-sm) var(--radius-sm) 0", fontSize: "0.92rem", lineHeight: 1.65, color: "var(--text-secondary)" }}>
      {children}
    </div>
  );
}

function PatternHeading({ eyebrow, title, sub, v2 }) {
  return (
    <div style={{ marginTop: 40, marginBottom: 18, display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16 }}>
      <div>
        <div style={{ fontSize: "0.66rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--text-muted)", fontFamily: "var(--font-body-bold)", marginBottom: 8 }}>{eyebrow}</div>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.35rem", fontWeight: 500, margin: "0 0 6px", textTransform: "uppercase", letterSpacing: "0.015em" }}>{title}</h2>
        {sub && <p style={{ margin: 0, fontSize: "0.88rem", color: "var(--text-secondary)", maxWidth: 680, lineHeight: 1.55 }}>{sub}</p>}
      </div>
      {v2 && (
        <span style={{ flexShrink: 0, display: "inline-flex", alignItems: "center", gap: 4, padding: "4px 10px", borderRadius: "var(--radius-sm)", background: "color-mix(in srgb, var(--brand-accent) 18%, transparent)", fontSize: "0.7rem", fontWeight: 600, color: "var(--brand-primary)", fontFamily: "var(--font-body-bold)", letterSpacing: "0.05em", textTransform: "uppercase" }}>
          v2.0
        </span>
      )}
    </div>
  );
}

function DualPreview({ light, dark, tall, wide }) {
  const minH = tall ? 280 : 200;
  const cols = wide ? "1fr" : "1fr 1fr";
  const arr = wide ? [{ content: light, label: "light", bg: "#fff", textColor: "inherit" }, { content: dark, label: "dark", bg: "var(--brand-primary)", textColor: "#fff" }] : null;
  if (wide) {
    return (
      <div style={{ display: "grid", gridTemplateColumns: cols, gap: 18, marginBottom: 24 }}>
        {arr.map((x, i) => (
          <div key={i} style={{ border: "1px solid var(--surface-border)", borderRadius: "var(--radius-md)", overflow: "hidden", background: x.bg }}>
            <div style={{ padding: "8px 14px", fontSize: "0.64rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: i === 0 ? "var(--text-muted)" : "rgba(255,255,255,0.75)", fontFamily: "var(--font-body-bold)", borderBottom: i === 0 ? "1px solid var(--surface-border)" : "1px solid rgba(255,255,255,0.15)" }}>
              on {x.label}
            </div>
            <div style={{ padding: "28px 24px", minHeight: minH, display: "flex", alignItems: "flex-start", justifyContent: "center", color: x.textColor }}>
              {x.content}
            </div>
          </div>
        ))}
      </div>
    );
  }
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginBottom: 24 }}>
      <PreviewBox label="on light" bg="#fff" minH={minH}>{light}</PreviewBox>
      <PreviewBox label="on dark" bg="var(--brand-primary)" minH={minH} dark>{dark}</PreviewBox>
    </div>
  );
}

function PreviewBox({ label, bg, minH, dark, children }) {
  return (
    <div style={{ border: "1px solid var(--surface-border)", borderRadius: "var(--radius-md)", overflow: "hidden", background: bg }}>
      <div style={{ padding: "8px 14px", fontSize: "0.64rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: dark ? "rgba(255,255,255,0.75)" : "var(--text-muted)", fontFamily: "var(--font-body-bold)", borderBottom: dark ? "1px solid rgba(255,255,255,0.15)" : "1px solid var(--surface-border)" }}>
        {label}
      </div>
      <div style={{ padding: "28px 24px", minHeight: minH, display: "flex", alignItems: "flex-start", justifyContent: "center", color: dark ? "#fff" : "inherit" }}>
        {children}
      </div>
    </div>
  );
}

// ─── Sidebar menu ────────────────────────────────────────────────────
function SidebarMenu({ dark }) {
  const borderColor = dark ? "#DDAC37" : "#5C0025";
  const textColor = dark ? "#fff" : "#222";
  const linkColor = dark ? "#8BCAD8" : "#006483";
  const active = dark ? "rgba(221,172,55,0.2)" : "rgba(92,0,37,0.08)";
  const items = ["Overview", "Research programs", "Publications", "People", "News & events", "Contact"];
  const activeIdx = 2;
  return (
    <div style={{ width: 260, display: "flex", flexDirection: "column", gap: 16 }}>
      <a href="#" onClick={e => e.preventDefault()} style={{ display: "flex", alignItems: "center", gap: 8, color: linkColor, textDecoration: "underline", fontFamily: "var(--font-body-bold)", fontStyle: "italic", fontWeight: 700, fontSize: 17 }}>
        <LucideIcon name="chevron-left" size={16} color={linkColor} />
        Back to Research
      </a>
      <div style={{ border: `3px solid ${borderColor}`, display: "flex", flexDirection: "column" }}>
        {items.map((label, i) => (
          <div key={label} style={{
            height: 40,
            borderBottom: i < items.length - 1 ? `1px solid ${dark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.08)"}` : "none",
            display: "flex",
            alignItems: "center",
            paddingLeft: 14,
            fontFamily: "var(--font-body)",
            fontSize: 14.5,
            fontWeight: i === activeIdx ? 600 : 400,
            color: textColor,
            background: i === activeIdx ? active : "transparent",
            position: "relative",
            cursor: "default",
          }}>
            {i === activeIdx && <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 4, background: borderColor }} />}
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── In-page nav ─────────────────────────────────────────────────────
function InPageNav({ dark }) {
  const textColor = dark ? "#fff" : "#222";
  const mutedColor = dark ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.5)";
  const accent = dark ? "#DDAC37" : "#5C0025";
  const items = ["The problem", "Our approach", "Findings", "Methodology", "Further reading"];
  const activeIdx = 1;
  return (
    <div style={{ width: 240, display: "flex", flexDirection: "column" }}>
      <div style={{ fontSize: "0.66rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: mutedColor, fontFamily: "var(--font-body-bold)", marginBottom: 10, paddingLeft: 14 }}>
        On this page
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {items.map((label, i) => (
          <div key={label} style={{
            height: 32,
            display: "flex",
            alignItems: "center",
            paddingLeft: 14,
            fontFamily: "var(--font-body)",
            fontSize: 13.5,
            fontWeight: i === activeIdx ? 600 : 400,
            color: i === activeIdx ? accent : textColor,
            borderLeft: i === activeIdx ? `3px solid ${accent}` : `3px solid ${dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)"}`,
            gap: 10,
          }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: mutedColor }}>{String(i + 1).padStart(2, "0")}</span>
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Dropdown menu ───────────────────────────────────────────────────
function DropdownMenu({ dark }) {
  const navText = dark ? "#fff" : "#222";
  const panelBg = dark ? "#3A0017" : "#fff";
  const panelBorder = dark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.1)";
  const shadow = dark ? "0 8px 24px rgba(0,0,0,0.4)" : "0 8px 24px rgba(0,0,0,0.12)";
  const itemColor = dark ? "#fff" : "#222";
  const hoverBg = dark ? "rgba(221,172,55,0.15)" : "rgba(92,0,37,0.06)";
  return (
    <div style={{ width: 360, display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
      {/* nav bar row */}
      <div style={{ display: "flex", gap: 24, padding: "12px 0", fontFamily: "var(--font-body)", fontSize: 14.5, color: navText, fontWeight: 500 }}>
        <span>About</span>
        <span style={{ color: "var(--brand-accent)", display: "inline-flex", alignItems: "center", gap: 6, borderBottom: `2px solid ${dark ? "#DDAC37" : "#5C0025"}`, paddingBottom: 10, marginBottom: -10, fontWeight: 600 }}>
          Research
          <LucideIcon name="chevron-down" size={13} color="currentColor" />
        </span>
        <span>People</span>
        <span>News</span>
      </div>
      {/* panel */}
      <div style={{ marginTop: 2, width: 240, background: panelBg, border: `1px solid ${panelBorder}`, boxShadow: shadow, borderRadius: "var(--radius-sm)", overflow: "hidden" }}>
        {["All research", "Transportation safety", "Infrastructure", "Mobility", "Freight & logistics", "Policy"].map((x, i) => (
          <div key={x} style={{ padding: "10px 14px", fontFamily: "var(--font-body)", fontSize: 13.5, color: itemColor, borderBottom: i < 5 ? `1px solid ${panelBorder}` : "none", background: i === 1 ? hoverBg : "transparent" }}>
            {x}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Mega menu ──────────────────────────────────────────────────────
function MegaMenu({ dark }) {
  const panelBg = dark ? "#3A0017" : "#fff";
  const panelBorder = dark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.08)";
  const textColor = dark ? "#fff" : "#222";
  const mutedColor = dark ? "rgba(255,255,255,0.65)" : "rgba(0,0,0,0.55)";
  const accent = dark ? "#DDAC37" : "#5C0025";
  const shadow = dark ? "0 12px 28px rgba(0,0,0,0.4)" : "0 12px 28px rgba(0,0,0,0.10)";
  const sepBg = dark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.08)";

  const groups = [
    { head: "By focus area", items: ["Transportation safety", "Infrastructure", "Mobility", "Freight & logistics", "Policy"] },
    { head: "By audience",   items: ["Researchers", "Sponsors", "Students", "Media"] },
    { head: "Resources",     items: ["Publications library", "Data & tools", "Proving Ground facility", "Annual report"] },
  ];

  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column" }}>
      {/* nav bar */}
      <div style={{ display: "flex", gap: 28, padding: "12px 18px", fontFamily: "var(--font-body)", fontSize: 14.5, color: textColor, fontWeight: 500, borderBottom: `1px solid ${sepBg}` }}>
        <span>About</span>
        <span style={{ color: accent, fontWeight: 600 }}>Research ▾</span>
        <span>People</span>
        <span>News</span>
      </div>
      {/* panel */}
      <div style={{ background: panelBg, border: `1px solid ${panelBorder}`, boxShadow: shadow, borderTop: "none", display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1.4fr", gap: 0 }}>
        {groups.map((g, i) => (
          <div key={i} style={{ padding: "18px 20px", borderRight: `1px solid ${sepBg}` }}>
            <div style={{ fontSize: "0.66rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: mutedColor, fontFamily: "var(--font-body-bold)", marginBottom: 10 }}>
              {g.head}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {g.items.map((x, j) => (
                <span key={j} style={{ fontFamily: "var(--font-body)", fontSize: 13.5, color: textColor, lineHeight: 1.4 }}>
                  {x}
                </span>
              ))}
            </div>
          </div>
        ))}
        {/* feature slot */}
        <div style={{ padding: "18px 20px", background: dark ? "rgba(221,172,55,0.08)" : "rgba(92,0,37,0.04)" }}>
          <div style={{ width: "100%", aspectRatio: "16/9", background: dark ? "linear-gradient(135deg, rgba(221,172,55,0.2), rgba(221,172,55,0.05))" : "linear-gradient(135deg, rgba(92,0,37,0.12), rgba(92,0,37,0.02))", borderRadius: "var(--radius-sm)", marginBottom: 10, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-mono)", fontSize: 11, color: mutedColor }}>
            feature · 16:9
          </div>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 500, color: textColor, textTransform: "uppercase", letterSpacing: "0.015em", marginBottom: 4, lineHeight: 1.2 }}>
            2026 research preview
          </div>
          <div style={{ fontSize: 12, color: mutedColor, marginBottom: 10, lineHeight: 1.5 }}>
            New directions in transportation safety and mobility research.
          </div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, color: accent, fontWeight: 600, fontSize: 12.5, fontFamily: "var(--font-body-bold)" }}>
            Explore <LucideIcon name="arrow-right" size={12} color={accent} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Combination grid (menu × identity) ──────────────────────────────
function ComboGrid() {
  const combos = [
    { menu: "Dropdown", identity: "Lockup",  desc: "The safe default. Use when sections are narrow and a logo fits comfortably." },
    { menu: "Mega",     identity: "Lockup",  desc: "Broad, image-forward navigation. Use when content territory is wide." },
    { menu: "Dropdown", identity: "Text",    desc: "Long institution names. Sacrifices the mark for wordmark clarity." },
    { menu: "Mega",     identity: "Text",    desc: "Rare but valid — long names with broad content. Maximize horizontal space." },
  ];
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 24 }}>
      {combos.map((c, i) => (
        <div key={i} style={{ border: "1px solid var(--surface-border)", borderRadius: "var(--radius-md)", padding: "16px 18px", background: "var(--surface-raised)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.78rem", color: "var(--brand-primary)", fontWeight: 600 }}>
              {c.menu.toLowerCase()}
            </span>
            <span style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>×</span>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.78rem", color: "var(--brand-primary)", fontWeight: 600 }}>
              {c.identity.toLowerCase()}
            </span>
          </div>
          <div style={{ fontFamily: "var(--font-display)", fontSize: "1rem", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.015em", marginBottom: 6 }}>
            {c.menu} menu + {c.identity} identity
          </div>
          <div style={{ fontSize: "0.82rem", color: "var(--text-secondary)", lineHeight: 1.55 }}>
            {c.desc}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Spec row (reused helper) ────────────────────────────────────────
function SpecRow({ children }) {
  const items = React.Children.toArray(children);
  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${items.length}, 1fr)`, border: "1px solid var(--surface-border)", borderRadius: "var(--radius-md)", overflow: "hidden", background: "var(--surface-raised)", marginBottom: 8 }}>
      {items.map((c, i) => (
        <div key={i} style={{ padding: "12px 16px", borderLeft: i === 0 ? "none" : "1px solid var(--surface-border)" }}>{c}</div>
      ))}
    </div>
  );
}

function SpecItem({ label, value, note }) {
  return (
    <div>
      <div style={{ fontSize: "0.6rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-muted)", fontFamily: "var(--font-body-bold)" }}>{label}</div>
      <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.88rem", color: "var(--brand-primary)", marginTop: 3, fontWeight: 500 }}>{value}</div>
      {note && <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: 2, lineHeight: 1.4 }}>{note}</div>}
    </div>
  );
}

Object.assign(window, { MenusPage });
