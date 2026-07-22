/* global React, PageShell, AGGIE_CATALOG */
/*
 * AggieNumbersVoices.jsx — Batch 6
 *
 *   Factoid collections      — Row of oversized statistics. The institutional
 *                              "by the numbers" treatment. 3/4/5-up.
 *   Testimonial collection   — Grid of attributed testimonials with photo,
 *                              quote, name, role.
 *
 * Both lean hard on numerals/voices, so they're a natural pair. The factoid
 * page is the strongest showcase of how each style's numeral face reads at
 * massive sizes; the testimonial page extends the standalone-blockquote
 * vocabulary into multi-up grids.
 */

// ════════════════════════════════════════════════════════════════════════
// Shared helpers (NV prefix to avoid global collisions across batch files)
// ════════════════════════════════════════════════════════════════════════

function NVBox({ dark = false, label, children }) {
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
      <div style={{ padding: 32, background: dark ? "var(--brand-primary)" : "var(--surface-page)" }}>{children}</div>
    </div>
  );
}

function NVSectionLabel({ children }) {
  return (
    <div style={{
      fontSize: "0.62rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em",
      color: "var(--text-muted)", fontFamily: "var(--font-body-bold)", marginBottom: 12, marginTop: 16,
    }}>{children}</div>
  );
}

function NVSpecRow({ children }) {
  return (
    <div style={{
      marginTop: 28, padding: "14px 18px", border: "1px solid var(--surface-border)",
      borderRadius: "var(--radius-md)", background: "var(--surface-raised)",
      display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16,
    }}>{children}</div>
  );
}

function NVSpec({ label, value, note }) {
  return (
    <div>
      <div style={{ fontSize: "0.6rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-muted)", fontFamily: "var(--font-body-bold)" }}>{label}</div>
      <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem", color: "var(--brand-primary)", marginTop: 3, fontWeight: 500 }}>{value}</div>
      {note && <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: 2, lineHeight: 1.4 }}>{note}</div>}
    </div>
  );
}

function NVIntro({ children }) {
  return (
    <div style={{ padding: "16px 20px", marginBottom: 28, background: "color-mix(in srgb, var(--brand-primary) 5%, transparent)", borderLeft: "3px solid var(--brand-primary)", borderRadius: "0 var(--radius-sm) var(--radius-sm) 0", fontSize: "0.92rem", lineHeight: 1.65, color: "var(--text-secondary)" }}>
      {children}
    </div>
  );
}

// Style signature — short horizontal rule, used as section eyebrow
function NVSig({ style, dark, width = 80 }) {
  const c = dark ? "rgba(255,255,255,0.9)" : "var(--brand-primary)";
  if (style === "bold") {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
        <span style={{ display: "block", width: width * 0.55, height: 5, borderRadius: 3, background: c }} />
        <span style={{ display: "block", width: width * 0.18, height: 5, borderRadius: 3, background: c, opacity: 0.5 }} />
        <span style={{ display: "block", width: width * 0.08, height: 5, borderRadius: 3, background: c, opacity: 0.25 }} />
      </div>
    );
  }
  if (style === "elegant") {
    const accent = dark ? "rgba(255,255,255,0.9)" : "var(--brand-accent)";
    return (
      <div style={{
        width, height: 7,
        backgroundImage: `repeating-linear-gradient(135deg, ${accent} 0 1.4px, transparent 1.4px 7px)`,
        WebkitMaskImage: "linear-gradient(90deg, transparent 0%, black 15%, black 85%, transparent 100%)",
        maskImage: "linear-gradient(90deg, transparent 0%, black 15%, black 85%, transparent 100%)",
        opacity: 0.9,
      }} />
    );
  }
  return (
    <div style={{
      width, height: 2,
      background: `linear-gradient(90deg, transparent 0%, ${c} 15%, ${c} 85%, transparent 100%)`,
      opacity: 0.9,
    }} />
  );
}

// ════════════════════════════════════════════════════════════════════════
// FACTOIDS
// ════════════════════════════════════════════════════════════════════════
//
// One factoid = oversized number + suffix + label + optional source line.
// The numeral face changes per style:
//   default → Open Sans heavy 700, slight letter-spacing
//   bold    → Work Sans 800 italic, tight letter-spacing
//   elegant → Georgia italic, optical letter-shift, oldstyle feel

