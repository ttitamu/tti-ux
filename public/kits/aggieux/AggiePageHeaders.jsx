/* global React, PageShell, LucideIcon, AGGIE_CATALOG */
/*
 * AggiePageHeaders.jsx — Page Headers + Standard Page Header families.
 *
 * Page Headers = the big overlapping-card hero used at the top of landing
 * pages. Maroon image bleed above; white content card overlaps by ~half.
 * All three style variants share the same structural shell — the heading
 * face + signature is what changes.
 *
 * Standard Page Header = the inline editorial header used at the top of
 * interior pages. No image bleed. Variants differ on:
 *   - Background   : none (white) / lightgray / maroon
 *   - Media        : none / angled-slab image / quick-fact card
 *   - CTA          : none / single / dual
 *
 * Both expose the three style variants → demonstrates how the signatures
 * (hairline / stacked-bars / soft-faded hash) read at hero scale.
 */

// ────────────────────────────────────────────────────────────────────────
// HELPERS — shared between both pages
// ────────────────────────────────────────────────────────────────────────

// Primary button — filled teal
function PHButton({ variant = "primary", children = "Button" }) {
  if (variant === "ghost") {
    return (
      <a href="#" onClick={e => e.preventDefault()} style={{
        display: "inline-flex", alignItems: "center", gap: 8,
        fontFamily: "var(--font-body-bold)", fontSize: 13, fontWeight: 700,
        fontStyle: "italic", textTransform: "uppercase", letterSpacing: "0.08em",
        color: "#006483", textDecoration: "none",
      }}>
        {children}
        <LucideIcon name="arrow-right" size={14} color="#006483" />
      </a>
    );
  }
  return (
    <a href="#" onClick={e => e.preventDefault()} style={{
      display: "inline-flex", alignItems: "center", padding: "14px 22px",
      background: "#006483", color: "#fff",
      fontFamily: "var(--font-body-bold)", fontSize: 13, fontWeight: 700,
      textTransform: "uppercase", letterSpacing: "0.1em",
      textDecoration: "none",
    }}>
      {children}
    </a>
  );
}

// Heading that picks the right face + signature per style
function PHHeading({ style, text = "Heading", size = 56, onDark = false }) {
  const common = {
    margin: 0,
    lineHeight: 1.0,
    color: onDark ? "#fff" : "var(--brand-primary)",
    letterSpacing: style === "elegant" ? "-0.005em" : "0.01em",
  };
  if (style === "bold") {
    return (
      <div>
        <h1 style={{
          ...common,
          fontFamily: "var(--font-bold)",
          fontWeight: 800,
          fontStyle: "italic",
          textTransform: "uppercase",
          fontSize: size,
          letterSpacing: "0",
        }}>{text}</h1>
        <BoldSig onDark={onDark} />
      </div>
    );
  }
  if (style === "elegant") {
    return (
      <div>
        <h1 style={{
          ...common,
          fontFamily: "var(--font-elegant)",
          fontWeight: 400,
          fontStyle: "italic",
          textTransform: "uppercase",
          fontSize: size * 0.92,
        }}>{text}</h1>
        <ElegantSig onDark={onDark} />
      </div>
    );
  }
  // default
  return (
    <div>
      <h1 style={{
        ...common,
        fontFamily: "var(--font-display)",
        fontWeight: 500,
        textTransform: "uppercase",
        fontSize: size,
      }}>{text}</h1>
      <DefaultSig onDark={onDark} />
    </div>
  );
}

