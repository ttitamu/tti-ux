/* global React, PageShell, AGGIE_CATALOG, LucideIcon */
/*
 * AggieFeedback.jsx — INF-1 batch: new TUX components.
 *
 *   Toast        — transient status notification, stacks in a corner region.
 *   Spinner      — circular indeterminate loading indicator (vs. skeleton-loader's
 *                  full-shape placeholder).
 *   Progress-bar — determinate / indeterminate linear progress.
 *
 * Lineage (INF-1):
 *   • Toast       — anatomy informed by Microsoft Fluent 2 Web Toast (2 frames).
 *                   Fluent ships a 292×44 default body that grows with a
 *                   secondary line + optional inline progress + quick actions.
 *                   TUX keeps the structure and swaps in: maroon-tinted info,
 *                   editorial Work Sans 700 title, Open Sans body, JetBrains
 *                   Mono percent. Status-icon tones come from TUX's existing
 *                   alerts vocabulary (info / success / warning / error).
 *   • Spinner     — informed by Fluent 2 Web Spinner (3 frames). Fluent
 *                   names 7 sizes (xtiny / xsmall / small / medium / large /
 *                   xlarge / huge); TUX keeps 5 (xs · sm · md · lg · xl)
 *                   and adds label-after / label-below positions matching
 *                   Fluent's three layouts.
 *   • Progress-bar — informed by Fluent 2 Web Progress-bar (3 frames).
 *                    Two sizes (medium 2px / large 4px); TUX adds a 6px
 *                    "thick" tier for hero-area progress (file upload, etc.).
 *                    Indeterminate gradient-mask animation is preserved.
 *
 * Identity stays TUX: maroon brand, two-ring focus, Work Sans 700 caps
 * labels on controls. Never lift Segoe UI or Fluent blue.
 *
 * Helper prefix: FB (FeedBack). Local helpers — never import a generic
 * SectionLabel/Box/Spec from another batch (Babel scope collisions).
 */

// ════════════════════════════════════════════════════════════════════════
// Shared helpers (FB prefix)
// ════════════════════════════════════════════════════════════════════════

