/* global React, PageShell, AGGIE_CATALOG, LucideIcon */
/*
 * AggieOverlays.jsx — Batch 18: Overlays & app chrome.
 *
 *   Command palette  — Global ⌘K jump bar. Search + grouped commands,
 *                      keyboard nav, recent + suggested sections.
 *                      Lives at the app root; one instance per app.
 *
 *   Modal            — Editorial modal w/ eyebrow + signature-rule title.
 *                      Three style variants follow the same rules as
 *                      page headers — default hairline, bold stacked-bars,
 *                      elegant diagonal-hash. Confirm-destroy variant
 *                      uses --color-error for the gold ribbon swap.
 *
 *   Table of contents — Right-rail sticky TOC for long-form articles.
 *                       Active-section pip + nested H3 indent. Three
 *                       style variants for marker treatment.
 *
 * Helper prefix: OV (Overlays).
 *
 * NOTE: These are static editorial mocks. The "open" state of the
 *       command palette + modal is shown rendered-in-place inside its
 *       host viewport — no live overlay chrome.
 */

const { useState: _ovUseState } = React;

// ════════════════════════════════════════════════════════════════════════
// Shared helpers (OV prefix)
// ════════════════════════════════════════════════════════════════════════

function OVBox({ dark = false, label, padded = true, children }) {
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

function OVSectionLabel({ children }) {
  return (
    <div style={{ fontSize: "0.62rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--text-muted)", fontFamily: "var(--font-body-bold)", marginBottom: 12, marginTop: 28 }}>{children}</div>
  );
}

function OVSpecRow({ children }) {
  return (
    <div style={{ marginTop: 28, padding: "14px 18px", border: "1px solid var(--surface-border)", borderRadius: "var(--radius-md)", background: "var(--surface-raised)", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>{children}</div>
  );
}

function OVSpec({ label, value, note }) {
  return (
    <div>
      <div style={{ fontSize: "0.6rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-muted)", fontFamily: "var(--font-body-bold)" }}>{label}</div>
      <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem", color: "var(--brand-primary)", marginTop: 3, fontWeight: 500 }}>{value}</div>
      {note && <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: 2, lineHeight: 1.4 }}>{note}</div>}
    </div>
  );
}

function OVIntro({ children }) {
  return (
    <div style={{ padding: "16px 20px", marginBottom: 28, background: "color-mix(in srgb, var(--brand-primary) 5%, transparent)", borderLeft: "3px solid var(--brand-primary)", borderRadius: "0 var(--radius-sm) var(--radius-sm) 0", fontSize: "0.92rem", lineHeight: 1.65, color: "var(--text-secondary)" }}>
      {children}
    </div>
  );
}

/* Signature rule — same proportions as the rest of the kit. */
function OVSig({ variant = "default", width = 56, color }) {
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
// 1. Command palette
// ════════════════════════════════════════════════════════════════════════

function OVCommandPalette({ dark = false, query = "deploy" }) {
  // The palette sits inside a faux app-root viewport — we mock the scrim
  // + dialog chrome statically.
  const groups = [
    {
      label: "Recent",
      items: [
        { icon: "rotate-cw",   label: "Re-run last scan",          shortcut: "R",     hint: "Pecan / scans" },
        { icon: "file-text",   label: "Open ADR-024 — Search",     shortcut: null,    hint: "tti-docs / ADRs" },
      ],
    },
    {
      label: "Pages",
      items: [
        { icon: "compass",     label: "Go to Dashboard",           shortcut: "G D",   hint: "Pecan" },
        { icon: "hard-drive",  label: "Go to Indexes",             shortcut: "G I",   hint: "Pecan" },
        { icon: "users",       label: "Go to Directory",           shortcut: "G U",   hint: "tti-staff" },
      ],
    },
    {
      label: "Actions",
      items: [
        { icon: "play",        label: "Deploy preview branch",     shortcut: "⇧ ⌘ D", hint: "deploy", match: true },
        { icon: "send",        label: "Deploy to staging",         shortcut: null,    hint: "deploy", match: true },
        { icon: "git-branch",  label: "Switch branch…",            shortcut: "B",     hint: "git" },
      ],
    },
  ];

  // Apply faux match-highlighting on "deploy" rows when query matches
  const filteredGroups = query
    ? groups.map(g => ({ ...g, items: g.items.filter(i => !query || i.label.toLowerCase().includes(query.toLowerCase()) || i.hint?.includes(query)) }))
        .filter(g => g.items.length)
    : groups;

  // ── color tokens for dark vs light scrim ────────────────────────────
  const scrimBg = dark ? "rgba(0,0,0,0.55)" : "color-mix(in srgb, var(--brand-primary) 28%, transparent)";
  const dialogBg = dark ? "#221F1F" : "var(--surface-raised)";
  const dialogBorder = dark ? "1px solid #3D3A3A" : "1px solid var(--surface-border)";
  const inputBg = dark ? "#15100F" : "var(--surface-sunken)";
  const groupLabelColor = dark ? "rgba(255,255,255,0.55)" : "var(--text-muted)";
  const itemColor = dark ? "#FAFAFA" : "var(--text-primary)";
  const itemMutedColor = dark ? "rgba(255,255,255,0.55)" : "var(--text-muted)";
  const kbdBg = dark ? "#15100F" : "var(--surface-page)";
  const kbdBorder = dark ? "1px solid #3D3A3A" : "1px solid var(--surface-border)";
  const activeBg = dark ? "color-mix(in srgb, #db859e 18%, transparent)" : "color-mix(in srgb, var(--brand-primary) 7%, transparent)";

  return (
    <div style={{ position: "relative", height: 460, borderRadius: "var(--radius-sm)", overflow: "hidden", background: scrimBg, padding: "44px 0 0", display: "flex", justifyContent: "center" }}>
      {/* Faux app behind the scrim — just enough to read as "open over content" */}
      <div style={{ position: "absolute", inset: 0, background: dark ? "linear-gradient(180deg, #221F1F, #15100F)" : "linear-gradient(180deg, var(--surface-raised), var(--surface-page))", zIndex: 0 }}>
        <div style={{ padding: "16px 22px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: dialogBorder, opacity: 0.45 }}>
          <div style={{ fontFamily: "var(--font-display)", fontSize: "0.95rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em", color: itemColor }}>Pecan / dashboard</div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: itemMutedColor }}>research/staff</div>
        </div>
        <div style={{ padding: "32px 22px", color: itemMutedColor, fontSize: "0.85rem", lineHeight: 1.6, opacity: 0.4 }}>
          <div style={{ height: 12, background: itemColor, opacity: 0.12, borderRadius: 2, marginBottom: 8, width: "44%" }} />
          <div style={{ height: 8, background: itemColor, opacity: 0.08, borderRadius: 2, marginBottom: 6, width: "78%" }} />
          <div style={{ height: 8, background: itemColor, opacity: 0.08, borderRadius: 2, marginBottom: 6, width: "62%" }} />
          <div style={{ height: 8, background: itemColor, opacity: 0.08, borderRadius: 2, width: "70%" }} />
        </div>
      </div>

      {/* Dialog */}
      <div style={{ position: "relative", zIndex: 1, width: 540, maxWidth: "94%", background: dialogBg, border: dialogBorder, borderRadius: "var(--radius-md)", boxShadow: "0 24px 48px -12px rgba(0,0,0,0.32), 0 8px 16px -4px rgba(0,0,0,0.16)", overflow: "hidden", display: "flex", flexDirection: "column" }}>

        {/* Search bar */}
        <div style={{ padding: "14px 18px", display: "flex", alignItems: "center", gap: 12, background: inputBg, borderBottom: dialogBorder }}>
          <LucideIcon name="search" size={16} color={itemMutedColor} />
          <div style={{ flex: 1, fontFamily: "var(--font-body-bold)", fontSize: "0.95rem", color: itemColor, fontWeight: 500 }}>
            {query}
            <span style={{ display: "inline-block", width: 1, height: "1em", background: dark ? "#db859e" : "var(--brand-primary)", marginLeft: 2, verticalAlign: "middle", animation: "tux-blink 1s steps(2) infinite" }} />
          </div>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: itemMutedColor, padding: "2px 6px", background: kbdBg, border: kbdBorder, borderRadius: 3 }}>esc</span>
        </div>

        {/* Results */}
        <div style={{ padding: "8px 4px 12px", maxHeight: 320, overflowY: "auto" }}>
          {filteredGroups.map((g, gi) => (
            <div key={gi}>
              <div style={{ padding: "8px 16px 4px", fontSize: "0.6rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: groupLabelColor, fontFamily: "var(--font-body-bold)" }}>
                {g.label}
              </div>
              {g.items.map((it, ii) => {
                const isActive = gi === 0 && ii === 0;
                return (
                  <div key={ii} style={{ display: "flex", alignItems: "center", gap: 12, padding: "9px 14px", margin: "0 4px", borderRadius: "var(--radius-sm)", background: isActive ? activeBg : "transparent", borderLeft: isActive ? `3px solid ${dark ? "#db859e" : "var(--brand-primary)"}` : "3px solid transparent", paddingLeft: isActive ? 11 : 14 }}>
                    <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 20, color: isActive ? (dark ? "#db859e" : "var(--brand-primary)") : itemMutedColor }}>
                      <LucideIcon name={it.icon} size={14} />
                    </span>
                    <span style={{ flex: 1, fontSize: "0.88rem", fontWeight: isActive ? 600 : 400, color: itemColor, fontFamily: "var(--font-body)" }}>
                      {it.match
                        ? <HighlightedText text={it.label} term={query} dark={dark} />
                        : it.label}
                    </span>
                    {it.hint && <span style={{ fontSize: "0.7rem", color: itemMutedColor, fontFamily: "var(--font-mono)" }}>{it.hint}</span>}
                    {it.shortcut && <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: itemMutedColor, padding: "2px 6px", background: kbdBg, border: kbdBorder, borderRadius: 3 }}>{it.shortcut}</span>}
                  </div>
                );
              })}
            </div>
          ))}

          {filteredGroups.length === 0 && (
            <div style={{ padding: "32px 18px", textAlign: "center", fontSize: "0.85rem", color: itemMutedColor }}>
              No results for <code style={{ fontFamily: "var(--font-mono)", color: itemColor }}>{query}</code>.
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: "8px 16px", borderTop: dialogBorder, background: inputBg, display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "0.7rem", color: itemMutedColor }}>
          <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
            <span style={{ display: "inline-flex", gap: 6, alignItems: "center" }}>
              <kbd style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", padding: "1px 5px", background: kbdBg, border: kbdBorder, borderRadius: 3 }}>↑↓</kbd>
              navigate
            </span>
            <span style={{ display: "inline-flex", gap: 6, alignItems: "center" }}>
              <kbd style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", padding: "1px 5px", background: kbdBg, border: kbdBorder, borderRadius: 3 }}>↵</kbd>
              run
            </span>
          </div>
          <span style={{ fontFamily: "var(--font-mono)", color: itemMutedColor }}>{filteredGroups.reduce((acc, g) => acc + g.items.length, 0)} results</span>
        </div>
      </div>
    </div>
  );
}

