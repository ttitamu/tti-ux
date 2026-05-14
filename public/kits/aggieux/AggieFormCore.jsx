/* global React, PageShell, AGGIE_CATALOG, LucideIcon */
/*
 * AggieFormCore.jsx — Batch 21 part 1:
 *   Text inputs · Select & combobox · Choice (radio + checkbox)
 *
 * Form primitives. Buttons + form controls remain Work Sans 700 uppercase
 * regardless of style variant. Forms here are style-neutral — only the labels
 * above them respond to default/bold/elegant rule treatment.
 *
 * Helper prefix: FC.
 */

const { useState: _fcUseState, useRef: _fcUseRef, useEffect: _fcUseEffect } = React;

// ════════════════════════════════════════════════════════════════════════
// Shared helpers (FC prefix)
// ════════════════════════════════════════════════════════════════════════

function FCBox({ label, children, padded = true }) {
  return (
    <div style={{ border: "1px solid var(--surface-border)", borderRadius: "var(--radius-md)", overflow: "hidden", marginBottom: 16 }}>
      <div style={{
        padding: "7px 14px", fontSize: "0.62rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em",
        color: "var(--text-muted)", fontFamily: "var(--font-body-bold)",
        background: "var(--surface-sunken)", borderBottom: "1px solid var(--surface-border)",
      }}>{label}</div>
      <div style={{ padding: padded ? 28 : 0, background: "var(--surface-page)" }}>{children}</div>
    </div>
  );
}

function FCSectionLabel({ children }) {
  return <div style={{ fontSize: "0.62rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--text-muted)", fontFamily: "var(--font-body-bold)", marginBottom: 12, marginTop: 16 }}>{children}</div>;
}

function FCSpecRow({ children }) {
  return <div style={{ marginTop: 28, padding: "14px 18px", border: "1px solid var(--surface-border)", borderRadius: "var(--radius-md)", background: "var(--surface-raised)", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16 }}>{children}</div>;
}

function FCSpec({ label, value, note }) {
  return (
    <div>
      <div style={{ fontSize: "0.6rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-muted)", fontFamily: "var(--font-body-bold)" }}>{label}</div>
      <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem", color: "var(--brand-primary)", marginTop: 3, fontWeight: 500 }}>{value}</div>
      {note && <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: 2, lineHeight: 1.4 }}>{note}</div>}
    </div>
  );
}

function FCIntro({ children }) {
  return <div style={{ padding: "16px 20px", marginBottom: 28, background: "color-mix(in srgb, var(--brand-primary) 5%, transparent)", borderLeft: "3px solid var(--brand-primary)", borderRadius: "0 var(--radius-sm) var(--radius-sm) 0", fontSize: "0.92rem", lineHeight: 1.65, color: "var(--text-secondary)" }}>{children}</div>;
}

// Field label — uppercase Work Sans, with optional required asterisk
function FieldLabel({ children, required, htmlFor, hint }) {
  return (
    <label htmlFor={htmlFor} style={{ display: "block", fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-primary)", fontFamily: "var(--font-body-bold)", marginBottom: 6 }}>
      {children}
      {required && <span aria-hidden style={{ color: "var(--color-danger)", marginLeft: 4 }}>*</span>}
      {hint && <span style={{ marginLeft: 8, color: "var(--text-muted)", fontWeight: 500, textTransform: "none", letterSpacing: 0, fontFamily: "var(--font-body)", fontStyle: "italic" }}>{hint}</span>}
    </label>
  );
}

function HelpText({ children }) {
  return <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: 6, lineHeight: 1.45 }}>{children}</div>;
}

function FieldGrid({ children, cols = 1 }) {
  return <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 18 }}>{children}</div>;
}

// ════════════════════════════════════════════════════════════════════════
// Shared input shell — common border / focus / size / state styles
// ════════════════════════════════════════════════════════════════════════

const FIELD_HEIGHT = { sm: 32, md: 40 };
const FIELD_PADDING = { sm: "0 10px", md: "0 12px" };
const FIELD_FONT = { sm: "0.82rem", md: "0.92rem" };

function fieldShellStyle({ size = "md", state = "default", focused, disabled }) {
  const base = {
    height: FIELD_HEIGHT[size],
    fontSize: FIELD_FONT[size],
    fontFamily: "var(--font-body)",
    padding: FIELD_PADDING[size],
    border: "1px solid var(--surface-border)",
    borderRadius: 3,
    background: disabled ? "var(--surface-sunken)" : "var(--surface-page)",
    color: disabled ? "var(--text-muted)" : "var(--text-primary)",
    outline: "none",
    transition: "border-color 0.12s ease, box-shadow 0.12s ease",
    width: "100%",
    boxSizing: "border-box",
  };
  if (state === "error") {
    base.borderColor = "var(--color-danger)";
    if (focused) base.boxShadow = "0 0 0 3px color-mix(in srgb, var(--color-danger) 18%, transparent)";
  } else if (state === "success") {
    base.borderColor = "var(--color-success)";
  } else if (focused) {
    base.borderColor = "var(--brand-primary)";
    base.boxShadow = "0 0 0 3px color-mix(in srgb, var(--brand-primary) 18%, transparent)";
  }
  return base;
}

// ════════════════════════════════════════════════════════════════════════
// 1 — Text input
// ════════════════════════════════════════════════════════════════════════

