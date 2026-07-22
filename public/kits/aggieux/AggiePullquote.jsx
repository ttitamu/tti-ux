/* global React, PageShell, LucideIcon, AGGIE_CATALOG */
/*
 * AggiePullquote.jsx — Editorial pullquote family (2 pages).
 *
 *   Callouts             — Inline pulled-aside fact, stat, or short quote
 *                          inserted into running body copy. Three layouts:
 *                          left-rule, side-quote, big-fact.
 *   Standalone blockquote — Full-width section-level pullquote with photo
 *                           or initial, oversized quote mark, attribution.
 *
 * Both adopt the page's style signature on their leading rule.
 */

// ════════════════════════════════════════════════════════════════════════
// Shared helpers (PQ prefix)
// ════════════════════════════════════════════════════════════════════════

function PQBox({ dark = false, label, children, padded = true }) {
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
      <div style={{ padding: padded ? 32 : 0, background: dark ? "var(--brand-primary)" : "var(--surface-page)" }}>
        {children}
      </div>
    </div>
  );
}

function PQSectionLabel({ children }) {
  return (
    <div style={{
      fontSize: "0.62rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em",
      color: "var(--text-muted)", fontFamily: "var(--font-body-bold)", marginBottom: 12, marginTop: 16,
    }}>{children}</div>
  );
}

function PQSpecRow({ children }) {
  return (
    <div style={{
      marginTop: 28, padding: "14px 18px", border: "1px solid var(--surface-border)",
      borderRadius: "var(--radius-md)", background: "var(--surface-raised)",
      display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16,
    }}>{children}</div>
  );
}

function PQSpec({ label, value, note }) {
  return (
    <div>
      <div style={{ fontSize: "0.6rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-muted)", fontFamily: "var(--font-body-bold)" }}>{label}</div>
      <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem", color: "var(--brand-primary)", marginTop: 3, fontWeight: 500 }}>{value}</div>
      {note && <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: 2, lineHeight: 1.4 }}>{note}</div>}
    </div>
  );
}

function PQIntro({ children }) {
  return (
    <div style={{ padding: "16px 20px", marginBottom: 28, background: "color-mix(in srgb, var(--brand-primary) 5%, transparent)", borderLeft: "3px solid var(--brand-primary)", borderRadius: "0 var(--radius-sm) var(--radius-sm) 0", fontSize: "0.92rem", lineHeight: 1.65, color: "var(--text-secondary)" }}>
      {children}
    </div>
  );
}

// Style signature — leading rule (vertical, for callouts) and trailing rule (horizontal)
function PQSigVertical({ style, dark, height = "auto" }) {
  const c = dark ? "rgba(255,255,255,0.9)" : "var(--brand-primary)";
  if (style === "bold") {
    return (
      <div style={{ width: 6, alignSelf: "stretch", display: "flex", flexDirection: "column", gap: 4, paddingTop: 6, paddingBottom: 6 }}>
        <span style={{ display: "block", width: 6, flex: "1 1 55%", borderRadius: 3, background: c }} />
        <span style={{ display: "block", width: 6, flex: "1 1 18%", borderRadius: 3, background: c, opacity: 0.5 }} />
        <span style={{ display: "block", width: 6, flex: "1 1 8%",  borderRadius: 3, background: c, opacity: 0.25 }} />
      </div>
    );
  }
  if (style === "elegant") {
    const accent = dark ? "rgba(255,255,255,0.9)" : "var(--brand-accent)";
    return (
      <div style={{
        width: 8, alignSelf: "stretch",
        backgroundImage: `repeating-linear-gradient(45deg, ${accent} 0 1.4px, transparent 1.4px 7px)`,
        WebkitMaskImage: "linear-gradient(180deg, transparent 0%, black 12%, black 88%, transparent 100%)",
        maskImage: "linear-gradient(180deg, transparent 0%, black 12%, black 88%, transparent 100%)",
        opacity: 0.85,
      }} />
    );
  }
  // default
  return (
    <div style={{
      width: 2, alignSelf: "stretch",
      background: `linear-gradient(180deg, transparent 0%, ${c} 12%, ${c} 88%, transparent 100%)`,
      opacity: 0.9,
    }} />
  );
}

