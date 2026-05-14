/* global React, PageShell, AGGIE_CATALOG, LucideIcon */
/*
 * AggieTemplatesBatchI.jsx — Batch I: Whole-page template assemblies.
 *
 * Four page-template comps showing how the shipped families compose into
 * full app surfaces:
 *
 *   • research-dashboard — metrics + corridor strip + grid + map (PECAN-style)
 *   • document-detail    — long-form research doc w/ TOC rail + citations
 *   • settings-shell     — vertical-tab settings page (Fabric/Apple-shaped)
 *   • list-detail-split  — Mail-style two-pane list + selected detail
 *
 * Each template is a static composition — uses existing primitives and
 * surface tokens; no new components introduced. The point is to show what
 * the kit looks like when assembled, not to invent more parts.
 *
 * Lineage notes:
 *   research-dashboard → Microsoft Fabric page-templates (data-app shape)
 *   document-detail    → Apple HIG long-form + tti-docs editorial rhythm
 *   settings-shell     → Apple HIG macOS Settings + Fabric pivot-page
 *   list-detail-split  → Apple HIG Mail / Fabric two-pane editor
 *
 * Helper prefix: TI.
 */

const { useState: _tiUseState } = React;

// ─── Shared chrome ──────────────────────────────────────────────────────
function TIBox({ label, children, padded = false }) {
  return (
    <div style={{ border: "1px solid var(--surface-border)", borderRadius: "var(--radius-md)", overflow: "hidden", marginBottom: 16 }}>
      <div style={{ padding: "7px 14px", fontSize: "0.62rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--text-muted)", fontFamily: "var(--font-body-bold)", background: "var(--surface-sunken)", borderBottom: "1px solid var(--surface-border)" }}>{label}</div>
      <div style={{ padding: padded ? 24 : 0, background: "var(--surface-page)" }}>{children}</div>
    </div>
  );
}
function TIIntro({ children }) {
  return <div style={{ padding: "16px 20px", marginBottom: 28, background: "color-mix(in srgb, var(--brand-primary) 5%, transparent)", borderLeft: "3px solid var(--brand-primary)", borderRadius: "0 var(--radius-sm) var(--radius-sm) 0", fontSize: "0.92rem", lineHeight: 1.65, color: "var(--text-secondary)" }}>{children}</div>;
}
function TISpecRow({ children }) {
  return <div style={{ marginTop: 24, padding: "14px 18px", border: "1px solid var(--surface-border)", borderRadius: "var(--radius-md)", background: "var(--surface-raised)", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>{children}</div>;
}
function TISpec({ label, value, note }) {
  return (
    <div>
      <div style={{ fontSize: "0.6rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-muted)", fontFamily: "var(--font-body-bold)" }}>{label}</div>
      <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem", color: "var(--brand-primary)", marginTop: 3, fontWeight: 500 }}>{value}</div>
      {note && <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: 2, lineHeight: 1.4 }}>{note}</div>}
    </div>
  );
}
function TILineage({ children }) {
  return (
    <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: -8, marginBottom: 18, fontStyle: "italic", lineHeight: 1.55 }}>
      <span style={{ fontWeight: 600, color: "var(--brand-primary)", fontStyle: "normal" }}>Lineage</span> · {children}
    </div>
  );
}

// ─── Shared chrome elements used by all templates ───────────────────────
function TIPageHeader({ eyebrow, title, breadcrumbs, actions }) {
  return (
    <header style={{ padding: "18px 24px 16px", borderBottom: "1px solid var(--surface-border)", background: "var(--surface-raised)" }}>
      {breadcrumbs && (
        <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: "var(--text-muted)", marginBottom: 6, display: "flex", gap: 8, alignItems: "center" }}>
          {breadcrumbs.map((b, i) => (
            <React.Fragment key={i}>
              {i > 0 && <LucideIcon name="chevron-right" size={10} />}
              <span style={{ color: i === breadcrumbs.length - 1 ? "var(--text-secondary)" : "var(--text-muted)" }}>{b}</span>
            </React.Fragment>
          ))}
        </div>
      )}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 18, flexWrap: "wrap" }}>
        <div>
          {eyebrow && <div style={{ fontSize: "0.62rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em", color: "var(--text-muted)", fontFamily: "var(--font-body-bold)", marginBottom: 4 }}>{eyebrow}</div>}
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.01em", margin: 0, lineHeight: 1.15 }}>{title}</h2>
          <div style={{ width: 48, height: 2, background: "var(--brand-primary)", marginTop: 8 }} />
        </div>
        {actions && <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>{actions}</div>}
      </div>
    </header>
  );
}

function TIBtn({ icon, primary, ghost, children }) {
  const bg = primary ? "var(--brand-primary)" : "transparent";
  const color = primary ? "white" : "var(--text-primary)";
  const border = primary ? "var(--brand-primary)" : ghost ? "transparent" : "var(--surface-border)";
  return (
    <button style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "7px 13px", background: bg, color, border: `1px solid ${border}`, borderRadius: "var(--radius-sm)", fontFamily: "var(--font-body-bold)", fontWeight: 700, fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.09em", cursor: "pointer" }}>
      {icon && <LucideIcon name={icon} size={11} />}
      {children}
    </button>
  );
}

