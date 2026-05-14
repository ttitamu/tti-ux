/* global React, PageShell, AGGIE_CATALOG, LucideIcon */
/*
 * AggieToolbar.jsx — INF-1b + INF-3 fold: the toolbar component family.
 *
 *   Toolbar — horizontal action surface that sits above a content region
 *             (above a table, above an editor canvas, above a corridor view).
 *             Composes from icon-only buttons, mixed icon+text buttons, toggle
 *             buttons, split buttons, separators, and an overflow menu.
 *             Distinct from `buttons` (free-floating action atoms) and from
 *             `horizontal-filters` (filter-strip vocabulary). Use a toolbar
 *             when the surface needs to expose ~3-12 commands inline, grouped
 *             by purpose, with predictable left-to-right reading.
 *
 * Lineage:
 *   • Microsoft Fluent 2 Web Toolbar (anatomy: button rows + dividers +
 *     overflow + density tiers). Fluent 2 Web ships 3 sizes (small / medium /
 *     large) with explicit divider rules — TUX maps the same structure.
 *   • Microsoft Teams Toolbar — the meeting/channel toolbar pattern (grouped
 *     primary commands on the left, overflow + close-style on the right).
 *     TUX adopts the left-anchored primary group + right-anchored utility
 *     group composition.
 *
 * Identity stays TUX: Work Sans 700 caps for text buttons, JetBrains Mono
 * for keyboard hints, maroon brand accent, 2px focus ring, never Segoe UI.
 *
 * Helper prefix: TB (Toolbar). Local helpers — never declare a generic
 * SectionLabel / Box / SpecRow here (Babel scope collisions across files).
 */

// ════════════════════════════════════════════════════════════════════════
// Shared helpers (TB prefix)
// ════════════════════════════════════════════════════════════════════════

function TBBox({ dark = false, label, padded = true, children }) {
  return (
    <div style={{ border: "1px solid var(--surface-border)", borderRadius: "var(--radius-md)", overflow: "hidden", marginBottom: 16 }}>
      <div style={{
        padding: "7px 14px", fontSize: "0.62rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em",
        color: dark ? "rgba(255,255,255,0.8)" : "var(--text-muted)", fontFamily: "var(--font-body-bold)",
        background: dark ? "var(--brand-primary)" : "var(--surface-sunken)",
        borderBottom: "1px solid var(--surface-border)", display: "flex", justifyContent: "space-between",
      }}>
        <span>{label}</span>
        <span style={{ fontFamily: "var(--font-mono)", fontWeight: 500, opacity: 0.7 }}>on {dark ? "dark" : "light"}</span>
      </div>
      <div style={{ padding: padded ? 28 : 0, background: dark ? "var(--brand-primary)" : "var(--surface-page)" }}>{children}</div>
    </div>
  );
}

function TBSectionLabel({ children }) {
  return (
    <h3 style={{
      fontFamily: "var(--font-body)", fontSize: "0.72rem", fontWeight: 600, textTransform: "lowercase",
      letterSpacing: "0.10em", color: "var(--text-muted)", margin: "32px 0 12px",
    }}>{children}</h3>
  );
}

function TBSpecRow({ children }) {
  return (
    <div style={{ marginTop: 28, padding: "14px 18px", border: "1px solid var(--surface-border)", borderRadius: "var(--radius-md)", background: "var(--surface-raised)", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: 18 }}>
      {children}
    </div>
  );
}

function TBSpec({ label, value, note }) {
  return (
    <div>
      <div style={{ fontFamily: "var(--font-body-bold)", fontSize: "0.6rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--text-muted)", marginBottom: 4 }}>{label}</div>
      <div style={{ fontFamily: "var(--font-mono)", fontWeight: 500, fontSize: "0.82rem", color: "var(--text-primary)", marginBottom: 4 }}>{value}</div>
      {note ? <div style={{ fontFamily: "var(--font-body)", fontSize: "0.74rem", color: "var(--text-muted)", lineHeight: 1.4 }}>{note}</div> : null}
    </div>
  );
}

