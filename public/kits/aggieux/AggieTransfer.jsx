/* global React, PageShell, AGGIE_CATALOG, LucideIcon */
/*
 * AggieTransfer.jsx — INF-4.5b: dual-list selector ("transfer").
 *
 *   Transfer — two paired lists with arrow buttons to move items between
 *              them. Left side = catalog of available items; right side =
 *              selected items. Pattern is canonical for "select N from this
 *              large catalog" research flows: corridor pickers, faculty
 *              co-author selection, dataset attribute pickers. Distinct
 *              from `dropdown-rich` (small fixed list with chips) and
 *              `combobox` (single-select autocomplete): transfer is for
 *              multi-select from a catalog too large to scan.
 *
 * Lineage (INF-4.5b):
 *   • Bootstrap 5 Design System Transfer (5 frames: header + item +
 *     deletable-item + footer with pagination + reload). Bootstrap ships
 *     paired panes each with a header (count + select-all + reload) and
 *     items (selectable on left, deletable on right). TUX adopts the
 *     same structure and swaps in: Work Sans 700 caps for headers, maroon
 *     accent for selection and arrow buttons, JetBrains Mono for counts,
 *     2px focus ring.
 *
 * Identity stays TUX: maroon brand, never Bootstrap blue (#0D6EFD).
 *
 * Helper prefix: TX (Transfer). Local helpers only.
 */

// ════════════════════════════════════════════════════════════════════════
// Shared helpers (TX prefix)
// ════════════════════════════════════════════════════════════════════════

function TXBox({ label, padded = true, children }) {
  return (
    <div style={{ border: "1px solid var(--surface-border)", borderRadius: "var(--radius-md)", overflow: "hidden", marginBottom: 16 }}>
      <div style={{
        padding: "7px 14px", fontSize: "0.62rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em",
        color: "var(--text-muted)", fontFamily: "var(--font-body-bold)",
        background: "var(--surface-sunken)",
        borderBottom: "1px solid var(--surface-border)",
      }}>{label}</div>
      <div style={{ padding: padded ? 28 : 0, background: "var(--surface-page)" }}>{children}</div>
    </div>
  );
}

function TXSectionLabel({ children }) {
  return (
    <h3 style={{
      fontFamily: "var(--font-body)", fontSize: "0.72rem", fontWeight: 600, textTransform: "lowercase",
      letterSpacing: "0.10em", color: "var(--text-muted)", margin: "32px 0 12px",
    }}>{children}</h3>
  );
}

function TXSpecRow({ children }) {
  return (
    <div style={{ marginTop: 28, padding: "14px 18px", border: "1px solid var(--surface-border)", borderRadius: "var(--radius-md)", background: "var(--surface-raised)", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: 18 }}>
      {children}
    </div>
  );
}

function TXSpec({ label, value, note }) {
  return (
    <div>
      <div style={{ fontFamily: "var(--font-body-bold)", fontSize: "0.6rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--text-muted)", marginBottom: 4 }}>{label}</div>
      <div style={{ fontFamily: "var(--font-mono)", fontWeight: 500, fontSize: "0.82rem", color: "var(--text-primary)", marginBottom: 4 }}>{value}</div>
      {note ? <div style={{ fontFamily: "var(--font-body)", fontSize: "0.74rem", color: "var(--text-muted)", lineHeight: 1.4 }}>{note}</div> : null}
    </div>
  );
}