// ════════════════════════════════════════════════════════════════════════
// 1. RESEARCH DASHBOARD
// ════════════════════════════════════════════════════════════════════════
function TIResearchDashboard() {
  return (
    <div style={{ background: "var(--surface-page)", minHeight: 720, fontFamily: "var(--font-body)", color: "var(--text-primary)" }}>
      <TIPageHeader
        eyebrow="PECAN · Performance"
        title="Statewide corridor performance · FY 2026"
        breadcrumbs={["PECAN", "Dashboards", "Corridor performance"]}
        actions={<>
          <TIBtn icon="filter">Filter</TIBtn>
          <TIBtn icon="download">Export</TIBtn>
          <TIBtn icon="share-2" primary>Share</TIBtn>
        </>}
      />

      {/* Filter strip */}
      <div style={{ padding: "10px 24px", borderBottom: "1px solid var(--surface-border)", background: "var(--surface-sunken)", display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
        <span style={{ fontSize: "0.62rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.11em", color: "var(--text-muted)", fontFamily: "var(--font-body-bold)" }}>Filters</span>
        <span style={tiFilterChip}><span style={{ color: "var(--text-muted)", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.06em", fontSize: "0.65rem" }}>district:</span> Austin, Houston, San Antonio</span>
        <span style={tiFilterChip}><span style={{ color: "var(--text-muted)", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.06em", fontSize: "0.65rem" }}>range:</span> Apr 1 → May 12, 2026</span>
        <span style={tiFilterChip}><span style={{ color: "var(--text-muted)", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.06em", fontSize: "0.65rem" }}>status:</span> Active or Risk</span>
        <button style={{ background: "transparent", border: "none", color: "var(--text-muted)", fontFamily: "var(--font-body-bold)", fontWeight: 600, fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.09em", cursor: "pointer", marginLeft: 4 }}>Clear all</button>
        <span style={{ flex: 1 }} />
        <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: "var(--text-muted)" }}>last sync 14 min ago</span>
      </div>

      {/* Stat row */}
      <div style={{ padding: "22px 24px", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 0, border: "0", borderBottom: "1px solid var(--surface-border)" }}>
        {[
          { label: "Active corridors", value: "184", delta: "+3 vs Q1", deltaColor: "var(--color-success)" },
          { label: "At-risk projects",  value: "12",  delta: "+2 vs Q1", deltaColor: "var(--color-error, #B23A3A)" },
          { label: "Avg delay (min)",   value: "16.4", delta: "−2.1 vs Q1", deltaColor: "var(--color-success)" },
          { label: "Budget on plan",    value: "94%",  delta: "+1.2 vs Q1", deltaColor: "var(--color-success)" },
        ].map((s, i) => (
          <div key={i} style={{ paddingRight: i < 3 ? 24 : 0, borderRight: i < 3 ? "1px solid var(--surface-border)" : "none" }}>
            <div style={{ fontSize: "0.62rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--text-muted)", fontFamily: "var(--font-body-bold)" }}>{s.label}</div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: "2.4rem", fontWeight: 500, color: "var(--brand-primary)", lineHeight: 1, marginTop: 6 }}>{s.value}</div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.76rem", color: s.deltaColor, marginTop: 6 }}>{s.delta}</div>
          </div>
        ))}
      </div>

      {/* Two-column body */}
      <div style={{ padding: 24, display: "grid", gridTemplateColumns: "minmax(0,1fr) 280px", gap: 24, alignItems: "start" }}>
        <div>
          {/* Corridor strip-style stack */}
          <div style={{ background: "var(--surface-raised)", border: "1px solid var(--surface-border)", borderRadius: "var(--radius-md)", padding: "18px 18px 16px", marginBottom: 18 }}>
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 12 }}>
              <h3 style={tiSecHead}>I-35 · MM 0–600 · pavement & AADT</h3>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: "var(--text-muted)" }}>PMIS 2024 · INRIX Q1</span>
            </div>
            {/* Two strip tracks */}
            <div style={{ marginBottom: 8 }}>
              <div style={tiTrackLabel}>Pavement</div>
              <div style={{ display: "flex", height: 18, borderRadius: 3, overflow: "hidden", border: "1px solid var(--surface-border)" }}>
                {[
                  { w: 9, c: "color-mix(in srgb, var(--color-success, #1F8A5B) 75%, transparent)" },
                  { w: 7, c: "color-mix(in srgb, var(--brand-accent) 80%, transparent)" },
                  { w: 14, c: "color-mix(in srgb, var(--color-success, #1F8A5B) 75%, transparent)" },
                  { w: 5, c: "color-mix(in srgb, var(--color-error, #B23A3A) 75%, transparent)" },
                  { w: 7, c: "color-mix(in srgb, var(--brand-accent) 80%, transparent)" },
                  { w: 12, c: "color-mix(in srgb, var(--color-success, #1F8A5B) 75%, transparent)" },
                  { w: 12, c: "color-mix(in srgb, var(--brand-accent) 80%, transparent)" },
                  { w: 9, c: "color-mix(in srgb, var(--color-error, #B23A3A) 75%, transparent)" },
                  { w: 25, c: "color-mix(in srgb, var(--color-success, #1F8A5B) 75%, transparent)" },
                ].map((seg, i) => <div key={i} style={{ width: `${seg.w}%`, background: seg.c }} />)}
              </div>
            </div>
            <div>
              <div style={tiTrackLabel}>Daily VMT (relative)</div>
              <div style={{ height: 38, border: "1px solid var(--surface-border)", borderRadius: 3, background: "var(--surface-sunken)", position: "relative" }}>
                <svg width="100%" height="38" viewBox="0 0 100 38" preserveAspectRatio="none">
                  <path d="M 0,30 C 10,28 20,15 30,12 C 40,9 50,6 60,3 C 70,5 80,9 90,16 L 100,22 L 100,38 L 0,38 Z" fill="color-mix(in srgb, var(--brand-primary) 22%, transparent)" stroke="var(--brand-primary)" strokeWidth="0.6" vectorEffect="non-scaling-stroke" />
                </svg>
              </div>
            </div>
            {/* Station axis */}
            <div style={{ position: "relative", height: 28, marginTop: 6 }}>
              {[{ mp: 0, l: "Laredo" }, { mp: 25, l: "San Antonio" }, { mp: 37, l: "Austin" }, { mp: 53, l: "Waco" }, { mp: 68, l: "DFW" }, { mp: 100, l: "Gainesville" }].map((s, i, arr) => (
                <div key={i} style={{ position: "absolute", left: `${s.mp}%`, top: 0, transform: i === 0 ? "translateX(0)" : i === arr.length - 1 ? "translateX(-100%)" : "translateX(-50%)" }}>
                  <span style={{ display: "block", width: 1, height: 4, background: "var(--surface-border)" }} />
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.62rem", color: "var(--text-muted)", marginTop: 2, display: "block" }}>MP {s.mp * 6}</span>
                  <span style={{ fontSize: "0.7rem", color: "var(--text-primary)", display: "block", marginTop: 1, whiteSpace: "nowrap" }}>{s.l}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Mini-table */}
          <div style={{ background: "var(--surface-raised)", border: "1px solid var(--surface-border)", borderRadius: "var(--radius-md)", overflow: "hidden" }}>
            <div style={{ padding: "12px 18px", borderBottom: "1px solid var(--surface-border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <h3 style={tiSecHead}>Top corridor projects</h3>
              <a href="#" onClick={(e) => e.preventDefault()} style={tiSeeAll}>See all 184 →</a>
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.84rem" }}>
              <thead><tr style={{ background: "var(--surface-sunken)" }}>
                {["Project", "District", "Status", "Delay", "Budget"].map(h => <th key={h} style={tiTh}>{h}</th>)}
              </tr></thead>
              <tbody>
                {[
                  { p: "I-35 Capital Express", d: "Austin", s: "Active", dl: "18.4", b: "$482M", sc: "var(--color-success)" },
                  { p: "I-10 Border Freight",  d: "El Paso", s: "Active", dl: "21.0", b: "$645M", sc: "var(--color-success)" },
                  { p: "I-45 Central Sustained", d: "Houston", s: "Risk", dl: "28.7", b: "$1.28B", sc: "var(--color-error, #B23A3A)" },
                  { p: "Loop 1604 Reconstruction", d: "San Antonio", s: "Active", dl: "9.3", b: "$312M", sc: "var(--color-success)" },
                ].map((r, i) => (
                  <tr key={i}>
                    <td style={{ ...tiTd, color: "var(--text-primary)", fontFamily: "var(--font-body-bold)", fontWeight: 600 }}>{r.p}</td>
                    <td style={tiTd}>{r.d}</td>
                    <td style={tiTd}><span style={{ display: "inline-flex", alignItems: "center", gap: 5, color: r.sc, fontFamily: "var(--font-body-bold)", fontWeight: 600, fontSize: "0.78rem" }}><span aria-hidden style={{ width: 5, height: 5, borderRadius: "50%", background: r.sc }} />{r.s}</span></td>
                    <td style={{ ...tiTd, fontFamily: "var(--font-mono)", textAlign: "right" }}>{r.dl}</td>
                    <td style={{ ...tiTd, fontFamily: "var(--font-mono)", textAlign: "right", color: "var(--text-primary)", fontWeight: 600 }}>{r.b}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right rail */}
        <aside>
          <div style={{ background: "var(--surface-raised)", border: "1px solid var(--surface-border)", borderRadius: "var(--radius-md)", padding: "16px 18px", marginBottom: 14 }}>
            <h3 style={tiSecHead}>Map · districts at a glance</h3>
            <div style={{ marginTop: 10, aspectRatio: "1 / 0.9", background: "color-mix(in srgb, var(--brand-primary) 5%, var(--surface-page))", borderRadius: 3, position: "relative", overflow: "hidden", border: "1px solid var(--surface-border)" }}>
              <svg viewBox="0 0 200 180" preserveAspectRatio="xMidYMid meet" style={{ width: "100%", height: "100%" }}>
                <path d="M 60 15 L 150 15 L 158 35 L 168 40 L 175 60 L 178 80 L 180 105 L 175 130 L 165 145 L 145 155 L 120 158 L 95 152 L 75 142 L 55 125 L 45 105 L 38 85 L 32 65 L 38 45 L 50 28 L 60 15 Z" fill="color-mix(in srgb, var(--brand-primary) 18%, transparent)" stroke="var(--surface-border)" strokeWidth="0.8" />
                <circle cx="120" cy="78" r="4" fill="var(--brand-primary)" opacity={0.85} />
                <circle cx="100" cy="120" r="5" fill="var(--brand-primary)" opacity={0.85} />
                <circle cx="138" cy="105" r="3" fill="var(--brand-primary)" opacity={0.85} />
                <circle cx="68" cy="95" r="2.5" fill="var(--color-error, #B23A3A)" />
              </svg>
            </div>
            <div style={{ marginTop: 8, fontSize: "0.72rem", color: "var(--text-muted)", display: "flex", justifyContent: "space-between" }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><span style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--brand-primary)" }} /> Active project</span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><span style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--color-error, #B23A3A)" }} /> Risk</span>
            </div>
          </div>

          <div style={{ background: "var(--surface-raised)", border: "1px solid var(--surface-border)", borderRadius: "var(--radius-md)", padding: "14px 16px" }}>
            <h3 style={tiSecHead}>Recent alerts</h3>
            <ul style={{ listStyle: "none", margin: "10px 0 0", padding: 0, display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { icon: "alert-triangle", color: "var(--color-error, #B23A3A)", t: "I-45 ROW lag 14%", s: "Houston · 2h ago" },
                { icon: "info", color: "var(--brand-primary)", t: "FY 2026 budget revisions posted", s: "Statewide · today" },
                { icon: "info", color: "var(--text-secondary)", t: "Q1 audit baseline available", s: "Statewide · yesterday" },
              ].map((a, i) => (
                <li key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                  <span style={{ color: a.color, marginTop: 2 }}><LucideIcon name={a.icon} size={13} /></span>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: "0.82rem", color: "var(--text-primary)", fontWeight: 500 }}>{a.t}</div>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--text-muted)", marginTop: 1 }}>{a.s}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
const tiFilterChip = { display: "inline-flex", alignItems: "center", gap: 6, padding: "3px 10px", background: "color-mix(in srgb, var(--brand-primary) 8%, transparent)", color: "var(--brand-primary)", fontSize: "0.74rem", fontFamily: "var(--font-body-bold)", fontWeight: 600, borderRadius: 3, border: "1px solid color-mix(in srgb, var(--brand-primary) 22%, transparent)" };
const tiSecHead = { fontFamily: "var(--font-display)", fontSize: "0.95rem", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.04em", margin: 0, color: "var(--text-primary)" };
const tiSeeAll = { fontFamily: "var(--font-body-bold)", fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.09em", color: "var(--brand-primary)", textDecoration: "none" };
const tiTrackLabel = { fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.11em", color: "var(--text-muted)", fontFamily: "var(--font-body-bold)", marginBottom: 5 };
const tiTh = { textAlign: "left", padding: "10px 14px", fontSize: "0.66rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-muted)", fontFamily: "var(--font-body-bold)", borderBottom: "1px solid var(--surface-border)" };
const tiTd = { padding: "10px 14px", borderBottom: "1px solid var(--surface-border)", color: "var(--text-secondary)", fontSize: "0.84rem" };

function ResearchDashboardPage() {
  const item = (window.AGGIE_CATALOG || []).find(c => c.id === "tmpl-research-dashboard");
  return (
    <PageShell item={item}>
      <TIIntro>
        PECAN-class research-app dashboard: filter strip · 4-stat row · corridor-strip chart · top-projects table · district map · alerts rail. Composes the existing families <code>data-tables</code>, <code>chart-foundations</code>, <code>corridor-strip</code>, <code>map-legend</code>, <code>buttons</code>, <code>chips</code>, and the survey-rhythm density baseline.
      </TIIntro>
      <TILineage>Microsoft Fabric page-templates (data-app shape) + Apple HIG sidebar/header rhythm.</TILineage>
      <TIBox label="Research dashboard · full template">
        <TIResearchDashboard />
      </TIBox>
      <TISpecRow>
        <TISpec label="Layout" value="header · stats · 1fr / 280px" note="Single column at md; sidebar collapses to bottom" />
        <TISpec label="Stats row" value="4-up · Oswald 2.4rem" note="Color delta per metric direction" />
        <TISpec label="Body grid" value="minmax(0,1fr) 280px" note="Right rail is sticky in real implementation" />
        <TISpec label="Composes" value="11 families" note="Data viz + tables + nav + chips" />
      </TISpecRow>
    </PageShell>
  );
}

// ════════════════════════════════════════════════════════════════════════
// 2. DOCUMENT DETAIL
// ════════════════════════════════════════════════════════════════════════
function TIDocumentDetail() {
  return (
    <div style={{ background: "var(--surface-page)", minHeight: 720 }}>
      <TIPageHeader
        eyebrow="Research record · 2026-014"
        title="Connected freight corridor · annual review FY 2026"
        breadcrumbs={["Research", "Reports", "Annual reviews", "2026-014"]}
        actions={<>
          <TIBtn icon="download">Export PDF</TIBtn>
          <TIBtn icon="share-2">Share</TIBtn>
          <TIBtn icon="bookmark" primary>Cite this</TIBtn>
        </>}
      />

      <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) 240px", gap: 32, padding: "28px 32px 48px", maxWidth: 1180, margin: "0 auto" }}>
        <article>
          {/* Metadata row */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, auto)", gap: 28, paddingBottom: 18, marginBottom: 22, borderBottom: "1px solid var(--surface-border)", flexWrap: "wrap" }}>
            <div><div style={tiMetaLabel}>Authors</div><div style={tiMetaValue}>M. Reyes, L. Whitfield, C. Okafor</div></div>
            <div><div style={tiMetaLabel}>Published</div><div style={{ ...tiMetaValue, fontFamily: "var(--font-mono)" }}>2026-05-08</div></div>
            <div><div style={tiMetaLabel}>Report ID</div><div style={{ ...tiMetaValue, fontFamily: "var(--font-mono)" }}>RPT-2026-014</div></div>
            <div><div style={tiMetaLabel}>Pages</div><div style={{ ...tiMetaValue, fontFamily: "var(--font-mono)" }}>42</div></div>
          </div>

          <h3 id="abstract" style={tiH3}>Abstract</h3>
          <p style={tiP}>This report reviews TTI's connected-freight-corridor research portfolio for FY 2026. Across six instrumented segments on I-35, I-10, and US-290, the program collected 4.8 million probe-vehicle records and produced 12 peer-reviewed manuscripts.</p>
          <p style={tiP}>Three findings are foregrounded: <strong style={{ color: "var(--text-primary)" }}>(1) freight share on I-10 west of San Antonio exceeds 48%</strong>, the highest in the dataset; <strong style={{ color: "var(--text-primary)" }}>(2) scoped-retraining of the ITAR-tier classifier reduced false-positive rate by 38% across three corpora</strong>; and <strong style={{ color: "var(--text-primary)" }}>(3) the I-35 Capital Express scoping decision is on track for Q3 closure pending environmental sign-off</strong>.</p>

          <h3 id="findings" style={tiH3}>Findings</h3>
          <p style={tiP}>The dataset combined INRIX probe data, wave-tronix counters at six stations, and CRIS crash records over a 24-month window. Three corridors drove 78% of high-FP cases [<sup style={tiSup}>1</sup>], summarized in Table 4-2 below.</p>

          <figure style={{ margin: "18px 0 22px" }}>
            <div style={{ overflow: "hidden", border: "1px solid var(--surface-border)", borderRadius: "var(--radius-sm)" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "var(--font-body)", color: "var(--text-secondary)" }}>
                <thead><tr style={{ background: "var(--surface-sunken)" }}>
                  {["Corridor", "Sites", "Delay (min ± CI)", "Freight %", "FP rate"].map(h => <th key={h} style={tiTh}>{h}</th>)}
                </tr></thead>
                <tbody>
                  {[
                    ["I-35 Austin",    "412", "18.4 ± 1.2", "23.6", "0.12"],
                    ["I-10 El Paso",   "286", "21.0 ± 1.6", "48.2", "0.24"],
                    ["US-290 Houston", "318", "12.1 ± 0.9", "31.4", "0.17"],
                  ].map((r, i) => (
                    <tr key={i}>
                      {r.map((c, j) => <td key={j} style={{ ...tiTd, fontFamily: j === 0 ? "inherit" : "var(--font-mono)", textAlign: j === 0 ? "left" : "right", color: j === 0 ? "var(--text-primary)" : "var(--text-secondary)", fontWeight: j === 0 ? 600 : 400 }}>{c}</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <figcaption style={{ marginTop: 8, fontSize: "0.78rem", color: "var(--text-muted)", fontStyle: "italic" }}>Table 4-2 · Mean delay and freight-share by corridor, FY 2026</figcaption>
          </figure>

          <h3 id="recommendations" style={tiH3}>Recommendations</h3>
          <p style={tiP}>Three recommended actions follow from the findings: (a) extend the I-10 El Paso instrumentation to MP 18, (b) commission a scoped retrain of the ITAR-tier classifier per rubric §3.2 [<sup style={tiSup}>2</sup>], and (c) advance the I-35 Capital Express scoping to letting in Q4.</p>

          {/* Footnotes */}
          <div style={{ marginTop: 30, paddingTop: 16, borderTop: "1px solid var(--surface-border)" }}>
            <div style={tiMetaLabel}>References</div>
            <ol style={{ margin: "10px 0 0 18px", padding: 0, fontSize: "0.84rem", color: "var(--text-secondary)", lineHeight: 1.65 }}>
              <li>Q1 2024 classifier audit · grants-2024/audits/q1-2024-classifier-audit.md</li>
              <li>ITAR tier rubric v2.1, §3.2 · classifiers-docs/itar/rubric-v2.1.pdf</li>
            </ol>
          </div>
        </article>

        {/* TOC rail */}
        <aside style={{ alignSelf: "start", position: "sticky", top: 24 }}>
          <div style={{ fontSize: "0.62rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em", color: "var(--text-muted)", fontFamily: "var(--font-body-bold)", marginBottom: 10 }}>On this page</div>
          <nav style={{ display: "flex", flexDirection: "column", gap: 2, borderLeft: "1px solid var(--surface-border)", paddingLeft: 14 }}>
            {[{ id: "abstract", label: "Abstract" }, { id: "findings", label: "Findings", active: true }, { id: "recommendations", label: "Recommendations" }, { id: "method", label: "Methodology" }, { id: "data", label: "Data sources" }].map((s) => (
              <a key={s.id} href={`#${s.id}`} onClick={(e) => e.preventDefault()} style={{ display: "block", padding: "5px 0", paddingLeft: 8, marginLeft: -15, borderLeft: s.active ? "2px solid var(--brand-primary)" : "2px solid transparent", textDecoration: "none", fontSize: "0.82rem", fontWeight: s.active ? 600 : 500, color: s.active ? "var(--brand-primary)" : "var(--text-secondary)" }}>
                {s.label}
              </a>
            ))}
          </nav>

          <div style={{ marginTop: 26 }}>
            <div style={{ fontSize: "0.62rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em", color: "var(--text-muted)", fontFamily: "var(--font-body-bold)", marginBottom: 10 }}>Related</div>
            <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                "RPT-2025-022 · FY 2025 review",
                "RPT-2024-008 · ITAR retrain scope",
                "DATA-2026-003 · INRIX Q1 dump",
              ].map((r, i) => (
                <li key={i}><a href="#" onClick={(e) => e.preventDefault()} style={{ fontSize: "0.78rem", color: "var(--text-secondary)", textDecoration: "none", display: "block", lineHeight: 1.4 }}>{r}</a></li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
const tiMetaLabel = { fontSize: "0.62rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--text-muted)", fontFamily: "var(--font-body-bold)" };
const tiMetaValue = { fontSize: "0.86rem", color: "var(--text-primary)", marginTop: 3, fontWeight: 500 };
const tiH3 = { fontFamily: "var(--font-display)", fontSize: "1.25rem", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.02em", margin: "24px 0 12px", color: "var(--text-primary)" };
const tiP = { fontSize: "0.95rem", lineHeight: 1.7, color: "var(--text-secondary)", margin: "0 0 14px" };
const tiSup = { color: "var(--brand-primary)", fontFamily: "var(--font-mono)", fontSize: "0.7rem", fontWeight: 700, marginLeft: 2 };

function DocumentDetailPage() {
  const item = (window.AGGIE_CATALOG || []).find(c => c.id === "tmpl-document-detail");
  return (
    <PageShell item={item}>
      <TIIntro>
        Long-form research record: header with metadata, body with TOC rail, sticky on-this-page nav, related-link sidebar. Composes <code>page-headers</code>, <code>standard-page-header</code>, <code>data-tables</code>, <code>toc</code>, <code>description-list</code>, and <code>buttons</code>.
      </TIIntro>
      <TILineage>Apple HIG long-form documents + tti-docs editorial rhythm. References + on-this-page nav follow Material 3 documentation patterns.</TILineage>
      <TIBox label="Document detail · full template">
        <TIDocumentDetail />
      </TIBox>
      <TISpecRow>
        <TISpec label="Body width" value="max 1180px · 32px margins" note="One-column at md; TOC moves to top" />
        <TISpec label="Sticky TOC" value="240px rail" note="Active section highlighted with 2px maroon left-rule" />
        <TISpec label="Footnotes" value="numbered · mono" note="Sup [n] inline · resolved at page bottom" />
        <TISpec label="Composes" value="6 families" note="Page header + table + TOC + description-list + buttons" />
      </TISpecRow>
    </PageShell>
  );
}

// ════════════════════════════════════════════════════════════════════════
// 3. SETTINGS SHELL
// ════════════════════════════════════════════════════════════════════════
function TISettingsShell() {
  return (
    <div style={{ background: "var(--surface-page)", minHeight: 640 }}>
      <TIPageHeader
        eyebrow="Account"
        title="Settings"
        actions={<TIBtn icon="search">Search settings</TIBtn>}
      />
      <div style={{ display: "grid", gridTemplateColumns: "260px minmax(0,1fr)", borderBottom: "1px solid var(--surface-border)", minHeight: 560 }}>
        {/* Left rail */}
        <nav style={{ background: "var(--surface-raised)", borderRight: "1px solid var(--surface-border)", padding: "20px 0" }}>
          {[
            { label: "Account", items: [
              { id: "profile", l: "Profile", i: "user", active: true },
              { id: "notif",   l: "Notifications", i: "bell", badge: "3" },
              { id: "creds",   l: "Credentials", i: "key-round" },
            ]},
            { label: "Workspace", items: [
              { id: "team",  l: "Team members", i: "users" },
              { id: "bill",  l: "Billing", i: "credit-card" },
              { id: "api",   l: "API & tokens", i: "key" },
            ]},
            { label: "Advanced", items: [
              { id: "data",   l: "Data export", i: "database" },
              { id: "danger", l: "Danger zone", i: "alert-octagon" },
            ]},
          ].map((g, gi) => (
            <div key={gi} style={{ marginBottom: 16 }}>
              <div style={{ padding: "0 20px 6px", fontSize: "0.62rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em", color: "var(--text-muted)", fontFamily: "var(--font-body-bold)" }}>{g.label}</div>
              {g.items.map(it => (
                <button key={it.id} style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "9px 20px", background: it.active ? "color-mix(in srgb, var(--brand-primary) 6%, transparent)" : "transparent", border: "none", borderLeft: it.active ? "3px solid var(--brand-primary)" : "3px solid transparent", textAlign: "left", color: it.active ? "var(--brand-primary)" : "var(--text-secondary)", fontFamily: "inherit", fontSize: "0.85rem", fontWeight: it.active ? 600 : 500, cursor: "pointer" }}>
                  <LucideIcon name={it.i} size={14} />
                  <span style={{ flex: 1 }}>{it.l}</span>
                  {it.badge && <span style={{ fontSize: "0.65rem", padding: "1px 7px", borderRadius: 10, background: "var(--brand-primary)", color: "white", fontFamily: "var(--font-mono)", fontWeight: 700, minWidth: 18, textAlign: "center" }}>{it.badge}</span>}
                </button>
              ))}
            </div>
          ))}
        </nav>

        {/* Panel */}
        <div style={{ padding: "28px 32px" }}>
          <div style={{ fontSize: "0.62rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em", color: "var(--text-muted)", fontFamily: "var(--font-body-bold)", marginBottom: 4 }}>Account · Profile</div>
          <h3 style={{ ...tiH3, marginTop: 0, marginBottom: 6 }}>Your profile</h3>
          <p style={{ fontSize: "0.9rem", lineHeight: 1.55, color: "var(--text-secondary)", marginTop: 0, marginBottom: 22, maxWidth: 540 }}>Visible on the staff directory and on publications. Email is your TAMUS SSO address and cannot be changed here.</p>

          {/* Form */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "var(--rhythm-loose, 16px) var(--rhythm-roomy, 24px)", maxWidth: 720 }}>
            {[
              { id: "ts-name", l: "Display name", v: "Linda Whitfield", req: true },
              { id: "ts-title", l: "Title", v: "Senior Research Scientist" },
              { id: "ts-dept", l: "Department", v: "Mobility Division" },
              { id: "ts-phone", l: "Phone", v: "(979) 555-0149" },
            ].map(f => (
              <div key={f.id}>
                <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-primary)", fontFamily: "var(--font-body-bold)", marginBottom: 6 }}>
                  {f.l}{f.req && <span aria-hidden style={{ color: "var(--color-danger)", marginLeft: 4 }}>*</span>}
                </label>
                <input defaultValue={f.v} style={{ width: "100%", height: 40, padding: "0 12px", border: "1px solid var(--surface-border)", borderRadius: "var(--radius-md)", background: "var(--surface-raised)", fontFamily: "inherit", fontSize: "0.88rem", color: "var(--text-primary)", outline: "none", boxSizing: "border-box" }} />
              </div>
            ))}
            <div style={{ gridColumn: "1 / -1" }}>
              <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-primary)", fontFamily: "var(--font-body-bold)", marginBottom: 6 }}>Bio</label>
              <textarea rows={3} defaultValue="Research scientist focused on connected-vehicle and freight-corridor performance. PhD in Civil Engineering, Texas A&M University." style={{ width: "100%", padding: "10px 12px", border: "1px solid var(--surface-border)", borderRadius: "var(--radius-md)", background: "var(--surface-raised)", fontFamily: "inherit", fontSize: "0.88rem", color: "var(--text-primary)", outline: "none", boxSizing: "border-box", lineHeight: 1.5, resize: "vertical" }} />
            </div>
          </div>

          <div style={{ marginTop: 28, paddingTop: 18, borderTop: "1px solid var(--surface-border)", display: "flex", gap: 10 }}>
            <TIBtn icon="check" primary>Save changes</TIBtn>
            <TIBtn>Cancel</TIBtn>
          </div>
        </div>
      </div>
    </div>
  );
}

function SettingsShellPage() {
  const item = (window.AGGIE_CATALOG || []).find(c => c.id === "tmpl-settings-shell");
  return (
    <PageShell item={item}>
      <TIIntro>
        Vertical-tab settings page. Three groups (Account / Workspace / Advanced), one with a danger-tone badge, a profile-edit panel with the standard form layout. Composes <code>tabs-vertical</code>, <code>field-grid</code> (standard density), <code>form-text</code>, and <code>buttons</code>.
      </TIIntro>
      <TILineage>Apple HIG macOS Settings + Microsoft Fabric pivot-page anatomy.</TILineage>
      <TIBox label="Settings shell · full template">
        <TISettingsShell />
      </TIBox>
      <TISpecRow>
        <TISpec label="Layout" value="260px rail · minmax(0,1fr)" note="Sticky rail at lg+; drawer at md" />
        <TISpec label="Rail items" value="3 groups · 8 items" note="Groups + section labels + badge on 1" />
        <TISpec label="Panel density" value="standard (40px)" note="40px inputs · 2-column form grid" />
        <TISpec label="Composes" value="4 families" note="Tabs-vertical + field-grid + form-text + buttons" />
      </TISpecRow>
    </PageShell>
  );
}

// ════════════════════════════════════════════════════════════════════════
// 4. LIST-DETAIL SPLIT
// ════════════════════════════════════════════════════════════════════════
function TIListDetailSplit() {
  const [selectedId, setSelectedId] = _tiUseState("PRJ-2841");
  const rows = [
    { id: "PRJ-2841", title: "I-35 Capital Express",     district: "Austin",       phase: "Construction",  status: "Active", delay: "18.4", ago: "2h" },
    { id: "PRJ-2847", title: "I-45 Central Sustained",   district: "Houston",      phase: "Construction",  status: "Risk",   delay: "28.7", ago: "1d" },
    { id: "PRJ-2844", title: "I-10 Border Freight",      district: "El Paso",      phase: "Construction",  status: "Active", delay: "21.0", ago: "2d" },
    { id: "PRJ-2842", title: "US-290 East Reliever",     district: "Houston",      phase: "Design 60%",    status: "Active", delay: "12.1", ago: "3d" },
    { id: "PRJ-2845", title: "Loop 1604 Reconstruction", district: "San Antonio",  phase: "Design 90%",    status: "Active", delay: "9.3",  ago: "4d" },
    { id: "PRJ-2848", title: "US-59 Lufkin Bypass",      district: "Atlanta",      phase: "Design 30%",    status: "Active", delay: "6.8",  ago: "5d" },
  ];
  const sel = rows.find(r => r.id === selectedId) || rows[0];
  const statusColors = {
    "Active":  { c: "var(--color-success)" },
    "Risk":    { c: "var(--color-error, #B23A3A)" },
  };
  return (
    <div style={{ background: "var(--surface-page)", minHeight: 640 }}>
      <TIPageHeader
        eyebrow="PECAN · Projects"
        title="Corridor projects · 184 active"
        breadcrumbs={["PECAN", "Projects"]}
        actions={<>
          <TIBtn icon="filter">Filter</TIBtn>
          <TIBtn icon="plus" primary>New project</TIBtn>
        </>}
      />

      <div style={{ display: "grid", gridTemplateColumns: "380px minmax(0,1fr)", minHeight: 560, borderBottom: "1px solid var(--surface-border)" }}>
        {/* List pane */}
        <aside style={{ borderRight: "1px solid var(--surface-border)", background: "var(--surface-raised)", overflowY: "auto" }}>
          <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--surface-border)", display: "flex", alignItems: "center", gap: 6 }}>
            <LucideIcon name="search" size={13} color="var(--text-muted)" />
            <input placeholder="Search projects…" style={{ flex: 1, border: "none", outline: "none", background: "transparent", fontFamily: "inherit", fontSize: "0.82rem", color: "var(--text-primary)" }} />
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", padding: "1px 5px", background: "var(--surface-sunken)", border: "1px solid var(--surface-border)", borderRadius: 3, color: "var(--text-muted)" }}>⌘K</span>
          </div>
          {rows.map(r => {
            const isSel = r.id === selectedId;
            const s = statusColors[r.status] || { c: "var(--text-muted)" };
            return (
              <button key={r.id} onClick={() => setSelectedId(r.id)} style={{ width: "100%", display: "block", padding: "12px 16px", textAlign: "left", background: isSel ? "color-mix(in srgb, var(--brand-primary) 5%, transparent)" : "transparent", borderLeft: isSel ? "3px solid var(--brand-primary)" : "3px solid transparent", border: "none", borderBottom: "1px solid var(--surface-border)", cursor: "pointer", fontFamily: "inherit" }}>
                <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 10 }}>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span aria-hidden style={{ width: 5, height: 5, borderRadius: "50%", background: s.c }} />
                      <span style={{ fontSize: "0.86rem", fontWeight: isSel ? 600 : 500, color: "var(--text-primary)" }}>{r.title}</span>
                    </div>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: "var(--text-muted)", marginTop: 2 }}>{r.id} · {r.district} · {r.phase}</div>
                  </div>
                  <div style={{ flexShrink: 0, fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--text-muted)" }}>{r.ago}</div>
                </div>
              </button>
            );
          })}
        </aside>

        {/* Detail pane */}
        <section style={{ padding: "26px 32px" }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, marginBottom: 16 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                <span aria-hidden style={{ width: 6, height: 6, borderRadius: "50%", background: statusColors[sel.status]?.c }} />
                <span style={{ fontSize: "0.66rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em", color: statusColors[sel.status]?.c, fontFamily: "var(--font-body-bold)" }}>{sel.status}</span>
              </div>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.45rem", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.01em", margin: 0, lineHeight: 1.15 }}>{sel.title}</h3>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.78rem", color: "var(--text-muted)", marginTop: 4 }}>{sel.id} · {sel.district} · {sel.phase}</div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <TIBtn icon="edit-3">Edit</TIBtn>
              <TIBtn icon="archive">Archive</TIBtn>
            </div>
          </div>

          {/* Description list */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "var(--rhythm-loose, 16px)", padding: "16px 0", borderTop: "1px solid var(--surface-border)", borderBottom: "1px solid var(--surface-border)" }}>
            {[
              ["Lead",          "Linda Whitfield"],
              ["Budget",        "$482.0M"],
              ["Started",       "2024-03-12"],
              ["Target",        "2026-08-31"],
              ["Delay (5y avg)",`${sel.delay} min`],
              ["Freight share", "23.6%"],
            ].map(([k, v]) => (
              <div key={k}>
                <div style={tiMetaLabel}>{k}</div>
                <div style={{ ...tiMetaValue, fontFamily: k.includes("$") || k.startsWith("Start") || k.startsWith("Tar") || k.startsWith("Delay") || k.startsWith("Freight") ? "var(--font-mono)" : "inherit" }}>{v}</div>
              </div>
            ))}
          </div>

          <h4 style={{ ...tiH3, fontSize: "0.95rem", marginTop: 22, marginBottom: 10 }}>Scope summary</h4>
          <p style={{ fontSize: "0.92rem", lineHeight: 1.65, color: "var(--text-secondary)", margin: 0 }}>
            Adds two managed lanes Williamson → Hays. Tolling per FasTrak §4.2. Coordinated with City of Austin BRT extension. Estimated 28 mo construction window. Wildlife corridor mitigation in segments 4 and 7.
          </p>

          <h4 style={{ ...tiH3, fontSize: "0.95rem", marginTop: 24, marginBottom: 10 }}>Recent activity</h4>
          <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { icon: "check-circle", c: "var(--color-success)", t: "ROW acquisition for Segment 4 signed", who: "L. Whitfield · 2h ago" },
              { icon: "alert-triangle", c: "var(--brand-accent)", t: "Schedule risk flagged: utility relocation lag", who: "Project review · yesterday" },
              { icon: "file-text", c: "var(--text-secondary)", t: "Q1 progress report published as RPT-2026-014", who: "M. Reyes · 3d ago" },
            ].map((a, i) => (
              <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "10px 14px", background: "var(--surface-raised)", border: "1px solid var(--surface-border)", borderRadius: "var(--radius-sm)" }}>
                <span style={{ color: a.c, marginTop: 1 }}><LucideIcon name={a.icon} size={14} /></span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: "0.86rem", color: "var(--text-primary)", fontWeight: 500 }}>{a.t}</div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: "var(--text-muted)", marginTop: 1 }}>{a.who}</div>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}

function ListDetailSplitPage() {
  const item = (window.AGGIE_CATALOG || []).find(c => c.id === "tmpl-list-detail-split");
  return (
    <PageShell item={item}>
      <TIIntro>
        Mail-style two-pane layout: scrollable list on the left, selected detail on the right. Composes <code>rich-data-grid</code> rows · <code>descriptions</code> · <code>buttons</code> · <code>badge-chip-tag</code>. Click any row in the demo to see the detail update.
      </TIIntro>
      <TILineage>Apple HIG Mail / Microsoft Fabric two-pane editor.</TILineage>
      <TIBox label="List-detail split · full template · interactive">
        <TIListDetailSplit />
      </TIBox>
      <TISpecRow>
        <TISpec label="List width" value="380px fixed" note="Comfortable for project + meta lines" />
        <TISpec label="Active" value="5% maroon tint · 3px rule" note="Same as sidebar / tabs-vertical pattern" />
        <TISpec label="Detail body" value="standard density" note="Description list + activity feed compose" />
        <TISpec label="Composes" value="5 families" note="Data grid + descriptions + buttons + activity feed" />
      </TISpecRow>
    </PageShell>
  );
}

window.ResearchDashboardPage = ResearchDashboardPage;
window.DocumentDetailPage = DocumentDetailPage;
window.SettingsShellPage = SettingsShellPage;
window.ListDetailSplitPage = ListDetailSplitPage;
