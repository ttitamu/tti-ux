/* global React, PageShell, AGGIE_CATALOG, LucideIcon */
/*
 * AggieTree.jsx — Batch E: Tree family.
 *
 * Anatomy informed by Ant Design Tree, Microsoft Fluent 2 Web Tree (3 frames),
 * and Microsoft Fabric Tree:
 *   - indented hierarchy with disclosure chevron (rotates 90° on expand)
 *   - selection (single + multi-with-checkboxes)
 *   - drag affordance (grip on hover, drop indicator line)
 *   - lazy-load state (loader spinner on a parent node)
 *
 * Identity stays TUX. Maroon for selected/focused; warm-neutral surfaces;
 * Open Sans node labels; JetBrains Mono for counts and IDs.
 *
 * Helper prefix: TR.
 */

const { useState: _trUseState } = React;

function TRBox({ label, padded = true, dark = false, children }) {
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
function TRSectionLabel({ children }) {
  return <div style={{ fontSize: "0.62rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--text-muted)", fontFamily: "var(--font-body-bold)", marginBottom: 12, marginTop: 28 }}>{children}</div>;
}
function TRIntro({ children }) {
  return <div style={{ padding: "16px 20px", marginBottom: 28, background: "color-mix(in srgb, var(--brand-primary) 5%, transparent)", borderLeft: "3px solid var(--brand-primary)", borderRadius: "0 var(--radius-sm) var(--radius-sm) 0", fontSize: "0.92rem", lineHeight: 1.65, color: "var(--text-secondary)" }}>{children}</div>;
}
function TRSpecRow({ children }) {
  return <div style={{ marginTop: 28, padding: "14px 18px", border: "1px solid var(--surface-border)", borderRadius: "var(--radius-md)", background: "var(--surface-raised)", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>{children}</div>;
}
function TRSpec({ label, value, note }) {
  return (
    <div>
      <div style={{ fontSize: "0.6rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-muted)", fontFamily: "var(--font-body-bold)" }}>{label}</div>
      <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem", color: "var(--brand-primary)", marginTop: 3, fontWeight: 500 }}>{value}</div>
      {note && <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: 2, lineHeight: 1.4 }}>{note}</div>}
    </div>
  );
}

// ─── Sample data: TTI corridor breakdown ────────────────────────────────
const TR_DATA = [
  { id: "tx", label: "Texas (statewide)", count: 184, children: [
    { id: "i35", label: "I-35 corridor", count: 42, defaultExpanded: true, children: [
      { id: "i35-aus", label: "Austin segment", count: 18, defaultExpanded: true, children: [
        { id: "p2841", label: "I-35 Capital Express", leaf: true, mono: "PRJ-2841", status: "Active" },
        { id: "p2853", label: "Williamson reliever", leaf: true, mono: "PRJ-2853", status: "Active" },
        { id: "p2861", label: "Hays mainlane reconst.", leaf: true, mono: "PRJ-2861", status: "Risk" },
      ]},
      { id: "i35-sat", label: "San Antonio segment", count: 14, children: [] },
      { id: "i35-dfw", label: "DFW segment", count: 10, children: [] },
    ]},
    { id: "i10", label: "I-10 corridor", count: 31, children: [
      { id: "i10-elp", label: "El Paso segment", count: 9, children: [] },
      { id: "i10-hou", label: "Houston segment", count: 12, children: [] },
      { id: "i10-sat", label: "San Antonio segment", count: 10, children: [] },
    ]},
    { id: "us59", label: "US-59 / I-69 corridor", count: 28, children: [] },
    { id: "rural", label: "Rural FM network", count: 47, children: [] },
  ]},
];

// ─── Single-select tree ─────────────────────────────────────────────────
function TRSingleTree({ data, selectedId: initSel = "p2841", dark = false }) {
  const [selected, setSelected] = _trUseState(initSel);
  const [expanded, setExpanded] = _trUseState(() => {
    const ex = new Set();
    const walk = (nodes) => nodes && nodes.forEach(n => { if (n.defaultExpanded) ex.add(n.id); walk(n.children); });
    walk(data);
    return ex;
  });
  const toggle = (id) => setExpanded(s => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });

  return (
    <ul role="tree" style={{ listStyle: "none", margin: 0, padding: 0, fontFamily: "var(--font-body)" }}>
      {data.map(n => <TRNode key={n.id} node={n} depth={0} selected={selected} onSelect={setSelected} expanded={expanded} onToggle={toggle} dark={dark} />)}
    </ul>
  );
}