function DefaultSig({ onDark }) {
  const c = onDark ? "rgba(255,255,255,0.9)" : "var(--brand-primary)";
  return (
    <div style={{
      width: 96, height: 2, marginTop: 14,
      background: `linear-gradient(90deg, transparent 0%, ${c} 15%, ${c} 85%, transparent 100%)`,
      opacity: 0.85,
    }} />
  );
}
function BoldSig({ onDark }) {
  const c = onDark ? "rgba(255,255,255,0.92)" : "var(--brand-primary)";
  return (
    <div style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 8 }}>
      <span style={{ display: "block", width: 56, height: 7, borderRadius: 3.5, background: c }} />
      <span style={{ display: "block", width: 20, height: 7, borderRadius: 3.5, background: c, opacity: 0.5 }} />
      <span style={{ display: "block", width: 8,  height: 7, borderRadius: 3.5, background: c, opacity: 0.25 }} />
    </div>
  );
}
function ElegantSig({ onDark }) {
  const c = onDark ? "rgba(255,255,255,0.9)" : "var(--brand-accent)";
  return (
    <div style={{
      width: 120, height: 8, marginTop: 16,
      backgroundImage: `repeating-linear-gradient(135deg, ${c} 0 1.5px, transparent 1.5px 7px)`,
      WebkitMaskImage: "linear-gradient(90deg, transparent 0%, black 15%, black 85%, transparent 100%)",
      maskImage: "linear-gradient(90deg, transparent 0%, black 15%, black 85%, transparent 100%)",
      opacity: 0.85,
    }} />
  );
}

// Dot-grid signature band — appears ABOVE the white content card in bold-variant landing headers
function BoldDotGrid() {
  return (
    <div style={{
      width: "100%", height: 18,
      backgroundImage: `radial-gradient(rgba(255,255,255,0.7) 1.3px, transparent 1.3px)`,
      backgroundSize: "7px 7px",
    }} />
  );
}

// Elegant variant gets a tiny hash mark above the card
function ElegantHashAbove() {
  return (
    <div style={{
      width: 64, height: 10,
      backgroundImage: `repeating-linear-gradient(135deg, var(--brand-accent) 0 1.2px, transparent 1.2px 6px)`,
      opacity: 0.7,
    }} />
  );
}

