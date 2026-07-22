/* global React, PageShell, AGGIE_CATALOG, LucideIcon */
/*
 * AggieDropdownCombobox.jsx — Batch G part 1.
 *
 *   • dropdown-rich — multiselect with search, grouped options, tag chips,
 *                     select-all/clear, and a "n more" overflow chip
 *   • combobox      — autocomplete with async loading, free-text accept,
 *                     inline validation, and a clear affordance
 *
 * Anatomy lineage: Ant Design Select/Cascader/AutoComplete, Microsoft Fabric
 * Dropdown + Combobox. Identity stays TUX: maroon focus ring, Open Sans
 * options, JetBrains Mono for IDs and counts. No Ant or Fluent chrome lifted.
 *
 * Helper prefix: DC.
 */

const { useState: _dcUseState, useRef: _dcUseRef, useEffect: _dcUseEffect, useMemo: _dcUseMemo } = React;

// ─── Shared chrome helpers ──────────────────────────────────────────────
function DCBox({ label, children, padded = true }) {
  return (
    <div style={{ border: "1px solid var(--surface-border)", borderRadius: "var(--radius-md)", overflow: "hidden", marginBottom: 16 }}>
      <div style={{ padding: "7px 14px", fontSize: "0.62rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--text-muted)", fontFamily: "var(--font-body-bold)", background: "var(--surface-sunken)", borderBottom: "1px solid var(--surface-border)" }}>{label}</div>
      <div style={{ padding: padded ? 28 : 0, background: "var(--surface-page)" }}>{children}</div>
    </div>
  );
}
function DCSectionLabel({ children }) {
  return <div style={{ fontSize: "0.62rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--text-muted)", fontFamily: "var(--font-body-bold)", marginBottom: 12, marginTop: 28 }}>{children}</div>;
}
function DCIntro({ children }) {
  return <div style={{ padding: "16px 20px", marginBottom: 28, background: "color-mix(in srgb, var(--brand-primary) 5%, transparent)", borderLeft: "3px solid var(--brand-primary)", borderRadius: "0 var(--radius-sm) var(--radius-sm) 0", fontSize: "0.92rem", lineHeight: 1.65, color: "var(--text-secondary)" }}>{children}</div>;
}
function DCSpecRow({ children }) {
  return <div style={{ marginTop: 28, padding: "14px 18px", border: "1px solid var(--surface-border)", borderRadius: "var(--radius-md)", background: "var(--surface-raised)", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>{children}</div>;
}
function DCSpec({ label, value, note }) {
  return (
    <div>
      <div style={{ fontSize: "0.6rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-muted)", fontFamily: "var(--font-body-bold)" }}>{label}</div>
      <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem", color: "var(--brand-primary)", marginTop: 3, fontWeight: 500 }}>{value}</div>
      {note && <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: 2, lineHeight: 1.4 }}>{note}</div>}
    </div>
  );
}
function DCFieldLabel({ children, htmlFor, required }) {
  return (
    <label htmlFor={htmlFor} style={{ display: "block", fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-primary)", fontFamily: "var(--font-body-bold)", marginBottom: 6 }}>
      {children}
      {required && <span aria-hidden style={{ color: "var(--color-danger)", marginLeft: 4 }}>*</span>}
    </label>
  );
}

// ════════════════════════════════════════════════════════════════════════
// dropdown-rich
// ════════════════════════════════════════════════════════════════════════
const DC_DROPDOWN_GROUPS = [
  { id: "north", label: "North Texas", items: [
    { id: "dist-dallas",    label: "Dallas",      sub: "DAL · 12 corridors" },
    { id: "dist-fort-worth",label: "Fort Worth",  sub: "FW · 9 corridors" },
    { id: "dist-paris",     label: "Paris",       sub: "PAR · 3 corridors" },
    { id: "dist-wichita",   label: "Wichita Falls", sub: "WF · 4 corridors" },
  ]},
  { id: "central", label: "Central Texas", items: [
    { id: "dist-austin",    label: "Austin",      sub: "AUS · 14 corridors" },
    { id: "dist-bryan",     label: "Bryan",       sub: "BRY · 5 corridors" },
    { id: "dist-waco",      label: "Waco",        sub: "WAC · 6 corridors" },
  ]},
  { id: "south", label: "South Texas", items: [
    { id: "dist-san-antonio", label: "San Antonio", sub: "SAT · 11 corridors" },
    { id: "dist-laredo",      label: "Laredo",      sub: "LRD · 4 corridors" },
    { id: "dist-pharr",       label: "Pharr",       sub: "PHR · 4 corridors" },
    { id: "dist-corpus",      label: "Corpus Christi", sub: "CRP · 5 corridors" },
  ]},
  { id: "coast", label: "Coast", items: [
    { id: "dist-houston",   label: "Houston",      sub: "HOU · 18 corridors" },
    { id: "dist-beaumont",  label: "Beaumont",     sub: "BMT · 4 corridors" },
    { id: "dist-yoakum",    label: "Yoakum",       sub: "YKM · 3 corridors" },
  ]},
];

function DropdownRich({ groups = DC_DROPDOWN_GROUPS, defaultSelected = ["dist-austin", "dist-houston"], maxVisibleTags = 3, placeholder = "Choose districts…" }) {
  const [selected, setSelected] = _dcUseState(new Set(defaultSelected));
  const [open, setOpen] = _dcUseState(false);
  const [query, setQuery] = _dcUseState("");
  const wrapRef = _dcUseRef(null);

  _dcUseEffect(() => {
    function onDoc(e) { if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false); }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const flat = _dcUseMemo(() => groups.flatMap(g => g.items.map(it => ({ ...it, groupLabel: g.label }))), [groups]);
  const byId = _dcUseMemo(() => Object.fromEntries(flat.map(it => [it.id, it])), [flat]);

  const filtered = _dcUseMemo(() => {
    if (!query.trim()) return groups;
    const q = query.toLowerCase();
    return groups
      .map(g => ({ ...g, items: g.items.filter(it => it.label.toLowerCase().includes(q) || (it.sub || "").toLowerCase().includes(q)) }))
      .filter(g => g.items.length > 0);
  }, [groups, query]);

  const toggle = (id) => setSelected(s => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const selectAll = () => setSelected(new Set(flat.map(it => it.id)));
  const clearAll = () => setSelected(new Set());
  const removeTag = (id) => setSelected(s => { const n = new Set(s); n.delete(id); return n; });

  const selectedArr = [...selected];
  const visibleTags = selectedArr.slice(0, maxVisibleTags);
  const overflowCount = selectedArr.length - visibleTags.length;

  return (
    <div ref={wrapRef} style={{ position: "relative", maxWidth: 480 }}>
      {/* Control */}
      <div
        onClick={() => setOpen(o => !o)}
        style={{
          minHeight: 40, padding: "5px 38px 5px 10px",
          border: `1px solid ${open ? "var(--brand-primary)" : "var(--surface-border)"}`,
          borderRadius: "var(--radius-md)",
          background: "var(--surface-raised)",
          cursor: "text", display: "flex", alignItems: "center", flexWrap: "wrap", gap: 5,
          boxShadow: open ? "var(--shadow-focus)" : "none",
          transition: "border-color 120ms, box-shadow 120ms",
          fontSize: "0.875rem",
          position: "relative",
        }}
      >
        {selectedArr.length === 0 && (
          <span style={{ color: "var(--text-muted)", padding: "0 4px" }}>{placeholder}</span>
        )}
        {visibleTags.map(id => {
          const it = byId[id];
          if (!it) return null;
          return (
            <span key={id} style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "3px 4px 3px 9px", background: "color-mix(in srgb, var(--brand-primary) 9%, transparent)", color: "var(--brand-primary)", borderRadius: 3, fontFamily: "var(--font-body-bold)", fontSize: "0.78rem", fontWeight: 600, border: "1px solid color-mix(in srgb, var(--brand-primary) 22%, transparent)" }}>
              {it.label}
              <button onClick={(e) => { e.stopPropagation(); removeTag(id); }} aria-label={`Remove ${it.label}`} style={{ background: "transparent", border: "none", color: "inherit", padding: "0 2px", cursor: "pointer", lineHeight: 0, opacity: 0.7 }}>
                <LucideIcon name="x" size={11} strokeWidth={2.5} />
              </button>
            </span>
          );
        })}
        {overflowCount > 0 && (
          <span style={{ display: "inline-flex", alignItems: "center", padding: "3px 9px", background: "var(--surface-sunken)", color: "var(--text-secondary)", borderRadius: 3, fontFamily: "var(--font-mono)", fontSize: "0.74rem", fontWeight: 600, border: "1px solid var(--surface-border)" }}>
            +{overflowCount} more
          </span>
        )}
        <span style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", display: "flex", alignItems: "center", gap: 4, color: "var(--text-muted)" }}>
          {selectedArr.length > 0 && (
            <button onClick={(e) => { e.stopPropagation(); clearAll(); }} aria-label="Clear all" style={{ background: "transparent", border: "none", padding: 2, cursor: "pointer", color: "inherit", display: "inline-flex" }}>
              <LucideIcon name="x" size={13} />
            </button>
          )}
          <LucideIcon name={open ? "chevron-up" : "chevron-down"} size={14} />
        </span>
      </div>

      {/* Popover */}
      {open && (
        <div style={{ position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, background: "var(--surface-raised)", border: "1px solid var(--surface-border)", borderRadius: "var(--radius-md)", boxShadow: "var(--elevation-overlay, var(--shadow-lg))", zIndex: 20, overflow: "hidden" }}>
          {/* Search */}
          <div style={{ padding: "8px 10px", borderBottom: "1px solid var(--surface-border)", display: "flex", alignItems: "center", gap: 6 }}>
            <LucideIcon name="search" size={12} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Filter districts…"
              autoFocus
              style={{ flex: 1, border: "none", outline: "none", fontFamily: "inherit", fontSize: "0.84rem", background: "transparent", color: "var(--text-primary)" }}
            />
            {query && (
              <button onClick={() => setQuery("")} aria-label="Clear filter" style={{ background: "transparent", border: "none", color: "var(--text-muted)", cursor: "pointer", padding: 2, display: "inline-flex" }}>
                <LucideIcon name="x" size={12} />
              </button>
            )}
          </div>

          {/* Toolbar */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "6px 12px", borderBottom: "1px solid var(--surface-border)", background: "var(--surface-sunken)" }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--text-muted)" }}>{selectedArr.length} of {flat.length} selected</span>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={selectAll} style={dcLinkBtn}>Select all</button>
              <button onClick={clearAll} style={dcLinkBtn}>Clear</button>
            </div>
          </div>

          {/* Groups */}
          <div style={{ maxHeight: 280, overflowY: "auto" }}>
            {filtered.length === 0 && (
              <div style={{ padding: "20px 14px", textAlign: "center", color: "var(--text-muted)", fontSize: "0.84rem", fontStyle: "italic" }}>
                No districts match "<span style={{ color: "var(--text-primary)", fontStyle: "normal" }}>{query}</span>"
              </div>
            )}
            {filtered.map(g => (
              <div key={g.id}>
                <div style={{ padding: "8px 12px 4px", fontSize: "0.62rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--text-muted)", fontFamily: "var(--font-body-bold)", borderBottom: "1px solid var(--surface-border)" }}>{g.label}</div>
                {g.items.map(it => {
                  const isSel = selected.has(it.id);
                  return (
                    <button
                      key={it.id}
                      onClick={() => toggle(it.id)}
                      role="option"
                      aria-selected={isSel}
                      style={{
                        width: "100%", display: "flex", alignItems: "center", gap: 10,
                        padding: "8px 12px",
                        background: isSel ? "color-mix(in srgb, var(--brand-primary) 5%, transparent)" : "transparent",
                        border: "none", textAlign: "left", cursor: "pointer",
                        fontFamily: "inherit", fontSize: "0.86rem", color: "var(--text-primary)",
                      }}
                      onMouseEnter={(e) => { if (!isSel) e.currentTarget.style.background = "var(--surface-sunken)"; }}
                      onMouseLeave={(e) => { if (!isSel) e.currentTarget.style.background = "transparent"; }}
                    >
                      <span aria-hidden style={{ width: 16, height: 16, borderRadius: 3, border: `1.5px solid ${isSel ? "var(--brand-primary)" : "var(--surface-border)"}`, background: isSel ? "var(--brand-primary)" : "var(--surface-raised)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        {isSel && <LucideIcon name="check" size={11} color="white" strokeWidth={3} />}
                      </span>
                      <span style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: isSel ? 600 : 500 }}>{it.label}</div>
                        {it.sub && <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: "var(--text-muted)", marginTop: 1 }}>{it.sub}</div>}
                      </span>
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
const dcLinkBtn = { background: "transparent", border: "none", padding: 0, color: "var(--brand-primary)", fontFamily: "var(--font-body-bold)", fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", cursor: "pointer" };

// ════════════════════════════════════════════════════════════════════════
// combobox
// ════════════════════════════════════════════════════════════════════════
const DC_COMBO_SOURCE = [
  { id: "PRJ-2841", label: "I-35 Capital Express",     sub: "Austin · Construction" },
  { id: "PRJ-2842", label: "US-290 East Reliever",     sub: "Houston · Design 60%" },
  { id: "PRJ-2843", label: "SH-130 Rural ITS",         sub: "San Antonio · Hold" },
  { id: "PRJ-2844", label: "I-10 Border Freight",      sub: "El Paso · Construction" },
  { id: "PRJ-2845", label: "Loop 1604 Reconstruction", sub: "San Antonio · Design 90%" },
  { id: "PRJ-2846", label: "FM-1488 Rural Realign",    sub: "Houston · Closeout" },
  { id: "PRJ-2847", label: "I-45 Central Sustained",   sub: "Houston · Risk" },
  { id: "PRJ-2848", label: "US-59 Lufkin Bypass",      sub: "Atlanta · Design 30%" },
  { id: "PRJ-2849", label: "I-20 Midland Widening",    sub: "Odessa · Scoping" },
];

function Combobox({ source = DC_COMBO_SOURCE, placeholder = "Find a project (name or PRJ-#)…", defaultValue = "", async: isAsync = false, allowFreeText = false, error, label = "Project lookup" }) {
  const [value, setValue] = _dcUseState(defaultValue);
  const [open, setOpen] = _dcUseState(false);
  const [highlight, setHighlight] = _dcUseState(0);
  const [loading, setLoading] = _dcUseState(false);
  const [chosen, setChosen] = _dcUseState(null);
  const wrapRef = _dcUseRef(null);
  const inputRef = _dcUseRef(null);

  _dcUseEffect(() => {
    function onDoc(e) { if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false); }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  // Simulated async: when value changes and isAsync, debounce-show loading
  _dcUseEffect(() => {
    if (!isAsync) return;
    if (!value.trim() || chosen) { setLoading(false); return; }
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 380);
    return () => clearTimeout(t);
  }, [value, isAsync, chosen]);

  const filtered = _dcUseMemo(() => {
    if (!value.trim() || chosen) return source.slice(0, 8);
    const q = value.toLowerCase();
    return source.filter(it => it.label.toLowerCase().includes(q) || it.id.toLowerCase().includes(q) || (it.sub || "").toLowerCase().includes(q)).slice(0, 8);
  }, [source, value, chosen]);

  const onChange = (e) => {
    setValue(e.target.value);
    setChosen(null);
    setHighlight(0);
    if (!open) setOpen(true);
  };
  const choose = (it) => {
    setValue(`${it.label} · ${it.id}`);
    setChosen(it);
    setOpen(false);
  };
  const onKey = (e) => {
    if (!open && (e.key === "ArrowDown" || e.key === "Enter")) { setOpen(true); return; }
    if (e.key === "ArrowDown") { e.preventDefault(); setHighlight(h => Math.min(h + 1, filtered.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setHighlight(h => Math.max(h - 1, 0)); }
    else if (e.key === "Enter") { e.preventDefault(); if (filtered[highlight]) choose(filtered[highlight]); else if (allowFreeText && value.trim()) { setChosen({ id: value, label: value, freeText: true }); setOpen(false); } }
    else if (e.key === "Escape") { setOpen(false); }
  };

  const showError = error || (!allowFreeText && value.trim() && !chosen && filtered.length === 0 && !loading);
  const errMsg = error || (showError ? "No match. Choose from the list, or paste a valid PRJ-# id." : null);

  return (
    <div ref={wrapRef} style={{ position: "relative", maxWidth: 480 }}>
      {label && <DCFieldLabel htmlFor="dc-combo-1">{label}</DCFieldLabel>}
      <div style={{ position: "relative" }}>
        <LucideIcon name="search" size={13} />
        <input
          id="dc-combo-1"
          ref={inputRef}
          type="text"
          value={value}
          onChange={onChange}
          onFocus={() => setOpen(true)}
          onKeyDown={onKey}
          placeholder={placeholder}
          aria-autocomplete="list"
          aria-expanded={open}
          aria-controls="dc-combo-listbox"
          autoComplete="off"
          style={{
            width: "100%", height: 40,
            padding: "0 70px 0 32px",
            border: `1px solid ${showError ? "var(--color-error, #B23A3A)" : (open ? "var(--brand-primary)" : "var(--surface-border)")}`,
            borderRadius: "var(--radius-md)",
            background: "var(--surface-raised)",
            fontFamily: "inherit", fontSize: "0.875rem",
            color: "var(--text-primary)",
            outline: "none",
            boxShadow: open && !showError ? "var(--shadow-focus)" : "none",
            transition: "border-color 120ms, box-shadow 120ms",
            boxSizing: "border-box",
          }}
        />
        <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", pointerEvents: "none", display: "flex" }}>
          <LucideIcon name="search" size={13} />
        </span>
        <span style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", display: "inline-flex", alignItems: "center", gap: 4, color: "var(--text-muted)" }}>
          {loading && <span aria-label="Loading" style={{ width: 12, height: 12, border: "1.5px solid var(--surface-border)", borderTopColor: "var(--brand-primary)", borderRadius: "50%", animation: "tux-spin 0.8s linear infinite" }} />}
          {value && !loading && (
            <button onClick={() => { setValue(""); setChosen(null); inputRef.current?.focus(); }} aria-label="Clear" style={{ background: "transparent", border: "none", color: "inherit", cursor: "pointer", padding: 2, display: "inline-flex" }}>
              <LucideIcon name="x" size={13} />
            </button>
          )}
          {chosen && !loading && <LucideIcon name="check" size={13} color="var(--color-success)" strokeWidth={2.5} />}
        </span>
      </div>

      {errMsg && (
        <div style={{ marginTop: 6, fontSize: "0.78rem", color: "var(--color-error, #B23A3A)", display: "flex", alignItems: "center", gap: 5 }}>
          <LucideIcon name="alert-circle" size={12} />
          {errMsg}
        </div>
      )}

      {open && !chosen && (
        <div id="dc-combo-listbox" role="listbox" style={{ position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, background: "var(--surface-raised)", border: "1px solid var(--surface-border)", borderRadius: "var(--radius-md)", boxShadow: "var(--elevation-overlay, var(--shadow-lg))", zIndex: 20, overflow: "hidden", maxHeight: 320 }}>
          {loading && filtered.length === 0 && (
            <div style={{ padding: "12px 14px", color: "var(--text-muted)", fontSize: "0.84rem", display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ width: 12, height: 12, border: "1.5px solid var(--surface-border)", borderTopColor: "var(--brand-primary)", borderRadius: "50%", animation: "tux-spin 0.8s linear infinite" }} />
              Searching projects…
            </div>
          )}
          {!loading && filtered.length === 0 && (
            <div style={{ padding: "14px 14px", color: "var(--text-muted)", fontSize: "0.84rem", fontStyle: "italic" }}>
              No matches.{allowFreeText && value.trim() && <> Press <kbd style={{ fontFamily: "var(--font-mono)", fontSize: "0.74rem", padding: "1px 5px", background: "var(--surface-sunken)", border: "1px solid var(--surface-border)", borderRadius: 3, marginLeft: 4 }}>Enter</kbd> to use "<span style={{ color: "var(--text-primary)", fontStyle: "normal" }}>{value}</span>".</>}
            </div>
          )}
          {filtered.map((it, i) => {
            const isHi = i === highlight;
            return (
              <button
                key={it.id}
                role="option"
                aria-selected={isHi}
                onMouseEnter={() => setHighlight(i)}
                onClick={() => choose(it)}
                style={{
                  width: "100%", display: "flex", alignItems: "center", gap: 12,
                  padding: "9px 14px",
                  background: isHi ? "color-mix(in srgb, var(--brand-primary) 6%, transparent)" : "transparent",
                  border: "none", textAlign: "left", cursor: "pointer",
                  fontFamily: "inherit", color: "var(--text-primary)",
                  borderLeft: isHi ? "2px solid var(--brand-primary)" : "2px solid transparent",
                }}
              >
                <span style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: "0.86rem", fontWeight: 600 }}>
                    {it.label}
                    {it.id && <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.74rem", color: "var(--text-muted)", fontWeight: 500, marginLeft: 8 }}>{it.id}</span>}
                  </div>
                  {it.sub && <div style={{ fontSize: "0.78rem", color: "var(--text-secondary)", marginTop: 1 }}>{it.sub}</div>}
                </span>
                {isHi && <LucideIcon name="arrow-right" size={13} color="var(--brand-primary)" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════
// PAGE — dropdown-rich
// ════════════════════════════════════════════════════════════════════════
function DropdownRichPage() {
  const item = (window.AGGIE_CATALOG || []).find(c => c.id === "dropdown-rich");
  return (
    <PageShell item={item}>
      <DCIntro>
        Multiselect dropdown for picking many values from a long, grouped list. Search filters in place, tags chip the current selection (with overflow rolled into a <code>+N more</code> chip), and the popover has Select-all / Clear-all controls. Used for filtering grids, scoping searches, or composing report parameters where ≤ 20 options would feel cramped as radios.
      </DCIntro>

      <DCSectionLabel>Default — pre-selected, grouped, with overflow chip</DCSectionLabel>
      <DCBox label="Districts · 2 of 14 selected">
        <DCFieldLabel htmlFor="dr-1">TxDOT districts</DCFieldLabel>
        <DropdownRich />
      </DCBox>

      <DCSectionLabel>Empty state</DCSectionLabel>
      <DCBox label="Nothing selected · placeholder visible">
        <DCFieldLabel htmlFor="dr-2">TxDOT districts</DCFieldLabel>
        <DropdownRich defaultSelected={[]} />
      </DCBox>

      <DCSectionLabel>Many-selected with overflow</DCSectionLabel>
      <DCBox label="6 selected · 3 visible tags + “+3 more”">
        <DCFieldLabel htmlFor="dr-3">TxDOT districts</DCFieldLabel>
        <DropdownRich defaultSelected={["dist-austin", "dist-houston", "dist-dallas", "dist-san-antonio", "dist-fort-worth", "dist-el-paso"]} />
      </DCBox>

      <DCSpecRow>
        <DCSpec label="Trigger height" value="40px" note="Comfortable. Use --rhythm tokens for dense form (32px)." />
        <DCSpec label="Tag overflow" value="+N more" note="Mono numerals · neutral surface · click expands list" />
        <DCSpec label="Group headers" value="Sticky-style label" note="0.62rem uppercase Work Sans 700, no chevron" />
        <DCSpec label="Focus ring" value="var(--shadow-focus)" note="Two-ring maroon + sand from prelude" />
      </DCSpecRow>
    </PageShell>
  );
}

// ════════════════════════════════════════════════════════════════════════
// PAGE — combobox
// ════════════════════════════════════════════════════════════════════════
function ComboboxPage() {
  const item = (window.AGGIE_CATALOG || []).find(c => c.id === "combobox");
  return (
    <PageShell item={item}>
      <DCIntro>
        Single-select autocomplete for picking from a typed list. Lives on the input itself rather than a separate popover. Three modes: <strong>strict</strong> (must choose from list), <strong>async</strong> (loads suggestions from server with a spinner), <strong>free-text</strong> (accept an arbitrary value if no match). Used for project lookup, person picker, taxonomy assignment. Keyboard navigation throughout.
      </DCIntro>

      <DCSectionLabel>Strict — must choose from list</DCSectionLabel>
      <DCBox label="Default · 8-result listbox · arrow + enter to select">
        <Combobox />
      </DCBox>

      <DCSectionLabel>Async — server-loaded results, with spinner</DCSectionLabel>
      <DCBox label="Type to load · trailing spinner during fetch">
        <Combobox async label="Project lookup (async)" defaultValue="I-35" />
      </DCBox>

      <DCSectionLabel>Free-text — accept arbitrary value</DCSectionLabel>
      <DCBox label="Press Enter on a no-match query to keep the typed value">
        <Combobox allowFreeText label="Custom project id" defaultValue="" placeholder="Type or paste a PRJ-#…" />
      </DCBox>

      <DCSectionLabel>Inline validation — error state</DCSectionLabel>
      <DCBox label="Error message under the input · border + icon swap to error tone">
        <Combobox label="Project lookup" defaultValue="garbage-no-match" error="That isn't a valid project id. Choose from suggestions or paste a PRJ-# beginning with PRJ-." />
      </DCBox>

      <DCSpecRow>
        <DCSpec label="Input height" value="40px" note="Standard density. Dense = 32px." />
        <DCSpec label="Listbox cap" value="8 rows + scroll" note="Past 8, scroll inside the popover" />
        <DCSpec label="Async debounce" value="380ms" note="Matches --motion-slow for spinner-on threshold" />
        <DCSpec label="Keyboard" value="↑ ↓ Enter Esc" note="Arrow keys move highlight; Enter selects; Esc closes" />
      </DCSpecRow>
    </PageShell>
  );
}

window.DropdownRichPage = DropdownRichPage;
window.ComboboxPage     = ComboboxPage;
