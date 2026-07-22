/* global React, PageShell, AGGIE_CATALOG, MediaBox */
/*
 * AggieMedia1.jsx — Batch 7a: Split feature + Media features + Media slab + Captioned media.
 *
 *   Split feature   — 50/50 split: image on one side, narrative + CTA on the other.
 *                     Image-Left and Image-Right variants.
 *   Media features  — Centered editorial figure: title + lede + media + caption,
 *                     stacked. The simplest "image goes here" feature.
 *   Media slab      — Full-bleed dark band with media + headline overlay or
 *                     adjacent. Heavy, anchored, used for chapter breaks.
 *   Captioned media — Just media + caption. The atomic unit re-used inside
 *                     features and articles.
 *
 * Helper prefix: MF (Media Family).
 */

// ════════════════════════════════════════════════════════════════════════
// Shared helpers
// ════════════════════════════════════════════════════════════════════════

function MFBox({ dark = false, label, padded = true, children }) {
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

function MFSectionLabel({ children }) {
  return (
    <div style={{
      fontSize: "0.62rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em",
      color: "var(--text-muted)", fontFamily: "var(--font-body-bold)", marginBottom: 12, marginTop: 16,
    }}>{children}</div>
  );
}

function MFSpecRow({ children }) {
  return (
    <div style={{
      marginTop: 28, padding: "14px 18px", border: "1px solid var(--surface-border)",
      borderRadius: "var(--radius-md)", background: "var(--surface-raised)",
      display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16,
    }}>{children}</div>
  );
}

function MFSpec({ label, value, note }) {
  return (
    <div>
      <div style={{ fontSize: "0.6rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-muted)", fontFamily: "var(--font-body-bold)" }}>{label}</div>
      <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem", color: "var(--brand-primary)", marginTop: 3, fontWeight: 500 }}>{value}</div>
      {note && <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: 2, lineHeight: 1.4 }}>{note}</div>}
    </div>
  );
}

function MFIntro({ children }) {
  return (
    <div style={{ padding: "16px 20px", marginBottom: 28, background: "color-mix(in srgb, var(--brand-primary) 5%, transparent)", borderLeft: "3px solid var(--brand-primary)", borderRadius: "0 var(--radius-sm) var(--radius-sm) 0", fontSize: "0.92rem", lineHeight: 1.65, color: "var(--text-secondary)" }}>
      {children}
    </div>
  );
}

// Style signature — used directly above a section header
function MFSig({ style, dark, width = 80 }) {
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

// Per-style headline typography
function getHeadlineProps(style) {
  if (style === "bold") {
    return { fontFamily: "var(--font-bold)", fontWeight: 800, fontStyle: "italic", textTransform: "uppercase", letterSpacing: "-0.005em", lineHeight: 1.05 };
  }
  if (style === "elegant") {
    return { fontFamily: "var(--font-elegant, Georgia, serif)", fontWeight: 400, fontStyle: "italic", textTransform: "none", letterSpacing: "-0.01em", lineHeight: 1.1 };
  }
  return { fontFamily: "var(--font-display)", fontWeight: 500, fontStyle: "normal", textTransform: "uppercase", letterSpacing: "0.005em", lineHeight: 1.08 };
}

function MFEyebrow({ children, dark }) {
  return (
    <div style={{
      fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.16em",
      color: dark ? "var(--brand-accent)" : "var(--brand-primary)",
      fontFamily: "var(--font-body-bold)", marginBottom: 14,
    }}>{children}</div>
  );
}

function MFBody({ children, dark, max = 480 }) {
  return (
    <p style={{
      fontFamily: "var(--font-body)", fontSize: "0.98rem", lineHeight: 1.65,
      color: dark ? "rgba(255,255,255,0.82)" : "var(--text-secondary)",
      margin: "0 0 22px", maxWidth: max,
    }}>{children}</p>
  );
}

function MFButton({ children, dark, variant = "primary" }) {
  const isOutline = variant === "outline";
  const bg = dark
    ? (isOutline ? "transparent" : "var(--brand-accent)")
    : (isOutline ? "transparent" : "var(--brand-primary)");
  const fg = dark
    ? (isOutline ? "#fff" : "var(--text-on-accent, #2A0E15)")
    : (isOutline ? "var(--brand-primary)" : "#fff");
  const border = dark
    ? (isOutline ? "rgba(255,255,255,0.6)" : "transparent")
    : (isOutline ? "var(--brand-primary)" : "transparent");
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 8,
      padding: "12px 22px", background: bg, color: fg,
      border: `2px solid ${border === "transparent" ? bg : border}`,
      fontFamily: "var(--font-body-bold)", fontWeight: 700, fontSize: "0.84rem",
      textTransform: "uppercase", letterSpacing: "0.05em", cursor: "default",
    }}>{children}</span>
  );
}