function HighlightedText({ text, term, dark }) {
  if (!term) return text;
  const idx = text.toLowerCase().indexOf(term.toLowerCase());
  if (idx < 0) return text;
  return (
    <>
      {text.slice(0, idx)}
      <span style={{ background: dark ? "color-mix(in srgb, var(--tti-gold) 60%, transparent)" : "color-mix(in srgb, var(--tti-gold) 50%, transparent)", color: dark ? "#221F1F" : "var(--text-primary)", padding: "0 2px", borderRadius: 2 }}>
        {text.slice(idx, idx + term.length)}
      </span>
      {text.slice(idx + term.length)}
    </>
  );
}

function CommandPalettePage() {
  const item = (window.AGGIE_CATALOG || []).find(c => c.id === "command-palette");
  return (
    <PageShell item={item}>
      <OVIntro>
        <strong>The ⌘K shortcut for any tux app.</strong> Native <code>&lt;dialog&gt;</code>{" "}
        gives a free focus trap, scrim, and ESC dismissal. Commands group by intent
        (Recent · Pages · Actions); each carries an icon, a label, an optional
        keyboard shortcut, and a hint indicating its origin app or section. Live
        filter highlights the matched term in gold; arrow keys move the cursor;
        ↵ runs.
      </OVIntro>

      <OVSectionLabel>Default — light scrim, mid-search</OVSectionLabel>
      <OVBox label="open · search 'deploy'" padded={false}>
        <OVCommandPalette dark={false} query="deploy" />
      </OVBox>

      <OVSectionLabel>On dark — same palette over a dark app shell</OVSectionLabel>
      <OVBox dark label="open · search 'deploy'" padded={false}>
        <OVCommandPalette dark={true} query="deploy" />
      </OVBox>

      <OVSpecRow>
        <OVSpec label="trigger"   value="⌘ K / Ctrl K"       note="Global key handler at app root" />
        <OVSpec label="primitive" value="<dialog>"           note="Native focus trap + scrim + ESC" />
        <OVSpec label="match"     value="gold highlight"     note="--tti-gold @ 50% on light, 60% on dark" />
        <OVSpec label="anatomy"   value="search → groups → footer" note="Recent / Pages / Actions; ↵ + ↑↓ + esc" />
      </OVSpecRow>
    </PageShell>
  );
}