function TRNode({ node, depth, selected, onSelect, expanded, onToggle, checked, onCheck, dark, drag }) {
  const isLeaf = !!node.leaf;
  const isOpen = expanded.has(node.id);
  const isSel = selected === node.id;
  const text     = dark ? "rgba(255,255,255,0.92)" : "var(--text-primary)";
  const textSec  = dark ? "rgba(255,255,255,0.72)" : "var(--text-secondary)";
  const muted    = dark ? "rgba(255,255,255,0.55)" : "var(--text-muted)";
  const selBg    = dark ? "rgba(217,155,126,0.16)" : "color-mix(in srgb, var(--brand-primary) 8%, transparent)";
  const selText  = dark ? "rgba(255,255,255,0.98)" : "var(--brand-primary)";
  const hoverBg  = dark ? "rgba(255,255,255,0.04)" : "color-mix(in srgb, var(--brand-primary) 3%, transparent)";

  return (
    <li role="treeitem" aria-expanded={!isLeaf ? isOpen : undefined} aria-selected={isSel}>
      <div
        onClick={() => onSelect && onSelect(node.id)}
        style={{
          display: "flex", alignItems: "center", gap: 6,
          padding: "5px 10px 5px 0",
          paddingLeft: 10 + depth * 18,
          background: isSel ? selBg : "transparent",
          color: isSel ? selText : (isLeaf ? textSec : text),
          fontWeight: isSel ? 600 : (isLeaf ? 400 : 500),
          fontFamily: isSel || !isLeaf ? "var(--font-body-bold)" : "var(--font-body)",
          cursor: "pointer",
          fontSize: "0.85rem",
          borderLeft: `2px solid ${isSel ? "var(--brand-primary)" : "transparent"}`,
          transition: "background 100ms",
        }}
        onMouseEnter={(e) => { if (!isSel) e.currentTarget.style.background = hoverBg; }}
        onMouseLeave={(e) => { if (!isSel) e.currentTarget.style.background = "transparent"; }}
      >
        {/* Chevron */}
        {isLeaf ? (
          <span style={{ width: 16, display: "inline-flex", justifyContent: "center" }}>
            <span aria-hidden style={{ width: 4, height: 4, borderRadius: "50%", background: muted }} />
          </span>
        ) : (
          <button
            onClick={(e) => { e.stopPropagation(); onToggle(node.id); }}
            aria-label={isOpen ? "Collapse" : "Expand"}
            style={{ width: 16, height: 16, padding: 0, border: "none", background: "transparent", color: muted, cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", transform: isOpen ? "rotate(90deg)" : "rotate(0)", transition: "transform 160ms cubic-bezier(0.2, 0, 0, 1)" }}
          >
            <LucideIcon name="chevron-right" size={13} />
          </button>
        )}

        {/* Optional checkbox */}
        {onCheck && <TRMiniCheckbox checked={checked.has(node.id)} indeterminate={checked.indet && checked.indet.has(node.id)} onChange={(e) => { e.stopPropagation(); onCheck(node.id); }} dark={dark} />}

        {/* Drag grip */}
        {drag && <span aria-hidden style={{ color: muted, opacity: 0, transition: "opacity 100ms", cursor: "grab" }} className="tr-grip"><LucideIcon name="grip-vertical" size={12} /></span>}

        {/* Icon (folder/leaf) */}
        <span style={{ display: "inline-flex", color: isLeaf ? muted : (isSel ? "var(--brand-primary)" : (dark ? "rgba(255,255,255,0.65)" : "var(--text-muted)")) }}>
          {isLeaf
            ? <LucideIcon name="map-pin" size={13} strokeWidth={1.8} />
            : <LucideIcon name={isOpen ? "folder-open" : "folder"} size={13} strokeWidth={1.8} />}
        </span>

        {/* Label */}
        <span style={{ flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{node.label}</span>

        {/* Right side: mono ID, count, status */}
        {node.mono && <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: muted, fontWeight: 500 }}>{node.mono}</span>}
        {node.status && <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: "0.7rem", color: TR_STATUS[node.status] || muted, fontFamily: "var(--font-body-bold)", fontWeight: 600 }}>
          <span aria-hidden style={{ width: 5, height: 5, borderRadius: "50%", background: TR_STATUS[node.status] || muted }} />
          {node.status}
        </span>}
        {node.count != null && (
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: muted, fontWeight: 500, padding: "1px 6px", border: `1px solid ${dark ? "rgba(255,255,255,0.12)" : "var(--surface-border)"}`, borderRadius: 3, minWidth: 28, textAlign: "center" }}>{node.count}</span>
        )}
        {node.loading && <span aria-hidden style={{ width: 11, height: 11, border: `1.5px solid ${dark ? "rgba(255,255,255,0.25)" : "var(--surface-border)"}`, borderTopColor: "var(--brand-primary)", borderRadius: "50%", animation: "tux-spin 0.8s linear infinite" }} />}
      </div>

      {/* Children */}
      {!isLeaf && isOpen && node.children && node.children.length > 0 && (
        <ul role="group" style={{ listStyle: "none", margin: 0, padding: 0 }}>
          {node.children.map(c => <TRNode key={c.id} node={c} depth={depth + 1} selected={selected} onSelect={onSelect} expanded={expanded} onToggle={onToggle} checked={checked} onCheck={onCheck} dark={dark} drag={drag} />)}
        </ul>
      )}
      {!isLeaf && isOpen && (!node.children || node.children.length === 0) && !node.loading && (
        <div style={{ paddingLeft: 10 + (depth + 1) * 18 + 22, fontSize: "0.78rem", color: muted, fontStyle: "italic", padding: "5px 0 5px 56px" }}>(empty)</div>
      )}
    </li>
  );
}