// ════════════════════════════════════════════════════════════════════════
// SPLIT FEATURE
// ════════════════════════════════════════════════════════════════════════
//
// 50/50 row: media on one side, narrative on the other. Reverses on mobile.
// Two layout variants per style:
//   - Image-Left  (default)
//   - Image-Right
//
// On dark, the entire band goes maroon and the media keeps its full saturation.

function SplitFeature({ style = "default", dark = false, side = "left" }) {
  const headline = getHeadlineProps(style);
  const headlineSize = style === "elegant" ? "2.3rem" : "2.05rem";
  const titles = {
    default: "Studying mobility for safer Texas roadways.",
    bold: "Cutting crash risk on rural corridors.",
    elegant: "An institute, in service of a state, for a century.",
  };

  const media = (
    <div style={{ flex: 1, minWidth: 0, position: "relative" }}>
      <MediaBox style={style} ratio="4/3" w={640} h={480} label={`${style} · 4:3`} onDark={dark} />
    </div>
  );

  const narrative = (
    <div style={{ flex: 1, minWidth: 0, padding: "12px 4px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
      <MFEyebrow dark={dark}>research feature</MFEyebrow>
      <div style={{ marginBottom: 18 }}><MFSig style={style} dark={dark} width={70} /></div>
      <h3 style={{
        ...headline, fontSize: headlineSize, margin: "0 0 18px",
        color: dark ? "#fff" : "var(--text-primary)",
      }}>{titles[style]}</h3>
      <MFBody dark={dark}>
        TTI's transportation safety research draws on five decades of crash and roadway data to find which interventions actually move the needle on rural fatalities — and which ones merely look good in a brochure.
      </MFBody>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <MFButton dark={dark}>Read the report</MFButton>
        <MFButton dark={dark} variant="outline">All studies</MFButton>
      </div>
    </div>
  );

  return (
    <div style={{ display: "flex", gap: 48, alignItems: "stretch" }}>
      {side === "left" ? <>{media}{narrative}</> : <>{narrative}{media}</>}
    </div>
  );
}

function SplitFeaturePage() {
  const item = (window.AGGIE_CATALOG || []).find(c => c.id === "split-feature");
  return (
    <PageShell item={item}>
      <MFIntro>
        50/50 narrative band: media on one side, eyebrow + signature + headline + lede + CTA stack on the other. The most-used "feature this thing" pattern outside of card grids — works as a chapter break in long pages and as a homepage marquee. Two layout variants per style: <strong>image-left</strong> (default) and <strong>image-right</strong>. Stacks vertically below 720px.
      </MFIntro>

      <MFSectionLabel>Default · image-left</MFSectionLabel>
      <MFBox label="default · image-left">
        <SplitFeature style="default" side="left" />
      </MFBox>

      <MFSectionLabel>Default · image-right</MFSectionLabel>
      <MFBox label="default · image-right">
        <SplitFeature style="default" side="right" />
      </MFBox>

      <MFSectionLabel>Bold</MFSectionLabel>
      <MFBox label="bold · image-left">
        <SplitFeature style="bold" side="left" />
      </MFBox>

      <MFSectionLabel>Elegant</MFSectionLabel>
      <MFBox label="elegant · image-right">
        <SplitFeature style="elegant" side="right" />
      </MFBox>

      <MFSectionLabel>On dark</MFSectionLabel>
      <MFBox dark label="default · image-left · on dark">
        <SplitFeature style="default" side="left" dark />
      </MFBox>
      <MFBox dark label="bold · image-right · on dark">
        <SplitFeature style="bold" side="right" dark />
      </MFBox>

      <MFSpecRow>
        <MFSpec label="Layout" value="50 / 50" note="Stacks ≤720px (media first)" />
        <MFSpec label="Gap" value="48px" note="Between media and narrative column" />
        <MFSpec label="Media ratio" value="4 / 3" note="Editorial; news-tilt favors 3:2" />
        <MFSpec label="Headline" value="32 / 36px" note="Per-style face; 5–8 words ideal" />
      </MFSpecRow>
    </PageShell>
  );
}

// ════════════════════════════════════════════════════════════════════════
// MEDIA FEATURES — centered title + lede + media + caption stack
// ════════════════════════════════════════════════════════════════════════

function MediaFeature({ style = "default", dark = false, alignment = "center" }) {
  const headline = getHeadlineProps(style);
  const align = alignment === "left" ? "flex-start" : "center";
  const textAlign = alignment === "left" ? "left" : "center";

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: align, gap: 0 }}>
      <div style={{ textAlign, maxWidth: 720, marginBottom: 28 }}>
        <MFEyebrow dark={dark}>field report · Q3</MFEyebrow>
        <div style={{ display: "flex", justifyContent: alignment === "left" ? "flex-start" : "center", marginBottom: 16 }}>
          <MFSig style={style} dark={dark} width={90} />
        </div>
        <h3 style={{
          ...headline, fontSize: style === "elegant" ? "2.5rem" : "2.2rem",
          margin: "0 0 14px", color: dark ? "#fff" : "var(--text-primary)",
        }}>
          What our roadside-sensor pilots taught us about winter conditions.
        </h3>
        <p style={{
          fontFamily: "var(--font-body)", fontSize: "1.02rem", lineHeight: 1.6, fontStyle: "italic",
          color: dark ? "rgba(255,255,255,0.78)" : "var(--text-secondary)",
          margin: 0, maxWidth: 580, marginLeft: alignment === "center" ? "auto" : 0, marginRight: alignment === "center" ? "auto" : 0,
        }}>
          Five months of telemetry, 22 sensor sites along I-40, and a few surprises about how black ice actually forms.
        </p>
      </div>

      <div style={{ width: "100%", maxWidth: 880 }}>
        <MediaBox style={style} ratio="16/9" w={1280} h={720} label={`${style} · 16:9 hero`} onDark={dark} />
      </div>

      <div style={{
        marginTop: 14, fontFamily: "var(--font-body)", fontSize: "0.82rem", lineHeight: 1.55,
        color: dark ? "rgba(255,255,255,0.72)" : "var(--text-muted)",
        textAlign, maxWidth: 700,
        fontStyle: style === "elegant" ? "italic" : "normal",
        borderLeft: alignment === "left" ? `2px solid ${dark ? "var(--brand-accent)" : "var(--brand-primary)"}` : "none",
        paddingLeft: alignment === "left" ? 12 : 0,
      }}>
        <strong style={{ fontFamily: "var(--font-body-bold)", color: dark ? "#fff" : "var(--text-primary)" }}>FIG. 04 · </strong>
        Winter telemetry station, US-87 between Dumas and Stratford. Photo by Marcus Reyes / TTI Communications.
      </div>
    </div>
  );
}

