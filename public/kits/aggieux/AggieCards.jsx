/* global React, PageShell, LucideIcon, AGGIE_CATALOG */
/*
 * AggieCards.jsx — Card family (4 pages).
 *
 *   Card groups            — N cards in a grid, all equal size.
 *   Card groups w/ featured — One oversized hero card + N standard cards.
 *   Standard card + featured — One card visually flagged "FEATURED" but
 *                              same dimensions as siblings.
 *   Card slab              — Edge-to-edge media-forward card band.
 *
 * Shared anatomy across all four:
 *   - Image area (3:2 by default; 16:9 on hero variants)
 *   - Eyebrow (Work Sans 700 uppercase, tone color)
 *   - Title (style-aware: Oswald default, Work Sans bold-italic, Georgia elegant)
 *   - Lede (Open Sans, ~3 lines)
 *   - "Read more →" ghost link
 *
 * Style signature appears as a hairline / stacked-bar / hashed rule
 * under the title — same vocabulary as section headers.
 *
 * Lineage (INF-2):
 *   • Card groups — anatomy informed by SharePoint Highlighted-Content
 *     Grid (11 frames). Same 3:2 image-on-top + content-below rhythm,
 *     1px border, no radius. SharePoint's bordered card is the structural
 *     baseline; we drop the corner-radius (2px in SharePoint) for our
 *     flatter editorial feel.
 *   • Card groups w/ featured — informed by SharePoint Highlighted-Content
 *     Filmstrip and News-Top-story (the hero-plus-supporting pattern).
 *     Hero gets the 16:9 ratio + larger title; siblings stay at 3:2.
 *   • Card slab — informed by SharePoint Hero Tiles (full-bleed media
 *     band), pared down to a 50/50 split.
 *
 * Identity stays TUX: maroon/teal/gold gradient placeholders, Work Sans
 * eyebrow, signature rule under title. Never lift Segoe UI or SharePoint blue.
 */

// ════════════════════════════════════════════════════════════════════════
// Shared Card primitive
// ════════════════════════════════════════════════════════════════════════

// Tone palette for image placeholders — uses brand colors
function ImgPlaceholder({ tone = 0, size = "standard" }) {
  const palettes = [
    "linear-gradient(135deg, #5C0025 0%, #3A0014 100%)",                 // maroon
    "linear-gradient(135deg, #006483 0%, #003A4A 100%)",                  // teal deep
    "linear-gradient(135deg, #DDAC37 0%, #A87B1F 100%)",                  // gold
    "linear-gradient(135deg, #6B4226 0%, #3F2614 100%)",                  // umber
    "linear-gradient(135deg, #2D6B2F 0%, #1B4220 100%)",                  // green
    "linear-gradient(135deg, #8E5572 0%, #4F2A40 100%)",                  // dusty rose
  ];
  const gradient = palettes[tone % palettes.length];
  return (
    <div style={{
      width: "100%",
      aspectRatio: size === "wide" ? "16/9" : (size === "tall" ? "3/4" : "3/2"),
      background: gradient,
      position: "relative",
      overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.15) 0%, transparent 50%), radial-gradient(circle at 80% 60%, rgba(0,0,0,0.18) 0%, transparent 60%)",
      }} />
    </div>
  );
}

function StyleSig({ style, dark, width = 56 }) {
  const c = dark ? "rgba(255,255,255,0.85)" : "var(--brand-primary)";
  if (style === "bold") {
    return (
      <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 4 }}>
        <span style={{ display: "block", width: width * 0.55, height: 4, borderRadius: 2, background: c }} />
        <span style={{ display: "block", width: width * 0.18, height: 4, borderRadius: 2, background: c, opacity: 0.5 }} />
        <span style={{ display: "block", width: width * 0.08, height: 4, borderRadius: 2, background: c, opacity: 0.25 }} />
      </div>
    );
  }
  if (style === "elegant") {
    const accent = dark ? "rgba(255,255,255,0.85)" : "var(--brand-accent)";
    return (
      <div style={{
        marginTop: 10, width, height: 6,
        backgroundImage: `repeating-linear-gradient(135deg, ${accent} 0 1.2px, transparent 1.2px 6px)`,
        WebkitMaskImage: "linear-gradient(90deg, transparent 0%, black 15%, black 85%, transparent 100%)",
        maskImage: "linear-gradient(90deg, transparent 0%, black 15%, black 85%, transparent 100%)",
        opacity: 0.85,
      }} />
    );
  }
  // default — hairline fade
  return (
    <div style={{
      marginTop: 10, width, height: 1.5,
      background: `linear-gradient(90deg, transparent 0%, ${c} 15%, ${c} 85%, transparent 100%)`,
      opacity: 0.85,
    }} />
  );
}