function getNumeralFace(style) {
  if (style === "bold") {
    return {
      fontFamily: "var(--font-bold)",
      fontWeight: 800,
      fontStyle: "italic",
      letterSpacing: "-0.015em",
    };
  }
  if (style === "elegant") {
    return {
      fontFamily: "var(--font-elegant)",
      fontWeight: 400,
      fontStyle: "italic",
      letterSpacing: "-0.025em",
    };
  }
  return {
    fontFamily: "var(--font-body)",
    fontWeight: 700,
    fontStyle: "normal",
    letterSpacing: "-0.01em",
  };
}

function FactoidCell({ style, dark, value, suffix, label, source, size = "lg" }) {
  const fg = dark ? "#fff" : "var(--brand-primary)";
  const muted = dark ? "rgba(255,255,255,0.78)" : "var(--text-secondary)";
  const subtle = dark ? "rgba(255,255,255,0.5)" : "var(--text-muted)";
  const numeralFace = getNumeralFace(style);

  // Three sizes — 5-up uses sm, 4-up uses md, 3-up uses lg
  const sizes = {
    sm: { num: 56, suf: 22, lab: 13 },
    md: { num: 72, suf: 28, lab: 14 },
    lg: { num: 96, suf: 36, lab: 15 },
  };
  const s = sizes[size];

  return (
    <div style={{ paddingRight: 12 }}>
      <NVSig style={style} dark={dark} width={50} />
      <div style={{ marginTop: 14 }}>
        <span style={{
          ...numeralFace,
          fontSize: s.num, lineHeight: 0.95, color: fg,
          display: "inline-block",
        }}>{value}</span>
        {suffix && (
          <span style={{
            fontFamily: "var(--font-bold)", fontWeight: 700, fontStyle: "normal",
            fontSize: s.suf, lineHeight: 1, color: fg,
            marginLeft: 4, opacity: 0.85,
          }}>{suffix}</span>
        )}
      </div>
      <div style={{
        marginTop: 12,
        fontFamily: "var(--font-body)", fontSize: s.lab, lineHeight: 1.5,
        color: muted, fontWeight: 500,
      }}>{label}</div>
      {source && (
        <div style={{
          marginTop: 8,
          fontFamily: "var(--font-body)", fontSize: 11, lineHeight: 1.4,
          color: subtle, fontStyle: "italic",
        }}>{source}</div>
      )}
    </div>
  );
}

function FactoidGrid({ style, dark, columns, items, size }) {
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: `repeat(${columns}, 1fr)`,
      gap: columns >= 4 ? 28 : 40,
      paddingTop: 4,
    }}>
      {items.slice(0, columns).map((it, i) => (
        <FactoidCell key={i} style={style} dark={dark} {...it} size={size} />
      ))}
    </div>
  );
}