function MediaFeaturesPage() {
  const item = (window.AGGIE_CATALOG || []).find(c => c.id === "media-features");
  return (
    <PageShell item={item}>
      <MFIntro>
        Editorial figure: title + lede sit above the media, caption sits below. The full attention-pull treatment for one image (or one short video). Two alignment variants per style: <strong>centered</strong> (default — feels like a magazine pull) and <strong>left-aligned</strong> (better in a long-form column). Caption uses figure-numbering convention (FIG. 04 · …).
      </MFIntro>

      <MFSectionLabel>Default · centered</MFSectionLabel>
      <MFBox label="default · centered">
        <MediaFeature style="default" alignment="center" />
      </MFBox>

      <MFSectionLabel>Default · left-aligned</MFSectionLabel>
      <MFBox label="default · left">
        <MediaFeature style="default" alignment="left" />
      </MFBox>

      <MFSectionLabel>Bold</MFSectionLabel>
      <MFBox label="bold · centered">
        <MediaFeature style="bold" alignment="center" />
      </MFBox>

      <MFSectionLabel>Elegant</MFSectionLabel>
      <MFBox label="elegant · centered">
        <MediaFeature style="elegant" alignment="center" />
      </MFBox>

      <MFSectionLabel>On dark</MFSectionLabel>
      <MFBox dark label="elegant · centered · on dark">
        <MediaFeature style="elegant" alignment="center" dark />
      </MFBox>

      <MFSpecRow>
        <MFSpec label="Media ratio" value="16 / 9" note="Hero default; 3:2 for photo-driven" />
        <MFSpec label="Lede" value="italic 16px" note="Open Sans · max 580px" />
        <MFSpec label="Caption" value="13px / 1.55" note="FIG. NN · convention; mono-set FIG label" />
        <MFSpec label="Width cap" value="880 / 720px" note="Media / text-stack respectively" />
      </MFSpecRow>
    </PageShell>
  );
}

