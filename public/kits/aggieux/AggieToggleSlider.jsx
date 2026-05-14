/* global React, PageShell, AGGIE_CATALOG, LucideIcon */
/*
 * AggieToggleSlider.jsx — INF-1 batch: new TUX components.
 *
 *   Switch — binary toggle for settings & preferences (vs. checkbox, which is
 *            for "select among items"). Distinct from radio-group (one of N).
 *   Slider — continuous range input for filters, threshold-setting,
 *            confidence intervals. Single-thumb + dual-thumb (range) variants.
 *
 * Lineage (INF-1):
 *   • Switch — anatomy informed by Microsoft Fluent 2 Web Switch (3 frames).
 *              Fluent ships a 56×36 hit-area with a 40×20 track + 14×14
 *              thumb. TUX keeps the proportions but uses maroon for the
 *              "on" track (vs. Fluent's brand blue) and adds a "compact"
 *              32×16 size for dense data tables.
 *   • Slider — anatomy informed by Fluent 2 Web Slider (2 frames). 4px
 *              rail, 18×18 thumb with a 12×12 brand inner dot, white
 *              border ring. TUX adds: discrete tick marks, dual-thumb
 *              range mode, on-rail value badge for fine-grained controls.
 *
 * Identity stays TUX: maroon brand, two-ring focus on thumb, Work Sans 700
 * caps for the surrounding label, JetBrains Mono for values. Never lift
 * Segoe UI or Fluent blue.
 *
 * Helper prefix: TG (Toggle). Local helpers — never import a generic
 * SectionLabel/Box/Spec from another batch (Babel scope collisions).
 */

// ════════════════════════════════════════════════════════════════════════
// Shared helpers (TG prefix)
// ════════════════════════════════════════════════════════════════════════

function TGBox({ dark = false, label, padded = true, children }) {
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
      <div style={{ padding: padded ? 32 : 0, background: dark ? "var(--brand-primary)" : "var(--surface-page)" }}>{children}</div>
    </div>
  );
}

function TGSectionLabel({ children }) {
  return (
    <h3 style={{
      fontFamily: "var(--font-body)", fontSize: "0.72rem", fontWeight: 600, textTransform: "lowercase",
      letterSpacing: "0.10em", color: "var(--text-muted)", margin: "32px 0 12px",
    }}>{children}</h3>
  );
}

function TGSpecRow({ children }) {
  return (
    <div style={{ marginTop: 28, padding: "14px 18px", border: "1px solid var(--surface-border)", borderRadius: "var(--radius-md)", background: "var(--surface-raised)", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: 18 }}>
      {children}
    </div>
  );
}

function TGSpec({ label, value, note }) {
  return (
    <div>
      <div style={{ fontFamily: "var(--font-body-bold)", fontSize: "0.6rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--text-muted)", marginBottom: 4 }}>{label}</div>
      <div style={{ fontFamily: "var(--font-mono)", fontWeight: 500, fontSize: "0.82rem", color: "var(--text-primary)", marginBottom: 4 }}>{value}</div>
      {note ? <div style={{ fontFamily: "var(--font-body)", fontSize: "0.74rem", color: "var(--text-muted)", lineHeight: 1.4 }}>{note}</div> : null}
    </div>
  );
}

