/* global React, PageShell, LucideIcon, AGGIE_CATALOG */
/*
 * AggieSearch.jsx — Search (inline bar) + Search block (labeled unit).
 *
 * Search bar anatomy:
 *   • 2px solid border (black on light, maroon-dark on dark)
 *   • Work Sans italic placeholder
 *   • Attached "SEARCH" primary button (uppercase, 5% letterspacing)
 *
 * Sizes: regular (60px) / slim (51px)
 * Modes: on-light / on-dark
 * Label: optional "Search this Site" heading (makes it a "search block")
 */

// ──────────────────────────────────────────────────────────
// Page — Search (the bar itself, no heading label)
// ──────────────────────────────────────────────────────────
function SearchPage() {
  const item = (window.AGGIE_CATALOG || []).find(c => c.id === "search");
  return (
    <PageShell item={item}>
      <SearchIntro>
        The search bar is a single inline unit — a bordered input with an attached "Search" button. Use in page headers, inside hero strips, and anywhere users expect an obvious query field. For a fuller search unit with a heading, use <a href="#search-block" style={{ color: "var(--brand-primary)" }}>Search block</a>.
      </SearchIntro>

      <SRSection title="Regular size · 60px" desc="Default. Pairs with body copy at 16px.">
        <SRRow>
          <SRBox dark={false}><SearchBar dark={false} slim={false} /></SRBox>
          <SRBox dark={true}><SearchBar dark={true} slim={false} /></SRBox>
        </SRRow>
      </SRSection>

      <SRSection title="Slim size · 51px" desc="For sidebars, compact footers, constrained columns.">
        <SRRow>
          <SRBox dark={false}><SearchBar dark={false} slim={true} /></SRBox>
          <SRBox dark={true}><SearchBar dark={true} slim={true} /></SRBox>
        </SRRow>
      </SRSection>

      <SRSection title="Focus state" desc="Border thickens to 3px, inset shadow. Button stays locked.">
        <SRRow>
          <SRBox dark={false}><SearchBar dark={false} slim={false} focus value="traffic safety" /></SRBox>
          <SRBox dark={true}><SearchBar dark={true} slim={false} focus value="traffic safety" /></SRBox>
        </SRRow>
      </SRSection>

      <SearchSpecStrip>
        <SRSpec label="Border" value="2px solid" note="#000 on light · maroon-dark on dark" />
        <SRSpec label="Placeholder" value="Work Sans italic" note="16px · gray on light / white on dark" />
        <SRSpec label="Button" value="uppercase 14px" note="Work Sans 700 · 5% letterspacing" />
        <SRSpec label="Height" value="60 / 51px" note="regular / slim" />
      </SearchSpecStrip>
    </PageShell>
  );
}

// ──────────────────────────────────────────────────────────
// Page — Search block (labeled unit with heading)
// ──────────────────────────────────────────────────────────
function SearchBlockPage() {
  const item = (window.AGGIE_CATALOG || []).find(c => c.id === "search-block");
  return (
    <PageShell item={item}>
      <SearchIntro>
        A search block is a <strong>labeled search bar</strong> — the bar plus a heading that says "Search this Site," "Search publications," etc. Use as a standalone form in footers, sidebars, dedicated search pages, and error states where search is the primary next action.
      </SearchIntro>

      <SRSection title="Search block · default" desc="Work Sans heading, slim bar beneath. The most common pattern — shows up in footers and secondary pages.">
        <SRRow>
          <SRBox dark={false}><SearchBlock dark={false} heading="Search this site" /></SRBox>
          <SRBox dark={true}><SearchBlock dark={true} heading="Search this site" /></SRBox>
        </SRRow>
      </SRSection>

      <SRSection title="Search block · with description" desc="Optional lede describes the scope. Use when it's ambiguous what's being searched.">
        <SRRow>
          <SRBox dark={false}><SearchBlock dark={false} heading="Search publications" lede="Search 2,400+ TTI research reports, technical memoranda, and journal articles from 1950 to today." /></SRBox>
          <SRBox dark={true}><SearchBlock dark={true} heading="Search publications" lede="Search 2,400+ TTI research reports, technical memoranda, and journal articles from 1950 to today." /></SRBox>
        </SRRow>
      </SRSection>

      <SRSection title="Search block · regular bar" desc="When the block is the page's primary CTA (e.g. dedicated /search page), use the regular 60px bar.">
        <SRRow>
          <SRBox dark={false}><SearchBlock dark={false} heading="What are you looking for?" slim={false} lede="Search tti.tamu.edu — people, research, reports, news." /></SRBox>
          <SRBox dark={true}><SearchBlock dark={true} heading="What are you looking for?" slim={false} lede="Search tti.tamu.edu — people, research, reports, news." /></SRBox>
        </SRRow>
      </SRSection>

      <SearchSpecStrip>
        <SRSpec label="Heading" value="Work Sans 22px" note="lowercase. Phrase-case, not title-case." />
        <SRSpec label="Gap heading→bar" value="16px" />
        <SRSpec label="Gap bar→lede" value="12px" note="when lede present, lede goes under bar" />
        <SRSpec label="Max width" value="~520px" note="slim variant. regular can stretch to 800px." />
      </SearchSpecStrip>
    </PageShell>
  );
}