// Heading + dek + grid (full block)
function FactoidBlock({ style, dark, columns, items, size, eyebrow, title, dek }) {
  const fg = dark ? "#fff" : "var(--text-primary)";
  const muted = dark ? "rgba(255,255,255,0.78)" : "var(--text-secondary)";
  const accent = dark ? "#DDAC37" : "var(--brand-accent)";

  return (
    <div>
      <div style={{ marginBottom: 36, maxWidth: 720 }}>
        <div style={{
          fontFamily: "var(--font-bold)", fontWeight: 700, fontSize: 11,
          textTransform: "uppercase", letterSpacing: "0.16em",
          color: accent, marginBottom: 10,
        }}>{eyebrow}</div>
        <h2 className={style === "bold" ? "heading--bold" : (style === "elegant" ? "heading--elegant" : "heading--display")}
            style={{ margin: "0 0 12px", fontSize: 36, lineHeight: 1.15, color: fg }}>
          {title}
        </h2>
        <p style={{ margin: 0, fontFamily: "var(--font-body)", fontSize: 15.5, lineHeight: 1.65, color: muted, maxWidth: 600 }}>
          {dek}
        </p>
      </div>
      <FactoidGrid style={style} dark={dark} columns={columns} items={items} size={size} />
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────
// FACTOIDS PAGE
// ────────────────────────────────────────────────────────────────────────

const FACTOID_DATA = [
  { value: "412", suffix: " mi", label: "Continuously instrumented freight corridor coming online by year's end.", source: "TTI Freight Operations Group · 2025" },
  { value: "37", suffix: "%", label: "Reduction in stop-line non-compliance at twelve treated rural intersections.", source: "Hassan et al. · 36-mo follow-up" },
  { value: "2.1", suffix: "M", label: "Vehicles per day across the Texas Triangle's monitored corridors.", source: "TTI MovementLab · Q3 2025" },
  { value: "84", suffix: "%", label: "Reduction in late-night roadway-departure crashes at retrofit sites.", source: "Year-three control comparison" },
  { value: "12", suffix: null, label: "Counties enrolled in the rural-roadway before/after study.", source: "TxDOT IAC 2020-78-104" },
];

const FACTOID_DATA_DARK = [
  { value: "60", suffix: " yrs", label: "Of continuous transportation research at Texas A&M.", source: "Founded 1950" },
  { value: "650", suffix: "+", label: "Active research projects across all twelve labs.", source: "FY 2025 portfolio" },
  { value: "$110", suffix: "M", label: "In annual sponsored research, half from federal sources.", source: "FY 2025 sponsored research report" },
  { value: "23", suffix: null, label: "States with active TTI deployments.", source: null },
  { value: "1.4", suffix: "K", label: "Researchers, staff, and graduate assistants.", source: null },
];

function FactoidsPage() {
  const item = (window.AGGIE_CATALOG || []).find(c => c.id === "factoids");

  return (
    <PageShell item={item}>
      <NVIntro>
        The institutional <strong>"by the numbers"</strong> block — oversized statistics in a row, each with its own short label and optional source line. The numeral face changes per style: Open Sans heavy on default, Work Sans bold-italic on bold, Georgia italic on elegant. <strong>Three densities</strong>: 3-up (96px numbers), 4-up (72px), 5-up (56px).
      </NVIntro>

      <NVSectionLabel>3-up · large numerals · all three styles</NVSectionLabel>
      {["default", "bold", "elegant"].map(s => (
        <NVBox key={s} dark={false} label={`style = ${s} · 3-up`}>
          <FactoidBlock
            style={s} dark={false}
            columns={3} size="lg"
            items={FACTOID_DATA}
            eyebrow="By the numbers"
            title="What three years of follow-up data is telling us."
            dek="Treatment outcomes from twelve rural intersections, measured through 36 months of post-construction observation."
          />
        </NVBox>
      ))}

      <NVSectionLabel>4-up · medium · with eyebrow + title</NVSectionLabel>
      <NVBox dark={false} label="bold style · 4-up · medium numerals">
        <FactoidBlock
          style="bold" dark={false}
          columns={4} size="md"
          items={FACTOID_DATA}
          eyebrow="Statewide measurement"
          title="The numbers behind a year of monitoring."
          dek="What our continuous-instrumentation network captured across the Texas Triangle in 2025."
        />
      </NVBox>

      <NVSectionLabel>5-up · compact · headline-only treatment</NVSectionLabel>
      <NVBox dark={false} label="default style · 5-up · small numerals">
        <FactoidGrid style="default" dark={false} columns={5} items={FACTOID_DATA} size="sm" />
      </NVBox>

      <NVSectionLabel>On dark · institutional brag-numbers</NVSectionLabel>
      <NVBox dark={true} label="bold style · 3-up · institutional">
        <FactoidBlock
          style="bold" dark={true}
          columns={3} size="lg"
          items={FACTOID_DATA_DARK}
          eyebrow="The Institute"
          title="Sixty years of transportation research at scale."
          dek="A snapshot of the work we've taken on this fiscal year, and the people doing it."
        />
      </NVBox>

      <NVBox dark={true} label="elegant style · 4-up · medium · on dark">
        <FactoidGrid style="elegant" dark={true} columns={4} items={FACTOID_DATA_DARK} size="md" />
      </NVBox>

      <NVBox dark={true} label="default style · 5-up · compact · on dark">
        <FactoidGrid style="default" dark={true} columns={5} items={FACTOID_DATA_DARK} size="sm" />
      </NVBox>

      <NVSpecRow>
        <NVSpec label="Numeral sizes" value="56 / 72 / 96px" note="5-up / 4-up / 3-up — never larger than page H1" />
        <NVSpec label="Numeral face" value="style-specific" note="Open Sans 700 / Work Sans 800-italic / Georgia italic" />
        <NVSpec label="Suffix" value="Work Sans 700" note="constant — never matches the numeral face, anchors the unit" />
        <NVSpec label="Source line" value="11px italic" note="optional · attribution-grade typography" />
      </NVSpecRow>
    </PageShell>
  );
}

// ════════════════════════════════════════════════════════════════════════
// TESTIMONIAL COLLECTION
// ════════════════════════════════════════════════════════════════════════

function NVPortrait({ initial, size = 64, dark, color }) {
  const bg = color === "gold"
    ? "linear-gradient(135deg, #DDAC37, #A87B1F)"
    : color === "navy"
      ? "linear-gradient(135deg, #2E4A6B, #1A2E45)"
      : "linear-gradient(135deg, #5C0025, #3A0014)";
  const fg = color === "gold" ? "#2A0E15" : "#fff";
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: bg, color: fg,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "var(--font-display)", fontSize: size * 0.42,
      flexShrink: 0,
      position: "relative", overflow: "hidden",
      border: dark ? "1px solid rgba(255,255,255,0.2)" : "1px solid rgba(0,0,0,0.05)",
    }}>
      <span style={{ position: "relative", zIndex: 1 }}>{initial}</span>
      <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.18) 0%, transparent 50%)" }} />
    </div>
  );
}