// ════════════════════════════════════════════════════════════════════════
// 2. Modal
// ════════════════════════════════════════════════════════════════════════

function OVModal({ variant = "default", kind = "basic", dark = false }) {
  // Faux page behind the modal — paled-back chrome
  const isDestructive = kind === "destructive";

  const eyebrow = isDestructive ? "destructive action" : "action";
  const title   = isDestructive ? "Delete this index?" : "Trigger new scan";
  const body = isDestructive
    ? "This will remove the OpenSearch index and its 12,402 documents. The S3 source files are not touched. This cannot be undone."
    : "Schedules a fresh crawl across all configured S3 mounts. Average run time is 4–7 minutes depending on the number of changed files since the last scan.";

  // Per-variant typography + signature
  const variantStyle = {
    default: { fontFamily: "var(--font-display)", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.01em", fontStyle: "normal", titleSize: "1.55rem" },
    bold:    { fontFamily: "var(--font-body-bold)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.02em", fontStyle: "normal", titleSize: "1.5rem" },
    elegant: { fontFamily: "var(--font-elegant, Georgia, serif)", fontWeight: 400, textTransform: "none", letterSpacing: "-0.005em", fontStyle: "italic", titleSize: "1.7rem" },
  }[variant];

  const sigColor = isDestructive ? "var(--color-error)" : "var(--brand-primary)";

  // Dialog colors
  const dialogBg = dark ? "#221F1F" : "var(--surface-raised)";
  const dialogBorder = dark ? "1px solid #3D3A3A" : "1px solid var(--surface-border)";
  const textColor = dark ? "#FAFAFA" : "var(--text-primary)";
  const mutedColor = dark ? "rgba(255,255,255,0.65)" : "var(--text-secondary)";
  const eyebrowColor = dark ? "rgba(255,255,255,0.55)" : "var(--text-muted)";
  const footerBg = dark ? "#15100F" : "var(--surface-sunken)";
  const scrimBg = "rgba(0,0,0,0.42)";

  // Action button colors per kind
  const primaryBg = isDestructive ? "var(--color-error)" : "var(--brand-primary)";
  const primaryLabel = isDestructive ? "Delete index" : "Run scan";

  return (
    <div style={{ position: "relative", height: 380, borderRadius: "var(--radius-sm)", overflow: "hidden", background: scrimBg, display: "flex", justifyContent: "center", alignItems: "center", padding: 24 }}>
      {/* Faux page background */}
      <div style={{ position: "absolute", inset: 0, background: dark ? "linear-gradient(180deg, #221F1F, #15100F)" : "linear-gradient(180deg, var(--surface-raised), var(--surface-page))", opacity: 0.55 }}>
        <div style={{ padding: "16px 22px", display: "flex", justifyContent: "space-between", alignItems: "center", opacity: 0.5 }}>
          <div style={{ fontFamily: "var(--font-display)", fontSize: "0.9rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em", color: textColor }}>Pecan / indexes</div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", color: mutedColor }}>research/staff</div>
        </div>
      </div>

      {/* Dialog */}
      <div style={{ position: "relative", width: 540, maxWidth: "94%", background: dialogBg, border: dialogBorder, borderRadius: "var(--radius-md)", boxShadow: "0 30px 60px -16px rgba(0,0,0,0.4), 0 12px 20px -4px rgba(0,0,0,0.18)", overflow: "hidden", display: "flex", flexDirection: "column" }}>

        {/* Body */}
        <div style={{ padding: "26px 28px 22px" }}>
          <div style={{ fontSize: "0.62rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.13em", color: isDestructive ? "var(--color-error)" : eyebrowColor, fontFamily: "var(--font-body-bold)", marginBottom: 12 }}>
            {eyebrow}
          </div>
          <h3 style={{
            fontFamily: variantStyle.fontFamily,
            fontWeight: variantStyle.fontWeight,
            textTransform: variantStyle.textTransform,
            letterSpacing: variantStyle.letterSpacing,
            fontStyle: variantStyle.fontStyle,
            fontSize: variantStyle.titleSize,
            color: textColor,
            margin: "0 0 10px",
            lineHeight: 1.18,
          }}>
            {title}
          </h3>
          <OVSig variant={variant} width={64} color={sigColor} />
          <p style={{ fontSize: "0.92rem", lineHeight: 1.62, color: mutedColor, margin: "16px 0 0", maxWidth: 460 }}>
            {body}
          </p>

          {isDestructive && (
            <div style={{ marginTop: 16, padding: "10px 12px", display: "flex", alignItems: "flex-start", gap: 10, background: dark ? "color-mix(in srgb, var(--color-error) 18%, transparent)" : "color-mix(in srgb, var(--color-error) 8%, transparent)", borderLeft: `3px solid var(--color-error)`, borderRadius: "0 var(--radius-sm) var(--radius-sm) 0", fontSize: "0.82rem", color: textColor }}>
              <LucideIcon name="alert-triangle" size={14} color="var(--color-error)" />
              <span><strong>Type the index name</strong> <code style={{ fontFamily: "var(--font-mono)", background: "transparent", color: "var(--color-error)", fontWeight: 600 }}>pecan-2024-q3</code> to confirm.</span>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div style={{ padding: "14px 22px", borderTop: dialogBorder, background: footerBg, display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 10 }}>
          <button style={{
            padding: "9px 18px", border: "none", background: "transparent", color: mutedColor,
            fontFamily: "var(--font-body-bold)", fontWeight: 700, fontSize: "0.78rem",
            textTransform: "uppercase", letterSpacing: "0.06em", cursor: "pointer", borderRadius: "var(--radius-sm)",
          }}>
            Cancel
          </button>
          <button style={{
            padding: "9px 18px", border: "none", background: primaryBg, color: "#fff",
            fontFamily: "var(--font-body-bold)", fontWeight: 700, fontSize: "0.78rem",
            textTransform: "uppercase", letterSpacing: "0.06em", cursor: "pointer", borderRadius: "var(--radius-sm)",
            boxShadow: "0 1px 0 rgba(0,0,0,0.06)",
          }}>
            {primaryLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

function ModalPage() {
  const item = (window.AGGIE_CATALOG || []).find(c => c.id === "modal");
  return (
    <PageShell item={item}>
      <OVIntro>
        <strong>An editorial modal — eyebrow, signature-rule title, body, footer actions.</strong>{" "}
        Wraps a primitive (Nuxt UI's <code>UModal</code> in the live tti-ux app — the heavy
        lifting of focus trap, scrim, body lock comes from there). The component
        enforces TTI rhythm on top: the title's signature rule swaps to red on
        destructive actions, and a confirm-by-typing pattern is built in.
      </OVIntro>

      <OVSectionLabel>Style variants — basic open state</OVSectionLabel>
      <OVBox label="default · basic action" padded={false}>
        <OVModal variant="default" kind="basic" />
      </OVBox>
      <OVBox label="bold · basic action" padded={false}>
        <OVModal variant="bold" kind="basic" />
      </OVBox>
      <OVBox label="elegant · basic action" padded={false}>
        <OVModal variant="elegant" kind="basic" />
      </OVBox>

      <OVSectionLabel>Destructive — confirm-by-typing</OVSectionLabel>
      <OVBox label="default · destructive (signature swaps to error red)" padded={false}>
        <OVModal variant="default" kind="destructive" />
      </OVBox>

      <OVSectionLabel>On dark</OVSectionLabel>
      <OVBox dark label="default · destructive on dark surface" padded={false}>
        <OVModal variant="default" kind="destructive" dark />
      </OVBox>

      <OVSpecRow>
        <OVSpec label="primitive"     value="UModal (Nuxt UI)"     note="Free focus trap, scrim, body lock, ESC" />
        <OVSpec label="title rule"    value="signature per variant" note="Swaps to var(--color-error) on destructive" />
        <OVSpec label="confirm gate"  value="typed phrase"         note="For irrecoverable actions only" />
        <OVSpec label="actions"       value="cancel · primary"     note="Always Work Sans 700 · uppercase" />
      </OVSpecRow>
    </PageShell>
  );
}

// ════════════════════════════════════════════════════════════════════════
// 3. Table of contents
// ════════════════════════════════════════════════════════════════════════

function OVTocRail({ variant = "default", dark = false }) {
  const sections = [
    { id: "intro",          level: 2, label: "Introduction",                       active: false },
    { id: "scope",          level: 2, label: "Scope of work",                      active: false },
    { id: "methodology",    level: 2, label: "Methodology",                        active: true },
    { id: "data-collection",level: 3, label: "Data collection",                    active: false },
    { id: "instrumentation",level: 3, label: "Instrumentation",                    active: false },
    { id: "findings",       level: 2, label: "Findings",                           active: false },
    { id: "rural-corridors",level: 3, label: "Rural corridors",                    active: false },
    { id: "urban-arterials",level: 3, label: "Urban arterials",                    active: false },
    { id: "implications",   level: 2, label: "Policy implications",                active: false },
    { id: "next-steps",     level: 2, label: "Next steps",                         active: false },
  ];

  const textColor = dark ? "#FAFAFA" : "var(--text-primary)";
  const mutedColor = dark ? "rgba(255,255,255,0.65)" : "var(--text-secondary)";
  const labelColor = dark ? "rgba(255,255,255,0.55)" : "var(--text-muted)";
  const accentColor = dark ? "#db859e" : "var(--brand-primary)";
  const railBg = dark ? "rgba(0,0,0,0.18)" : "transparent";
  const dividerColor = dark ? "rgba(255,255,255,0.12)" : "var(--surface-border)";

  // Per-variant marker treatment
  const markerFor = (active) => {
    if (active) {
      if (variant === "bold") return <div style={{ width: 14, height: 4, background: accentColor, borderRadius: 1 }} />;
      if (variant === "elegant") return <div style={{ width: 14, height: 4, backgroundImage: `repeating-linear-gradient(135deg, ${accentColor} 0 1px, transparent 1px 4px)` }} />;
      return <div style={{ width: 14, height: 1, background: accentColor }} />;
    }
    return <div style={{ width: 14, height: 1, background: dividerColor }} />;
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 220px", gap: 36, padding: "12px 0", background: railBg }}>
      {/* Faux article body */}
      <article style={{ paddingRight: 18 }}>
        <div style={{ fontSize: "0.62rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.13em", color: labelColor, fontFamily: "var(--font-body-bold)", marginBottom: 10 }}>
          Research report · April 2026
        </div>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.65rem", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.005em", margin: "0 0 14px", color: textColor, lineHeight: 1.18 }}>
          Speed-management interventions on rural Texas FM routes
        </h2>
        <p style={{ fontSize: "0.92rem", lineHeight: 1.65, color: mutedColor, margin: "0 0 16px" }}>
          A multi-corridor study examining the effectiveness of dynamic feedback
          signs and rumble-strip placement on observed 85th-percentile speeds
          across 14 Farm-to-Market routes in central Texas.
        </p>
        <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.15rem", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.01em", margin: "22px 0 10px", color: accentColor }}>
          Methodology
        </h3>
        <p style={{ fontSize: "0.88rem", lineHeight: 1.7, color: mutedColor, margin: "0 0 12px" }}>
          The study population comprises 14 corridors selected from the TxDOT
          Rural-FM strata, sampled at three temporal windows (AM peak,
          off-peak, PM peak) over a 12-week deployment period. Each corridor
          paired a treatment segment with a length-matched control.
        </p>
        <p style={{ fontSize: "0.88rem", lineHeight: 1.7, color: mutedColor, margin: "0 0 12px" }}>
          Speed measurements were collected via permanent-mount Wavetronix
          radar units at 100 ft pre-sign and 500 ft post-sign locations.
          Bicycle and pedestrian counts were excluded.
        </p>
        <div style={{ height: 8, background: dividerColor, opacity: 0.4, borderRadius: 1, margin: "20px 0 8px", width: "62%" }} />
        <div style={{ height: 8, background: dividerColor, opacity: 0.4, borderRadius: 1, marginBottom: 8, width: "78%" }} />
        <div style={{ height: 8, background: dividerColor, opacity: 0.4, borderRadius: 1, marginBottom: 8, width: "70%" }} />
      </article>

      {/* TOC rail */}
      <aside style={{ position: "sticky", top: 0, alignSelf: "start", paddingLeft: 18, borderLeft: `1px solid ${dividerColor}` }}>
        <div style={{ fontSize: "0.6rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em", color: labelColor, fontFamily: "var(--font-body-bold)", marginBottom: 14 }}>
          On this page
        </div>
        <nav style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {sections.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              onClick={(e) => e.preventDefault()}
              style={{
                display: "flex", alignItems: "center", gap: 8,
                padding: s.level === 3 ? "4px 0 4px 18px" : "5px 0",
                fontSize: s.level === 3 ? "0.8rem" : "0.85rem",
                fontWeight: s.active ? 600 : (s.level === 2 ? 500 : 400),
                fontFamily: variant === "elegant" && s.active ? "var(--font-elegant, Georgia, serif)" : "var(--font-body)",
                fontStyle: variant === "elegant" && s.active ? "italic" : "normal",
                color: s.active ? accentColor : (s.level === 3 ? labelColor : mutedColor),
                textDecoration: "none",
                lineHeight: 1.35,
              }}
            >
              {markerFor(s.active)}
              <span>{s.label}</span>
            </a>
          ))}
        </nav>
        <div style={{ marginTop: 22, paddingTop: 14, borderTop: `1px solid ${dividerColor}`, fontSize: "0.7rem", color: labelColor, fontFamily: "var(--font-mono)" }}>
          10 sections · ~14 min read
        </div>
      </aside>
    </div>
  );
}