// Heading font face per style
function StyleHeading({ style, children, size = 22, dark = false }) {
  const color = dark ? "#fff" : "var(--brand-primary)";
  if (style === "bold") {
    return (
      <h3 style={{
        margin: 0, fontFamily: "var(--font-bold)", fontWeight: 800, fontStyle: "italic",
        textTransform: "uppercase", fontSize: size, lineHeight: 1.05, color,
        letterSpacing: 0,
      }}>{children}</h3>
    );
  }
  if (style === "elegant") {
    return (
      <h3 style={{
        margin: 0, fontFamily: "var(--font-elegant)", fontWeight: 400, fontStyle: "italic",
        textTransform: "uppercase", fontSize: size * 0.95, lineHeight: 1.1, color,
        letterSpacing: "-0.005em",
      }}>{children}</h3>
    );
  }
  return (
    <h3 style={{
      margin: 0, fontFamily: "var(--font-display)", fontWeight: 500,
      textTransform: "uppercase", fontSize: size, lineHeight: 1.1, color,
      letterSpacing: "0.01em",
    }}>{children}</h3>
  );
}

// The card itself
function AggieCard({
  style = "default",
  dark = false,
  size = "standard",   // standard | hero | wide
  imgTone = 0,
  eyebrow = "Research",
  title = "Connected vehicle pilot expands to 14 corridors",
  lede = "Field deployment of roadside units along Texas freight corridors will extend instrumented coverage through 2026, with a focus on rural intersections.",
  flagFeatured = false,
  cta = "Read more",
  ctaShown = true,
}) {
  const headingSize = size === "hero" ? 30 : (size === "wide" ? 26 : 20);
  const sigWidth = size === "hero" ? 80 : (size === "wide" ? 64 : 48);
  const ledeLines = size === "hero" ? 4 : 3;

  return (
    <div style={{
      background: dark ? "rgba(255,255,255,0.04)" : "#fff",
      border: dark ? "1px solid rgba(255,255,255,0.12)" : "1px solid var(--surface-border)",
      display: "flex", flexDirection: "column",
      position: "relative",
      height: "100%",
    }}>
      {/* Image */}
      <ImgPlaceholder tone={imgTone} size={size === "hero" ? "wide" : "standard"} />

      {/* Featured flag */}
      {flagFeatured && (
        <div style={{
          position: "absolute", top: 0, left: 0,
          padding: "5px 12px",
          background: dark ? "#DDAC37" : "#5C0025",
          color: dark ? "#2A0E15" : "#fff",
          fontFamily: "var(--font-bold)", fontWeight: 700,
          fontSize: 10, textTransform: "uppercase", letterSpacing: "0.14em",
        }}>Featured</div>
      )}

      {/* Body */}
      <div style={{ padding: size === "hero" ? "26px 28px 26px" : "22px 24px 22px", flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{
          fontFamily: "var(--font-bold)", fontWeight: 700,
          fontSize: 10, textTransform: "uppercase", letterSpacing: "0.14em",
          color: dark ? "rgba(255,255,255,0.7)" : "var(--text-muted)",
          marginBottom: 10,
        }}>{eyebrow}</div>

        <StyleHeading style={style} size={headingSize} dark={dark}>{title}</StyleHeading>

        <StyleSig style={style} dark={dark} width={sigWidth} />

        <p style={{
          margin: "14px 0 0",
          fontFamily: "var(--font-body)", fontSize: 13.5, lineHeight: 1.55,
          color: dark ? "rgba(255,255,255,0.78)" : "var(--text-secondary)",
          display: "-webkit-box", WebkitBoxOrient: "vertical",
          WebkitLineClamp: ledeLines, overflow: "hidden",
        }}>{lede}</p>

        {ctaShown && (
          <div style={{ marginTop: "auto", paddingTop: 18 }}>
            <span style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              fontFamily: "var(--font-bold)", fontWeight: 700, fontStyle: "italic",
              textTransform: "uppercase", fontSize: 12, letterSpacing: "0.08em",
              color: dark ? "#8BCAD8" : "#006483",
            }}>
              {cta}
              <LucideIcon name="arrow-right" size={13} color={dark ? "#8BCAD8" : "#006483"} />
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════
// Sample card data
// ════════════════════════════════════════════════════════════════════════

const SAMPLE_CARDS = [
  { eyebrow: "Research",      title: "Connected vehicle pilot expands to 14 corridors",     lede: "Field deployment of roadside units along Texas freight corridors will extend instrumented coverage through 2026.", tone: 0 },
  { eyebrow: "Workforce",     title: "Building the next generation of safety analysts",      lede: "A new dual-credit program with three regional community colleges places students in lab rotations starting in spring.", tone: 1 },
  { eyebrow: "Policy",        title: "Statewide vulnerable-road-user assessment is now live", lede: "All 254 counties have access to the open dataset, including a granular map view and per-corridor case studies.", tone: 2 },
  { eyebrow: "Field study",   title: "Rural intersection reconstruction improves stops by 37%", lede: "A four-year before/after study at twelve county-road intersections shows compliance improvements that hold past the 36-month mark.", tone: 3 },
  { eyebrow: "Initiative",    title: "Freight corridor instrumentation reaches 412 miles",   lede: "I-35 and US-59 sensor coverage will be the country's longest continuously-instrumented freight network when the second phase wraps.", tone: 4 },
  { eyebrow: "Partnership",   title: "Joint training with eight TxDOT districts launches",   lede: "Curriculum spans crash reconstruction, work-zone safety, and the new VRU assessment toolkit, delivered hybrid through 2026.", tone: 5 },
];

// ════════════════════════════════════════════════════════════════════════
// SHARED — Box + Section + Spec helpers (CD prefix to avoid clashes)
// ════════════════════════════════════════════════════════════════════════

function CDBox({ dark = false, label, children }) {
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
      <div style={{ padding: 24, background: dark ? "var(--brand-primary)" : "var(--surface-page)" }}>
        {children}
      </div>
    </div>
  );
}

function CDSectionLabel({ children }) {
  return (
    <div style={{
      fontSize: "0.62rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em",
      color: "var(--text-muted)", fontFamily: "var(--font-body-bold)", marginBottom: 12, marginTop: 16,
    }}>{children}</div>
  );
}

function CDSpecRow({ children }) {
  return (
    <div style={{
      marginTop: 28, padding: "14px 18px", border: "1px solid var(--surface-border)",
      borderRadius: "var(--radius-md)", background: "var(--surface-raised)",
      display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16,
    }}>{children}</div>
  );
}

function CDSpec({ label, value, note }) {
  return (
    <div>
      <div style={{ fontSize: "0.6rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-muted)", fontFamily: "var(--font-body-bold)" }}>{label}</div>
      <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem", color: "var(--brand-primary)", marginTop: 3, fontWeight: 500 }}>{value}</div>
      {note && <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: 2, lineHeight: 1.4 }}>{note}</div>}
    </div>
  );
}