const TESTIMONIAL_DATA = [
  { initial: "L", color: "maroon", quote: "Engineering-only treatments rarely hold past 24 months — this one is doing something different.", name: "Dr. Lina Hassan", role: "Principal Investigator · Roadway Safety" },
  { initial: "M", color: "navy", quote: "The before/after framework is finally giving us answers that survive replication. That hasn't always been true.", name: "Marcus Reilly", role: "Field Research Coordinator" },
  { initial: "I", color: "gold", quote: "We needed equity-weighted outcomes to be a first-class measurement, not a footnote on the executive summary.", name: "Dr. Imani Park", role: "Director, Center for Transportation Equity" },
  { initial: "S", color: "maroon", quote: "What surprised us most was how much the corridor-level data changed our intuitions about what counts as risky driving.", name: "Sarah Okonkwo", role: "Senior Data Engineer · MovementLab" },
];

// Layout 1 — card grid, photo + quote stacked vertically
function TestimonialCard({ style, dark, item }) {
  const fg = dark ? "#fff" : "var(--text-primary)";
  const muted = dark ? "rgba(255,255,255,0.7)" : "var(--text-muted)";
  const accent = dark ? "#DDAC37" : "var(--brand-accent)";
  const cardBg = dark ? "rgba(255,255,255,0.04)" : "var(--surface-raised)";
  const border = dark ? "1px solid rgba(255,255,255,0.12)" : "1px solid var(--surface-border)";

  return (
    <div style={{
      background: cardBg, border, borderRadius: "var(--radius-md)",
      padding: "28px 26px 24px", display: "flex", flexDirection: "column", height: "100%",
    }}>
      <div style={{
        fontFamily: "var(--font-elegant)", fontStyle: "italic", fontWeight: 400,
        fontSize: 56, lineHeight: 0.5, color: accent, opacity: 0.7, marginBottom: 10,
      }}>"</div>
      <p style={{
        margin: "0 0 24px",
        fontFamily: style === "elegant" ? "var(--font-elegant)" : "var(--font-body)",
        fontStyle: style === "default" ? "normal" : "italic",
        fontSize: 16, lineHeight: 1.55, color: fg,
        flex: 1,
      }}>{item.quote}</p>
      <div style={{ display: "flex", alignItems: "center", gap: 14, paddingTop: 18, borderTop: dark ? "1px solid rgba(255,255,255,0.12)" : "1px solid var(--surface-border)" }}>
        <NVPortrait initial={item.initial} size={48} dark={dark} color={item.color} />
        <div>
          <div style={{ fontFamily: "var(--font-bold)", fontWeight: 700, fontSize: 12.5, textTransform: "uppercase", letterSpacing: "0.08em", color: fg, marginBottom: 3 }}>{item.name}</div>
          <div style={{ fontFamily: "var(--font-body)", fontSize: 12, color: muted, lineHeight: 1.4 }}>{item.role}</div>
        </div>
      </div>
    </div>
  );
}

