/* global React, PageShell, AGGIE_CATALOG, LucideIcon */
/*
 * AggieRichDataGrid.jsx — Batch E: Interactive data grid.
 *
 * Anatomy informed by Ant Design Table, Microsoft Fluent 2 Web DataGrid
 * (7 frames), and Microsoft Fabric Rich-data-grid:
 *   - sticky column header that survives scroll
 *   - row selection (header checkbox + per-row checkbox, indeterminate state)
 *   - expandable rows (per-row chevron, inline detail panel)
 *   - column resize affordance (hover handle)
 *   - sort/filter chips for the active query state
 *   - bulk-action bar that surfaces only when ≥1 row selected
 *
 * Identity stays TUX:
 *   - Work Sans / Open Sans / JetBrains Mono only
 *   - maroon focus ring (two-ring), warm-neutral surfaces
 *   - tabular-nums on every numeric column
 *   - no chrome borrowed from Ant, Fluent, or Fabric — anatomy only
 *
 * Helper prefix: RG.
 */

const { useState: _rgUseState, useMemo: _rgUseMemo, useRef: _rgUseRef, useEffect: _rgUseEffect } = React;

// ─── Shared chrome helpers (RG prefix) ──────────────────────────────────
function RGBox({ dark = false, label, padded = false, children }) {
  return (
    <div style={{ border: "1px solid var(--surface-border)", borderRadius: "var(--radius-md)", overflow: "hidden", marginBottom: 16 }}>
      <div style={{ padding: "7px 14px", fontSize: "0.62rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: dark ? "rgba(255,255,255,0.85)" : "var(--text-muted)", fontFamily: "var(--font-body-bold)", background: dark ? "var(--brand-primary)" : "var(--surface-sunken)", borderBottom: "1px solid var(--surface-border)", display: "flex", justifyContent: "space-between" }}>
        <span>{label}</span>
        <span style={{ fontFamily: "var(--font-mono)", fontWeight: 500, opacity: 0.7 }}>on {dark ? "dark" : "light"}</span>
      </div>
      <div style={{ padding: padded ? 24 : 0, background: dark ? "#0E1216" : "var(--surface-page)" }}>{children}</div>
    </div>
  );
}
function RGSectionLabel({ children }) {
  return <div style={{ fontSize: "0.62rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--text-muted)", fontFamily: "var(--font-body-bold)", marginBottom: 12, marginTop: 28 }}>{children}</div>;
}
function RGIntro({ children }) {
  return <div style={{ padding: "16px 20px", marginBottom: 28, background: "color-mix(in srgb, var(--brand-primary) 5%, transparent)", borderLeft: "3px solid var(--brand-primary)", borderRadius: "0 var(--radius-sm) var(--radius-sm) 0", fontSize: "0.92rem", lineHeight: 1.65, color: "var(--text-secondary)" }}>{children}</div>;
}
function RGSpecRow({ children }) {
  return <div style={{ marginTop: 28, padding: "14px 18px", border: "1px solid var(--surface-border)", borderRadius: "var(--radius-md)", background: "var(--surface-raised)", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>{children}</div>;
}
function RGSpec({ label, value, note }) {
  return (
    <div>
      <div style={{ fontSize: "0.6rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-muted)", fontFamily: "var(--font-body-bold)" }}>{label}</div>
      <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem", color: "var(--brand-primary)", marginTop: 3, fontWeight: 500 }}>{value}</div>
      {note && <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: 2, lineHeight: 1.4 }}>{note}</div>}
    </div>
  );
}

// ─── Checkbox primitive (matches our form-core) ─────────────────────────
function RGCheckbox({ checked, indeterminate, onChange, dark = false, "aria-label": ariaLabel }) {
  const ref = _rgUseRef(null);
  _rgUseEffect(() => {
    if (ref.current) ref.current.indeterminate = !!indeterminate && !checked;
  }, [indeterminate, checked]);
  const filled = checked || indeterminate;
  const bg = dark ? "rgba(255,255,255,0.06)" : "var(--surface-raised)";
  return (
    <label style={{ position: "relative", display: "inline-flex", width: 16, height: 16, cursor: "pointer", alignItems: "center", justifyContent: "center" }}>
      <input ref={ref} type="checkbox" checked={!!checked} onChange={onChange} aria-label={ariaLabel} style={{ position: "absolute", inset: 0, opacity: 0, margin: 0, cursor: "pointer" }} />
      <span aria-hidden style={{ width: 16, height: 16, borderRadius: 3, border: `1.5px solid ${filled ? "var(--brand-primary)" : (dark ? "rgba(255,255,255,0.4)" : "var(--surface-border)")}`, background: filled ? "var(--brand-primary)" : bg, display: "flex", alignItems: "center", justifyContent: "center", transition: "background 120ms, border-color 120ms" }}>
        {checked && <LucideIcon name="check" size={11} color="white" strokeWidth={3} />}
        {indeterminate && !checked && <span style={{ width: 8, height: 2, background: "white", borderRadius: 1 }} />}
      </span>
    </label>
  );
}

// ─── Sample dataset: TTI corridor projects ──────────────────────────────
const RG_PROJECTS = [
  { id: "PRJ-2841", name: "I-35 Capital Express",     district: "Austin",      lead: "L. Whitfield",  status: "Active",      delay: 18.4, freight: 23.6, lastUpdate: "2025-10-14", phase: "Construction",  budget: 482.0, scope: "Adds two managed lanes Williamson → Hays. Tolling per FasTrak §4.2." },
  { id: "PRJ-2842", name: "US-290 East Reliever",     district: "Houston",     lead: "C. Okafor",     status: "Active",      delay: 12.1, freight: 31.4, lastUpdate: "2025-10-22", phase: "Design 60%",    budget: 218.5, scope: "Frontage rebuild + reversible HOV between Beltway 8 and SH-6." },
  { id: "PRJ-2843", name: "SH-130 Rural ITS",         district: "San Antonio", lead: "M. Reyes",      status: "Hold",        delay: 4.2,  freight: 9.8,  lastUpdate: "2025-09-29", phase: "Scoping",       budget: 36.2,  scope: "Travel-time signage and weather-responsive limits, MM 412–436." },
  { id: "PRJ-2844", name: "I-10 Border Freight",      district: "El Paso",     lead: "J. Aguirre",    status: "Active",      delay: 21.0, freight: 48.2, lastUpdate: "2025-10-31", phase: "Construction",  budget: 644.8, scope: "Truck-only lanes BridgePort to Cesar Chavez. Coord w/ Mexico SCT." },
  { id: "PRJ-2845", name: "Loop 1604 Reconstruction", district: "San Antonio", lead: "P. Choudhury",  status: "Active",      delay: 9.3,  freight: 14.0, lastUpdate: "2025-10-18", phase: "Design 90%",    budget: 312.4, scope: "Six-lane mainlane build NW quadrant w/ diverging-diamond at Bandera." },
  { id: "PRJ-2846", name: "FM-1488 Rural Realign",    district: "Houston",     lead: "S. Patel",      status: "Closed",      delay: 0.0,  freight: 5.1,  lastUpdate: "2025-08-04", phase: "Closeout",      budget: 41.7,  scope: "Two-lane realign w/ wildlife crossings; closed under final acceptance." },
  { id: "PRJ-2847", name: "I-45 Central Sustained",   district: "Houston",     lead: "T. Nguyen",     status: "Risk",        delay: 28.7, freight: 19.9, lastUpdate: "2025-10-29", phase: "Construction",  budget: 1280.0, scope: "Stack reconstruction; ROW acquisition lagging 14% behind plan." },
  { id: "PRJ-2848", name: "US-59 Lufkin Bypass",      district: "Atlanta",     lead: "K. Boyd",       status: "Active",      delay: 6.8,  freight: 11.2, lastUpdate: "2025-10-20", phase: "Design 30%",    budget: 154.1, scope: "Four-lane divided bypass NE of Lufkin; environmental clearance underway." },
];

const RG_STATUS_COLOR = {
  "Active":  { dot: "var(--color-success)", text: "var(--color-success)" },
  "Hold":    { dot: "var(--brand-accent)",  text: "var(--brand-accent)" },
  "Risk":    { dot: "var(--color-error)",   text: "var(--color-error)" },
  "Closed":  { dot: "var(--text-muted)",    text: "var(--text-muted)" },
};

// ─── Sort header w/ resize handle ───────────────────────────────────────
function RGSortHeader({ label, sortKey, currentKey, direction, onSort, align = "left", dark = false, width, resizable = true, last = false }) {
  const active = sortKey === currentKey;
  const muted = dark ? "rgba(255,255,255,0.55)" : "var(--text-muted)";
  return (
    <th scope="col" style={{
      width: width || "auto",
      padding: "10px 14px",
      textAlign: align,
      verticalAlign: "bottom",
      borderBottom: `2px solid ${dark ? "rgba(255,255,255,0.16)" : "var(--surface-border)"}`,
      borderRight: !last && resizable ? `1px solid ${dark ? "rgba(255,255,255,0.07)" : "var(--surface-border-subtle, rgba(0,0,0,0.06))"}` : "none",
      position: "relative",
      whiteSpace: "nowrap",
    }}>
      <button onClick={() => onSort && onSort(sortKey)} style={{ background: "transparent", border: "none", padding: 0, color: active ? (dark ? "rgba(255,255,255,0.95)" : "var(--text-primary)") : muted, fontFamily: "var(--font-body-bold)", fontSize: "0.66rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", cursor: onSort ? "pointer" : "default", display: "inline-flex", alignItems: "center", gap: 5 }}>
        <span>{label}</span>
        {onSort && (
          <span style={{ display: "inline-flex", flexDirection: "column", lineHeight: 0.6, opacity: active ? 1 : 0.35 }}>
            <span style={{ fontSize: "0.56rem", color: active && direction === "asc" ? "var(--brand-primary)" : "currentColor" }}>▲</span>
            <span style={{ fontSize: "0.56rem", color: active && direction === "desc" ? "var(--brand-primary)" : "currentColor" }}>▼</span>
          </span>
        )}
      </button>
      {resizable && !last && (
        <span aria-hidden title="Drag to resize" style={{ position: "absolute", right: -3, top: "20%", bottom: "20%", width: 6, cursor: "col-resize", display: "flex", justifyContent: "center" }}>
          <span style={{ width: 1, background: dark ? "rgba(255,255,255,0.2)" : "var(--surface-border)", height: "100%" }} />
        </span>
      )}
    </th>
  );
}

// ─── Filter chip strip (active query state) ─────────────────────────────
function RGFilterChips({ chips, onRemove, onClear, dark = false }) {
  if (!chips || !chips.length) return null;
  const text = dark ? "rgba(255,255,255,0.85)" : "var(--text-secondary)";
  const chipBg = dark ? "rgba(255,255,255,0.08)" : "color-mix(in srgb, var(--brand-primary) 8%, transparent)";
  return (
    <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 8, padding: "10px 14px", borderBottom: `1px solid ${dark ? "rgba(255,255,255,0.1)" : "var(--surface-border)"}`, background: dark ? "rgba(255,255,255,0.02)" : "var(--surface-raised)" }}>
      <span style={{ fontSize: "0.66rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.11em", color: dark ? "rgba(255,255,255,0.55)" : "var(--text-muted)", fontFamily: "var(--font-body-bold)", marginRight: 4 }}>Filters</span>
      {chips.map((c, i) => (
        <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "3px 4px 3px 10px", background: chipBg, color: dark ? "rgba(255,255,255,0.92)" : "var(--brand-primary)", fontSize: "0.74rem", fontFamily: "var(--font-body-bold)", fontWeight: 600, borderRadius: 3, border: `1px solid ${dark ? "rgba(255,255,255,0.12)" : "color-mix(in srgb, var(--brand-primary) 22%, transparent)"}` }}>
          <span style={{ color: dark ? "rgba(255,255,255,0.55)" : "var(--text-muted)", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.06em", fontSize: "0.65rem" }}>{c.label}:</span>
          <span>{c.value}</span>
          <button onClick={() => onRemove && onRemove(i)} aria-label={`Remove ${c.label} filter`} style={{ background: "transparent", border: "none", color: "inherit", padding: "0 4px", cursor: "pointer", lineHeight: 0, opacity: 0.7 }}>
            <LucideIcon name="x" size={11} strokeWidth={2.5} />
          </button>
        </span>
      ))}
      <button onClick={onClear} style={{ background: "transparent", border: "none", color: dark ? "rgba(255,255,255,0.65)" : "var(--text-muted)", fontFamily: "var(--font-body-bold)", fontSize: "0.7rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.09em", cursor: "pointer", marginLeft: 4 }}>Clear all</button>
    </div>
  );
}