function CDIntro({ children }) {
  return (
    <div style={{ padding: "16px 20px", marginBottom: 28, background: "color-mix(in srgb, var(--brand-primary) 5%, transparent)", borderLeft: "3px solid var(--brand-primary)", borderRadius: "0 var(--radius-sm) var(--radius-sm) 0", fontSize: "0.92rem", lineHeight: 1.65, color: "var(--text-secondary)" }}>
      {children}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════
// PAGE 1 — Card groups
// ════════════════════════════════════════════════════════════════════════

function CardGroupsPage() {
  const item = (window.AGGIE_CATALOG || []).find(c => c.id === "card-groups");
  const styles = ["default", "bold", "elegant"];
  const cards3 = SAMPLE_CARDS.slice(0, 3);
  const cards4 = SAMPLE_CARDS.slice(0, 4);
  const cards2 = SAMPLE_CARDS.slice(0, 2);

  return (
    <PageShell item={item}>
      <CDIntro>
        Equal-weight card grids — the workhorse pattern. <strong>2-up / 3-up / 4-up</strong> across breakpoints, with the title face and signature swapping per style. Use to surface peer content (sibling research areas, sibling articles, sibling people).
      </CDIntro>

      <CDSectionLabel>Three styles · 3-up · light</CDSectionLabel>
      {styles.map(s => (
        <CDBox key={s} dark={false} label={`style = ${s}`}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
            {cards3.map((c, i) => <AggieCard key={i} style={s} {...c} imgTone={c.tone} />)}
          </div>
        </CDBox>
      ))}

      <CDSectionLabel>3-up · on dark</CDSectionLabel>
      <CDBox dark={true} label="style = bold · the loudest combination">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
          {cards3.map((c, i) => <AggieCard key={i} style="bold" dark {...c} imgTone={c.tone} />)}
        </div>
      </CDBox>

      <CDSectionLabel>2-up · longer-form previews</CDSectionLabel>
      <CDBox dark={false} label="style = default">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 18 }}>
          {cards2.map((c, i) => <AggieCard key={i} style="default" size="wide" {...c} imgTone={c.tone} />)}
        </div>
      </CDBox>

      <CDSectionLabel>4-up · dense index</CDSectionLabel>
      <CDBox dark={false} label="style = default">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
          {cards4.map((c, i) => <AggieCard key={i} style="default" {...c} imgTone={c.tone} />)}
        </div>
      </CDBox>

      <CDSpecRow>
        <CDSpec label="Grid" value="2 / 3 / 4 columns" note="responsive collapse stacks to 1 below 720px" />
        <CDSpec label="Image ratio" value="3:2 default" note="16:9 when size=wide; 3:4 when size=tall" />
        <CDSpec label="Lede clamp" value="3 lines" note="prevents ragged column heights" />
        <CDSpec label="Card chrome" value="1px border, no radius" note="kept flat to preserve editorial rhythm" />
        <CDSpec label="Lineage" value="SharePoint Highlighted-Content Grid" note="Anatomy only · TUX type and color" />
      </CDSpecRow>
    </PageShell>
  );
}