const TR_STATUS = { Active: "var(--color-success)", Risk: "var(--color-error)", Hold: "var(--brand-accent)", Closed: "var(--text-muted)" };

// ─── Mini checkbox for tree (smaller than form-core checkbox) ───────────
function TRMiniCheckbox({ checked, indeterminate, onChange, dark }) {
  const filled = checked || indeterminate;
  return (
    <label onClick={(e) => e.stopPropagation()} style={{ position: "relative", display: "inline-flex", width: 14, height: 14, cursor: "pointer", alignItems: "center", justifyContent: "center" }}>
      <input type="checkbox" checked={!!checked} onChange={onChange} style={{ position: "absolute", inset: 0, opacity: 0, margin: 0, cursor: "pointer" }} />
      <span aria-hidden style={{ width: 14, height: 14, borderRadius: 3, border: `1.5px solid ${filled ? "var(--brand-primary)" : (dark ? "rgba(255,255,255,0.4)" : "var(--surface-border)")}`, background: filled ? "var(--brand-primary)" : (dark ? "rgba(255,255,255,0.06)" : "var(--surface-raised)"), display: "flex", alignItems: "center", justifyContent: "center" }}>
        {checked && <LucideIcon name="check" size={9} color="white" strokeWidth={3} />}
        {indeterminate && !checked && <span style={{ width: 7, height: 2, background: "white", borderRadius: 1 }} />}
      </span>
    </label>
  );
}

// ─── Multi-select tree (with checkboxes) ────────────────────────────────
function TRMultiTree({ data, dark = false }) {
  const [selected] = _trUseState("i35");
  const [expanded, setExpanded] = _trUseState(new Set(["tx", "i35", "i35-aus"]));
  const [checked, setChecked] = _trUseState(new Set(["i35-aus", "p2841", "p2853", "p2861"]));
  const indet = new Set(["i35", "tx"]); // demo state — partial children
  checked.indet = indet;

  const toggle = (id) => setExpanded(s => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const onCheck = (id) => setChecked(s => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); n.indet = indet; return n; });

  return (
    <ul role="tree" style={{ listStyle: "none", margin: 0, padding: 0, fontFamily: "var(--font-body)" }}>
      {data.map(n => <TRNode key={n.id} node={n} depth={0} selected={selected} expanded={expanded} onToggle={toggle} checked={checked} onCheck={onCheck} dark={dark} />)}
    </ul>
  );
}

// ─── Lazy-load state ────────────────────────────────────────────────────
function TRLazyTree() {
  const data = [
    { id: "tx", label: "Texas (statewide)", count: 184, children: [
      { id: "i35", label: "I-35 corridor", count: 42, children: [
        { id: "i35-aus", label: "Austin segment (loading…)", loading: true, children: null },
      ], defaultExpanded: true },
      { id: "i10", label: "I-10 corridor", count: 31, children: [] },
    ]},
  ];
  const [expanded, setExpanded] = _trUseState(new Set(["tx", "i35"]));
  const toggle = (id) => setExpanded(s => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });
  return (
    <ul role="tree" style={{ listStyle: "none", margin: 0, padding: 0, fontFamily: "var(--font-body)" }}>
      {data.map(n => <TRNode key={n.id} node={n} depth={0} selected={null} expanded={expanded} onToggle={toggle} />)}
    </ul>
  );
}

