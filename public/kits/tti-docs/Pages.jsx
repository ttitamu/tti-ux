/* global React, TuxCard, TuxButton, TuxSectionHeader, TuxBadge, TuxAlert, LucideIcon */

const { useState: _useState } = React;

// ─── HomePage — hero + foundations + components grid ───────────────────────
function HomePage({ onNavigate }) {
  return (
    <div>
      {/* Hero */}
      <section style={{ padding: "72px 32px 48px" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <p className="eyebrow">tti-ux</p>
          <h1 className="heading--display" style={{ fontSize: "3.5rem", margin: "12px 0 0", maxWidth: 860, lineHeight: 1.05 }}>
            TTI Design System
          </h1>
          <p style={{ maxWidth: 640, marginTop: 28, color: "var(--text-secondary)", fontSize: "1.0625rem", lineHeight: 1.65 }}>
            A living style guide for Texas A&amp;M Transportation Institute apps built on Nuxt 4. Every page on this site is rendered by the same components your app imports — so this site <a className="link-tti" href="#" onClick={(e) => e.preventDefault()}>is</a> the source of truth, not a doc of it.
          </p>
          <div style={{ display: "flex", gap: 12, marginTop: 28 }}>
            <TuxButton intent="primary" icon="arrow-right" onClick={() => onNavigate("foundations")}>
              Read the foundations
            </TuxButton>
            <TuxButton intent="secondary" icon="file-text">View the repo</TuxButton>
          </div>
        </div>
      </section>

      {/* Foundations grid */}
      <section style={{ padding: "24px 32px 16px" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <p className="eyebrow">get started</p>
          <h2 className="heading--bold" style={{ fontSize: "1.75rem", margin: "8px 0 24px", display: "inline-block" }}>
            Foundations
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
            <TuxCard onClick={() => onNavigate("tokens")}>
              <p className="eyebrow">foundations</p>
              <h3 style={{ fontSize: "1.25rem", fontWeight: 700, margin: "4px 0 10px" }}>Tokens</h3>
              <p style={{ fontSize: "0.8125rem", color: "var(--text-secondary)", lineHeight: 1.55, margin: 0 }}>
                Brand colors, surfaces, text roles, shadows, radii — every CSS variable the system exposes, visible at a glance.
              </p>
            </TuxCard>
            <TuxCard onClick={() => onNavigate("typography")}>
              <p className="eyebrow">foundations</p>
              <h3 style={{ fontSize: "1.25rem", fontWeight: 700, margin: "4px 0 10px" }}>Typography</h3>
              <p style={{ fontSize: "0.8125rem", color: "var(--text-secondary)", lineHeight: 1.55, margin: 0 }}>
                Oswald + Work Sans + Open Sans, self-hosted. Three families, one rule each — and two section styles.
              </p>
            </TuxCard>
            <TuxCard onClick={() => onNavigate("motion")}>
              <p className="eyebrow">foundations</p>
              <h3 style={{ fontSize: "1.25rem", fontWeight: 700, margin: "4px 0 10px" }}>Motion &amp; spacing</h3>
              <p style={{ fontSize: "0.8125rem", color: "var(--text-secondary)", lineHeight: 1.55, margin: 0 }}>
                Three durations, the 4px spacing ramp, and the tux corner-drop signature.
              </p>
            </TuxCard>
          </div>
        </div>
      </section>

      {/* Components grid */}
      <section style={{ padding: "56px 32px 16px" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <p className="eyebrow">component</p>
          <h2 className="heading--bold" style={{ fontSize: "1.75rem", margin: "8px 0 24px", display: "inline-block" }}>
            Components
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
            {COMPONENTS.map((c) => (
              <ComponentCard
                key={c.name}
                name={c.name}
                blurb={c.blurb}
                uses={c.uses}
                onClick={() => onNavigate("components")}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Boilerplate block — the institutional voice */}
      <section style={{ padding: "72px 32px 48px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "grid", gridTemplateColumns: "auto 1fr", gap: 40, padding: 32, background: "var(--surface-sunken)", borderLeft: "4px solid var(--brand-primary)" }}>
          <div style={{ fontFamily: "var(--font-display)", fontSize: "3.5rem", fontWeight: 800, fontStyle: "italic", color: "var(--brand-primary)", lineHeight: 1, textTransform: "uppercase" }}>
            $126M
          </div>
          <div>
            <p className="eyebrow">annual research expenditure</p>
            <p style={{ fontSize: "0.9375rem", lineHeight: 1.65, color: "var(--text-primary)", margin: "8px 0 0" }}>
              TTI is the largest university-affiliated transportation research agency in the United States. tti-ux is the common visual layer for the internal tools serving that research — file classifiers, BI dashboards, knowledge-grounded LLM chat, and the docs you are reading now.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

const COMPONENTS = [
  { name: "TuxAlert",         blurb: "Docusaurus-style admonitions — eight variants incl. the solid-maroon compliance block.", uses: "UAlert" },
  { name: "TuxBadge",         blurb: "Classification tiers, scan states, classifier tags, facet counts.", uses: "UBadge" },
  { name: "TuxButton",        blurb: "Four semantic intents — primary, secondary, ghost, destructive fills on hover.", uses: "UButton" },
  { name: "TuxCard",          blurb: "Static or linked — linked mode has the corner-drop hover + appearing arrow.", uses: "tux (no U-primitive)" },
  { name: "TuxEmptyState",    blurb: "No-data placeholder — tinted icon circle, title, description, CTA slot.", uses: "TuxCard composite" },
  { name: "TuxModal",         blurb: "UModal with editorial rhythm — optional eyebrow, gold-bar underlined title.", uses: "UModal" },
  { name: "TuxPageHeader",    blurb: "Eyebrow + gold-bar heading + subtitle — the rhythm most pages open with.", uses: "tux (no U-primitive)" },
  { name: "TuxSectionHeader", blurb: "Editorial section heading — ALL-CAPS, tracked-out, maroon underline.", uses: "tux (no U-primitive)" },
  { name: "TuxTable",         blurb: "UTable with tux chrome, automatic status-cell rendering via TuxBadge.", uses: "UTable" },
];

function ComponentCard({ name, blurb, uses, onClick }) {
  const [hover, setHover] = _useState(false);
  return (
    <a
      href="#"
      onClick={(e) => { e.preventDefault(); onClick(); }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "block",
        padding: 20,
        border: "1px solid var(--surface-border)",
        borderRadius: "var(--radius-lg)",
        background: "var(--surface-raised)",
        textDecoration: "none",
        color: "inherit",
        position: "relative",
        transform: hover ? "translate(6px, -6px)" : "translate(0,0)",
        boxShadow: hover ? "-6px 6px 0 0 var(--brand-primary)" : "none",
        transition: "transform 300ms cubic-bezier(0.2,0.8,0.2,1), box-shadow 300ms",
      }}
    >
      <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.78rem", fontWeight: 500, color: "var(--brand-primary)", marginBottom: 8 }}>
        {name}
      </div>
      <p style={{ fontSize: "0.8125rem", color: "var(--text-secondary)", lineHeight: 1.55, margin: "0 0 12px" }}>{blurb}</p>
      <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "var(--tracking-wider)" }}>
        wraps · <span style={{ fontFamily: "var(--font-mono)", textTransform: "none", letterSpacing: 0 }}>{uses}</span>
      </div>
    </a>
  );
}

// ─── TokensPage ────────────────────────────────────────────────────────────
function TokensPage() {
  const brand = [
    { name: "--brand-primary",      hex: "#5C0025", role: "Anchor — TTI maroon" },
    { name: "--brand-primary-deep", hex: "#500000", role: "508-accessible variant" },
    { name: "--brand-accent",       hex: "#DDAC37", role: "Gold — bar underlines, accents" },
    { name: "--brand-secondary",    hex: "#15457E", role: "Inline text links" },
  ];
  const surfaces = [
    { name: "--surface-page",   hex: "#FFFFFF" },
    { name: "--surface-raised", hex: "#FFFFFF" },
    { name: "--surface-sunken", hex: "#F5F5F5" },
    { name: "--surface-border", hex: "#E7E6E6" },
  ];
  return (
    <div style={{ maxWidth: 980, margin: "0 auto", padding: "56px 32px" }}>
      <p className="eyebrow">foundations</p>
      <h1 className="heading--bold" style={{ fontSize: "2.25rem", margin: "8px 0 12px", display: "inline-block" }}>
        Tokens
      </h1>
      <p style={{ fontSize: "1rem", color: "var(--text-secondary)", maxWidth: 640, lineHeight: 1.65, marginTop: 24 }}>
        Every CSS variable the system exposes. Resolved for the <code>tti</code> theme. Set <code>data-theme="tti-dark"</code> or <code>data-theme="tti-hc"</code> on <code>&lt;html&gt;</code> to swap.
      </p>

      <div style={{ marginTop: 40 }}>
        <TuxSectionHeader level={3} subtitle="The four load-bearing brand slots.">BRAND</TuxSectionHeader>
        <TokenTable rows={brand} />
      </div>

      <div style={{ marginTop: 40 }}>
        <TuxSectionHeader level={3} subtitle="Flat, ungradiented — no gradient backgrounds on primary surfaces.">SURFACES</TuxSectionHeader>
        <TokenTable rows={surfaces} />
      </div>

      <div style={{ marginTop: 40 }}>
        <TuxSectionHeader level={3} subtitle="Status uses — note danger (maroon, compliance) is distinct from error (red, broken).">STATUS</TuxSectionHeader>
        <TokenTable rows={[
          { name: "--color-success", hex: "#66814F", role: "Sage — completed runs, passing states" },
          { name: "--color-warning", hex: "#DDAC37", role: "Gold — scheduled maintenance, important alerts" },
          { name: "--color-danger",  hex: "#5C0025", role: "Maroon — ITAR / HIPAA compliance UI" },
          { name: "--color-error",   hex: "#D04343", role: "Red — something broke (not the same as danger)" },
          { name: "--color-info",    hex: "#4A8892", role: "Teal — info admonitions, public data tier" },
        ]} />
      </div>
    </div>
  );
}

function TokenTable({ rows }) {
  return (
    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8125rem" }}>
      <thead>
        <tr style={{ borderBottom: "2px solid var(--surface-border)" }}>
          <th style={{ textAlign: "left", padding: "10px 12px", textTransform: "uppercase", fontSize: "0.7rem", letterSpacing: "var(--tracking-wider)", color: "var(--text-muted)", fontWeight: 600 }}>swatch</th>
          <th style={{ textAlign: "left", padding: "10px 12px", textTransform: "uppercase", fontSize: "0.7rem", letterSpacing: "var(--tracking-wider)", color: "var(--text-muted)", fontWeight: 600 }}>token</th>
          <th style={{ textAlign: "left", padding: "10px 12px", textTransform: "uppercase", fontSize: "0.7rem", letterSpacing: "var(--tracking-wider)", color: "var(--text-muted)", fontWeight: 600 }}>hex</th>
          <th style={{ textAlign: "left", padding: "10px 12px", textTransform: "uppercase", fontSize: "0.7rem", letterSpacing: "var(--tracking-wider)", color: "var(--text-muted)", fontWeight: 600 }}>role</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.name} style={{ borderBottom: "1px solid var(--surface-border)" }}>
            <td style={{ padding: "12px 12px", width: 60 }}>
              <div style={{ width: 32, height: 32, background: r.hex, borderRadius: "var(--radius-sm)", border: "1px solid var(--surface-border)" }} />
            </td>
            <td style={{ padding: "12px 12px", fontFamily: "var(--font-mono)", fontSize: "0.8rem", color: "var(--text-primary)" }}>{r.name}</td>
            <td style={{ padding: "12px 12px", fontFamily: "var(--font-mono)", fontSize: "0.8rem", color: "var(--text-secondary)" }}>{r.hex}</td>
            <td style={{ padding: "12px 12px", color: "var(--text-secondary)" }}>{r.role || "—"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// ─── TypographyPage ────────────────────────────────────────────────────────
function TypographyPage() {
  return (
    <div style={{ maxWidth: 980, margin: "0 auto", padding: "56px 32px" }}>
      <p className="eyebrow">foundations</p>
      <h1 className="heading--bold" style={{ fontSize: "2.25rem", margin: "8px 0 12px", display: "inline-block" }}>
        Typography
      </h1>
      <p style={{ fontSize: "1rem", color: "var(--text-secondary)", maxWidth: 640, lineHeight: 1.65, marginTop: 24 }}>
        Three families, one rule each. Oswald heads the page in default style; Work Sans replaces it under <code>.style--bold</code> and everywhere for buttons and inputs; Open Sans carries body copy, subheads, and eyebrows. JetBrains Mono for paths, IDs, code. All four self-hosted from <code>fonts/</code>.
      </p>

      <section style={{ marginTop: 48 }}>
        <TuxSectionHeader level={3} subtitle="The three heading utilities, ranked from loudest to quietest.">EDITORIAL HEADINGS</TuxSectionHeader>
        <div style={{ display: "flex", flexDirection: "column", gap: 44, marginTop: 32 }}>
          <TypeSpecimen
            label="heading--display"
            meta="800 · italic · uppercase · stacked signature"
            note="Landing copy only. Strong institutional signal — use sparingly."
          >
            <div className="heading--display" style={{ fontSize: "2.5rem" }}>Texas A&amp;M Transportation Institute</div>
          </TypeSpecimen>

          <TypeSpecimen
            label="heading--bold"
            meta="700 · upright · stacked signature"
            note="The workhorse. Every page header, every section opener."
          >
            <h2 className="heading--bold" style={{ fontSize: "1.875rem", margin: 0 }}>Q1 Research Grants</h2>
          </TypeSpecimen>

          <TypeSpecimen
            label="TuxSectionHeader"
            meta="ALL CAPS · tracked · 2px maroon underline"
            note="Editorial rhythm mid-page — distinct from gold-bar headings."
          >
            <div style={{ display: "inline-block", textTransform: "uppercase", fontWeight: 700, letterSpacing: "var(--tracking-wider)", fontSize: "1.125rem", paddingBottom: 6, borderBottom: "2px solid var(--brand-primary)", color: "var(--text-primary)" }}>
              STORAGE OVERVIEW
            </div>
          </TypeSpecimen>
        </div>
      </section>

      <section style={{ marginTop: 64 }}>
        <TuxSectionHeader level={3} subtitle="The modular scale, on a 4px baseline grid.">BODY SCALE</TuxSectionHeader>
        <div style={{ marginTop: 24 }}>
          {[
            { label: "text-3xl", size: "1.875rem", lh: "2.25rem" },
            { label: "text-2xl", size: "1.5rem",   lh: "2rem" },
            { label: "text-xl",  size: "1.25rem",  lh: "1.75rem" },
            { label: "text-lg",  size: "1.125rem", lh: "1.75rem" },
            { label: "text-base",size: "1rem",     lh: "1.5rem", note: "body default" },
            { label: "text-sm",  size: "0.875rem", lh: "1.25rem", note: "chrome, meta" },
            { label: "text-xs",  size: "0.75rem",  lh: "1rem", note: "eyebrow, badge" },
          ].map((r) => (
            <div key={r.label} style={{ display: "grid", gridTemplateColumns: "120px 1fr 100px", alignItems: "baseline", gap: 20, padding: "14px 0", borderBottom: "1px solid var(--surface-border)" }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.78rem", color: "var(--text-muted)" }}>{r.label}</div>
              <div style={{ fontSize: r.size, lineHeight: r.lh }}>The quick brown fox jumps over the lazy dog</div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: "var(--text-muted)", textAlign: "right" }}>
                {parseFloat(r.size) * 16}/{parseFloat(r.lh) * 16}{r.note ? ` · ${r.note}` : ""}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function TypeSpecimen({ label, meta, note, children }) {
  return (
    <div>
      <div style={{ marginBottom: 18 }}>{children}</div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 10, flexWrap: "wrap" }}>
        <code style={{ fontSize: "0.75rem", background: "var(--surface-sunken)", padding: "2px 7px", borderRadius: 3 }}>{label}</code>
        <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{meta}</span>
      </div>
      {note ? (
        <p style={{ fontSize: "0.825rem", color: "var(--text-secondary)", margin: "8px 0 0", maxWidth: 560, lineHeight: 1.55 }}>{note}</p>
      ) : null}
    </div>
  );
}

// ─── ComponentsPage — catalog (jumps to button detail on card click) ───────
function ComponentsPage({ onNavigate }) {
  return (
    <div style={{ maxWidth: 1180, margin: "0 auto", padding: "56px 32px" }}>
      <p className="eyebrow">catalog</p>
      <h1 className="heading--bold" style={{ fontSize: "2.25rem", margin: "8px 0 12px", display: "inline-block" }}>
        Components
      </h1>
      <p style={{ fontSize: "1rem", color: "var(--text-secondary)", maxWidth: 640, lineHeight: 1.65, marginTop: 24 }}>
        Nine Tux* wrappers over Nuxt UI primitives. Where a primitive didn't exist that fit the editorial feel, we built one from scratch on Reka UI.
      </p>

      <div style={{ marginTop: 40 }}>
        <BigStat value="9" label="Tux wrappers" tone="maroon" />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, marginTop: 32 }}>
          {COMPONENTS.map((c) => (
            <ComponentCard
              key={c.name}
              name={c.name}
              blurb={c.blurb}
              uses={c.uses}
              onClick={() => onNavigate("components")}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── BigStat — the signature editorial oversized numeral ───────────────────
function BigStat({ value, label, tone = "maroon" }) {
  const color = tone === "maroon" ? "var(--brand-primary)" : "var(--brand-accent)";
  return (
    <div style={{ display: "inline-flex", alignItems: "flex-end", gap: 16, paddingRight: 24, borderRight: "1px solid var(--surface-border)" }}>
      <div style={{ fontFamily: "var(--font-display)", fontSize: "4rem", fontWeight: 800, fontStyle: "italic", color, lineHeight: 0.9, letterSpacing: "-0.02em" }}>
        {value}
      </div>
      <div className="eyebrow" style={{ maxWidth: 120, lineHeight: 1.3, marginBottom: 8 }}>{label}</div>
    </div>
  );
}

// ─── MotionPage ────────────────────────────────────────────────────────────
function MotionPage() {
  return (
    <div style={{ maxWidth: 980, margin: "0 auto", padding: "56px 32px" }}>
      <p className="eyebrow">foundations</p>
      <h1 className="heading--bold" style={{ fontSize: "2.25rem", margin: "8px 0 12px", display: "inline-block" }}>
        Motion
      </h1>
      <p style={{ fontSize: "1rem", color: "var(--text-secondary)", maxWidth: 640, lineHeight: 1.65, marginTop: 24 }}>
        Three durations, one easing ramp, and the corner-drop signature. No bounces, no springs on primary chrome. Full-page transitions are deliberately absent — the institutional feel wants stability, not motion.
      </p>

      <section style={{ marginTop: 48 }}>
        <TuxSectionHeader level={3} subtitle="Hover a card to see the translate + slab shadow.">TUXCARD CORNER-DROP</TuxSectionHeader>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginTop: 24 }}>
          <TuxCard onClick={() => {}}>
            <p className="eyebrow">linked card</p>
            <h3 style={{ fontSize: "1.125rem", fontWeight: 700, margin: "4px 0 8px" }}>Hover me</h3>
            <p style={{ fontSize: "0.8125rem", color: "var(--text-secondary)", margin: 0, lineHeight: 1.55 }}>
              +6px right, -6px up translate with a maroon slab dropping into the gap it leaves behind. 300ms on a custom ease-out.
            </p>
          </TuxCard>
          <TuxCard>
            <p className="eyebrow">static card</p>
            <h3 style={{ fontSize: "1.125rem", fontWeight: 700, margin: "4px 0 8px" }}>No hover state</h3>
            <p style={{ fontSize: "0.8125rem", color: "var(--text-secondary)", margin: 0, lineHeight: 1.55 }}>
              Same 2px maroon border, same padding. Use when the card isn't a navigation affordance — informational blocks, empty states.
            </p>
          </TuxCard>
        </div>
      </section>

      <section style={{ marginTop: 64 }}>
        <TuxSectionHeader level={3} subtitle="The three durations + one easing ramp.">TOKENS</TuxSectionHeader>
        <TokenTable rows={[
          { name: "--dur-fast",   hex: "#ffffff", role: "150ms · tooltips, hover color swaps" },
          { name: "--dur-med",    hex: "#ffffff", role: "250ms · panel flips, chip selection" },
          { name: "--dur-slow",   hex: "#ffffff", role: "350ms · corner-drop translate" },
          { name: "--ease-out",   hex: "#ffffff", role: "cubic-bezier(0.2, 0.8, 0.2, 1.2) · the corner-drop ease" },
        ]} />
      </section>
    </div>
  );
}

// ─── FoundationsPage — overview that links to the three foundation pages ───
function FoundationsPage({ onNavigate }) {
  return (
    <div style={{ maxWidth: 980, margin: "0 auto", padding: "56px 32px" }}>
      <p className="eyebrow">get started</p>
      <h1 className="heading--bold" style={{ fontSize: "2.25rem", margin: "8px 0 12px", display: "inline-block" }}>
        Foundations
      </h1>
      <p style={{ fontSize: "1rem", color: "var(--text-secondary)", maxWidth: 640, lineHeight: 1.65, marginTop: 24 }}>
        Read these three pages first. Everything else in the system sits on top of the decisions made here.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 20, marginTop: 40 }}>
        <FoundationRow onNavigate={onNavigate} route="tokens"     idx="01" title="Tokens"       blurb="Brand colors, surfaces, text roles, shadows, radii — every CSS variable the system exposes. Theme-swappable via data-theme." />
        <FoundationRow onNavigate={onNavigate} route="typography" idx="02" title="Typography"   blurb="Oswald + Work Sans + Open Sans, self-hosted. Three families, one rule each. heading--bold, heading--display, and eyebrow utilities shown in context against the 1.25 modular scale." />
        <FoundationRow onNavigate={onNavigate} route="motion"     idx="03" title="Motion" blurb="Three durations, one easing curve, and the corner-drop signature. Explicit about what we don't do (no bounces, no full-page transitions)." />
      </div>
    </div>
  );
}

function FoundationRow({ idx, title, blurb, route, onNavigate }) {
  const [hover, setHover] = _useState(false);
  return (
    <a
      href="#"
      onClick={(e) => { e.preventDefault(); onNavigate(route); }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "grid",
        gridTemplateColumns: "auto 1fr auto",
        alignItems: "center",
        gap: 32,
        padding: "28px 28px",
        textDecoration: "none",
        color: "inherit",
        borderTop: "1px solid var(--surface-border)",
        borderBottom: "1px solid var(--surface-border)",
        background: hover ? "color-mix(in srgb, var(--brand-primary) 3%, transparent)" : "transparent",
        transition: "background 150ms",
      }}
    >
      <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.9rem", color: "var(--brand-primary)", fontWeight: 600 }}>{idx}</div>
      <div>
        <h3 style={{ fontSize: "1.375rem", fontWeight: 700, margin: "0 0 6px" }}>{title}</h3>
        <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", margin: 0, lineHeight: 1.6, maxWidth: 640 }}>{blurb}</p>
      </div>
      <LucideIcon name="arrow-right" size={22} />
    </a>
  );
}

Object.assign(window, {
  HomePage,
  TokensPage,
  TypographyPage,
  ComponentsPage,
  MotionPage,
  FoundationsPage,
  BigStat,
});