function PQSigHorizontal({ style, dark, width = 100 }) {
  const c = dark ? "rgba(255,255,255,0.9)" : "var(--brand-primary)";
  if (style === "bold") {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
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

// Body-copy stub for showing callouts in context
function BodyStub({ dark, paragraphs = 2 }) {
  const text = dark ? "rgba(255,255,255,0.78)" : "var(--text-secondary)";
  const samples = [
    "Roadway departure crashes account for more than half of rural fatalities, and the persistent geographic distribution of these events points to enduring infrastructure conditions rather than transient driver behavior.",
    "TTI's twelve-county before/after study began in 2020, with reconstruction work staggered across three field seasons. Each treated intersection received high-friction surface treatment, retroreflective markings, and a chevron alignment package; control intersections received only routine maintenance.",
    "Compliance gains held steady through the 36-month follow-up window. Three of the twelve treated sites also showed measurable reductions in late-night crashes — a secondary outcome that the team is investigating in a follow-on dissertation project at A&M.",
  ];
  return (
    <div>
      {samples.slice(0, paragraphs).map((p, i) => (
        <p key={i} style={{
          margin: i === 0 ? "0 0 18px" : "0 0 18px",
          fontFamily: "var(--font-body)", fontSize: 15.5, lineHeight: 1.7,
          color: text, maxWidth: 640,
        }}>{p}</p>
      ))}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════
// CALLOUTS — three layouts
// ════════════════════════════════════════════════════════════════════════

// Layout A: Left-rule callout (inline; rule on left, content right)
function CalloutLeftRule({ style, dark, kind = "fact", content }) {
  const fg = dark ? "#fff" : "var(--text-primary)";
  const muted = dark ? "rgba(255,255,255,0.78)" : "var(--text-secondary)";
  const accent = dark ? "#DDAC37" : "var(--brand-primary)";

  return (
    <div style={{
      display: "flex", gap: 22, padding: "8px 0",
      maxWidth: 680, margin: "8px 0",
    }}>
      <PQSigVertical style={style} dark={dark} />
      <div style={{ flex: 1, paddingTop: 4, paddingBottom: 4 }}>
        <div style={{
          fontFamily: "var(--font-bold)", fontWeight: 700, fontSize: 11,
          textTransform: "uppercase", letterSpacing: "0.14em",
          color: accent, marginBottom: 8,
        }}>{kind === "stat" ? "Key finding" : (kind === "quote" ? "Voice" : "Worth noting")}</div>
        {content}
      </div>
    </div>
  );
}

// Layout B: Side-quote (large quote mark, italic body, attribution)
function CalloutSideQuote({ style, dark, quote, attribution, role }) {
  const fg = dark ? "#fff" : "var(--text-primary)";
  const muted = dark ? "rgba(255,255,255,0.7)" : "var(--text-muted)";
  const accent = dark ? "#DDAC37" : "var(--brand-accent)";

  return (
    <div style={{
      maxWidth: 380, padding: "20px 24px",
      background: dark ? "rgba(255,255,255,0.04)" : "var(--surface-sunken)",
      borderTop: `2px solid ${accent}`,
      borderBottom: `1px solid ${dark ? "rgba(255,255,255,0.15)" : "var(--surface-border)"}`,
    }}>
      <div style={{
        fontFamily: "var(--font-elegant)", fontWeight: 400, fontSize: 60,
        lineHeight: 0.6, color: accent,
        marginBottom: 4,
      }}>"</div>
      <p style={{
        margin: "0 0 18px",
        fontFamily: "var(--font-elegant)", fontStyle: "italic", fontSize: 19,
        lineHeight: 1.45, color: fg,
      }}>{quote}</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <span style={{
          fontFamily: "var(--font-bold)", fontWeight: 700, fontSize: 12,
          textTransform: "uppercase", letterSpacing: "0.1em", color: fg,
        }}>{attribution}</span>
        <span style={{ fontFamily: "var(--font-body)", fontSize: 12, color: muted }}>{role}</span>
      </div>
    </div>
  );
}

// Layout C: Big-fact (oversized number + label)
function CalloutBigFact({ style, dark, value, suffix, label }) {
  const fg = dark ? "#fff" : "var(--brand-primary)";
  const muted = dark ? "rgba(255,255,255,0.78)" : "var(--text-secondary)";

  // Style-aware numeral face
  const valueFontFamily = style === "elegant" ? "var(--font-elegant)" : (style === "bold" ? "var(--font-bold)" : "var(--font-display)");
  const valueFontWeight = style === "bold" ? 800 : (style === "elegant" ? 400 : 500);
  const valueFontStyle = (style === "elegant" || style === "bold") ? "italic" : "normal";

  return (
    <div style={{ maxWidth: 320, padding: "8px 0" }}>
      <PQSigHorizontal style={style} dark={dark} width={70} />
      <div style={{
        marginTop: 14,
        fontFamily: valueFontFamily, fontWeight: valueFontWeight, fontStyle: valueFontStyle,
        fontSize: 78, lineHeight: 0.95, color: fg,
        letterSpacing: style === "bold" ? "-0.01em" : (style === "elegant" ? "-0.02em" : "0"),
      }}>
        {value}
        <span style={{ fontSize: 38, marginLeft: 4, opacity: 0.85, fontFamily: "var(--font-bold)", fontWeight: 700, fontStyle: "normal" }}>{suffix}</span>
      </div>
      <div style={{
        marginTop: 12, fontFamily: "var(--font-body)", fontSize: 14, lineHeight: 1.5,
        color: muted, maxWidth: 280,
      }}>{label}</div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// CALLOUTS PAGE
// ────────────────────────────────────────────────────────────

function CalloutsPage() {
  const item = (window.AGGIE_CATALOG || []).find(c => c.id === "callouts");

  const calloutContent = (dark) => (
    <p style={{
      margin: 0, maxWidth: 480,
      fontFamily: "var(--font-body)", fontSize: 16, lineHeight: 1.6,
      color: dark ? "#fff" : "var(--text-primary)", fontWeight: 500,
    }}>
      Compliance improvements at the twelve treated intersections held steady through the 36-month follow-up — a result that's unusual for engineering-only safety treatments.
    </p>
  );

  return (
    <PageShell item={item}>
      <PQIntro>
        Pulled-aside editorial accents — short statements that interrupt the body flow. <strong>Three layouts</strong>: a left-rule callout (most common), a side-quote pulled into the column gutter, and a big-fact stat block. The leading rule adopts the page's style signature.
      </PQIntro>

      <PQSectionLabel>Layout A — left-rule callout · in body context</PQSectionLabel>
      {["default", "bold", "elegant"].map(s => (
        <PQBox key={s} dark={false} label={`style = ${s}`}>
          <BodyStub dark={false} paragraphs={1} />
          <CalloutLeftRule style={s} dark={false} kind="fact" content={calloutContent(false)} />
          <BodyStub dark={false} paragraphs={1} />
        </PQBox>
      ))}

      <PQSectionLabel>Layout B — side-quote · for testimonial-style accents</PQSectionLabel>
      <PQBox dark={false} label="three styles · same content">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
          {["default", "bold", "elegant"].map(s => (
            <CalloutSideQuote
              key={s}
              style={s}
              dark={false}
              quote="Engineering-only treatments rarely hold past 24 months — this one is doing something different."
              attribution="Dr. Lina Hassan"
              role="Principal Investigator"
            />
          ))}
        </div>
      </PQBox>

      <PQSectionLabel>Layout C — big-fact · for stand-alone stats</PQSectionLabel>
      <PQBox dark={false} label="three styles · same content">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 32 }}>
          {["default", "bold", "elegant"].map(s => (
            <CalloutBigFact
              key={s}
              style={s}
              dark={false}
              value="37"
              suffix="%"
              label="Improvement in stop-line compliance, sustained through 36-month follow-up."
            />
          ))}
        </div>
      </PQBox>

      <PQSectionLabel>On dark · all three layouts · default style</PQSectionLabel>
      <PQBox dark={true} label="brand maroon ground">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 32 }}>
          <CalloutLeftRule style="default" dark={true} kind="fact" content={calloutContent(true)} />
          <CalloutSideQuote
            style="default" dark={true}
            quote="The before/after framework is finally giving us answers that survive replication."
            attribution="Marcus Reilly"
            role="Field Research Coordinator"
          />
          <CalloutBigFact
            style="default" dark={true}
            value="412"
            suffix=" mi"
            label="Of continuously instrumented freight corridor coming online by year's end."
          />
        </div>
      </PQBox>

      <PQSpecRow>
        <PQSpec label="Layouts" value="left-rule · side-quote · big-fact" note="pick by content type, not by style" />
        <PQSpec label="Max width" value="left-rule 680px" note="aligns with body column" />
        <PQSpec label="Big-fact size" value="78px" note="pairs with body — never bigger than page H1" />
        <PQSpec label="Limit" value="≤2 callouts per article" note="each callout breaks reading flow; use sparingly" />
      </PQSpecRow>
    </PageShell>
  );
}

// ════════════════════════════════════════════════════════════════════════
// STANDALONE BLOCKQUOTE
// ════════════════════════════════════════════════════════════════════════

function PortraitPlaceholder({ initial = "L", size = 100, dark }) {
  return (
    <div style={{
      width: size, height: size,
      background: dark ? "linear-gradient(135deg, #DDAC37, #A87B1F)" : "linear-gradient(135deg, #5C0025, #3A0014)",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "var(--font-display)", fontSize: size * 0.5,
      color: dark ? "#2A0E15" : "#fff",
      borderRadius: "50%",
      flexShrink: 0,
      position: "relative", overflow: "hidden",
    }}>
      <span style={{ position: "relative", zIndex: 1 }}>{initial}</span>
      <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.18) 0%, transparent 50%)" }} />
    </div>
  );
}