// ════════════════════════════════════════════════════════════════════════
// PAGE 2 — Card groups w/ featured (oversized hero)
// ════════════════════════════════════════════════════════════════════════

function CardGroupsFeaturedPage() {
  const item = (window.AGGIE_CATALOG || []).find(c => c.id === "card-groups-featured");
  const [featured, ...rest] = SAMPLE_CARDS;
  const supporting = rest.slice(0, 3);

  return (
    <PageShell item={item}>
      <CDIntro>
        One <strong>oversized hero card</strong> takes the full-width slot, with three supporting cards arranged below or beside it. Use when one item meaningfully outweighs its siblings — a flagship project, a featured publication, the headline news item.
      </CDIntro>

      <CDSectionLabel>Hero on top · supporting 3-up below · default style</CDSectionLabel>
      <CDBox dark={false} label="style = default">
        <div style={{ display: "grid", gap: 18 }}>
          <AggieCard style="default" size="hero" {...featured} imgTone={featured.tone} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
            {supporting.map((c, i) => <AggieCard key={i} style="default" {...c} imgTone={c.tone} />)}
          </div>
        </div>
      </CDBox>

      <CDSectionLabel>Hero left · supporting stacked right · bold style</CDSectionLabel>
      <CDBox dark={false} label="style = bold">
        <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 18 }}>
          <AggieCard style="bold" size="hero" {...featured} imgTone={featured.tone} />
          <div style={{ display: "grid", gridTemplateRows: "repeat(3, 1fr)", gap: 12 }}>
            {supporting.map((c, i) => <AggieCard key={i} style="bold" size="standard" ctaShown={false} {...c} imgTone={c.tone} />)}
          </div>
        </div>
      </CDBox>

      <CDSectionLabel>Hero on top · on dark · elegant style</CDSectionLabel>
      <CDBox dark={true} label="style = elegant">
        <div style={{ display: "grid", gap: 18 }}>
          <AggieCard style="elegant" dark size="hero" {...featured} imgTone={featured.tone} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
            {supporting.map((c, i) => <AggieCard key={i} style="elegant" dark {...c} imgTone={c.tone} />)}
          </div>
        </div>
      </CDBox>

      <CDSpecRow>
        <CDSpec label="Hero ratio" value="16:9 image" note="versus 3:2 on standards" />
        <CDSpec label="Hero title" value="30px / 30px" note="vs 20px on standards" />
        <CDSpec label="Layouts" value="top-stacked · left-anchored" note="left-anchored fits hero alongside 3 stacked siblings" />
        <CDSpec label="Lede clamp" value="hero=4 · standards=3" note="hero gets the breathing room" />
        <CDSpec label="Lineage" value="SharePoint Highlighted-Content Filmstrip + News-Top-story" note="Anatomy only · TUX type and color" />
      </CDSpecRow>
    </PageShell>
  );
}

