/* global React, PageShell, AGGIE_CATALOG, LucideIcon,
   TextField, FieldLabel, HelpText, fieldShellStyle, FieldGrid,
   FCBox, FCSectionLabel, FCSpecRow, FCSpec, FCIntro,
   FIELD_HEIGHT */
/*
 * AggieFormAdvanced.jsx — Batch 21 part 2:
 *   Date & time · File upload · Inline validation
 *
 * Builds on the primitives exported by AggieFormCore.jsx.
 *
 * Helper prefix: FA.
 */

const { useState: _faUseState, useEffect: _faUseEffect, useRef: _faUseRef } = React;

// ════════════════════════════════════════════════════════════════════════
// 1 — Date & time
// ════════════════════════════════════════════════════════════════════════

function DateInput({ id, label, value, onChange, required, hint, helpText, error }) {
  const [focused, setFocused] = _faUseState(false);
  return (
    <div>
      {label && <FieldLabel htmlFor={id} required={required} hint={hint}>{label}</FieldLabel>}
      <div style={{ position: "relative" }}>
        <input
          id={id} type="date" value={value} onChange={onChange}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          style={{ ...fieldShellStyle({ size: "md", state: error ? "error" : "default", focused }), paddingRight: 36 }}
        />
        <span style={{ position: "absolute", right: 11, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", pointerEvents: "none", display: "flex" }}>
          <LucideIcon name="calendar" size={16} />
        </span>
      </div>
      {error ? <div style={{ fontSize: "0.78rem", color: "var(--color-danger)", marginTop: 6, display: "inline-flex", alignItems: "center", gap: 5 }}><LucideIcon name="alert-circle" size={13} />{error}</div> : helpText && <HelpText>{helpText}</HelpText>}
    </div>
  );
}

// Inline calendar — used inside the date-range demo
function MonthCalendar({ year, month, selected = [], rangeStart, rangeEnd, onPick, today }) {
  const first = new Date(year, month, 1);
  const startDow = first.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < startDow; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  const isInRange = (d) => {
    if (!rangeStart || !rangeEnd) return false;
    const t = new Date(year, month, d).getTime();
    return t >= rangeStart.getTime() && t <= rangeEnd.getTime();
  };
  const isEdge = (d) => {
    if (!d) return false;
    const t = new Date(year, month, d).getTime();
    return (rangeStart && t === rangeStart.getTime()) || (rangeEnd && t === rangeEnd.getTime());
  };

  const monthName = new Date(year, month, 1).toLocaleString("en", { month: "long" });
  const dows = ["S", "M", "T", "W", "T", "F", "S"];

  return (
    <div style={{ minWidth: 240 }}>
      <div style={{ fontFamily: "var(--font-display)", fontSize: "0.95rem", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.04em", color: "var(--text-primary)", marginBottom: 12, textAlign: "center" }}>
        {monthName} {year}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 2 }}>
        {dows.map((d, i) => (
          <div key={i} style={{ fontSize: "0.62rem", fontWeight: 700, textTransform: "uppercase", color: "var(--text-muted)", fontFamily: "var(--font-body-bold)", textAlign: "center", padding: "4px 0" }}>{d}</div>
        ))}
        {cells.map((d, i) => {
          if (d === null) return <div key={i} />;
          const inRange = isInRange(d);
          const edge = isEdge(d);
          const isToday = today && today.getFullYear() === year && today.getMonth() === month && today.getDate() === d;
          return (
            <button key={i} onClick={() => onPick && onPick(new Date(year, month, d))}
              style={{
                height: 30, fontSize: "0.78rem", fontFamily: "var(--font-body)",
                border: "none", cursor: "pointer", borderRadius: 3,
                background: edge ? "var(--brand-primary)" : inRange ? "color-mix(in srgb, var(--brand-primary) 12%, transparent)" : isToday ? "var(--surface-sunken)" : "transparent",
                color: edge ? "#FFF" : isToday ? "var(--brand-primary)" : "var(--text-primary)",
                fontWeight: edge || isToday ? 700 : 500,
              }}>{d}</button>
          );
        })}
      </div>
    </div>
  );
}

function FormDatePage() {
  const item = AGGIE_CATALOG.find(c => c.id === "form-date");
  const [d1, setD1] = _faUseState("2026-04-15");
  const [d2, setD2] = _faUseState("");
  const [time, setTime] = _faUseState("14:30");
  const today = new Date(2026, 3, 28); // Apr 28 2026

  // Range demo state
  const [rs, setRs] = _faUseState(new Date(2026, 3, 14));
  const [re, setRe] = _faUseState(new Date(2026, 3, 22));
  const [pickStep, setPickStep] = _faUseState("end"); // "start" | "end"

  const onPick = (d) => {
    if (pickStep === "start") { setRs(d); setRe(null); setPickStep("end"); }
    else if (!rs || d < rs) { setRs(d); setRe(null); }
    else { setRe(d); setPickStep("start"); }
  };

  return (
    <PageShell item={item}>
      <FCIntro>
        Date and time inputs. Native <code>&lt;input type="date"&gt;</code> handles single-day selection well — keep it for forms. The custom calendar appears for date-range pickers and event scheduling, where the visual context of a month grid is worth the cost. All formatting is locale-aware.
      </FCIntro>

      <FCSectionLabel>Native date & time inputs</FCSectionLabel>
      <FCBox label="single-day selection · time-of-day · with helper">
        <FieldGrid cols={3}>
          <DateInput id="d-due" label="Due date" value={d1} onChange={(e) => setD1(e.target.value)} required helpText="Submission must arrive by 11:59 PM CT." />
          <DateInput id="d-end" label="Project end" value={d2} onChange={(e) => setD2(e.target.value)} hint="optional" />
          <div>
            <FieldLabel htmlFor="t-meet">Meeting time</FieldLabel>
            <input id="t-meet" type="time" value={time} onChange={(e) => setTime(e.target.value)} style={fieldShellStyle({ size: "md" })} />
            <HelpText>America/Chicago (Texas A&amp;M System default).</HelpText>
          </div>
        </FieldGrid>
      </FCBox>

      <FCSectionLabel>Date range — dual-month custom calendar</FCSectionLabel>
      <FCBox label="for event scheduling and reporting windows">
        <div style={{ display: "flex", gap: 12, marginBottom: 18, alignItems: "flex-end" }}>
          <div style={{ flex: 1 }}>
            <FieldLabel>Start date</FieldLabel>
            <div style={{ ...fieldShellStyle({ size: "md" }), display: "flex", alignItems: "center", color: rs ? "var(--text-primary)" : "var(--text-muted)" }}>
              {rs ? rs.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "Select start…"}
            </div>
          </div>
          <div style={{ color: "var(--text-muted)", paddingBottom: 12 }}><LucideIcon name="arrow-right" size={16} /></div>
          <div style={{ flex: 1 }}>
            <FieldLabel>End date</FieldLabel>
            <div style={{ ...fieldShellStyle({ size: "md" }), display: "flex", alignItems: "center", color: re ? "var(--text-primary)" : "var(--text-muted)" }}>
              {re ? re.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "Select end…"}
            </div>
          </div>
          <button onClick={() => { setRs(null); setRe(null); setPickStep("start"); }} style={{
            height: FIELD_HEIGHT.md, padding: "0 14px", border: "1px solid var(--surface-border)",
            background: "var(--surface-page)", color: "var(--text-secondary)",
            fontFamily: "var(--font-body-bold)", fontWeight: 700, fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.12em",
            cursor: "pointer", whiteSpace: "nowrap", borderRadius: 3,
          }}>Clear</button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, padding: 20, border: "1px solid var(--surface-border)", borderRadius: "var(--radius-md)", background: "var(--surface-raised)" }}>
          <MonthCalendar year={2026} month={3} rangeStart={rs} rangeEnd={re} onPick={onPick} today={today} />
          <MonthCalendar year={2026} month={4} rangeStart={rs} rangeEnd={re} onPick={onPick} today={today} />
        </div>
      </FCBox>

      <FCSectionLabel>Single-month picker — for event scheduling</FCSectionLabel>
      <FCBox label="standalone month grid — sits inside a popover or panel">
        <div style={{ display: "inline-block", padding: 18, border: "1px solid var(--surface-border)", borderRadius: "var(--radius-md)", background: "var(--surface-raised)" }}>
          <MonthCalendar year={2026} month={3} rangeStart={new Date(2026, 3, 15)} rangeEnd={new Date(2026, 3, 15)} onPick={() => {}} today={today} />
        </div>
      </FCBox>

      <FCSpecRow>
        <FCSpec label="locale"   value="en-US default" note="Date display uses Intl.DateTimeFormat — switches automatically with the document lang." />
        <FCSpec label="time"     value="24h or 12h"    note="Native <input type=time>; OS controls whether the user sees AM/PM." />
        <FCSpec label="range"    value="2-month grid"  note="Click start, click end. Click again to reset and pick a new start." />
        <FCSpec label="today"    value="muted highlight" note="Today's cell tinted with surface-sunken; selected wins, range wins over today." />
      </FCSpecRow>
    </PageShell>
  );
}