// Layout 1: portrait + quote + attribution (horizontal)
function StandaloneQuoteHorizontal({ style, dark, attribution, role, initial, quote }) {
  const fg = dark ? "#fff" : "var(--text-primary)";
  const muted = dark ? "rgba(255,255,255,0.7)" : "var(--text-muted)";
  const accent = dark ? "#DDAC37" : "var(--brand-accent)";

  return (
    <div style={{ display: "flex", gap: 40, alignItems: "center", maxWidth: 920 }}>
      <PortraitPlaceholder initial={initial} size={140} dark={dark} />
      <div style={{ flex: 1, position: "relative", paddingLeft: 8 }}>
        <div style={{
          position: "absolute", left: -28, top: -16,
          fontFamily: "var(--font-elegant)", fontWeight: 400, fontStyle: "italic",
          fontSize: 110, lineHeight: 0.6, color: accent, opacity: 0.65,
        }}>"</div>
        <p style={{
          margin: "0 0 24px",
          fontFamily: style === "elegant" ? "var(--font-elegant)" : (style === "bold" ? "var(--font-bold)" : "var(--font-body)"),
          fontStyle: "italic",
          fontWeight: style === "bold" ? 600 : 400,
          fontSize: 26, lineHeight: 1.4, color: fg,
        }}>{quote}</p>
        <PQSigHorizontal style={style} dark={dark} width={80} />
        <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 4 }}>
          <span style={{
            fontFamily: "var(--font-bold)", fontWeight: 700, fontSize: 13,
            textTransform: "uppercase", letterSpacing: "0.1em", color: fg,
          }}>{attribution}</span>
          <span style={{ fontFamily: "var(--font-body)", fontSize: 13.5, color: muted }}>{role}</span>
        </div>
      </div>
    </div>
  );
}

