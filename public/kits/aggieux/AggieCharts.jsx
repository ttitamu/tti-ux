/* global React, PageShell, AGGIE_CATALOG, LucideIcon */
/*
 * AggieCharts.jsx — Batch 22 part 1:
 *   Chart foundations · Bar charts · Line charts
 *
 * Editorial-restraint chart system. Maroon primary, slate neutrals, hand-picked
 * categorical palette. Mono numerals. Uppercase eyebrow + signature rule above
 * every chart title to tie back to the section-style system.
 *
 * All charts are inline SVG — no chart library — to keep the kit self-contained
 * and the type system intact.
 *
 * Helper prefix: CH.
 * Categorical palette: window.CHART_PALETTE (also used by AggieChartsViz.jsx).
 */

const { useState: _chUseState, useMemo: _chUseMemo } = React;

// ────────────────────────────────────────────────────────────────────────
// Shared chart palette + tokens
// ────────────────────────────────────────────────────────────────────────

const CHART_PALETTE = [
  "var(--brand-primary)",       // 1 — maroon (always first; primary series)
  "#3F5A6F",                    // 2 — slate teal (cool secondary)
  "#C7973C",                    // 3 — wheat (warm complement)
  "#6B8E5A",                    // 4 — sage (neutral cool)
  "#8C5A3C",                    // 5 — clay (warm tertiary)
  "#5C7080",                    // 6 — fog (cool neutral)
  "#A33A3A",                    // 7 — rust red
  "#3C5A87",                    // 8 — deep blue
];

const CH_TYPE = {
  // Numerals always mono so figures align across rows + read tabular.
  numeral: { fontFamily: "var(--font-mono)", fontVariantNumeric: "tabular-nums" },
  // Axis labels — small uppercase, slightly tracked
  axis: { fontFamily: "var(--font-body-bold)", fontWeight: 700, fontSize: "0.62rem", textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--text-muted)" },
  // Series legend label
  legend: { fontFamily: "var(--font-body)", fontWeight: 500, fontSize: "0.78rem", color: "var(--text-secondary)" },
};

// ════════════════════════════════════════════════════════════════════════
// Page-level helpers (shared with AggieChartsViz.jsx via window)
// ════════════════════════════════════════════════════════════════════════

function CHIntro({ children }) {
  return (
    <div style={{
      borderLeft: "3px solid var(--brand-primary)",
      background: "color-mix(in srgb, var(--brand-primary) 4%, transparent)",
      padding: "16px 20px", marginBottom: 32,
      fontSize: "0.92rem", lineHeight: 1.65, color: "var(--text-secondary)",
    }}>
      {children}
    </div>
  );
}

function CHSectionLabel({ children }) {
  return (
    <div style={{
      fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase",
      letterSpacing: "0.14em", color: "var(--text-muted)",
      fontFamily: "var(--font-body-bold)",
      margin: "32px 0 14px", display: "flex", alignItems: "center", gap: 12,
    }}>
      <span style={{ flexShrink: 0 }}>{children}</span>
      <span style={{ flex: 1, height: 1, background: "var(--surface-border)" }} />
    </div>
  );
}

function CHBox({ label, dark, children }) {
  return (
    <div style={{
      border: "1px solid var(--surface-border)",
      borderRadius: "var(--radius-md)",
      overflow: "hidden", marginBottom: 24,
      background: dark ? "var(--tti-graphite, #1a1f24)" : "var(--surface-page)",
    }} data-theme={dark ? "tti-dark" : undefined}>
      {label && (
        <div style={{
          padding: "10px 16px",
          borderBottom: "1px solid var(--surface-border)",
          background: dark ? "rgba(255,255,255,0.03)" : "var(--surface-sunken)",
          fontSize: "0.66rem", fontWeight: 700, textTransform: "uppercase",
          letterSpacing: "0.14em", color: "var(--text-muted)",
          fontFamily: "var(--font-body-bold)",
        }}>{label}</div>
      )}
      <div style={{ padding: 28, color: dark ? "#E8E2D6" : "var(--text-primary)" }}>{children}</div>
    </div>
  );
}

function CHSpecRow({ children }) {
  return (
    <div style={{
      marginTop: 32,
      display: "grid", gridTemplateColumns: "repeat(4, 1fr)",
      border: "1px solid var(--surface-border)", borderRadius: "var(--radius-md)",
      overflow: "hidden", background: "var(--surface-raised)",
    }}>{children}</div>
  );
}