// ════════════════════════════════════════════════════════════════════════
// 2 — File upload
// ════════════════════════════════════════════════════════════════════════

function FilePicker({ label, helpText, accept = "PDF, DOCX up to 25MB" }) {
  const [filename, setFilename] = _faUseState("");
  return (
    <div>
      {label && <FieldLabel>{label}</FieldLabel>}
      <div style={{ display: "flex", alignItems: "stretch", border: "1px solid var(--surface-border)", borderRadius: 3, overflow: "hidden", background: "var(--surface-page)" }}>
        <button type="button" onClick={() => setFilename("draft-corridor-study.pdf")} style={{
          padding: "0 16px", height: FIELD_HEIGHT.md, background: "var(--surface-sunken)", border: "none",
          borderRight: "1px solid var(--surface-border)",
          fontFamily: "var(--font-body-bold)", fontWeight: 700, fontSize: "0.72rem",
          textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--text-primary)", cursor: "pointer",
        }}>Choose file</button>
        <div style={{ flex: 1, display: "flex", alignItems: "center", padding: "0 12px", fontSize: "0.88rem", color: filename ? "var(--text-primary)" : "var(--text-muted)" }}>
          {filename || "No file selected"}
        </div>
        {filename && (
          <button onClick={() => setFilename("")} style={{ background: "transparent", border: "none", padding: "0 14px", color: "var(--text-muted)", cursor: "pointer", display: "flex", alignItems: "center" }}>
            <LucideIcon name="x" size={16} />
          </button>
        )}
      </div>
      <HelpText>{helpText || `Accepted: ${accept}`}</HelpText>
    </div>
  );
}