// Layout 2: oversized initial-cap + quote (drop-cap style)
function StandaloneQuoteDropCap({ style, dark, attribution, role, quote }) {
  const fg = dark ? "#fff" : "var(--text-primary)";
  const muted = dark ? "rgba(255,255,255,0.7)" : "var(--text-muted)";
  const accent = dark ? "#DDAC37" : "var(--brand-primary)";

  // Pull first letter for drop cap
  const first = quote.charAt(0);
  const rest = quote.slice(1);

  return (
    <div style={{ maxWidth: 880, padding: "8px 0" }}>
      <div style={{ display: "flex", gap: 4, alignItems: "flex-start" }}>
        <span style={{
          fontFamily: style === "bold" ? "var(--font-bold)" : (style === "elegant" ? "var(--font-elegant)" : "var(--font-display)"),
          fontWeight: style === "bold" ? 800 : 500,
          fontStyle: (style === "bold" || style === "elegant") ? "italic" : "normal",
          fontSize: 140, lineHeight: 0.85, color: accent,
          marginRight: 14, marginTop: -8,
          flexShrink: 0,
        }}>{first}</span>
        <p style={{
          margin: 0, paddingTop: 12,
          fontFamily: style === "elegant" ? "var(--font-elegant)" : "var(--font-body)",
          fontStyle: "italic",
          fontSize: 28, lineHeight: 1.35, color: fg,
        }}>{rest}</p>
      </div>
      <div style={{ marginTop: 24, paddingLeft: 154 }}>
        <PQSigHorizontal style={style} dark={dark} width={80} />
        <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 4 }}>
          <span style={{
            fontFamily: "var(--font-bold)", fontWeight: 700, fontSize: 13,
            textTransform: "uppercase", letterSpacing: "0.1em", color: fg,
          }}>{attribution}</span>
          <span style={{ fontFamily: "var(--font-body)", fontSize: 13.5, color: muted }}>{role}</span>
        </div>
      </div>
    </div>
  );
}

