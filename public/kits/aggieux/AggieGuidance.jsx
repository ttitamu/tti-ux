/* global React, PageShell, AGGIE_CATALOG, LucideIcon */
/*
 * AggieGuidance.jsx — Batch D: Onboarding & guidance.
 *
 *   Teaching banner   — Inline, dismissible coachmark that lives at the
 *                       top of a content region. Explains a new feature,
 *                       a system change, or a workflow tip. Three tones
 *                       (info / advisory / spotlight) and three sizes
 *                       (compact / standard / hero).
 *
 *   Teaching popover  — Anchored callout pointing at a specific UI
 *                       target. Used in first-run product tours and
 *                       feature reveals. Shows position, step count,
 *                       and skip / next / done actions.
 *
 *   Wizard            — Multi-step linear flow: stepper header + step
 *                       body + footer nav. Variants for numbered,
 *                       named, and progress-bar headers; with and
 *                       without skip; horizontal vs. vertical stepper.
 *
 * Lineage: Microsoft Fabric Teaching-banner / Teaching-popover / Wizard.
 *          Translated into TUX type/maroon/signature.
 *
 * Helper prefix: GU (Guidance).
 */

const { useState: _guUseState } = React;

// ════════════════════════════════════════════════════════════════════════
// Shared helpers (GU prefix)
// ════════════════════════════════════════════════════════════════════════

function GUBox({ dark = false, label, padded = true, children }) {
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
      <div style={{ padding: padded ? 32 : 0, background: dark ? "var(--brand-primary)" : "var(--surface-page)" }}>{children}</div>
    </div>
  );
}

function GUSectionLabel({ children }) {
  return (
    <div style={{ fontSize: "0.62rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--text-muted)", fontFamily: "var(--font-body-bold)", marginBottom: 12, marginTop: 28 }}>{children}</div>
  );
}

function GUSpecRow({ children }) {
  return (
    <div style={{ marginTop: 28, padding: "14px 18px", border: "1px solid var(--surface-border)", borderRadius: "var(--radius-md)", background: "var(--surface-raised)", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>{children}</div>
  );
}

function GUSpec({ label, value, note }) {
  return (
    <div>
      <div style={{ fontSize: "0.6rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-muted)", fontFamily: "var(--font-body-bold)" }}>{label}</div>
      <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem", color: "var(--brand-primary)", marginTop: 3, fontWeight: 500 }}>{value}</div>
      {note && <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: 2, lineHeight: 1.4 }}>{note}</div>}
    </div>
  );
}

function GUIntro({ children }) {
  return (
    <div style={{ padding: "16px 20px", marginBottom: 28, background: "color-mix(in srgb, var(--brand-primary) 5%, transparent)", borderLeft: "3px solid var(--brand-primary)", borderRadius: "0 var(--radius-sm) var(--radius-sm) 0", fontSize: "0.92rem", lineHeight: 1.65, color: "var(--text-secondary)" }}>
      {children}
    </div>
  );
}

function GULineageNote({ children }) {
  return (
    <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: 8, fontStyle: "italic", lineHeight: 1.5 }}>
      <span style={{ fontWeight: 600, color: "var(--brand-primary)", fontStyle: "normal" }}>Lineage</span> · {children}
    </div>
  );
}

// Style signature — same proportions as the rest of the kit.
function GUSig({ variant = "default", width = 56, color }) {
  const c = color || "var(--brand-primary)";
  if (variant === "bold") {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
        <div style={{ width: width * 0.55, height: 5, background: c, borderRadius: 1 }} />
        <div style={{ width: width * 0.18, height: 5, background: c, borderRadius: 1, opacity: 0.5 }} />
        <div style={{ width: width * 0.08, height: 5, background: c, borderRadius: 1, opacity: 0.25 }} />
      </div>
    );
  }
  if (variant === "elegant") {
    return (
      <div style={{
        width, height: 5,
        backgroundImage: `repeating-linear-gradient(135deg, ${c} 0 1px, transparent 1px 5px)`,
        WebkitMaskImage: "linear-gradient(90deg, transparent 0%, black 18%, black 82%, transparent 100%)",
        maskImage: "linear-gradient(90deg, transparent 0%, black 18%, black 82%, transparent 100%)",
        opacity: 0.8,
      }} />
    );
  }
  return (
    <div style={{ width, height: 1, background: `linear-gradient(90deg, transparent 0%, ${c} 18%, ${c} 82%, transparent 100%)` }} />
  );
}

