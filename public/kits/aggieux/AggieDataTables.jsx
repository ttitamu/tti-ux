/* global React, PageShell, AGGIE_CATALOG, LucideIcon */
/*
 * AggieDataTables.jsx — Batch B.1: Research data tables.
 *
 * Tables tuned for research deliverables:
 *   - sortable column headers
 *   - tabular figures + uncertainty (±, CI, n=)
 *   - footnote anchors w/ formal note block
 *   - row groups (banded by category)
 *   - sticky header for long tables
 *   - exportable / print-clean treatment
 *
 * Helper prefix: DT (Data Tables).
 */

const { useState: _dtUseState, useMemo: _dtUseMemo } = React;

function DTBox({ dark = false, label, padded = true, children }) {
  return (
    <div style={{ border: "1px solid var(--surface-border)", borderRadius: "var(--radius-md)", overflow: "hidden", marginBottom: 16 }}>
      <div style={{ padding: "7px 14px", fontSize: "0.62rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: dark ? "rgba(255,255,255,0.85)" : "var(--text-muted)", fontFamily: "var(--font-body-bold)", background: dark ? "var(--brand-primary)" : "var(--surface-sunken)", borderBottom: "1px solid var(--surface-border)", display: "flex", justifyContent: "space-between" }}>
        <span>{label}</span><span style={{ fontFamily: "var(--font-mono)", fontWeight: 500, opacity: 0.7 }}>on {dark ? "dark" : "light"}</span>
      </div>
      <div style={{ padding: padded ? 24 : 0, background: dark ? "var(--brand-primary)" : "var(--surface-page)" }}>{children}</div>
    </div>
  );
}
function DTSectionLabel({ children }) {
  return <div style={{ fontSize: "0.62rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--text-muted)", fontFamily: "var(--font-body-bold)", marginBottom: 12, marginTop: 28 }}>{children}</div>;
}
function DTIntro({ children }) {
  return <div style={{ padding: "16px 20px", marginBottom: 28, background: "color-mix(in srgb, var(--brand-primary) 5%, transparent)", borderLeft: "3px solid var(--brand-primary)", borderRadius: "0 var(--radius-sm) var(--radius-sm) 0", fontSize: "0.92rem", lineHeight: 1.65, color: "var(--text-secondary)" }}>{children}</div>;
}
function DTSpecRow({ children }) {
  return <div style={{ marginTop: 28, padding: "14px 18px", border: "1px solid var(--surface-border)", borderRadius: "var(--radius-md)", background: "var(--surface-raised)", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>{children}</div>;
}
function DTSpec({ label, value, note }) {
  return (
    <div>
      <div style={{ fontSize: "0.6rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-muted)", fontFamily: "var(--font-body-bold)" }}>{label}</div>
      <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem", color: "var(--brand-primary)", marginTop: 3, fontWeight: 500 }}>{value}</div>
      {note && <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: 2, lineHeight: 1.4 }}>{note}</div>}
    </div>
  );
}

// Shared cell styling
const NUM_CELL = { fontFamily: "var(--font-mono)", fontVariantNumeric: "tabular-nums", textAlign: "right", whiteSpace: "nowrap" };
const TH_BASE = { fontSize: "0.66rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-muted)", fontFamily: "var(--font-body-bold)", padding: "10px 12px", borderBottom: "2px solid var(--surface-border)", textAlign: "left", verticalAlign: "bottom" };
const TD_BASE = { padding: "10px 12px", borderBottom: "1px solid var(--surface-border)", fontSize: "0.86rem", color: "var(--text-secondary)" };

function DTUncertainty({ value, ci, decimals = 2, unit = "" }) {
  // value with ±CI rendered with monospaced ± and 95% CI suffix
  return (
    <span style={NUM_CELL}>
      {value.toFixed(decimals)}{unit}
      {ci != null && <span style={{ color: "var(--text-muted)", marginLeft: 4, fontSize: "0.78rem" }}> ± {ci.toFixed(decimals)}</span>}
    </span>
  );
}

function DTFnAnchor({ id, n }) {
  return (
    <sup>
      <a href={`#${id}`} style={{ fontFamily: "var(--font-mono)", fontSize: "0.66rem", color: "var(--brand-primary)", textDecoration: "none", marginLeft: 2 }}>{n}</a>
    </sup>
  );
}

function DTSortHeader({ label, sortKey, currentKey, direction, onSort, align = "left" }) {
  const active = sortKey === currentKey;
  return (
    <th style={{ ...TH_BASE, textAlign: align, cursor: "pointer", userSelect: "none" }} onClick={() => onSort(sortKey)} aria-sort={active ? (direction === "asc" ? "ascending" : "descending") : "none"}>
      <span style={{ display: "inline-flex", alignItems: "center", gap: 4, color: active ? "var(--brand-primary)" : "var(--text-muted)" }}>
        {label}
        <span style={{ display: "inline-flex", flexDirection: "column", lineHeight: 0.6, fontSize: "0.5rem", opacity: active ? 1 : 0.4 }}>
          <span style={{ color: active && direction === "asc" ? "var(--brand-primary)" : "var(--text-muted)" }}>▲</span>
          <span style={{ color: active && direction === "desc" ? "var(--brand-primary)" : "var(--text-muted)" }}>▼</span>
        </span>
      </span>
    </th>
  );
}

// ════════════════════════════════════════════════════════════════════════
// Sample data
// ════════════════════════════════════════════════════════════════════════

const DISTRICT_DATA = [
  { dist: "Atlanta",       vmt: 14.3,  fr: 1.42, ci: 0.18, ksi: 312,  n: 2840, fn: 1 },
  { dist: "Austin",        vmt: 28.7,  fr: 1.08, ci: 0.11, ksi: 521,  n: 4830 },
  { dist: "Beaumont",      vmt: 9.6,   fr: 1.61, ci: 0.22, ksi: 198,  n: 1920 },
  { dist: "Brownwood",     vmt: 5.2,   fr: 1.78, ci: 0.31, ksi: 124,  n: 1140 },
  { dist: "Bryan",         vmt: 7.4,   fr: 1.34, ci: 0.24, ksi: 156,  n: 1560 },
  { dist: "Childress",     vmt: 2.1,   fr: 1.92, ci: 0.45, ksi: 58,   n: 480, fn: 2 },
  { dist: "Corpus Christi",vmt: 12.8,  fr: 1.27, ci: 0.19, ksi: 247,  n: 2680 },
  { dist: "Dallas",        vmt: 47.2,  fr: 0.94, ci: 0.08, ksi: 712,  n: 7420 },
  { dist: "El Paso",       vmt: 11.4,  fr: 1.18, ci: 0.21, ksi: 218,  n: 2230 },
  { dist: "Fort Worth",    vmt: 38.6,  fr: 1.02, ci: 0.10, ksi: 614,  n: 6180 },
  { dist: "Houston",       vmt: 62.4,  fr: 0.88, ci: 0.07, ksi: 891,  n: 9240 },
  { dist: "Lubbock",       vmt: 6.8,   fr: 1.45, ci: 0.27, ksi: 142,  n: 1380 },
  { dist: "San Antonio",   vmt: 32.1,  fr: 1.04, ci: 0.10, ksi: 558,  n: 5210 },
  { dist: "Tyler",         vmt: 8.9,   fr: 1.51, ci: 0.23, ksi: 187,  n: 1820 },
];

// ════════════════════════════════════════════════════════════════════════
// Variant 1 — sortable research table with uncertainty + footnotes
// ════════════════════════════════════════════════════════════════════════

function DTSortableResearchTable() {
  const [sortKey, setSortKey] = _dtUseState("dist");
  const [dir, setDir] = _dtUseState("asc");
  const sorted = _dtUseMemo(() => {
    const arr = [...DISTRICT_DATA];
    arr.sort((a, b) => {
      const av = a[sortKey], bv = b[sortKey];
      if (typeof av === "string") return dir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
      return dir === "asc" ? av - bv : bv - av;
    });
    return arr;
  }, [sortKey, dir]);
  const onSort = (k) => {
    if (k === sortKey) setDir(dir === "asc" ? "desc" : "asc");
    else { setSortKey(k); setDir(k === "dist" ? "asc" : "desc"); }
  };

  return (
    <figure style={{ margin: 0 }}>
      {/* Caption */}
      <figcaption style={{ marginBottom: 12 }}>
        <div style={{ fontSize: "0.66rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.11em", color: "var(--text-muted)", fontFamily: "var(--font-body-bold)" }}>
          Table 4-2
        </div>
        <div style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", fontWeight: 500, color: "var(--text-primary)", marginTop: 4 }}>
          Fatal &amp; serious-injury rate by TxDOT district, 2019–2023
        </div>
        <div style={{ fontSize: "0.82rem", color: "var(--text-secondary)", marginTop: 4, maxWidth: 720, lineHeight: 1.55 }}>
          Five-year average rate per hundred million vehicle-miles travelled (HMVMT). Confidence intervals are 95%, computed by Poisson exact method. Click any column to sort.
        </div>
      </figcaption>

      <div style={{ overflowX: "auto", border: "1px solid var(--surface-border)", borderRadius: "var(--radius-sm)" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 720 }}>
          <thead>
            <tr style={{ background: "var(--surface-sunken)" }}>
              <DTSortHeader label="District" sortKey="dist" currentKey={sortKey} direction={dir} onSort={onSort} />
              <DTSortHeader label="VMT (B mi)" sortKey="vmt" currentKey={sortKey} direction={dir} onSort={onSort} align="right" />
              <DTSortHeader label="Fatal+SI rate (per HMVMT)" sortKey="fr" currentKey={sortKey} direction={dir} onSort={onSort} align="right" />
              <DTSortHeader label="K + A count" sortKey="ksi" currentKey={sortKey} direction={dir} onSort={onSort} align="right" />
              <DTSortHeader label="Total crashes (n)" sortKey="n" currentKey={sortKey} direction={dir} onSort={onSort} align="right" />
            </tr>
          </thead>
          <tbody>
            {sorted.map((row, i) => (
              <tr key={row.dist} style={{ background: i % 2 === 1 ? "color-mix(in srgb, var(--surface-sunken) 35%, transparent)" : "transparent" }}>
                <td style={{ ...TD_BASE, color: "var(--text-primary)", fontWeight: 500 }}>
                  {row.dist}{row.fn && <DTFnAnchor id={`fn-${row.fn}`} n={row.fn} />}
                </td>
                <td style={{ ...TD_BASE, ...NUM_CELL, color: "var(--text-primary)" }}>{row.vmt.toFixed(1)}</td>
                <td style={{ ...TD_BASE, color: "var(--text-primary)" }}>
                  <DTUncertainty value={row.fr} ci={row.ci} decimals={2} />
                </td>
                <td style={{ ...TD_BASE, ...NUM_CELL, color: "var(--text-primary)" }}>{row.ksi.toLocaleString()}</td>
                <td style={{ ...TD_BASE, ...NUM_CELL, color: "var(--text-secondary)" }}>{row.n.toLocaleString()}</td>
              </tr>
            ))}
            {/* total row */}
            <tr style={{ background: "color-mix(in srgb, var(--brand-primary) 6%, transparent)", borderTop: "2px solid var(--brand-primary)" }}>
              <td style={{ ...TD_BASE, color: "var(--text-primary)", fontWeight: 700, borderBottom: "none" }}>
                Statewide total
              </td>
              <td style={{ ...TD_BASE, ...NUM_CELL, color: "var(--text-primary)", fontWeight: 700, borderBottom: "none" }}>
                {DISTRICT_DATA.reduce((s, r) => s + r.vmt, 0).toFixed(1)}
              </td>
              <td style={{ ...TD_BASE, color: "var(--text-primary)", fontWeight: 700, borderBottom: "none" }}>
                <span style={NUM_CELL}>1.10<span style={{ color: "var(--text-muted)", marginLeft: 4, fontSize: "0.78rem", fontWeight: 400 }}> ± 0.04</span></span>
              </td>
              <td style={{ ...TD_BASE, ...NUM_CELL, color: "var(--text-primary)", fontWeight: 700, borderBottom: "none" }}>
                {DISTRICT_DATA.reduce((s, r) => s + r.ksi, 0).toLocaleString()}
              </td>
              <td style={{ ...TD_BASE, ...NUM_CELL, color: "var(--text-primary)", fontWeight: 700, borderBottom: "none" }}>
                {DISTRICT_DATA.reduce((s, r) => s + r.n, 0).toLocaleString()}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Footnotes */}
      <div style={{ marginTop: 14, paddingTop: 12, borderTop: "1px dashed var(--surface-border)", fontSize: "0.78rem", color: "var(--text-muted)", lineHeight: 1.6 }}>
        <div id="fn-1" style={{ marginBottom: 4 }}>
          <sup style={{ color: "var(--brand-primary)", fontFamily: "var(--font-mono)", marginRight: 4 }}>1</sup>
          Atlanta district VMT estimate revised in 2023 following the FHWA/HPMS reconciliation.
        </div>
        <div id="fn-2">
          <sup style={{ color: "var(--brand-primary)", fontFamily: "var(--font-mono)", marginRight: 4 }}>2</sup>
          Childress rate based on small sample (n &lt; 500); interpret with care.
        </div>
        <div style={{ marginTop: 8, fontFamily: "var(--font-mono)", fontSize: "0.7rem" }}>
          Source: TxDOT CRIS, FHWA HPMS · Compiled by TTI Center for Transportation Safety, 2024.
        </div>
      </div>
    </figure>
  );
}

// ════════════════════════════════════════════════════════════════════════
// Variant 2 — grouped row table (banded by region)
// ════════════════════════════════════════════════════════════════════════

const GROUPED_DATA = [
  {
    region: "North",
    rows: [
      { project: "I-35E Lewisville bridge",  ph: "Construction", cost: 142.8, schedule: 92, fn: null },
      { project: "US-380 widening",          ph: "Design",       cost: 98.4,  schedule: 100, fn: null },
      { project: "DFW connector",            ph: "Construction", cost: 1240,  schedule: 78, fn: 3 },
    ],
  },
  {
    region: "Central",
    rows: [
      { project: "MoPac South",              ph: "Letting",      cost: 488,   schedule: 100, fn: null },
      { project: "I-35 Cap Express Central", ph: "Construction", cost: 4500,  schedule: 84, fn: null },
    ],
  },
  {
    region: "Coast",
    rows: [
      { project: "I-45 NHHIP Segment 2",     ph: "On hold",      cost: 7400,  schedule: 0,  fn: 4 },
      { project: "SH-249 toll extension",    ph: "Open",         cost: 632,   schedule: 100, fn: null },
    ],
  },
];

function DTGroupedTable() {
  return (
    <figure style={{ margin: 0 }}>
      <figcaption style={{ marginBottom: 12 }}>
        <div style={{ fontSize: "0.66rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.11em", color: "var(--text-muted)", fontFamily: "var(--font-body-bold)" }}>Table 6-1</div>
        <div style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", fontWeight: 500, color: "var(--text-primary)", marginTop: 4 }}>
          Major capital projects in flight, by region
        </div>
      </figcaption>

      <div style={{ border: "1px solid var(--surface-border)", borderRadius: "var(--radius-sm)" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "var(--surface-sunken)" }}>
              <th style={{ ...TH_BASE }}>Project</th>
              <th style={{ ...TH_BASE }}>Phase</th>
              <th style={{ ...TH_BASE, textAlign: "right" }}>Cost ($M)</th>
              <th style={{ ...TH_BASE }}>Schedule</th>
            </tr>
          </thead>
          <tbody>
            {GROUPED_DATA.map((grp) => (
              <React.Fragment key={grp.region}>
                <tr style={{ background: "color-mix(in srgb, var(--brand-primary) 8%, transparent)" }}>
                  <th colSpan={4} scope="rowgroup" style={{ textAlign: "left", padding: "8px 12px", fontSize: "0.66rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--brand-primary)", fontFamily: "var(--font-body-bold)", borderBottom: "1px solid var(--surface-border)" }}>
                    {grp.region}
                  </th>
                </tr>
                {grp.rows.map((row, i) => {
                  const phaseColor = {
                    "Construction": "var(--brand-primary)",
                    "Design":       "var(--text-secondary)",
                    "Letting":      "var(--brand-accent)",
                    "Open":         "var(--color-success, oklch(0.55 0.13 145))",
                    "On hold":      "var(--color-error, oklch(0.55 0.18 25))",
                  }[row.ph];
                  return (
                    <tr key={`${grp.region}-${i}`}>
                      <td style={{ ...TD_BASE, color: "var(--text-primary)", fontWeight: 500 }}>
                        {row.project}{row.fn && <DTFnAnchor id={`fng-${row.fn}`} n={row.fn} />}
                      </td>
                      <td style={{ ...TD_BASE }}>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: "0.78rem", color: phaseColor, fontFamily: "var(--font-body-bold)", fontWeight: 600 }}>
                          <span style={{ width: 6, height: 6, borderRadius: "50%", background: phaseColor }} />
                          {row.ph}
                        </span>
                      </td>
                      <td style={{ ...TD_BASE, ...NUM_CELL, color: "var(--text-primary)" }}>
                        {row.cost >= 1000 ? row.cost.toLocaleString() : row.cost.toFixed(1)}
                      </td>
                      <td style={{ ...TD_BASE }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <div style={{ flex: 1, height: 6, background: "var(--surface-sunken)", borderRadius: 3, overflow: "hidden", maxWidth: 140 }}>
                            <div style={{ width: `${row.schedule}%`, height: "100%", background: phaseColor, opacity: row.schedule === 0 ? 0.3 : 1 }} />
                          </div>
                          <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: "var(--text-muted)", minWidth: 36, textAlign: "right" }}>{row.schedule}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: 12, paddingTop: 10, borderTop: "1px dashed var(--surface-border)", fontSize: "0.78rem", color: "var(--text-muted)", lineHeight: 1.6 }}>
        <div id="fng-3" style={{ marginBottom: 4 }}>
          <sup style={{ color: "var(--brand-primary)", fontFamily: "var(--font-mono)", marginRight: 4 }}>3</sup>
          DFW connector includes federal INFRA grant of $192M.
        </div>
        <div id="fng-4">
          <sup style={{ color: "var(--brand-primary)", fontFamily: "var(--font-mono)", marginRight: 4 }}>4</sup>
          NHHIP Segment 2 paused pending federal Title VI review (since 2023).
        </div>
      </div>
    </figure>
  );
}

// ════════════════════════════════════════════════════════════════════════
// Variant 3 — sticky-header dense table
// ════════════════════════════════════════════════════════════════════════

const DENSE_ROWS = (() => {
  const segs = [];
  for (let i = 1; i <= 18; i++) {
    segs.push({
      seg: `I-35 N-${String(i).padStart(2, "0")}`,
      from: 220 + i * 4,
      to:   224 + i * 4,
      pci:  Math.round(45 + Math.random() * 50),
      iri:  (60 + Math.random() * 80).toFixed(0),
      rut:  (Math.random() * 0.6).toFixed(2),
      year: 2017 + Math.floor(Math.random() * 7),
    });
  }
  return segs;
})();

function DTStickyDenseTable() {
  return (
    <figure style={{ margin: 0 }}>
      <figcaption style={{ marginBottom: 12 }}>
        <div style={{ fontSize: "0.66rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.11em", color: "var(--text-muted)", fontFamily: "var(--font-body-bold)" }}>Table A-7 (excerpt)</div>
        <div style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", fontWeight: 500, color: "var(--text-primary)", marginTop: 4 }}>
          Pavement segment inventory · I-35 northbound, MP 220–296
        </div>
      </figcaption>

      <div style={{ maxHeight: 320, overflow: "auto", border: "1px solid var(--surface-border)", borderRadius: "var(--radius-sm)" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.84rem" }}>
          <thead>
            <tr style={{ background: "var(--surface-sunken)" }}>
              {[
                { l: "Segment ID", a: "left" },
                { l: "From MP", a: "right" },
                { l: "To MP", a: "right" },
                { l: "PCI", a: "right" },
                { l: "IRI (in/mi)", a: "right" },
                { l: "Rut (in)", a: "right" },
                { l: "Year built", a: "right" },
              ].map(c => (
                <th key={c.l} style={{ ...TH_BASE, textAlign: c.a, position: "sticky", top: 0, background: "var(--surface-sunken)", zIndex: 1 }}>{c.l}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {DENSE_ROWS.map((r, i) => {
              const pciColor = r.pci >= 80 ? "var(--color-success, oklch(0.55 0.13 145))" : r.pci >= 60 ? "var(--brand-accent)" : "var(--color-error, oklch(0.55 0.18 25))";
              return (
                <tr key={r.seg} style={{ background: i % 2 === 1 ? "color-mix(in srgb, var(--surface-sunken) 30%, transparent)" : "transparent" }}>
                  <td style={{ ...TD_BASE, fontFamily: "var(--font-mono)", color: "var(--text-primary)" }}>{r.seg}</td>
                  <td style={{ ...TD_BASE, ...NUM_CELL, color: "var(--text-primary)" }}>{r.from}</td>
                  <td style={{ ...TD_BASE, ...NUM_CELL, color: "var(--text-primary)" }}>{r.to}</td>
                  <td style={{ ...TD_BASE, ...NUM_CELL }}>
                    <span style={{ color: pciColor, fontWeight: 700 }}>{r.pci}</span>
                  </td>
                  <td style={{ ...TD_BASE, ...NUM_CELL, color: "var(--text-secondary)" }}>{r.iri}</td>
                  <td style={{ ...TD_BASE, ...NUM_CELL, color: "var(--text-secondary)" }}>{r.rut}</td>
                  <td style={{ ...TD_BASE, ...NUM_CELL, color: "var(--text-secondary)" }}>{r.year}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: 10, fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--text-muted)" }}>
        Showing 18 of 312 segments · Header sticks during scroll · Color encodes PCI band (good ≥ 80, fair 60–79, poor &lt; 60)
      </div>
    </figure>
  );
}

// ════════════════════════════════════════════════════════════════════════
// Variant 4 — small comparison table (before/after)
// ════════════════════════════════════════════════════════════════════════

function DTComparisonTable() {
  const rows = [
    { metric: "Average daily delay (veh-hr)",   before: 18420, after: 11240, lower: true },
    { metric: "Worst-hour speed (mph)",          before: 22.4,  after: 38.7,  lower: false },
    { metric: "Crash rate (per HMVMT)",          before: 1.84,  after: 1.21,  lower: true },
    { metric: "Travel time index (PM peak)",     before: 1.92,  after: 1.41,  lower: true },
  ];
  return (
    <figure style={{ margin: 0 }}>
      <figcaption style={{ marginBottom: 12 }}>
        <div style={{ fontSize: "0.66rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.11em", color: "var(--text-muted)", fontFamily: "var(--font-body-bold)" }}>Table 8-3</div>
        <div style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", fontWeight: 500, color: "var(--text-primary)", marginTop: 4 }}>
          Operational results · I-635 LBJ Express · before vs. after
        </div>
      </figcaption>
      <div style={{ border: "1px solid var(--surface-border)", borderRadius: "var(--radius-sm)" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "var(--surface-sunken)" }}>
              <th style={{ ...TH_BASE }}>Metric</th>
              <th style={{ ...TH_BASE, textAlign: "right" }}>Before (2018)</th>
              <th style={{ ...TH_BASE, textAlign: "right" }}>After (2023)</th>
              <th style={{ ...TH_BASE, textAlign: "right" }}>Δ</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => {
              const pct = ((row.after - row.before) / row.before) * 100;
              const improved = row.lower ? pct < 0 : pct > 0;
              const color = improved ? "var(--color-success, oklch(0.55 0.13 145))" : "var(--color-error, oklch(0.55 0.18 25))";
              return (
                <tr key={i}>
                  <td style={{ ...TD_BASE, color: "var(--text-primary)" }}>{row.metric}</td>
                  <td style={{ ...TD_BASE, ...NUM_CELL, color: "var(--text-secondary)" }}>{row.before.toLocaleString(undefined, { maximumFractionDigits: 2 })}</td>
                  <td style={{ ...TD_BASE, ...NUM_CELL, color: "var(--text-primary)", fontWeight: 600 }}>{row.after.toLocaleString(undefined, { maximumFractionDigits: 2 })}</td>
                  <td style={{ ...TD_BASE, ...NUM_CELL, color, fontWeight: 700 }}>
                    {pct > 0 ? "+" : ""}{pct.toFixed(1)}%
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </figure>
  );
}

// ════════════════════════════════════════════════════════════════════════
// PAGE
// ════════════════════════════════════════════════════════════════════════

// ═════════════════════════════════════════════════════════════════
// Refit: selection + expandable rows (Ant/Fabric anatomy applied
// to a research-grade table — keeps tabular nums, footnotes, etc.)
// ═════════════════════════════════════════════════════════════════
function DTSelectableExpandable() {
  const rows = [
    { id: "I35-AUS",   corridor: "I-35 (Austin)",       lead: "Whitfield",  delay: 18.4, ci: 1.2,  freight: 23.6, n: 4820, footnote: 1, detail: "Free-flow speed 65 mph. Worst hour: 17:00–18:00 weekdays. Sample drawn from INRIX 2025 Q3, weighted by AADT." },
    { id: "US290-HOU", corridor: "US-290 (Houston)",    lead: "Okafor",     delay: 12.1, ci: 0.9,  freight: 31.4, n: 3140, footnote: 1, detail: "Truck volumes elevated due to Port of Houston freight; weekday peak 06:00–09:00 disproportionately affects regional logistics." },
    { id: "I10-ELP",   corridor: "I-10 (El Paso)",      lead: "Aguirre",    delay: 21.0, ci: 1.6,  freight: 48.2, n: 2680, footnote: 1, detail: "International freight share highest in dataset. Inspection-related delays at BridgePort excluded from baseline calculation." },
    { id: "L1604-SAT", corridor: "Loop 1604 (San Ant.)", lead: "Choudhury", delay:  9.3, ci: 0.7,  freight: 14.0, n: 5210, footnote: 1, detail: "NW quadrant under reconstruction. Reported delay reflects pre-construction baseline; current values 18-23 min during peak." },
  ];
  const [sel, setSel] = _dtUseState(new Set(["I35-AUS"]));
  const [exp, setExp] = _dtUseState(new Set(["I35-AUS"]));
  const toggle = (s, id) => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; };
  const allChecked = sel.size === rows.length;
  const someChecked = sel.size > 0 && !allChecked;
  return (
    <figure style={{ margin: 0 }}>
      <figcaption style={{ marginBottom: 10 }}>
        <span style={{ display: "block", fontFamily: "var(--font-display)", fontSize: "1.05rem", fontWeight: 500, letterSpacing: "0.01em", textTransform: "uppercase" }}>Table 4-2 · Corridor delays (selectable)</span>
        <span style={{ display: "block", fontSize: "0.78rem", color: "var(--text-muted)", marginTop: 2 }}>Click any row to expand; check rows to enable bulk export.</span>
      </figcaption>
      <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "var(--font-body)", color: "var(--text-secondary)" }}>
        <thead>
          <tr>
            <th scope="col" style={{ width: 36, padding: "10px 0 10px 14px", borderBottom: "2px solid var(--surface-border)", verticalAlign: "bottom" }}>
              <label style={{ display: "inline-flex", width: 16, height: 16, position: "relative", cursor: "pointer" }}>
                <input type="checkbox" checked={allChecked} onChange={() => setSel(allChecked ? new Set() : new Set(rows.map(r => r.id)))} style={{ position: "absolute", inset: 0, opacity: 0, margin: 0, cursor: "pointer" }} aria-label="Select all" />
                <span aria-hidden style={{ width: 16, height: 16, borderRadius: 3, border: `1.5px solid ${allChecked || someChecked ? "var(--brand-primary)" : "var(--surface-border)"}`, background: allChecked || someChecked ? "var(--brand-primary)" : "var(--surface-raised)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {allChecked && <LucideIcon name="check" size={11} color="white" strokeWidth={3} />}
                  {someChecked && <span style={{ width: 8, height: 2, background: "white", borderRadius: 1 }} />}
                </span>
              </label>
            </th>
            <th scope="col" style={{ width: 28, padding: "10px 0", borderBottom: "2px solid var(--surface-border)" }} aria-label="Expand" />
            <th scope="col" style={{ ...TH_BASE, paddingLeft: 4 }}>Corridor</th>
            <th scope="col" style={TH_BASE}>Lead</th>
            <th scope="col" style={{ ...TH_BASE, textAlign: "right" }}>Delay (min)</th>
            <th scope="col" style={{ ...TH_BASE, textAlign: "right" }}>Freight %</th>
            <th scope="col" style={{ ...TH_BASE, textAlign: "right" }}>n</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(r => {
            const isSel = sel.has(r.id);
            const isExp = exp.has(r.id);
            return (
              <React.Fragment key={r.id}>
                <tr style={{ background: isSel ? "color-mix(in srgb, var(--brand-primary) 5%, transparent)" : "transparent" }}>
                  <td style={{ width: 36, padding: "11px 0 11px 14px", borderBottom: "1px solid var(--surface-border)" }}>
                    <label style={{ display: "inline-flex", width: 16, height: 16, position: "relative", cursor: "pointer" }}>
                      <input type="checkbox" checked={isSel} onChange={() => setSel(s => toggle(s, r.id))} style={{ position: "absolute", inset: 0, opacity: 0, margin: 0, cursor: "pointer" }} aria-label={`Select ${r.id}`} />
                      <span aria-hidden style={{ width: 16, height: 16, borderRadius: 3, border: `1.5px solid ${isSel ? "var(--brand-primary)" : "var(--surface-border)"}`, background: isSel ? "var(--brand-primary)" : "var(--surface-raised)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        {isSel && <LucideIcon name="check" size={11} color="white" strokeWidth={3} />}
                      </span>
                    </label>
                  </td>
                  <td style={{ width: 28, padding: "11px 0", borderBottom: "1px solid var(--surface-border)" }}>
                    <button onClick={() => setExp(s => toggle(s, r.id))} aria-label={isExp ? "Collapse" : "Expand"} aria-expanded={isExp} style={{ background: "transparent", border: "none", padding: 4, color: "var(--text-muted)", cursor: "pointer", display: "inline-flex", transform: isExp ? "rotate(90deg)" : "rotate(0)", transition: "transform 160ms cubic-bezier(0.2, 0, 0, 1)" }}>
                      <LucideIcon name="chevron-right" size={13} />
                    </button>
                  </td>
                  <td style={{ ...TD_BASE, paddingLeft: 4, color: "var(--text-primary)", fontFamily: "var(--font-body-bold)", fontWeight: 600 }}>
                    {r.corridor} <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: "var(--text-muted)", fontWeight: 500, marginLeft: 6 }}>{r.id}</span>
                  </td>
                  <td style={TD_BASE}>{r.lead}</td>
                  <td style={{ ...TD_BASE, ...NUM_CELL, color: r.delay > 18 ? "var(--color-error)" : "var(--text-primary)", fontWeight: r.delay > 18 ? 700 : 500 }}>
                    <DTUncertainty value={r.delay} ci={r.ci} decimals={1} />
                    <DTFnAnchor n={r.footnote} />
                  </td>
                  <td style={{ ...TD_BASE, ...NUM_CELL }}>{r.freight.toFixed(1)}</td>
                  <td style={{ ...TD_BASE, ...NUM_CELL, color: "var(--text-muted)" }}>{r.n.toLocaleString()}</td>
                </tr>
                {isExp && (
                  <tr style={{ background: "var(--surface-sunken)" }}>
                    <td colSpan={7} style={{ padding: "14px 18px 16px 60px", borderBottom: "1px solid var(--surface-border)", fontSize: "0.84rem", color: "var(--text-secondary)", lineHeight: 1.55 }}>
                      <div style={{ fontSize: "0.62rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--text-muted)", fontFamily: "var(--font-body-bold)", marginBottom: 6 }}>Method note · {r.id}</div>
                      {r.detail}
                    </td>
                  </tr>
                )}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
      <div style={{ marginTop: 14, padding: "10px 14px", background: "var(--surface-sunken)", borderRadius: 3, fontSize: "0.78rem", color: "var(--text-muted)", lineHeight: 1.55 }}>
        <span style={{ color: "var(--brand-primary)", fontWeight: 700, fontFamily: "var(--font-mono)", marginRight: 6 }}>[1]</span>
        Delay relative to free-flow, INRIX probe vehicle data 2025 Q3, weighted by AADT. CI = 95% confidence.
      </div>
    </figure>
  );
}

function DataTablesPage() {
  const item = (window.AGGIE_CATALOG || []).find(c => c.id === "data-tables");
  return (
    <PageShell item={item}>
      <DTIntro>
        Tables tuned for research deliverables: <strong>tabular figures</strong> (mono, lining), <strong>uncertainty cells</strong> (value ± CI), <strong>footnote anchors</strong> wired to a formal note block, <strong>sortable columns</strong>, <strong>row groups</strong>, and a <strong>sticky-header dense variant</strong> for appendix tables. Every table opens with a numbered caption (Table N-N) and closes with a source line — so it can be lifted directly into a report PDF.
      </DTIntro>

      <DTSectionLabel>Sortable research table — uncertainty cells + footnotes</DTSectionLabel>
      <DTBox label="The flagship treatment · click headers to sort">
        <DTSortableResearchTable />
      </DTBox>

      <DTSectionLabel>Grouped — row groups banded by category</DTSectionLabel>
      <DTBox label="Region-grouped capital project table · phase chips · schedule bars">
        <DTGroupedTable />
      </DTBox>

      <DTSectionLabel>Sticky-header dense — appendix tables</DTSectionLabel>
      <DTBox label="Compact · scrollable body · header pinned · color-coded category">
        <DTStickyDenseTable />
      </DTBox>

      <DTSectionLabel>Comparison — before/after with delta column</DTSectionLabel>
      <DTBox label="Small four-column · improvement direction encoded by color">
        <DTComparisonTable />
      </DTBox>

      <DTSectionLabel>Selectable + expandable — row interactions</DTSectionLabel>
      <DTBox label="Refit: row selection + expandable detail · anatomy from Ant/Fabric, type and footnotes stay TUX">
        <DTSelectableExpandable />
      </DTBox>

      {/* Decision matrix */}
      <DTSectionLabel>When to use which</DTSectionLabel>
      <div style={{ overflow: "hidden", border: "1px solid var(--surface-border)", borderRadius: "var(--radius-md)", marginBottom: 16 }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.86rem" }}>
          <thead>
            <tr style={{ background: "var(--surface-sunken)" }}>
              {["Variant", "Use it for", "Avoid for"].map(h => (
                <th key={h} style={{ textAlign: "left", padding: "10px 14px", fontSize: "0.66rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-muted)", fontFamily: "var(--font-body-bold)", borderBottom: "1px solid var(--surface-border)" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              ["Sortable research",  "Primary findings tables in a report (rates, counts, populations w/ CIs)",   "Quick scan / dashboard summaries — use chart-bar instead"],
              ["Grouped",            "Inventories segmented by category — districts, regions, programs",            "Continuous quantitative comparison — sortable form is better"],
              ["Sticky dense",       "Appendix tables, exhaustive segment / station / asset listings",              "Top-of-report findings — too dense to scan"],
              ["Comparison",         "Before/after, treatment vs. control, scenario comparisons",                  "More than two columns to compare — use grouped or sortable"],
            ].map((row, i) => (
              <tr key={i}>
                {row.map((cell, j) => (
                  <td key={j} style={{ padding: "12px 14px", borderBottom: i === 3 ? "none" : "1px solid var(--surface-border)", color: j === 0 ? "var(--text-primary)" : "var(--text-secondary)", fontWeight: j === 0 ? 600 : 400, lineHeight: 1.55 }}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <DTSpecRow>
        <DTSpec label="Numerals"     value="JetBrains Mono · tabular-nums" note="Right-aligned · always lining figures" />
        <DTSpec label="Uncertainty"  value="value ± CI" note="CI in muted color, smaller weight; total row uses same form" />
        <DTSpec label="Footnotes"    value="<sup><a></a></sup>" note="Anchored to dl-style block below table; mono numerals" />
        <DTSpec label="Caption"      value="Table N-N · display face title" note="Always numbered; source line under footnotes" />
      </DTSpecRow>
    </PageShell>
  );
}

Object.assign(window, { DataTablesPage });
