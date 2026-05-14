/* global React, PageShell, LucideIcon, AGGIE_CATALOG */
/*
 * AggieButtonsAlerts.jsx — Buttons + Alerts families.
 *
 * BUTTONS — the action primitive. Deliberately unified across style
 * variants: Work Sans 700, uppercase, no radius, minimal chrome. The
 * button is the *constant* in this system; the signature appears on
 * section headers, not buttons.
 *
 *   Variants:   primary · secondary · ghost-link (italic + arrow)
 *   Sizes:      lg (60px) · md (48px) · sm (36px)
 *   Surfaces:   light / dark
 *   States:     default · hover · focus · disabled
 *
 * ALERTS — page-level messaging. The leading rule adopts the page's
 * style signature (hairline / stacked-bars / hashed). Icon + tone:
 *
 *   Tones:      info · success · warning · error
 *   Layouts:    banner (full-width) · inline (boxed)
 *   Dismissible close control optional.
 */

// ═══════════════════════════════════════════════════════════════════════
// BUTTONS
// ═══════════════════════════════════════════════════════════════════════

// The actual button component — renders every variant.
function AggieButton({
  variant = "primary",
  size = "md",
  dark = false,
  disabled = false,
  state = "default",   // default | hover | focus
  icon,                // optional lucide name trailing/leading
  iconLeading = false,
  children = "Button",
}) {
  const sizing = {
    lg: { height: 60, padX: 30, font: 15, iconSize: 16 },
    md: { height: 48, padX: 24, font: 13, iconSize: 14 },
    sm: { height: 36, padX: 18, font: 12, iconSize: 12 },
  }[size];

  // ── ghost / link variant — italic teal with trailing arrow
  if (variant === "ghost") {
    const color = disabled
      ? (dark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.3)")
      : (dark ? "#8BCAD8" : "#006483");
    return (
      <span style={{
        display: "inline-flex", alignItems: "center", gap: 8,
        fontFamily: "var(--font-bold)", fontSize: sizing.font, fontWeight: 700,
        fontStyle: "italic", textTransform: "uppercase", letterSpacing: "0.08em",
        color, textDecoration: state === "hover" ? "underline" : "none",
        textDecorationThickness: 2, textUnderlineOffset: 4,
        opacity: disabled ? 1 : 1, cursor: disabled ? "not-allowed" : "pointer",
        outline: state === "focus" ? `2px solid ${dark ? "#DDAC37" : "#5C0025"}` : "none",
        outlineOffset: 4,
      }}>
        {children}
        <LucideIcon name="arrow-right" size={sizing.iconSize} color={color} />
      </span>
    );
  }

  // ── primary + secondary share the box model
  const isPrimary = variant === "primary";

  let bg, fg, border;
  if (isPrimary) {
    if (disabled) {
      bg = dark ? "rgba(221,172,55,0.3)" : "rgba(92,0,37,0.35)";
      fg = dark ? "rgba(42,14,21,0.6)" : "rgba(255,255,255,0.7)";
    } else {
      bg = dark ? "#DDAC37" : "#5C0025";
      fg = dark ? "#2A0E15" : "#fff";
      if (state === "hover") bg = dark ? "#C89929" : "#420019";
    }
    border = "none";
  } else {
    // secondary / outline
    const edge = dark ? "#fff" : "#5C0025";
    bg = state === "hover"
      ? (dark ? "rgba(255,255,255,0.08)" : "rgba(92,0,37,0.06)")
      : "transparent";
    fg = disabled
      ? (dark ? "rgba(255,255,255,0.4)" : "rgba(92,0,37,0.4)")
      : edge;
    border = `2px solid ${disabled ? (dark ? "rgba(255,255,255,0.4)" : "rgba(92,0,37,0.4)") : edge}`;
  }

  const showIcon = icon && size !== "sm" ? true : !!icon;

  return (
    <span style={{
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      gap: 10,
      height: sizing.height, padding: `0 ${sizing.padX}px`,
      background: bg, color: fg, border,
      fontFamily: "var(--font-bold)", fontSize: sizing.font, fontWeight: 700,
      textTransform: "uppercase", letterSpacing: "0.08em",
      cursor: disabled ? "not-allowed" : "pointer", userSelect: "none",
      outline: state === "focus" ? `3px solid ${dark ? "#DDAC37" : "#5C0025"}` : "none",
      outlineOffset: 3,
      whiteSpace: "nowrap",
      transition: "background 120ms ease",
    }}>
      {showIcon && iconLeading && <LucideIcon name={icon} size={sizing.iconSize} color={fg} />}
      {children}
      {showIcon && !iconLeading && <LucideIcon name={icon} size={sizing.iconSize} color={fg} />}
    </span>
  );
}