function TGIntro({ children }) {
  return (
    <div style={{ borderLeft: "3px solid var(--brand-primary)", padding: "8px 16px", margin: "0 0 28px", background: "var(--surface-raised)", borderRadius: "0 var(--radius-sm) var(--radius-sm) 0" }}>
      <p style={{ margin: 0, fontFamily: "var(--font-body)", fontSize: "0.9rem", lineHeight: 1.55, color: "var(--text-primary)", maxWidth: 760 }}>{children}</p>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════
// SWITCH primitive
// ════════════════════════════════════════════════════════════════════════

const SWITCH_SIZES = {
  sm: { trackW: 32, trackH: 16, thumb: 12, pad: 6 },
  md: { trackW: 40, trackH: 20, thumb: 14, pad: 8 },
};

function Switch({ checked = false, onChange, size = "md", disabled = false, dark = false, label, description, labelPos = "after" }) {
  const dim = SWITCH_SIZES[size];
  const offTrack = dark ? "rgba(255,255,255,0.22)" : "var(--surface-border-strong, #B5B0AB)";
  const onTrack = disabled
    ? (dark ? "rgba(221,172,55,0.45)" : "rgba(92,0,37,0.45)")
    : (dark ? "var(--brand-accent)" : "var(--brand-primary)");

  const trackEl = (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-disabled={disabled}
      disabled={disabled}
      onClick={() => !disabled && onChange?.(!checked)}
      style={{
        position: "relative",
        width: dim.trackW,
        height: dim.trackH,
        background: checked ? onTrack : offTrack,
        borderRadius: 9999,
        border: "none",
        padding: 0,
        cursor: disabled ? "not-allowed" : "pointer",
        transition: "background-color 160ms ease-out",
        flexShrink: 0,
        outline: "none",
      }}
      onFocus={(e) => { e.currentTarget.style.boxShadow = `0 0 0 2px ${dark ? "var(--brand-primary)" : "#FFFFFF"}, 0 0 0 4px var(--brand-accent)`; }}
      onBlur={(e) => { e.currentTarget.style.boxShadow = "none"; }}
    >
      <span style={{
        position: "absolute",
        top: (dim.trackH - dim.thumb) / 2,
        left: checked ? dim.trackW - dim.thumb - (dim.trackH - dim.thumb) / 2 : (dim.trackH - dim.thumb) / 2,
        width: dim.thumb,
        height: dim.thumb,
        background: "#FFFFFF",
        borderRadius: "50%",
        transition: "left 180ms cubic-bezier(0.4,0,0.2,1)",
        boxShadow: "0 1px 2px rgba(0,0,0,0.18)",
      }} />
    </button>
  );

  if (!label) return trackEl;

  const labelEl = (
    <div style={{ minWidth: 0, opacity: disabled ? 0.55 : 1 }}>
      <div style={{
        fontFamily: "var(--font-body-bold)", fontWeight: 700, fontSize: "0.78rem",
        letterSpacing: "0.04em",
        color: dark ? "rgba(255,255,255,0.92)" : "var(--text-primary)",
        cursor: disabled ? "not-allowed" : "pointer",
      }} onClick={() => !disabled && onChange?.(!checked)}>{label}</div>
      {description ? <div style={{
        fontFamily: "var(--font-body)", fontSize: "0.78rem",
        color: dark ? "rgba(255,255,255,0.7)" : "var(--text-muted)",
        marginTop: 2, lineHeight: 1.4, maxWidth: 360,
      }}>{description}</div> : null}
    </div>
  );

  return (
    <label style={{
      display: "inline-flex", alignItems: description ? "flex-start" : "center", gap: 12,
      cursor: disabled ? "not-allowed" : "pointer",
    }}>
      {labelPos === "before" ? labelEl : null}
      <span style={{ marginTop: description ? 2 : 0 }}>{trackEl}</span>
      {labelPos === "after" ? labelEl : null}
    </label>
  );
}

// Controlled wrapper for demos
function SwitchDemo(props) {
  const [on, setOn] = React.useState(props.initial ?? false);
  return <Switch {...props} checked={on} onChange={setOn} />;
}

// ════════════════════════════════════════════════════════════════════════
// SLIDER primitive
// ════════════════════════════════════════════════════════════════════════

function Slider({ value = 50, onChange, min = 0, max = 100, step = 1, ticks, showValue = false, dark = false, disabled = false, ariaLabel = "Slider" }) {
  const trackRef = React.useRef(null);
  const v = Math.max(min, Math.min(max, value));
  const pct = ((v - min) / (max - min)) * 100;
  const railBg = dark ? "rgba(255,255,255,0.16)" : "var(--surface-sunken-strong, #E5DFD7)";
  const fillBg = disabled
    ? (dark ? "rgba(221,172,55,0.45)" : "rgba(92,0,37,0.4)")
    : (dark ? "var(--brand-accent)" : "var(--brand-primary)");

  const handleMove = (clientX) => {
    if (!trackRef.current || disabled) return;
    const rect = trackRef.current.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const raw = min + ratio * (max - min);
    const snapped = Math.round(raw / step) * step;
    onChange?.(Math.max(min, Math.min(max, snapped)));
  };

  const onPointerDown = (e) => {
    if (disabled) return;
    handleMove(e.clientX);
    const onMove = (ev) => handleMove(ev.clientX);
    const onUp = () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  };

  return (
    <div style={{ position: "relative", width: "100%", padding: "10px 0", opacity: disabled ? 0.55 : 1, cursor: disabled ? "not-allowed" : "pointer" }}>
      <div ref={trackRef}
        onPointerDown={onPointerDown}
        style={{
          position: "relative", height: 4, background: railBg, borderRadius: 2,
        }}>
        <div style={{
          position: "absolute", left: 0, top: 0, height: "100%",
          width: `${pct}%`, background: fillBg, borderRadius: 2,
          transition: "width 80ms linear",
        }} />
        {ticks ? ticks.map((t) => {
          const tpct = ((t - min) / (max - min)) * 100;
          const reached = t <= v;
          return (
            <span key={t} style={{
              position: "absolute", top: "50%", left: `${tpct}%`,
              transform: "translate(-50%, -50%)",
              width: 4, height: 4, borderRadius: "50%",
              background: reached ? (dark ? "rgba(255,255,255,0.85)" : "#FFFFFF") : (dark ? "rgba(255,255,255,0.45)" : "var(--text-muted)"),
              border: reached ? "none" : "1px solid var(--surface-page)",
              pointerEvents: "none",
            }} />
          );
        }) : null}
        <div role="slider"
          aria-valuemin={min} aria-valuemax={max} aria-valuenow={v}
          aria-label={ariaLabel}
          aria-disabled={disabled}
          tabIndex={disabled ? -1 : 0}
          onKeyDown={(e) => {
            if (disabled) return;
            if (e.key === "ArrowRight" || e.key === "ArrowUp") onChange?.(Math.min(max, v + step));
            if (e.key === "ArrowLeft"  || e.key === "ArrowDown") onChange?.(Math.max(min, v - step));
            if (e.key === "Home") onChange?.(min);
            if (e.key === "End")  onChange?.(max);
          }}
          onFocus={(e) => { e.currentTarget.style.boxShadow = `0 0 0 2px ${dark ? "var(--brand-primary)" : "#FFFFFF"}, 0 0 0 4px var(--brand-accent)`; }}
          onBlur={(e) => { e.currentTarget.style.boxShadow = "0 1px 2px rgba(0,0,0,0.18)"; }}
          style={{
            position: "absolute", left: `${pct}%`, top: "50%",
            transform: "translate(-50%, -50%)",
            width: 18, height: 18, borderRadius: "50%",
            background: "#FFFFFF",
            border: dark ? "1px solid rgba(255,255,255,0.6)" : "1px solid var(--surface-border-strong, #B5B0AB)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 1px 2px rgba(0,0,0,0.18)",
            outline: "none",
            cursor: disabled ? "not-allowed" : "grab",
          }}>
          <span style={{
            width: 8, height: 8, borderRadius: "50%",
            background: fillBg,
          }} />
        </div>
      </div>
      {showValue ? (
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12 }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: dark ? "rgba(255,255,255,0.7)" : "var(--text-muted)", fontVariantNumeric: "tabular-nums" }}>{min}</span>
          <span style={{ fontFamily: "var(--font-mono)", fontWeight: 500, fontSize: "0.92rem", color: dark ? "var(--brand-accent)" : "var(--brand-primary)", fontVariantNumeric: "tabular-nums" }}>{v}</span>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: dark ? "rgba(255,255,255,0.7)" : "var(--text-muted)", fontVariantNumeric: "tabular-nums" }}>{max}</span>
        </div>
      ) : null}
    </div>
  );
}