function TextField({
  id, label, type = "text", value, onChange, placeholder, helpText,
  size = "md", state = "default", required, disabled, hint,
  leadingIcon, trailingIcon, prefix, suffix, error, success,
  showCounter, maxLength,
  ...rest
}) {
  const [focused, setFocused] = _fcUseState(false);
  const realState = error ? "error" : success ? "success" : state;
  const showStatus = error || success;
  return (
    <div>
      {label && <FieldLabel htmlFor={id} required={required} hint={hint}>{label}</FieldLabel>}
      <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
        {prefix && (
          <span style={{
            display: "inline-flex", alignItems: "center", height: FIELD_HEIGHT[size], padding: "0 10px",
            fontSize: FIELD_FONT[size], fontFamily: "var(--font-mono)", color: "var(--text-muted)",
            background: "var(--surface-sunken)", border: "1px solid var(--surface-border)",
            borderRight: "none", borderRadius: "3px 0 0 3px",
          }}>{prefix}</span>
        )}
        {leadingIcon && (
          <span style={{ position: "absolute", left: prefix ? "auto" : 11, color: "var(--text-muted)", display: "flex", alignItems: "center", pointerEvents: "none" }}>
            <LucideIcon name={leadingIcon} size={size === "sm" ? 14 : 16} />
          </span>
        )}
        <input
          id={id}
          type={type}
          value={value ?? ""}
          onChange={onChange}
          placeholder={placeholder}
          maxLength={maxLength}
          disabled={disabled}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            ...fieldShellStyle({ size, state: realState, focused, disabled }),
            paddingLeft: leadingIcon ? (size === "sm" ? 30 : 36) : (prefix ? 10 : FIELD_PADDING[size].split(" ")[1]),
            paddingRight: (trailingIcon || showStatus) ? (size === "sm" ? 30 : 36) : (suffix ? 10 : FIELD_PADDING[size].split(" ")[1]),
            borderRadius: prefix ? "0 3px 3px 0" : suffix ? "3px 0 0 3px" : 3,
          }}
          {...rest}
        />
        {trailingIcon && !showStatus && (
          <span style={{ position: "absolute", right: suffix ? "auto" : 11, color: "var(--text-muted)", display: "flex", alignItems: "center", pointerEvents: "none" }}>
            <LucideIcon name={trailingIcon} size={size === "sm" ? 14 : 16} />
          </span>
        )}
        {showStatus && (
          <span style={{ position: "absolute", right: 11, color: error ? "var(--color-danger)" : "var(--color-success)", display: "flex", alignItems: "center", pointerEvents: "none" }}>
            <LucideIcon name={error ? "alert-circle" : "check-circle"} size={size === "sm" ? 14 : 16} />
          </span>
        )}
        {suffix && (
          <span style={{
            display: "inline-flex", alignItems: "center", height: FIELD_HEIGHT[size], padding: "0 10px",
            fontSize: FIELD_FONT[size], fontFamily: "var(--font-mono)", color: "var(--text-muted)",
            background: "var(--surface-sunken)", border: "1px solid var(--surface-border)",
            borderLeft: "none", borderRadius: "0 3px 3px 0",
          }}>{suffix}</span>
        )}
      </div>
      {(error || helpText || showCounter) && (
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, gap: 8 }}>
          {error ? (
            <div style={{ fontSize: "0.78rem", color: "var(--color-danger)", lineHeight: 1.45, display: "inline-flex", alignItems: "center", gap: 5 }}>
              <LucideIcon name="alert-circle" size={13} /> {error}
            </div>
          ) : helpText ? (
            <HelpText>{helpText}</HelpText>
          ) : <div />}
          {showCounter && maxLength && (
            <div style={{ fontSize: "0.72rem", fontFamily: "var(--font-mono)", color: (value?.length || 0) > maxLength * 0.9 ? "var(--color-warning)" : "var(--text-muted)", flexShrink: 0 }}>
              {(value?.length || 0)} / {maxLength}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function TextareaField({ id, label, value, onChange, placeholder, helpText, rows = 4, required, hint, error, showCounter, maxLength }) {
  const [focused, setFocused] = _fcUseState(false);
  return (
    <div>
      {label && <FieldLabel htmlFor={id} required={required} hint={hint}>{label}</FieldLabel>}
      <textarea
        id={id} value={value ?? ""} onChange={onChange} placeholder={placeholder} rows={rows} maxLength={maxLength}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        style={{
          ...fieldShellStyle({ size: "md", state: error ? "error" : "default", focused }),
          height: "auto", padding: "10px 12px", lineHeight: 1.5, resize: "vertical",
        }}
      />
      {(error || helpText || showCounter) && (
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, gap: 8 }}>
          {error ? <div style={{ fontSize: "0.78rem", color: "var(--color-danger)", display: "inline-flex", alignItems: "center", gap: 5 }}><LucideIcon name="alert-circle" size={13} />{error}</div> : helpText ? <HelpText>{helpText}</HelpText> : <div />}
          {showCounter && maxLength && (
            <div style={{ fontSize: "0.72rem", fontFamily: "var(--font-mono)", color: "var(--text-muted)" }}>{(value?.length || 0)} / {maxLength}</div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── FloatingLabelField — Bootstrap floating-label pattern ──────────────
// Lineage: Bootstrap 5 Design System Floating-labels (INF-4.5b).
// The label sits inside the input at rest, then translates up + shrinks when
// the field is focused or has a value. Used as a "compact label" variant of
// `form-text` — saves a row of vertical space because the label lives inside
// the input. Reach for it on settings rows and high-density form panels;
// keep the canonical labeled TextField for public-facing or accessibility-
// critical forms (separate <label> still wins on screen-reader clarity).
function FloatingLabelField({ id, label, type = "text", value, onChange, success, error, helpText, hint, required, disabled, multiline, rows = 3 }) {
  const [focused, setFocused] = _fcUseState(false);
  const filled = value != null && String(value).length > 0;
  const stateColor =
    error   ? "var(--color-error)" :
    success ? "var(--color-success)" :
    focused ? "var(--brand-primary)" :
    "var(--surface-border)";
  const ringColor =
    error   ? "color-mix(in srgb, var(--color-error) 18%, transparent)" :
    "color-mix(in srgb, var(--brand-primary) 18%, transparent)";

  const floated = focused || filled;
  const InputTag = multiline ? "textarea" : "input";
  const inputBaseStyle = {
    width: "100%",
    height: multiline ? "auto" : 56,
    minHeight: multiline ? rows * 22 + 28 : undefined,
    padding: multiline ? "22px 14px 8px" : "20px 14px 6px",
    border: "none",
    background: "transparent",
    outline: "none",
    fontFamily: "var(--font-body)",
    fontSize: "0.94rem",
    color: disabled ? "var(--text-muted)" : "var(--text-primary)",
    resize: multiline ? "vertical" : "none",
    lineHeight: 1.4,
  };

  return (
    <div>
      <div style={{
        position: "relative",
        background: disabled ? "var(--surface-sunken)" : "#FFFFFF",
        border: `1px solid ${stateColor}`,
        borderRadius: "var(--radius-sm)",
        boxShadow: focused ? `0 0 0 3px ${ringColor}` : "none",
        transition: "box-shadow 100ms ease, border-color 100ms ease",
      }}>
        <InputTag
          id={id}
          type={multiline ? undefined : type}
          value={value ?? ""}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          disabled={disabled}
          placeholder=" "
          rows={multiline ? rows : undefined}
          style={inputBaseStyle}
        />
        <label htmlFor={id} style={{
          position: "absolute",
          left: 14,
          top: floated ? 8  : (multiline ? 18 : "50%"),
          transform: floated ? "scale(0.78)" : (multiline ? "scale(1)" : "translateY(-50%) scale(1)"),
          transformOrigin: "left top",
          color: floated
            ? (error ? "var(--color-error)" : (focused ? "var(--brand-primary)" : "var(--text-muted)"))
            : "var(--text-muted)",
          fontFamily: "var(--font-body)",
          fontSize: "0.94rem",
          fontWeight: floated ? 700 : 400,
          letterSpacing: floated ? "0.06em" : 0,
          textTransform: floated ? "uppercase" : "none",
          pointerEvents: "none",
          transition: "top 120ms ease-out, transform 120ms ease-out, color 100ms ease, font-weight 100ms ease",
        }}>
          {label}{required ? <span style={{ color: "var(--color-error)", marginLeft: 3 }}>*</span> : null}
        </label>
      </div>
      {(error || helpText || hint) ? (
        <div style={{ marginTop: 6, display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12 }}>
          {error ? (
            <div style={{ fontSize: "0.78rem", color: "var(--color-error)", lineHeight: 1.45 }}>{error}</div>
          ) : (
            <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", lineHeight: 1.45 }}>{helpText}</div>
          )}
          {hint ? <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: "var(--text-muted)" }}>{hint}</div> : null}
        </div>
      ) : null}
    </div>
  );
}

function FormTextPage() {
  const item = AGGIE_CATALOG.find(c => c.id === "form-text");
  const [name, setName] = _fcUseState("Park, Junseo");
  const [email, setEmail] = _fcUseState("");
  const [phone, setPhone] = _fcUseState("");
  const [search, setSearch] = _fcUseState("connected vehicles");
  const [pwd, setPwd] = _fcUseState("hunter2");
  const [showPwd, setShowPwd] = _fcUseState(false);
  const [bio, setBio] = _fcUseState("Researcher in connected mobility, sensor fusion, and corridor-level safety analytics.");
  const [num, setNum] = _fcUseState(28000);

  return (
    <PageShell item={item}>
      <FCIntro>
        Text inputs across the type spectrum. Every field has the same border / focus ring / size scale; the difference is only in the icon, prefix/suffix, or input-mode. Helper text sits below; error replaces helper. Char counter aligns right.
      </FCIntro>

      <FCSectionLabel>Type variations — same shell, different inputs</FCSectionLabel>
      <FCBox label="basic types: text · email · phone · number — md size">
        <FieldGrid cols={2}>
          <TextField id="t-name" label="Full name" value={name} onChange={(e) => setName(e.target.value)} required />
          <TextField id="t-email" label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@tamu.edu" leadingIcon="mail" />
          <TextField id="t-phone" label="Phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="(555) 555-0123" leadingIcon="phone" />
          <TextField id="t-num" label="Award amount" type="number" value={num} onChange={(e) => setNum(e.target.value)} prefix="USD" suffix=".00" />
        </FieldGrid>
      </FCBox>

      <FCBox label="search · password · with helper text">
        <FieldGrid cols={2}>
          <TextField id="t-search" label="Search publications" type="search" value={search} onChange={(e) => setSearch(e.target.value)} leadingIcon="search" trailingIcon="x" placeholder="Title, author, keyword" />
          <TextField
            id="t-pwd" label="Password" type={showPwd ? "text" : "password"}
            value={pwd} onChange={(e) => setPwd(e.target.value)}
            leadingIcon="lock"
            trailingIcon={showPwd ? "eye-off" : "eye"}
            helpText="At least 12 characters with mixed case and a number."
          />
        </FieldGrid>
      </FCBox>

      <FCSectionLabel>Sizes — sm and md</FCSectionLabel>
      <FCBox label="md (default) for most forms · sm for dense filter rows">
        <FieldGrid cols={2}>
          <TextField id="t-md" label="md — default" placeholder="height 40px" />
          <TextField id="t-sm" label="sm — dense" size="sm" placeholder="height 32px" />
        </FieldGrid>
      </FCBox>

      <FCSectionLabel>States — focus · error · success · disabled · with counter</FCSectionLabel>
      <FCBox label="every text input shares one state model">
        <FieldGrid cols={2}>
          <TextField id="t-err" label="With error" value="not-an-email" onChange={() => {}} error="Enter a valid email address." />
          <TextField id="t-ok" label="With success" value="park.junseo@tamu.edu" onChange={() => {}} success />
          <TextField id="t-dis" label="Disabled" value="Cannot edit" disabled />
          <TextField id="t-cnt" label="With counter" value={search} onChange={(e) => setSearch(e.target.value)} maxLength={60} showCounter helpText="Search across 1,400 indexed publications." />
        </FieldGrid>
      </FCBox>

      <FCSectionLabel>Textarea — for long-form input</FCSectionLabel>
      <FCBox label="multi-line with counter and helper">
        <TextareaField id="t-bio" label="Researcher bio" value={bio} onChange={(e) => setBio(e.target.value)} maxLength={400} showCounter rows={4} helpText="Will appear on your faculty profile and publication pages." />
      </FCBox>

      <FCSectionLabel>Refit · Compact density for dense forms (Batch G)</FCSectionLabel>
      <FCBox label="32px inputs · 0.68rem labels · matches field-grid compact tier">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", rowGap: "var(--rhythm-normal, 12px)", columnGap: "var(--rhythm-loose, 16px)" }}>
          <TextField id="td-id"    size="sm" label="Project ID" value="PRJ-2841" onChange={() => {}} />
          <TextField id="td-dist"  size="sm" label="District"   value="Austin"   onChange={() => {}} />
          <TextField id="td-lead"  size="sm" label="Lead"       value="L. Whitfield" onChange={() => {}} />
          <TextField id="td-bud"   size="sm" label="Budget"     value="482.0"   onChange={() => {}} prefix="USD" suffix="M" />
          <TextField id="td-start" size="sm" label="Started"    value="2024-03-12" onChange={() => {}} />
          <TextField id="td-end"   size="sm" label="Target"     value="2026-08-31" onChange={() => {}} />
        </div>
        <div style={{ marginTop: 14, padding: "10px 14px", background: "var(--surface-sunken)", borderRadius: 3, fontSize: "0.78rem", color: "var(--text-muted)", lineHeight: 1.55 }}>
          Pairs with <code>field-grid</code>'s <strong>compact</strong> density tier. Use for inventory edit, row-inline edit, audit forms with 20+ fields. Avoid for public-facing forms — 32px hit targets are keyboard/precision-mouse only.
        </div>
      </FCBox>

      <FCSectionLabel>Floating labels · Bootstrap-anatomy (INF-4.5b)</FCSectionLabel>
      <div style={{ padding: "12px 16px", marginBottom: 14, background: "color-mix(in srgb, var(--brand-accent) 12%, transparent)", borderRadius: "var(--radius-sm)", fontSize: "0.84rem", lineHeight: 1.5, color: "var(--text-secondary)" }}>
        Label sits inside the input at rest; floats up + shrinks + uppercases
        on focus or when filled. Saves a row of vertical space — reach for
        this on settings rows and high-density form panels. Keep the canonical
        labeled <code>TextField</code> for public-facing or accessibility-critical
        forms (separate <code>&lt;label&gt;</code> still wins on screen-reader clarity).
      </div>
      <FCBox label="float-label · empty (rest) · focused / filled · validation states · textarea">
        <FieldGrid cols={2}>
          <FloatingLabelField id="fl-name"  label="Full name" value="" onChange={() => {}} />
          <FloatingLabelField id="fl-email" label="Email"     value={email || "you@tamu.edu"} onChange={(e) => setEmail(e.target.value)} type="email" helpText="Required for password reset." />
          <FloatingLabelField id="fl-err"   label="Department" value="N/A" onChange={() => {}} error="Choose a TAMUS member department." />
          <FloatingLabelField id="fl-ok"    label="ORCID iD"   value="0000-0002-1825-0097" onChange={() => {}} success helpText="Verified · 2 hours ago" />
          <FloatingLabelField id="fl-dis"   label="Faculty ID" value="A02841" onChange={() => {}} disabled />
          <FloatingLabelField id="fl-req"   label="Lead PI"    value="" onChange={() => {}} required />
        </FieldGrid>
        <div style={{ marginTop: 14 }}>
          <FloatingLabelField id="fl-area" label="Abstract" value={bio} onChange={(e) => setBio(e.target.value)} multiline rows={3} helpText="Will appear on the publication detail page." />
        </div>
      </FCBox>

      <FCSpecRow>
        <FCSpec label="height"     value="32 / 40 px" note="sm fits dense filter bars; md is the default for forms." />
        <FCSpec label="focus ring" value="3px brand@18%" note="Replaces ring with danger@18% on error states." />
        <FCSpec label="prefix/suffix" value="sunken slab" note="Mono font, --surface-sunken bg. Borders merge with the input." />
        <FCSpec label="status icon" value="trailing" note="alert-circle (error) or check-circle (success). Replaces trailingIcon." />
        <FCSpec label="floating label" value="56h · top:8 / scale 0.78" note="Lineage: Bootstrap 5 DS Floating-labels. Compact-label alternative to canonical TextField." />
      </FCSpecRow>
    </PageShell>
  );
}

// ════════════════════════════════════════════════════════════════════════
// 2 — Select & Combobox
// ════════════════════════════════════════════════════════════════════════

function NativeSelect({ id, label, value, onChange, options, required, hint, error, helpText, size = "md" }) {
  const [focused, setFocused] = _fcUseState(false);
  return (
    <div>
      {label && <FieldLabel htmlFor={id} required={required} hint={hint}>{label}</FieldLabel>}
      <div style={{ position: "relative" }}>
        <select id={id} value={value} onChange={onChange} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          style={{
            ...fieldShellStyle({ size, state: error ? "error" : "default", focused }),
            appearance: "none", paddingRight: 36, cursor: "pointer",
          }}
        >
          {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <span style={{ position: "absolute", right: 11, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", pointerEvents: "none", display: "flex" }}>
          <LucideIcon name="chevron-down" size={size === "sm" ? 14 : 16} />
        </span>
      </div>
      {(error || helpText) && (
        error ? <div style={{ fontSize: "0.78rem", color: "var(--color-danger)", marginTop: 6, display: "inline-flex", alignItems: "center", gap: 5 }}><LucideIcon name="alert-circle" size={13} />{error}</div> : <HelpText>{helpText}</HelpText>
      )}
    </div>
  );
}

function CustomListbox({ id, label, value, onChange, options, required, hint, helpText }) {
  const [open, setOpen] = _fcUseState(false);
  const [hilite, setHilite] = _fcUseState(0);
  const buttonRef = _fcUseRef(null);
  _fcUseEffect(() => {
    if (!open) return;
    const onDoc = (e) => { if (buttonRef.current && !buttonRef.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);
  const sel = options.find(o => o.value === value) || options[0];

  return (
    <div ref={buttonRef}>
      {label && <FieldLabel htmlFor={id} required={required} hint={hint}>{label}</FieldLabel>}
      <div style={{ position: "relative" }}>
        <button
          id={id} type="button"
          aria-haspopup="listbox" aria-expanded={open}
          onClick={() => setOpen(!open)}
          style={{
            ...fieldShellStyle({ size: "md", focused: open }),
            display: "flex", alignItems: "center", justifyContent: "space-between",
            cursor: "pointer", textAlign: "left",
          }}
        >
          <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {sel.icon && <span style={{ color: "var(--text-muted)", display: "flex" }}><LucideIcon name={sel.icon} size={16} /></span>}
            <span>{sel.label}</span>
          </span>
          <span style={{ color: "var(--text-muted)", display: "flex" }}><LucideIcon name="chevron-down" size={16} /></span>
        </button>
        {open && (
          <ul role="listbox" style={{
            position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0,
            background: "var(--surface-page)", border: "1px solid var(--surface-border)", borderRadius: 3,
            boxShadow: "0 10px 30px -8px rgba(0,0,0,0.18)", zIndex: 30,
            margin: 0, padding: 4, listStyle: "none", maxHeight: 280, overflowY: "auto",
          }}>
            {options.map((o, i) => {
              const active = o.value === value;
              const focused = i === hilite;
              return (
                <li
                  key={o.value} role="option" aria-selected={active}
                  onMouseEnter={() => setHilite(i)}
                  onClick={() => { onChange(o.value); setOpen(false); }}
                  style={{
                    padding: "8px 12px", display: "flex", alignItems: "center", gap: 10, cursor: "pointer",
                    background: focused ? "color-mix(in srgb, var(--brand-primary) 8%, transparent)" : "transparent",
                    fontSize: "0.88rem", color: "var(--text-primary)",
                  }}
                >
                  {o.icon && <span style={{ color: "var(--text-muted)", display: "flex" }}><LucideIcon name={o.icon} size={15} /></span>}
                  <span style={{ flex: 1 }}>{o.label}</span>
                  {active && <span style={{ color: "var(--brand-primary)", display: "flex" }}><LucideIcon name="check" size={15} /></span>}
                </li>
              );
            })}
          </ul>
        )}
      </div>
      {helpText && <HelpText>{helpText}</HelpText>}
    </div>
  );
}

function MultiSelect({ id, label, values, onChange, options, helpText }) {
  const [open, setOpen] = _fcUseState(false);
  const ref = _fcUseRef(null);
  _fcUseEffect(() => {
    const onDoc = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);
  const toggle = (v) => onChange(values.includes(v) ? values.filter(x => x !== v) : [...values, v]);
  const selected = options.filter(o => values.includes(o.value));

  return (
    <div ref={ref}>
      {label && <FieldLabel htmlFor={id}>{label}</FieldLabel>}
      <div style={{ position: "relative" }}>
        <div onClick={() => setOpen(!open)} style={{
          ...fieldShellStyle({ size: "md", focused: open }),
          height: "auto", minHeight: 40, padding: "5px 36px 5px 8px",
          display: "flex", flexWrap: "wrap", gap: 5, alignItems: "center", cursor: "pointer",
        }}>
          {selected.length === 0 ? (
            <span style={{ color: "var(--text-muted)", padding: "0 4px" }}>Select one or more…</span>
          ) : selected.map(s => (
            <span key={s.value} style={{
              display: "inline-flex", alignItems: "center", gap: 4,
              padding: "3px 8px", background: "color-mix(in srgb, var(--brand-primary) 9%, transparent)",
              border: "1px solid color-mix(in srgb, var(--brand-primary) 30%, transparent)",
              color: "var(--brand-primary)",
              fontSize: "0.78rem", fontFamily: "var(--font-body-bold)", fontWeight: 600,
            }}>
              {s.label}
              <span onClick={(e) => { e.stopPropagation(); toggle(s.value); }} style={{ display: "inline-flex", cursor: "pointer", opacity: 0.75 }}>
                <LucideIcon name="x" size={12} />
              </span>
            </span>
          ))}
          <span style={{ position: "absolute", right: 11, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", display: "flex", pointerEvents: "none" }}>
            <LucideIcon name="chevron-down" size={16} />
          </span>
        </div>
        {open && (
          <ul style={{
            position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0,
            background: "var(--surface-page)", border: "1px solid var(--surface-border)", borderRadius: 3,
            boxShadow: "0 10px 30px -8px rgba(0,0,0,0.18)", zIndex: 30,
            margin: 0, padding: 4, listStyle: "none", maxHeight: 280, overflowY: "auto",
          }}>
            {options.map(o => {
              const checked = values.includes(o.value);
              return (
                <li key={o.value} onClick={() => toggle(o.value)} style={{
                  padding: "8px 12px", display: "flex", alignItems: "center", gap: 10, cursor: "pointer",
                  fontSize: "0.88rem", color: "var(--text-primary)",
                }}>
                  <span style={{
                    width: 14, height: 14, border: "1.5px solid var(--surface-border)", borderRadius: 2,
                    background: checked ? "var(--brand-primary)" : "var(--surface-page)",
                    borderColor: checked ? "var(--brand-primary)" : "var(--surface-border)",
                    display: "inline-flex", alignItems: "center", justifyContent: "center", color: "#FFF", flexShrink: 0,
                  }}>
                    {checked && <LucideIcon name="check" size={11} />}
                  </span>
                  <span>{o.label}</span>
                </li>
              );
            })}
          </ul>
        )}
      </div>
      {helpText && <HelpText>{helpText}</HelpText>}
    </div>
  );
}

function Combobox({ id, label, value, onChange, options, helpText, async: isAsync }) {
  const [query, setQuery] = _fcUseState(value || "");
  const [open, setOpen] = _fcUseState(false);
  const [loading, setLoading] = _fcUseState(false);
  const ref = _fcUseRef(null);
  _fcUseEffect(() => {
    const onDoc = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);
  _fcUseEffect(() => {
    if (!isAsync || !open) return;
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(t);
  }, [open, query, isAsync]);

  // Group results by `group` if present
  const filtered = options.filter(o => o.label.toLowerCase().includes(query.toLowerCase()));
  const groups = filtered.reduce((acc, o) => {
    const g = o.group || "";
    if (!acc[g]) acc[g] = [];
    acc[g].push(o);
    return acc;
  }, {});

  return (
    <div ref={ref}>
      {label && <FieldLabel htmlFor={id}>{label}</FieldLabel>}
      <div style={{ position: "relative" }}>
        <TextField
          id={id} value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          leadingIcon="search"
          placeholder="Type to search…"
        />
        {open && (
          <div style={{
            position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0,
            background: "var(--surface-page)", border: "1px solid var(--surface-border)", borderRadius: 3,
            boxShadow: "0 10px 30px -8px rgba(0,0,0,0.18)", zIndex: 30,
            padding: 4, maxHeight: 320, overflowY: "auto",
          }}>
            {loading ? (
              <div style={{ padding: "16px 12px", textAlign: "center", color: "var(--text-muted)", fontSize: "0.85rem", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                <span style={{ width: 12, height: 12, border: "2px solid var(--surface-border)", borderTopColor: "var(--brand-primary)", borderRadius: "50%", animation: "tux-spin 0.8s linear infinite" }} />
                Loading suggestions…
              </div>
            ) : filtered.length === 0 ? (
              <div style={{ padding: "16px 12px", color: "var(--text-muted)", fontSize: "0.85rem" }}>No matches for "{query}".</div>
            ) : (
              Object.entries(groups).map(([group, items]) => (
                <div key={group}>
                  {group && (
                    <div style={{ padding: "8px 10px 4px", fontSize: "0.6rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--text-muted)", fontFamily: "var(--font-body-bold)" }}>
                      {group}
                    </div>
                  )}
                  {items.map(o => (
                    <div key={o.value} onClick={() => { onChange(o.value); setQuery(o.label); setOpen(false); }}
                      style={{ padding: "7px 12px", cursor: "pointer", fontSize: "0.86rem", color: "var(--text-primary)" }}
                      onMouseEnter={(e) => e.currentTarget.style.background = "color-mix(in srgb, var(--brand-primary) 8%, transparent)"}
                      onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                    >
                      <div>{o.label}</div>
                      {o.sub && <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>{o.sub}</div>}
                    </div>
                  ))}
                </div>
              ))
            )}
          </div>
        )}
      </div>
      {helpText && <HelpText>{helpText}</HelpText>}
    </div>
  );
}

function FormSelectPage() {
  const item = AGGIE_CATALOG.find(c => c.id === "form-select");
  const [country, setCountry] = _fcUseState("us");
  const [center, setCenter] = _fcUseState("ttip");
  const [tags, setTags] = _fcUseState(["mobility", "infrastructure"]);
  const [author, setAuthor] = _fcUseState("");

  const centerOptions = [
    { value: "ttip", label: "TTI Policy", icon: "landmark" },
    { value: "ttim", label: "Mobility Division", icon: "car" },
    { value: "ttis", label: "Safety Division", icon: "shield" },
    { value: "ttif", label: "Freight Mobility", icon: "truck" },
    { value: "ttiy", label: "Youth Transportation", icon: "graduation-cap" },
  ];
  const tagOptions = [
    { value: "mobility", label: "Connected mobility" },
    { value: "infrastructure", label: "Infrastructure" },
    { value: "safety", label: "Roadway safety" },
    { value: "policy", label: "Policy & equity" },
    { value: "freight", label: "Freight" },
  ];
  const authorOptions = [
    { value: "park",    label: "Park, Junseo",     sub: "Mobility Division — connected vehicles", group: "Faculty" },
    { value: "resendiz", label: "Reséndiz, Adriana", sub: "Mobility Division — sensor fusion", group: "Faculty" },
    { value: "patel",   label: "Patel, Karan",     sub: "Safety Division — pedestrian crash analytics", group: "Faculty" },
    { value: "tan",     label: "Tan, Mei",         sub: "Doctoral candidate — pavement", group: "Doctoral" },
    { value: "garcia",  label: "García, Lucia",    sub: "Doctoral candidate — equity-in-mobility", group: "Doctoral" },
  ];

  return (
    <PageShell item={item}>
      <FCIntro>
        Four select patterns. <strong>Native</strong> for OS-aligned single choice in dense forms. <strong>Custom listbox</strong> when options need icons or rich rendering. <strong>Multi-select</strong> shows applied chips inline. <strong>Combobox</strong> filters as you type, with grouped results and an async loading state.
      </FCIntro>

      <FCSectionLabel>Native select — OS-aligned</FCSectionLabel>
      <FCBox label="for short option lists in dense forms">
        <FieldGrid cols={2}>
          <NativeSelect id="s-country" label="Country" value={country} onChange={(e) => setCountry(e.target.value)} options={[
            { value: "us", label: "United States" }, { value: "ca", label: "Canada" }, { value: "mx", label: "Mexico" }, { value: "other", label: "Other" },
          ]} required />
          <NativeSelect id="s-state" label="State" value="tx" onChange={() => {}} options={[
            { value: "tx", label: "Texas" }, { value: "ok", label: "Oklahoma" }, { value: "la", label: "Louisiana" }, { value: "nm", label: "New Mexico" },
          ]} helpText="Defaults to Texas — most TTI work." />
        </FieldGrid>
      </FCBox>

      <FCSectionLabel>Custom listbox — for icons / rich rendering</FCSectionLabel>
      <FCBox label="when option labels need an icon or extra structure">
        <FieldGrid cols={2}>
          <CustomListbox id="s-center" label="TTI division" value={center} onChange={setCenter} options={centerOptions} required helpText="Where this work product is housed." />
          <CustomListbox id="s-priority" label="Priority" value="medium" onChange={() => {}} options={[
            { value: "high", label: "High", icon: "alert-triangle" },
            { value: "medium", label: "Medium", icon: "circle-dot" },
            { value: "low", label: "Low", icon: "circle" },
          ]} />
        </FieldGrid>
      </FCBox>

      <FCSectionLabel>Multi-select — applied as inline chips</FCSectionLabel>
      <FCBox label="users keep adding/removing without leaving the field">
        <MultiSelect id="s-tags" label="Research tags" values={tags} onChange={setTags} options={tagOptions} helpText="Tag this publication for indexing. Used by the search facets." />
      </FCBox>

      <FCSectionLabel>Combobox — filterable + async + grouped</FCSectionLabel>
      <FCBox label="search a long, structured list with grouped results">
        <Combobox id="s-author" label="Co-author" value={author} onChange={setAuthor} options={authorOptions} async helpText="Type to search the directory. Async; loads in 800ms." />
      </FCBox>

      <FCSectionLabel>Refit · Compact density for dense pickers (Batch G)</FCSectionLabel>
      <FCBox label="32px selects + chip-strip · pairs with field-grid compact tier">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", rowGap: "var(--rhythm-normal, 12px)", columnGap: "var(--rhythm-loose, 16px)" }}>
          <NativeSelect id="sd-tier" size="sm" label="Compliance tier" value="internal" onChange={() => {}}
            options={[{ value: "public", label: "public" }, { value: "internal", label: "internal" }, { value: "restricted", label: "restricted" }, { value: "itar", label: "ITAR / export-controlled" }]}
          />
          <NativeSelect id="sd-phase" size="sm" label="Phase" value="construction" onChange={() => {}}
            options={[{ value: "scoping", label: "scoping" }, { value: "design", label: "design" }, { value: "letting", label: "letting" }, { value: "construction", label: "construction" }, { value: "closeout", label: "closeout" }]}
          />
        </div>
        <div style={{ marginTop: 14, padding: "10px 14px", background: "var(--surface-sunken)", borderRadius: 3, fontSize: "0.78rem", color: "var(--text-muted)", lineHeight: 1.55 }}>
          For dense filter rows on grids, audit forms, and bulk-edit drawers. Use <code>dropdown-rich</code> when the picker is multiselect with ≥ 8 options; use <code>combobox</code> when free-text search matters.
        </div>
      </FCBox>

      <FCSpecRow>
        <FCSpec label="native"   value="<select>" note="Single choice, no icons, OS-rendered listbox. Cheapest." />
        <FCSpec label="listbox"  value="aria-listbox" note="Custom rendering inside dropdown. Use only when options need icons or sub-text." />
        <FCSpec label="multi"    value="chip-strip" note="Selected items render as removable chips inside the field. Submits as an array." />
        <FCSpec label="combobox" value="autocomplete" note="Free-text filter on top of an option list. Group items by `group` key; async support built in." />
      </FCSpecRow>
    </PageShell>
  );
}

// ════════════════════════════════════════════════════════════════════════
// 3 — Choice (radio + checkbox)
// ════════════════════════════════════════════════════════════════════════

function Radio({ id, name, value, label, sub, checked, onChange }) {
  return (
    <label htmlFor={id} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "10px 0", cursor: "pointer" }}>
      <input type="radio" id={id} name={name} value={value} checked={checked} onChange={onChange} style={{
        appearance: "none", width: 18, height: 18, borderRadius: "50%", border: "2px solid var(--surface-border)",
        background: "var(--surface-page)", margin: "1px 0 0", flexShrink: 0, cursor: "pointer", position: "relative",
        outline: "none", borderColor: checked ? "var(--brand-primary)" : "var(--surface-border)",
      }} />
      <span style={{ position: "absolute", display: checked ? "block" : "none", marginLeft: 5, marginTop: 6, width: 8, height: 8, borderRadius: "50%", background: "var(--brand-primary)", pointerEvents: "none" }} />
      <span>
        <span style={{ fontSize: "0.92rem", color: "var(--text-primary)", fontWeight: 500, fontFamily: "var(--font-body)" }}>{label}</span>
        {sub && <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: 2, lineHeight: 1.45 }}>{sub}</div>}
      </span>
    </label>
  );
}

function Checkbox({ id, label, sub, checked, indeterminate, onChange }) {
  const ref = _fcUseRef(null);
  _fcUseEffect(() => { if (ref.current) ref.current.indeterminate = !!indeterminate; }, [indeterminate]);
  return (
    <label htmlFor={id} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "8px 0", cursor: "pointer" }}>
      <span style={{
        width: 18, height: 18, border: "1.5px solid", borderRadius: 3,
        background: (checked || indeterminate) ? "var(--brand-primary)" : "var(--surface-page)",
        borderColor: (checked || indeterminate) ? "var(--brand-primary)" : "var(--surface-border)",
        display: "inline-flex", alignItems: "center", justifyContent: "center", color: "#FFF",
        flexShrink: 0, marginTop: 1, position: "relative",
      }}>
        {checked && !indeterminate && <LucideIcon name="check" size={13} />}
        {indeterminate && <span style={{ width: 8, height: 2, background: "#FFF" }} />}
      </span>
      <input ref={ref} type="checkbox" id={id} checked={checked || false} onChange={onChange} style={{ position: "absolute", opacity: 0, pointerEvents: "none" }} />
      <span>
        <span style={{ fontSize: "0.92rem", color: "var(--text-primary)", fontWeight: 500, fontFamily: "var(--font-body)" }}>{label}</span>
        {sub && <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: 2, lineHeight: 1.45 }}>{sub}</div>}
      </span>
    </label>
  );
}

// Card-style choice — large hit target, used for plan / role / option pickers
function ChoiceCard({ value, name, checked, onChange, label, body, icon, type = "radio" }) {
  return (
    <label style={{
      display: "block", border: "1.5px solid", borderColor: checked ? "var(--brand-primary)" : "var(--surface-border)",
      background: checked ? "color-mix(in srgb, var(--brand-primary) 4%, var(--surface-page))" : "var(--surface-page)",
      borderRadius: "var(--radius-md)", padding: 16, cursor: "pointer", position: "relative",
      transition: "border-color 0.12s, background 0.12s",
    }}>
      <input type={type} name={name} value={value} checked={checked} onChange={onChange} style={{ position: "absolute", opacity: 0, pointerEvents: "none" }} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          {icon && <div style={{ color: "var(--brand-primary)", marginBottom: 8 }}><LucideIcon name={icon} size={20} /></div>}
          <div style={{ fontFamily: "var(--font-body-bold)", fontWeight: 700, fontSize: "0.95rem", color: "var(--text-primary)", marginBottom: 4 }}>{label}</div>
          {body && <div style={{ fontSize: "0.82rem", lineHeight: 1.5, color: "var(--text-secondary)" }}>{body}</div>}
        </div>
        <span style={{
          width: 18, height: 18, borderRadius: type === "radio" ? "50%" : 3,
          border: "1.5px solid", borderColor: checked ? "var(--brand-primary)" : "var(--surface-border)",
          background: checked ? "var(--brand-primary)" : "var(--surface-page)",
          display: "inline-flex", alignItems: "center", justifyContent: "center", color: "#FFF", flexShrink: 0,
        }}>
          {checked && type === "checkbox" && <LucideIcon name="check" size={11} />}
          {checked && type === "radio" && <span style={{ width: 8, height: 8, background: "#FFF", borderRadius: "50%" }} />}
        </span>
      </div>
    </label>
  );
}

function FormChoicePage() {
  const item = AGGIE_CATALOG.find(c => c.id === "form-choice");
  const [audience, setAudience] = _fcUseState("internal");
  const [perms, setPerms] = _fcUseState({ read: true, write: false, admin: false });
  const [plan, setPlan] = _fcUseState("research");
  const [tools, setTools] = _fcUseState({ analytics: true, telemetry: false, mapping: true });

  // Indeterminate parent demo
  const totalSubs = 3;
  const checkedSubs = Object.values(perms).filter(Boolean).length;
  const parentChecked = checkedSubs === totalSubs;
  const parentIndet = checkedSubs > 0 && checkedSubs < totalSubs;

  return (
    <PageShell item={item}>
      <FCIntro>
        Single-select radios and multi-select checkboxes share one visual model. Both have a flat list, a stacked card variant, and an indeterminate parent + nested children pattern. All hit targets are ≥ 18px visual + 44px row click zone.
      </FCIntro>

      <FCSectionLabel>Radio group — single-select</FCSectionLabel>
      <FCBox label="flat list with optional sub-line">
        <FieldLabel>Audience</FieldLabel>
        <Radio id="r-int" name="audience" value="internal" label="Internal — TTI staff & faculty only" sub="Default. Visible across the staff intranet." checked={audience === "internal"} onChange={() => setAudience("internal")} />
        <Radio id="r-tamus" name="audience" value="tamus" label="Texas A&M System" sub="Staff at any TAMUS member institution." checked={audience === "tamus"} onChange={() => setAudience("tamus")} />
        <Radio id="r-pub" name="audience" value="public" label="Public" sub="Anyone with the link, including non-TAMU users." checked={audience === "public"} onChange={() => setAudience("public")} />
      </FCBox>

      <FCSectionLabel>Checkbox group — multi-select with indeterminate parent</FCSectionLabel>
      <FCBox label="parent reflects mixed state of children">
        <FieldLabel>Permissions</FieldLabel>
        <Checkbox
          id="c-all"
          label="All permissions"
          checked={parentChecked}
          indeterminate={parentIndet}
          onChange={() => {
            const next = !parentChecked;
            setPerms({ read: next, write: next, admin: next });
          }}
        />
        <div style={{ paddingLeft: 28 }}>
          <Checkbox id="c-r" label="Read" sub="View this project's data and outputs." checked={perms.read} onChange={() => setPerms(p => ({ ...p, read: !p.read }))} />
          <Checkbox id="c-w" label="Write" sub="Add or modify records." checked={perms.write} onChange={() => setPerms(p => ({ ...p, write: !p.write }))} />
          <Checkbox id="c-a" label="Admin" sub="Manage members and project settings." checked={perms.admin} onChange={() => setPerms(p => ({ ...p, admin: !p.admin }))} />
        </div>
      </FCBox>

      <FCSectionLabel>Choice cards — radio · large hit targets</FCSectionLabel>
      <FCBox label="for plan / role / mode pickers — visual emphasis on the choice">
        <FieldLabel required>Project type</FieldLabel>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
          <ChoiceCard name="plan" value="research" icon="microscope" label="Research" body="Multi-year, peer-reviewed output. Maps to a TRR-style publication track." checked={plan === "research"} onChange={() => setPlan("research")} />
          <ChoiceCard name="plan" value="implementation" icon="hammer" label="Implementation" body="Direct delivery to a transportation agency. Reports, training, deployment support." checked={plan === "implementation"} onChange={() => setPlan("implementation")} />
          <ChoiceCard name="plan" value="advisory" icon="message-circle" label="Advisory" body="Standing advisory work for a TxDOT division or municipal partner." checked={plan === "advisory"} onChange={() => setPlan("advisory")} />
        </div>
      </FCBox>

      <FCSectionLabel>Choice cards — checkbox · multi-select</FCSectionLabel>
      <FCBox label="same look, different semantics — square indicator, multi-select">
        <FieldLabel>Tools required</FieldLabel>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
          <ChoiceCard type="checkbox" name="tools" value="analytics" icon="bar-chart-3" label="Analytics workspace" body="Jupyter + R + cloud GPU access provisioned for the team." checked={tools.analytics} onChange={() => setTools(t => ({ ...t, analytics: !t.analytics }))} />
          <ChoiceCard type="checkbox" name="tools" value="telemetry" icon="radio" label="Field telemetry" body="Connected vehicle data feed; requires partner-agency MOU." checked={tools.telemetry} onChange={() => setTools(t => ({ ...t, telemetry: !t.telemetry }))} />
          <ChoiceCard type="checkbox" name="tools" value="mapping" icon="map" label="Mapping & GIS" body="ArcGIS Pro license + corridor base layers." checked={tools.mapping} onChange={() => setTools(t => ({ ...t, mapping: !t.mapping }))} />
        </div>
      </FCBox>

      <FCSpecRow>
        <FCSpec label="hit target" value="≥ 44px row" note="Visual indicator is 18px; entire label row is clickable." />
        <FCSpec label="indeterminate" value="parent state" note="Parent shows a horizontal bar when children are partially selected." />
        <FCSpec label="cards"   value="border + tint" note="Selected card uses brand 4% tint and 1.5px brand border. Square indicator for checkbox cards." />
        <FCSpec label="aria"    value="implicit label" note="Always wrap inputs in <label> — this kit uses native semantics, not role=radio." />
      </FCSpecRow>
    </PageShell>
  );
}

// ════════════════════════════════════════════════════════════════════════
// Export shared helpers for AggieFormAdvanced.jsx and the page exports
// ════════════════════════════════════════════════════════════════════════

Object.assign(window, {
  // Pages
  FormTextPage, FormSelectPage, FormChoicePage,
  // Shared primitives reused by AggieFormAdvanced
  TextField, TextareaField, NativeSelect, FieldLabel, HelpText, fieldShellStyle,
  FCBox, FCSectionLabel, FCSpecRow, FCSpec, FCIntro, FieldGrid,
  FIELD_HEIGHT, FIELD_PADDING, FIELD_FONT,
});