// ─── Bulk-action bar (visible when selection > 0) ───────────────────────
function RGBulkBar({ count, onClear, dark = false }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "9px 14px", background: "var(--brand-primary)", color: "white", fontSize: "0.82rem" }}>
      <RGCheckbox checked={true} onChange={onClear} dark={true} aria-label="Clear selection" />
      <span style={{ fontFamily: "var(--font-body-bold)", fontWeight: 600 }}>{count} selected</span>
      <span style={{ flex: 1 }} />
      <button style={bulkBtn}>
        <LucideIcon name="download" size={13} /> Export CSV
      </button>
      <button style={bulkBtn}>
        <LucideIcon name="archive" size={13} /> Archive
      </button>
      <button style={bulkBtn}>
        <LucideIcon name="user-plus" size={13} /> Reassign
      </button>
      <button onClick={onClear} style={{ ...bulkBtn, paddingLeft: 8, paddingRight: 8 }} aria-label="Clear selection">
        <LucideIcon name="x" size={13} />
      </button>
    </div>
  );
}
const bulkBtn = { display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 11px", background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.22)", borderRadius: 3, color: "white", fontFamily: "var(--font-body-bold)", fontSize: "0.72rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", cursor: "pointer" };

// ════════════════════════════════════════════════════════════════════════
// 1. FULL INTERACTIVE GRID
// ════════════════════════════════════════════════════════════════════════
function RGInteractiveGrid({ dark = false }) {
  const [sortKey, setSortKey] = _rgUseState("delay");
  const [dir, setDir] = _rgUseState("desc");
  const [selected, setSelected] = _rgUseState(new Set(["PRJ-2841", "PRJ-2847"]));
  const [expanded, setExpanded] = _rgUseState(new Set(["PRJ-2847"]));
  const [filters, setFilters] = _rgUseState([
    { label: "District", value: "Houston, Austin, San Antonio" },
    { label: "Status",   value: "Active or Risk" },
  ]);

  const sorted = _rgUseMemo(() => {
    const arr = [...RG_PROJECTS];
    arr.sort((a, b) => {
      const av = a[sortKey], bv = b[sortKey];
      const cmp = (typeof av === "number" && typeof bv === "number") ? av - bv : String(av).localeCompare(String(bv));
      return dir === "asc" ? cmp : -cmp;
    });
    return arr;
  }, [sortKey, dir]);

  const onSort = (k) => { if (k === sortKey) setDir(d => d === "asc" ? "desc" : "asc"); else { setSortKey(k); setDir("asc"); } };
  const allChecked = selected.size === RG_PROJECTS.length;
  const someChecked = selected.size > 0 && !allChecked;

  const toggleRow = (id) => setSelected(s => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const toggleAll = () => setSelected(allChecked ? new Set() : new Set(RG_PROJECTS.map(p => p.id)));
  const toggleExpand = (id) => setExpanded(s => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });

  const text     = dark ? "rgba(255,255,255,0.92)" : "var(--text-primary)";
  const textSec  = dark ? "rgba(255,255,255,0.72)" : "var(--text-secondary)";
  const muted    = dark ? "rgba(255,255,255,0.55)" : "var(--text-muted)";
  const border   = dark ? "rgba(255,255,255,0.1)"  : "var(--surface-border)";
  const headerBg = dark ? "#161B22" : "var(--surface-sunken)";
  const rowHover = dark ? "rgba(255,255,255,0.04)" : "color-mix(in srgb, var(--brand-primary) 3%, transparent)";
  const rowSel   = dark ? "rgba(217,155,126,0.08)" : "color-mix(in srgb, var(--brand-primary) 5%, transparent)";

  return (
    <div style={{ background: dark ? "#0E1216" : "var(--surface-raised)", border: `1px solid ${border}`, borderRadius: "var(--radius-md)", overflow: "hidden" }}>
      {/* Toolbar */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", borderBottom: `1px solid ${border}` }}>
        <div>
          <div style={{ fontFamily: "var(--font-display)", fontSize: "1.05rem", fontWeight: 500, letterSpacing: "0.01em", textTransform: "uppercase", color: text }}>Active corridor projects</div>
          <div style={{ fontSize: "0.72rem", color: muted, marginTop: 2 }}>FY 2025 · {RG_PROJECTS.length} of 184 · last sync 14 min ago</div>
        </div>
        <div style={{ flex: 1 }} />
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 10px", background: dark ? "rgba(255,255,255,0.06)" : "var(--surface-page)", border: `1px solid ${border}`, borderRadius: 3, minWidth: 200 }}>
          <LucideIcon name="search" size={12} color={muted} />
          <input placeholder="Search projects, leads, districts…" style={{ flex: 1, border: "none", outline: "none", background: "transparent", fontFamily: "inherit", fontSize: "0.78rem", color: text }} />
        </div>
        <button style={{ ...toolBtn, color: text, borderColor: border, background: dark ? "rgba(255,255,255,0.04)" : "var(--surface-page)" }}><LucideIcon name="filter" size={12} /> Filter</button>
        <button style={{ ...toolBtn, color: text, borderColor: border, background: dark ? "rgba(255,255,255,0.04)" : "var(--surface-page)" }}><LucideIcon name="columns-3" size={12} /> Columns</button>
        <button style={{ ...toolBtn, color: text, borderColor: border, background: dark ? "rgba(255,255,255,0.04)" : "var(--surface-page)" }}><LucideIcon name="download" size={12} /> Export</button>
      </div>

      <RGFilterChips chips={filters} onRemove={(i) => setFilters(f => f.filter((_, j) => j !== i))} onClear={() => setFilters([])} dark={dark} />

      {selected.size > 0 && <RGBulkBar count={selected.size} onClear={() => setSelected(new Set())} dark={dark} />}

      {/* Grid — sticky header. Fixed height to demonstrate scroll. */}
      <div style={{ maxHeight: 440, overflow: "auto", position: "relative" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "var(--font-body)", color: textSec }}>
          <thead style={{ position: "sticky", top: 0, zIndex: 2, background: headerBg }}>
            <tr>
              <th scope="col" style={{ width: 36, padding: "10px 0 10px 14px", borderBottom: `2px solid ${border}` }}>
                <RGCheckbox checked={allChecked} indeterminate={someChecked} onChange={toggleAll} dark={dark} aria-label="Select all rows" />
              </th>
              <th scope="col" style={{ width: 28, padding: "10px 0", borderBottom: `2px solid ${border}` }} aria-label="Expand row" />
              <RGSortHeader label="Project" sortKey="name" currentKey={sortKey} direction={dir} onSort={onSort} dark={dark} width={260} />
              <RGSortHeader label="District" sortKey="district" currentKey={sortKey} direction={dir} onSort={onSort} dark={dark} width={120} />
              <RGSortHeader label="Lead" sortKey="lead" currentKey={sortKey} direction={dir} onSort={onSort} dark={dark} width={130} />
              <RGSortHeader label="Status" sortKey="status" currentKey={sortKey} direction={dir} onSort={onSort} dark={dark} width={100} />
              <RGSortHeader label="Delay (min)" sortKey="delay" currentKey={sortKey} direction={dir} onSort={onSort} dark={dark} width={110} align="right" />
              <RGSortHeader label="Freight %" sortKey="freight" currentKey={sortKey} direction={dir} onSort={onSort} dark={dark} width={100} align="right" />
              <RGSortHeader label="Budget ($M)" sortKey="budget" currentKey={sortKey} direction={dir} onSort={onSort} dark={dark} width={120} align="right" last />
            </tr>
          </thead>
          <tbody>
            {sorted.map((row, i) => {
              const sel = selected.has(row.id);
              const exp = expanded.has(row.id);
              return (
                <React.Fragment key={row.id}>
                  <tr style={{ background: sel ? rowSel : "transparent", transition: "background 100ms" }}
                      onMouseEnter={(e) => { if (!sel) e.currentTarget.style.background = rowHover; }}
                      onMouseLeave={(e) => { if (!sel) e.currentTarget.style.background = "transparent"; }}>
                    <td style={{ width: 36, padding: "11px 0 11px 14px", borderBottom: `1px solid ${border}` }}>
                      <RGCheckbox checked={sel} onChange={() => toggleRow(row.id)} dark={dark} aria-label={`Select ${row.id}`} />
                    </td>
                    <td style={{ width: 28, padding: "11px 0", borderBottom: `1px solid ${border}` }}>
                      <button onClick={() => toggleExpand(row.id)} aria-label={exp ? "Collapse row" : "Expand row"} aria-expanded={exp} style={{ background: "transparent", border: "none", color: muted, cursor: "pointer", padding: 4, display: "inline-flex", transform: exp ? "rotate(90deg)" : "rotate(0)", transition: "transform 160ms cubic-bezier(0.2, 0, 0, 1)" }}>
                        <LucideIcon name="chevron-right" size={13} />
                      </button>
                    </td>
                    <td style={{ padding: "11px 14px", borderBottom: `1px solid ${border}`, color: text, fontFamily: "var(--font-body-bold)", fontWeight: 600, fontSize: "0.86rem" }}>
                      <div>{row.name}</div>
                      <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: muted, fontWeight: 500, marginTop: 2 }}>{row.id} · {row.phase}</div>
                    </td>
                    <td style={{ padding: "11px 14px", borderBottom: `1px solid ${border}`, fontSize: "0.84rem" }}>{row.district}</td>
                    <td style={{ padding: "11px 14px", borderBottom: `1px solid ${border}`, fontSize: "0.84rem" }}>{row.lead}</td>
                    <td style={{ padding: "11px 14px", borderBottom: `1px solid ${border}`, fontSize: "0.84rem" }}>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 6, color: RG_STATUS_COLOR[row.status].text, fontFamily: "var(--font-body-bold)", fontWeight: 600 }}>
                        <span aria-hidden style={{ width: 6, height: 6, borderRadius: "50%", background: RG_STATUS_COLOR[row.status].dot }} />
                        {row.status}
                      </span>
                    </td>
                    <td style={{ ...numCell, borderBottom: `1px solid ${border}`, color: row.delay > 20 ? "var(--color-error)" : (row.delay > 12 ? "var(--brand-accent)" : textSec), fontWeight: row.delay > 20 ? 700 : 500 }}>{row.delay.toFixed(1)}</td>
                    <td style={{ ...numCell, borderBottom: `1px solid ${border}` }}>{row.freight.toFixed(1)}</td>
                    <td style={{ ...numCell, borderBottom: `1px solid ${border}`, color: text, fontWeight: 600 }}>{row.budget.toFixed(1)}</td>
                  </tr>
                  {exp && (
                    <tr style={{ background: dark ? "rgba(255,255,255,0.025)" : "var(--surface-sunken)" }}>
                      <td colSpan={9} style={{ padding: "16px 56px 18px", borderBottom: `1px solid ${border}`, fontSize: "0.86rem", lineHeight: 1.55, color: textSec }}>
                        <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) 200px", gap: 32 }}>
                          <div>
                            <div style={{ fontSize: "0.62rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: muted, fontFamily: "var(--font-body-bold)", marginBottom: 6 }}>Scope · {row.id}</div>
                            <div>{row.scope}</div>
                          </div>
                          <div>
                            <div style={{ fontSize: "0.62rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: muted, fontFamily: "var(--font-body-bold)", marginBottom: 6 }}>Last update</div>
                            <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.82rem", color: text }}>{row.lastUpdate}</div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer pagination */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", borderTop: `1px solid ${border}`, fontSize: "0.78rem", color: muted, background: dark ? "rgba(255,255,255,0.02)" : "var(--surface-raised)" }}>
        <span>Showing 1–{RG_PROJECTS.length} of 184 projects</span>
        <div style={{ display: "inline-flex", gap: 4 }}>
          {["‹", "1", "2", "3", "…", "23", "›"].map((p, i) => (
            <button key={i} style={{ minWidth: 28, padding: "4px 8px", border: `1px solid ${border}`, background: p === "1" ? "var(--brand-primary)" : (dark ? "rgba(255,255,255,0.04)" : "var(--surface-page)"), color: p === "1" ? "white" : (dark ? "rgba(255,255,255,0.85)" : "var(--text-secondary)"), fontFamily: "var(--font-mono)", fontSize: "0.78rem", borderRadius: 3, cursor: "pointer" }}>{p}</button>
          ))}
        </div>
      </div>
    </div>
  );
}
const toolBtn = { display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 11px", border: "1px solid", borderRadius: 3, fontFamily: "var(--font-body-bold)", fontSize: "0.72rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", cursor: "pointer" };
const numCell = { padding: "11px 14px", fontFamily: "var(--font-mono)", fontVariantNumeric: "tabular-nums", textAlign: "right", fontSize: "0.84rem", whiteSpace: "nowrap" };

// ════════════════════════════════════════════════════════════════════════
// 2. COMPACT VARIANT (no expand, smaller padding) — for embedded contexts
// ════════════════════════════════════════════════════════════════════════
function RGCompactGrid() {
  const rows = RG_PROJECTS.slice(0, 5);
  return (
    <div style={{ border: "1px solid var(--surface-border)", borderRadius: "var(--radius-md)", overflow: "hidden", background: "var(--surface-raised)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", borderBottom: "1px solid var(--surface-border)", background: "var(--surface-sunken)" }}>
        <span style={{ fontSize: "0.66rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.11em", color: "var(--text-muted)", fontFamily: "var(--font-body-bold)" }}>Top corridors by delay</span>
        <span style={{ flex: 1 }} />
        <button style={{ background: "transparent", border: "none", color: "var(--brand-primary)", fontFamily: "var(--font-body-bold)", fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.09em", cursor: "pointer" }}>View all →</button>
      </div>
      <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "var(--font-body)", color: "var(--text-secondary)" }}>
        <thead>
          <tr>
            <th scope="col" style={compactTh}>Project</th>
            <th scope="col" style={compactTh}>Status</th>
            <th scope="col" style={{ ...compactTh, textAlign: "right" }}>Delay</th>
            <th scope="col" style={{ ...compactTh, textAlign: "right" }}>Budget</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(r => (
            <tr key={r.id}>
              <td style={compactTd}>
                <div style={{ fontFamily: "var(--font-body-bold)", fontWeight: 600, color: "var(--text-primary)" }}>{r.name}</div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--text-muted)", marginTop: 1 }}>{r.id}</div>
              </td>
              <td style={compactTd}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 5, color: RG_STATUS_COLOR[r.status].text, fontFamily: "var(--font-body-bold)", fontWeight: 600, fontSize: "0.78rem" }}>
                  <span aria-hidden style={{ width: 5, height: 5, borderRadius: "50%", background: RG_STATUS_COLOR[r.status].dot }} />
                  {r.status}
                </span>
              </td>
              <td style={{ ...compactTd, ...numCell, padding: "8px 12px", fontSize: "0.8rem" }}>{r.delay.toFixed(1)} min</td>
              <td style={{ ...compactTd, ...numCell, padding: "8px 12px", fontSize: "0.8rem", color: "var(--text-primary)", fontWeight: 600 }}>${r.budget.toFixed(0)}M</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
const compactTh = { padding: "7px 12px", fontSize: "0.62rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.11em", color: "var(--text-muted)", fontFamily: "var(--font-body-bold)", borderBottom: "1px solid var(--surface-border)", textAlign: "left" };
const compactTd = { padding: "8px 12px", borderBottom: "1px solid var(--surface-border)", fontSize: "0.82rem", verticalAlign: "middle" };

// ════════════════════════════════════════════════════════════════════════
// PAGE
// ════════════════════════════════════════════════════════════════════════
function RichDataGridPage() {
  const item = (window.AGGIE_CATALOG || []).find(c => c.id === "rich-data-grid");
  return (
    <PageShell item={item}>
      <RGIntro>
        Interactive data grid for research dashboards and operational tools (PECAN-class). Anatomy adapted from Ant Design Table, Microsoft Fluent 2 Web DataGrid, and Microsoft Fabric Rich-data-grid — sticky header, row selection with bulk-action bar, expandable detail rows, sortable columns with resize affordance, and an active-filter chip strip. Identity stays TUX: Work Sans / Open Sans / JetBrains Mono only, maroon focus ring, warm-neutral surfaces, tabular numerics throughout. Use this when readers need to <em>act</em> on rows; use <code>data-tables</code> for static reports where exact numbers and footnotes matter more than interaction.
      </RGIntro>

      <RGSectionLabel>Full interactive grid</RGSectionLabel>
      <RGBox label="Light · default state · 2 selected" padded>
        <RGInteractiveGrid />
      </RGBox>

      <RGBox label="Dark · same grid" padded dark>
        <RGInteractiveGrid dark />
      </RGBox>

      <RGSectionLabel>Compact variant</RGSectionLabel>
      <RGBox label="Embedded — for dashboards and side panels" padded>
        <RGCompactGrid />
      </RGBox>

      <RGSpecRow>
        <RGSpec label="Header height" value="40px" note="Sticky w/ shadow on scroll" />
        <RGSpec label="Row height" value="44px" note="Comfortable. Compact = 36px" />
        <RGSpec label="Selection" value="Header + per-row" note="Indeterminate when partial" />
        <RGSpec label="Expand row" value="Inline panel" note="Chevron rotates 90° via standard ease" />
      </RGSpecRow>
      <RGSpecRow>
        <RGSpec label="Bulk bar" value="Maroon · top of grid" note="Visible only when ≥1 selected" />
        <RGSpec label="Filter chips" value="Above header" note="Each chip removable; clear-all link" />
        <RGSpec label="Sort" value="Single-key · click to toggle" note="Three-state coming in v2: asc → desc → none" />
        <RGSpec label="Resize" value="Right-edge handle" note="Persists per user via localStorage" />
      </RGSpecRow>
    </PageShell>
  );
}

window.RichDataGridPage = RichDataGridPage;