// Layout 2 — horizontal row, photo-left + quote stacked
function TestimonialRow({ style, dark, item }) {
  const fg = dark ? "#fff" : "var(--text-primary)";
  const muted = dark ? "rgba(255,255,255,0.7)" : "var(--text-muted)";
  const accent = dark ? "#DDAC37" : "var(--brand-accent)";

  return (
    <div style={{
      display: "flex", gap: 24, padding: "24px 0",
      borderBottom: dark ? "1px solid rgba(255,255,255,0.1)" : "1px solid var(--surface-border)",
    }}>
      <NVPortrait initial={item.initial} size={80} dark={dark} color={item.color} />
      <div style={{ flex: 1, paddingTop: 4 }}>
        <p style={{
          margin: "0 0 14px",
          fontFamily: style === "elegant" ? "var(--font-elegant)" : "var(--font-body)",
          fontStyle: "italic",
          fontSize: 17, lineHeight: 1.5, color: fg,
        }}>"{item.quote}"</p>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <NVSig style={style} dark={dark} width={32} />
          <span style={{ fontFamily: "var(--font-bold)", fontWeight: 700, fontSize: 12, textTransform: "uppercase", letterSpacing: "0.1em", color: accent }}>{item.name}</span>
          <span style={{ fontFamily: "var(--font-body)", fontSize: 12, color: muted }}>· {item.role}</span>
        </div>
      </div>
    </div>
  );
}

