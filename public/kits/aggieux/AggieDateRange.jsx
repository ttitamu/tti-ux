/* global React, PageShell, AGGIE_CATALOG, LucideIcon */
/*
 * AggieDateRange.jsx — Batch H part 1.
 *
 * Date range picker: single calendar (compact), dual calendar (default),
 * preset bar (today / 7d / 30d / quarter / FY / custom), and inline-error
 * states. Plus a single-date popover for the simpler case.
 *
 * Anatomy lineage: MUI X Date Range Picker, Material 3 Date Picker.
 * Identity stays TUX: maroon range fill, sand range tint, Work Sans
 * day-of-week labels, JetBrains Mono dates, two-ring focus.
 *
 * Helper prefix: DR.
 */

const { useState: _drUseState, useMemo: _drUseMemo, useRef: _drUseRef, useEffect: _drUseEffect } = React;

// ─── Shared chrome ──────────────────────────────────────────────────────
function DRBox({ label, children, padded = true }) {
  return (
    <div style={{ border: "1px solid var(--surface-border)", borderRadius: "var(--radius-md)", overflow: "hidden", marginBottom: 16 }}>
      <div style={{ padding: "7px 14px", fontSize: "0.62rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--text-muted)", fontFamily: "var(--font-body-bold)", background: "var(--surface-sunken)", borderBottom: "1px solid var(--surface-border)" }}>{label}</div>
      <div style={{ padding: padded ? 28 : 0, background: "var(--surface-page)" }}>{children}</div>
    </div>
  );
}
function DRSectionLabel({ children }) {
  return <div style={{ fontSize: "0.62rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--text-muted)", fontFamily: "var(--font-body-bold)", marginBottom: 12, marginTop: 28 }}>{children}</div>;
}
function DRIntro({ children }) {
  return <div style={{ padding: "16px 20px", marginBottom: 28, background: "color-mix(in srgb, var(--brand-primary) 5%, transparent)", borderLeft: "3px solid var(--brand-primary)", borderRadius: "0 var(--radius-sm) var(--radius-sm) 0", fontSize: "0.92rem", lineHeight: 1.65, color: "var(--text-secondary)" }}>{children}</div>;
}
function DRSpecRow({ children }) {
  return <div style={{ marginTop: 28, padding: "14px 18px", border: "1px solid var(--surface-border)", borderRadius: "var(--radius-md)", background: "var(--surface-raised)", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>{children}</div>;
}
function DRSpec({ label, value, note }) {
  return (
    <div>
      <div style={{ fontSize: "0.6rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-muted)", fontFamily: "var(--font-body-bold)" }}>{label}</div>
      <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem", color: "var(--brand-primary)", marginTop: 3, fontWeight: 500 }}>{value}</div>
      {note && <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: 2, lineHeight: 1.4 }}>{note}</div>}
    </div>
  );
}

// ─── Date math (zero deps) ──────────────────────────────────────────────
const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const DOW = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