// ════════════════════════════════════════════════════════════════════════
// PAGE 3 — Standard card + featured (same dimensions, just flagged)
// ════════════════════════════════════════════════════════════════════════

function StandardCardFeaturedPage() {
  const item = (window.AGGIE_CATALOG || []).find(c => c.id === "standard-card-featured");
  const [featured, ...rest] = SAMPLE_CARDS;
  const all = [{ ...featured, flagFeatured: true }, ...rest.slice(0, 2)];

  return (
    <PageShell item={item}>
      <CDIntro>
        Same <strong>uniform grid</strong> as Card groups, but one card carries a <strong>FEATURED flag</strong> in the corner. The dimensions are unchanged — useful when you want hierarchy without breaking the rhythm of an even row.
      </CDIntro>

      <CDSectionLabel>3-up · first card flagged · all three styles</CDSectionLabel>
      {["default", "bold", "elegant"].map(s => (
        <CDBox key={s} dark={false} label={`style = ${s}`}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
            {all.map((c, i) => <AggieCard key={i} style={s} {...c} imgTone={c.tone} />)}
          </div>
        </CDBox>
      ))}

      <CDSectionLabel>4-up on dark · second card flagged</CDSectionLabel>
      <CDBox dark={true} label="style = bold">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
          {SAMPLE_CARDS.slice(0, 4).map((c, i) => (
            <AggieCard key={i} style="bold" dark {...c} imgTone={c.tone} flagFeatured={i === 1} />
          ))}
        </div>
      </CDBox>

      <CDSpecRow>
        <CDSpec label="Flag" value='Top-left corner' note="Maroon on light, Gold on dark; Work Sans 700, 14% letterspacing" />
        <CDSpec label="Dimensions" value="UNCHANGED" note="that's the whole point — keeps grid rhythm" />
        <CDSpec label="When to use" value="Even row + one priority" note="if one card needs to dominate, use Card groups w/ featured instead" />
        <CDSpec label="Limit" value="One flag per group" note="more than one defeats the purpose" />
      </CDSpecRow>
    </PageShell>
  );
}

// ════════════════════════════════════════════════════════════════════════
// PAGE 4 — Card slab (full-bleed media-forward band)
// ════════════════════════════════════════════════════════════════════════