// ────────────────────────────────────────────────────────────
// SearchBar — the single bordered input + attached button
// ────────────────────────────────────────────────────────────
function SearchBar({ dark, slim, focus, value }) {
  const borderColor = focus
    ? (dark ? "#DDAC37" : "#5C0025")
    : (dark ? "rgba(255,255,255,0.6)" : "#000");
  const borderWidth = focus ? 3 : 2;
  const height = slim ? 51 : 60;
  const bg = dark ? "rgba(255,255,255,0.08)" : "#fff";
  const textColor = dark ? "#fff" : "#000";
  const placeholderColor = dark ? "rgba(255,255,255,0.65)" : "rgb(83,83,83)";
  const btnBg = dark ? "#DDAC37" : "#5C0025";
  const btnText = dark ? "#2A0E15" : "#fff";
  const btnWidth = slim ? 123 : 155;
  return (
    <div style={{
      display: "flex",
      alignItems: "stretch",
      height,
      border: `${borderWidth}px solid ${borderColor}`,
      background: bg,
      width: "100%",
      maxWidth: 560,
      boxShadow: focus ? (dark ? "inset 0 0 0 1px rgba(221,172,55,0.35)" : "inset 0 0 0 1px rgba(92,0,37,0.25)") : "none",
      transition: "none",
    }}>
      <div style={{ flex: 1, display: "flex", alignItems: "center", padding: "0 16px", fontFamily: "var(--font-body-bold)", fontSize: 16, fontStyle: value ? "normal" : "italic", color: value ? textColor : placeholderColor }}>
        {value || "Placeholder text"}
        {focus && <span style={{ marginLeft: 2, width: 2, height: 22, background: borderColor, display: "inline-block", animation: "none" }} />}
      </div>
      <button style={{
        width: btnWidth,
        background: btnBg,
        color: btnText,
        fontFamily: "var(--font-body-bold)",
        fontWeight: 700,
        fontSize: slim ? 13 : 14,
        textTransform: "uppercase",
        letterSpacing: "0.05em",
        border: "none",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
      }}>
        Search
        <LucideIcon name="search" size={slim ? 14 : 15} color={btnText} />
      </button>
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// SearchBlock — heading + optional lede + bar
// ────────────────────────────────────────────────────────────
function SearchBlock({ dark, heading, lede, slim = true }) {
  const headingColor = dark ? "#fff" : "#222";
  const ledeColor = dark ? "rgba(255,255,255,0.8)" : "rgba(0,0,0,0.6)";
  return (
    <div style={{ width: "100%", maxWidth: 560, display: "flex", flexDirection: "column", gap: 14 }}>
      <h3 style={{ fontFamily: "var(--font-body-bold)", fontWeight: 700, fontSize: 22, margin: 0, color: headingColor, lineHeight: 1.3, letterSpacing: "-0.01em" }}>
        {heading}
      </h3>
      <SearchBar dark={dark} slim={slim} />
      {lede && (
        <p style={{ margin: 0, fontSize: "0.88rem", color: ledeColor, lineHeight: 1.55 }}>
          {lede}
        </p>
      )}
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// Shell helpers
// ────────────────────────────────────────────────────────────
function SearchIntro({ children }) {
  return (
    <div style={{ padding: "16px 20px", marginBottom: 32, background: "color-mix(in srgb, var(--brand-primary) 5%, transparent)", borderLeft: "3px solid var(--brand-primary)", borderRadius: "0 var(--radius-sm) var(--radius-sm) 0", fontSize: "0.92rem", lineHeight: 1.65, color: "var(--text-secondary)" }}>
      {children}
    </div>
  );
}

function SRSection({ title, desc, children }) {
  return (
    <div style={{ marginBottom: 32 }}>
      <div style={{ marginBottom: 12 }}>
        <div style={{ fontFamily: "var(--font-display)", fontSize: "1.05rem", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.015em" }}>{title}</div>
        {desc && <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: 4, lineHeight: 1.55 }}>{desc}</div>}
      </div>
      {children}
    </div>
  );
}

function SRRow({ children }) {
  return <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>{children}</div>;
}

function SRBox({ dark, children }) {
  return (
    <div style={{ border: "1px solid var(--surface-border)", borderRadius: "var(--radius-md)", overflow: "hidden" }}>
      <div style={{ padding: "6px 14px", fontSize: "0.62rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: dark ? "rgba(255,255,255,0.75)" : "var(--text-muted)", fontFamily: "var(--font-body-bold)", background: dark ? "var(--brand-primary)" : "var(--surface-sunken)", borderBottom: dark ? "1px solid rgba(255,255,255,0.15)" : "1px solid var(--surface-border)" }}>
        {dark ? "on dark" : "on light"}
      </div>
      <div style={{ padding: "28px 24px", background: dark ? "var(--brand-primary)" : "#fff", display: "flex", alignItems: "flex-start", justifyContent: "center", minHeight: 120 }}>
        {children}
      </div>
    </div>
  );
}

function SearchSpecStrip({ children }) {
  const items = React.Children.toArray(children);
  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${items.length}, 1fr)`, border: "1px solid var(--surface-border)", borderRadius: "var(--radius-md)", overflow: "hidden", background: "var(--surface-raised)", marginTop: 8 }}>
      {items.map((c, i) => <div key={i} style={{ padding: "14px 16px", borderLeft: i === 0 ? "none" : "1px solid var(--surface-border)" }}>{c}</div>)}
    </div>
  );
}

function SRSpec({ label, value, note }) {
  return (
    <div>
      <div style={{ fontSize: "0.6rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-muted)", fontFamily: "var(--font-body-bold)" }}>{label}</div>
      <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem", color: "var(--brand-primary)", marginTop: 3, fontWeight: 500 }}>{value}</div>
      {note && <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: 2, lineHeight: 1.4 }}>{note}</div>}
    </div>
  );
}

Object.assign(window, { SearchPage, SearchBlockPage, SearchBar, SearchBlock });