// Labeled frame around a variant
function VariantFrame({ label, dark = false, bg, children, height = 460 }) {
  return (
    <div style={{ border: "1px solid var(--surface-border)", borderRadius: "var(--radius-md)", overflow: "hidden" }}>
      <div style={{
        padding: "7px 14px", fontSize: "0.62rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em",
        color: dark ? "rgba(255,255,255,0.8)" : "var(--text-muted)", fontFamily: "var(--font-body-bold)",
        background: dark ? "var(--brand-primary)" : "var(--surface-sunken)",
        borderBottom: "1px solid var(--surface-border)", display: "flex", justifyContent: "space-between",
      }}>
        <span>{label}</span>
        <span style={{ fontFamily: "var(--font-mono)", fontWeight: 500, opacity: 0.7 }}>on {dark ? "dark" : "light"}</span>
      </div>
      <div style={{ background: bg || "#fff", height, position: "relative", overflow: "hidden" }}>
        {children}
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────
// LANDING PAGE HEADER — overlapping-card hero
// ────────────────────────────────────────────────────────────────────────

function LandingHeaderMock({ style, dark }) {
  // On dark=true: the white card becomes dark maroon, heading white.
  const onDark = dark;
  const heroBg = dark
    ? "linear-gradient(180deg, #3a0a14 0%, #1f0710 100%)"
    : "linear-gradient(180deg, #8a3a30 0%, #3c1510 100%)";
  const cardBg = dark ? "var(--brand-primary-deep, #2b0014)" : "#fff";

  return (
    <>
      {/* maroon image bleed */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 230, background: heroBg }} />
      {/* overlapping card */}
      <div style={{
        position: "absolute", left: 40, right: 40, top: 150,
        background: cardBg,
        padding: "30px 38px 32px",
      }}>
        {/* breadcrumb line */}
        <div style={{ fontFamily: "var(--font-body-bold)", fontSize: 12, fontWeight: 700, marginBottom: 18, display: "flex", alignItems: "center", gap: 10, color: onDark ? "rgba(255,255,255,0.8)" : "#006483" }}>
          <LucideIcon name="home" size={12} color={onDark ? "rgba(255,255,255,0.8)" : "#006483"} />
          <span style={{ textDecoration: "underline" }}>Home</span>
          <span style={{ width: 1, height: 12, background: onDark ? "rgba(255,255,255,0.3)" : "#d1d1d1" }} />
          <span style={{ fontStyle: "italic", fontWeight: 400, color: onDark ? "rgba(255,255,255,0.7)" : "#006483" }}>Research</span>
        </div>

        <PHHeading style={style} text="Connected infrastructure" size={44} onDark={onDark} />

        <p style={{
          marginTop: 22, marginBottom: 22, maxWidth: 560,
          fontFamily: "var(--font-body)", fontSize: 14.5, lineHeight: 1.55,
          color: onDark ? "rgba(255,255,255,0.82)" : "var(--text-primary)",
        }}>
          Statewide research on connected vehicle deployment, instrumented freight corridors, and rural intersection safety. Forty years of continuous federal funding, shared openly with the state.
        </p>

        <div style={{ display: "flex", gap: 22, alignItems: "center" }}>
          <PHButton>Button</PHButton>
          <PHButton variant="ghost">Button</PHButton>
        </div>
      </div>

      {/* bold style: dot-grid band above card */}
      {style === "bold" && (
        <div style={{ position: "absolute", left: 40, right: 40, top: 132, opacity: onDark ? 1 : 0.55 }}>
          <BoldDotGrid />
        </div>
      )}
      {/* elegant style: tiny hash above card */}
      {style === "elegant" && (
        <div style={{ position: "absolute", left: 40, top: 136 }}>
          <ElegantHashAbove />
        </div>
      )}
    </>
  );
}

// ────────────────────────────────────────────────────────────────────────
// STANDARD PAGE HEADER — inline editorial header, no hero bleed
// ────────────────────────────────────────────────────────────────────────

function StandardHeaderMock({ style, dark, bg = "white", media = "none", cta = "single" }) {
  // bg: "white" | "gray" | "maroon"
  const useMaroon = bg === "maroon" || dark;
  const surfaceBg = useMaroon ? "var(--brand-primary)" : (bg === "gray" ? "var(--surface-sunken)" : "#fff");
  const onDark = useMaroon;

  const copyColor = onDark ? "rgba(255,255,255,0.85)" : "var(--text-primary)";

  return (
    <div style={{ position: "absolute", inset: 0, background: surfaceBg, padding: "38px 42px", display: "flex", alignItems: "center", gap: 30, overflow: "hidden" }}>
      {/* left: copy */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontFamily: "var(--font-body-bold)", fontSize: 11, fontWeight: 700, textTransform: "uppercase",
          letterSpacing: "0.12em", color: onDark ? "rgba(255,255,255,0.72)" : "var(--text-muted)", marginBottom: 10,
        }}>
          Foundations
        </div>
        <PHHeading style={style} text="Heading" size={44} onDark={onDark} />
        <p style={{
          marginTop: 18, marginBottom: cta !== "none" ? 22 : 0, maxWidth: 540,
          fontFamily: "var(--font-body)", fontSize: 14, lineHeight: 1.55, color: copyColor,
        }}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean at leo ut eros vehicula consequat. Ut at nulla tristique, scelerisque lorem eget.
        </p>
        {cta === "single" && (
          <PHButton>Button</PHButton>
        )}
        {cta === "dual" && (
          <div style={{ display: "flex", gap: 22, alignItems: "center" }}>
            <PHButton>Button</PHButton>
            <PHButton variant="ghost">Button</PHButton>
          </div>
        )}
      </div>

      {/* right: media */}
      {media === "image" && (
        <div style={{
          width: 260, height: "100%", alignSelf: "stretch", marginRight: -42,
          clipPath: "polygon(12% 0, 100% 0, 100% 100%, 0 100%)",
          background: "linear-gradient(135deg, #a65043 0%, #6d1f1a 100%)",
          position: "relative",
        }}>
          {/* Photo placeholder — subtle radial to read as an image slab */}
          <div style={{
            position: "absolute", inset: 0,
            backgroundImage: "radial-gradient(circle at 60% 40%, rgba(255,255,255,0.08) 0%, transparent 60%)",
          }} />
        </div>
      )}
      {media === "quickfact" && (
        <div style={{
          width: 220, border: "1px solid var(--surface-border)",
          padding: "18px 22px", background: onDark ? "rgba(255,255,255,0.06)" : "#fff",
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <div style={{
              fontFamily: "var(--font-bold)", fontWeight: 800, fontStyle: "italic", textTransform: "uppercase",
              fontSize: 17, color: onDark ? "#fff" : "var(--brand-primary)", letterSpacing: 0,
            }}>Quick fact</div>
            <LucideIcon name="zap" size={16} color={onDark ? "#fff" : "var(--brand-primary)"} />
          </div>
          <p style={{ margin: 0, fontFamily: "var(--font-body)", fontSize: 12.5, lineHeight: 1.5, color: onDark ? "rgba(255,255,255,0.85)" : "var(--text-primary)" }}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean at leo ut eros vehicula consequat.
          </p>
        </div>
      )}
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────
// PAGE: Page Headers (= landing)
// ────────────────────────────────────────────────────────────────────────

function PageHeadersPage() {
  const item = (window.AGGIE_CATALOG || []).find(c => c.id === "page-headers");
  const styles = ["default", "bold", "elegant"];
  return (
    <PageShell item={item}>
      <div style={{ padding: "16px 20px", marginBottom: 28, background: "color-mix(in srgb, var(--brand-primary) 5%, transparent)", borderLeft: "3px solid var(--brand-primary)", borderRadius: "0 var(--radius-sm) var(--radius-sm) 0", fontSize: "0.92rem", lineHeight: 1.65, color: "var(--text-secondary)" }}>
        <strong>Landing page header</strong> — the hero used on landings, top-level sections, and important editorial pages. Full-bleed maroon image area with the content card overlapping by ~40%. Both light + dark backgrounds are supported for the overlapping card. This is the signature slot — the style variant decides which heading face + rule appears here.
      </div>

      {/* Three style variants, light card */}
      <SectionLabel>On light card (standard use)</SectionLabel>
      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 20, marginBottom: 40 }}>
        {styles.map(s => (
          <VariantFrame key={s} label={`style = ${s}`} dark={false} bg="transparent" height={460}>
            <LandingHeaderMock style={s} dark={false} />
          </VariantFrame>
        ))}
      </div>

      {/* Three on dark */}
      <SectionLabel>On dark card (inverted)</SectionLabel>
      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 20, marginBottom: 32 }}>
        {styles.map(s => (
          <VariantFrame key={s} label={`style = ${s}`} dark={true} bg="transparent" height={460}>
            <LandingHeaderMock style={s} dark={true} />
          </VariantFrame>
        ))}
      </div>

      <SpecRow>
        <Spec label="Hero image area" value="230px tall" note="maroon gradient or photograph" />
        <Spec label="Card overlap" value="~80px" note="card top sits ~60% into the image area" />
        <Spec label="Card padding" value="30×38px" note="breathing room matches lede width" />
        <Spec label="Max lede width" value="560px" note="~65ch — drives card width on large breakpoints" />
      </SpecRow>
    </PageShell>
  );
}