// ════════════════════════════════════════════════════════════════════════
// MEDIA SLAB — full-bleed dark band, oversized headline + media
// ════════════════════════════════════════════════════════════════════════
//
// Two compositions:
//   - Side-by-side  (50/50, headline left, media right, full-bleed background)
//   - Overlay       (media full-bleed, headline overlaid on dark scrim)

function MediaSlab({ style = "default", composition = "side-by-side", dark = true }) {
  const headline = getHeadlineProps(style);
  const headlineSize = "3.1rem";
  const fg = dark ? "#fff" : "var(--text-primary)";
  const titles = {
    default: "Where mobility data meets public policy.",
    bold: "Built for what a state asks of its researchers.",
    elegant: "Half a century of solving Texas-shaped problems.",
  };

  if (composition === "overlay") {
    return (
      <div style={{
        position: "relative", width: "100%", aspectRatio: "21 / 9",
        background: "linear-gradient(135deg, #5C0025 0%, #2a0c10 100%)",
        overflow: "hidden",
        borderRadius: "var(--radius-md)",
      }}>
        {/* media texture */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "radial-gradient(circle at 70% 40%, rgba(221,172,55,0.32) 0%, transparent 55%), radial-gradient(circle at 30% 80%, rgba(0,0,0,0.45) 0%, transparent 60%)",
        }} />
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "repeating-linear-gradient(135deg, rgba(255,255,255,0.04) 0 1px, transparent 1px 7px)",
          opacity: 0.6,
        }} />
        {/* dark scrim for legibility */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.15) 65%, transparent 100%)" }} />

        <div style={{
          position: "relative", height: "100%", display: "flex", alignItems: "flex-end",
          padding: "44px 56px",
        }}>
          <div style={{ maxWidth: 720 }}>
            <div style={{ marginBottom: 14 }}><MFSig style={style} dark width={90} /></div>
            <div style={{ fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.18em", color: "var(--brand-accent)", fontFamily: "var(--font-body-bold)", marginBottom: 14 }}>
              chapter 03 · the institute
            </div>
            <h3 style={{ ...headline, fontSize: headlineSize, margin: 0, color: "#fff" }}>
              {titles[style]}
            </h3>
          </div>
        </div>
      </div>
    );
  }

  // side-by-side: dark band, headline + lede left, media right
  const bg = dark ? "var(--brand-primary)" : "var(--surface-sunken)";
  return (
    <div style={{ background: bg, padding: "48px 56px", borderRadius: "var(--radius-md)", position: "relative", overflow: "hidden" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 56, alignItems: "center" }}>
        <div>
          <div style={{ marginBottom: 16 }}><MFSig style={style} dark={dark} width={80} /></div>
          <div style={{
            fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.18em",
            color: dark ? "var(--brand-accent)" : "var(--brand-primary)",
            fontFamily: "var(--font-body-bold)", marginBottom: 14,
          }}>
            from the field
          </div>
          <h3 style={{ ...headline, fontSize: headlineSize, margin: "0 0 18px", color: fg }}>
            {titles[style]}
          </h3>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "1rem", lineHeight: 1.65, color: dark ? "rgba(255,255,255,0.82)" : "var(--text-secondary)", margin: "0 0 22px", maxWidth: 460 }}>
            A long-form essay on how a research institute earns its place in a state's transportation policy — and what we owe the next fifty years.
          </p>
          <MFButton dark={dark}>Read the essay</MFButton>
        </div>
        <div>
          <MediaBox style={style} ratio="4/5" w={640} h={800} label={`${style} · portrait`} onDark={dark} />
        </div>
      </div>
    </div>
  );
}