// ── layout helpers ─────────────────────────────────────────────────────
function BtnBox({ dark = false, label, children, columns = 3 }) {
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
      <div style={{
        padding: "26px 28px", background: dark ? "var(--brand-primary)" : "#fff",
        display: "grid", gridTemplateColumns: `repeat(${columns}, auto)`, columnGap: 24, rowGap: 18,
        alignItems: "center", justifyContent: "start",
      }}>
        {children}
      </div>
    </div>
  );
}

function MiniLabel({ children, dark }) {
  return (
    <div style={{
      fontSize: "0.58rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em",
      color: dark ? "rgba(255,255,255,0.55)" : "var(--text-muted)",
      fontFamily: "var(--font-body-bold)", alignSelf: "center",
    }}>{children}</div>
  );
}

function ButtonsPage() {
  const item = (window.AGGIE_CATALOG || []).find(c => c.id === "buttons");
  return (
    <PageShell item={item}>
      <div style={{ padding: "16px 20px", marginBottom: 28, background: "color-mix(in srgb, var(--brand-primary) 5%, transparent)", borderLeft: "3px solid var(--brand-primary)", borderRadius: "0 var(--radius-sm) var(--radius-sm) 0", fontSize: "0.92rem", lineHeight: 1.65, color: "var(--text-secondary)" }}>
        <strong>Buttons are the constant.</strong> Unlike every other family in this kit, buttons do <em>not</em> change across style variants — they're always Work Sans 700, uppercase, no radius. The signature expresses itself on section headers and page headers; buttons stay locked so the rhythm of the page reads cleanly. Three variants × three sizes × two surfaces × four states.
      </div>

      {/* ─── Variants (lg) ──────────────────────────────────── */}
      <BASectionLabel>Variants · large (60px)</BASectionLabel>
      <BtnBox dark={false} label="Primary · Secondary · Ghost link" columns={4}>
        <MiniLabel>primary</MiniLabel>
        <AggieButton variant="primary" size="lg">Submit</AggieButton>
        <AggieButton variant="secondary" size="lg">Submit</AggieButton>
        <AggieButton variant="ghost" size="lg">Read more</AggieButton>
      </BtnBox>
      <BtnBox dark={true} label="Primary · Secondary · Ghost link" columns={4}>
        <MiniLabel dark>primary</MiniLabel>
        <AggieButton variant="primary" size="lg" dark>Submit</AggieButton>
        <AggieButton variant="secondary" size="lg" dark>Submit</AggieButton>
        <AggieButton variant="ghost" size="lg" dark>Read more</AggieButton>
      </BtnBox>

      {/* ─── Sizes ──────────────────────────────────── */}
      <BASectionLabel>Sizes · lg / md / sm</BASectionLabel>
      <BtnBox dark={false} label="Primary, three sizes" columns={4}>
        <MiniLabel>lg / md / sm</MiniLabel>
        <AggieButton variant="primary" size="lg">Button</AggieButton>
        <AggieButton variant="primary" size="md">Button</AggieButton>
        <AggieButton variant="primary" size="sm">Button</AggieButton>
      </BtnBox>
      <BtnBox dark={false} label="Secondary, three sizes" columns={4}>
        <MiniLabel>lg / md / sm</MiniLabel>
        <AggieButton variant="secondary" size="lg">Button</AggieButton>
        <AggieButton variant="secondary" size="md">Button</AggieButton>
        <AggieButton variant="secondary" size="sm">Button</AggieButton>
      </BtnBox>

      {/* ─── With icons ──────────────────────────────────── */}
      <BASectionLabel>With icons · trailing default, leading when it's a verb action</BASectionLabel>
      <BtnBox dark={false} label="Icon usage" columns={4}>
        <MiniLabel>trailing</MiniLabel>
        <AggieButton variant="primary" size="md" icon="arrow-right">Continue</AggieButton>
        <AggieButton variant="secondary" size="md" icon="external-link">View report</AggieButton>
        <AggieButton variant="primary" size="md" icon="download" iconLeading>Download PDF</AggieButton>
      </BtnBox>

      {/* ─── States ──────────────────────────────────── */}
      <BASectionLabel>States · default · hover · focus · disabled</BASectionLabel>
      <BtnBox dark={false} label="Primary across states" columns={5}>
        <MiniLabel>primary</MiniLabel>
        <AggieButton variant="primary" size="md">Default</AggieButton>
        <AggieButton variant="primary" size="md" state="hover">Hover</AggieButton>
        <AggieButton variant="primary" size="md" state="focus">Focus</AggieButton>
        <AggieButton variant="primary" size="md" disabled>Disabled</AggieButton>
      </BtnBox>
      <BtnBox dark={false} label="Secondary across states" columns={5}>
        <MiniLabel>secondary</MiniLabel>
        <AggieButton variant="secondary" size="md">Default</AggieButton>
        <AggieButton variant="secondary" size="md" state="hover">Hover</AggieButton>
        <AggieButton variant="secondary" size="md" state="focus">Focus</AggieButton>
        <AggieButton variant="secondary" size="md" disabled>Disabled</AggieButton>
      </BtnBox>
      <BtnBox dark={false} label="Ghost link across states" columns={5}>
        <MiniLabel>ghost</MiniLabel>
        <AggieButton variant="ghost" size="md">Default</AggieButton>
        <AggieButton variant="ghost" size="md" state="hover">Hover</AggieButton>
        <AggieButton variant="ghost" size="md" state="focus">Focus</AggieButton>
        <AggieButton variant="ghost" size="md" disabled>Disabled</AggieButton>
      </BtnBox>

      <BASpecRow>
        <BASpec label="Font" value="Work Sans 700" note="always — regardless of page style" />
        <BASpec label="Case" value="UPPERCASE" note="0.08em letterspacing" />
        <BASpec label="Radius" value="0" note="never rounded — keeps the editorial rhythm" />
        <BASpec label="Hit target" value="≥36px" note="small is the absolute minimum" />
      </BASpecRow>

      <BASpecRow>
        <BASpec label="Light primary" value="#5C0025 · #fff" note="maroon fill, white text" />
        <BASpec label="Dark primary" value="#DDAC37 · #2A0E15" note="gold fill, deep-maroon text" />
        <BASpec label="Secondary edge" value="2px solid" note="maroon on light, white on dark" />
        <BASpec label="Focus ring" value="3px outline" note="maroon on light, gold on dark, 3px offset" />
      </BASpecRow>
    </PageShell>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// ALERTS
// ═══════════════════════════════════════════════════════════════════════

// Leading-rule signature (3 variants, vertical, 4px wide)
function AlertSig({ style, tone, onDark }) {
  const toneColor = {
    info:    onDark ? "#8BCAD8" : "#006483",
    success: onDark ? "#97D498" : "#2D6B2F",
    warning: onDark ? "#F0B849" : "#8A5C00",
    error:   onDark ? "#EAA19B" : "#9A1F1A",
  }[tone];

  if (style === "bold") {
    // stacked bars — rotated version: 3 thick segments, decreasing opacity, stacked vertical
    return (
      <div style={{ width: 6, display: "flex", flexDirection: "column", gap: 3, paddingTop: 4 }}>
        <span style={{ display: "block", width: 6, height: 40, borderRadius: 3, background: toneColor }} />
        <span style={{ display: "block", width: 6, height: 14, borderRadius: 3, background: toneColor, opacity: 0.5 }} />
        <span style={{ display: "block", width: 6, height: 6,  borderRadius: 3, background: toneColor, opacity: 0.25 }} />
      </div>
    );
  }
  if (style === "elegant") {
    return (
      <div style={{
        width: 8, alignSelf: "stretch",
        backgroundImage: `repeating-linear-gradient(45deg, ${toneColor} 0 1.2px, transparent 1.2px 6px)`,
        WebkitMaskImage: "linear-gradient(180deg, transparent 0%, black 15%, black 85%, transparent 100%)",
        maskImage: "linear-gradient(180deg, transparent 0%, black 15%, black 85%, transparent 100%)",
        opacity: 0.85,
      }} />
    );
  }
  // default: hairline fade
  return (
    <div style={{
      width: 2, alignSelf: "stretch",
      background: `linear-gradient(180deg, transparent 0%, ${toneColor} 15%, ${toneColor} 85%, transparent 100%)`,
      opacity: 0.9,
    }} />
  );
}

function AggieAlert({
  tone = "info",
  style = "default",
  layout = "inline",      // inline | banner
  dismissible = true,
  dark = false,
  title,
  children,
}) {
  const onDark = dark;

  const toneMap = {
    info:    { label: "Info",    icon: "info",          fg: onDark ? "#8BCAD8" : "#006483", tint: onDark ? "rgba(139,202,216,0.1)" : "rgba(0,100,131,0.06)" },
    success: { label: "Success", icon: "check-circle",  fg: onDark ? "#97D498" : "#2D6B2F", tint: onDark ? "rgba(151,212,152,0.1)" : "rgba(45,107,47,0.06)" },
    warning: { label: "Warning", icon: "alert-triangle",fg: onDark ? "#F0B849" : "#8A5C00", tint: onDark ? "rgba(240,184,73,0.12)" : "rgba(138,92,0,0.07)" },
    error:   { label: "Error",   icon: "alert-octagon", fg: onDark ? "#EAA19B" : "#9A1F1A", tint: onDark ? "rgba(234,161,155,0.12)" : "rgba(154,31,26,0.06)" },
  }[tone];

  const textPrimary = onDark ? "#fff" : "var(--text-primary)";
  const textSecondary = onDark ? "rgba(255,255,255,0.78)" : "var(--text-secondary)";

  return (
    <div style={{
      display: "flex", alignItems: "stretch",
      background: layout === "banner" ? (onDark ? "rgba(255,255,255,0.04)" : toneMap.tint) : (onDark ? "rgba(255,255,255,0.04)" : "#fff"),
      border: layout === "inline" ? `1px solid ${onDark ? "rgba(255,255,255,0.15)" : "var(--surface-border)"}` : "none",
      padding: 0,
    }}>
      {/* Leading signature rule */}
      <AlertSig style={style} tone={tone} onDark={onDark} />

      {/* Content */}
      <div style={{ flex: 1, padding: "16px 18px 16px 18px", display: "flex", gap: 14, alignItems: "flex-start" }}>
        <div style={{ flexShrink: 0, paddingTop: 1 }}>
          <LucideIcon name={toneMap.icon} size={20} color={toneMap.fg} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontFamily: "var(--font-bold)", fontWeight: 700,
            fontSize: 11, textTransform: "uppercase", letterSpacing: "0.12em",
            color: toneMap.fg, marginBottom: 4,
          }}>{toneMap.label}</div>
          {title && (
            <div style={{
              fontFamily: "var(--font-bold)", fontWeight: 700, fontSize: 15,
              color: textPrimary, marginBottom: children ? 4 : 0, lineHeight: 1.3,
            }}>{title}</div>
          )}
          {children && (
            <div style={{
              fontFamily: "var(--font-body)", fontSize: 13.5, lineHeight: 1.55,
              color: textSecondary,
            }}>{children}</div>
          )}
        </div>
        {dismissible && (
          <button style={{
            flexShrink: 0, width: 28, height: 28, border: "none", background: "transparent",
            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
            marginTop: -4, marginRight: -6,
          }}>
            <LucideIcon name="x" size={16} color={onDark ? "rgba(255,255,255,0.65)" : "var(--text-muted)"} />
          </button>
        )}
      </div>
    </div>
  );
}