// ────────────────────────────────────────────────────────────────────────
// PAGE: Standard Page Header
// ────────────────────────────────────────────────────────────────────────

function StandardPageHeaderPage() {
  const item = (window.AGGIE_CATALOG || []).find(c => c.id === "standard-page-header");
  const styles = ["default", "bold", "elegant"];
  return (
    <PageShell item={item}>
      <div style={{ padding: "16px 20px", marginBottom: 28, background: "color-mix(in srgb, var(--brand-primary) 5%, transparent)", borderLeft: "3px solid var(--brand-primary)", borderRadius: "0 var(--radius-sm) var(--radius-sm) 0", fontSize: "0.92rem", lineHeight: 1.65, color: "var(--text-secondary)" }}>
        <strong>Interior page header</strong> — used at the top of content pages (no hero image). Three axes: <strong>background</strong> (white / lightgray / maroon), <strong>media</strong> (none / angled-slab image / quick-fact card), and <strong>CTA</strong> (none / single / dual). The landing header is the loudest; this one is the workhorse.
      </div>

      {/* Three style variants — classic white, single CTA, no media */}
      <SectionLabel>Three styles · white bg · single CTA · no media</SectionLabel>
      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 16, marginBottom: 36 }}>
        {styles.map(s => (
          <VariantFrame key={s} label={`style = ${s}`} dark={false} height={240}>
            <StandardHeaderMock style={s} dark={false} bg="white" media="none" cta="single" />
          </VariantFrame>
        ))}
      </div>

      {/* Background variants */}
      <SectionLabel>Background variants · bold style · dual CTA</SectionLabel>
      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 16, marginBottom: 36 }}>
        <VariantFrame label="background = white" dark={false} height={240}>
          <StandardHeaderMock style="bold" bg="white" media="none" cta="dual" />
        </VariantFrame>
        <VariantFrame label="background = lightgray" dark={false} height={240}>
          <StandardHeaderMock style="bold" bg="gray" media="none" cta="dual" />
        </VariantFrame>
        <VariantFrame label="background = maroon" dark={true} height={240}>
          <StandardHeaderMock style="bold" bg="maroon" media="none" cta="dual" />
        </VariantFrame>
      </div>

      {/* Media variants */}
      <SectionLabel>Media variants · default style · white bg</SectionLabel>
      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 16, marginBottom: 36 }}>
        <VariantFrame label="media = image (angled slab, right)" dark={false} height={240}>
          <StandardHeaderMock style="default" bg="white" media="image" cta="none" />
        </VariantFrame>
        <VariantFrame label="media = quick fact card" dark={false} height={240}>
          <StandardHeaderMock style="default" bg="white" media="quickfact" cta="single" />
        </VariantFrame>
      </div>

      <SpecRow>
        <Spec label="Header height" value="200–240px" note="grows with lede length + media height" />
        <Spec label="Background × Media" value="3 × 3 = 9" note="not every combo ships — see Figma for the canonical set" />
        <Spec label="CTA count" value="0 / 1 / 2" note="dual = filled primary + italic ghost w/ arrow" />
        <Spec label="Quick fact card" value="220×auto" note="always upright bold face, regardless of page style" />
      </SpecRow>
    </PageShell>
  );
}

// ────────────────────────────────────────────────────────────────────────
// Small helpers — section label + spec row
// ────────────────────────────────────────────────────────────────────────

function SectionLabel({ children }) {
  return (
    <div style={{
      fontSize: "0.62rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em",
      color: "var(--text-muted)", fontFamily: "var(--font-body-bold)", marginBottom: 12,
    }}>{children}</div>
  );
}

function SpecRow({ children }) {
  return (
    <div style={{
      marginTop: 30, padding: "14px 18px", border: "1px solid var(--surface-border)",
      borderRadius: "var(--radius-md)", background: "var(--surface-raised)",
      display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16,
    }}>{children}</div>
  );
}

function Spec({ label, value, note }) {
  return (
    <div>
      <div style={{ fontSize: "0.6rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-muted)", fontFamily: "var(--font-body-bold)" }}>{label}</div>
      <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem", color: "var(--brand-primary)", marginTop: 3, fontWeight: 500 }}>{value}</div>
      {note && <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: 2, lineHeight: 1.4 }}>{note}</div>}
    </div>
  );
}

Object.assign(window, { PageHeadersPage, StandardPageHeaderPage });
