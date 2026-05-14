/* global React, PageShell, LucideIcon, AGGIE_CATALOG */
/*
 * AggieIdentities.jsx — the Identities component family.
 *
 * Maps AggieUX v1.7 "Identities" → TTI v2.0-style two-kind system:
 *
 *   Identity kind:  Lockup   (logo + institution wordmark)
 *                   Text     (institution name as typography only)
 *
 *   Level:          Institution  (Texas A&M Transportation Institute)
 *                   Center       (an internal center/program, e.g. "Center for Transportation Safety")
 *                   Department   (a sub-unit, e.g. "Communications")
 *
 *   Orientation:    Horizontal   (logo beside text)
 *                   Stacked      (logo above text, centered)
 *
 *   Background:     White (on-light) / Charcoal / Maroon   — drives the color treatment
 *
 * This gives us the canonical 3 × 2 × 3 matrix from AggieUX, re-skinned for TTI.
 */

function IdentitiesPage() {
  const item = (window.AGGIE_CATALOG || []).find(c => c.id === "identities");
  return (
    <PageShell item={item}>
      <IntroNote>
        AggieUX v2.0 simplified how we talk about navigation — what matters is the <strong>identity type</strong>. A site either uses a
        <strong> lockup identity</strong> (logo + institutional wordmark, most common) or a <strong>text identity</strong>
        (typographic wordmark, used when the mark would visually overcrowd the top of the page). Every identity appears at one of three
        <strong> levels</strong> — institution, center/program, department — and in two <strong>orientations</strong> — horizontal or stacked.
      </IntroNote>

      {/* ─── Identity kind comparison ────────────────────── */}
      <SectionHeading eyebrow="kind" title="Lockup vs text identity" sub="Start here. Every other decision flows from which kind you've picked." />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 56 }}>
        <KindCard
          title="Lockup identity"
          subtitle="logo + wordmark"
          description="Use when you have space for a horizontal logo-and-name pair. This is the default — if you're not sure, pick this."
        >
          <IdentityTile level="institution" orientation="horizontal" kind="lockup" bg="white" />
        </KindCard>

        <KindCard
          title="Text identity"
          subtitle="typography only"
          description="Use when the site title is long, when space is constrained, or when the institutional mark appears elsewhere in the page (footer, favicon)."
        >
          <IdentityTile level="institution" orientation="horizontal" kind="text" bg="white" />
        </KindCard>
      </div>

      {/* ─── Background × Orientation × Level matrix ───── */}
      <SectionHeading eyebrow="matrix" title="Lockup identity · full matrix" sub="Horizontal and stacked orientations across three backgrounds, for all three levels." />

      <MatrixGrid kind="lockup" />

      {/* ─── Text identity matrix ─── */}
      <SectionHeading eyebrow="matrix" title="Text identity · full matrix" sub="Same matrix without the lockup. Heavier display type carries the identity." />

      <MatrixGrid kind="text" />

      {/* ─── Usage notes ─── */}
      <SectionHeading eyebrow="guidance" title="Usage rules" />

      <UsageGrid>
        <UsageCard icon="check" tone="good" title="Always use the full institution name on first reference" body="&quot;Texas A&amp;M Transportation Institute&quot; — never just &quot;Transportation Institute&quot; or &quot;the Institute.&quot; After the first reference, TTI is acceptable." />
        <UsageCard icon="check" tone="good" title="Pair with TAMUS subfooter" body="The TAMUS legal strip (see Subfooter) is mandatory beneath every site footer. Identity at top, TAMUS at bottom — non-negotiable." />
        <UsageCard icon="x" tone="bad" title="Don't invent abbreviations" body="&quot;TAMTI,&quot; &quot;TexAMTI,&quot; etc. are not valid. Institution level is always &quot;Texas A&amp;M Transportation Institute&quot; or &quot;TTI.&quot;" />
        <UsageCard icon="x" tone="bad" title="Don't mix levels in one lockup" body="The center or department level is its own identity — don't append it to the institution lockup. Pick one level per page." />
      </UsageGrid>

      {/* ─── Spec strip ─── */}
      <SectionHeading eyebrow="spec" title="At a glance" />
      <SpecStrip>
        <Spec label="Height — horizontal" value="58px" note="matches AggieUX primaryTAM rendering" />
        <Spec label="Height — stacked" value="123px" />
        <Spec label="Wordmark" value="Open Sans 21px" note="institution + level text" />
        <Spec label="Superhead" value="Open Sans 11px" note="parent institution line" />
        <Spec label="Letterspacing" value="0.02em" note="on superhead only" />
      </SpecStrip>
    </PageShell>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Section shell helpers
// ────────────────────────────────────────────────────────────────────────────
function IntroNote({ children }) {
  return (
    <div style={{ padding: "16px 20px", marginBottom: 40, background: "color-mix(in srgb, var(--brand-primary) 5%, transparent)", borderLeft: "3px solid var(--brand-primary)", borderRadius: "0 var(--radius-sm) var(--radius-sm) 0", fontSize: "0.92rem", lineHeight: 1.65, color: "var(--text-secondary)" }}>
      {children}
    </div>
  );
}