function RangeSlider({ values = [25, 75], onChange, min = 0, max = 100, step = 1, dark = false, format = (v) => v }) {
  const trackRef = React.useRef(null);
  const [drag, setDrag] = React.useState(null); // 'lo' | 'hi' | null
  const [lo, hi] = [Math.min(...values), Math.max(...values)];
  const loPct = ((lo - min) / (max - min)) * 100;
  const hiPct = ((hi - min) / (max - min)) * 100;
  const railBg = dark ? "rgba(255,255,255,0.16)" : "var(--surface-sunken-strong, #E5DFD7)";
  const fillBg = dark ? "var(--brand-accent)" : "var(--brand-primary)";

  const setValue = (which, val) => {
    const snapped = Math.round(val / step) * step;
    const clamped = Math.max(min, Math.min(max, snapped));
    if (which === "lo") onChange?.([Math.min(clamped, hi), hi]);
    else onChange?.([lo, Math.max(clamped, lo)]);
  };

  const startDrag = (which) => (e) => {
    e.stopPropagation();
    setDrag(which);
    const onMove = (ev) => {
      if (!trackRef.current) return;
      const rect = trackRef.current.getBoundingClientRect();
      const ratio = Math.max(0, Math.min(1, (ev.clientX - rect.left) / rect.width));
      setValue(which, min + ratio * (max - min));
    };
    const onUp = () => {
      setDrag(null);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  };

  return (
    <div style={{ width: "100%", padding: "10px 0" }}>
      <div ref={trackRef} style={{ position: "relative", height: 4, background: railBg, borderRadius: 2 }}>
        <div style={{
          position: "absolute", left: `${loPct}%`, width: `${hiPct - loPct}%`,
          top: 0, height: "100%", background: fillBg, borderRadius: 2,
        }} />
        {[
          { which: "lo", pct: loPct, value: lo },
          { which: "hi", pct: hiPct, value: hi },
        ].map(({ which, pct, value }) => (
          <div key={which} role="slider"
            aria-valuemin={min} aria-valuemax={max} aria-valuenow={value}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "ArrowRight" || e.key === "ArrowUp")   setValue(which, value + step);
              if (e.key === "ArrowLeft"  || e.key === "ArrowDown") setValue(which, value - step);
            }}
            onPointerDown={startDrag(which)}
            onFocus={(e) => { e.currentTarget.style.boxShadow = `0 0 0 2px ${dark ? "var(--brand-primary)" : "#FFFFFF"}, 0 0 0 4px var(--brand-accent)`; }}
            onBlur={(e) => { e.currentTarget.style.boxShadow = "0 1px 2px rgba(0,0,0,0.18)"; }}
            style={{
              position: "absolute", left: `${pct}%`, top: "50%",
              transform: "translate(-50%, -50%)",
              width: 18, height: 18, borderRadius: "50%",
              background: "#FFFFFF",
              border: dark ? "1px solid rgba(255,255,255,0.6)" : "1px solid var(--surface-border-strong, #B5B0AB)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 1px 2px rgba(0,0,0,0.18)",
              outline: "none", cursor: drag === which ? "grabbing" : "grab",
              zIndex: drag === which ? 2 : 1,
            }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: fillBg }} />
          </div>
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12 }}>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: dark ? "rgba(255,255,255,0.7)" : "var(--text-muted)", fontVariantNumeric: "tabular-nums" }}>{format(min)}</span>
        <span style={{ fontFamily: "var(--font-mono)", fontWeight: 500, fontSize: "0.88rem", color: dark ? "var(--brand-accent)" : "var(--brand-primary)", fontVariantNumeric: "tabular-nums" }}>{format(lo)} – {format(hi)}</span>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: dark ? "rgba(255,255,255,0.7)" : "var(--text-muted)", fontVariantNumeric: "tabular-nums" }}>{format(max)}</span>
      </div>
    </div>
  );
}

