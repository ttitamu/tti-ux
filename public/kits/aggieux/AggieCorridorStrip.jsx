/* global React, PageShell, AGGIE_CATALOG, LucideIcon */
/*
 * AggieCorridorStrip.jsx — Batch B.3: Corridor strip diagrams.
 *
 * Linear-referenced visualizations: a roadway, transit line, or river
 * laid out as a horizontal "ribbon" with stations, segments, conditions,
 * and events plotted along its length. Used in TTI corridor studies,
 * transit alternatives analyses, and pavement condition reports.
 *
 * Helper prefix: CS (Corridor Strip).
 */

const { useState: _csUseState } = React;

// Shared helpers
function CSBox({ dark = false, label, padded = true, children }) {
  return (
    <div style={{ border: "1px solid var(--surface-border)", borderRadius: "var(--radius-md)", overflow: "hidden", marginBottom: 16 }}>
      <div style={{ padding: "7px 14px", fontSize: "0.62rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: dark ? "rgba(255,255,255,0.85)" : "var(--text-muted)", fontFamily: "var(--font-body-bold)", background: dark ? "var(--brand-primary)" : "var(--surface-sunken)", borderBottom: "1px solid var(--surface-border)", display: "flex", justifyContent: "space-between" }}>
        <span>{label}</span><span style={{ fontFamily: "var(--font-mono)", fontWeight: 500, opacity: 0.7 }}>on {dark ? "dark" : "light"}</span>
      </div>
      <div style={{ padding: padded ? 28 : 0, background: dark ? "var(--brand-primary)" : "var(--surface-page)" }}>{children}</div>
    </div>
  );
}
function CSSectionLabel({ children }) {
  return <div style={{ fontSize: "0.62rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--text-muted)", fontFamily: "var(--font-body-bold)", marginBottom: 12, marginTop: 28 }}>{children}</div>;
}
function CSIntro({ children }) {
  return <div style={{ padding: "16px 20px", marginBottom: 28, background: "color-mix(in srgb, var(--brand-primary) 5%, transparent)", borderLeft: "3px solid var(--brand-primary)", borderRadius: "0 var(--radius-sm) var(--radius-sm) 0", fontSize: "0.92rem", lineHeight: 1.65, color: "var(--text-secondary)" }}>{children}</div>;
}
function CSSpecRow({ children }) {
  return <div style={{ marginTop: 28, padding: "14px 18px", border: "1px solid var(--surface-border)", borderRadius: "var(--radius-md)", background: "var(--surface-raised)", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>{children}</div>;
}
function CSSpec({ label, value, note }) {
  return (
    <div>
      <div style={{ fontSize: "0.6rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-muted)", fontFamily: "var(--font-body-bold)" }}>{label}</div>
      <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem", color: "var(--brand-primary)", marginTop: 3, fontWeight: 500 }}>{value}</div>
      {note && <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: 2, lineHeight: 1.4 }}>{note}</div>}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════
// Sample data
// ════════════════════════════════════════════════════════════════════════

const I35_STATIONS = [
  { mp: 0,    label: "Laredo" },
  { mp: 60,   label: "Cotulla" },
  { mp: 145,  label: "San Antonio" },
  { mp: 220,  label: "Austin" },
  { mp: 320,  label: "Waco" },
  { mp: 410,  label: "Dallas / Ft Worth" },
  { mp: 505,  label: "Denton" },
  { mp: 600,  label: "Gainesville" },
];

const I35_PAVEMENT = [
  { from: 0,   to: 50,  cls: "good" },
  { from: 50,  to: 90,  cls: "fair" },
  { from: 90,  to: 145, cls: "good" },
  { from: 145, to: 175, cls: "poor" },
  { from: 175, to: 220, cls: "fair" },
  { from: 220, to: 290, cls: "good" },
  { from: 290, to: 360, cls: "fair" },
  { from: 360, to: 410, cls: "poor" },
  { from: 410, to: 470, cls: "fair" },
  { from: 470, to: 600, cls: "good" },
];
const PAVEMENT_COLOR = {
  good: "color-mix(in srgb, var(--color-success, oklch(0.55 0.13 145)) 75%, transparent)",
  fair: "color-mix(in srgb, var(--brand-accent) 80%, transparent)",
  poor: "color-mix(in srgb, var(--color-error, oklch(0.55 0.18 25)) 75%, transparent)",
};

const I35_EVENTS = [
  { mp: 78,  kind: "construction", label: "Cotulla bridge replacement (2026)" },
  { mp: 165, kind: "incident",     label: "High-crash segment" },
  { mp: 240, kind: "construction", label: "Capital Express North" },
  { mp: 380, kind: "milestone",    label: "I-30 interchange rebuild complete" },
  { mp: 520, kind: "incident",     label: "Recurring weather closure" },
];
const EVENT_ICON = { construction: "cone", incident: "alert-triangle", milestone: "flag" };

// ════════════════════════════════════════════════════════════════════════
// 1. Linear strip — pavement condition along the corridor
// ════════════════════════════════════════════════════════════════════════

function CSPavementStrip({ totalMP = 600, height = 28 }) {
  return (
    <div style={{ position: "relative", height, borderRadius: 4, overflow: "hidden", border: "1px solid var(--surface-border)", display: "flex" }}>
      {I35_PAVEMENT.map((seg, i) => {
        const w = ((seg.to - seg.from) / totalMP) * 100;
        return (
          <div
            key={i}
            title={`MP ${seg.from}–${seg.to} · ${seg.cls}`}
            style={{ width: `${w}%`, background: PAVEMENT_COLOR[seg.cls] }}
          />
        );
      })}
    </div>
  );
}

function CSStationAxis({ totalMP = 600, side = "bottom" }) {
  return (
    <div style={{ position: "relative", height: 38, marginTop: side === "bottom" ? 4 : 0, marginBottom: side === "top" ? 4 : 0 }}>
      {/* axis line */}
      <div style={{ position: "absolute", left: 0, right: 0, top: side === "top" ? "auto" : 0, bottom: side === "top" ? 0 : "auto", height: 1, background: "var(--surface-border)" }} />
      {I35_STATIONS.map((s, i) => {
        const left = (s.mp / totalMP) * 100;
        const align = i === 0 ? "flex-start" : i === I35_STATIONS.length - 1 ? "flex-end" : "center";
        const transform = i === 0 ? "translateX(0)" : i === I35_STATIONS.length - 1 ? "translateX(-100%)" : "translateX(-50%)";
        return (
          <div key={i} style={{ position: "absolute", left: `${left}%`, top: 0, bottom: 0, display: "flex", flexDirection: "column", alignItems: align, transform }}>
            <span style={{ width: 1, height: 6, background: "var(--text-secondary)", marginLeft: i === 0 ? 0 : i === I35_STATIONS.length - 1 ? 0 : "auto", marginRight: i === I35_STATIONS.length - 1 ? 0 : i === 0 ? 0 : "auto" }} />
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: "var(--text-muted)", marginTop: 2 }}>MP {s.mp}</span>
            <span style={{ fontSize: "0.74rem", color: "var(--text-primary)", marginTop: 1, whiteSpace: "nowrap" }}>{s.label}</span>
          </div>
        );
      })}
    </div>
  );
}

function CSEventMarkers({ totalMP = 600 }) {
  return (
    <div style={{ position: "relative", height: 26, marginTop: 6 }}>
      {I35_EVENTS.map((e, i) => {
        const left = (e.mp / totalMP) * 100;
        const isErr = e.kind === "incident";
        const isMile = e.kind === "milestone";
        const color = isErr ? "var(--color-error, oklch(0.55 0.18 25))" : isMile ? "var(--color-success, oklch(0.55 0.13 145))" : "var(--brand-accent)";
        return (
          <div key={i} title={e.label} style={{ position: "absolute", left: `${left}%`, top: 0, transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 22, height: 22, borderRadius: "50%", background: "var(--surface-raised)", border: `1.5px solid ${color}`, color }}>
              <LucideIcon name={EVENT_ICON[e.kind]} size={11} />
            </span>
          </div>
        );
      })}
    </div>
  );
}

function CSPavementLegend() {
  return (
    <div style={{ display: "flex", gap: 18, flexWrap: "wrap", fontSize: "0.74rem", color: "var(--text-secondary)" }}>
      {[{ cls: "good", label: "Good (PCI ≥ 80)" }, { cls: "fair", label: "Fair (60 ≤ PCI < 80)" }, { cls: "poor", label: "Poor (PCI < 60)" }].map(it => (
        <span key={it.cls} style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
          <span style={{ width: 14, height: 10, background: PAVEMENT_COLOR[it.cls], borderRadius: 2 }} />
          {it.label}
        </span>
      ))}
      <span style={{ flex: 1 }} />
      {[{ k: "construction", label: "Construction" }, { k: "incident", label: "Incident / hot spot" }, { k: "milestone", label: "Milestone" }].map(it => (
        <span key={it.k} style={{ display: "inline-flex", alignItems: "center", gap: 6, fontFamily: "var(--font-mono)", fontSize: "0.7rem" }}>
          <LucideIcon name={EVENT_ICON[it.k]} size={11} />{it.label}
        </span>
      ))}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════
// 2. Multi-track — pavement, AADT, crash density stacked
// ════════════════════════════════════════════════════════════════════════

function CSMultiTrack({ totalMP = 600 }) {
  // Generate sample density curves
  const aadtPath = (() => {
    const pts = [];
    for (let mp = 0; mp <= totalMP; mp += 20) {
      // Higher near urban stations
      const urban = I35_STATIONS.reduce((acc, s) => acc + Math.exp(-Math.pow((mp - s.mp) / 60, 2)), 0);
      const v = 0.25 + urban * 0.25;
      pts.push([(mp / totalMP) * 100, 50 - v * 38]);
    }
    return "M " + pts.map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`).join(" L ");
  })();

  const crashes = [];
  for (let i = 0; i < 38; i++) {
    const mp = Math.random() * totalMP;
    const sev = Math.random() < 0.15 ? "fatal" : Math.random() < 0.5 ? "injury" : "pdo";
    crashes.push({ mp, sev });
  }
  const SEV_COLOR = {
    fatal:  "var(--color-error, oklch(0.5 0.18 25))",
    injury: "var(--brand-accent)",
    pdo:    "color-mix(in srgb, var(--text-secondary) 50%, transparent)",
  };
  const SEV_R = { fatal: 4, injury: 3, pdo: 2 };

  return (
    <div>
      {/* Track 1: pavement strip */}
      <div style={{ marginBottom: 10 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5, fontSize: "0.66rem", color: "var(--text-muted)", fontFamily: "var(--font-body-bold)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
          <span>Pavement condition</span><span style={{ fontFamily: "var(--font-mono)", textTransform: "none", letterSpacing: 0 }}>PMIS 2024</span>
        </div>
        <CSPavementStrip totalMP={totalMP} height={20} />
      </div>

      {/* Track 2: AADT area */}
      <div style={{ marginBottom: 10 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5, fontSize: "0.66rem", color: "var(--text-muted)", fontFamily: "var(--font-body-bold)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
          <span>AADT (vpd)</span><span style={{ fontFamily: "var(--font-mono)", textTransform: "none", letterSpacing: 0 }}>0 – 220k</span>
        </div>
        <div style={{ position: "relative", height: 56, border: "1px solid var(--surface-border)", borderRadius: 4, background: "var(--surface-sunken)" }}>
          <svg width="100%" height="100%" viewBox="0 0 100 50" preserveAspectRatio="none" style={{ display: "block" }}>
            <path d={`${aadtPath} L 100,50 L 0,50 Z`} fill="color-mix(in srgb, var(--brand-primary) 25%, transparent)" stroke="var(--brand-primary)" strokeWidth={0.6} vectorEffect="non-scaling-stroke" />
          </svg>
        </div>
      </div>

      {/* Track 3: crash density */}
      <div style={{ marginBottom: 10 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5, fontSize: "0.66rem", color: "var(--text-muted)", fontFamily: "var(--font-body-bold)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
          <span>Crash events (2019–2023)</span><span style={{ fontFamily: "var(--font-mono)", textTransform: "none", letterSpacing: 0 }}>n = 1,847</span>
        </div>
        <div style={{ position: "relative", height: 32, border: "1px solid var(--surface-border)", borderRadius: 4, background: "var(--surface-sunken)" }}>
          {crashes.map((c, i) => (
            <span key={i} style={{ position: "absolute", left: `${(c.mp / totalMP) * 100}%`, top: "50%", transform: "translate(-50%, -50%)", width: SEV_R[c.sev] * 2, height: SEV_R[c.sev] * 2, borderRadius: "50%", background: SEV_COLOR[c.sev], opacity: 0.8 }} />
          ))}
        </div>
      </div>

      {/* Event overlay markers */}
      <CSEventMarkers totalMP={totalMP} />

      {/* Station axis */}
      <CSStationAxis totalMP={totalMP} />
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════
// 3. Transit alignment — stations + ridership + service spans
// ════════════════════════════════════════════════════════════════════════

const TRANSIT_STATIONS = [
  { mi: 0,    code: "WTC",  label: "Westfield Terminal",   xfer: ["bus"] },
  { mi: 4.2,  code: "BLV",  label: "Blvd & 18th",          xfer: [] },
  { mi: 7.8,  code: "DGN",  label: "Downtown — Greene",    xfer: ["rail", "bus"] },
  { mi: 9.5,  code: "DCC",  label: "Downtown — City Ctr",  xfer: ["rail"] },
  { mi: 13.1, code: "MED",  label: "Medical Campus",       xfer: [] },
  { mi: 16.7, code: "UNI",  label: "University",           xfer: ["bus"] },
  { mi: 21.0, code: "ETC",  label: "Eastfield Terminal",   xfer: ["bus", "park"] },
];

function CSTransitDiagram() {
  const total = 21;
  return (
    <div>
      {/* Title strip */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
        <span style={{ width: 10, height: 10, borderRadius: "50%", background: "var(--brand-primary)" }} />
        <span style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", fontWeight: 500, letterSpacing: "0.04em", color: "var(--text-primary)" }}>RED LINE</span>
        <span style={{ fontSize: "0.74rem", color: "var(--text-muted)", marginLeft: 8 }}>21.0 mi · 7 stations · 32 min end-to-end</span>
      </div>

      {/* The line itself */}
      <div style={{ position: "relative", height: 110, paddingTop: 14 }}>
        {/* track */}
        <div style={{ position: "absolute", left: 14, right: 14, top: 28, height: 4, background: "var(--brand-primary)", borderRadius: 2 }} />
        {/* stations */}
        {TRANSIT_STATIONS.map((s, i) => {
          const left = 14 + (s.mi / total) * (100 - 28 / 4) + "%"; // simple placement
          const leftPct = `calc(14px + ${(s.mi / total) * 100}% - ${(s.mi / total) * 28}px)`;
          const isXfer = s.xfer.length > 0;
          return (
            <div key={i} style={{ position: "absolute", left: leftPct, top: 0 }}>
              <div style={{ position: "absolute", left: -14, top: 22, width: 16, height: 16, borderRadius: "50%", background: "var(--surface-raised)", border: `${isXfer ? 3 : 2}px solid var(--brand-primary)`, boxSizing: "border-box" }} />
              <div style={{ position: "absolute", left: -28, top: 46, width: 56, textAlign: "center" }}>
                <div style={{ fontFamily: "var(--font-body-bold)", fontWeight: 700, fontSize: "0.66rem", color: "var(--text-primary)", letterSpacing: "0.04em" }}>{s.code}</div>
                <div style={{ fontSize: "0.66rem", color: "var(--text-secondary)", lineHeight: 1.3, marginTop: 1 }}>{s.label}</div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", color: "var(--text-muted)", marginTop: 2 }}>{s.mi.toFixed(1)} mi</div>
                {s.xfer.length > 0 && (
                  <div style={{ display: "flex", justifyContent: "center", gap: 3, marginTop: 3 }}>
                    {s.xfer.map(x => (
                      <span key={x} title={`${x} transfer`} style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 14, height: 14, borderRadius: 2, background: "var(--surface-sunken)", color: "var(--text-secondary)" }}>
                        <LucideIcon name={x === "rail" ? "train" : x === "bus" ? "bus" : "circle-parking"} size={9} />
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════
// PAGE
// ════════════════════════════════════════════════════════════════════════

function CorridorStripPage() {
  const item = (window.AGGIE_CATALOG || []).find(c => c.id === "corridor-strip");
  return (
    <PageShell item={item}>
      <CSIntro>
        Linear-referenced visualizations: a roadway, transit line, or river laid as a horizontal ribbon with stations, segments, and events plotted along its length. The reference axis is always the corridor itself — never wall-clock time. Used in TTI corridor studies, transit AAs, and pavement condition reports.
      </CSIntro>

      {/* Single track */}
      <CSSectionLabel>Single track — pavement condition along I-35 (Laredo → Gainesville)</CSSectionLabel>
      <CSBox label="One ribbon · station axis · event markers above">
        <CSEventMarkers totalMP={600} />
        <CSPavementStrip totalMP={600} height={26} />
        <CSStationAxis totalMP={600} />
        <div style={{ marginTop: 18, paddingTop: 14, borderTop: "1px dashed var(--surface-border)" }}>
          <CSPavementLegend />
        </div>
      </CSBox>

      {/* Multi-track */}
      <CSSectionLabel>Multi-track — three measures sharing one milepoint axis</CSSectionLabel>
      <CSBox label="Pavement · AADT · crash density · stacked tracks · event overlay">
        <CSMultiTrack totalMP={600} />
        <div style={{ marginTop: 18, paddingTop: 14, borderTop: "1px dashed var(--surface-border)" }}>
          <CSPavementLegend />
        </div>
      </CSBox>

      {/* Dark variant */}
      <CSSectionLabel>On dark — corridor strip in a dashboard chrome</CSSectionLabel>
      <CSBox dark label="Inverted track + station axis">
        <div style={{ background: "color-mix(in srgb, white 8%, transparent)", padding: 20, borderRadius: "var(--radius-sm)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, color: "rgba(255,255,255,0.85)", fontSize: "0.74rem", fontFamily: "var(--font-body-bold)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
            <span>I-35 · Pavement condition</span><span style={{ fontFamily: "var(--font-mono)", textTransform: "none", letterSpacing: 0, opacity: 0.7 }}>updated 2024-08</span>
          </div>
          <div style={{ position: "relative", height: 22, borderRadius: 4, overflow: "hidden", display: "flex" }}>
            {I35_PAVEMENT.map((seg, i) => {
              const w = ((seg.to - seg.from) / 600) * 100;
              return <div key={i} style={{ width: `${w}%`, background: PAVEMENT_COLOR[seg.cls], opacity: 0.95 }} />;
            })}
          </div>
          <div style={{ position: "relative", height: 24, marginTop: 8 }}>
            {I35_STATIONS.map((s, i) => {
              const left = (s.mp / 600) * 100;
              const transform = i === 0 ? "translateX(0)" : i === I35_STATIONS.length - 1 ? "translateX(-100%)" : "translateX(-50%)";
              return (
                <div key={i} style={{ position: "absolute", left: `${left}%`, top: 0, transform, color: "rgba(255,255,255,0.85)" }}>
                  <div style={{ width: 1, height: 5, background: "rgba(255,255,255,0.55)" }} />
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.62rem", opacity: 0.75 }}>MP {s.mp}</div>
                  <div style={{ fontSize: "0.7rem", whiteSpace: "nowrap" }}>{s.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </CSBox>

      {/* Transit */}
      <CSSectionLabel>Transit alignment — line diagram with stations + transfers</CSSectionLabel>
      <CSBox label="Transit line · station codes · transfer indicators">
        <CSTransitDiagram />
      </CSBox>

      {/* Decision matrix */}
      <CSSectionLabel>When to use a strip vs a chart vs a map</CSSectionLabel>
      <div style={{ overflow: "hidden", border: "1px solid var(--surface-border)", borderRadius: "var(--radius-md)", marginBottom: 16 }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.86rem" }}>
          <thead>
            <tr style={{ background: "var(--surface-sunken)" }}>
              {["Form", "Reference axis", "Best for"].map(h => (
                <th key={h} style={{ textAlign: "left", padding: "10px 14px", fontSize: "0.66rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-muted)", fontFamily: "var(--font-body-bold)", borderBottom: "1px solid var(--surface-border)" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              ["Corridor strip",   "Distance along the corridor (mile, kilometer, station)",  "Pavement condition, AADT, crash density, transit alignments — anything linearly referenced"],
              ["Time-series chart", "Wall-clock time",                                          "Trends, seasonality, before/after evaluation"],
              ["Map (chart-maps)",  "Geographic coordinates",                                   "Spatial patterns, regional comparisons, OD flows"],
            ].map((row, i) => (
              <tr key={i}>
                {row.map((cell, j) => (
                  <td key={j} style={{ padding: "12px 14px", borderBottom: i === 2 ? "none" : "1px solid var(--surface-border)", color: j === 0 ? "var(--text-primary)" : "var(--text-secondary)", fontWeight: j === 0 ? 600 : 400, lineHeight: 1.55 }}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <CSSpecRow>
        <CSSpec label="Reference axis"    value="linear by milepoint"   note="Stations as labeled ticks; never re-scale by city" />
        <CSSpec label="Track height"      value="20–28px ribbon"        note="Slim enough for 3-4 stacks in a dashboard pane" />
        <CSSpec label="Event markers"     value="22px circle · icon"    note="Above the strip; categorical color (cone/alert/flag)" />
        <CSSpec label="Station label"     value="MP + name + tick"      note="0.65rem mono milepoint, 0.74rem name" />
      </CSSpecRow>
    </PageShell>
  );
}

Object.assign(window, { CorridorStripPage });