// ─── CompactAlert ────────────────────────────────────────────────────
// Lineage: Base Gallery Banner (INF-4 sanity baseline).
// Base ships a soft tinted-card alert with no left-border accent, no rule, no
// eyebrow — just a circle icon + headline/body + optional pill action.
// We adopt that anatomy as the UTILITY variant of the alert family:
//   • Use this for dashboard rows, settings panels, inline form responses —
//     anywhere TUX's editorial alert (with signature rule + eyebrow + tone
//     label) is too loud for the surface.
//   • Hierarchy=Low → white card outline with tinted icon disc.
//   • Hierarchy=High → fully tinted card surface, icon disc reverses to white.
// Identity stays TUX: maroon accent, Work Sans 700 caps for action label,
// no Uber Move, no rgb(40,40,40) Base black.
function CompactAlert({ tone = "info", hierarchy = "low", title, children, action, onAction, dark = false }) {
  const toneMap = {
    info:    { fg: dark ? "#8BCAD8" : "#006483", tint: dark ? "rgba(139,202,216,0.16)" : "#E8F1F4", icon: "info" },
    success: { fg: dark ? "#97D498" : "#2D6B2F", tint: dark ? "rgba(151,212,152,0.16)" : "#E8F3E9", icon: "check-circle" },
    warning: { fg: dark ? "#F0B849" : "#8A5C00", tint: dark ? "rgba(240,184,73,0.18)" : "#FAEFD4", icon: "alert-triangle" },
    error:   { fg: dark ? "#EAA19B" : "#9A1F1A", tint: dark ? "rgba(234,161,155,0.18)" : "#F8E3E1", icon: "alert-octagon" },
  }[tone];

  const isHigh = hierarchy === "high";
  const bg = isHigh ? toneMap.tint : (dark ? "rgba(255,255,255,0.04)" : "#FFFFFF");
  const border = isHigh ? "1px solid transparent" : `1px solid ${dark ? "rgba(255,255,255,0.12)" : "var(--surface-border)"}`;
  const discBg = isHigh ? (dark ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.6)") : toneMap.tint;
  const textPrimary = dark ? "#FFFFFF" : "var(--text-primary)";
  const textSecondary = dark ? "rgba(255,255,255,0.78)" : "var(--text-secondary)";

  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 12,
      padding: "10px 12px",
      background: bg, border, borderRadius: 12,
      fontFamily: "var(--font-body)",
    }}>
      <div style={{
        flexShrink: 0, width: 36, height: 36, borderRadius: "50%",
        background: discBg,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <LucideIcon name={toneMap.icon} size={18} color={toneMap.fg} strokeWidth={2.25} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        {title ? (
          <div style={{
            fontFamily: "var(--font-body-bold)", fontWeight: 700, fontSize: 14, lineHeight: 1.3,
            color: textPrimary, marginBottom: children ? 2 : 0,
            whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
          }}>{title}</div>
        ) : null}
        {children ? (
          <div style={{
            fontSize: 13, lineHeight: 1.45,
            color: textSecondary,
          }}>{children}</div>
        ) : null}
      </div>
      {action ? (
        <button onClick={onAction} style={{
          flexShrink: 0,
          padding: "6px 12px", height: 32,
          background: isHigh ? (dark ? "var(--brand-accent)" : "var(--brand-primary)") : "transparent",
          color: isHigh ? (dark ? "var(--brand-primary)" : "#FFFFFF") : toneMap.fg,
          border: isHigh ? "none" : `1px solid ${toneMap.fg}`,
          borderRadius: 999,
          fontFamily: "var(--font-body-bold)", fontWeight: 700, fontSize: "0.7rem",
          textTransform: "uppercase", letterSpacing: "0.10em",
          cursor: "pointer",
        }}>{action}</button>
      ) : null}
    </div>
  );
}