// Layout 3 — featured + supporting (one large, two compact)
function TestimonialFeatured({ style, dark, hero, supporting }) {
  const fg = dark ? "#fff" : "var(--text-primary)";
  const muted = dark ? "rgba(255,255,255,0.7)" : "var(--text-muted)";
  const accent = dark ? "#DDAC37" : "var(--brand-accent)";
  const heroBg = dark ? "rgba(255,255,255,0.06)" : "color-mix(in srgb, var(--brand-primary) 4%, transparent)";

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 24 }}>
      {/* Hero */}
      <div style={{
        background: heroBg,
        borderRadius: "var(--radius-md)",
        padding: "36px 36px 32px",
        display: "flex", flexDirection: "column", justifyContent: "space-between",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", top: 16, right: 24,
          fontFamily: "var(--font-elegant)", fontStyle: "italic", fontWeight: 400,
          fontSize: 180, lineHeight: 0.7, color: accent, opacity: 0.18,
          pointerEvents: "none",
        }}>"</div>
        <p style={{
          margin: "12px 0 28px",
          position: "relative", zIndex: 1,
          fontFamily: style === "elegant" ? "var(--font-elegant)" : (style === "bold" ? "var(--font-bold)" : "var(--font-body)"),
          fontStyle: "italic",
          fontWeight: style === "bold" ? 600 : 400,
          fontSize: 22, lineHeight: 1.45, color: fg,
        }}>{hero.quote}</p>
        <div style={{ position: "relative", zIndex: 1 }}>
          <NVSig style={style} dark={dark} width={60} />
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 14 }}>
            <NVPortrait initial={hero.initial} size={56} dark={dark} color={hero.color} />
            <div>
              <div style={{ fontFamily: "var(--font-bold)", fontWeight: 700, fontSize: 13, textTransform: "uppercase", letterSpacing: "0.1em", color: fg }}>{hero.name}</div>
              <div style={{ fontFamily: "var(--font-body)", fontSize: 12.5, color: muted, marginTop: 2 }}>{hero.role}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Supporting */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {supporting.map((s, i) => (
          <div key={i} style={{
            border: dark ? "1px solid rgba(255,255,255,0.12)" : "1px solid var(--surface-border)",
            borderRadius: "var(--radius-md)", padding: "20px 22px",
            display: "flex", flexDirection: "column", gap: 12, flex: 1,
          }}>
            <p style={{
              margin: 0,
              fontFamily: style === "elegant" ? "var(--font-elegant)" : "var(--font-body)",
              fontStyle: "italic",
              fontSize: 13.5, lineHeight: 1.5, color: fg,
            }}>"{s.quote}"</p>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: "auto" }}>
              <NVPortrait initial={s.initial} size={32} dark={dark} color={s.color} />
              <div>
                <div style={{ fontFamily: "var(--font-bold)", fontWeight: 700, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em", color: fg }}>{s.name}</div>
                <div style={{ fontFamily: "var(--font-body)", fontSize: 11, color: muted, marginTop: 1 }}>{s.role}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────
// TESTIMONIALS PAGE
// ────────────────────────────────────────────────────────────────────────

function TestimonialsPage() {
  const item = (window.AGGIE_CATALOG || []).find(c => c.id === "testimonials");

  return (
    <PageShell item={item}>
      <NVIntro>
        Multi-up testimonial layouts — the team-voices counterpart to the standalone blockquote. <strong>Three layouts</strong>: card grid (most common, 2/3-up), horizontal row list (compact directory feel), and featured+supporting (one hero quote with two smaller). Italic display body, Work Sans 700 attribution, gradient avatar placeholders.
      </NVIntro>

      <NVSectionLabel>Layout 1 — card grid · 3-up · all three styles</NVSectionLabel>
      {["default", "bold", "elegant"].map(s => (
        <NVBox key={s} dark={false} label={`style = ${s} · 3-up cards`}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
            {TESTIMONIAL_DATA.slice(0, 3).map((t, i) => (
              <TestimonialCard key={i} style={s} dark={false} item={t} />
            ))}
          </div>
        </NVBox>
      ))}

      <NVSectionLabel>Layout 1 — card grid · 2-up · wider cards</NVSectionLabel>
      <NVBox dark={false} label="elegant style · 2-up · roomier">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 24 }}>
          {TESTIMONIAL_DATA.slice(0, 2).map((t, i) => (
            <TestimonialCard key={i} style="elegant" dark={false} item={t} />
          ))}
        </div>
      </NVBox>

      <NVSectionLabel>Layout 2 — horizontal row list · directory-feel</NVSectionLabel>
      <NVBox dark={false} label="default style · 4 testimonials in a row list">
        {TESTIMONIAL_DATA.map((t, i) => (
          <TestimonialRow key={i} style="default" dark={false} item={t} />
        ))}
      </NVBox>

      <NVBox dark={false} label="bold style · 4 testimonials in a row list">
        {TESTIMONIAL_DATA.map((t, i) => (
          <TestimonialRow key={i} style="bold" dark={false} item={t} />
        ))}
      </NVBox>

      <NVSectionLabel>Layout 3 — featured + supporting · one hero, two small</NVSectionLabel>
      {["default", "bold", "elegant"].map(s => (
        <NVBox key={s} dark={false} label={`style = ${s} · featured layout`}>
          <TestimonialFeatured
            style={s} dark={false}
            hero={TESTIMONIAL_DATA[0]}
            supporting={TESTIMONIAL_DATA.slice(1, 3)}
          />
        </NVBox>
      ))}

      <NVSectionLabel>On dark · all three layouts · bold style</NVSectionLabel>
      <NVBox dark={true} label="card grid · 3-up · on brand maroon">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
          {TESTIMONIAL_DATA.slice(0, 3).map((t, i) => (
            <TestimonialCard key={i} style="bold" dark={true} item={t} />
          ))}
        </div>
      </NVBox>

      <NVBox dark={true} label="horizontal row list · on brand maroon">
        {TESTIMONIAL_DATA.slice(0, 3).map((t, i) => (
          <TestimonialRow key={i} style="bold" dark={true} item={t} />
        ))}
      </NVBox>

      <NVBox dark={true} label="featured + supporting · on brand maroon">
        <TestimonialFeatured
          style="bold" dark={true}
          hero={TESTIMONIAL_DATA[0]}
          supporting={TESTIMONIAL_DATA.slice(1, 3)}
        />
      </NVBox>

      <NVSpecRow>
        <NVSpec label="Card padding" value="28 / 26 / 24px" note="top/sides/bottom — bottom is tighter to balance attribution row" />
        <NVSpec label="Quote font" value="style-specific" note="Open Sans italic / Work Sans italic / Georgia italic" />
        <NVSpec label="Avatar" value="48 / 80 / 56px" note="card-grid / row-list / featured — proportional to layout density" />
        <NVSpec label="Avatar tints" value="maroon · navy · gold" note="3-color rotation; never randomize, assign by speaker" />
      </NVSpecRow>
    </PageShell>
  );
}

Object.assign(window, { FactoidsPage, TestimonialsPage });