// ════════════════════════════════════════════════════════════════════════
// 1. Teaching banner
// ════════════════════════════════════════════════════════════════════════

const GU_TEACH_TONES = {
  info:      { icon: "info",         accent: "var(--brand-primary)", bg: "color-mix(in srgb, var(--brand-primary) 5%, var(--surface-page))",  label: "Info" },
  advisory:  { icon: "lightbulb",    accent: "var(--brand-accent)",  bg: "color-mix(in srgb, var(--brand-accent) 9%, var(--surface-page))",   label: "Advisory" },
  spotlight: { icon: "sparkles",     accent: "var(--brand-primary)", bg: "var(--brand-primary)",                                                label: "Spotlight" },
};

function GUTeachingBanner({ tone = "info", size = "standard", title, body, primary, secondary, badge, dismissible = true }) {
  const t = GU_TEACH_TONES[tone];
  const dark = tone === "spotlight";
  const fg = dark ? "#FFFFFF" : "var(--text-primary)";
  const fgMuted = dark ? "rgba(255,255,255,0.78)" : "var(--text-secondary)";
  const compact = size === "compact";
  const hero = size === "hero";

  return (
    <div style={{
      background: t.bg,
      border: dark ? "none" : `1px solid color-mix(in srgb, ${t.accent} 30%, var(--surface-border))`,
      borderLeft: dark ? "none" : `3px solid ${t.accent}`,
      borderRadius: dark ? 0 : "var(--radius-md)",
      padding: hero ? "24px 28px" : compact ? "12px 16px" : "16px 20px",
      display: "flex", alignItems: "flex-start", gap: hero ? 18 : 14,
      color: fg,
      position: "relative",
    }}>
      <div style={{
        flexShrink: 0,
        width: hero ? 36 : 24, height: hero ? 36 : 24,
        background: dark ? "rgba(255,255,255,0.15)" : `color-mix(in srgb, ${t.accent} 14%, transparent)`,
        borderRadius: hero ? "50%" : "var(--radius-sm)",
        display: "flex", alignItems: "center", justifyContent: "center",
        color: dark ? "#FFFFFF" : t.accent,
        marginTop: hero ? 0 : 1,
      }}>
        <LucideIcon name={t.icon} size={hero ? 18 : 14} />
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        {badge && (
          <div style={{
            display: "inline-block",
            fontSize: "0.6rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em",
            color: dark ? "var(--brand-accent)" : t.accent,
            fontFamily: "var(--font-body-bold)",
            marginBottom: 4,
          }}>{badge}</div>
        )}
        {title && (
          <div style={{
            fontFamily: hero ? "var(--font-display)" : "var(--font-body-bold)",
            fontSize: hero ? "1.35rem" : compact ? "0.88rem" : "0.95rem",
            fontWeight: hero ? 500 : 700,
            letterSpacing: hero ? "0.01em" : 0,
            textTransform: hero ? "uppercase" : "none",
            color: fg,
            margin: "0 0 4px",
            lineHeight: 1.25,
          }}>{title}</div>
        )}
        {body && (
          <div style={{
            fontSize: compact ? "0.82rem" : "0.88rem",
            lineHeight: 1.55, color: fgMuted,
            maxWidth: 620,
          }}>{body}</div>
        )}

        {(primary || secondary) && (
          <div style={{ marginTop: hero ? 16 : 10, display: "flex", gap: 10, flexWrap: "wrap" }}>
            {primary && (
              <button style={{
                fontFamily: "var(--font-body-bold)", fontWeight: 700,
                fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.1em",
                padding: "8px 16px",
                background: dark ? "var(--brand-accent)" : t.accent,
                color: dark ? "var(--brand-primary)" : "#FFFFFF",
                border: "none", borderRadius: "var(--radius-sm)", cursor: "pointer",
              }}>{primary}</button>
            )}
            {secondary && (
              <button style={{
                fontFamily: "var(--font-body-bold)", fontWeight: 700,
                fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.1em",
                padding: "8px 14px",
                background: "transparent",
                color: dark ? "#FFFFFF" : t.accent,
                border: `1px solid ${dark ? "rgba(255,255,255,0.4)" : t.accent}`,
                borderRadius: "var(--radius-sm)", cursor: "pointer",
              }}>{secondary}</button>
            )}
          </div>
        )}
      </div>

      {dismissible && (
        <button aria-label="Dismiss" style={{
          flexShrink: 0,
          background: "transparent", border: "none", padding: 4, cursor: "pointer",
          color: dark ? "rgba(255,255,255,0.7)" : "var(--text-muted)",
          marginTop: -2,
        }}>
          <LucideIcon name="x" size={14} />
        </button>
      )}
    </div>
  );
}