function SectionHeading({ eyebrow, title, sub }) {
  return (
    <div style={{ marginBottom: 20, marginTop: 8 }}>
      <div style={{ fontSize: "0.66rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--text-muted)", fontFamily: "var(--font-body-bold)", marginBottom: 8 }}>{eyebrow}</div>
      <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.35rem", fontWeight: 500, margin: "0 0 6px", textTransform: "uppercase", letterSpacing: "0.015em" }}>{title}</h2>
      {sub && <p style={{ margin: 0, fontSize: "0.88rem", color: "var(--text-secondary)", maxWidth: 680 }}>{sub}</p>}
    </div>
  );
}

function KindCard({ title, subtitle, description, children }) {
  return (
    <div style={{ border: "1px solid var(--surface-border)", borderRadius: "var(--radius-md)", overflow: "hidden", background: "var(--surface-raised)" }}>
      <div style={{ padding: "18px 22px 14px", borderBottom: "1px solid var(--surface-border)" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
          <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", fontWeight: 500, margin: 0, textTransform: "uppercase", letterSpacing: "0.015em" }}>{title}</h3>
          <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>{subtitle}</span>
        </div>
        <p style={{ margin: "6px 0 0", fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.55 }}>{description}</p>
      </div>
      <div style={{ padding: "32px 22px", background: "var(--surface-page)", display: "flex", alignItems: "center", justifyContent: "center", minHeight: 130 }}>
        {children}
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Matrix grid — for a given kind, show orientation × background × level
// ────────────────────────────────────────────────────────────────────────────
function MatrixGrid({ kind }) {
  const levels = ["institution", "center", "department"];
  const orientations = ["horizontal", "stacked"];
  const backgrounds = ["white", "charcoal", "maroon"];

  return (
    <div style={{ border: "1px solid var(--surface-border)", borderRadius: "var(--radius-md)", overflow: "hidden", marginBottom: 56, background: "var(--surface-raised)" }}>
      {/* header row */}
      <div style={{ display: "grid", gridTemplateColumns: "120px repeat(3, 1fr)", borderBottom: "1px solid var(--surface-border)", background: "var(--surface-sunken)" }}>
        <div style={{ padding: "10px 16px", fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-muted)", fontFamily: "var(--font-body-bold)" }}>
          orientation ↓ / bg →
        </div>
        {backgrounds.map(bg => (
          <div key={bg} style={{ padding: "10px 16px", borderLeft: "1px solid var(--surface-border)", fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-muted)", fontFamily: "var(--font-body-bold)" }}>
            bg = {bg}
          </div>
        ))}
      </div>

      {levels.map((level, li) => (
        <React.Fragment key={level}>
          {/* level label row */}
          <div style={{ display: "grid", gridTemplateColumns: "120px 1fr", borderBottom: "1px solid var(--surface-border)", borderTop: li === 0 ? "none" : "1px solid var(--surface-border)", background: "color-mix(in srgb, var(--brand-primary) 3%, transparent)" }}>
            <div style={{ padding: "8px 16px", fontSize: "0.7rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--brand-primary)", fontFamily: "var(--font-body-bold)" }}>
              level · {level}
            </div>
            <div style={{ padding: "8px 16px", fontSize: "0.78rem", color: "var(--text-secondary)", fontStyle: "italic" }}>
              {level === "institution" && "Texas A\u2009&\u2009M Transportation Institute"}
              {level === "center"      && "a subordinate center or program (e.g. Center for Transportation Safety)"}
              {level === "department"  && "a department within a center (e.g. Communications)"}
            </div>
          </div>

          {orientations.map(orientation => (
            <div key={orientation} style={{ display: "grid", gridTemplateColumns: "120px repeat(3, 1fr)", borderBottom: "1px solid var(--surface-border)" }}>
              <div style={{ padding: "20px 16px", fontSize: "0.78rem", fontWeight: 500, color: "var(--text-secondary)", display: "flex", alignItems: "center", fontFamily: "var(--font-body)" }}>
                {orientation}
              </div>
              {backgrounds.map(bg => (
                <div key={bg} style={{ padding: "20px 16px", borderLeft: "1px solid var(--surface-border)", background: bgFillFor(bg), display: "flex", alignItems: "center", justifyContent: "center", minHeight: orientation === "stacked" ? 170 : 100 }}>
                  <IdentityTile level={level} orientation={orientation} kind={kind} bg={bg} />
                </div>
              ))}
            </div>
          ))}
        </React.Fragment>
      ))}
    </div>
  );
}

function bgFillFor(bg) {
  if (bg === "white")    return "#ffffff";
  if (bg === "charcoal") return "#2a2a2a";
  if (bg === "maroon")   return "var(--brand-primary)";
  return "transparent";
}

// ────────────────────────────────────────────────────────────────────────────
// IdentityTile — the actual lockup rendering
// ────────────────────────────────────────────────────────────────────────────
function IdentityTile({ level, orientation, kind, bg }) {
  const onDark = bg !== "white";
  const textColor = onDark ? "#ffffff" : "#2a2a2a";
  const superheadColor = onDark ? "rgba(255,255,255,0.75)" : "rgba(42,42,42,0.65)";
  const ruleColor = onDark ? "rgba(255,255,255,0.55)" : "rgba(42,42,42,0.55)";
  const logoSrc = onDark ? "../../assets/logo-dark.svg" : "../../assets/logo.svg";

  // copy per level
  const copy = {
    institution: { super: "an agency of the State of Texas", main: "Texas A\u2009&\u2009M Transportation Institute" },
    center:      { super: "Texas A\u2009&\u2009M Transportation Institute", main: "Center for Transportation Safety" },
    department:  { super: "Center for Transportation Safety", main: "Communications" },
  }[level];

  // bar-above-name for department
  const hasRule = level === "department";

  // Horizontal: logo left, stacked text right (or just text for text-kind)
  if (orientation === "horizontal") {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: kind === "lockup" ? 14 : 0, maxWidth: 360 }}>
        {kind === "lockup" && (
          <img src={logoSrc} width="46" height="46" alt="" style={{ flexShrink: 0 }} />
        )}
        <div style={{ display: "flex", flexDirection: "column", gap: 2, minWidth: 0 }}>
          {level !== "institution" && (
            <span style={{ fontFamily: "var(--font-body)", fontSize: 10.5, letterSpacing: "0.02em", lineHeight: 1.1, color: superheadColor, textTransform: "none" }}>
              {copy.super}
            </span>
          )}
          <span style={{ fontFamily: "var(--font-body)", fontSize: level === "institution" ? 17 : 18, fontWeight: 500, lineHeight: 1.15, color: textColor, letterSpacing: "-0.005em" }}>
            {copy.main}
          </span>
          {hasRule && (
            <div style={{ height: 1, background: ruleColor, width: 42, marginTop: 4, marginBottom: 2 }} />
          )}
        </div>
      </div>
    );
  }

  // Stacked: logo above, text centered (lockup); for text-kind, text only but larger
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, maxWidth: 260, textAlign: "center" }}>
      {kind === "lockup" && (
        <img src={logoSrc} width="56" height="56" alt="" />
      )}
      {hasRule && <div style={{ height: 1, background: ruleColor, width: 46, margin: "4px 0" }} />}
      {level !== "institution" && (
        <span style={{ fontFamily: "var(--font-body)", fontSize: 10.5, letterSpacing: "0.02em", lineHeight: 1.15, color: superheadColor }}>
          {copy.super}
        </span>
      )}
      <span style={{ fontFamily: "var(--font-body)", fontSize: kind === "text" ? 22 : 18, fontWeight: 500, lineHeight: 1.2, color: textColor, letterSpacing: "-0.005em" }}>
        {copy.main}
      </span>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Usage rules grid
// ────────────────────────────────────────────────────────────────────────────
function UsageGrid({ children }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 48 }}>{children}</div>
  );
}