function TOCPage() {
  const item = (window.AGGIE_CATALOG || []).find(c => c.id === "toc");
  return (
    <PageShell item={item}>
      <OVIntro>
        <strong>A right-rail sticky table of contents.</strong> Auto-detects H2/H3
        from the article on mount, tracks the active section via{" "}
        <code>IntersectionObserver</code>, smooth-scrolls on click. Pairs with{" "}
        <code>TuxDocsSidebar</code> on doc pages — the doc sidebar handles
        between-page nav, this handles within-page nav. Each style variant uses
        its native signature for the active marker.
      </OVIntro>

      <OVSectionLabel>Default — hairline marker</OVSectionLabel>
      <OVBox label="article + sticky TOC rail">
        <OVTocRail variant="default" />
      </OVBox>

      <OVSectionLabel>Bold — chunky-bar marker</OVSectionLabel>
      <OVBox label="article + sticky TOC rail">
        <OVTocRail variant="bold" />
      </OVBox>

      <OVSectionLabel>Elegant — diagonal-hash marker, italic active label</OVSectionLabel>
      <OVBox label="article + sticky TOC rail">
        <OVTocRail variant="elegant" />
      </OVBox>

      <OVSectionLabel>On dark</OVSectionLabel>
      <OVBox dark label="article + sticky TOC rail · dark">
        <OVTocRail variant="default" dark />
      </OVBox>

      <OVSpecRow>
        <OVSpec label="anchor" value="H2 + H3 only"           note="H4+ skipped — too granular for the rail" />
        <OVSpec label="active" value="IntersectionObserver"   note="Tracks current heading on scroll" />
        <OVSpec label="marker" value="signature per variant"  note="Hairline · stacked-bars · diagonal-hash" />
        <OVSpec label="layout" value="grid 1fr · 220px · 36"  note="Sticky aside; 220px rail + 18px left border" />
      </OVSpecRow>
    </PageShell>
  );
}

// ════════════════════════════════════════════════════════════════════════
// Globals
// ════════════════════════════════════════════════════════════════════════

Object.assign(window, {
  CommandPalettePage, ModalPage, TOCPage,
});

// Caret blink keyframe — injected once
if (!document.getElementById("ov-keyframes")) {
  const style = document.createElement("style");
  style.id = "ov-keyframes";
  style.textContent = "@keyframes tux-blink { 50% { opacity: 0; } }";
  document.head.appendChild(style);
}