function CardSlabMock({ style, dark, layout = "image-left" }) {
  const onDark = dark;
  const c = SAMPLE_CARDS[0];
  const titleSize = 38;
  const sigWidth = 100;

  const imageEl = (
    <div style={{ flex: 1, minHeight: 360, position: "relative", overflow: "hidden" }}>
      <ImgPlaceholder tone={c.tone} size="wide" />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, transparent 60%, rgba(0,0,0,0.25))" }} />
    </div>
  );

  const copyEl = (
    <div style={{
      flex: 1, padding: "44px 52px",
      background: onDark ? "var(--brand-primary)" : (style === "bold" ? "#fff" : "var(--surface-sunken)"),
      display: "flex", flexDirection: "column", justifyContent: "center",
    }}>
      <div style={{
        fontFamily: "var(--font-bold)", fontWeight: 700,
        fontSize: 11, textTransform: "uppercase", letterSpacing: "0.14em",
        color: onDark ? "rgba(255,255,255,0.72)" : "var(--text-muted)",
        marginBottom: 14,
      }}>{c.eyebrow}</div>

      <StyleHeading style={style} size={titleSize} dark={onDark}>{c.title}</StyleHeading>
      <StyleSig style={style} dark={onDark} width={sigWidth} />

      <p style={{
        margin: "20px 0 26px", maxWidth: 480,
        fontFamily: "var(--font-body)", fontSize: 15, lineHeight: 1.6,
        color: onDark ? "rgba(255,255,255,0.85)" : "var(--text-primary)",
      }}>{c.lede} {c.lede}</p>

      <div>
        <span style={{
          display: "inline-flex", alignItems: "center", padding: "13px 22px",
          background: onDark ? "#DDAC37" : "#5C0025",
          color: onDark ? "#2A0E15" : "#fff",
          fontFamily: "var(--font-bold)", fontWeight: 700, fontSize: 13,
          textTransform: "uppercase", letterSpacing: "0.1em",
        }}>Read the report</span>
      </div>
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: layout === "image-right" ? "row-reverse" : "row" }}>
      {imageEl}
      {copyEl}
    </div>
  );
}

function CardSlabPage() {
  const item = (window.AGGIE_CATALOG || []).find(c => c.id === "card-slab");
  return (
    <PageShell item={item}>
      <CDIntro>
        <strong>Full-bleed editorial slab.</strong> Half image, half copy — fills the page width edge-to-edge. The loudest card pattern; reserve for a single hero per page (a featured initiative, an annual report cover). Image-left and image-right layouts alternate cleanly when stacking multiple slabs.
      </CDIntro>

      <CDSectionLabel>Three styles · image-left · light</CDSectionLabel>
      {["default", "bold", "elegant"].map(s => (
        <CDBox key={s} dark={false} label={`style = ${s} · image-left`}>
          <CardSlabMock style={s} dark={false} layout="image-left" />
        </CDBox>
      ))}

      <CDSectionLabel>Image-right alternation · bold style</CDSectionLabel>
      <CDBox dark={false} label="style = bold · image-right">
        <CardSlabMock style="bold" dark={false} layout="image-right" />
      </CDBox>

      <CDSectionLabel>On dark · elegant style</CDSectionLabel>
      <CDBox dark={true} label="style = elegant · on brand maroon">
        <CardSlabMock style="elegant" dark={true} layout="image-left" />
      </CDBox>

      <CDSpecRow>
        <CDSpec label="Layout" value="50 / 50 split" note="both halves min 360px tall" />
        <CDSpec label="Title size" value="38px" note="largest in-body title — only page-headers are louder" />
        <CDSpec label="Edge" value="Full-bleed" note="extends to viewport edges; ignores body gutters" />
        <CDSpec label="Limit" value="≤2 per page" note="more than two and the page reads as a slideshow" />
        <CDSpec label="Lineage" value="SharePoint Hero Tiles" note="Full-bleed media band — anatomy only" />
      </CDSpecRow>
    </PageShell>
  );
}

Object.assign(window, {
  CardGroupsPage, CardGroupsFeaturedPage, StandardCardFeaturedPage, CardSlabPage,
  AggieCard,
});