// Layout 3: centered, full-bleed-ish, with rules above and below
function StandaloneQuoteCentered({ style, dark, attribution, role, quote }) {
  const fg = dark ? "#fff" : "var(--text-primary)";
  const muted = dark ? "rgba(255,255,255,0.7)" : "var(--text-muted)";
  const accent = dark ? "#DDAC37" : "var(--brand-accent)";

  return (
    <div style={{
      maxWidth: 740, margin: "0 auto", padding: "32px 0", textAlign: "center",
    }}>
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
        <PQSigHorizontal style={style} dark={dark} width={120} />
      </div>
      <p style={{
        margin: "0 0 28px",
        fontFamily: style === "bold" ? "var(--font-bold)" : "var(--font-elegant)",
        fontStyle: "italic",
        fontWeight: style === "bold" ? 700 : 400,
        fontSize: 32, lineHeight: 1.35, color: fg,
        textTransform: style === "bold" ? "uppercase" : "none",
      }}>"{quote}"</p>
      <div>
        <span style={{
          fontFamily: "var(--font-bold)", fontWeight: 700, fontSize: 12,
          textTransform: "uppercase", letterSpacing: "0.14em", color: accent,
        }}>{attribution}</span>
        <span style={{ fontFamily: "var(--font-body)", fontSize: 13, color: muted, marginLeft: 14 }}>· {role}</span>
      </div>
    </div>
  );
}

function StandaloneBlockquotePage() {
  const item = (window.AGGIE_CATALOG || []).find(c => c.id === "standalone-blockquote");

  const quote = "We started this study expecting compliance to drift back inside two years. Three years in, we're still asking what made these intersections different.";

  return (
    <PageShell item={item}>
      <PQIntro>
        Section-level pullquote — full-width, attribution-bearing, image-supported. <strong>Three layouts</strong>: portrait+quote (most common), drop-cap-first-letter (editorial), and centered (formal). The italic display face changes per style — Open Sans italic on default, Work Sans bold-italic on bold, Georgia italic on elegant.
      </PQIntro>

      <PQSectionLabel>Layout 1 — portrait + quote · three styles</PQSectionLabel>
      {["default", "bold", "elegant"].map(s => (
        <PQBox key={s} dark={false} label={`style = ${s}`}>
          <StandaloneQuoteHorizontal
            style={s} dark={false}
            initial="L"
            attribution="Dr. Lina Hassan"
            role="Principal Investigator · Roadway Safety"
            quote={quote}
          />
        </PQBox>
      ))}

      <PQSectionLabel>Layout 2 — oversized drop-cap first letter · default + bold + elegant</PQSectionLabel>
      {["default", "bold", "elegant"].map(s => (
        <PQBox key={s} dark={false} label={`style = ${s}`}>
          <StandaloneQuoteDropCap
            style={s} dark={false}
            attribution="Marcus Reilly"
            role="Field Research Coordinator"
            quote={quote}
          />
        </PQBox>
      ))}

      <PQSectionLabel>Layout 3 — centered, formal · three styles</PQSectionLabel>
      {["default", "bold", "elegant"].map(s => (
        <PQBox key={s} dark={false} label={`style = ${s}`}>
          <StandaloneQuoteCentered
            style={s} dark={false}
            attribution="Dr. Imani Park"
            role="Director, Center for Transportation Equity"
            quote={quote}
          />
        </PQBox>
      ))}

      <PQSectionLabel>On dark · all three layouts · bold style</PQSectionLabel>
      <PQBox dark={true} label="brand maroon ground">
        <div style={{ display: "flex", flexDirection: "column", gap: 48 }}>
          <StandaloneQuoteHorizontal
            style="bold" dark={true}
            initial="L"
            attribution="Dr. Lina Hassan"
            role="Principal Investigator · Roadway Safety"
            quote={quote}
          />
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.15)", paddingTop: 32 }} />
          <StandaloneQuoteDropCap
            style="bold" dark={true}
            attribution="Marcus Reilly"
            role="Field Research Coordinator"
            quote={quote}
          />
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.15)", paddingTop: 32 }} />
          <StandaloneQuoteCentered
            style="bold" dark={true}
            attribution="Dr. Imani Park"
            role="Director, Center for Transportation Equity"
            quote={quote}
          />
        </div>
      </PQBox>

      <PQSpecRow>
        <PQSpec label="Quote size" value="26 / 28 / 32px" note="horizontal / drop-cap / centered" />
        <PQSpec label="Italic display" value="Open Sans / Work Sans / Georgia" note="follows page style variant" />
        <PQSpec label="Mark color" value="brand-accent" note="oversized opening-quote glyph at 65% opacity" />
        <PQSpec label="Attribution" value="Work Sans 700 12-13px" note="constant — always the bold caps treatment" />
      </PQSpecRow>
    </PageShell>
  );
}

Object.assign(window, { CalloutsPage, StandaloneBlockquotePage });