function MediaSlabPage() {
  const item = (window.AGGIE_CATALOG || []).find(c => c.id === "media-slab");
  return (
    <PageShell item={item}>
      <MFIntro>
        Heavy, anchored band used as a chapter break or hero. Two compositions: <strong>side-by-side</strong> (dark band, headline-left + media-right, breathy) and <strong>overlay</strong> (media full-bleed, headline ladder on a scrim). The slab is always full-bleed in production — these previews are bordered for clarity.
      </MFIntro>

      <MFSectionLabel>Side-by-side · dark</MFSectionLabel>
      <MFBox label="default · side-by-side · dark band" padded={false}>
        <div style={{ padding: 24 }}><MediaSlab style="default" composition="side-by-side" dark /></div>
      </MFBox>

      <MFSectionLabel>Overlay</MFSectionLabel>
      <MFBox label="default · overlay" padded={false}>
        <div style={{ padding: 24 }}><MediaSlab style="default" composition="overlay" /></div>
      </MFBox>

      <MFSectionLabel>Bold</MFSectionLabel>
      <MFBox label="bold · side-by-side" padded={false}>
        <div style={{ padding: 24 }}><MediaSlab style="bold" composition="side-by-side" dark /></div>
      </MFBox>
      <MFBox label="bold · overlay" padded={false}>
        <div style={{ padding: 24 }}><MediaSlab style="bold" composition="overlay" /></div>
      </MFBox>

      <MFSectionLabel>Elegant</MFSectionLabel>
      <MFBox label="elegant · side-by-side" padded={false}>
        <div style={{ padding: 24 }}><MediaSlab style="elegant" composition="side-by-side" dark /></div>
      </MFBox>
      <MFBox label="elegant · overlay" padded={false}>
        <div style={{ padding: 24 }}><MediaSlab style="elegant" composition="overlay" /></div>
      </MFBox>

      <MFSpecRow>
        <MFSpec label="Min height" value="380 / 21:9" note="Side-by-side / overlay respectively" />
        <MFSpec label="Headline" value="50px" note="Per-style face; full-bleed band" />
        <MFSpec label="Padding" value="48 / 56px" note="Vertical / horizontal at desktop" />
        <MFSpec label="Scrim" value="55% → 0%" note="Overlay only · left-anchored gradient" />
      </MFSpecRow>
    </PageShell>
  );
}

// ════════════════════════════════════════════════════════════════════════
// CAPTIONED MEDIA — atomic figure unit
// ════════════════════════════════════════════════════════════════════════
//
// Just media + caption. Three caption placements:
//   - below       (most common; left-aligned inside text columns)
//   - inset       (caption sits over media, lower-left, on a scrim)
//   - sidecar     (caption to the right of the media; for wide gallery layouts)

