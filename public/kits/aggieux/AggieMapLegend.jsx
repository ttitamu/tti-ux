/* global React, PageShell, AGGIE_CATALOG, LucideIcon */
/*
 * AggieMapLegend.jsx — Batch B.2: Map legend & attribution.
 *
 * The signage system that overlays any map. Legends, scale bars, north
 * arrows, and source attribution — formal enough for an exhibit-grade
 * report, restrained enough to embed in an interactive dashboard.
 *
 * Helper prefix: ML (Map Legend).
 */

// Shared helpers
function MLBox({ dark = false, label, padded = true, children }) {
  return (
    <div style={{ border: "1px solid var(--surface-border)", borderRadius: "var(--radius-md)", overflow: "hidden", marginBottom: 16 }}>
      <div style={{ padding: "7px 14px", fontSize: "0.62rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: dark ? "rgba(255,255,255,0.85)" : "var(--text-muted)", fontFamily: "var(--font-body-bold)", background: dark ? "var(--brand-primary)" : "var(--surface-sunken)", borderBottom: "1px solid var(--surface-border)", display: "flex", justifyContent: "space-between" }}>
        <span>{label}</span><span style={{ fontFamily: "var(--font-mono)", fontWeight: 500, opacity: 0.7 }}>on {dark ? "dark" : "light"}</span>
      </div>
      <div style={{ padding: padded ? 24 : 0, background: dark ? "var(--brand-primary)" : "var(--surface-page)" }}>{children}</div>
    </div>
  );
}
function MLSectionLabel({ children }) {
  return <div style={{ fontSize: "0.62rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--text-muted)", fontFamily: "var(--font-body-bold)", marginBottom: 12, marginTop: 28 }}>{children}</div>;
}
function MLIntro({ children }) {
  return <div style={{ padding: "16px 20px", marginBottom: 28, background: "color-mix(in srgb, var(--brand-primary) 5%, transparent)", borderLeft: "3px solid var(--brand-primary)", borderRadius: "0 var(--radius-sm) var(--radius-sm) 0", fontSize: "0.92rem", lineHeight: 1.65, color: "var(--text-secondary)" }}>{children}</div>;
}
function MLSpecRow({ children }) {
  return <div style={{ marginTop: 28, padding: "14px 18px", border: "1px solid var(--surface-border)", borderRadius: "var(--radius-md)", background: "var(--surface-raised)", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>{children}</div>;
}
function MLSpec({ label, value, note }) {
  return (
    <div>
      <div style={{ fontSize: "0.6rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-muted)", fontFamily: "var(--font-body-bold)" }}>{label}</div>
      <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem", color: "var(--brand-primary)", marginTop: 3, fontWeight: 500 }}>{value}</div>
      {note && <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: 2, lineHeight: 1.4 }}>{note}</div>}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════
// Legend kinds — choropleth, categorical, graduated, bivariate
// ════════════════════════════════════════════════════════════════════════

function MLChoroplethLegend({ title = "Daily VMT", unit = "millions", stops = [0, 5, 10, 20, 35, 50] }) {
  const colors = [
    "color-mix(in srgb, var(--brand-primary) 8%, var(--surface-page))",
    "color-mix(in srgb, var(--brand-primary) 22%, var(--surface-page))",
    "color-mix(in srgb, var(--brand-primary) 40%, var(--surface-page))",
    "color-mix(in srgb, var(--brand-primary) 60%, var(--surface-page))",
    "color-mix(in srgb, var(--brand-primary) 80%, var(--surface-page))",
    "var(--brand-primary)",
  ];
  return (
    <div style={{ display: "inline-block", padding: "12px 14px", background: "var(--surface-raised)", border: "1px solid var(--surface-border)", borderRadius: "var(--radius-sm)", boxShadow: "var(--shadow-sm)" }}>
      <div style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-primary)", fontFamily: "var(--font-body-bold)", marginBottom: 2 }}>{title}</div>
      <div style={{ fontSize: "0.66rem", color: "var(--text-muted)", fontFamily: "var(--font-mono)", marginBottom: 8 }}>{unit}</div>
      <div style={{ display: "flex", height: 12, borderRadius: 2, overflow: "hidden" }}>
        {colors.map((c, i) => <div key={i} style={{ flex: 1, background: c }} />)}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4, fontFamily: "var(--font-mono)", fontSize: "0.66rem", color: "var(--text-muted)" }}>
        {stops.map((s, i) => <span key={i}>{s}</span>)}
      </div>
    </div>
  );
}

function MLCategoricalLegend({ title = "TxDOT district", items }) {
  const defaults = [
    { label: "Atlanta",     color: "oklch(0.55 0.15 12)" },
    { label: "Austin",      color: "oklch(0.60 0.13 78)" },
    { label: "Dallas",      color: "oklch(0.50 0.16 220)" },
    { label: "El Paso",     color: "oklch(0.58 0.14 160)" },
    { label: "Fort Worth",  color: "oklch(0.55 0.13 300)" },
    { label: "Houston",     color: "oklch(0.50 0.18 35)" },
  ];
  const list = items || defaults;
  return (
    <div style={{ display: "inline-block", padding: "12px 14px", background: "var(--surface-raised)", border: "1px solid var(--surface-border)", borderRadius: "var(--radius-sm)", boxShadow: "var(--shadow-sm)" }}>
      <div style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-primary)", fontFamily: "var(--font-body-bold)", marginBottom: 8 }}>{title}</div>
      <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "grid", gap: 5 }}>
        {list.map((it, i) => (
          <li key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.78rem", color: "var(--text-secondary)" }}>
            <span style={{ width: 14, height: 10, background: it.color, borderRadius: 2, flexShrink: 0 }} />
            {it.label}
          </li>
        ))}
      </ul>
    </div>
  );
}