function SliderDemo(props) {
  const [v, setV] = React.useState(props.initial ?? 50);
  return <Slider {...props} value={v} onChange={setV} />;
}

function RangeSliderDemo(props) {
  const [vals, setVals] = React.useState(props.initialValues ?? [25, 75]);
  return <RangeSlider {...props} values={vals} onChange={setVals} />;
}

// ════════════════════════════════════════════════════════════════════════
// SWITCH PAGE
// ════════════════════════════════════════════════════════════════════════

function SwitchPage() {
  const item = (window.AGGIE_CATALOG || []).find(c => c.id === "switch");
  return (
    <PageShell item={item}>
      <TGIntro>
        Binary toggle for settings, preferences, and feature flags. Switch
        encodes a state change that takes effect <em>immediately</em>;
        checkbox encodes intent that's confirmed later. Use switch when
        the user is configuring a behavior (auto-save, dark mode, notifications);
        use checkbox when they're selecting items in a form.
      </TGIntro>

      <TGSectionLabel>1 · States — off · on · disabled</TGSectionLabel>
      <TGBox label="medium size · no label">
        <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
          <SwitchDemo />
          <SwitchDemo initial={true} />
          <Switch checked={false} disabled />
          <Switch checked={true}  disabled />
        </div>
      </TGBox>

      <TGSectionLabel>2 · Sizes — sm (data tables) · md (default)</TGSectionLabel>
      <TGBox label="two density tiers">
        <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
          <SwitchDemo size="sm" />
          <SwitchDemo size="sm" initial={true} />
          <SwitchDemo size="md" />
          <SwitchDemo size="md" initial={true} />
        </div>
      </TGBox>

      <TGSectionLabel>3 · With label — settings-row pattern</TGSectionLabel>
      <TGBox label="label-after (default) + description">
        <div style={{ display: "flex", flexDirection: "column", gap: 18, maxWidth: 480 }}>
          <SwitchDemo initial={true}  label="Auto-save"     description="Save edits every 10 seconds while you're working." />
          <SwitchDemo initial={false} label="Email digest"  description="Weekly summary of corridor activity, every Monday." />
          <SwitchDemo initial={true}  label="Show advisory tier in maps" />
          <Switch checked={false} disabled label="External data sources" description="Available on the enterprise plan." />
        </div>
      </TGBox>

      <TGSectionLabel>4 · Label-before — right-aligned settings list</TGSectionLabel>
      <TGBox label="label on the left · switch on the right">
        <div style={{ display: "flex", flexDirection: "column", gap: 14, maxWidth: 480 }}>
          {[
            ["Auto-save changes", true],
            ["Show grid", true],
            ["Snap to milepost", false],
            ["Display ID column", true],
          ].map(([label, on]) => (
            <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid var(--surface-border)" }}>
              <span style={{ fontFamily: "var(--font-body)", fontSize: "0.92rem", color: "var(--text-primary)" }}>{label}</span>
              <SwitchDemo initial={on} />
            </div>
          ))}
        </div>
      </TGBox>

      <TGSectionLabel>5 · On dark — settings panel within a maroon shell</TGSectionLabel>
      <TGBox dark label="three settings rows · on dark">
        <div style={{ display: "flex", flexDirection: "column", gap: 18, maxWidth: 480 }}>
          <SwitchDemo dark initial={true}  label="Auto-save"     description="Save edits every 10 seconds." />
          <SwitchDemo dark initial={false} label="Email digest"  description="Weekly summary of corridor activity." />
          <SwitchDemo dark initial={true}  label="Show advisories" />
        </div>
      </TGBox>

      <TGSpecRow>
        <TGSpec label="Sizes"      value="sm 32×16 · md 40×20"   note="md is default; sm is for table rows + dense settings." />
        <TGSpec label="Thumb"      value="12 / 14px · white"     note="1px shadow; slides 180ms cubic-bezier." />
        <TGSpec label="Track-on"   value="brand-primary"         note="Maroon on light, gold on dark." />
        <TGSpec label="Track-off"  value="border-strong"         note="Warm-neutral gray; white @ 22% on dark." />
        <TGSpec label="Focus"      value="two-ring"              note="2px page-color + 2px gold — TUX two-ring spec." />
        <TGSpec label="Lineage"    value="Fluent 2 Web Switch"   note="Anatomy only · TUX type and maroon." />
      </TGSpecRow>
    </PageShell>
  );
}