function CaptionedMedia({ style = "default", placement = "below", dark = false }) {
  const captionText = (
    <>
      <strong style={{ fontFamily: "var(--font-body-bold)", color: dark ? "#fff" : "var(--text-primary)" }}>FIG. 12 · </strong>
      Roadway shoulder geometry, FM-1942 study corridor. Slope analysis from 2024 LiDAR survey.
    </>
  );
  const credit = (
    <span style={{ display: "block", marginTop: 4, fontFamily: "var(--font-mono)", fontSize: "0.74rem", opacity: 0.75 }}>
      Photo · TTI Roadway Geometry Lab
    </span>
  );

  const captionStyle = {
    fontFamily: style === "elegant" ? "var(--font-elegant, Georgia, serif)" : "var(--font-body)",
    fontSize: "0.84rem", lineHeight: 1.55,
    fontStyle: style === "elegant" ? "italic" : "normal",
    color: dark ? "rgba(255,255,255,0.78)" : "var(--text-muted)",
  };

  if (placement === "inset") {
    return (
      <div style={{ position: "relative", width: "100%", maxWidth: 720 }}>
        <MediaBox style={style} ratio="3/2" w={720} h={480} label={`${style} · 3:2`} onDark={dark} />
        <div style={{
          position: "absolute", left: 16, right: 16, bottom: 16,
          background: "rgba(0,0,0,0.6)", padding: "12px 16px", borderRadius: 4,
          color: "#fff", maxWidth: "min(420px, calc(100% - 32px))",
          ...captionStyle, color: "rgba(255,255,255,0.92)",
          borderLeft: `3px solid ${style === "bold" ? "var(--brand-accent)" : "rgba(255,255,255,0.6)"}`,
          paddingLeft: 14,
        }}>
          {captionText}
          {credit}
        </div>
      </div>
    );
  }

  if (placement === "sidecar") {
    return (
      <div style={{ display: "flex", gap: 24, alignItems: "flex-start", maxWidth: 980 }}>
        <div style={{ flex: "0 0 62%" }}>
          <MediaBox style={style} ratio="3/2" w={620} h={414} label={`${style} · 3:2`} onDark={dark} />
        </div>
        <div style={{
          flex: 1, paddingTop: 6,
          borderLeft: `2px solid ${dark ? "var(--brand-accent)" : "var(--brand-primary)"}`,
          paddingLeft: 16,
        }}>
          <div style={{
            fontSize: "0.62rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em",
            color: dark ? "var(--brand-accent)" : "var(--brand-primary)",
            fontFamily: "var(--font-body-bold)", marginBottom: 8,
          }}>FIGURE 12</div>
          <div style={{ ...captionStyle, marginBottom: 4 }}>
            Roadway shoulder geometry, FM-1942 study corridor. Slope analysis from 2024 LiDAR survey.
          </div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: dark ? "rgba(255,255,255,0.6)" : "var(--text-muted)", marginTop: 8 }}>
            Photo · TTI Roadway Geometry Lab
          </div>
        </div>
      </div>
    );
  }

  // below
  return (
    <div style={{ maxWidth: 720 }}>
      <MediaBox style={style} ratio="3/2" w={720} h={480} label={`${style} · 3:2`} onDark={dark} />
      <div style={{
        marginTop: 12, ...captionStyle,
        borderLeft: `2px solid ${dark ? "var(--brand-accent)" : "var(--brand-primary)"}`,
        paddingLeft: 12,
      }}>
        {captionText}
        {credit}
      </div>
    </div>
  );
}

function CaptionedMediaPage() {
  const item = (window.AGGIE_CATALOG || []).find(c => c.id === "captioned-media");
  return (
    <PageShell item={item}>
      <MFIntro>
        The atomic figure unit — media plus an attribution-bearing caption. Three placements: <strong>below</strong> (most common; in-flow), <strong>inset</strong> (caption overlays media; for hero figures), <strong>sidecar</strong> (caption sits to the right; for galleries and feature spreads). All variants use the FIG. NN · convention with a maroon (or gold-on-dark) leading rule.
      </MFIntro>

      <MFSectionLabel>Below · default</MFSectionLabel>
      <MFBox label="default · caption below"><CaptionedMedia style="default" placement="below" /></MFBox>

      <MFSectionLabel>Inset</MFSectionLabel>
      <MFBox label="default · caption inset"><CaptionedMedia style="default" placement="inset" /></MFBox>

      <MFSectionLabel>Sidecar</MFSectionLabel>
      <MFBox label="default · caption sidecar"><CaptionedMedia style="default" placement="sidecar" /></MFBox>

      <MFSectionLabel>Bold</MFSectionLabel>
      <MFBox label="bold · sidecar"><CaptionedMedia style="bold" placement="sidecar" /></MFBox>

      <MFSectionLabel>Elegant</MFSectionLabel>
      <MFBox label="elegant · below"><CaptionedMedia style="elegant" placement="below" /></MFBox>
      <MFBox label="elegant · inset"><CaptionedMedia style="elegant" placement="inset" /></MFBox>

      <MFSectionLabel>On dark</MFSectionLabel>
      <MFBox dark label="default · sidecar · on dark"><CaptionedMedia style="default" placement="sidecar" dark /></MFBox>

      <MFSpecRow>
        <MFSpec label="Caption" value="13.5px / 1.55" note="Body face by default; italic in elegant" />
        <MFSpec label="Leading rule" value="2px maroon" note="Gold on dark; gives the figure-number anchor" />
        <MFSpec label="FIG label" value="0.62rem caps" note="Work Sans 700 · 14% letterspacing" />
        <MFSpec label="Inset scrim" value="rgba(0,0,0,.6)" note="Caption box only — never full-image overlay" />
      </MFSpecRow>
    </PageShell>
  );
}

// ════════════════════════════════════════════════════════════════════════
// Export
// ════════════════════════════════════════════════════════════════════════

Object.assign(window, {
  SplitFeaturePage,
  MediaFeaturesPage,
  MediaSlabPage,
  CaptionedMediaPage,
});
