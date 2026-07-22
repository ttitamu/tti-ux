/* global React, PageShell, AGGIE_CATALOG, LucideIcon */
/*
 * AggieFieldGrid.jsx — Batch G part 2.
 *
 * Dense form layout for research apps: a grid system that aligns labels
 * and inputs across multi-column forms without each field caring about
 * its neighbors. Three density tiers (comfortable / standard / compact)
 * map to --rhythm tokens from the Batch E-prelude.
 *
 * Anatomy lineage: Ant Design Form (labelCol / wrapperCol), Microsoft
 * Fluent 2 Web Field (2 frames), Microsoft Fabric Field. Identity stays
 * TUX: Work Sans labels, maroon focus, survey-rhythm tokens.
 *
 * Helper prefix: FG.
 */

const { useState: _fgUseState } = React;

// ─── Shared chrome ──────────────────────────────────────────────────────
function FGBox({ label, children, padded = true, dark = false }) {
  return (
    <div style={{ border: "1px solid var(--surface-border)", borderRadius: "var(--radius-md)", overflow: "hidden", marginBottom: 16 }}>
      <div style={{ padding: "7px 14px", fontSize: "0.62rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: dark ? "rgba(255,255,255,0.85)" : "var(--text-muted)", fontFamily: "var(--font-body-bold)", background: dark ? "var(--brand-primary)" : "var(--surface-sunken)", borderBottom: "1px solid var(--surface-border)" }}>{label}</div>
      <div style={{ padding: padded ? 28 : 0, background: dark ? "#0E1216" : "var(--surface-page)" }}>{children}</div>
    </div>
  );
}
function FGSectionLabel({ children }) {
  return <div style={{ fontSize: "0.62rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--text-muted)", fontFamily: "var(--font-body-bold)", marginBottom: 12, marginTop: 28 }}>{children}</div>;
}
function FGIntro({ children }) {
  return <div style={{ padding: "16px 20px", marginBottom: 28, background: "color-mix(in srgb, var(--brand-primary) 5%, transparent)", borderLeft: "3px solid var(--brand-primary)", borderRadius: "0 var(--radius-sm) var(--radius-sm) 0", fontSize: "0.92rem", lineHeight: 1.65, color: "var(--text-secondary)" }}>{children}</div>;
}
function FGSpecRow({ children }) {
  return <div style={{ marginTop: 28, padding: "14px 18px", border: "1px solid var(--surface-border)", borderRadius: "var(--radius-md)", background: "var(--surface-raised)", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>{children}</div>;
}
function FGSpec({ label, value, note }) {
  return (
    <div>
      <div style={{ fontSize: "0.6rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-muted)", fontFamily: "var(--font-body-bold)" }}>{label}</div>
      <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem", color: "var(--brand-primary)", marginTop: 3, fontWeight: 500 }}>{value}</div>
      {note && <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: 2, lineHeight: 1.4 }}>{note}</div>}
    </div>
  );
}

// ─── FieldGrid — the layout primitive ───────────────────────────────────
// density: "comfortable" | "standard" | "compact"
//   comfortable → row-gap roomy, label-above, input height 44
//   standard    → row-gap loose, label-above, input height 40
//   compact     → row-gap normal, label-left, input height 32
function FieldGrid({ density = "standard", cols = 2, labels = "above", children }) {
  const labelLeft = labels === "left";
  const rowGap = density === "compact" ? "var(--rhythm-normal, 12px)" : density === "comfortable" ? "var(--rhythm-roomy, 24px)" : "var(--rhythm-loose, 16px)";
  const colGap = density === "compact" ? "var(--rhythm-loose, 16px)" : "var(--rhythm-roomy, 24px)";

  return (
    <div data-density={density} style={{
      display: "grid",
      gridTemplateColumns: labelLeft && cols === 1 ? "180px 1fr" : `repeat(${cols}, 1fr)`,
      rowGap,
      columnGap: colGap,
    }}>
      {children}
    </div>
  );
}

// ─── FGField — a single label+input wrapper that honors density ─────────
const FIELD_HEIGHT = { comfortable: 44, standard: 40, compact: 32 };
const FIELD_FONT   = { comfortable: "0.92rem", standard: "0.875rem", compact: "0.82rem" };
const FIELD_PAD    = { comfortable: "0 14px", standard: "0 12px", compact: "0 10px" };

function FGField({ id, label, hint, required, help, error, density = "standard", labelStyle = "above", colSpan = 1, children }) {
  const h = FIELD_HEIGHT[density];
  return (
    <div style={{ gridColumn: colSpan > 1 ? `span ${colSpan}` : undefined, display: labelStyle === "left" ? "grid" : "block", gridTemplateColumns: labelStyle === "left" ? "180px 1fr" : undefined, gap: labelStyle === "left" ? "var(--rhythm-loose, 16px)" : 0, alignItems: labelStyle === "left" ? "start" : undefined }}>
      <label htmlFor={id} style={{ display: "block", fontSize: density === "compact" ? "0.68rem" : "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-primary)", fontFamily: "var(--font-body-bold)", marginBottom: labelStyle === "left" ? 0 : 6, paddingTop: labelStyle === "left" ? 12 : 0, lineHeight: 1.4 }}>
        {label}
        {required && <span aria-hidden style={{ color: "var(--color-danger)", marginLeft: 4 }}>*</span>}
        {hint && <span style={{ marginLeft: 8, color: "var(--text-muted)", fontWeight: 500, textTransform: "none", letterSpacing: 0, fontFamily: "var(--font-body)", fontStyle: "italic" }}>{hint}</span>}
      </label>
      <div>
        {React.isValidElement(children) ? React.cloneElement(children, {
          id,
          style: { ...(children.props.style || {}), height: h, padding: FIELD_PAD[density], fontSize: FIELD_FONT[density], width: "100%", border: `1px solid ${error ? "var(--color-error, #B23A3A)" : "var(--surface-border)"}`, borderRadius: "var(--radius-md)", background: "var(--surface-raised)", fontFamily: "inherit", color: "var(--text-primary)", outline: "none", boxSizing: "border-box" },
        }) : children}
        {help && !error && <div style={{ fontSize: density === "compact" ? "0.74rem" : "0.78rem", color: "var(--text-muted)", marginTop: 5, lineHeight: 1.45 }}>{help}</div>}
        {error && <div style={{ fontSize: density === "compact" ? "0.74rem" : "0.78rem", color: "var(--color-error, #B23A3A)", marginTop: 5, display: "inline-flex", alignItems: "center", gap: 5 }}><LucideIcon name="alert-circle" size={12} /> {error}</div>}
      </div>
    </div>
  );
}

// ─── Section row ─ a small divider between groups inside a FieldGrid ────
function FGSectionRow({ title, hint, colSpan = 12 }) {
  return (
    <div style={{ gridColumn: `1 / -1`, paddingTop: 8, paddingBottom: 4, borderBottom: "1px solid var(--surface-border)", marginBottom: 4 }}>
      <div style={{ fontFamily: "var(--font-display)", fontSize: "0.92rem", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--brand-primary)" }}>{title}</div>
      {hint && <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: 2 }}>{hint}</div>}
    </div>
  );
}

// ─── Sample form — used in all the density demos ────────────────────────
function SampleForm({ density }) {
  return (
    <FieldGrid density={density} cols={2}>
      <FGSectionRow title="Project metadata" hint="Reviewed quarterly by the research IT data steward." />

      <FGField id={`pf-${density}-id`} density={density} label="Project ID" required hint="format: PRJ-####">
        <input defaultValue="PRJ-2841" />
      </FGField>
      <FGField id={`pf-${density}-name`} density={density} label="Display name" required>
        <input defaultValue="I-35 Capital Express" />
      </FGField>

      <FGField id={`pf-${density}-dist`} density={density} label="District">
        <input defaultValue="Austin" />
      </FGField>
      <FGField id={`pf-${density}-lead`} density={density} label="Lead investigator" required>
        <input defaultValue="L. Whitfield" />
      </FGField>

      <FGField id={`pf-${density}-budget`} density={density} label="Budget (USD M)" hint="excludes overhead">
        <input defaultValue="482.0" />
      </FGField>
      <FGField id={`pf-${density}-target`} density={density} label="Target completion">
        <input defaultValue="2026-08-31" />
      </FGField>

      <FGField id={`pf-${density}-scope`} density={density} label="Scope summary" colSpan={2} help="A short paragraph — full scope lives in the linked SOW document.">
        <textarea defaultValue="Adds two managed lanes Williamson → Hays. Tolling per FasTrak §4.2. Wildlife corridor mitigation in segments 4 and 7." rows={density === "compact" ? 2 : 3} style={{ height: "auto", padding: "10px 12px", lineHeight: 1.5 }} />
      </FGField>

      <FGSectionRow title="Compliance" hint="Required before the project can leave Scoping phase." />

      <FGField id={`pf-${density}-itar`} density={density} label="ITAR classification" required error="Choose one of: none, controlled, restricted">
        <input defaultValue="" placeholder="—" />
      </FGField>
      <FGField id={`pf-${density}-hipaa`} density={density} label="HIPAA scope">
        <input defaultValue="none" />
      </FGField>
    </FieldGrid>
  );
}

// ─── PAGE ──────────────────────────────────────────────────────────────
function FieldGridPage() {
  const item = (window.AGGIE_CATALOG || []).find(c => c.id === "field-grid");
  return (
    <PageShell item={item}>
      <FGIntro>
        Layout primitive for multi-column forms. Three density tiers — <strong>comfortable</strong>, <strong>standard</strong>, <strong>compact</strong> — map to the survey-rhythm tokens from the Batch E-prelude. Labels render above (default) or to the left (audit-style records). Section rows divide a long form into named groups without breaking the grid. Anatomy from Ant Design Form + Microsoft Fabric Field; chrome is TUX-native.
      </FGIntro>

      <FGSectionLabel>Comfortable · 44px inputs · roomy gaps</FGSectionLabel>
      <FGBox label="Best for short, important forms — settings pages, single-record edit">
        <SampleForm density="comfortable" />
      </FGBox>

      <FGSectionLabel>Standard · 40px inputs · default density</FGSectionLabel>
      <FGBox label="Default — used everywhere unless context demands otherwise">
        <SampleForm density="standard" />
      </FGBox>

      <FGSectionLabel>Compact · 32px inputs · for research-app forms with many fields</FGSectionLabel>
      <FGBox label="When form length matters more than touch comfort">
        <SampleForm density="compact" />
      </FGBox>

      <FGSectionLabel>Label-left variant · for record cards and audit views</FGSectionLabel>
      <FGBox label="180px label column · standard density · 1 row per field">
        <FieldGrid density="standard" cols={1}>
          <FGField id="ll-id"     density="standard" labelStyle="left" label="Project ID"   required>
            <input defaultValue="PRJ-2841" />
          </FGField>
          <FGField id="ll-name"   density="standard" labelStyle="left" label="Display name" required>
            <input defaultValue="I-35 Capital Express" />
          </FGField>
          <FGField id="ll-dist"   density="standard" labelStyle="left" label="District">
            <input defaultValue="Austin" />
          </FGField>
          <FGField id="ll-lead"   density="standard" labelStyle="left" label="Lead">
            <input defaultValue="L. Whitfield" />
          </FGField>
          <FGField id="ll-target" density="standard" labelStyle="left" label="Target completion" hint="ISO 8601">
            <input defaultValue="2026-08-31" />
          </FGField>
        </FieldGrid>
      </FGBox>

      <FGSectionLabel>When to use which</FGSectionLabel>
      <div style={{ overflow: "hidden", border: "1px solid var(--surface-border)", borderRadius: "var(--radius-md)" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.86rem" }}>
          <thead>
            <tr style={{ background: "var(--surface-sunken)" }}>
              {["Density", "Input height", "Use it for", "Avoid it for"].map(h => (
                <th key={h} style={{ textAlign: "left", padding: "10px 14px", fontSize: "0.66rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-muted)", fontFamily: "var(--font-body-bold)", borderBottom: "1px solid var(--surface-border)" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              ["Comfortable", "44px", "Settings, single-record edit, infrequent forms",                          "Long inventory forms — too much scroll"],
              ["Standard",    "40px", "Default. Most app surfaces, project edit, contact forms",                  "Cells inside a dense data table — use compact"],
              ["Compact",     "32px", "Research-app forms with 20+ fields, table-row inline edit, audit views",   "Public-facing forms — touch targets too small"],
            ].map((r, i) => (
              <tr key={i}>
                {r.map((c, j) => (
                  <td key={j} style={{ padding: "12px 14px", borderBottom: i === 2 ? "none" : "1px solid var(--surface-border)", color: j === 0 ? "var(--text-primary)" : "var(--text-secondary)", fontWeight: j === 0 ? 600 : 400, fontFamily: j === 1 ? "var(--font-mono)" : "inherit" }}>{c}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <FGSpecRow>
        <FGSpec label="Row gap"     value="rhythm tokens" note="comfortable=roomy / standard=loose / compact=normal" />
        <FGSpec label="Col gap"     value="rhythm-roomy"  note="Or rhythm-loose at compact density" />
        <FGSpec label="Label font"  value="0.68–0.7rem"   note="Smaller at compact for vertical compression" />
        <FGSpec label="Touch min"   value="44px @ comfortable" note="Drops to 40 at standard, 32 at compact (keyboard/precision only)" />
      </FGSpecRow>
    </PageShell>
  );
}

window.FieldGridPage = FieldGridPage;