function TeachingBannerPage() {
  const item = (window.AGGIE_CATALOG || []).find(c => c.id === "teaching-banner");

  return (
    <PageShell item={item}>
      <GUIntro>
        <p style={{ margin: 0 }}>
          Inline contextual coachmark for explaining new features, system changes, or workflow tips. Lives at the top of a region — never as an overlay. Three tones, three sizes. Always dismissible unless explicitly system-critical.
        </p>
        <GULineageNote>
          Anatomy adapted from Microsoft Fabric's Teaching-banner. The badge eyebrow + headline + body + dual-action footer rhythm comes from Fabric. TUX layers in tone-driven left-rail, Oswald hero variant, and signature-rule discipline.
        </GULineageNote>
      </GUIntro>

      <GUSectionLabel>Standard size · all three tones</GUSectionLabel>

      <GUBox label="Info — feature explainer">
        <GUTeachingBanner
          tone="info"
          badge="New"
          title="Project workspace is now collaborative"
          body="Invite up to 12 collaborators per project. Comments, presence indicators, and mentions are now available across all PECAN tools."
          primary="Try it now"
          secondary="Learn more"
        />
      </GUBox>

      <GUBox label="Advisory — workflow tip, gold accent">
        <GUTeachingBanner
          tone="advisory"
          badge="Tip"
          title="Keyboard shortcut available"
          body="Press ⌘K from anywhere in the app to jump to a project, dataset, or run. Saves about 8 clicks per nav."
          secondary="See all shortcuts"
        />
      </GUBox>

      <GUBox label="Spotlight — major reveal, full maroon" dark>
        <GUTeachingBanner
          tone="spotlight"
          badge="Now in beta"
          title="Corridor reports just got 3× faster"
          body="The new processing engine cuts a 12-mile corridor analysis from ~6 minutes to under 90 seconds. Available now to all research staff."
          primary="Try the new engine"
          secondary="Read changelog"
        />
      </GUBox>

      <GUSectionLabel>Compact — for in-flow use inside cards or panels</GUSectionLabel>

      <GUBox label="Compact info">
        <GUTeachingBanner
          tone="info"
          size="compact"
          title="Auto-save is on for this project"
          body="Changes sync every 30 seconds while you have edit access."
        />
      </GUBox>

      <GUBox label="Compact advisory, no body">
        <GUTeachingBanner
          tone="advisory"
          size="compact"
          title="Hold Shift to multi-select rows"
        />
      </GUBox>

      <GUSectionLabel>Hero — top-of-page or empty-state replacement</GUSectionLabel>

      <GUBox label="Hero spotlight" dark padded={false}>
        <div style={{ padding: 28 }}>
          <GUTeachingBanner
            tone="spotlight"
            size="hero"
            badge="Welcome to PECAN 4.0"
            title="A faster, calmer corridor analysis tool"
            body="Datasets, runs, and reports now share one workspace. Most of what was buried in menus is now reachable from the command palette."
            primary="Take the tour"
            secondary="Skip for now"
          />
        </div>
      </GUBox>

      <GUSpecRow>
        <GUSpec label="Tones" value="3" note="info / advisory / spotlight" />
        <GUSpec label="Sizes" value="3" note="compact 12px / standard 16px / hero 24px" />
        <GUSpec label="Left rail" value="3px" note="tone-colored, except spotlight (full bg)" />
        <GUSpec label="Dismissible" value="yes" note="default — set false only for system-critical info" />
      </GUSpecRow>
    </PageShell>
  );
}

// ════════════════════════════════════════════════════════════════════════
// 2. Teaching popover
// ════════════════════════════════════════════════════════════════════════