function ymd(d) { return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`; }
function parseYmd(s) { const [y, m, d] = s.split("-").map(Number); return new Date(y, m - 1, d); }
function fmtUI(d) { return `${MONTH_NAMES[d.getMonth()].slice(0, 3)} ${d.getDate()}, ${d.getFullYear()}`; }
function sameDay(a, b) { return a && b && ymd(a) === ymd(b); }
function inRange(d, a, b) { if (!a || !b) return false; const t = d.getTime(); return t >= a.getTime() && t <= b.getTime(); }
function addDays(d, n) { const r = new Date(d); r.setDate(r.getDate() + n); return r; }
function addMonths(d, n) { return new Date(d.getFullYear(), d.getMonth() + n, 1); }
function diffDays(a, b) { return Math.round((b - a) / 86400000); }

// ─── A single month grid ────────────────────────────────────────────────
function DRMonthGrid({ year, month, today, start, end, hover, onPickDay, onHover, disabled = (d) => false, minDate, maxDate }) {
  const first = new Date(year, month, 1);
  const startBlank = first.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < startBlank; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div role="grid" style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 1 }}>
      {DOW.map((d) => (
        <div key={d} role="columnheader" style={{ fontSize: "0.62rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--text-muted)", fontFamily: "var(--font-body-bold)", textAlign: "center", padding: "6px 0 8px" }}>
          {d}
        </div>
      ))}
      {cells.map((c, i) => {
        if (!c) return <div key={i} aria-hidden style={{ height: 32 }} />;
        const isToday = sameDay(c, today);
        const isStart = sameDay(c, start);
        const isEnd = sameDay(c, end);
        const isEndpoint = isStart || isEnd;
        const renderRange = start && (end || hover);
        const effEnd = end || hover;
        const lo = renderRange && (start.getTime() <= effEnd.getTime()) ? start : effEnd;
        const hi = renderRange && (start.getTime() <= effEnd.getTime()) ? effEnd : start;
        const inR = renderRange && inRange(c, lo, hi);
        const dis = disabled(c) || (minDate && c < minDate) || (maxDate && c > maxDate);

        let bg = "transparent";
        let color = "var(--text-primary)";
        let weight = 500;
        if (dis) { color = "var(--text-muted)"; }
        else if (isEndpoint) {
          bg = "var(--brand-primary)"; color = "white"; weight = 700;
        }
        else if (inR) {
          bg = "color-mix(in srgb, var(--brand-primary) 9%, transparent)";
          color = "var(--text-primary)";
        }
        else if (isToday) {
          bg = "var(--surface-sunken)";
          weight = 700;
        }

        return (
          <button
            key={i}
            role="gridcell"
            disabled={dis}
            aria-selected={isEndpoint}
            aria-label={fmtUI(c)}
            onClick={() => !dis && onPickDay(c)}
            onMouseEnter={() => !dis && onHover && onHover(c)}
            style={{
              height: 32,
              border: isToday && !isEndpoint ? `1px solid var(--brand-primary)` : "1px solid transparent",
              background: bg,
              color,
              fontFamily: "var(--font-mono)",
              fontWeight: weight,
              fontSize: "0.78rem",
              borderRadius: isEndpoint ? "var(--radius-sm)" : 0,
              cursor: dis ? "not-allowed" : "pointer",
              opacity: dis ? 0.4 : 1,
              padding: 0,
              transition: "background 80ms",
              position: "relative",
            }}
          >
            {c.getDate()}
          </button>
        );
      })}
    </div>
  );
}

function DRMonthHeader({ year, month, onPrev, onNext, hidePrev, hideNext }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
      {!hidePrev ? (
        <button onClick={onPrev} aria-label="Previous month" style={drNavBtn}>
          <LucideIcon name="chevron-left" size={14} />
        </button>
      ) : <span aria-hidden style={{ width: 26 }} />}
      <div style={{ fontFamily: "var(--font-display)", fontSize: "0.95rem", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.04em", color: "var(--text-primary)" }}>
        {MONTH_NAMES[month]} {year}
      </div>
      {!hideNext ? (
        <button onClick={onNext} aria-label="Next month" style={drNavBtn}>
          <LucideIcon name="chevron-right" size={14} />
        </button>
      ) : <span aria-hidden style={{ width: 26 }} />}
    </div>
  );
}
const drNavBtn = { width: 26, height: 26, padding: 0, background: "transparent", border: "1px solid var(--surface-border)", borderRadius: "var(--radius-sm)", color: "var(--text-secondary)", cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center" };

// ─── Preset bar ─────────────────────────────────────────────────────────
const DR_PRESETS = [
  { id: "today",    label: "Today",     fn: (today) => [today, today] },
  { id: "yest",     label: "Yesterday", fn: (today) => { const y = addDays(today, -1); return [y, y]; } },
  { id: "7d",       label: "Last 7 days",  fn: (today) => [addDays(today, -6), today] },
  { id: "30d",      label: "Last 30 days", fn: (today) => [addDays(today, -29), today] },
  { id: "mtd",      label: "Month to date", fn: (today) => [new Date(today.getFullYear(), today.getMonth(), 1), today] },
  { id: "quarter",  label: "Quarter to date", fn: (today) => {
    const qm = Math.floor(today.getMonth() / 3) * 3;
    return [new Date(today.getFullYear(), qm, 1), today];
  }},
  { id: "fy",       label: "FY to date",   fn: (today) => {
    const fyStart = today.getMonth() >= 8 ? today.getFullYear() : today.getFullYear() - 1;
    return [new Date(fyStart, 8, 1), today];
  }},
];

function DRPresetBar({ value, onPick }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 2, padding: "10px 8px", borderRight: "1px solid var(--surface-border)", minWidth: 150 }}>
      <div style={{ fontSize: "0.62rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--text-muted)", fontFamily: "var(--font-body-bold)", padding: "4px 10px 6px" }}>Presets</div>
      {DR_PRESETS.map(p => {
        const active = value === p.id;
        return (
          <button
            key={p.id}
            onClick={() => onPick(p)}
            style={{
              textAlign: "left", padding: "6px 10px",
              background: active ? "color-mix(in srgb, var(--brand-primary) 8%, transparent)" : "transparent",
              borderLeft: active ? "2px solid var(--brand-primary)" : "2px solid transparent",
              border: "none", borderLeft: active ? "2px solid var(--brand-primary)" : "2px solid transparent",
              color: active ? "var(--brand-primary)" : "var(--text-primary)",
              fontFamily: "inherit", fontSize: "0.82rem", fontWeight: active ? 600 : 500,
              cursor: "pointer",
            }}
            onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = "var(--surface-sunken)"; }}
            onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = "transparent"; }}
          >
            {p.label}
          </button>
        );
      })}
    </div>
  );
}

// ─── Dual-month range picker ────────────────────────────────────────────
function DRDualPicker({ defaultStart, defaultEnd, today, withPresets = true }) {
  const [start, setStart] = _drUseState(defaultStart || null);
  const [end, setEnd] = _drUseState(defaultEnd || null);
  const [hover, setHover] = _drUseState(null);
  const [anchor, setAnchor] = _drUseState(addMonths(defaultEnd || today, -1));
  const [preset, setPreset] = _drUseState(null);

  const rightAnchor = addMonths(anchor, 1);

  const onPickDay = (d) => {
    if (!start || (start && end)) { setStart(d); setEnd(null); setHover(null); setPreset(null); return; }
    if (d < start) { setStart(d); setEnd(null); return; }
    setEnd(d); setHover(null);
  };
  const onPreset = (p) => {
    const [s, e] = p.fn(today);
    setStart(s); setEnd(e);
    setAnchor(addMonths(e, -1));
    setPreset(p.id);
  };

  return (
    <div style={{ display: "flex", border: "1px solid var(--surface-border)", borderRadius: "var(--radius-md)", background: "var(--surface-raised)", boxShadow: "var(--elevation-overlay, var(--shadow-lg))", overflow: "hidden", width: "fit-content" }}>
      {withPresets && <DRPresetBar value={preset} onPick={onPreset} />}
      <div style={{ padding: "14px 18px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)", gap: 28 }}>
          <div style={{ width: 232 }}>
            <DRMonthHeader year={anchor.getFullYear()} month={anchor.getMonth()} onPrev={() => setAnchor(addMonths(anchor, -1))} hideNext />
            <DRMonthGrid year={anchor.getFullYear()} month={anchor.getMonth()} today={today} start={start} end={end} hover={hover} onPickDay={onPickDay} onHover={(d) => start && !end && setHover(d)} />
          </div>
          <div style={{ width: 232 }}>
            <DRMonthHeader year={rightAnchor.getFullYear()} month={rightAnchor.getMonth()} onNext={() => setAnchor(addMonths(anchor, 1))} hidePrev />
            <DRMonthGrid year={rightAnchor.getFullYear()} month={rightAnchor.getMonth()} today={today} start={start} end={end} hover={hover} onPickDay={onPickDay} onHover={(d) => start && !end && setHover(d)} />
          </div>
        </div>

        {/* Summary footer */}
        <div style={{ marginTop: 14, paddingTop: 12, borderTop: "1px solid var(--surface-border)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, fontFamily: "var(--font-mono)", fontSize: "0.82rem" }}>
            <span style={drPill}>{start ? fmtUI(start) : "Start"}</span>
            <LucideIcon name="arrow-right" size={12} color="var(--text-muted)" />
            <span style={drPill}>{end ? fmtUI(end) : "End"}</span>
            {start && end && (
              <span style={{ fontFamily: "var(--font-body-bold)", fontWeight: 600, fontSize: "0.78rem", color: "var(--brand-primary)", marginLeft: 4 }}>
                {diffDays(start, end) + 1} {diffDays(start, end) === 0 ? "day" : "days"}
              </span>
            )}
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button style={drBtnGhost} onClick={() => { setStart(null); setEnd(null); setPreset(null); }}>Reset</button>
            <button style={drBtnPrimary}>Apply</button>
          </div>
        </div>
      </div>
    </div>
  );
}
const drPill = { padding: "3px 9px", background: "var(--surface-sunken)", border: "1px solid var(--surface-border)", borderRadius: 3, color: "var(--text-primary)", fontWeight: 500 };
const drBtnGhost = { padding: "7px 14px", background: "transparent", border: "1px solid var(--surface-border)", borderRadius: "var(--radius-sm)", fontFamily: "var(--font-body-bold)", fontWeight: 700, fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.09em", color: "var(--text-primary)", cursor: "pointer" };
const drBtnPrimary = { padding: "7px 14px", background: "var(--brand-primary)", border: "none", borderRadius: "var(--radius-sm)", fontFamily: "var(--font-body-bold)", fontWeight: 700, fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.09em", color: "white", cursor: "pointer" };

// ─── Single-month range picker (compact, popover-friendly) ──────────────
function DRSinglePicker({ defaultStart, defaultEnd, today }) {
  const [start, setStart] = _drUseState(defaultStart || null);
  const [end, setEnd] = _drUseState(defaultEnd || null);
  const [hover, setHover] = _drUseState(null);
  const [anchor, setAnchor] = _drUseState(new Date(today.getFullYear(), today.getMonth(), 1));
  return (
    <div style={{ width: 280, padding: "14px 16px", border: "1px solid var(--surface-border)", borderRadius: "var(--radius-md)", background: "var(--surface-raised)", boxShadow: "var(--elevation-overlay, var(--shadow-lg))" }}>
      <DRMonthHeader year={anchor.getFullYear()} month={anchor.getMonth()} onPrev={() => setAnchor(addMonths(anchor, -1))} onNext={() => setAnchor(addMonths(anchor, 1))} />
      <DRMonthGrid year={anchor.getFullYear()} month={anchor.getMonth()} today={today} start={start} end={end} hover={hover}
        onPickDay={(d) => { if (!start || (start && end)) { setStart(d); setEnd(null); setHover(null); } else if (d < start) { setStart(d); setEnd(null); } else { setEnd(d); setHover(null); } }}
        onHover={(d) => start && !end && setHover(d)}
      />
      <div style={{ marginTop: 10, paddingTop: 10, borderTop: "1px solid var(--surface-border)", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.78rem", color: "var(--text-secondary)" }}>
          {start && end ? `${diffDays(start, end) + 1} days` : start ? "Pick end" : "Pick start"}
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          <button style={drBtnGhost} onClick={() => { setStart(null); setEnd(null); }}>Reset</button>
          <button style={drBtnPrimary}>Apply</button>
        </div>
      </div>
    </div>
  );
}

// ─── Trigger input (popover anchor) ─────────────────────────────────────
function DRTriggerInput({ value, placeholder = "Choose dates…", open, onClick, error }) {
  return (
    <button
      onClick={onClick}
      aria-expanded={open}
      aria-haspopup="dialog"
      style={{
        display: "inline-flex", alignItems: "center", gap: 10,
        padding: "0 12px", height: 40, width: 340,
        border: `1px solid ${error ? "var(--color-error, #B23A3A)" : (open ? "var(--brand-primary)" : "var(--surface-border)")}`,
        borderRadius: "var(--radius-md)",
        background: "var(--surface-raised)",
        boxShadow: open ? "var(--shadow-focus)" : "none",
        color: "var(--text-primary)", fontFamily: "inherit", fontSize: "0.88rem",
        cursor: "pointer",
      }}
    >
      <LucideIcon name="calendar-days" size={14} color="var(--text-muted)" />
      <span style={{ flex: 1, textAlign: "left", color: value ? "var(--text-primary)" : "var(--text-muted)" }}>
        {value || placeholder}
      </span>
      <LucideIcon name="chevron-down" size={13} color="var(--text-muted)" />
    </button>
  );
}

// ─── PAGE ──────────────────────────────────────────────────────────────
function DateRangePickerPage() {
  const item = (window.AGGIE_CATALOG || []).find(c => c.id === "date-range-picker");
  const today = _drUseMemo(() => new Date(2026, 4, 12), []); // May 12, 2026
  const seedStart = _drUseMemo(() => new Date(2026, 3, 1), []); // Apr 1
  const seedEnd = _drUseMemo(() => new Date(2026, 4, 12), []);  // May 12

  return (
    <PageShell item={item}>
      <DRIntro>
        Date range selection for reports, exports, and filters. Default is a dual-calendar with a preset rail; the single-calendar variant is for popovers in dense layouts. Range fill uses a 9% maroon tint; endpoints fill solid maroon. Today is outlined. Preset bar covers the common research cadences: today, last 7/30 days, MTD, QTD, FY-to-date. Lineage: MUI X Date Range Picker, Material 3 Date Picker.
      </DRIntro>

      <DRSectionLabel>Default — dual calendar with preset rail</DRSectionLabel>
      <DRBox label="Apr 1 → May 12, 2026 selected · preset rail on the left">
        <DRDualPicker defaultStart={seedStart} defaultEnd={seedEnd} today={today} />
      </DRBox>

      <DRSectionLabel>Compact — single calendar in a popover</DRSectionLabel>
      <DRBox label="Click trigger to reveal · 280-px popover · for filter rows">
        <DateRangeTriggerDemo today={today} />
      </DRBox>

      <DRSectionLabel>Inline · in a form field (no popover)</DRSectionLabel>
      <DRBox label="When the range is the primary input on the page">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, maxWidth: 720 }}>
          <div>
            <label style={drLabel}>Start date</label>
            <input type="text" defaultValue="2026-04-01" style={drInput} />
          </div>
          <div>
            <label style={drLabel}>End date</label>
            <input type="text" defaultValue="2026-05-12" style={drInput} />
          </div>
        </div>
        <div style={{ marginTop: 18 }}>
          <DRSinglePicker defaultStart={seedStart} defaultEnd={seedEnd} today={today} />
        </div>
      </DRBox>

      <DRSectionLabel>Error state — invalid range</DRSectionLabel>
      <DRBox label="End date precedes start · error message + danger border">
        <DRTriggerInput value="May 12, 2026 → Apr 1, 2026" error />
        <div style={{ marginTop: 8, fontSize: "0.78rem", color: "var(--color-error, #B23A3A)", display: "inline-flex", alignItems: "center", gap: 5 }}>
          <LucideIcon name="alert-circle" size={12} />
          End date must be on or after start date.
        </div>
      </DRBox>

      <DRSpecRow>
        <DRSpec label="Layout" value="dual · single · inline" note="Dual = default; single for popovers; inline for primary inputs" />
        <DRSpec label="Range fill" value="maroon @ 9%" note="Solid maroon at endpoints; sand tint hover preview" />
        <DRSpec label="Presets" value="7 options" note="Today, yesterday, 7d, 30d, MTD, QTD, FY-to-date" />
        <DRSpec label="Locale" value="US default" note="DOW abbreviations + ISO YYYY-MM-DD in inputs" />
      </DRSpecRow>
    </PageShell>
  );
}

function DateRangeTriggerDemo({ today }) {
  const [open, setOpen] = _drUseState(false);
  const [start, setStart] = _drUseState(new Date(2026, 3, 1));
  const [end, setEnd] = _drUseState(new Date(2026, 4, 12));
  const wrap = _drUseRef(null);
  _drUseEffect(() => {
    function onDoc(e) { if (wrap.current && !wrap.current.contains(e.target)) setOpen(false); }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);
  const display = start && end ? `${fmtUI(start)} → ${fmtUI(end)}` : null;
  return (
    <div ref={wrap} style={{ display: "inline-block", position: "relative" }}>
      <DRTriggerInput value={display} open={open} onClick={() => setOpen(o => !o)} />
      {open && (
        <div style={{ position: "absolute", top: "calc(100% + 4px)", left: 0, zIndex: 20 }}>
          <DRSinglePicker defaultStart={start} defaultEnd={end} today={today} />
        </div>
      )}
    </div>
  );
}

const drLabel = { display: "block", fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-primary)", fontFamily: "var(--font-body-bold)", marginBottom: 6 };
const drInput = { height: 40, padding: "0 12px", width: "100%", border: "1px solid var(--surface-border)", borderRadius: "var(--radius-md)", background: "var(--surface-raised)", fontFamily: "var(--font-mono)", fontSize: "0.86rem", color: "var(--text-primary)", outline: "none", boxSizing: "border-box" };

window.DateRangePickerPage = DateRangePickerPage;