function UsageCard({ icon, tone, title, body }) {
  const toneMap = {
    good: { color: "var(--color-success)", bg: "color-mix(in srgb, var(--color-success) 8%, transparent)" },
    bad:  { color: "var(--color-danger)",  bg: "color-mix(in srgb, var(--color-danger) 8%, transparent)" },
  };
  const t = toneMap[tone] || toneMap.good;
  return (
    <div style={{ padding: "16px 18px", border: "1px solid var(--surface-border)", borderRadius: "var(--radius-md)", background: "var(--surface-raised)", display: "flex", gap: 12 }}>
      <div style={{ width: 24, height: 24, borderRadius: "50%", background: t.bg, color: t.color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <LucideIcon name={icon} size={14} color={t.color} />
      </div>
      <div>
        <div style={{ fontSize: "0.88rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: 4, fontFamily: "var(--font-body-bold)" }}
             dangerouslySetInnerHTML={{ __html: title }} />
        <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", lineHeight: 1.5 }}
             dangerouslySetInnerHTML={{ __html: body }} />
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Spec strip
// ────────────────────────────────────────────────────────────────────────────
function SpecStrip({ children }) {
  const items = React.Children.toArray(children);
  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${items.length}, 1fr)`, border: "1px solid var(--surface-border)", borderRadius: "var(--radius-md)", overflow: "hidden", background: "var(--surface-raised)" }}>
      {items.map((c, i) => (
        <div key={i} style={{ padding: "14px 16px", borderLeft: i === 0 ? "none" : "1px solid var(--surface-border)" }}>{c}</div>
      ))}
    </div>
  );
}

function Spec({ label, value, note }) {
  return (
    <div>
      <div style={{ fontSize: "0.62rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-muted)", fontFamily: "var(--font-body-bold)" }}>{label}</div>
      <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.98rem", color: "var(--brand-primary)", marginTop: 4, fontWeight: 500 }}>{value}</div>
      {note && <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: 4, lineHeight: 1.4 }}>{note}</div>}
    </div>
  );
}

Object.assign(window, { IdentitiesPage, IdentityTile });