function CHSpec({ label, value, note }) {
  return (
    <div style={{ padding: "16px 18px", borderRight: "1px solid var(--surface-border)" }}>
      <div style={{ fontSize: "0.62rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--text-muted)", fontFamily: "var(--font-body-bold)", marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: "0.82rem", fontFamily: "var(--font-body-bold)", fontWeight: 600, color: "var(--text-primary)", marginBottom: 4 }}>{value}</div>
      {note && <div style={{ fontSize: "0.74rem", color: "var(--text-muted)", lineHeight: 1.45 }}>{note}</div>}
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────
// Chart-frame primitive — shared eyebrow / title / signature header
// ────────────────────────────────────────────────────────────────────────

function ChartFrame({ eyebrow, title, source, children, footnote }) {
  return (
    <div>
      {eyebrow && (
        <div style={{ fontSize: "0.62rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em", color: "var(--text-muted)", fontFamily: "var(--font-body-bold)", marginBottom: 6 }}>
          {eyebrow}
        </div>
      )}
      {title && (
        <div style={{ fontFamily: "var(--font-display)", fontSize: "1.15rem", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.01em", color: "var(--text-primary)", marginBottom: 4 }}>
          {title}
        </div>
      )}
      {/* Signature hairline */}
      <div style={{ height: 2, background: "linear-gradient(90deg, var(--brand-primary) 0%, var(--brand-primary) 30%, transparent 30%, transparent 100%)", marginBottom: 14 }} />
      {children}
      {(source || footnote) && (
        <div style={{ marginTop: 12, fontSize: "0.7rem", color: "var(--text-muted)", lineHeight: 1.5 }}>
          {source && <div style={{ fontFamily: "var(--font-body-bold)", fontWeight: 700, fontSize: "0.62rem", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 4 }}>Source · {source}</div>}
          {footnote && <div>{footnote}</div>}
        </div>
      )}
    </div>
  );
}

function Legend({ items, inline = true }) {
  return (
    <div style={{ display: "flex", gap: inline ? 18 : 8, flexDirection: inline ? "row" : "column", flexWrap: "wrap", marginBottom: 12 }}>
      {items.map((it, i) => (
        <div key={i} style={{ display: "inline-flex", alignItems: "center", gap: 7, ...CH_TYPE.legend }}>
          <span style={{ width: 12, height: 12, background: it.color, borderRadius: 1, flexShrink: 0 }} />
          <span>{it.label}</span>
          {it.value != null && <span style={{ ...CH_TYPE.numeral, color: "var(--text-primary)", fontWeight: 600, marginLeft: 4 }}>{it.value}</span>}
        </div>
      ))}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════
// 1 — Chart foundations page
// ════════════════════════════════════════════════════════════════════════

function ChartFoundationsPage() {
  const item = AGGIE_CATALOG.find(c => c.id === "chart-foundations");

  return (
    <PageShell item={item}>
      <CHIntro>
        Charts in tux are <strong>editorial figures, not dashboards.</strong> They sit inside an article or report as exhibits — so they inherit the same restraint as body type. No 3D, no shaded gradients, no rounded bars. Maroon is the primary series; everything else comes from a small categorical palette tuned to read alongside Aggie editorial photography.
      </CHIntro>

      <CHSectionLabel>Categorical palette</CHSectionLabel>
      <CHBox label="ordered — the Nth series uses the Nth swatch">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(8, 1fr)", gap: 10 }}>
          {CHART_PALETTE.map((c, i) => (
            <div key={i}>
              <div style={{ height: 56, background: c, borderRadius: 2, marginBottom: 8 }} />
              <div style={{ ...CH_TYPE.axis, marginBottom: 2 }}>{i === 0 ? "primary" : `series ${i + 1}`}</div>
              <div style={{ ...CH_TYPE.numeral, fontSize: "0.7rem", color: "var(--text-muted)" }}>
                {c.startsWith("var") ? "var(--brand-primary)" : c}
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 16, fontSize: "0.78rem", color: "var(--text-secondary)", lineHeight: 1.55 }}>
          Use 1 series for headline charts. 2–4 series for comparisons. <strong>Never exceed 6 series</strong> in a single chart — at that point switch to small multiples or a table.
        </div>
      </CHBox>

      <CHSectionLabel>Type & numerals</CHSectionLabel>
      <CHBox label="every numeric value uses tabular mono so columns align">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
          <div>
            <div style={{ ...CH_TYPE.axis, marginBottom: 12 }}>Axis ticks · uppercase tracked Work Sans</div>
            <div style={{ display: "flex", gap: 32, alignItems: "flex-end", borderBottom: "1px solid var(--surface-border)", paddingBottom: 8, marginBottom: 6 }}>
              {["MON", "TUE", "WED", "THU", "FRI"].map(d => (
                <span key={d} style={CH_TYPE.axis}>{d}</span>
              ))}
            </div>
            <div style={{ ...CH_TYPE.axis, marginBottom: 8 }}>Tick labels · 0.62rem · color: text-muted</div>
          </div>
          <div>
            <div style={{ ...CH_TYPE.axis, marginBottom: 12 }}>Numerals · tabular mono</div>
            <table style={{ borderCollapse: "collapse", fontSize: "1rem", ...CH_TYPE.numeral }}>
              <tbody>
                <tr><td style={{ padding: "4px 18px 4px 0", color: "var(--text-secondary)" }}>I-35 corridor</td><td style={{ padding: "4px 0", textAlign: "right", color: "var(--text-primary)", fontWeight: 600 }}>184,392</td></tr>
                <tr><td style={{ padding: "4px 18px 4px 0", color: "var(--text-secondary)" }}>I-45 corridor</td><td style={{ padding: "4px 0", textAlign: "right", color: "var(--text-primary)", fontWeight: 600 }}>202,118</td></tr>
                <tr><td style={{ padding: "4px 18px 4px 0", color: "var(--text-secondary)" }}>US-290 corridor</td><td style={{ padding: "4px 0", textAlign: "right", color: "var(--text-primary)", fontWeight: 600 }}>92,047</td></tr>
                <tr><td style={{ padding: "4px 18px 4px 0", color: "var(--text-secondary)" }}>SH-130 toll</td><td style={{ padding: "4px 0", textAlign: "right", color: "var(--text-primary)", fontWeight: 600 }}>21,654</td></tr>
              </tbody>
            </table>
            <div style={{ ...CH_TYPE.axis, marginTop: 10 }}>Right-aligned · digits line up by place value</div>
          </div>
        </div>
      </CHBox>

      <CHSectionLabel>Axis system & gridlines</CHSectionLabel>
      <CHBox label="hairline gridlines only — never solid bands or boxes">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 28 }}>
          <ChartFrame eyebrow="example · linear y-axis" title="Stripped chart skeleton" source="design system reference" footnote="Y-axis: 4 gridlines max. X-axis: tick labels only on data points; no full axis line.">
            <svg viewBox="0 0 320 180" width="100%" height="180">
              {/* Gridlines */}
              {[0, 25, 50, 75, 100].map((p, i) => {
                const y = 20 + (140 * (100 - p)) / 100;
                return (
                  <g key={i}>
                    <line x1={48} y1={y} x2={310} y2={y} stroke="var(--surface-border)" strokeWidth={i === 4 ? 1 : 0.5} strokeDasharray={i === 4 ? "" : "2 4"} />
                    <text x={42} y={y + 3} textAnchor="end" fill="var(--text-muted)" style={{ fontSize: 9, fontFamily: "var(--font-mono)" }}>{p}</text>
                  </g>
                );
              })}
              {[0, 1, 2, 3, 4].map(i => {
                const x = 48 + (262 * i) / 4;
                return (
                  <text key={i} x={x} y={172} textAnchor="middle" fill="var(--text-muted)" style={{ fontSize: 9, fontFamily: "var(--font-body-bold)", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>{["MON","TUE","WED","THU","FRI"][i]}</text>
                );
              })}
            </svg>
          </ChartFrame>

          <div style={{ alignSelf: "center", paddingLeft: 12 }}>
            <div style={{ ...CH_TYPE.axis, marginBottom: 8 }}>Grid rules</div>
            <ul style={{ margin: 0, paddingLeft: 18, fontSize: "0.86rem", lineHeight: 1.7, color: "var(--text-secondary)" }}>
              <li>4 horizontal gridlines max (5 with the baseline). Equally spaced.</li>
              <li>Hairline 0.5px dashed for inner; 1px solid for the baseline.</li>
              <li>No vertical gridlines on time-series — they fight the data.</li>
              <li>Gridline color uses <code>--surface-border</code>, never branded.</li>
              <li>Y-axis labels on the left for time series; right for ranking lists.</li>
            </ul>
          </div>
        </div>
      </CHBox>

      <CHSectionLabel>Signature rule above every chart</CHSectionLabel>
      <CHBox label="2px maroon hairline running 30% of the chart width">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
          {[
            { eyebrow: "exhibit 1.04", title: "Default style" },
            { eyebrow: "exhibit 2.11", title: "Bold style" },
            { eyebrow: "exhibit 3.07", title: "Elegant style" },
          ].map((c, i) => (
            <ChartFrame key={i} eyebrow={c.eyebrow} title={c.title}>
              <div style={{ height: 80, background: "var(--surface-sunken)", borderRadius: 2, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)", fontSize: "0.74rem" }}>
                · chart body ·
              </div>
            </ChartFrame>
          ))}
        </div>
      </CHBox>

      <CHSpecRow>
        <CHSpec label="palette"   value="8 categorical"   note="Maroon always first. 6 max in one chart; switch to small multiples beyond that." />
        <CHSpec label="numerals"  value="tabular mono"    note="JetBrains Mono with font-variant-numeric: tabular-nums. Right-aligned in tables." />
        <CHSpec label="grid"      value="4 lines + base"  note="Dashed hairline inner, solid baseline. Never vertical gridlines on time series." />
        <CHSpec label="frame"     value="signature rule"  note="2px maroon-to-transparent hairline above every chart, tying back to section-style system." />
      </CHSpecRow>
    </PageShell>
  );
}

// ════════════════════════════════════════════════════════════════════════
// 2 — Bar charts
// ════════════════════════════════════════════════════════════════════════

function VerticalBarChart({ data, height = 220, valueFormat = (v) => v, color = CHART_PALETTE[0] }) {
  const max = Math.max(...data.map(d => d.value));
  const padTop = 24;
  const chartHeight = height - 36;
  const barCount = data.length;
  const barWidth = `calc((100% - ${(barCount - 1) * 12}px) / ${barCount})`;

  return (
    <div>
      <div style={{ position: "relative", height, paddingLeft: 44 }}>
        {/* Gridlines */}
        <div style={{ position: "absolute", inset: `${padTop}px 0 12px 44px` }}>
          {[1, 0.75, 0.5, 0.25, 0].map((p, i) => (
            <div key={i} style={{
              position: "absolute", left: 0, right: 0,
              top: `${(1 - p) * 100}%`,
              borderTop: i === 4 ? "1px solid var(--surface-border)" : "1px dashed color-mix(in srgb, currentColor 12%, transparent)",
            }}>
              <span style={{ ...CH_TYPE.numeral, fontSize: "0.66rem", color: "var(--text-muted)", position: "absolute", right: "calc(100% + 8px)", top: -7, whiteSpace: "nowrap" }}>
                {valueFormat(Math.round(max * p))}
              </span>
            </div>
          ))}
        </div>
        {/* Bars */}
        <div style={{ position: "absolute", inset: `${padTop}px 0 12px 44px`, display: "flex", alignItems: "flex-end", gap: 12 }}>
          {data.map((d, i) => {
            const h = (d.value / max) * 100;
            return (
              <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", height: "100%", justifyContent: "flex-end", position: "relative" }}>
                <div style={{ ...CH_TYPE.numeral, fontSize: "0.7rem", color: "var(--text-primary)", fontWeight: 600, marginBottom: 4 }}>{valueFormat(d.value)}</div>
                <div style={{ width: "100%", maxWidth: 56, height: `${h}%`, background: d.color || color, borderRadius: 0 }} />
              </div>
            );
          })}
        </div>
      </div>
      {/* X labels */}
      <div style={{ paddingLeft: 44, display: "flex", gap: 12, marginTop: 4 }}>
        {data.map((d, i) => (
          <div key={i} style={{ flex: 1, textAlign: "center", ...CH_TYPE.axis }}>{d.label}</div>
        ))}
      </div>
    </div>
  );
}

function HorizontalBarChart({ data, valueFormat = (v) => v }) {
  const max = Math.max(...data.map(d => d.value));
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {data.map((d, i) => {
        const w = (d.value / max) * 100;
        return (
          <div key={i} style={{ display: "grid", gridTemplateColumns: "180px 1fr 88px", alignItems: "center", gap: 14 }}>
            <div style={{ ...CH_TYPE.axis, color: "var(--text-secondary)", fontSize: "0.74rem", letterSpacing: "0.06em" }}>{d.label}</div>
            <div style={{ position: "relative", height: 22, background: "var(--surface-sunken)", borderRadius: 1 }}>
              <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${w}%`, background: d.color || CHART_PALETTE[0] }} />
            </div>
            <div style={{ ...CH_TYPE.numeral, color: "var(--text-primary)", fontWeight: 600, fontSize: "0.86rem", textAlign: "right" }}>{valueFormat(d.value)}</div>
          </div>
        );
      })}
    </div>
  );
}

function GroupedBarChart({ groups, series, height = 220, valueFormat = (v) => v }) {
  const all = groups.flatMap(g => series.map(s => g.values[s.key]));
  const max = Math.max(...all);
  const padTop = 24;

  return (
    <div>
      <Legend items={series.map((s, i) => ({ label: s.label, color: s.color || CHART_PALETTE[i] }))} />
      <div style={{ position: "relative", height, paddingLeft: 44 }}>
        <div style={{ position: "absolute", inset: `${padTop}px 0 12px 44px` }}>
          {[1, 0.75, 0.5, 0.25, 0].map((p, i) => (
            <div key={i} style={{
              position: "absolute", left: 0, right: 0, top: `${(1 - p) * 100}%`,
              borderTop: i === 4 ? "1px solid var(--surface-border)" : "1px dashed color-mix(in srgb, currentColor 12%, transparent)",
            }}>
              <span style={{ ...CH_TYPE.numeral, fontSize: "0.66rem", color: "var(--text-muted)", position: "absolute", right: "calc(100% + 8px)", top: -7 }}>{valueFormat(Math.round(max * p))}</span>
            </div>
          ))}
        </div>
        <div style={{ position: "absolute", inset: `${padTop}px 0 12px 44px`, display: "flex", alignItems: "flex-end", gap: 18 }}>
          {groups.map((g, gi) => (
            <div key={gi} style={{ flex: 1, height: "100%", display: "flex", alignItems: "flex-end", gap: 2 }}>
              {series.map((s, si) => {
                const v = g.values[s.key];
                const h = (v / max) * 100;
                return <div key={si} title={`${g.label} · ${s.label} · ${v}`} style={{ flex: 1, height: `${h}%`, background: s.color || CHART_PALETTE[si] }} />;
              })}
            </div>
          ))}
        </div>
      </div>
      <div style={{ paddingLeft: 44, display: "flex", gap: 18, marginTop: 4 }}>
        {groups.map((g, i) => (
          <div key={i} style={{ flex: 1, textAlign: "center", ...CH_TYPE.axis }}>{g.label}</div>
        ))}
      </div>
    </div>
  );
}

function StackedBarChart({ data, series, valueFormat = (v) => `${v}%` }) {
  return (
    <div>
      <Legend items={series.map((s, i) => ({ label: s.label, color: s.color || CHART_PALETTE[i] }))} />
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {data.map((row, i) => {
          const total = series.reduce((sum, s) => sum + (row.values[s.key] || 0), 0);
          return (
            <div key={i}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ ...CH_TYPE.axis, color: "var(--text-secondary)", fontSize: "0.74rem", letterSpacing: "0.06em" }}>{row.label}</span>
                <span style={{ ...CH_TYPE.numeral, color: "var(--text-muted)", fontSize: "0.7rem" }}>n = {total.toLocaleString()}</span>
              </div>
              <div style={{ display: "flex", height: 26, borderRadius: 1, overflow: "hidden" }}>
                {series.map((s, si) => {
                  const v = row.values[s.key] || 0;
                  const pct = (v / total) * 100;
                  return (
                    <div key={si} style={{ width: `${pct}%`, background: s.color || CHART_PALETTE[si], display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", overflow: "hidden" }}>
                      {pct >= 8 && (
                        <span style={{ ...CH_TYPE.numeral, fontSize: "0.7rem", fontWeight: 600 }}>{valueFormat(Math.round(pct))}</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ChartBarPage() {
  const item = AGGIE_CATALOG.find(c => c.id === "chart-bar");

  const aadt = [
    { label: "I-35", value: 184392 }, { label: "I-45", value: 202118 },
    { label: "US-290", value: 92047 }, { label: "SH-130", value: 21654 },
    { label: "SH-71", value: 47930 },
  ];
  const districts = [
    { label: "Houston",      value: 12842 },
    { label: "Dallas",       value: 11206 },
    { label: "San Antonio",  value: 8931 },
    { label: "Austin",       value: 7414 },
    { label: "Bryan",        value: 5290 },
    { label: "Beaumont",     value: 3987 },
  ];
  const beforeAfter = [
    { label: "I-35 @ Round Rock", values: { before: 42, after: 31 } },
    { label: "I-635 @ LBJ",       values: { before: 51, after: 38 } },
    { label: "US-290 @ Beltway 8", values: { before: 38, after: 28 } },
    { label: "SH-114 @ DFW",      values: { before: 33, after: 24 } },
  ];
  const modeShare = [
    { label: "Houston",      values: { sov: 78, carpool: 9, transit: 4, walkbike: 2, wfh: 7 } },
    { label: "Austin",       values: { sov: 72, carpool: 8, transit: 5, walkbike: 4, wfh: 11 } },
    { label: "Dallas",       values: { sov: 79, carpool: 9, transit: 3, walkbike: 1, wfh: 8 } },
    { label: "College Stn.", values: { sov: 68, carpool: 7, transit: 3, walkbike: 14, wfh: 8 } },
  ];

  return (
    <PageShell item={item}>
      <CHIntro>
        Four bar variants. <strong>Vertical</strong> for time-series and ordered categories. <strong>Horizontal</strong> when category labels are long. <strong>Grouped</strong> for before/after and small multi-series. <strong>Stacked-100</strong> for composition (mode share, survey responses). Never use stacked counts — humans can't compare segments that don't share a baseline.
      </CHIntro>

      <CHSectionLabel>Vertical bar — single series</CHSectionLabel>
      <CHBox label="ordered categories — primary maroon">
        <ChartFrame eyebrow="exhibit 1.02" title="AADT by major Texas corridor" source="TxDOT roadway inventory · 2024" footnote="Annual average daily traffic, both directions, urban segments only.">
          <VerticalBarChart data={aadt} valueFormat={(v) => v >= 1000 ? `${(v/1000).toFixed(0)}K` : v} />
        </ChartFrame>
      </CHBox>

      <CHSectionLabel>Horizontal bar — for long category labels</CHSectionLabel>
      <CHBox label="ranked list with values displayed at the right">
        <ChartFrame eyebrow="exhibit 1.07" title="Lane-miles maintained by district" source="TxDOT highway statistics · 2024">
          <HorizontalBarChart data={districts} valueFormat={(v) => v.toLocaleString()} />
        </ChartFrame>
      </CHBox>

      <CHSectionLabel>Grouped bar — before & after</CHSectionLabel>
      <CHBox label="paired comparison — primary + secondary series">
        <ChartFrame eyebrow="exhibit 2.04" title="Peak-hour delay reduction after corridor improvements" source="TTI Mobility Investment Priorities · 2025" footnote="Measured in seconds per vehicle. Lower is better.">
          <GroupedBarChart
            groups={beforeAfter}
            series={[
              { key: "before", label: "Before (2022)", color: CHART_PALETTE[5] },
              { key: "after",  label: "After (2025)",  color: CHART_PALETTE[0] },
            ]}
            valueFormat={(v) => `${v}s`}
          />
        </ChartFrame>
      </CHBox>

      <CHSectionLabel>Stacked-100 bar — composition</CHSectionLabel>
      <CHBox label="for mode share, survey responses, budget composition">
        <ChartFrame eyebrow="exhibit 1.11" title="Commute mode share, four Texas metros" source="ACS 5-year estimates · 2018–2022">
          <StackedBarChart
            data={modeShare}
            series={[
              { key: "sov",      label: "Drove alone" },
              { key: "carpool",  label: "Carpooled" },
              { key: "transit",  label: "Transit" },
              { key: "walkbike", label: "Walk / bike" },
              { key: "wfh",      label: "Worked from home" },
            ]}
          />
        </ChartFrame>
      </CHBox>

      <CHSpecRow>
        <CHSpec label="orientation" value="vertical default" note="Switch to horizontal when category labels exceed ~10 characters." />
        <CHSpec label="bar width"   value="56px max"        note="Caps prevent toothy bars on small datasets; flex distributes evenly otherwise." />
        <CHSpec label="grouped"     value="2 px gap"        note="Hairline gap inside groups; wide gap between groups for grouping clarity." />
        <CHSpec label="stacked-100" value="≥8% labels"      note="Inline value labels appear only on segments wide enough to fit comfortably." />
      </CHSpecRow>
    </PageShell>
  );
}

// ════════════════════════════════════════════════════════════════════════
// 3 — Line charts
// ════════════════════════════════════════════════════════════════════════

function LineChart({ series, height = 240, xLabels, yFormat = (v) => v, area = false }) {
  const W = 640, padL = 48, padR = 12, padT = 22, padB = 30;
  const chartH = height - padT - padB;
  const chartW = W - padL - padR;
  const allValues = series.flatMap(s => s.points.map(p => p.y));
  const maxY = Math.max(...allValues);
  const minY = Math.min(0, Math.min(...allValues));
  const xCount = series[0].points.length;

  const xPos = (i) => padL + (chartW * i) / (xCount - 1);
  const yPos = (v) => padT + chartH - ((v - minY) / (maxY - minY)) * chartH;

  return (
    <div>
      {series.length > 1 && <Legend items={series.map((s, i) => ({ label: s.label, color: s.color || CHART_PALETTE[i] }))} />}
      <svg viewBox={`0 0 ${W} ${height}`} width="100%" height={height} style={{ display: "block" }}>
        {/* Gridlines */}
        {[1, 0.75, 0.5, 0.25, 0].map((p, i) => {
          const y = padT + chartH * (1 - p);
          const value = Math.round(minY + (maxY - minY) * p);
          return (
            <g key={i}>
              <line x1={padL} y1={y} x2={W - padR} y2={y} stroke="var(--surface-border)" strokeWidth={i === 4 ? 1 : 0.5} strokeDasharray={i === 4 ? "" : "2 4"} />
              <text x={padL - 8} y={y + 3} textAnchor="end" fill="var(--text-muted)" style={{ fontSize: 10, fontFamily: "var(--font-mono)" }}>{yFormat(value)}</text>
            </g>
          );
        })}
        {/* X-axis labels */}
        {xLabels.map((lab, i) => (
          <text key={i} x={xPos(i)} y={height - 10} textAnchor="middle" fill="var(--text-muted)" style={{ fontSize: 9, fontFamily: "var(--font-body-bold)", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>{lab}</text>
        ))}
        {/* Series */}
        {series.map((s, si) => {
          const color = s.color || CHART_PALETTE[si];
          const pts = s.points.map((p, i) => `${xPos(i)},${yPos(p.y)}`).join(" ");
          const areaPts = `${padL},${yPos(minY)} ${pts} ${xPos(xCount - 1)},${yPos(minY)}`;
          return (
            <g key={si}>
              {area && (
                <polygon points={areaPts} fill={color} opacity={0.15} />
              )}
              <polyline points={pts} fill="none" stroke={color} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
              {s.points.map((p, i) => (
                <circle key={i} cx={xPos(i)} cy={yPos(p.y)} r={si === 0 && (i === 0 || i === xCount - 1 || s.points.length <= 8) ? 3 : 0} fill="var(--surface-page)" stroke={color} strokeWidth={1.5} />
              ))}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function ChartLinePage() {
  const item = AGGIE_CATALOG.find(c => c.id === "chart-line");

  const hourly = Array.from({ length: 24 }, (_, h) => {
    // Bimodal commute curve
    const morning = Math.exp(-Math.pow((h - 8) / 1.4, 2)) * 60;
    const evening = Math.exp(-Math.pow((h - 17.5) / 1.6, 2)) * 70;
    return { y: Math.round(morning + evening + 8) };
  });
  const xLabelsHourly = Array.from({ length: 24 }, (_, h) => h % 4 === 0 ? `${h}:00` : "");

  const monthsLong = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  // 4 corridor over 12 months
  const fourCorridor = [
    { label: "I-35 (Austin)",  points: [62, 65, 68, 71, 75, 78, 81, 79, 76, 72, 68, 66].map(y => ({ y })) },
    { label: "I-45 (Houston)", points: [58, 61, 63, 66, 70, 74, 76, 75, 73, 69, 65, 62].map(y => ({ y })) },
    { label: "I-635 (Dallas)", points: [55, 57, 60, 62, 66, 70, 72, 71, 68, 64, 60, 57].map(y => ({ y })) },
    { label: "US-290 (HOU)",   points: [38, 40, 42, 45, 48, 51, 53, 52, 50, 47, 43, 40].map(y => ({ y })) },
  ];

  // Single area
  const yearArea = [
    { label: "Daily VMT",
      points: [3.2, 3.4, 3.6, 3.7, 3.9, 4.1, 4.3, 4.2, 4.0, 3.9, 3.7, 3.5].map(y => ({ y: y * 100 })) },
  ];

  return (
    <PageShell item={item}>
      <CHIntro>
        Use line charts when the X axis is <strong>continuous and ordered</strong> — time, distance, speed bins. Single-series for a pure time trend. Multi-series for comparing 2–4 entities over the same range. The area variant emphasizes magnitude when a single metric is the story.
      </CHIntro>

      <CHSectionLabel>Single series — time-of-day curve</CHSectionLabel>
      <CHBox label="bimodal commute pattern — endpoints marked">
        <ChartFrame eyebrow="exhibit 4.02" title="Average corridor delay by hour of day" source="TTI Urban Mobility Report · 2024" footnote="Weekday delay, seconds per vehicle, averaged across the four largest Texas metros.">
          <LineChart series={[{ label: "Delay", points: hourly, color: CHART_PALETTE[0] }]} xLabels={xLabelsHourly} yFormat={(v) => `${v}s`} />
        </ChartFrame>
      </CHBox>

      <CHSectionLabel>Multi-series — comparing 4 corridors</CHSectionLabel>
      <CHBox label="legend at top; each series uses the next palette swatch">
        <ChartFrame eyebrow="exhibit 4.07" title="Peak-hour delay, four Texas corridors" source="TTI Mobility Monitor · 2024" footnote="Monthly average peak-hour delay, in seconds per vehicle.">
          <LineChart series={fourCorridor} xLabels={monthsLong} yFormat={(v) => `${v}s`} />
        </ChartFrame>
      </CHBox>

      <CHSectionLabel>Area variant — when magnitude is the story</CHSectionLabel>
      <CHBox label="filled area at 15% opacity beneath the line">
        <ChartFrame eyebrow="exhibit 4.11" title="Daily vehicle-miles traveled, statewide" source="TxDOT statewide travel statistics · 2024" footnote="Billions of vehicle-miles per day, statewide aggregate.">
          <LineChart series={[{ ...yearArea[0], color: CHART_PALETTE[0] }]} xLabels={monthsLong} yFormat={(v) => `${v}M`} area />
        </ChartFrame>
      </CHBox>

      <CHSpecRow>
        <CHSpec label="stroke"    value="2px"             note="Always 2px — thinner lines disappear at small sizes; thicker reads as a band, not a line." />
        <CHSpec label="endpoints" value="marked"          note="First and last points get a 3px circle on single-series charts; multi-series omits them to reduce clutter." />
        <CHSpec label="area fill" value="15% opacity"     note="Restricted to single-series only. Multi-series areas overlap and become unreadable." />
        <CHSpec label="series cap" value="4 max"          note="Beyond 4 lines the chart becomes a tangle. Switch to small multiples or filtered views." />
      </CHSpecRow>
    </PageShell>
  );
}

// ════════════════════════════════════════════════════════════════════════
// Export
// ════════════════════════════════════════════════════════════════════════

Object.assign(window, {
  ChartFoundationsPage,
  ChartBarPage,
  ChartLinePage,
  // Shared with AggieChartsViz.jsx
  CHART_PALETTE,
  CH_TYPE,
  CHIntro,
  CHSectionLabel,
  CHBox,
  CHSpecRow,
  CHSpec,
  ChartFrame,
  Legend,
});