function FBBox({ dark = false, label, padded = true, children }) {
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

function FBSectionLabel({ children }) {
  return (
    <h3 style={{
      fontFamily: "var(--font-body)", fontSize: "0.72rem", fontWeight: 600, textTransform: "lowercase",
      letterSpacing: "0.10em", color: "var(--text-muted)", margin: "32px 0 12px",
    }}>{children}</h3>
  );
}

function FBSpecRow({ children }) {
  return (
    <div style={{ marginTop: 28, padding: "14px 18px", border: "1px solid var(--surface-border)", borderRadius: "var(--radius-md)", background: "var(--surface-raised)", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: 18 }}>
      {children}
    </div>
  );
}

function FBSpec({ label, value, note }) {
  return (
    <div>
      <div style={{ fontFamily: "var(--font-body-bold)", fontSize: "0.6rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--text-muted)", marginBottom: 4 }}>{label}</div>
      <div style={{ fontFamily: "var(--font-mono)", fontWeight: 500, fontSize: "0.82rem", color: "var(--text-primary)", marginBottom: 4 }}>{value}</div>
      {note ? <div style={{ fontFamily: "var(--font-body)", fontSize: "0.74rem", color: "var(--text-muted)", lineHeight: 1.4 }}>{note}</div> : null}
    </div>
  );
}

function FBIntro({ children }) {
  return (
    <div style={{ borderLeft: "3px solid var(--brand-primary)", padding: "8px 16px", margin: "0 0 28px", background: "var(--surface-raised)", borderRadius: "0 var(--radius-sm) var(--radius-sm) 0" }}>
      <p style={{ margin: 0, fontFamily: "var(--font-body)", fontSize: "0.9rem", lineHeight: 1.55, color: "var(--text-primary)", maxWidth: 760 }}>{children}</p>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════
// TOAST primitive
// ════════════════════════════════════════════════════════════════════════

const TOAST_TONES = {
  info:    { fill: "var(--brand-primary)",   tint: "rgba(92, 0, 37, 0.08)",   icon: "info" },
  success: { fill: "var(--color-success)",  tint: "rgba(45, 107, 47, 0.08)", icon: "check-circle-2" },
  warning: { fill: "var(--color-warning)",  tint: "rgba(220, 138, 25, 0.08)", icon: "alert-triangle" },
  error:   { fill: "var(--color-error)",    tint: "rgba(176, 28, 32, 0.08)", icon: "alert-octagon" },
};

function Toast({ tone = "info", title, body, percent, actions, onDismiss, dark = false }) {
  const t = TOAST_TONES[tone];
  return (
    <div style={{
      width: 360,
      background: dark ? "#1A0A12" : "#FFFFFF",
      borderRadius: "var(--radius-md)",
      border: dark ? "1px solid rgba(255,255,255,0.08)" : "1px solid var(--surface-border)",
      borderLeft: `3px solid ${t.fill}`,
      boxShadow: dark ? "0 0 2px rgba(0,0,0,0.4), 0 8px 24px rgba(0,0,0,0.35)" : "0 0 2px rgba(0,0,0,0.06), 0 8px 24px rgba(0,0,0,0.10)",
      padding: "14px 16px",
      display: "flex",
      flexDirection: "column",
      gap: 10,
      fontFamily: "var(--font-body)",
    }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
        <div style={{
          width: 22, height: 22, flexShrink: 0,
          display: "flex", alignItems: "center", justifyContent: "center",
          background: t.tint, borderRadius: "50%", marginTop: 1,
        }}>
          <LucideIcon name={t.icon} size={14} color={t.fill} strokeWidth={2.25} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontFamily: "var(--font-body-bold)",
            fontWeight: 700, fontSize: "0.86rem", letterSpacing: "0.01em",
            color: dark ? "#FFFFFF" : "var(--text-primary)",
            lineHeight: 1.35,
          }}>{title}</div>
          {body ? <div style={{
            fontSize: "0.82rem",
            color: dark ? "rgba(255,255,255,0.78)" : "var(--text-muted)",
            lineHeight: 1.5, marginTop: 4,
          }}>{body}</div> : null}
        </div>
        {onDismiss ? (
          <button onClick={onDismiss} aria-label="Dismiss" style={{
            background: "transparent", border: "none", padding: 2, marginTop: -2,
            cursor: "pointer", borderRadius: 4, color: dark ? "rgba(255,255,255,0.7)" : "var(--text-muted)",
          }}>
            <LucideIcon name="x" size={16} />
          </button>
        ) : null}
      </div>
      {typeof percent === "number" ? (
        <div style={{ paddingLeft: 34 }}>
          <ProgressBar value={percent} size="thin" dark={dark} />
          <div style={{
            fontFamily: "var(--font-mono)", fontWeight: 500, fontSize: "0.7rem",
            color: dark ? "rgba(255,255,255,0.78)" : "var(--text-muted)",
            marginTop: 6, fontVariantNumeric: "tabular-nums",
          }}>{percent}% complete</div>
        </div>
      ) : null}
      {actions && actions.length ? (
        <div style={{ paddingLeft: 34, display: "flex", gap: 16 }}>
          {actions.map((a, i) => (
            <button key={i} onClick={a.onClick} style={{
              background: "transparent", border: "none", padding: "4px 0",
              cursor: "pointer",
              fontFamily: "var(--font-body-bold)", fontSize: "0.72rem", fontWeight: 700,
              textTransform: "uppercase", letterSpacing: "0.10em",
              color: dark ? "var(--brand-accent)" : t.fill,
            }}>{a.label}</button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function ToastStack({ corner = "br", children }) {
  const cornerStyles = {
    br: { right: 24, bottom: 24, alignItems: "flex-end" },
    bl: { left: 24, bottom: 24, alignItems: "flex-start" },
    tr: { right: 24, top: 24, alignItems: "flex-end" },
    tl: { left: 24, top: 24, alignItems: "flex-start" },
  };
  return (
    <div style={{
      position: "absolute", display: "flex", flexDirection: "column", gap: 12,
      pointerEvents: "auto", ...cornerStyles[corner],
    }}>
      {children}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════
// SPINNER primitive
// ════════════════════════════════════════════════════════════════════════

const SPINNER_SIZES = { xs: 14, sm: 18, md: 24, lg: 36, xl: 48 };

function Spinner({ size = "md", tone = "brand", dark = false }) {
  const px = SPINNER_SIZES[size];
  const stroke = Math.max(2, Math.round(px / 10));
  const colors = {
    brand:   { tail: dark ? "var(--brand-accent)" : "var(--brand-primary)", track: dark ? "rgba(221,172,55,0.22)" : "rgba(92,0,37,0.16)" },
    neutral: { tail: dark ? "rgba(255,255,255,0.85)" : "var(--text-primary)", track: dark ? "rgba(255,255,255,0.18)" : "rgba(36,36,36,0.16)" },
    inverse: { tail: "#FFFFFF", track: "rgba(255,255,255,0.28)" },
  }[tone];
  return (
    <span role="status" aria-label="Loading" style={{
      display: "inline-block", width: px, height: px,
      border: `${stroke}px solid ${colors.track}`,
      borderTopColor: colors.tail,
      borderRadius: "50%",
      animation: "tux-spin 0.8s linear infinite",
      verticalAlign: "middle",
    }} />
  );
}

function SpinnerLabel({ size = "md", label = "Loading", placement = "after", dark = false }) {
  const fontSize = size === "xs" || size === "sm" ? "0.72rem" : size === "lg" || size === "xl" ? "0.92rem" : "0.82rem";
  const labelEl = (
    <span style={{
      fontFamily: "var(--font-body-bold)", fontWeight: 700, fontSize, letterSpacing: "0.10em",
      textTransform: "uppercase", color: dark ? "rgba(255,255,255,0.85)" : "var(--text-primary)",
    }}>{label}</span>
  );
  const isVertical = placement === "below";
  return (
    <span style={{ display: "inline-flex", alignItems: "center", flexDirection: isVertical ? "column" : "row", gap: isVertical ? 10 : 10 }}>
      {placement === "before" ? labelEl : null}
      <Spinner size={size} dark={dark} />
      {placement === "after" || placement === "below" ? labelEl : null}
    </span>
  );
}

// ════════════════════════════════════════════════════════════════════════
// PROGRESS-BAR primitive
// ════════════════════════════════════════════════════════════════════════

const PB_HEIGHTS = { thin: 2, default: 4, thick: 6 };

function ProgressBar({ value, size = "default", tone = "brand", indeterminate = false, dark = false }) {
  const h = PB_HEIGHTS[size];
  const trackBg = dark ? "rgba(255,255,255,0.16)" : "var(--surface-sunken)";
  const toneFill = tone === "success" ? "var(--color-success)"
                  : tone === "warning" ? "var(--color-warning)"
                  : tone === "error" ? "var(--color-error)"
                  : dark ? "var(--brand-accent)" : "var(--brand-primary)";
  const w = Math.max(0, Math.min(100, value ?? 0));
  return (
    <div role="progressbar" aria-valuenow={indeterminate ? undefined : w} aria-valuemin={0} aria-valuemax={100}
      style={{
        width: "100%", height: h, background: trackBg, borderRadius: 9999,
        overflow: "hidden", position: "relative",
      }}>
      {indeterminate ? (
        <div style={{
          position: "absolute", top: 0, height: "100%", width: "35%",
          background: `linear-gradient(90deg, transparent, ${toneFill} 50%, transparent)`,
          animation: "tux-pb-indeterminate 1.6s ease-in-out infinite",
        }} />
      ) : (
        <div style={{
          height: "100%", width: `${w}%`, background: toneFill, borderRadius: 9999,
          transition: "width 240ms ease-out",
        }} />
      )}
    </div>
  );
}

// inject keyframes once
if (typeof document !== "undefined" && !document.getElementById("tux-pb-keyframes")) {
  const s = document.createElement("style");
  s.id = "tux-pb-keyframes";
  s.textContent = "@keyframes tux-pb-indeterminate { 0% { left: -35%; } 100% { left: 100%; } }";
  document.head.appendChild(s);
}

// ════════════════════════════════════════════════════════════════════════
// TOAST PAGE
// ════════════════════════════════════════════════════════════════════════

function ToastPage() {
  const item = (window.AGGIE_CATALOG || []).find(c => c.id === "toast");
  return (
    <PageShell item={item}>
      <FBIntro>
        Transient notification surface for action results and ambient events — file saved,
        export ready, connection lost, etc. Auto-dismisses after a timeout but supports
        an explicit dismiss too. Use for information that's useful and relevant but{" "}
        <em>not critical</em>. For critical messages, reach for <code>alerts</code> (page-level
        banner) or <code>modal</code> (blocking). Stacks in a corner region — bottom-right is
        the default; top-right works for global system messages.
      </FBIntro>

      <FBSectionLabel>1 · Tones — info · success · warning · error</FBSectionLabel>
      <FBBox label="four status tones · titles only">
        <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
          <Toast tone="info"    title="Export queued"  body="Your dataset will be ready in ~30 seconds." onDismiss={() => {}} />
          <Toast tone="success" title="Saved 12 edits" body="Synced to the corridor profile."           onDismiss={() => {}} />
          <Toast tone="warning" title="Connection slow" body="Last sync 2 minutes ago. Working from cache." onDismiss={() => {}} />
          <Toast tone="error"   title="Save failed"     body="Network error. Click retry to send again."   onDismiss={() => {}}
                  actions={[{ label: "Retry", onClick: () => {} }, { label: "Discard", onClick: () => {} }]} />
        </div>
      </FBBox>

      <FBSectionLabel>2 · With progress + actions — long-running operation</FBSectionLabel>
      <FBBox label="determinate progress · inline actions">
        <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
          <Toast tone="info" title="Uploading 4 files" body="Don't close this tab until uploads finish." percent={37} onDismiss={() => {}} />
          <Toast tone="success" title="Export complete" body="research-2026-q2.csv saved to Downloads."
                  actions={[{ label: "Open folder", onClick: () => {} }, { label: "Share", onClick: () => {} }]}
                  onDismiss={() => {}} />
        </div>
      </FBBox>

      <FBSectionLabel>3 · Stack — corner region, newest on top</FBSectionLabel>
      <FBBox label="bottom-right stack · 3 toasts" padded={false}>
        <div style={{ height: 320, position: "relative", background: "var(--surface-raised)" }}>
          <ToastStack corner="br">
            <Toast tone="info"    title="Synced to corridor profile" onDismiss={() => {}} />
            <Toast tone="success" title="Saved 12 edits"             body="No conflicts detected."   onDismiss={() => {}} />
            <Toast tone="warning" title="3 sites unreachable"        body="Retry scheduled for 11:32" onDismiss={() => {}} />
          </ToastStack>
        </div>
      </FBBox>

      <FBSectionLabel>4 · On dark — surface within a maroon shell</FBSectionLabel>
      <FBBox dark label="info + error · on dark">
        <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
          <Toast tone="info"  title="Export queued" body="Your dataset will be ready in ~30 seconds." onDismiss={() => {}} dark />
          <Toast tone="error" title="Save failed"   body="Network error. Click retry to send again." dark
                  actions={[{ label: "Retry", onClick: () => {} }]} onDismiss={() => {}} />
        </div>
      </FBBox>

      <FBSpecRow>
        <FBSpec label="Width"       value="360px"             note="Fixed; body wraps to fit. Min 280 on narrow viewports." />
        <FBSpec label="Border"      value="3px left accent"   note="Tone color on left edge; 1px hairline border around." />
        <FBSpec label="Shadow"      value="0 8px 24px / 10%"  note="Layered with a 2px micro-shadow for the edge." />
        <FBSpec label="Auto-dismiss" value="5s default"       note="Pause on hover/focus. Errors persist until acked." />
        <FBSpec label="Stack gap"   value="12px"              note="Newest enters from corner; older items slide." />
        <FBSpec label="Lineage"     value="Fluent 2 Web Toast" note="Anatomy only · TUX type, maroon brand, status tones." />
      </FBSpecRow>
    </PageShell>
  );
}

// ════════════════════════════════════════════════════════════════════════
// SPINNER PAGE
// ════════════════════════════════════════════════════════════════════════

function SpinnerPage() {
  const item = (window.AGGIE_CATALOG || []).find(c => c.id === "spinner");
  return (
    <PageShell item={item}>
      <FBIntro>
        Indeterminate loading indicator for short waits (≤2s) and inline status. Pairs
        with <code>skeleton-loader</code> (use skeleton when the shape of incoming content
        is known and worth previewing; use spinner for ambient activity or button-level
        "working…" states). Honors <code>prefers-reduced-motion</code> automatically by{" "}
        slowing the rotation.
      </FBIntro>

      <FBSectionLabel>1 · Size ramp — xs · sm · md · lg · xl</FBSectionLabel>
      <FBBox label="five sizes · default tone">
        <div style={{ display: "flex", alignItems: "center", gap: 36 }}>
          <Spinner size="xs" /><Spinner size="sm" /><Spinner size="md" /><Spinner size="lg" /><Spinner size="xl" />
        </div>
      </FBBox>

      <FBSectionLabel>2 · With label — three placements</FBSectionLabel>
      <FBBox label="after · before · below">
        <div style={{ display: "flex", alignItems: "center", gap: 56, flexWrap: "wrap" }}>
          <SpinnerLabel size="md" label="Saving" placement="after"  />
          <SpinnerLabel size="md" label="Saving" placement="before" />
          <SpinnerLabel size="md" label="Saving" placement="below"  />
        </div>
      </FBBox>

      <FBSectionLabel>3 · In context — button + inline + page-level</FBSectionLabel>
      <FBBox label="three common uses">
        <div style={{ display: "flex", alignItems: "center", gap: 28, flexWrap: "wrap" }}>
          <button disabled style={{
            display: "inline-flex", alignItems: "center", gap: 10,
            padding: "10px 20px", background: "var(--brand-primary)", color: "white",
            border: "none", borderRadius: "var(--radius-sm)", cursor: "wait",
            fontFamily: "var(--font-body-bold)", fontWeight: 700, fontSize: "0.78rem",
            textTransform: "uppercase", letterSpacing: "0.10em", opacity: 0.9,
          }}>
            <Spinner size="xs" tone="inverse" />
            Saving…
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: 12, fontFamily: "var(--font-body)", fontSize: "0.92rem", color: "var(--text-muted)" }}>
            <Spinner size="sm" />
            <span>Fetching 1,240 records…</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, padding: 24 }}>
            <Spinner size="xl" />
            <div style={{ fontFamily: "var(--font-body-bold)", fontWeight: 700, fontSize: "0.78rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-muted)" }}>Loading dashboard</div>
          </div>
        </div>
      </FBBox>

      <FBSectionLabel>4 · On dark — maroon background</FBSectionLabel>
      <FBBox dark label="brand · neutral · inverse tones">
        <div style={{ display: "flex", alignItems: "center", gap: 48 }}>
          <Spinner size="lg" tone="brand"   dark />
          <Spinner size="lg" tone="neutral" dark />
          <Spinner size="lg" tone="inverse" dark />
        </div>
      </FBBox>

      <FBSpecRow>
        <FBSpec label="Sizes"      value="14 · 18 · 24 · 36 · 48px" note="xs / sm / md / lg / xl. Stroke scales 1.4–4.8." />
        <FBSpec label="Animation"  value="0.8s linear infinite"     note="Single rotation; slows to 1.6s under reduced-motion." />
        <FBSpec label="Track"      value="brand @ 16%"              note="Tail solid; ratio: 1 quarter-turn lighter on dark." />
        <FBSpec label="Tones"      value="brand · neutral · inverse" note="Inverse always white tail; use on dark/brand surfaces." />
        <FBSpec label="A11y"       value='role="status"'            note="aria-label='Loading' by default; override for specifics." />
        <FBSpec label="Lineage"    value="Fluent 2 Web Spinner"     note="Anatomy only · TUX type and color." />
      </FBSpecRow>
    </PageShell>
  );
}

// ════════════════════════════════════════════════════════════════════════
// PROGRESS-BAR PAGE
// ════════════════════════════════════════════════════════════════════════

function ProgressBarPage() {
  const item = (window.AGGIE_CATALOG || []).find(c => c.id === "progress-bar");
  return (
    <PageShell item={item}>
      <FBIntro>
        Linear progress for tasks with a known duration or a stream of work. Use{" "}
        <strong>determinate</strong> when percent-complete is computable (file upload, batch export);{" "}
        <strong>indeterminate</strong> when the operation has no measurable midpoint (initial network
        request, query planning). Different from <code>stepper</code>, which marks discrete checkpoints
        rather than a continuous fill, and from <code>spinner</code>, which is ambient.
      </FBIntro>

      <FBSectionLabel>1 · Determinate — three sizes</FBSectionLabel>
      <FBBox label="thin (2px) · default (4px) · thick (6px)">
        <div style={{ display: "flex", flexDirection: "column", gap: 22, maxWidth: 480 }}>
          <div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: "var(--text-muted)", marginBottom: 6, fontVariantNumeric: "tabular-nums" }}>thin · 38%</div>
            <ProgressBar value={38} size="thin" />
          </div>
          <div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: "var(--text-muted)", marginBottom: 6, fontVariantNumeric: "tabular-nums" }}>default · 62%</div>
            <ProgressBar value={62} size="default" />
          </div>
          <div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: "var(--text-muted)", marginBottom: 6, fontVariantNumeric: "tabular-nums" }}>thick · 84%</div>
            <ProgressBar value={84} size="thick" />
          </div>
        </div>
      </FBBox>

      <FBSectionLabel>2 · Indeterminate — no measurable midpoint</FBSectionLabel>
      <FBBox label="default size · gradient-masked traveling segment">
        <div style={{ maxWidth: 480 }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: "var(--text-muted)", marginBottom: 6 }}>preparing export…</div>
          <ProgressBar indeterminate />
        </div>
      </FBBox>

      <FBSectionLabel>3 · Tone — status-coded for completion outcomes</FBSectionLabel>
      <FBBox label="brand (default) · success · warning · error">
        <div style={{ display: "flex", flexDirection: "column", gap: 18, maxWidth: 480 }}>
          {[
            { tone: "brand",   label: "Uploading",           value: 47 },
            { tone: "success", label: "Complete",            value: 100 },
            { tone: "warning", label: "Slow upload",         value: 38 },
            { tone: "error",   label: "Failed at 73%",       value: 73 },
          ].map((row) => (
            <div key={row.tone}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
                <span style={{ fontFamily: "var(--font-body-bold)", fontWeight: 700, fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.10em", color: "var(--text-muted)" }}>{row.label}</span>
                <span style={{ fontFamily: "var(--font-mono)", fontWeight: 500, fontSize: "0.78rem", color: "var(--text-primary)", fontVariantNumeric: "tabular-nums" }}>{row.value}%</span>
              </div>
              <ProgressBar value={row.value} tone={row.tone} />
            </div>
          ))}
        </div>
      </FBBox>

      <FBSectionLabel>4 · In context — card upload + form save</FBSectionLabel>
      <FBBox label="paired with metadata">
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ padding: 16, border: "1px solid var(--surface-border)", borderRadius: "var(--radius-md)", background: "var(--surface-raised)", maxWidth: 520 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <div>
                <div style={{ fontFamily: "var(--font-body-bold)", fontWeight: 700, fontSize: "0.86rem" }}>research-2026-q2.csv</div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: "var(--text-muted)" }}>14.2 MB of 24.8 MB</div>
              </div>
              <span style={{ fontFamily: "var(--font-mono)", fontWeight: 500, fontSize: "0.92rem", color: "var(--brand-primary)", fontVariantNumeric: "tabular-nums" }}>57%</span>
            </div>
            <ProgressBar value={57} />
          </div>
        </div>
      </FBBox>

      <FBSectionLabel>5 · On dark</FBSectionLabel>
      <FBBox dark label="determinate + indeterminate · on dark">
        <div style={{ display: "flex", flexDirection: "column", gap: 22, maxWidth: 480 }}>
          <ProgressBar value={62} dark />
          <ProgressBar indeterminate dark />
        </div>
      </FBBox>

      <FBSpecRow>
        <FBSpec label="Heights"   value="2 · 4 · 6px"        note="thin (inline) · default · thick (hero progress)." />
        <FBSpec label="Track"     value="surface-sunken"     note="Light: warm-neutral. Dark: white @ 16%." />
        <FBSpec label="Fill"      value="brand or status"    note="Tone prop maps to alerts vocabulary." />
        <FBSpec label="Animation" value="1.6s ease-in-out"   note="Indeterminate segment is 35% of track width." />
        <FBSpec label="Transition" value="width 240ms"       note="Determinate fill animates on value change." />
        <FBSpec label="Lineage"   value="Fluent 2 Web Progress-bar" note="Anatomy only · TUX type and color." />
      </FBSpecRow>
    </PageShell>
  );
}

// ════════════════════════════════════════════════════════════════════════
// Export to window
// ════════════════════════════════════════════════════════════════════════

window.ToastPage = ToastPage;
window.SpinnerPage = SpinnerPage;
window.ProgressBarPage = ProgressBarPage;