function TXIntro({ children }) {
  return (
    <div style={{ borderLeft: "3px solid var(--brand-primary)", padding: "8px 16px", margin: "0 0 28px", background: "var(--surface-raised)", borderRadius: "0 var(--radius-sm) var(--radius-sm) 0" }}>
      <p style={{ margin: 0, fontFamily: "var(--font-body)", fontSize: "0.9rem", lineHeight: 1.55, color: "var(--text-primary)", maxWidth: 760 }}>{children}</p>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════
// TRANSFER primitive
// ════════════════════════════════════════════════════════════════════════

function TXPane({ heading, items, selected, onToggle, searchable, onSearch, query, side, footer, height = 360 }) {
  return (
    <div style={{
      width: 320, flexShrink: 0,
      background: "#FFFFFF",
      border: "1px solid var(--surface-border)",
      borderRadius: "var(--radius-md)",
      display: "flex", flexDirection: "column",
      fontFamily: "var(--font-body)",
      overflow: "hidden",
    }}>
      {/* Header */}
      <div style={{
        padding: "10px 12px",
        borderBottom: "1px solid var(--surface-border)",
        background: "var(--surface-sunken)",
        display: "flex", alignItems: "center", gap: 8,
      }}>
        <input
          type="checkbox"
          checked={items.length > 0 && selected.size === items.length}
          ref={el => { if (el) el.indeterminate = selected.size > 0 && selected.size < items.length; }}
          onChange={() => {
            if (selected.size === items.length) items.forEach(i => onToggle(i.id, false));
            else items.forEach(i => onToggle(i.id, true));
          }}
          style={{ accentColor: "var(--brand-primary)", width: 14, height: 14, flexShrink: 0 }}
        />
        <span style={{
          fontFamily: "var(--font-body-bold)", fontWeight: 700, fontSize: "0.72rem",
          textTransform: "uppercase", letterSpacing: "0.10em",
          color: "var(--text-primary)",
        }}>{heading}</span>
        <span style={{ flex: 1 }} />
        <span style={{
          fontFamily: "var(--font-mono)", fontSize: "0.72rem", fontWeight: 500,
          color: "var(--text-muted)", fontVariantNumeric: "tabular-nums",
        }}>{selected.size}/{items.length}</span>
      </div>

      {/* Search */}
      {searchable ? (
        <div style={{ padding: "8px 10px 6px", borderBottom: "1px solid var(--surface-border)" }}>
          <div style={{
            position: "relative",
            display: "flex", alignItems: "center",
            background: "var(--surface-raised)",
            border: "1px solid var(--surface-border)",
            borderRadius: "var(--radius-sm)",
            padding: "0 8px",
          }}>
            <LucideIcon name="search" size={13} color="var(--text-muted)" />
            <input
              type="search"
              value={query}
              onChange={e => onSearch(e.target.value)}
              placeholder={side === "left" ? "Filter available…" : "Filter selected…"}
              style={{
                flex: 1, minWidth: 0, height: 28,
                border: "none", background: "transparent", outline: "none",
                padding: "0 0 0 6px",
                fontFamily: "var(--font-body)", fontSize: "0.82rem",
                color: "var(--text-primary)",
              }}
            />
          </div>
        </div>
      ) : null}

      {/* Items */}
      <div style={{ flex: 1, minHeight: 0, height, overflowY: "auto", padding: "4px 0" }}>
        {items.length === 0 ? (
          <div style={{
            padding: "28px 16px", textAlign: "center",
            fontFamily: "var(--font-body)", fontSize: "0.82rem",
            color: "var(--text-muted)", lineHeight: 1.5,
          }}>
            {side === "left" ? "No matching items." : "Nothing selected yet."}
          </div>
        ) : items.map(it => (
          <label key={it.id} style={{
            display: "flex", alignItems: "center", gap: 10,
            padding: "8px 12px",
            cursor: it.disabled ? "not-allowed" : "pointer",
            opacity: it.disabled ? 0.4 : 1,
            background: selected.has(it.id) ? "color-mix(in srgb, var(--brand-primary) 6%, transparent)" : "transparent",
          }}>
            <input
              type="checkbox"
              checked={selected.has(it.id)}
              disabled={it.disabled}
              onChange={() => onToggle(it.id, !selected.has(it.id))}
              style={{ accentColor: "var(--brand-primary)", width: 14, height: 14, flexShrink: 0 }}
            />
            <span style={{ flex: 1, minWidth: 0, fontSize: "0.86rem", color: "var(--text-primary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {it.label}
            </span>
            {it.meta ? (
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: "var(--text-muted)", flexShrink: 0 }}>{it.meta}</span>
            ) : null}
          </label>
        ))}
      </div>

      {/* Footer */}
      {footer ? (
        <div style={{
          padding: "8px 12px",
          borderTop: "1px solid var(--surface-border)",
          background: "var(--surface-sunken)",
          fontFamily: "var(--font-mono)", fontSize: "0.72rem", fontWeight: 500,
          color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 8,
        }}>{footer}</div>
      ) : null}
    </div>
  );
}

function TXArrowButton({ direction, disabled, onClick, label }) {
  return (
    <button onClick={onClick} disabled={disabled} aria-label={label} title={label} style={{
      width: 36, height: 36,
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      background: disabled ? "transparent" : "#FFFFFF",
      border: `1px solid ${disabled ? "var(--surface-border)" : "var(--brand-primary)"}`,
      color: disabled ? "var(--text-muted)" : "var(--brand-primary)",
      borderRadius: "var(--radius-sm)",
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.5 : 1,
    }}>
      <LucideIcon name={direction === "right" ? "chevron-right" : "chevron-left"} size={16} />
    </button>
  );
}

function TXTransfer({
  available,
  initialSelected = [],
  leftHeading = "Available",
  rightHeading = "Selected",
  searchable = true,
  withCount,
}) {
  const [selectedIds, setSelectedIds] = React.useState(new Set(initialSelected));
  const [leftChecked, setLeftChecked] = React.useState(new Set());
  const [rightChecked, setRightChecked] = React.useState(new Set());
  const [leftQuery, setLeftQuery] = React.useState("");
  const [rightQuery, setRightQuery] = React.useState("");

  const leftItems = React.useMemo(
    () => available.filter(a => !selectedIds.has(a.id) && a.label.toLowerCase().includes(leftQuery.toLowerCase())),
    [available, selectedIds, leftQuery]
  );
  const rightItems = React.useMemo(
    () => available.filter(a => selectedIds.has(a.id) && a.label.toLowerCase().includes(rightQuery.toLowerCase())),
    [available, selectedIds, rightQuery]
  );

  const moveRight = () => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      leftChecked.forEach(id => next.add(id));
      return next;
    });
    setLeftChecked(new Set());
  };
  const moveLeft = () => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      rightChecked.forEach(id => next.delete(id));
      return next;
    });
    setRightChecked(new Set());
  };
  const moveAllRight = () => {
    setSelectedIds(new Set(available.filter(a => !a.disabled).map(a => a.id)));
    setLeftChecked(new Set());
  };
  const moveAllLeft = () => {
    setSelectedIds(new Set());
    setRightChecked(new Set());
  };

  return (
    <div style={{
      display: "flex", alignItems: "stretch", gap: 16,
      fontFamily: "var(--font-body)",
    }}>
      <TXPane
        heading={leftHeading}
        items={leftItems}
        selected={leftChecked}
        onToggle={(id, on) => setLeftChecked(prev => {
          const next = new Set(prev);
          if (on) next.add(id); else next.delete(id);
          return next;
        })}
        searchable={searchable}
        query={leftQuery}
        onSearch={setLeftQuery}
        side="left"
        footer={withCount ? `${available.filter(a => !selectedIds.has(a.id)).length} available` : null}
      />

      {/* Arrow column */}
      <div style={{
        display: "flex", flexDirection: "column", justifyContent: "center", gap: 8,
        alignSelf: "center",
      }}>
        <TXArrowButton direction="right" onClick={moveAllRight} disabled={leftItems.length === 0} label="Move all to selected" />
        <TXArrowButton direction="right" onClick={moveRight}    disabled={leftChecked.size === 0} label="Move selected to right" />
        <TXArrowButton direction="left"  onClick={moveLeft}     disabled={rightChecked.size === 0} label="Move selected back to available" />
        <TXArrowButton direction="left"  onClick={moveAllLeft}  disabled={rightItems.length === 0} label="Move all back to available" />
      </div>

      <TXPane
        heading={rightHeading}
        items={rightItems}
        selected={rightChecked}
        onToggle={(id, on) => setRightChecked(prev => {
          const next = new Set(prev);
          if (on) next.add(id); else next.delete(id);
          return next;
        })}
        searchable={searchable}
        query={rightQuery}
        onSearch={setRightQuery}
        side="right"
        footer={withCount ? `${selectedIds.size} selected` : null}
      />
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════
// PAGE
// ════════════════════════════════════════════════════════════════════════

function TransferPage() {
  const item = (window.AGGIE_CATALOG || []).find(c => c.id === "transfer");

  const corridorCatalog = [
    { id: "i35-hays",    label: "I-35 · Hays → Travis",    meta: "12.4mi" },
    { id: "i35-travis",  label: "I-35 · Travis → Williamson", meta: "8.1mi" },
    { id: "us290-tw",    label: "US 290 · Travis → Waller", meta: "18.6mi" },
    { id: "sh71-bastrop", label: "SH 71 · Bastrop → Fayette", meta: "22.0mi" },
    { id: "ih10-fb",     label: "I-10 · Fort Bend",         meta: "14.3mi" },
    { id: "us183-c",     label: "US 183 · Caldwell loop",   meta: "9.2mi" },
    { id: "fm620-w",     label: "FM 620 · Williamson",      meta: "11.7mi" },
    { id: "loop1604",    label: "Loop 1604 · Bexar",        meta: "31.5mi" },
    { id: "i37-livesa",  label: "I-37 · Live Oak → San Antonio", meta: "17.8mi" },
    { id: "sh130-toll",  label: "SH 130 · toll segments",   meta: "41.0mi", disabled: true },
  ];

  const attributeCatalog = [
    { id: "aadt",       label: "AADT (annual average daily traffic)" },
    { id: "speed",      label: "Speed · 85th percentile" },
    { id: "delay",      label: "Delay · vehicle-hours" },
    { id: "crash",      label: "Crash count · KABCO scaled" },
    { id: "pavement",   label: "Pavement condition score" },
    { id: "modeshare",  label: "Mode share · transit / SOV / HOV" },
    { id: "freight",    label: "Freight share" },
    { id: "demo",       label: "Demographics · census tract overlay" },
    { id: "weather",    label: "Weather event count" },
    { id: "incidents",  label: "Incident response times" },
  ];

  const facultyCatalog = [
    { id: "rivera",   label: "Rivera, J. · Mobility" },
    { id: "park",     label: "Park, J. · Freight" },
    { id: "chen",     label: "Chen, L. · Safety" },
    { id: "okafor",   label: "Okafor, C. · Policy" },
    { id: "patel",    label: "Patel, A. · Pavement" },
    { id: "wilson",   label: "Wilson, M. · Transit" },
    { id: "ng",       label: "Ng, S. · Connected Vehicles" },
    { id: "torres",   label: "Torres, R. · Geospatial" },
    { id: "kim",      label: "Kim, H. · Behavior modeling" },
  ];

  return (
    <PageShell item={item}>
      <TXIntro>
        Dual-list selector for "select N from this large catalog" research flows
        — corridor picking, faculty co-author selection, dataset attribute
        pickers. Two paired panes (left = available, right = selected) with
        per-pane search + select-all + 4-arrow column (all-right · checked-right
        · checked-left · all-left). Distinct from{" "}
        <code>dropdown-rich</code> (small fixed list with chips inside a single
        control) and <code>combobox</code> (single-select autocomplete): use
        transfer when the catalog is too large to scan in a popover.
      </TXIntro>

      <TXSectionLabel>1 · Standard — corridor catalog with metadata</TXSectionLabel>
      <TXBox label="catalog with per-row meta (mileage) · disabled row" padded={false}>
        <div style={{ padding: 24, background: "var(--surface-sunken)" }}>
          <TXTransfer
            available={corridorCatalog}
            initialSelected={["i35-hays", "us290-tw"]}
            leftHeading="Available corridors"
            rightHeading="Selected for report"
            withCount
          />
        </div>
      </TXBox>

      <TXSectionLabel>2 · Without search — short catalog</TXSectionLabel>
      <TXBox label="≤ 10 items · search slot collapsed" padded={false}>
        <div style={{ padding: 24, background: "var(--surface-sunken)" }}>
          <TXTransfer
            available={attributeCatalog}
            initialSelected={["aadt", "delay", "crash"]}
            leftHeading="Available metrics"
            rightHeading="On report"
            searchable={false}
          />
        </div>
      </TXBox>

      <TXSectionLabel>3 · People picker — co-authors</TXSectionLabel>
      <TXBox label="research roles · italic discipline tag in label" padded={false}>
        <div style={{ padding: 24, background: "var(--surface-sunken)" }}>
          <TXTransfer
            available={facultyCatalog}
            initialSelected={["rivera", "park"]}
            leftHeading="Faculty directory"
            rightHeading="Co-authors"
          />
        </div>
      </TXBox>

      <TXSpecRow>
        <TXSpec label="Pane width"   value="320px (default)"      note="Min 280; expand horizontally for long labels." />
        <TXSpec label="Pane height"  value="360px scroll"          note="Inner list scrolls; header + footer pin." />
        <TXSpec label="Header"       value="select-all · heading · count" note="select-all is tri-state (none / some / all)." />
        <TXSpec label="Arrow column" value="4 buttons"             note="all-right · checked-right · checked-left · all-left." />
        <TXSpec label="Selection"    value="row tint 6% maroon"    note="Selected-for-move rows highlight inside the pane." />
        <TXSpec label="Search"       value="optional"              note="Per-pane independent filter; case-insensitive." />
        <TXSpec label="Disabled row" value="opacity 0.4"           note="Can't be checked or moved by all-right." />
        <TXSpec label="Lineage"      value="Bootstrap 5 DS Transfer" note="Anatomy only · TUX type, maroon, no Bootstrap blue." />
      </TXSpecRow>
    </PageShell>
  );
}

// ════════════════════════════════════════════════════════════════════════
// Export
// ════════════════════════════════════════════════════════════════════════

window.TransferPage = TransferPage;