function MLGraduatedSymbolLegend({ title = "Crash count", values = [10, 50, 200] }) {
  return (
    <div style={{ display: "inline-block", padding: "12px 14px", background: "var(--surface-raised)", border: "1px solid var(--surface-border)", borderRadius: "var(--radius-sm)", boxShadow: "var(--shadow-sm)" }}>
      <div style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-primary)", fontFamily: "var(--font-body-bold)", marginBottom: 10 }}>{title}</div>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 14 }}>
        {values.map((v, i) => {
          const r = 4 + Math.sqrt(v) * 1.6;
          return (
            <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
              <span style={{ width: r * 2, height: r * 2, borderRadius: "50%", background: "color-mix(in srgb, var(--brand-primary) 35%, transparent)", border: "1.5px solid var(--brand-primary)" }} />
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.66rem", color: "var(--text-muted)" }}>{v}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function MLBivariateLegend({ titleX = "VMT", titleY = "Fatal rate" }) {
  // 3x3 grid mixing two channels
  const grid = [
    ["#f4ecec", "#e9c8d0", "#d493ad"],
    ["#e9d3c8", "#c8a59f", "#9a6378"],
    ["#d4ad8a", "#a37166", "#5C0025"],
  ];
  return (
    <div style={{ display: "inline-block", padding: "12px 14px", background: "var(--surface-raised)", border: "1px solid var(--surface-border)", borderRadius: "var(--radius-sm)", boxShadow: "var(--shadow-sm)" }}>
      <div style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-primary)", fontFamily: "var(--font-body-bold)", marginBottom: 10 }}>Exposure × risk</div>
      <div style={{ display: "flex", gap: 8 }}>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", fontFamily: "var(--font-mono)", fontSize: "0.62rem", color: "var(--text-muted)", paddingBottom: 14 }}>
          <span>high</span><span>low</span>
        </div>
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 18px)", gridTemplateRows: "repeat(3, 18px)", gap: 1 }}>
            {grid.flatMap((row, ri) => row.map((c, ci) => <div key={`${ri}-${ci}`} style={{ background: c }} />))}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4, fontFamily: "var(--font-mono)", fontSize: "0.62rem", color: "var(--text-muted)", width: 56 }}>
            <span>low</span><span>high</span>
          </div>
        </div>
      </div>
      <div style={{ marginTop: 10, display: "flex", gap: 14, fontSize: "0.66rem", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
        <span>↕ {titleY}</span><span>↔ {titleX}</span>
      </div>
    </div>
  );
}

function MLFlowLegend() {
  return (
    <div style={{ display: "inline-block", padding: "12px 14px", background: "var(--surface-raised)", border: "1px solid var(--surface-border)", borderRadius: "var(--radius-sm)", boxShadow: "var(--shadow-sm)" }}>
      <div style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-primary)", fontFamily: "var(--font-body-bold)", marginBottom: 10 }}>Daily trips</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {[{ w: 1, label: "< 5,000" }, { w: 3, label: "5,000–20,000" }, { w: 6, label: "20,000–100,000" }, { w: 10, label: "> 100,000" }].map((it, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: "0.74rem", color: "var(--text-secondary)" }}>
            <svg width={50} height={12} aria-hidden>
              <line x1={2} y1={6} x2={48} y2={6} stroke="var(--brand-primary)" strokeWidth={it.w} strokeLinecap="round" opacity={0.85} />
            </svg>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem" }}>{it.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Scale bar + north arrow + attribution
function MLScaleBar({ km = 100 }) {
  return (
    <div style={{ display: "inline-flex", flexDirection: "column", alignItems: "flex-start", padding: "6px 8px", background: "color-mix(in srgb, var(--surface-raised) 92%, transparent)", border: "1px solid var(--surface-border)", borderRadius: 3 }}>
      <div style={{ display: "flex", height: 4, width: 120 }}>
        <div style={{ flex: 1, background: "var(--text-primary)" }} />
        <div style={{ flex: 1, background: "var(--surface-raised)", borderTop: "1px solid var(--text-primary)", borderBottom: "1px solid var(--text-primary)" }} />
        <div style={{ flex: 1, background: "var(--text-primary)" }} />
        <div style={{ flex: 1, background: "var(--surface-raised)", borderTop: "1px solid var(--text-primary)", borderBottom: "1px solid var(--text-primary)" }} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", width: 120, marginTop: 3, fontFamily: "var(--font-mono)", fontSize: "0.62rem", color: "var(--text-muted)" }}>
        <span>0</span><span>{km / 2}</span><span>{km} km</span>
      </div>
    </div>
  );
}

function MLNorthArrow() {
  return (
    <div style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", padding: "4px 8px", background: "color-mix(in srgb, var(--surface-raised) 92%, transparent)", border: "1px solid var(--surface-border)", borderRadius: 3 }}>
      <svg width={16} height={20} viewBox="0 0 16 20" aria-hidden>
        <polygon points="8,2 14,18 8,14 2,18" fill="var(--text-primary)" />
        <polygon points="8,2 8,14 2,18" fill="var(--surface-raised)" stroke="var(--text-primary)" strokeWidth={0.5} />
      </svg>
      <div style={{ fontFamily: "var(--font-body-bold)", fontWeight: 700, fontSize: "0.6rem", marginTop: 1, color: "var(--text-primary)" }}>N</div>
    </div>
  );
}

function MLAttribution({ basemap = "TxDOT districts (2024)", projection = "EPSG:3083 NAD83 / Texas Centric Albers", source = "TTI · TxDOT HSIP 2024" }) {
  return (
    <div style={{ display: "inline-block", maxWidth: 360, padding: "6px 10px", background: "color-mix(in srgb, var(--surface-raised) 92%, transparent)", border: "1px solid var(--surface-border)", borderRadius: 3, fontFamily: "var(--font-mono)", fontSize: "0.62rem", color: "var(--text-muted)", lineHeight: 1.5 }}>
      <span style={{ color: "var(--text-secondary)" }}>Basemap:</span> {basemap} · <span style={{ color: "var(--text-secondary)" }}>Proj:</span> {projection} · <span style={{ color: "var(--text-secondary)" }}>Source:</span> {source}
    </div>
  );
}

// Composed map demo — to show legends in situ
function MLMapDemo({ children, legendPos = "bottom-right" }) {
  const cornerStyle = {
    "top-left":     { top: 10, left: 10 },
    "top-right":    { top: 10, right: 10 },
    "bottom-left":  { bottom: 10, left: 10 },
    "bottom-right": { bottom: 10, right: 10 },
  };
  return (
    <div style={{ position: "relative", height: 320, background: "linear-gradient(135deg, color-mix(in srgb, var(--brand-primary) 4%, var(--surface-page)) 0%, var(--surface-page) 60%)", border: "1px solid var(--surface-border)", borderRadius: "var(--radius-sm)", overflow: "hidden" }}>
      {/* Stylized Texas silhouette */}
      <svg width="100%" height="100%" viewBox="0 0 600 320" preserveAspectRatio="xMidYMid meet" style={{ position: "absolute", inset: 0 }}>
        <path d="M 220 50 L 470 50 L 480 90 L 510 100 L 525 130 L 535 160 L 540 200 L 555 240 L 570 280 L 540 290 L 470 295 L 420 305 L 380 295 L 320 280 L 270 260 L 220 230 L 180 200 L 150 160 L 130 120 L 140 90 L 175 70 L 220 50 Z" fill="color-mix(in srgb, var(--brand-primary) 12%, var(--surface-page))" stroke="var(--surface-border)" strokeWidth="0.8" />
        <path d="M 270 80 L 350 80 L 360 110 L 320 115 L 280 105 Z" fill="color-mix(in srgb, var(--brand-primary) 28%, var(--surface-page))" stroke="var(--surface-border)" strokeWidth="0.5" />
        <circle cx={420} cy={180} r={6} fill="var(--brand-primary)" opacity={0.6} />
        <circle cx={350} cy={220} r={9} fill="var(--brand-primary)" opacity={0.6} />
        <circle cx={280} cy={170} r={4} fill="var(--brand-primary)" opacity={0.6} />
      </svg>
      {/* Overlays */}
      <div style={{ position: "absolute", top: 10, left: 10 }}>
        <MLNorthArrow />
      </div>
      <div style={{ position: "absolute", bottom: 10, left: 10 }}>
        <MLScaleBar km={100} />
      </div>
      <div style={{ position: "absolute", ...cornerStyle[legendPos] }}>
        {children}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════
// PAGE
// ════════════════════════════════════════════════════════════════════════

function MapLegendPage() {
  const item = (window.AGGIE_CATALOG || []).find(c => c.id === "map-legend");
  return (
    <PageShell item={item}>
      <MLIntro>
        The signage that overlays any map: <strong>legend</strong> (choropleth, categorical, graduated symbol, bivariate, flow), <strong>scale bar</strong>, <strong>north arrow</strong>, and <strong>attribution</strong>. Embeddable into a TTI map (chart-maps) or a third-party basemap (Mapbox, Leaflet) — surface, type, and color tokens are identical to the rest of the system.
      </MLIntro>

      {/* Legend kinds */}
      <MLSectionLabel>Legend kinds</MLSectionLabel>
      <MLBox label="Choropleth — sequential ramp, paired stops + unit">
        <div style={{ display: "flex", justifyContent: "center" }}><MLChoroplethLegend /></div>
      </MLBox>
      <MLBox label="Categorical — discrete swatches per class">
        <div style={{ display: "flex", justifyContent: "center" }}><MLCategoricalLegend /></div>
      </MLBox>
      <MLBox label="Graduated symbol — area-encoded magnitude">
        <div style={{ display: "flex", justifyContent: "center" }}><MLGraduatedSymbolLegend /></div>
      </MLBox>
      <MLBox label="Bivariate — two channels in a 3×3 grid">
        <div style={{ display: "flex", justifyContent: "center" }}><MLBivariateLegend /></div>
      </MLBox>
      <MLBox label="Flow — line weight encodes magnitude">
        <div style={{ display: "flex", justifyContent: "center" }}><MLFlowLegend /></div>
      </MLBox>

      {/* In situ */}
      <MLSectionLabel>In situ — map with full overlay set</MLSectionLabel>
      <MLBox label="Choropleth · north arrow · scale bar · legend (bottom-right)">
        <MLMapDemo legendPos="bottom-right">
          <MLChoroplethLegend />
        </MLMapDemo>
        <div style={{ marginTop: 10 }}>
          <MLAttribution />
        </div>
      </MLBox>
      <MLBox label="Graduated-symbol overlay · legend top-right">
        <MLMapDemo legendPos="top-right">
          <MLGraduatedSymbolLegend />
        </MLMapDemo>
      </MLBox>

      {/* Atomic overlays */}
      <MLSectionLabel>Atomic overlays</MLSectionLabel>
      <MLBox label="Scale bar · north arrow · attribution — the chrome that lives on every map">
        <div style={{ display: "flex", gap: 18, alignItems: "flex-end", flexWrap: "wrap" }}>
          <MLScaleBar km={100} />
          <MLScaleBar km={50} />
          <MLNorthArrow />
          <MLAttribution />
        </div>
      </MLBox>

      {/* Decision matrix */}
      <MLSectionLabel>When to use which</MLSectionLabel>
      <div style={{ overflow: "hidden", border: "1px solid var(--surface-border)", borderRadius: "var(--radius-md)", marginBottom: 16 }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.86rem" }}>
          <thead>
            <tr style={{ background: "var(--surface-sunken)" }}>
              {["Legend", "Encodes", "Best for", "Avoid when"].map(h => (
                <th key={h} style={{ textAlign: "left", padding: "10px 14px", fontSize: "0.66rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-muted)", fontFamily: "var(--font-body-bold)", borderBottom: "1px solid var(--surface-border)" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              ["Choropleth",          "Continuous quantity by area",         "VMT, density, rate per unit area",       "Areas vary wildly in size — use graduated symbol"],
              ["Categorical",         "Discrete class membership",            "TxDOT districts, land-use zones",        "Classes exceed 7 — viewer can't distinguish hues"],
              ["Graduated symbol",    "Magnitude by point area",              "Crash counts, station counts",           "Symbols overlap heavily — use heatmap"],
              ["Bivariate",           "Two correlated quantities",            "Exposure × risk, supply × demand",       "Casual audience — bivariate maps require legend literacy"],
              ["Flow",                "Magnitude along a line/path",          "Origin–destination, freight corridors",  "Many short segments at similar magnitude"],
            ].map((row, i) => (
              <tr key={i}>
                {row.map((cell, j) => (
                  <td key={j} style={{ padding: "12px 14px", borderBottom: i === 4 ? "none" : "1px solid var(--surface-border)", color: j === 0 ? "var(--text-primary)" : "var(--text-secondary)", fontWeight: j === 0 ? 600 : 400, lineHeight: 1.55 }}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <MLSpecRow>
        <MLSpec label="Surface"      value="--surface-raised" note="Translucent on dense basemaps via color-mix" />
        <MLSpec label="Title"        value="0.7rem · Work Sans 700" note="Uppercase eyebrow style for legend titles" />
        <MLSpec label="Numerals"     value="JetBrains Mono" note="Tabular figures align under ramp stops" />
        <MLSpec label="Attribution"  value="basemap · proj · source" note="Always present on exhibit-grade maps" />
      </MLSpecRow>
    </PageShell>
  );
}

Object.assign(window, { MapLegendPage });