function DropZone({ accept = "PDF, DOCX, TIFF up to 50MB" }) {
  const [hover, setHover] = _faUseState(false);
  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setHover(true); }}
      onDragLeave={() => setHover(false)}
      onDrop={(e) => { e.preventDefault(); setHover(false); }}
      style={{
        border: `2px dashed ${hover ? "var(--brand-primary)" : "var(--surface-border)"}`,
        borderRadius: "var(--radius-md)", padding: "36px 20px",
        background: hover ? "color-mix(in srgb, var(--brand-primary) 5%, transparent)" : "var(--surface-raised)",
        textAlign: "center", transition: "all 0.15s ease", cursor: "pointer",
      }}>
      <div style={{ color: "var(--brand-primary)", marginBottom: 12 }}>
        <LucideIcon name="upload-cloud" size={32} />
      </div>
      <div style={{ fontFamily: "var(--font-body-bold)", fontWeight: 700, fontSize: "0.95rem", color: "var(--text-primary)", marginBottom: 4 }}>
        Drag files here, or <span style={{ color: "var(--brand-primary)", textDecoration: "underline" }}>browse</span>
      </div>
      <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>{accept}</div>
    </div>
  );
}

function FileRow({ name, size, status, progress }) {
  const statusMap = {
    uploading: { color: "var(--brand-primary)",  icon: null, label: "Uploading" },
    success:   { color: "var(--color-success)",  icon: "check-circle", label: "Uploaded" },
    error:     { color: "var(--color-danger)",   icon: "alert-circle", label: "Failed" },
  }[status];
  return (
    <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--surface-border)", display: "flex", alignItems: "center", gap: 14 }}>
      <div style={{ color: "var(--text-muted)", display: "flex" }}><LucideIcon name="file" size={18} /></div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12 }}>
          <span style={{ fontSize: "0.88rem", fontFamily: "var(--font-body-bold)", fontWeight: 600, color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{name}</span>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: "var(--text-muted)", flexShrink: 0 }}>{size}</span>
        </div>
        {status === "uploading" ? (
          <div style={{ marginTop: 6, height: 4, background: "var(--surface-sunken)", borderRadius: 2, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${progress}%`, background: "var(--brand-primary)", transition: "width 0.3s" }} />
          </div>
        ) : (
          <div style={{ fontSize: "0.74rem", color: statusMap.color, marginTop: 3, display: "inline-flex", alignItems: "center", gap: 5 }}>
            {statusMap.icon && <LucideIcon name={statusMap.icon} size={12} />}
            {statusMap.label}
          </div>
        )}
      </div>
      <button style={{ background: "transparent", border: "none", color: "var(--text-muted)", cursor: "pointer", padding: 6, display: "flex" }}>
        <LucideIcon name="x" size={16} />
      </button>
    </div>
  );
}

function FormFilePage() {
  const item = AGGIE_CATALOG.find(c => c.id === "form-file");
  const [progress, setProgress] = _faUseState(64);
  _faUseEffect(() => {
    const t = setInterval(() => setProgress(p => p >= 100 ? 0 : p + 4), 220);
    return () => clearInterval(t);
  }, []);

  return (
    <PageShell item={item}>
      <FCIntro>
        Three patterns. The basic <strong>file picker</strong> for a single attachment. The <strong>drop zone</strong> for the primary upload surface. The <strong>multi-file list</strong> shows progress, success, and error states per row. Always advertise mime-type and size limits upfront — never surface a 50MB error after the user waited 90 seconds.
      </FCIntro>

      <FCSectionLabel>File picker — basic single-file</FCSectionLabel>
      <FCBox label="for forms with one attachment slot">
        <FilePicker label="Resume / CV" accept="PDF, DOCX up to 25MB" />
      </FCBox>

      <FCSectionLabel>Drop zone — drag-and-drop primary surface</FCSectionLabel>
      <FCBox label="hover state previewed on the right">
        <FieldGrid cols={2}>
          <DropZone />
          <DropZone accept="Drop while highlighted — bordered preview state" />
        </FieldGrid>
      </FCBox>

      <FCSectionLabel>Multi-file list — progress + per-row status</FCSectionLabel>
      <FCBox label="rows show uploading / success / error, with × to remove">
        <div style={{ border: "1px solid var(--surface-border)", borderRadius: "var(--radius-md)", overflow: "hidden", background: "var(--surface-page)" }}>
          <div style={{ padding: "10px 16px", borderBottom: "1px solid var(--surface-border)", background: "var(--surface-sunken)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--text-muted)", fontFamily: "var(--font-body-bold)" }}>3 files · 14.8 MB total</span>
            <button style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--brand-primary)", fontFamily: "var(--font-body-bold)", background: "transparent", border: "none", cursor: "pointer" }}>Clear all</button>
          </div>
          <FileRow name="corridor-summary-2025.pdf" size="3.2 MB" status="success" />
          <FileRow name="sensor-fusion-appendix.tiff" size="9.4 MB" status="uploading" progress={progress} />
          <FileRow name="dataset.zip" size="2.2 MB" status="error" />
        </div>
      </FCBox>

      <FCSpecRow>
        <FCSpec label="picker"     value="single file"   note="Native button + filename strip. Cheapest pattern when the form has one attachment." />
        <FCSpec label="drop zone"  value="2px dashed"    note="Border tints brand on dragover. Primary surface for upload-first flows." />
        <FCSpec label="row state"  value="3 outcomes"    note="uploading (progress bar) · success (✓ green) · error (! red)." />
        <FCSpec label="limits"     value="visible upfront" note="Always show accepted types and max size near the upload control — never bury in error toast." />
      </FCSpecRow>
    </PageShell>
  );
}

// ════════════════════════════════════════════════════════════════════════
// 3 — Inline validation
// ════════════════════════════════════════════════════════════════════════

function PasswordMeter({ password }) {
  // Simple heuristic — never use this in production.
  const lengthOk = password.length >= 12;
  const upperOk = /[A-Z]/.test(password);
  const numOk = /[0-9]/.test(password);
  const symOk = /[^A-Za-z0-9]/.test(password);
  const score = [lengthOk, upperOk, numOk, symOk].filter(Boolean).length;
  const tones = ["#C9C9C9", "var(--color-danger)", "var(--color-warning)", "var(--brand-accent)", "var(--color-success)"];
  const labels = ["Empty", "Weak", "Fair", "Strong", "Excellent"];

  return (
    <div style={{ marginTop: 8 }}>
      <div style={{ display: "flex", gap: 4, marginBottom: 6 }}>
        {[1, 2, 3, 4].map(i => (
          <div key={i} style={{ flex: 1, height: 4, background: i <= score ? tones[score] : "var(--surface-sunken)", borderRadius: 2 }} />
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.74rem", color: "var(--text-muted)" }}>
        <span>Strength: <strong style={{ color: tones[score] }}>{labels[score]}</strong></span>
        <span style={{ fontFamily: "var(--font-mono)" }}>{password.length} chars</span>
      </div>
      <div style={{ marginTop: 8, display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 4, fontSize: "0.74rem", color: "var(--text-muted)" }}>
        <Rule ok={lengthOk}>12+ characters</Rule>
        <Rule ok={upperOk}>Uppercase letter</Rule>
        <Rule ok={numOk}>Number</Rule>
        <Rule ok={symOk}>Symbol</Rule>
      </div>
    </div>
  );
}

function Rule({ ok, children }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, color: ok ? "var(--color-success)" : "var(--text-muted)" }}>
      <LucideIcon name={ok ? "check" : "circle"} size={11} />
      {children}
    </span>
  );
}

function AsyncEmailField() {
  const [email, setEmail] = _faUseState("");
  const [state, setState] = _faUseState("idle"); // idle | checking | available | taken | invalid

  _faUseEffect(() => {
    if (!email) { setState("idle"); return; }
    if (!/.+@.+\..+/.test(email)) { setState("invalid"); return; }
    setState("checking");
    const t = setTimeout(() => {
      // Simulate "park.junseo@tamu.edu" being taken
      setState(email.toLowerCase().includes("park.junseo") ? "taken" : "available");
    }, 700);
    return () => clearTimeout(t);
  }, [email]);

  const trailing = {
    idle: null,
    checking: <span style={{ color: "var(--text-muted)", display: "flex" }}>
      <span style={{ width: 14, height: 14, border: "2px solid var(--surface-border)", borderTopColor: "var(--brand-primary)", borderRadius: "50%", animation: "tux-spin 0.8s linear infinite", display: "inline-block" }} />
    </span>,
    available: <span style={{ color: "var(--color-success)", display: "flex" }}><LucideIcon name="check-circle" size={16} /></span>,
    taken: <span style={{ color: "var(--color-danger)", display: "flex" }}><LucideIcon name="alert-circle" size={16} /></span>,
    invalid: <span style={{ color: "var(--color-danger)", display: "flex" }}><LucideIcon name="alert-circle" size={16} /></span>,
  }[state];

  const helpText = state === "available" ? "This handle is available." : state === "checking" ? "Checking availability…" : null;
  const error = state === "taken" ? "Already taken — try a variant or sign in instead." : state === "invalid" ? "Enter a valid email address." : null;

  return (
    <div>
      <FieldLabel htmlFor="async-email" required>Username (your TAMU email)</FieldLabel>
      <div style={{ position: "relative" }}>
        <input
          id="async-email" type="email" value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="park.junseo@tamu.edu"
          style={{ ...fieldShellStyle({ size: "md", state: error ? "error" : state === "available" ? "success" : "default" }), paddingRight: 36 }}
        />
        <span style={{ position: "absolute", right: 11, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>{trailing}</span>
      </div>
      {error ? (
        <div style={{ fontSize: "0.78rem", color: "var(--color-danger)", marginTop: 6, display: "inline-flex", alignItems: "center", gap: 5 }}>
          <LucideIcon name="alert-circle" size={13} /> {error}
        </div>
      ) : helpText ? <HelpText>{helpText}</HelpText> : <HelpText>We'll check availability as you type.</HelpText>}
    </div>
  );
}

function ServerErrorBanner() {
  return (
    <div style={{
      padding: "14px 16px", marginBottom: 18,
      border: "1px solid color-mix(in srgb, var(--color-danger) 40%, transparent)",
      borderLeft: "4px solid var(--color-danger)",
      background: "color-mix(in srgb, var(--color-danger) 5%, transparent)",
      borderRadius: "0 var(--radius-sm) var(--radius-sm) 0",
    }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
        <span style={{ color: "var(--color-danger)", display: "flex", marginTop: 1 }}><LucideIcon name="alert-octagon" size={18} /></span>
        <div>
          <div style={{ fontFamily: "var(--font-body-bold)", fontWeight: 700, fontSize: "0.88rem", color: "var(--text-primary)", marginBottom: 4 }}>
            We couldn't save your changes
          </div>
          <div style={{ fontSize: "0.82rem", lineHeight: 1.5, color: "var(--text-secondary)" }}>
            The server returned <code style={{ fontSize: "0.78rem" }}>422 — funding source not authorized for this division</code>. Update the funding field below or contact your division admin.
          </div>
        </div>
      </div>
    </div>
  );
}

function InlineValidationPage() {
  const item = AGGIE_CATALOG.find(c => c.id === "inline-validation");
  const [pwd, setPwd] = _faUseState("Password!1");

  return (
    <PageShell item={item}>
      <FCIntro>
        Validation should help, not punish. Show <strong>help text</strong> by default. Show <strong>error</strong> only after the user has interacted (or on submit). Show <strong>success</strong> sparingly — only when the user might genuinely doubt the result, not as a participation trophy on every field.
      </FCIntro>

      <FCSectionLabel>Help vs error — replacing pattern</FCSectionLabel>
      <FCBox label="help-text below; error replaces it on validation fail">
        <FieldGrid cols={2}>
          <TextField id="v-help" label="Project title" value="Connected vehicles in mixed traffic"
            helpText="Used in publication indexing — keep under 100 characters." onChange={() => {}} />
          <TextField id="v-err" label="Project title" value="A" error="Title must be at least 8 characters."
            onChange={() => {}} />
        </FieldGrid>
      </FCBox>

      <FCSectionLabel>Field-level states — error · success · warning</FCSectionLabel>
      <FCBox label="trailing icon mirrors the state; never show a checkmark beside trivial fields">
        <FieldGrid cols={3}>
          <TextField id="v-e" label="Account number" value="ABC-123" error="Account numbers are 8 digits, no letters." onChange={() => {}} />
          <TextField id="v-s" label="Verified email" value="park.junseo@tamu.edu" success onChange={() => {}} />
          <div>
            <FieldLabel>API token</FieldLabel>
            <div style={{ ...fieldShellStyle({ size: "md", state: "default" }), borderColor: "var(--color-warning)", display: "flex", alignItems: "center", paddingRight: 36, position: "relative" }}>
              <span style={{ fontFamily: "var(--font-mono)", color: "var(--text-secondary)" }}>tk_••••••32a9</span>
              <span style={{ position: "absolute", right: 11, color: "var(--color-warning)", display: "flex" }}><LucideIcon name="alert-triangle" size={16} /></span>
            </div>
            <div style={{ fontSize: "0.78rem", color: "var(--color-warning)", marginTop: 6, display: "inline-flex", alignItems: "center", gap: 5 }}>
              <LucideIcon name="alert-triangle" size={13} /> Token expires in 5 days. Rotate before April 30.
            </div>
          </div>
        </FieldGrid>
      </FCBox>

      <FCSectionLabel>Async validation — debounced, with spinner</FCSectionLabel>
      <FCBox label="checks availability against the server while user types">
        <AsyncEmailField />
      </FCBox>

      <FCSectionLabel>Password strength meter</FCSectionLabel>
      <FCBox label="show requirements live; meter uses 4 segments to avoid false precision">
        <div style={{ maxWidth: 420 }}>
          <TextField id="v-pwd" label="New password" type="password" value={pwd} onChange={(e) => setPwd(e.target.value)} />
          <PasswordMeter password={pwd} />
        </div>
      </FCBox>

      <FCSectionLabel>Server-side error — page-level banner above form</FCSectionLabel>
      <FCBox label="when validation fails after submission, show banner + scroll to first errored field">
        <ServerErrorBanner />
        <FieldGrid cols={2}>
          <TextField id="v-fund" label="Funding source" value="TXDOT-INV-2024-099"
            error="Account TXDOT-INV-2024-099 is not authorized for the Mobility Division." onChange={() => {}} />
          <NativeSelectStub />
        </FieldGrid>
      </FCBox>

      <FCSpecRow>
        <FCSpec label="when"     value="onBlur · onSubmit"  note="Never on every keystroke for required-field errors. Async checks are an exception." />
        <FCSpec label="success"  value="sparingly"          note="Only when the result isn't obvious (async availability, verified email). Not on every passing field." />
        <FCSpec label="server error" value="banner + field" note="Page-level banner explains, field-level error pinpoints. Both link to the same problem." />
        <FCSpec label="aria"     value="aria-invalid · aria-describedby" note="Field gets aria-invalid=true; error message has id matching aria-describedby on the input." />
      </FCSpecRow>
    </PageShell>
  );
}

function NativeSelectStub() {
  return (
    <div>
      <FieldLabel>Division</FieldLabel>
      <div style={{ ...fieldShellStyle({ size: "md" }), display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span>Mobility Division</span>
        <LucideIcon name="chevron-down" size={16} />
      </div>
      <HelpText>Match the funding source's authorized division.</HelpText>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════
// Export
// ════════════════════════════════════════════════════════════════════════

Object.assign(window, {
  FormDatePage,
  FormFilePage,
  InlineValidationPage,
});
