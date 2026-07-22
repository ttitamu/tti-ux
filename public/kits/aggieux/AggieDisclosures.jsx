/* global React, PageShell, AGGIE_CATALOG, LucideIcon */
/*
 * AggieDisclosures.jsx — Batch A.1: Hover & focus disclosures.
 *
 *   Tooltip   — Short, single-line hint that appears on hover/focus.
 *               No interactive content inside. Auto-dismisses on blur.
 *               Used for icon buttons, disabled controls, abbreviations.
 *
 *   Popover   — Rich, interactive disclosure with click trigger. May
 *               contain headings, formatted body, and a link/CTA. Holds
 *               focus when opened; dismissed on outside-click or Esc.
 *
 * Both are *anchored* to a trigger element. The library renders four
 * placement variants (top / right / bottom / left) and an arrow that
 * inherits the panel's surface color.
 *
 * Helper prefix: TP (Tooltip-Popover).
 *
 * Style behavior: tooltips are voiceless — they always use the default
 * style. Popovers can adopt the parent surface's style for header
 * treatment. We document this on the page.
 */

// ════════════════════════════════════════════════════════════════════════
// Shared helpers (TP prefix)
// ════════════════════════════════════════════════════════════════════════

function TPBox({ dark = false, label, padded = true, children }) {
  return (
    <div style={{ border: "1px solid var(--surface-border)", borderRadius: "var(--radius-md)", overflow: "hidden", marginBottom: 16 }}>
      <div style={{
        padding: "7px 14px", fontSize: "0.62rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em",
        color: dark ? "rgba(255,255,255,0.85)" : "var(--text-muted)", fontFamily: "var(--font-body-bold)",
        background: dark ? "var(--brand-primary)" : "var(--surface-sunken)",
        borderBottom: "1px solid var(--surface-border)", display: "flex", justifyContent: "space-between",
      }}>
        <span>{label}</span>
        <span style={{ fontFamily: "var(--font-mono)", fontWeight: 500, opacity: 0.7 }}>on {dark ? "dark" : "light"}</span>
      </div>
      <div style={{ padding: padded ? 40 : 0, background: dark ? "var(--brand-primary)" : "var(--surface-page)", minHeight: 220 }}>{children}</div>
    </div>
  );
}

function TPSectionLabel({ children }) {
  return (
    <div style={{ fontSize: "0.62rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--text-muted)", fontFamily: "var(--font-body-bold)", marginBottom: 12, marginTop: 28 }}>{children}</div>
  );
}

function TPSpecRow({ children }) {
  return (
    <div style={{ marginTop: 28, padding: "14px 18px", border: "1px solid var(--surface-border)", borderRadius: "var(--radius-md)", background: "var(--surface-raised)", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>{children}</div>
  );
}

function TPSpec({ label, value, note }) {
  return (
    <div>
      <div style={{ fontSize: "0.6rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-muted)", fontFamily: "var(--font-body-bold)" }}>{label}</div>
      <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem", color: "var(--brand-primary)", marginTop: 3, fontWeight: 500 }}>{value}</div>
      {note && <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: 2, lineHeight: 1.4 }}>{note}</div>}
    </div>
  );
}