function GUTeachingPopover({ position = "bottom", step, totalSteps, title, body, onSkip = "Skip tour", onPrev, onNext = "Next", onDone, anchor = "Anchor element" }) {
  // The popover is rendered statically in-place. We mock the anchor target
  // and then position the callout relative to it.
  const arrowSize = 8;
  const isFinal = step === totalSteps;

  // Static placement — pure visual mock, position arg controls which side.
  const arrowStyle = (() => {
    const base = { position: "absolute", width: 0, height: 0, borderStyle: "solid" };
    if (position === "bottom") return { ...base, top: -arrowSize, left: 28, borderWidth: `0 ${arrowSize}px ${arrowSize}px ${arrowSize}px`, borderColor: "transparent transparent var(--brand-primary) transparent" };
    if (position === "top")    return { ...base, bottom: -arrowSize, left: 28, borderWidth: `${arrowSize}px ${arrowSize}px 0 ${arrowSize}px`, borderColor: "var(--brand-primary) transparent transparent transparent" };
    if (position === "right")  return { ...base, top: 22, left: -arrowSize, borderWidth: `${arrowSize}px ${arrowSize}px ${arrowSize}px 0`, borderColor: "transparent var(--brand-primary) transparent transparent" };
    return { ...base, top: 22, right: -arrowSize, borderWidth: `${arrowSize}px 0 ${arrowSize}px ${arrowSize}px`, borderColor: "transparent transparent transparent var(--brand-primary)" };
  })();

  return (
    <div style={{ position: "relative", display: "inline-block", maxWidth: 360 }}>
      <div style={arrowStyle} />
      <div style={{
        background: "var(--brand-primary)",
        color: "#FFFFFF",
        borderRadius: "var(--radius-md)",
        padding: "16px 18px 14px",
        boxShadow: "0 8px 24px rgba(0,0,0,0.18), 0 2px 6px rgba(0,0,0,0.08)",
        position: "relative",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
          <div style={{ fontSize: "0.6rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em", color: "var(--brand-accent)", fontFamily: "var(--font-body-bold)" }}>
            Step {step} of {totalSteps}
          </div>
          <button aria-label="Close tour" style={{ background: "transparent", border: "none", color: "rgba(255,255,255,0.7)", cursor: "pointer", padding: 0, marginLeft: 12 }}>
            <LucideIcon name="x" size={13} />
          </button>
        </div>
        <div style={{ fontFamily: "var(--font-body-bold)", fontWeight: 700, fontSize: "0.98rem", marginBottom: 6, lineHeight: 1.3 }}>{title}</div>
        <div style={{ fontSize: "0.85rem", lineHeight: 1.55, color: "rgba(255,255,255,0.88)" }}>{body}</div>

        {/* Progress dots */}
        <div style={{ display: "flex", gap: 4, marginTop: 14, marginBottom: 10 }}>
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div key={i} style={{
              width: i + 1 === step ? 14 : 5, height: 5, borderRadius: 3,
              background: i + 1 === step ? "var(--brand-accent)" : "rgba(255,255,255,0.3)",
              transition: "width 200ms",
            }} />
          ))}
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 10, paddingTop: 10, borderTop: "1px solid rgba(255,255,255,0.15)" }}>
          {!isFinal && onSkip && (
            <button style={{ background: "transparent", border: "none", color: "rgba(255,255,255,0.7)", fontFamily: "var(--font-body-bold)", fontWeight: 700, fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.1em", cursor: "pointer", padding: 0 }}>{onSkip}</button>
          )}
          <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
            {onPrev && (
              <button style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.4)", color: "#FFFFFF", fontFamily: "var(--font-body-bold)", fontWeight: 700, fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.1em", padding: "6px 12px", borderRadius: "var(--radius-sm)", cursor: "pointer" }}>{onPrev}</button>
            )}
            <button style={{ background: "var(--brand-accent)", border: "none", color: "var(--brand-primary)", fontFamily: "var(--font-body-bold)", fontWeight: 700, fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.1em", padding: "6px 14px", borderRadius: "var(--radius-sm)", cursor: "pointer" }}>
              {isFinal ? (onDone || "Got it") : onNext}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function GUAnchorMock({ children, label = "Target", offset = "left" }) {
  return (
    <div style={{ position: "relative", display: "flex", alignItems: offset === "above" ? "flex-end" : "flex-start", gap: 24, padding: "32px 0" }}>
      <div style={{
        background: "var(--surface-raised)", border: "2px solid var(--brand-accent)",
        borderRadius: "var(--radius-sm)", padding: "10px 16px",
        fontSize: "0.8rem", color: "var(--text-secondary)",
        boxShadow: "0 0 0 4px color-mix(in srgb, var(--brand-accent) 30%, transparent)",
        flexShrink: 0,
      }}>{label}</div>
      <div>{children}</div>
    </div>
  );
}

function TeachingPopoverPage() {
  const item = (window.AGGIE_CATALOG || []).find(c => c.id === "teaching-popover");

  return (
    <PageShell item={item}>
      <GUIntro>
        <p style={{ margin: 0 }}>
          Anchored callout pointing at a specific UI target. Used for first-run product tours and feature reveals — when banner-level guidance isn't precise enough about <em>where</em> to look. Maroon background, gold accents, step counter, progress dots.
        </p>
        <GULineageNote>
          Step counter + dot progress + skip/next/done rhythm comes from Fluent 2 Web Teaching-popover (6 frames) and the equivalent Fabric pattern. TUX inverts the palette (maroon body, gold pip + primary action) to match brand.
        </GULineageNote>
      </GUIntro>

      <GUSectionLabel>First step — entry to a tour</GUSectionLabel>

      <GUBox label="Bottom placement, step 1 of 4">
        <GUAnchorMock label="Search input">
          <GUTeachingPopover
            position="bottom"
            step={1}
            totalSteps={4}
            title="Search across everything"
            body="Type a project name, a dataset, a corridor ID, or even a person. Results stream in as you type — no enter required."
            onNext="Next: Filters"
          />
        </GUAnchorMock>
      </GUBox>

      <GUSectionLabel>Mid-tour — with previous + next</GUSectionLabel>

      <GUBox label="Right placement, step 2 of 4">
        <GUAnchorMock label="Filter rail">
          <GUTeachingPopover
            position="right"
            step={2}
            totalSteps={4}
            title="Save your filter combinations"
            body="Hit ⇧⌘S after setting filters to save them as a named view. Saved views show up in the sidebar under Pinned filters."
            onPrev="Back"
            onNext="Next"
          />
        </GUAnchorMock>
      </GUBox>

      <GUSectionLabel>Final step — done CTA, no skip</GUSectionLabel>

      <GUBox label="Top placement, step 4 of 4">
        <GUAnchorMock label="Run button" offset="above">
          <GUTeachingPopover
            position="top"
            step={4}
            totalSteps={4}
            title="One-click run"
            body="When you're ready, hit Run. We'll queue the analysis and notify you when results are in. Re-runs are free for the first 24 hours."
            onPrev="Back"
            onDone="Got it"
          />
        </GUAnchorMock>
      </GUBox>

      <GUSectionLabel>Single-shot reveal — one-step popover, no tour</GUSectionLabel>

      <GUBox label="Single-step reveal, just a got-it">
        <GUAnchorMock label="New export menu">
          <GUTeachingPopover
            position="bottom"
            step={1}
            totalSteps={1}
            title="Export got a redesign"
            body="The format picker, citation style, and embargo settings are now in one panel. Old shortcuts still work."
            onDone="Got it, thanks"
          />
        </GUAnchorMock>
      </GUBox>

      <GUSpecRow>
        <GUSpec label="Background" value="brand-primary" note="always maroon — this is identity-laden guidance" />
        <GUSpec label="Accent" value="brand-accent" note="step counter eyebrow + active dot + primary CTA" />
        <GUSpec label="Arrow" value="8px" note="positioned per anchor side: top/right/bottom/left" />
        <GUSpec label="Max width" value="360px" note="forces concise copy — long bodies belong in docs" />
      </GUSpecRow>
    </PageShell>
  );
}

// ════════════════════════════════════════════════════════════════════════
// 3. Wizard
// ════════════════════════════════════════════════════════════════════════

function GUStepperHorizontal({ steps, activeIndex, variant = "numbered" }) {
  // variant: "numbered" | "named" | "progress"
  if (variant === "progress") {
    const pct = Math.round(((activeIndex + 1) / steps.length) * 100);
    return (
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10 }}>
          <div style={{ fontFamily: "var(--font-body-bold)", fontWeight: 700, fontSize: "0.9rem", color: "var(--text-primary)" }}>{steps[activeIndex]}</div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "var(--text-muted)" }}>Step {activeIndex + 1} of {steps.length} · {pct}%</div>
        </div>
        <div style={{ height: 4, background: "var(--surface-sunken)", borderRadius: 2, overflow: "hidden" }}>
          <div style={{ width: `${pct}%`, height: "100%", background: "var(--brand-primary)", transition: "width 250ms" }} />
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
      {steps.map((label, i) => {
        const done = i < activeIndex;
        const active = i === activeIndex;
        const numColor = done ? "var(--brand-primary)" : active ? "var(--brand-primary)" : "var(--text-muted)";
        const numBg = done ? "var(--brand-primary)" : active ? "color-mix(in srgb, var(--brand-primary) 12%, transparent)" : "var(--surface-sunken)";
        const numFg = done ? "#FFFFFF" : active ? "var(--brand-primary)" : "var(--text-muted)";
        return (
          <React.Fragment key={i}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
              <div style={{
                width: 28, height: 28, borderRadius: "50%",
                background: numBg,
                color: numFg,
                border: active ? `2px solid ${numColor}` : "none",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: "var(--font-body-bold)", fontWeight: 700, fontSize: "0.78rem",
              }}>
                {done ? <LucideIcon name="check" size={14} /> : i + 1}
              </div>
              {variant === "named" && (
                <div style={{
                  fontSize: "0.78rem",
                  fontWeight: active ? 700 : 500,
                  color: active ? "var(--brand-primary)" : done ? "var(--text-secondary)" : "var(--text-muted)",
                  fontFamily: active || done ? "var(--font-body-bold)" : "var(--font-body)",
                  textTransform: active ? "uppercase" : "none",
                  letterSpacing: active ? "0.06em" : 0,
                }}>{label}</div>
              )}
            </div>
            {i < steps.length - 1 && (
              <div style={{
                flex: 1, height: 1, margin: "0 14px",
                background: i < activeIndex ? "var(--brand-primary)" : "var(--surface-border)",
                minWidth: variant === "named" ? 24 : 32,
              }} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

function GUStepperVertical({ steps, activeIndex }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
      {steps.map((step, i) => {
        const done = i < activeIndex;
        const active = i === activeIndex;
        const numBg = done ? "var(--brand-primary)" : active ? "color-mix(in srgb, var(--brand-primary) 12%, transparent)" : "var(--surface-sunken)";
        const numFg = done ? "#FFFFFF" : active ? "var(--brand-primary)" : "var(--text-muted)";
        return (
          <div key={i} style={{ display: "flex", gap: 14, alignItems: "flex-start", paddingBottom: i === steps.length - 1 ? 0 : 18, position: "relative" }}>
            {i < steps.length - 1 && (
              <div style={{
                position: "absolute",
                left: 13, top: 30, bottom: 0, width: 2,
                background: i < activeIndex ? "var(--brand-primary)" : "var(--surface-border)",
              }} />
            )}
            <div style={{
              width: 28, height: 28, borderRadius: "50%",
              background: numBg, color: numFg,
              border: active ? `2px solid var(--brand-primary)` : "none",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: "var(--font-body-bold)", fontWeight: 700, fontSize: "0.78rem",
              flexShrink: 0, position: "relative", zIndex: 1,
            }}>
              {done ? <LucideIcon name="check" size={14} /> : i + 1}
            </div>
            <div style={{ flex: 1, paddingTop: 4 }}>
              <div style={{
                fontSize: "0.85rem",
                fontWeight: active ? 700 : 500,
                color: active ? "var(--brand-primary)" : done ? "var(--text-primary)" : "var(--text-muted)",
                fontFamily: active ? "var(--font-body-bold)" : "var(--font-body)",
                textTransform: active ? "uppercase" : "none",
                letterSpacing: active ? "0.06em" : 0,
                marginBottom: 2,
              }}>{step.label}</div>
              {step.note && (
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", lineHeight: 1.5 }}>{step.note}</div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function GUWizardShell({ steps, activeIndex, title, lede, children, footer, allowSkip = true }) {
  return (
    <div style={{ background: "var(--surface-raised)", borderRadius: "var(--radius-md)", border: "1px solid var(--surface-border)", overflow: "hidden", boxShadow: "var(--shadow-sm)" }}>
      <div style={{ padding: "20px 24px 22px", borderBottom: "1px solid var(--surface-border)", background: "var(--surface-page)" }}>
        <GUStepperHorizontal steps={steps} activeIndex={activeIndex} variant="named" />
      </div>
      <div style={{ padding: "28px 28px 24px" }}>
        <div style={{ fontSize: "0.62rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--text-muted)", fontFamily: "var(--font-body-bold)", marginBottom: 6 }}>
          Step {activeIndex + 1} · {steps[activeIndex]}
        </div>
        <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.7rem", fontWeight: 500, letterSpacing: "0.01em", textTransform: "uppercase", margin: "0 0 8px", lineHeight: 1.15 }}>{title}</h3>
        {lede && <p style={{ fontSize: "0.95rem", lineHeight: 1.55, color: "var(--text-secondary)", margin: "0 0 22px", maxWidth: 560 }}>{lede}</p>}
        <div>{children}</div>
      </div>
      <div style={{ padding: "16px 24px", borderTop: "1px solid var(--surface-border)", display: "flex", alignItems: "center", justifyContent: "space-between", background: "var(--surface-page)" }}>
        {allowSkip && activeIndex < steps.length - 1 ? (
          <button style={{ background: "transparent", border: "none", color: "var(--text-muted)", fontFamily: "var(--font-body-bold)", fontWeight: 700, fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.1em", cursor: "pointer", padding: 0 }}>Skip step</button>
        ) : <div />}
        <div style={{ display: "flex", gap: 10 }}>
          {activeIndex > 0 && (
            <button style={{ background: "transparent", border: "1px solid var(--surface-border)", color: "var(--text-primary)", fontFamily: "var(--font-body-bold)", fontWeight: 700, fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.1em", padding: "8px 14px", borderRadius: "var(--radius-sm)", cursor: "pointer" }}>Previous</button>
          )}
          <button style={{ background: "var(--brand-primary)", border: "none", color: "#FFFFFF", fontFamily: "var(--font-body-bold)", fontWeight: 700, fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.1em", padding: "8px 18px", borderRadius: "var(--radius-sm)", cursor: "pointer" }}>
            {activeIndex === steps.length - 1 ? "Finish" : "Continue"}
          </button>
        </div>
      </div>
    </div>
  );
}

function WizardPage() {
  const item = (window.AGGIE_CATALOG || []).find(c => c.id === "wizard");

  const steps = ["Define dataset", "Choose corridor", "Set parameters", "Review & run"];
  const verticalSteps = [
    { label: "Define dataset",  note: "Pick the source records and date range" },
    { label: "Choose corridor", note: "Either upload a shapefile or select an existing corridor" },
    { label: "Set parameters",  note: "Speed thresholds, smoothing, weather window" },
    { label: "Review & run",    note: "Final config preview before queuing" },
  ];

  return (
    <PageShell item={item}>
      <GUIntro>
        <p style={{ margin: 0 }}>
          Multi-step linear flow. Three header variants — <strong>numbered</strong>, <strong>named</strong>, and <strong>progress-bar</strong> — plus a vertical stepper for sidebar layouts. Footer always pairs Skip (left) with Previous + Continue/Finish (right).
        </p>
        <GULineageNote>
          Stepper anatomy + footer rhythm + progress-bar variant come from Microsoft Fabric Wizard (5 frames). TUX adapts: maroon active state, Oswald uppercase step title, signature-rule-aware footer.
        </GULineageNote>
      </GUIntro>

      <GUSectionLabel>Stepper headers — three variants</GUSectionLabel>

      <GUBox label="Numbered (compact, no labels)" padded>
        <GUStepperHorizontal steps={steps} activeIndex={1} variant="numbered" />
      </GUBox>

      <GUBox label="Named (default, used in shells below)" padded>
        <GUStepperHorizontal steps={steps} activeIndex={1} variant="named" />
      </GUBox>

      <GUBox label="Progress-bar (long flows or unknown step count)" padded>
        <GUStepperHorizontal steps={steps} activeIndex={2} variant="progress" />
      </GUBox>

      <GUSectionLabel>Full wizard shell — step 2 of 4</GUSectionLabel>

      <GUBox label="Mid-flow shell — corridor picker" padded={false}>
        <div style={{ padding: 24 }}>
          <GUWizardShell
            steps={steps}
            activeIndex={1}
            title="Choose a corridor"
            lede="Either upload a shapefile or select from corridors your team has already defined. Shapefiles must be in EPSG:4326."
          >
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div style={{ padding: "20px 18px", border: "2px solid var(--brand-primary)", borderRadius: "var(--radius-md)", background: "color-mix(in srgb, var(--brand-primary) 4%, transparent)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                  <LucideIcon name="map" size={16} />
                  <div style={{ fontFamily: "var(--font-body-bold)", fontWeight: 700, fontSize: "0.9rem" }}>Existing corridor</div>
                </div>
                <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>Pick from the 14 corridors your team has analyzed before.</div>
              </div>
              <div style={{ padding: "20px 18px", border: "1px solid var(--surface-border)", borderRadius: "var(--radius-md)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                  <LucideIcon name="upload" size={16} />
                  <div style={{ fontFamily: "var(--font-body-bold)", fontWeight: 700, fontSize: "0.9rem" }}>Upload shapefile</div>
                </div>
                <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>Drop a .shp + .dbf bundle. Up to 25 MB.</div>
              </div>
            </div>
          </GUWizardShell>
        </div>
      </GUBox>

      <GUSectionLabel>Final step — Finish CTA, no Skip</GUSectionLabel>

      <GUBox label="Final-step shell — review" padded={false}>
        <div style={{ padding: 24 }}>
          <GUWizardShell
            steps={steps}
            activeIndex={3}
            title="Review & run"
            lede="Final configuration. Once you hit Finish, the run is queued and you'll get a notification when results are ready."
            allowSkip={false}
          >
            <div style={{ border: "1px solid var(--surface-border)", borderRadius: "var(--radius-sm)", overflow: "hidden" }}>
              {[
                ["Dataset", "TxDOT_Statewide_2024.shp · 412k records"],
                ["Corridor", "I-35 Austin–Round Rock · 18.4 mi"],
                ["Date range", "Jan 2024 – Mar 2024"],
                ["Parameters", "Speed ≥ 5 mph · 5-min smoothing · weather: clear only"],
              ].map(([k, v]) => (
                <div key={k} style={{ display: "grid", gridTemplateColumns: "180px 1fr", gap: 16, padding: "10px 16px", borderBottom: "1px solid var(--surface-border)", background: "var(--surface-page)" }}>
                  <div style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-muted)", fontFamily: "var(--font-body-bold)" }}>{k}</div>
                  <div style={{ fontSize: "0.85rem", color: "var(--text-primary)", fontFamily: "var(--font-mono)" }}>{v}</div>
                </div>
              ))}
            </div>
          </GUWizardShell>
        </div>
      </GUBox>

      <GUSectionLabel>Vertical stepper — sidebar layout for long flows</GUSectionLabel>

      <GUBox label="Vertical stepper, step 2 active">
        <div style={{ display: "grid", gridTemplateColumns: "240px 1fr", gap: 32, alignItems: "start" }}>
          <GUStepperVertical steps={verticalSteps} activeIndex={1} />
          <div style={{ padding: "0 0 0 0" }}>
            <div style={{ fontSize: "0.62rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--text-muted)", fontFamily: "var(--font-body-bold)", marginBottom: 6 }}>
              Step 2 · Choose corridor
            </div>
            <h4 style={{ fontFamily: "var(--font-display)", fontSize: "1.4rem", fontWeight: 500, letterSpacing: "0.01em", textTransform: "uppercase", margin: "0 0 12px" }}>Pick a corridor</h4>
            <p style={{ fontSize: "0.88rem", lineHeight: 1.55, color: "var(--text-secondary)", margin: 0 }}>The vertical stepper trades horizontal density for richer per-step descriptions. Use for setup wizards with 5+ steps or where each step warrants explanation.</p>
          </div>
        </div>
      </GUBox>

      <GUSpecRow>
        <GUSpec label="Header variants" value="3" note="numbered / named / progress" />
        <GUSpec label="Stepper layouts" value="2" note="horizontal default · vertical for 5+ steps" />
        <GUSpec label="Step indicator" value="28×28" note="circle · check on done · 2px ring on active" />
        <GUSpec label="Footer" value="skip ↔ prev/next" note="Skip hidden on final step + when allowSkip=false" />
      </GUSpecRow>
    </PageShell>
  );
}

// ════════════════════════════════════════════════════════════════════════
// Exports
// ════════════════════════════════════════════════════════════════════════

Object.assign(window, {
  TeachingBannerPage,
  TeachingPopoverPage,
  WizardPage,
});