function AlertBox({ dark = false, label, children }) {
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
      <div style={{ padding: 24, background: dark ? "var(--brand-primary)" : "var(--surface-page)", display: "flex", flexDirection: "column", gap: 14 }}>
        {children}
      </div>
    </div>
  );
}

function AlertsPage() {
  const item = (window.AGGIE_CATALOG || []).find(c => c.id === "alerts");
  return (
    <PageShell item={item}>
      <div style={{ padding: "16px 20px", marginBottom: 28, background: "color-mix(in srgb, var(--brand-primary) 5%, transparent)", borderLeft: "3px solid var(--brand-primary)", borderRadius: "0 var(--radius-sm) var(--radius-sm) 0", fontSize: "0.92rem", lineHeight: 1.65, color: "var(--text-secondary)" }}>
        Page-level messaging. Four tones × two layouts, with the <strong>leading rule adopting the page's style signature</strong> — so a bold-style page gets alerts with stacked-bar rules, an elegant page gets hashed rules, etc. Tone color carries through the rule, icon, and eyebrow label.
      </div>

      {/* All four tones, default style */}
      <BASectionLabel>Four tones · default style · inline layout</BASectionLabel>
      <AlertBox dark={false} label="Inline alerts · each with eyebrow + title + body">
        <AggieAlert tone="info"    style="default" title="Quarterly review begins Monday">New submissions can be filed through the research portal until 5 p.m. Friday.</AggieAlert>
        <AggieAlert tone="success" style="default" title="Report submitted">Your 2025 Q3 connected-vehicle pilot report was received and assigned #CV-2025-0431.</AggieAlert>
        <AggieAlert tone="warning" style="default" title="Unsaved changes">You have uncommitted edits to this page. Save or discard them before navigating away.</AggieAlert>
        <AggieAlert tone="error"   style="default" title="Upload failed">The attached file exceeded the 25 MB limit. Compress or split the file and retry.</AggieAlert>
      </AlertBox>

      {/* Style signature variants */}
      <BASectionLabel>Signature rule adapts to page style</BASectionLabel>
      <AlertBox dark={false} label="Same info alert, three style contexts">
        <AggieAlert tone="info" style="default" title="Default style · hairline fade">Hairline rule that fades at top + bottom. Matches the section-header pattern.</AggieAlert>
        <AggieAlert tone="info" style="bold" title="Bold style · stacked bars">Three decreasing bars — the signature used on bold-style section headers.</AggieAlert>
        <AggieAlert tone="info" style="elegant" title="Elegant style · soft-faded hash">Diagonal hash pattern with a soft fade, Georgia-adjacent feel.</AggieAlert>
      </AlertBox>

      {/* Dark surface */}
      <BASectionLabel>On dark surface</BASectionLabel>
      <AlertBox dark={true} label="Four tones on brand maroon">
        <AggieAlert tone="info"    style="default" dark title="Quarterly review begins Monday">New submissions can be filed through the research portal until 5 p.m. Friday.</AggieAlert>
        <AggieAlert tone="success" style="default" dark title="Report submitted">Your 2025 Q3 connected-vehicle pilot report was received and assigned #CV-2025-0431.</AggieAlert>
        <AggieAlert tone="warning" style="default" dark title="Unsaved changes">You have uncommitted edits to this page. Save or discard them before navigating away.</AggieAlert>
        <AggieAlert tone="error"   style="default" dark title="Upload failed">The attached file exceeded the 25 MB limit. Compress or split the file and retry.</AggieAlert>
      </AlertBox>

      {/* Banner variants */}
      <BASectionLabel>Banner layout · full-width, tinted background, no border</BASectionLabel>
      <AlertBox dark={false} label="Banner uses tone-tinted background instead of border">
        <AggieAlert tone="warning" layout="banner" style="bold" title="Scheduled maintenance — Saturday 2–4 a.m.">Portal uploads and report downloads will be briefly unavailable during the window.</AggieAlert>
        <AggieAlert tone="info"    layout="banner" style="default" title="New version of the style guide">Version 2.3 introduces the elegant style variant. See the migration notes for details.</AggieAlert>
      </AlertBox>

      {/* Compact title-only */}
      <BASectionLabel>Compact · title only, no body, non-dismissible</BASectionLabel>
      <AlertBox dark={false} label="For toast-style and inline-form use">
        <AggieAlert tone="success" style="default" dismissible={false} title="Settings saved" />
        <AggieAlert tone="error"   style="default" dismissible={false} title="Connection interrupted — retrying…" />
      </AlertBox>

      {/* Utility / compact (Base-anatomy) */}
      <BASectionLabel>Utility alert · soft tinted card · Base-anatomy</BASectionLabel>
      <div style={{ padding: "12px 16px", marginBottom: 14, background: "color-mix(in srgb, var(--brand-accent) 12%, transparent)", borderRadius: "var(--radius-sm)", fontSize: "0.84rem", lineHeight: 1.5, color: "var(--text-secondary)" }}>
        For dashboard rows, settings panels, and inline form responses where the
        editorial alert (signature rule + eyebrow + tone label) is too loud.
        Soft 12-radius tinted card, circle icon disc, optional pill action.
        Hierarchy=<em>Low</em> (bordered white card) vs <em>High</em> (tinted
        surface).
      </div>
      <AlertBox dark={false} label="Hierarchy=Low · bordered white card with tinted icon disc">
        <CompactAlert tone="info"    title="Quarterly review starts Monday">Submissions close Friday at 5 p.m.</CompactAlert>
        <CompactAlert tone="success" title="Saved · synced to the workspace" action="Undo" />
        <CompactAlert tone="warning" title="Two corridors are missing AADT data" action="Review" />
        <CompactAlert tone="error"   title="Couldn't reach TxDOT API · using cached data" action="Retry" />
      </AlertBox>
      <AlertBox dark={false} label="Hierarchy=High · fully tinted surface, no border">
        <CompactAlert tone="info"    hierarchy="high" title="Quarterly review starts Monday">Submissions close Friday at 5 p.m.</CompactAlert>
        <CompactAlert tone="success" hierarchy="high" title="Saved · synced to the workspace" action="Undo" />
        <CompactAlert tone="warning" hierarchy="high" title="Two corridors are missing AADT data" action="Review" />
        <CompactAlert tone="error"   hierarchy="high" title="Couldn't reach TxDOT API · using cached data" action="Retry" />
      </AlertBox>
      <AlertBox dark={true} label="Hierarchy=High · on dark surface">
        <CompactAlert dark tone="info"    hierarchy="high" title="Export queued" action="Watch" />
        <CompactAlert dark tone="success" hierarchy="high" title="Connection restored" />
        <CompactAlert dark tone="warning" hierarchy="high" title="Two corridors are missing AADT data" />
        <CompactAlert dark tone="error"   hierarchy="high" title="Validation failed · 38 rows flagged" action="Open" />
      </AlertBox>

      <BASpecRow>
        <BASpec label="Tones" value="info · success · warning · error" note="tone color applies to rule, icon, eyebrow label" />
        <BASpec label="Rule width" value="2 / 6 / 8px" note="default / bold / elegant (editorial variants only)" />
        <BASpec label="Layouts" value="inline · banner · utility" note="inline = bordered · banner = tinted bleed · utility = soft 12-radius (Base)" />
        <BASpec label="Eyebrow" value="Work Sans 700" note="tone-colored, 0.12em tracking, 11px · skipped on utility variant" />
        <BASpec label="Utility action" value="pill button" note="Tinted-outline (Low) or filled (High); Work Sans 700 caps." />
        <BASpec label="Lineage" value="Base Gallery Banner" note="Utility variant anatomy only · TUX type, maroon, no soft black." />
      </BASpecRow>
    </PageShell>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// SHARED SECTION/SPEC HELPERS — duplicate from PageHeaders for now; these
// are intentionally small and co-located for self-contained page files.
// ═══════════════════════════════════════════════════════════════════════

function BASectionLabel({ children }) {
  return (
    <div style={{
      fontSize: "0.62rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em",
      color: "var(--text-muted)", fontFamily: "var(--font-body-bold)", marginBottom: 12, marginTop: 16,
    }}>{children}</div>
  );
}

function BASpecRow({ children }) {
  return (
    <div style={{
      marginTop: 28, padding: "14px 18px", border: "1px solid var(--surface-border)",
      borderRadius: "var(--radius-md)", background: "var(--surface-raised)",
      display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: 16,
    }}>{children}</div>
  );
}

function BASpec({ label, value, note }) {
  return (
    <div>
      <div style={{ fontSize: "0.6rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-muted)", fontFamily: "var(--font-body-bold)" }}>{label}</div>
      <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem", color: "var(--brand-primary)", marginTop: 3, fontWeight: 500 }}>{value}</div>
      {note && <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: 2, lineHeight: 1.4 }}>{note}</div>}
    </div>
  );
}


Object.assign(window, { ButtonsPage, AlertsPage, AggieButton, AggieAlert });