// ════════════════════════════════════════════════════════════════════════
// SLIDER PAGE
// ════════════════════════════════════════════════════════════════════════

function SliderPage() {
  const item = (window.AGGIE_CATALOG || []).find(c => c.id === "slider");
  return (
    <PageShell item={item}>
      <TGIntro>
        Continuous range input for filters, threshold setting, and confidence
        tuning. Single-thumb selects one value; <strong>range</strong> selects
        an interval (min — max). Discrete ticks turn it into a step picker.
        For text-numeric input use <code>form-text</code> (number) or{" "}
        <code>spin-button</code> when one exists; reach for a slider when the
        user wants to <em>feel</em> the magnitude.
      </TGIntro>

      <TGSectionLabel>1 · Single-thumb — basic, with value, with ticks</TGSectionLabel>
      <TGBox label="three modes">
        <div style={{ display: "flex", flexDirection: "column", gap: 28, maxWidth: 480 }}>
          <div>
            <Label>Speed limit · default</Label>
            <SliderDemo initial={55} min={0} max={75} step={5} />
          </div>
          <div>
            <Label>Confidence threshold</Label>
            <SliderDemo initial={70} min={0} max={100} step={1} showValue />
          </div>
          <div>
            <Label>Severity tier · discrete steps</Label>
            <SliderDemo initial={3} min={1} max={5} step={1} ticks={[1,2,3,4,5]} showValue />
          </div>
        </div>
      </TGBox>

      <TGSectionLabel>2 · Range — dual-thumb interval picker</TGSectionLabel>
      <TGBox label="filter by year range · price range · severity">
        <div style={{ display: "flex", flexDirection: "column", gap: 28, maxWidth: 480 }}>
          <div>
            <Label>Year range · filter</Label>
            <RangeSliderDemo initialValues={[2018, 2024]} min={2010} max={2026} step={1} />
          </div>
          <div>
            <Label>Project budget · USD</Label>
            <RangeSliderDemo initialValues={[150, 750]} min={0} max={1000} step={25} format={(v) => `$${v}k`} />
          </div>
          <div>
            <Label>AADT threshold</Label>
            <RangeSliderDemo initialValues={[15000, 45000]} min={0} max={80000} step={1000} format={(v) => `${(v/1000)|0}k`} />
          </div>
        </div>
      </TGBox>

      <TGSectionLabel>3 · Disabled — read-only context</TGSectionLabel>
      <TGBox label="surface-locked or unavailable on plan">
        <div style={{ maxWidth: 480 }}>
          <Label>Sample period · locked at 30 days</Label>
          <Slider value={30} min={0} max={180} disabled showValue />
        </div>
      </TGBox>

      <TGSectionLabel>4 · On dark</TGSectionLabel>
      <TGBox dark label="single + range · on dark">
        <div style={{ display: "flex", flexDirection: "column", gap: 28, maxWidth: 480 }}>
          <div>
            <Label dark>Confidence threshold</Label>
            <SliderDemo dark initial={70} min={0} max={100} step={1} showValue />
          </div>
          <div>
            <Label dark>Year range</Label>
            <RangeSliderDemo dark initialValues={[2018, 2024]} min={2010} max={2026} step={1} />
          </div>
        </div>
      </TGBox>

      <TGSpecRow>
        <TGSpec label="Rail"     value="4px · 2px radius"        note="surface-sunken-strong on light; white @ 16% on dark." />
        <TGSpec label="Thumb"    value="18×18 · white + dot"     note="1px gray border, 8×8 brand inner dot, 1px shadow." />
        <TGSpec label="Step"     value="prop · default 1"        note="Round-to-step on drag and arrow-key." />
        <TGSpec label="Ticks"    value="optional · 4×4 dots"     note="Filled where reached; outlined ahead." />
        <TGSpec label="Range"    value="dual-thumb · clamped"    note="Lower thumb can't pass upper; ARIA on both." />
        <TGSpec label="Lineage"  value="Fluent 2 Web Slider"     note="Anatomy only · TUX type and maroon." />
      </TGSpecRow>
    </PageShell>
  );
}

function Label({ children, dark = false }) {
  return (
    <div style={{
      fontFamily: "var(--font-body-bold)", fontWeight: 700, fontSize: "0.72rem",
      textTransform: "uppercase", letterSpacing: "0.10em",
      color: dark ? "rgba(255,255,255,0.85)" : "var(--text-muted)",
      marginBottom: 6,
    }}>{children}</div>
  );
}

// ════════════════════════════════════════════════════════════════════════
// Export to window
// ════════════════════════════════════════════════════════════════════════

window.SwitchPage = SwitchPage;
window.SliderPage = SliderPage;