function TBIntro({ children }) {
  return (
    <div style={{ borderLeft: "3px solid var(--brand-primary)", padding: "8px 16px", margin: "0 0 28px", background: "var(--surface-raised)", borderRadius: "0 var(--radius-sm) var(--radius-sm) 0" }}>
      <p style={{ margin: 0, fontFamily: "var(--font-body)", fontSize: "0.9rem", lineHeight: 1.55, color: "var(--text-primary)", maxWidth: 760 }}>{children}</p>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════
// TOOLBAR primitives
// ════════════════════════════════════════════════════════════════════════

const TB_DENSITY = {
  sm: { height: 32, pad: "0 8px",  icon: 14, fz: "0.74rem", gap: 2, divH: 16 },
  md: { height: 40, pad: "0 10px", icon: 16, fz: "0.78rem", gap: 4, divH: 20 },
  lg: { height: 48, pad: "0 14px", icon: 18, fz: "0.82rem", gap: 6, divH: 24 },
};

function TBToolbar({ density = "md", dark = false, children, style }) {
  const d = TB_DENSITY[density];
  return (
    <div role="toolbar" style={{
      display: "inline-flex", alignItems: "center", gap: d.gap,
      padding: "4px 6px",
      background: dark ? "rgba(255,255,255,0.06)" : "#FFFFFF",
      border: dark ? "1px solid rgba(255,255,255,0.10)" : "1px solid var(--surface-border)",
      borderRadius: "var(--radius-md)",
      boxShadow: dark ? "none" : "0 1px 2px rgba(0,0,0,0.03), 0 2px 6px rgba(0,0,0,0.04)",
      fontFamily: "var(--font-body)",
      ...style,
    }}>
      {children}
    </div>
  );
}

function TBBtn({ icon, label, density = "md", dark = false, tone = "neutral", active = false, kbd, title }) {
  const d = TB_DENSITY[density];
  const iconOnly = !label;
  const tonedFg =
    tone === "primary" ? (dark ? "var(--brand-accent)" : "var(--brand-primary)") :
    tone === "danger"  ? "var(--color-error)" :
    (dark ? "rgba(255,255,255,0.85)" : "var(--text-primary)");
  const activeBg = dark
    ? "rgba(221,172,55,0.20)"
    : "rgba(92,0,37,0.08)";
  return (
    <button
      title={title || label}
      style={{
        height: d.height,
        padding: iconOnly ? 0 : d.pad,
        minWidth: iconOnly ? d.height : "auto",
        display: "inline-flex", alignItems: "center", gap: 6,
        background: active ? activeBg : "transparent",
        border: "1px solid transparent",
        borderRadius: "var(--radius-sm)",
        cursor: "pointer",
        fontFamily: label ? "var(--font-body-bold)" : "inherit",
        fontWeight: label ? 700 : 400,
        fontSize: d.fz,
        textTransform: label ? "uppercase" : "none",
        letterSpacing: label ? "0.08em" : 0,
        color: tonedFg,
        position: "relative",
        flexShrink: 0,
      }}
    >
      {icon ? <LucideIcon name={icon} size={d.icon} strokeWidth={active ? 2.4 : 2} /> : null}
      {label ? <span>{label}</span> : null}
      {kbd ? (
        <span style={{
          marginLeft: 4,
          fontFamily: "var(--font-mono)", fontSize: "0.66rem", fontWeight: 500,
          padding: "2px 5px", borderRadius: 3,
          background: dark ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.05)",
          color: dark ? "rgba(255,255,255,0.65)" : "var(--text-muted)",
          textTransform: "none", letterSpacing: 0,
        }}>{kbd}</span>
      ) : null}
    </button>
  );
}

function TBSplit({ label, icon, density = "md", dark = false }) {
  const d = TB_DENSITY[density];
  return (
    <span style={{ display: "inline-flex", alignItems: "stretch", gap: 0 }}>
      <button style={{
        height: d.height, padding: d.pad, display: "inline-flex", alignItems: "center", gap: 6,
        background: "transparent", border: "1px solid transparent",
        borderRadius: "var(--radius-sm) 0 0 var(--radius-sm)",
        borderRight: dark ? "1px solid rgba(255,255,255,0.14)" : "1px solid var(--surface-border)",
        cursor: "pointer",
        fontFamily: "var(--font-body-bold)", fontWeight: 700, fontSize: d.fz,
        textTransform: "uppercase", letterSpacing: "0.08em",
        color: dark ? "rgba(255,255,255,0.85)" : "var(--text-primary)",
      }}>
        {icon ? <LucideIcon name={icon} size={d.icon} /> : null}
        {label}
      </button>
      <button aria-label={`${label} options`} style={{
        height: d.height, width: d.height - 8, display: "inline-flex", alignItems: "center", justifyContent: "center",
        background: "transparent", border: "1px solid transparent",
        borderRadius: "0 var(--radius-sm) var(--radius-sm) 0",
        cursor: "pointer",
        color: dark ? "rgba(255,255,255,0.7)" : "var(--text-muted)",
      }}>
        <LucideIcon name="chevron-down" size={12} />
      </button>
    </span>
  );
}

function TBDivider({ density = "md", dark = false }) {
  const d = TB_DENSITY[density];
  return (
    <span aria-hidden="true" style={{
      display: "inline-block",
      width: 1, height: d.divH,
      background: dark ? "rgba(255,255,255,0.14)" : "var(--surface-border)",
      margin: "0 4px",
      flexShrink: 0,
    }} />
  );
}

function TBSpacer() {
  return <span style={{ flex: 1, minWidth: 8 }} />;
}

// ════════════════════════════════════════════════════════════════════════
// PAGE
// ════════════════════════════════════════════════════════════════════════

function ToolbarPage() {
  const item = (window.AGGIE_CATALOG || []).find(c => c.id === "toolbar");

  return (
    <PageShell item={item}>
      <TBIntro>
        Horizontal action surface above a content region — a corridor view,
        a record editor, a data grid. Composes from{" "}
        <strong>icon-only buttons</strong>, <strong>mixed icon+text buttons</strong>,
        toggle buttons, <strong>split buttons</strong>, dividers, and an
        overflow menu. Three densities (sm / md / lg) for table-row, default,
        and decklike surfaces. Distinct from{" "}
        <code>buttons</code> (free-floating action atoms) and{" "}
        <code>horizontal-filters</code> (filter-strip vocabulary).
      </TBIntro>

      {/* ── 1. Standard mixed toolbar ──────────────────────────── */}
      <TBSectionLabel>1 · Standard — mixed icon + text buttons</TBSectionLabel>
      <TBBox label="corridor view · primary actions left, utility actions right">
        <TBToolbar>
          <TBBtn icon="plus"          label="New"    tone="primary" />
          <TBBtn icon="upload"        label="Import" />
          <TBBtn icon="download"      label="Export" />
          <TBDivider />
          <TBBtn icon="filter"        label="Filter" />
          <TBBtn icon="arrow-up-down" label="Sort"   />
          <TBSpacer />
          <TBBtn icon="search"     title="Search"     />
          <TBBtn icon="settings-2" title="View settings" />
          <TBBtn icon="more-horizontal" title="More" />
        </TBToolbar>
      </TBBox>

      {/* ── 2. Icon-only ─────────────────────────────────────── */}
      <TBSectionLabel>2 · Icon-only — compact editor surface</TBSectionLabel>
      <TBBox label="editor canvas · text formatting · tooltips on hover">
        <TBToolbar density="sm">
          <TBBtn icon="undo-2"       title="Undo · ⌘Z" />
          <TBBtn icon="redo-2"       title="Redo · ⌘⇧Z" />
          <TBDivider density="sm" />
          <TBBtn icon="bold"         title="Bold · ⌘B"   active />
          <TBBtn icon="italic"       title="Italic · ⌘I" />
          <TBBtn icon="underline"    title="Underline · ⌘U" />
          <TBBtn icon="strikethrough" title="Strikethrough" />
          <TBDivider density="sm" />
          <TBBtn icon="list"         title="Bulleted list" />
          <TBBtn icon="list-ordered" title="Numbered list" />
          <TBBtn icon="quote"        title="Block quote" />
          <TBDivider density="sm" />
          <TBBtn icon="link"         title="Insert link · ⌘K" />
          <TBBtn icon="image"        title="Insert image" />
          <TBBtn icon="table"        title="Insert table" />
        </TBToolbar>
      </TBBox>

      {/* ── 3. With split buttons ─────────────────────────────── */}
      <TBSectionLabel>3 · Split buttons — primary action + variant menu</TBSectionLabel>
      <TBBox label="report builder · primary commands as split buttons">
        <TBToolbar>
          <TBSplit label="Export" icon="download" />
          <TBSplit label="Share"  icon="share-2" />
          <TBDivider />
          <TBBtn icon="printer" label="Print" />
          <TBSpacer />
          <TBBtn icon="check-check" label="Validate" tone="primary" />
        </TBToolbar>
      </TBBox>

      {/* ── 4. Toggle group ──────────────────────────────────── */}
      <TBSectionLabel>4 · Toggle group — exclusive view switcher</TBSectionLabel>
      <TBBox label="map / table / chart · only one active at a time">
        <TBToolbar density="sm">
          <TBBtn icon="map"      label="Map"   density="sm" active />
          <TBBtn icon="table"    label="Table" density="sm" />
          <TBBtn icon="bar-chart-3" label="Chart" density="sm" />
          <TBDivider density="sm" />
          <TBBtn icon="layout-grid" title="Grid view"    density="sm" />
          <TBBtn icon="rows-3"      title="Rows view"    density="sm" />
          <TBBtn icon="kanban"      title="Kanban view"  density="sm" />
          <TBSpacer />
          <TBBtn icon="info" title="About this view" density="sm" />
        </TBToolbar>
      </TBBox>

      {/* ── 5. Page toolbar with title ───────────────────────── */}
      <TBSectionLabel>5 · Page toolbar — title slot + action cluster</TBSectionLabel>
      <TBBox label="record detail page · title-on-left, actions-on-right">
        <div style={{
          display: "flex", alignItems: "center", gap: 16, padding: "12px 18px",
          background: "#FFFFFF",
          border: "1px solid var(--surface-border)",
          borderRadius: "var(--radius-md)",
          fontFamily: "var(--font-body)",
        }}>
          <button aria-label="Back" style={{
            background: "transparent", border: "1px solid var(--surface-border)",
            width: 36, height: 36, borderRadius: "var(--radius-sm)",
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", color: "var(--text-primary)", flexShrink: 0,
          }}>
            <LucideIcon name="chevron-left" size={16} />
          </button>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontFamily: "var(--font-body-bold)", fontSize: "0.62rem", fontWeight: 700,
              textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--text-muted)",
              marginBottom: 2,
            }}>Corridor</div>
            <div style={{
              fontFamily: "var(--font-display)", fontSize: "1.10rem", fontWeight: 500,
              textTransform: "uppercase", letterSpacing: "0.01em",
              color: "var(--text-primary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
            }}>I-35 · Hays → Travis</div>
          </div>
          <span style={{ display: "inline-flex", gap: 4, flexShrink: 0 }}>
            <TBBtn icon="star"   title="Save" />
            <TBBtn icon="share-2" title="Share" />
            <TBDivider />
            <TBBtn icon="pencil-line" label="Edit" tone="primary" />
            <TBBtn icon="more-horizontal" title="More actions" />
          </span>
        </div>
      </TBBox>

      {/* ── 6. Density tiers ─────────────────────────────────── */}
      <TBSectionLabel>6 · Density — sm · md · lg</TBSectionLabel>
      <TBBox label="three density tiers · same anatomy">
        <div style={{ display: "flex", flexDirection: "column", gap: 14, alignItems: "flex-start" }}>
          <div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: "var(--text-muted)", marginBottom: 6 }}>sm · 32px · for inline + data-table toolbars</div>
            <TBToolbar density="sm">
              <TBBtn icon="plus"    label="New"    density="sm" />
              <TBBtn icon="filter"  label="Filter" density="sm" />
              <TBDivider density="sm" />
              <TBBtn icon="download" title="Export" density="sm" />
              <TBBtn icon="more-horizontal" title="More" density="sm" />
            </TBToolbar>
          </div>
          <div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: "var(--text-muted)", marginBottom: 6 }}>md · 40px · default · page-level toolbars</div>
            <TBToolbar density="md">
              <TBBtn icon="plus"    label="New"    tone="primary" />
              <TBBtn icon="filter"  label="Filter" />
              <TBDivider />
              <TBBtn icon="download" title="Export" />
              <TBBtn icon="more-horizontal" title="More" />
            </TBToolbar>
          </div>
          <div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: "var(--text-muted)", marginBottom: 6 }}>lg · 48px · for hero / decklike surfaces</div>
            <TBToolbar density="lg">
              <TBBtn icon="plus"    label="New"    density="lg" tone="primary" />
              <TBBtn icon="filter"  label="Filter" density="lg" />
              <TBDivider density="lg" />
              <TBBtn icon="download" title="Export" density="lg" />
              <TBBtn icon="more-horizontal" title="More" density="lg" />
            </TBToolbar>
          </div>
        </div>
      </TBBox>

      {/* ── 7. Overflow ─────────────────────────────────────── */}
      <TBSectionLabel>7 · Overflow — when actions exceed width</TBSectionLabel>
      <TBBox label="visible commands · less common actions collapsed under ⋯">
        <TBToolbar>
          <TBBtn icon="plus"     label="New"    tone="primary" />
          <TBBtn icon="upload"   label="Import" />
          <TBBtn icon="download" label="Export" />
          <TBDivider />
          <TBBtn icon="copy"  title="Duplicate" />
          <TBBtn icon="archive" title="Archive" />
          <TBBtn icon="trash-2" title="Delete" />
          <TBDivider />
          <button title="More actions" style={{
            height: 40, padding: "0 10px",
            display: "inline-flex", alignItems: "center", gap: 6,
            background: "transparent", border: "1px solid var(--surface-border)",
            borderRadius: "var(--radius-sm)", cursor: "pointer",
            fontFamily: "var(--font-body-bold)", fontWeight: 700, fontSize: "0.74rem",
            textTransform: "uppercase", letterSpacing: "0.08em",
            color: "var(--text-primary)",
          }}>
            <LucideIcon name="more-horizontal" size={16} />
            <span>More</span>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.66rem", fontWeight: 500, color: "var(--text-muted)", textTransform: "none", letterSpacing: 0 }}>+4</span>
          </button>
        </TBToolbar>
        <div style={{
          marginTop: 12, padding: "8px 10px", maxWidth: 240,
          background: "#FFFFFF", border: "1px solid var(--surface-border)",
          borderRadius: "var(--radius-sm)", boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
        }}>
          {["Move to…", "Rename", "Watch", "Report a problem"].map(x => (
            <div key={x} style={{
              padding: "7px 8px", fontFamily: "var(--font-body)", fontSize: "0.86rem",
              color: "var(--text-primary)", borderRadius: 3,
            }}>{x}</div>
          ))}
        </div>
      </TBBox>

      {/* ── 8. On dark ──────────────────────────────────────── */}
      <TBSectionLabel>8 · On dark — over a maroon shell</TBSectionLabel>
      <TBBox dark label="page toolbar on dark · primary action gold-accented">
        <TBToolbar dark>
          <TBBtn icon="plus"     label="New"    dark tone="primary" />
          <TBBtn icon="upload"   label="Import" dark />
          <TBBtn icon="download" label="Export" dark />
          <TBDivider dark />
          <TBBtn icon="filter"   label="Filter" dark />
          <TBSpacer />
          <TBBtn icon="search"   title="Search" dark />
          <TBBtn icon="settings-2" title="View settings" dark />
          <TBBtn icon="more-horizontal" title="More" dark />
        </TBToolbar>
      </TBBox>

      <TBSpecRow>
        <TBSpec label="Densities"   value="sm 32 · md 40 · lg 48"  note="sm for data-table inline · md default · lg for hero surfaces" />
        <TBSpec label="Item gap"    value="2 / 4 / 6 px"           note="Tight at sm; loosens with density." />
        <TBSpec label="Text button" value="Work Sans 700 caps"     note="0.08em tracking; never sentence case in a toolbar." />
        <TBSpec label="Icon size"   value="14 / 16 / 18"           note="Lucide; 2px stroke (2.4 when active)." />
        <TBSpec label="Divider"     value="1px · 16/20/24h"        note="Surface-border light · 14%-white dark." />
        <TBSpec label="Active state" value="tint 8% · stroke 2.4"  note="Maroon tint on light · gold tint on dark." />
        <TBSpec label="Overflow"    value="kebab → menu"           note="Always collapsed last; +N count when truncating." />
        <TBSpec label="Lineage"     value="Fluent 2 Web + Teams"   note="Anatomy only · TUX type, maroon, signature." />
      </TBSpecRow>
    </PageShell>
  );
}

// ════════════════════════════════════════════════════════════════════════
// Export
// ════════════════════════════════════════════════════════════════════════

window.ToolbarPage = ToolbarPage;
