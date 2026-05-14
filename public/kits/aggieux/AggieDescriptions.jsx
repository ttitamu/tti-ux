/* global React, PageShell, AGGIE_CATALOG, LucideIcon */
/*
 * AggieDescriptions.jsx — Batch E: Key/value description list.
 *
 * Anatomy informed by Ant Design Descriptions, Microsoft Fluent 2 Web Field
 * (2 frames), and Microsoft Fabric Field:
 *   - horizontal (label-left / value-right) and vertical (label-above) layouts
 *   - bordered variant for record-detail views
 *   - section dividers for grouped fields
 *   - footnote cells for cited values (carries our citation pattern)
 *   - inline edit affordance (pencil on hover)
 *
 * Identity stays TUX. Maroon labels, Open Sans values, JetBrains Mono for
 * IDs and dates.
 *
 * Helper prefix: DS.
 */

function DSBox({ label, padded = true, dark = false, children }) {
  return (
    <div style={{ border: "1px solid var(--surface-border)", borderRadius: "var(--radius-md)", overflow: "hidden", marginBottom: 16 }}>
      <div style={{ padding: "7px 14px", fontSize: "0.62rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: dark ? "rgba(255,255,255,0.85)" : "var(--text-muted)", fontFamily: "var(--font-body-bold)", background: dark ? "var(--brand-primary)" : "var(--surface-sunken)", borderBottom: "1px solid var(--surface-border)", display: "flex", justifyContent: "space-between" }}>
        <span>{label}</span>
        <span style={{ fontFamily: "var(--font-mono)", fontWeight: 500, opacity: 0.7 }}>on {dark ? "dark" : "light"}</span>
      </div>
      <div style={{ padding: padded ? 28 : 0, background: dark ? "var(--brand-primary)" : "var(--surface-page)" }}>{children}</div>
    </div>
  );
}
function DSSectionLabel({ children }) {
  return <div style={{ fontSize: "0.62rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--text-muted)", fontFamily: "var(--font-body-bold)", marginBottom: 12, marginTop: 28 }}>{children}</div>;
}
function DSIntro({ children }) {
  return <div style={{ padding: "16px 20px", marginBottom: 28, background: "color-mix(in srgb, var(--brand-primary) 5%, transparent)", borderLeft: "3px solid var(--brand-primary)", borderRadius: "0 var(--radius-sm) var(--radius-sm) 0", fontSize: "0.92rem", lineHeight: 1.65, color: "var(--text-secondary)" }}>{children}</div>;
}
function DSSpecRow({ children }) {
  return <div style={{ marginTop: 28, padding: "14px 18px", border: "1px solid var(--surface-border)", borderRadius: "var(--radius-md)", background: "var(--surface-raised)", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>{children}</div>;
}
function DSSpec({ label, value, note }) {
  return (
    <div>
      <div style={{ fontSize: "0.6rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-muted)", fontFamily: "var(--font-body-bold)" }}>{label}</div>
      <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem", color: "var(--brand-primary)", marginTop: 3, fontWeight: 500 }}>{value}</div>
      {note && <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: 2, lineHeight: 1.4 }}>{note}</div>}
    </div>
  );
}

// ─── Horizontal: label-left, value-right ────────────────────────────────
function DSHorizontal({ items, columns = 1 }) {
  return (
    <dl style={{ margin: 0, display: "grid", gridTemplateColumns: `repeat(${columns}, 1fr)`, columnGap: 32, rowGap: 0 }}>
      {items.map((it, i) => (
        <div key={i} style={{ display: "grid", gridTemplateColumns: "160px 1fr", gap: 16, padding: "11px 0", borderBottom: i < items.length - 1 ? "1px solid var(--surface-border)" : "none", alignItems: "baseline" }}>
          <dt style={dtLabel}>{it.label}{it.required && <span style={{ color: "var(--color-error)", marginLeft: 3 }}>*</span>}</dt>
          <dd style={{ ...ddValue, ...(it.mono ? monoCell : {}) }}>
            {it.value}
            {it.note && <span style={ddNote}>{it.note}</span>}
            {it.footnote && <sup style={{ color: "var(--brand-primary)", fontFamily: "var(--font-mono)", fontSize: "0.66rem", marginLeft: 3, fontWeight: 700 }}>[{it.footnote}]</sup>}
          </dd>
        </div>
      ))}
    </dl>
  );
}

// ─── Vertical: label above value ────────────────────────────────────────
function DSVertical({ items, columns = 3 }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${columns}, 1fr)`, gap: "20px 32px" }}>
      {items.map((it, i) => (
        <div key={i}>
          <div style={{ ...dtLabel, marginBottom: 4 }}>{it.label}</div>
          <div style={{ ...ddValue, ...(it.mono ? monoCell : {}) }}>
            {it.value}
            {it.footnote && <sup style={{ color: "var(--brand-primary)", fontFamily: "var(--font-mono)", fontSize: "0.66rem", marginLeft: 3, fontWeight: 700 }}>[{it.footnote}]</sup>}
            {it.note && <div style={ddNoteBlock}>{it.note}</div>}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Bordered: full grid w/ borders, like Ant's bordered variant ────────
function DSBordered({ items, columns = 2 }) {
  // Builds rows of `columns` items. Each cell is (label,value) pair.
  const rows = [];
  for (let i = 0; i < items.length; i += columns) rows.push(items.slice(i, i + columns));
  return (
    <table style={{ width: "100%", borderCollapse: "collapse", border: "1px solid var(--surface-border)", fontFamily: "var(--font-body)" }}>
      <tbody>
        {rows.map((row, ri) => (
          <tr key={ri}>
            {row.map((it, ci) => (
              <React.Fragment key={ci}>
                <th scope="row" style={borderedTh}>{it.label}</th>
                <td style={borderedTd} colSpan={(ci === row.length - 1 && row.length < columns) ? (columns - row.length) * 2 + 1 : 1}>
                  <span style={it.mono ? monoCell : {}}>{it.value}</span>
                  {it.footnote && <sup style={{ color: "var(--brand-primary)", fontFamily: "var(--font-mono)", fontSize: "0.66rem", marginLeft: 3, fontWeight: 700 }}>[{it.footnote}]</sup>}
                  {it.note && <div style={{ ...ddNoteBlock, marginTop: 4 }}>{it.note}</div>}
                </td>
              </React.Fragment>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

const dtLabel = { fontFamily: "var(--font-body-bold)", fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.11em", color: "var(--text-muted)", margin: 0 };
const ddValue = { margin: 0, fontSize: "0.92rem", color: "var(--text-primary)", lineHeight: 1.5 };
const ddNote = { display: "block", fontSize: "0.78rem", color: "var(--text-muted)", marginTop: 2, lineHeight: 1.4 };
const ddNoteBlock = { fontSize: "0.78rem", color: "var(--text-muted)", marginTop: 4, lineHeight: 1.45 };
const monoCell = { fontFamily: "var(--font-mono)", fontVariantNumeric: "tabular-nums", fontSize: "0.86rem" };
const borderedTh = { background: "var(--surface-sunken)", padding: "11px 14px", textAlign: "left", verticalAlign: "top", fontFamily: "var(--font-body-bold)", fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.11em", color: "var(--text-muted)", border: "1px solid var(--surface-border)", width: 180 };
const borderedTd = { padding: "11px 14px", verticalAlign: "top", fontSize: "0.92rem", color: "var(--text-primary)", lineHeight: 1.5, border: "1px solid var(--surface-border)" };

// ─── Sample data: Project record ────────────────────────────────────────
const PROJECT_REC = [
  { label: "Project ID",      value: "PRJ-2841",                                                mono: true },
  { label: "Name",            value: "I-35 Capital Express" },
  { label: "District",        value: "Austin" },
  { label: "Lead",            value: "Linda Whitfield" },
  { label: "Status",          value: "Active" },
  { label: "Phase",           value: "Construction · 42% complete" },
  { label: "Budget",          value: "$482.0M",                                                  footnote: "1" },
  { label: "Last update",     value: "2025-10-14T14:32Z",                                        mono: true },
  { label: "Average delay",   value: "18.4 min ± 1.2 (95% CI)",                                  footnote: "2", mono: true },
  { label: "Freight share",   value: "23.6%",                                                    mono: true },
];

const SCOPE_REC = [
  { label: "Scope summary",    value: "Adds two managed lanes Williamson → Hays. Tolling per FasTrak §4.2. Coordinated with City of Austin BRT extension. Estimated 28 mo construction window. Wildlife corridor mitigation in segments 4 and 7.", note: "Updated 2025-09-14 by C. Okafor" },
  { label: "Coordination",     value: "City of Austin · TxDOT-Austin · CapMetro · FHWA Region 6", note: "Quarterly review cadence" },
  { label: "Risk register",    value: "ROW acquisition (M), utility relocation (L), public outreach (L)", note: "See PRJ-2841/risk for monthly update" },
];

// ────────────────────────────────────────────────────────────────────────
// PAGE
// ────────────────────────────────────────────────────────────────────────
function DescriptionsPage() {
  const item = (window.AGGIE_CATALOG || []).find(c => c.id === "descriptions");
  return (
    <PageShell item={item}>
      <DSIntro>
        Key/value list for record summaries — used in side-sheet detail panels, project headers, faculty profiles, and report front-matter. Three layouts cover most needs: <strong>horizontal</strong> for compact label-left/value-right pairs; <strong>vertical</strong> for grouped fields where the value needs room to breathe; <strong>bordered</strong> for formal record cards. Footnote anchors carry through from data-tables. Lineage: anatomy from Ant Design Descriptions and Microsoft Fabric Field.
      </DSIntro>

      <DSSectionLabel>Horizontal · single column</DSSectionLabel>
      <DSBox label="Project record · single-column horizontal">
        <DSHorizontal items={PROJECT_REC.slice(0, 6)} />
      </DSBox>

      <DSSectionLabel>Horizontal · two columns</DSSectionLabel>
      <DSBox label="Wider record · two-column horizontal">
        <DSHorizontal items={PROJECT_REC} columns={2} />
      </DSBox>

      <DSSectionLabel>Vertical · three columns</DSSectionLabel>
      <DSBox label="Top-of-page summary · vertical">
        <DSVertical items={[
          { label: "Project ID",  value: "PRJ-2841", mono: true },
          { label: "District",    value: "Austin" },
          { label: "Lead",        value: "L. Whitfield" },
          { label: "Phase",       value: "Construction · 42%" },
          { label: "Budget",      value: "$482.0M", mono: true, footnote: "1" },
          { label: "Last update", value: "2025-10-14", mono: true },
        ]} columns={3} />
      </DSBox>

      <DSSectionLabel>Bordered · formal record</DSSectionLabel>
      <DSBox label="Project header · bordered grid (Ant variant)">
        <DSBordered items={SCOPE_REC} columns={1} />
      </DSBox>

      <DSBox label="Specs grid · 2-column bordered">
        <DSBordered items={[
          { label: "Project ID", value: "PRJ-2841", mono: true },
          { label: "Phase",      value: "Construction" },
          { label: "Budget",     value: "$482.0M", mono: true, footnote: "1" },
          { label: "Lead",       value: "Linda Whitfield" },
          { label: "Started",    value: "2024-03-12", mono: true },
          { label: "Target",     value: "2026-08-31", mono: true },
        ]} columns={2} />
      </DSBox>

      <DSSectionLabel>With footnote block</DSSectionLabel>
      <DSBox label="Cited values · footnote anchors">
        <DSHorizontal items={[
          { label: "Average delay",   value: "18.4 min ± 1.2 (95% CI)", footnote: "2", mono: true },
          { label: "Freight share",   value: "23.6%", footnote: "3", mono: true },
          { label: "Crash rate (3y)", value: "0.84 per MVMT ± 0.06", footnote: "4", mono: true },
        ]} />
        <div style={{ marginTop: 22, padding: "14px 18px", borderTop: "1px solid var(--surface-border)", background: "var(--surface-sunken)", marginLeft: -28, marginRight: -28, marginBottom: -28, fontSize: "0.78rem", color: "var(--text-muted)", lineHeight: 1.6 }}>
          <div style={{ fontFamily: "var(--font-body-bold)", fontSize: "0.62rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--text-muted)", marginBottom: 6 }}>Notes</div>
          <div style={{ fontFamily: "var(--font-mono)" }}>
            <div><span style={{ color: "var(--brand-primary)", fontWeight: 700, marginRight: 6 }}>[2]</span> Delay measured against free-flow speed at 5-min aggregation, INRIX 2025 Q3.</div>
            <div><span style={{ color: "var(--brand-primary)", fontWeight: 700, marginRight: 6 }}>[3]</span> Class 5–13 vehicles, weigh-in-motion stations 1442 + 1478, 12-month rolling.</div>
            <div><span style={{ color: "var(--brand-primary)", fontWeight: 700, marginRight: 6 }}>[4]</span> KAB crashes per million vehicle-miles, CRIS query 2022-09 → 2025-09.</div>
          </div>
        </div>
      </DSBox>

      <DSSpecRow>
        <DSSpec label="Label type" value="Work Sans 700 11px" note="Uppercase · 0.11em tracking · muted" />
        <DSSpec label="Value type" value="Open Sans 14.7px" note="JetBrains Mono for IDs, dates, numerics" />
        <DSSpec label="Row gap" value="11px / 20px / 0" note="Horizontal / vertical / bordered" />
        <DSSpec label="Footnote" value="sup [n] maroon mono" note="Resolves to a notes block" />
      </DSSpecRow>
      <DSSpecRow>
        <DSSpec label="Layouts" value="3" note="Horizontal · vertical · bordered" />
        <DSSpec label="Columns" value="1 / 2 / 3" note="Choose based on label width + screen" />
        <DSSpec label="Required" value="* maroon suffix" note="On the label, not the value" />
        <DSSpec label="Lineage" value="Ant + Fluent 2 Web + Fabric" note="Anatomy only · TUX type and color" />
      </DSSpecRow>
    </PageShell>
  );
}

window.DescriptionsPage = DescriptionsPage;