function TPIntro({ children }) {
  return (
    <div style={{ padding: "16px 20px", marginBottom: 28, background: "color-mix(in srgb, var(--brand-primary) 5%, transparent)", borderLeft: "3px solid var(--brand-primary)", borderRadius: "0 var(--radius-sm) var(--radius-sm) 0", fontSize: "0.92rem", lineHeight: 1.65, color: "var(--text-secondary)" }}>
      {children}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════
// Tooltip — single-line, transient hint
// ════════════════════════════════════════════════════════════════════════

/* The tooltip is a small dark panel + arrow. We render it as if always
 * visible so it can be reviewed; production behavior is hover/focus
 * after a 350ms delay, with a 100ms hide-debounce. */
function TPTooltip({ placement = "top", text, dark = false }) {
  const arrowStyle = {
    position: "absolute",
    width: 8, height: 8,
    background: "var(--text-primary)",
    transform: "rotate(45deg)",
  };
  const arrowPosition = {
    top:    { left: "50%", marginLeft: -4, bottom: -4 },
    bottom: { left: "50%", marginLeft: -4, top: -4 },
    left:   { top: "50%", marginTop: -4, right: -4 },
    right:  { top: "50%", marginTop: -4, left: -4 },
  }[placement];

  return (
    <div
      role="tooltip"
      style={{
        position: "absolute",
        background: dark ? "var(--surface-raised)" : "var(--text-primary)",
        color: dark ? "var(--text-primary)" : "var(--surface-raised)",
        padding: "5px 9px",
        borderRadius: "var(--radius-sm)",
        fontSize: "0.78rem",
        fontFamily: "var(--font-body)",
        fontWeight: 500,
        whiteSpace: "nowrap",
        boxShadow: "var(--shadow-md)",
        zIndex: 2,
        ...({
          top:    { bottom: "calc(100% + 8px)", left: "50%", transform: "translateX(-50%)" },
          bottom: { top: "calc(100% + 8px)", left: "50%", transform: "translateX(-50%)" },
          left:   { right: "calc(100% + 8px)", top: "50%", transform: "translateY(-50%)" },
          right:  { left: "calc(100% + 8px)", top: "50%", transform: "translateY(-50%)" },
        }[placement]),
      }}
    >
      {text}
      <span style={{ ...arrowStyle, ...arrowPosition, background: dark ? "var(--surface-raised)" : "var(--text-primary)" }} />
    </div>
  );
}

/* A single trigger + tooltip pair, centered in its box so all four
 * placements have room to render without clipping. */
function TPTooltipDemo({ placement, text, dark = false }) {
  return (
    <div style={{ position: "relative", display: "inline-flex", alignItems: "center", justifyContent: "center", margin: "40px 60px" }}>
      <button
        style={{
          width: 38, height: 38, borderRadius: "var(--radius-sm)",
          border: `1px solid ${dark ? "rgba(255,255,255,0.25)" : "var(--surface-border)"}`,
          background: dark ? "color-mix(in srgb, white 8%, transparent)" : "var(--surface-raised)",
          color: dark ? "rgba(255,255,255,0.92)" : "var(--text-primary)",
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", padding: 0,
        }}
        aria-label={text}
      >
        <LucideIcon name="info" size={16} />
      </button>
      <TPTooltip placement={placement} text={text} dark={dark} />
    </div>
  );
}

/* Specialty: tooltip attached to a *disabled* button. The wrapper handles
 * pointer events because disabled controls don't fire them. */
function TPDisabledTooltipDemo() {
  return (
    <div style={{ position: "relative", display: "inline-flex", alignItems: "center", justifyContent: "center", margin: "44px 0 36px" }}>
      <span style={{ display: "inline-block", position: "relative" }}>
        <button
          disabled
          style={{
            padding: "10px 18px",
            border: "1px solid var(--surface-border)",
            background: "var(--surface-sunken)",
            color: "var(--text-muted)",
            fontFamily: "var(--font-body-bold)", fontWeight: 700,
            fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: "0.08em",
            borderRadius: "var(--radius-sm)",
            cursor: "not-allowed",
          }}
        >
          Submit for review
        </button>
        <TPTooltip placement="top" text="Add at least one reviewer first." />
      </span>
    </div>
  );
}

/* Specialty: abbreviation/acronym definition. */
function TPAbbrDemo() {
  return (
    <div style={{ fontSize: "0.95rem", lineHeight: 1.65, color: "var(--text-secondary)", margin: 0, maxWidth: 540, textAlign: "center" }}>
      Submitted to the{" "}
      <span style={{ position: "relative", display: "inline-block" }}>
        <abbr
          title="Texas Department of Transportation"
          style={{
            textDecoration: "underline dotted var(--text-muted)",
            textUnderlineOffset: 3,
            cursor: "help",
            color: "var(--text-primary)",
            fontWeight: 600,
          }}
        >
          TxDOT
        </abbr>
        <TPTooltip placement="top" text="Texas Department of Transportation" />
      </span>{" "}
      Research and Technology Implementation office for review.
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════
// Popover — rich, focus-trapping disclosure
// ════════════════════════════════════════════════════════════════════════

function TPPopover({ title, children, footer, width = 280, placement = "bottom" }) {
  const arrowPosition = {
    top:    { left: "50%", marginLeft: -6, bottom: -6 },
    bottom: { left: "50%", marginLeft: -6, top: -6 },
    left:   { top: "50%", marginTop: -6, right: -6 },
    right:  { top: "50%", marginTop: -6, left: -6 },
  }[placement];

  const panelOffset = {
    top:    { bottom: "calc(100% + 12px)", left: "50%", transform: "translateX(-50%)" },
    bottom: { top: "calc(100% + 12px)", left: "50%", transform: "translateX(-50%)" },
    left:   { right: "calc(100% + 12px)", top: "50%", transform: "translateY(-50%)" },
    right:  { left: "calc(100% + 12px)", top: "50%", transform: "translateY(-50%)" },
  }[placement];

  return (
    <div
      role="dialog"
      style={{
        position: "absolute",
        width,
        background: "var(--surface-raised)",
        border: "1px solid var(--surface-border)",
        borderRadius: "var(--radius-md)",
        boxShadow: "var(--shadow-lg)",
        zIndex: 2,
        ...panelOffset,
      }}
    >
      {/* Arrow */}
      <span style={{
        position: "absolute", width: 12, height: 12,
        background: "var(--surface-raised)",
        borderTop: "1px solid var(--surface-border)",
        borderLeft: "1px solid var(--surface-border)",
        transform: {
          top: "rotate(225deg)",
          bottom: "rotate(45deg)",
          left: "rotate(135deg)",
          right: "rotate(-45deg)",
        }[placement],
        ...arrowPosition,
      }} />

      <div style={{ padding: "14px 16px 12px", borderBottom: "1px solid var(--surface-border)" }}>
        <div style={{ fontSize: "0.62rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--text-muted)", fontFamily: "var(--font-body-bold)", marginBottom: 4 }}>
          definition
        </div>
        <div style={{ fontFamily: "var(--font-display)", fontSize: "0.98rem", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.01em", color: "var(--text-primary)" }}>
          {title}
        </div>
      </div>
      <div style={{ padding: "12px 16px 14px", fontSize: "0.85rem", lineHeight: 1.55, color: "var(--text-secondary)" }}>
        {children}
      </div>
      {footer && (
        <div style={{ padding: "10px 16px", borderTop: "1px solid var(--surface-border)", background: "var(--surface-sunken)", borderRadius: "0 0 var(--radius-md) var(--radius-md)" }}>
          {footer}
        </div>
      )}
    </div>
  );
}

function TPPopoverDemo() {
  return (
    <div style={{ position: "relative", display: "inline-flex", alignItems: "center", justifyContent: "center", margin: "32px 0 110px" }}>
      <span style={{ position: "relative", display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 10px 6px 12px", border: "1px solid var(--surface-border)", borderRadius: "var(--radius-sm)", background: "var(--surface-raised)", cursor: "pointer", fontSize: "0.85rem", color: "var(--text-primary)" }}>
        Free-flow speed
        <LucideIcon name="info" size={14} />
        <TPPopover
          title="Free-flow speed"
          placement="bottom"
          footer={
            <a href="#" onClick={(e) => e.preventDefault()} style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--brand-primary)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 4 }}>
              See methodology <LucideIcon name="arrow-right" size={12} />
            </a>
          }
        >
          The speed at which a driver feels comfortable traveling under low-volume conditions and without geometric constraint. Measured at the 85th percentile.
        </TPPopover>
      </span>
    </div>
  );
}

/* Hover-card variant — opens on hover (with delay) rather than click. Used
 * for inline person/citation links. */
function TPHoverCardDemo() {
  return (
    <div style={{ fontSize: "0.95rem", lineHeight: 1.7, color: "var(--text-secondary)", margin: 0, maxWidth: 580, textAlign: "left", position: "relative" }}>
      Initial findings were presented by{" "}
      <span style={{ position: "relative", display: "inline-block" }}>
        <a href="#" onClick={(e) => e.preventDefault()} style={{ color: "var(--brand-primary)", fontWeight: 600, textDecoration: "underline", textDecorationStyle: "dotted", textUnderlineOffset: 3 }}>
          Dr. M. Alvarez
        </a>
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 10px)", left: 0,
            width: 280,
            background: "var(--surface-raised)",
            border: "1px solid var(--surface-border)",
            borderRadius: "var(--radius-md)",
            boxShadow: "var(--shadow-lg)",
            padding: 14,
            zIndex: 2,
            display: "flex", gap: 12,
          }}
        >
          <div style={{ width: 44, height: 44, borderRadius: "50%", flexShrink: 0, background: "linear-gradient(135deg, color-mix(in srgb, var(--brand-primary) 70%, white), var(--brand-primary))", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontFamily: "var(--font-display)", fontSize: "1rem", fontWeight: 600 }}>
            MA
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: "0.86rem", fontWeight: 600, color: "var(--text-primary)" }}>Marisol Alvarez, Ph.D.</div>
            <div style={{ fontSize: "0.74rem", color: "var(--text-muted)", marginTop: 1 }}>Senior Research Scientist · Mobility Division</div>
            <a href="#" onClick={(e) => e.preventDefault()} style={{ fontSize: "0.74rem", fontWeight: 600, color: "var(--brand-primary)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 4, marginTop: 6 }}>
              Profile <LucideIcon name="arrow-up-right" size={11} />
            </a>
          </div>
        </div>
      </span>
      {" "}at the 2026 TRB Annual Meeting.
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════
// PAGE
// ════════════════════════════════════════════════════════════════════════

function TooltipPopoverPage() {
  const item = (window.AGGIE_CATALOG || []).find(c => c.id === "tooltip-popover");
  return (
    <PageShell item={item}>
      <TPIntro>
        Tooltips and popovers are <strong>anchored disclosures</strong> — small panels that appear next to a trigger to provide context. Use a <strong>tooltip</strong> for a single sentence of static help text (icon button label, disabled-button reason, abbreviation). Use a <strong>popover</strong> when the disclosure is interactive or contains formatted content (link, definition with citation, hover card).
      </TPIntro>

      {/* Tooltip — placement matrix */}
      <TPSectionLabel>Tooltip · placement</TPSectionLabel>
      <TPBox label="Top · Right · Bottom · Left">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", placeItems: "center" }}>
          <TPTooltipDemo placement="top"    text="Top placement" />
          <TPTooltipDemo placement="right"  text="Right placement" />
          <TPTooltipDemo placement="bottom" text="Bottom placement" />
          <TPTooltipDemo placement="left"   text="Left placement" />
        </div>
      </TPBox>
      <TPBox label="On dark surface" dark>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", placeItems: "center" }}>
          <TPTooltipDemo placement="top"    text="Top placement" dark />
          <TPTooltipDemo placement="right"  text="Right placement" dark />
          <TPTooltipDemo placement="bottom" text="Bottom placement" dark />
          <TPTooltipDemo placement="left"   text="Left placement" dark />
        </div>
      </TPBox>

      {/* Tooltip — special cases */}
      <TPSectionLabel>Tooltip · special cases</TPSectionLabel>
      <TPBox label="Disabled-button explanation">
        <div style={{ display: "flex", justifyContent: "center" }}>
          <TPDisabledTooltipDemo />
        </div>
      </TPBox>
      <TPBox label="Abbreviation / acronym definition">
        <div style={{ display: "flex", justifyContent: "center", padding: "20px 0" }}>
          <TPAbbrDemo />
        </div>
      </TPBox>

      {/* Popover */}
      <TPSectionLabel>Popover · rich content</TPSectionLabel>
      <TPBox label="Term definition with footer link">
        <div style={{ display: "flex", justifyContent: "center" }}>
          <TPPopoverDemo />
        </div>
      </TPBox>
      <TPBox label="Hover card · person inline">
        <div style={{ display: "flex", justifyContent: "center", padding: "20px 0 100px" }}>
          <TPHoverCardDemo />
        </div>
      </TPBox>

      {/* Anatomy */}
      <TPSectionLabel>Anatomy</TPSectionLabel>
      <div style={{ padding: "20px 22px", border: "1px solid var(--surface-border)", borderRadius: "var(--radius-md)", background: "var(--surface-raised)", marginBottom: 16 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
          <div>
            <div style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--brand-primary)", fontFamily: "var(--font-body-bold)", marginBottom: 8 }}>
              Tooltip
            </div>
            <ul style={{ margin: 0, padding: 0, listStyle: "none", fontSize: "0.85rem", lineHeight: 1.75, color: "var(--text-secondary)" }}>
              <li>Trigger: any focusable element</li>
              <li>Open: <code>focus</code> · <code>mouseenter</code> (350ms delay)</li>
              <li>Close: <code>blur</code> · <code>mouseleave</code> · <code>Esc</code></li>
              <li>Content: 1 line, ≤ 64 chars, no markup</li>
              <li>Surface: <code>--text-primary</code> · 6px arrow</li>
              <li>Role: <code>tooltip</code>, linked via <code>aria-describedby</code></li>
            </ul>
          </div>
          <div>
            <div style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--brand-primary)", fontFamily: "var(--font-body-bold)", marginBottom: 8 }}>
              Popover
            </div>
            <ul style={{ margin: 0, padding: 0, listStyle: "none", fontSize: "0.85rem", lineHeight: 1.75, color: "var(--text-secondary)" }}>
              <li>Trigger: button or link</li>
              <li>Open: <code>click</code> · <code>Enter</code> · <code>Space</code></li>
              <li>Close: outside-click · <code>Esc</code> · close button</li>
              <li>Content: heading + body + optional CTA</li>
              <li>Surface: <code>--surface-raised</code> · <code>--shadow-lg</code></li>
              <li>Role: <code>dialog</code>, traps focus while open</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Do / don't */}
      <TPSectionLabel>Do · don't</TPSectionLabel>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
        <div style={{ padding: "16px 18px", border: "1px solid var(--surface-border)", borderTop: "3px solid var(--color-success)", borderRadius: "var(--radius-md)", background: "var(--surface-raised)" }}>
          <div style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--color-success)", fontFamily: "var(--font-body-bold)", marginBottom: 10 }}>
            Do
          </div>
          <ul style={{ margin: 0, padding: 0, listStyle: "none", fontSize: "0.84rem", lineHeight: 1.7, color: "var(--text-secondary)" }}>
            <li>· Use a tooltip to label icon-only buttons</li>
            <li>· Use a popover for definitions with a "learn more" link</li>
            <li>· Reach a tooltip via keyboard focus, not just hover</li>
            <li>· Wrap a disabled control in a focusable span so its tooltip is reachable</li>
          </ul>
        </div>
        <div style={{ padding: "16px 18px", border: "1px solid var(--surface-border)", borderTop: "3px solid var(--color-error)", borderRadius: "var(--radius-md)", background: "var(--surface-raised)" }}>
          <div style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--color-error)", fontFamily: "var(--font-body-bold)", marginBottom: 10 }}>
            Don't
          </div>
          <ul style={{ margin: 0, padding: 0, listStyle: "none", fontSize: "0.84rem", lineHeight: 1.7, color: "var(--text-secondary)" }}>
            <li>· Put links or buttons inside a tooltip — use a popover</li>
            <li>· Hide critical info inside a hover-only disclosure</li>
            <li>· Use a tooltip on touch targets — they don't show on tap</li>
            <li>· Open a popover on hover unless it's a hover card with a delay</li>
          </ul>
        </div>
      </div>

      <TPSpecRow>
        <TPSpec label="Tooltip surface"   value="--text-primary" note="Inverted bg, white text, shadow-md" />
        <TPSpec label="Popover surface"   value="--surface-raised" note="border + shadow-lg, 12px arrow" />
        <TPSpec label="Open delay"        value="350ms / 0ms" note="Tooltip delays; popover opens immediately" />
        <TPSpec label="Aria"              value="describedby / dialog" note="tooltip role vs. focus-trapping dialog" />
      </TPSpecRow>
    </PageShell>
  );
}

Object.assign(window, { TooltipPopoverPage });