// ─── With drag affordance ───────────────────────────────────────────────
function TRDragTree() {
  const data = [
    { id: "tx", label: "Texas (statewide)", count: 184, children: [
      { id: "i35", label: "I-35 corridor", count: 42, defaultExpanded: true, children: [
        { id: "p2841", label: "I-35 Capital Express", leaf: true, mono: "PRJ-2841", status: "Active" },
        { id: "p2853", label: "Williamson reliever", leaf: true, mono: "PRJ-2853", status: "Active" },
        { id: "p2861", label: "Hays mainlane reconst.", leaf: true, mono: "PRJ-2861", status: "Risk" },
      ]},
      { id: "i10", label: "I-10 corridor", count: 31, children: [] },
    ]},
  ];
  const [selected, setSelected] = _trUseState("p2853");
  const [expanded, setExpanded] = _trUseState(new Set(["tx", "i35"]));
  const toggle = (id) => setExpanded(s => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });
  return (
    <>
      <style>{`.tr-grip-host:hover .tr-grip { opacity: 0.7 !important; }`}</style>
      <ul role="tree" style={{ listStyle: "none", margin: 0, padding: 0, fontFamily: "var(--font-body)" }}>
        {data.map(n => <TRNode key={n.id} node={n} depth={0} selected={selected} onSelect={setSelected} expanded={expanded} onToggle={toggle} drag />)}
      </ul>
      <div style={{ marginTop: 12, padding: "8px 12px", background: "color-mix(in srgb, var(--brand-primary) 5%, transparent)", border: "1px dashed color-mix(in srgb, var(--brand-primary) 30%, transparent)", borderRadius: 3, fontSize: "0.78rem", color: "var(--text-muted)", fontStyle: "italic" }}>
        Drop indicator: a 2px maroon line appears above or below the target row during drag-over (not shown statically).
      </div>
    </>
  );
}

// ────────────────────────────────────────────────────────────────────────
// PAGE
// ────────────────────────────────────────────────────────────────────────
function TreePage() {
  const item = (window.AGGIE_CATALOG || []).find(c => c.id === "tree");
  return (
    <PageShell item={item}>
      <TRIntro>
        Indented hierarchy with expand/collapse for corridor breakdowns, file trees, taxonomy browsers, and faceted filters. Single-select for navigation, multi-select with checkboxes for bulk operations, lazy-load for large server-side trees, and drag affordance for reorderable hierarchies. Lineage: anatomy from Ant Design Tree and Microsoft Fabric Tree — TUX type, color, and focus rules throughout.
      </TRIntro>

      <TRSectionLabel>Single-select · navigation</TRSectionLabel>
      <TRBox label="Corridor breakdown · single-select">
        <div style={{ maxWidth: 480 }}>
          <TRSingleTree data={TR_DATA} />
        </div>
      </TRBox>

      <TRBox label="Same on dark" dark>
        <div style={{ maxWidth: 480 }}>
          <TRSingleTree data={TR_DATA} dark />
        </div>
      </TRBox>

      <TRSectionLabel>Multi-select · bulk operations</TRSectionLabel>
      <TRBox label="Faceted filter · checkboxes with indeterminate state">
        <div style={{ maxWidth: 480 }}>
          <TRMultiTree data={TR_DATA} />
        </div>
        <div style={{ marginTop: 14, padding: "8px 12px", background: "var(--surface-sunken)", borderRadius: 3, fontSize: "0.78rem", color: "var(--text-muted)" }}>
          Indeterminate: <strong>I-35 corridor</strong> and <strong>Texas (statewide)</strong> show partial-fill (<span style={{ display: "inline-block", width: 8, height: 2, background: "var(--brand-primary)", verticalAlign: "middle" }} />) because some but not all descendants are checked.
        </div>
      </TRBox>

      <TRSectionLabel>Lazy load · async children</TRSectionLabel>
      <TRBox label="Loading state · spinner replaces chevron until children resolve">
        <div style={{ maxWidth: 480 }}>
          <TRLazyTree />
        </div>
      </TRBox>

      <TRSectionLabel>Drag affordance</TRSectionLabel>
      <TRBox label="Reorderable · grip on hover">
        <div style={{ maxWidth: 480 }}>
          <TRDragTree />
        </div>
      </TRBox>

      <TRSpecRow>
        <TRSpec label="Indent step" value="18px" note="Per depth level · multiply by depth" />
        <TRSpec label="Row height" value="28px" note="Comfortable · 24px for compact" />
        <TRSpec label="Chevron rotate" value="0° → 90°" note="160ms · standard ease" />
        <TRSpec label="Selection" value="2px maroon left-rule" note="Plus 8% maroon row tint" />
      </TRSpecRow>
      <TRSpecRow>
        <TRSpec label="Multi-select" value="Checkbox + indeterminate" note="Partial children → indeterminate" />
        <TRSpec label="Loading" value="11px spinner" note="Replaces chevron on the loading parent" />
        <TRSpec label="Drag" value="Grip on hover · drop line" note="2px maroon insertion indicator" />
        <TRSpec label="Lineage" value="Ant + Fluent 2 Web + Fabric" note="Anatomy only · TUX type and color" />
      </TRSpecRow>
    </PageShell>
  );
}

window.TreePage = TreePage;
