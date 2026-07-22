/* global React, PageShell, LucideIcon, AGGIE_CATALOG, AggieButton */
/*
 * AggieCTA.jsx — Call-to-action family (3 pages).
 *
 *   CTA feature  — Loud promotional block: headline + body + 1–2 CTAs.
 *                  Two flavors: image-backed (full-bleed photo) and solid
 *                  (maroon or gold field). The biggest editorial mover
 *                  short of a page header.
 *   CTA links    — Group of large icon-prefixed text links with a one-line
 *                  description. The "where do you want to go next" panel.
 *   Button slab  — Full-bleed band of N buttons. Action-only — used at
 *                  the bottom of long-form pages or research listings.
 */

// ════════════════════════════════════════════════════════════════════════
// Shared helpers (CT prefix)
// ════════════════════════════════════════════════════════════════════════

function CTBox({ dark = false, label, children, padded = true }) {
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
      <div style={{ padding: padded ? 24 : 0, background: dark ? "var(--brand-primary)" : "var(--surface-page)" }}>
        {children}
      </div>
    </div>
  );
}

function CTSectionLabel({ children }) {
  return (
    <div style={{
      fontSize: "0.62rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em",
      color: "var(--text-muted)", fontFamily: "var(--font-body-bold)", marginBottom: 12, marginTop: 16,
    }}>{children}</div>
  );
}

function CTSpecRow({ children }) {
  return (
    <div style={{
      marginTop: 28, padding: "14px 18px", border: "1px solid var(--surface-border)",
      borderRadius: "var(--radius-md)", background: "var(--surface-raised)",
      display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16,
    }}>{children}</div>
  );
}

function CTSpec({ label, value, note }) {
  return (
    <div>
      <div style={{ fontSize: "0.6rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-muted)", fontFamily: "var(--font-body-bold)" }}>{label}</div>
      <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem", color: "var(--brand-primary)", marginTop: 3, fontWeight: 500 }}>{value}</div>
      {note && <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: 2, lineHeight: 1.4 }}>{note}</div>}
    </div>
  );
}

function CTIntro({ children }) {
  return (
    <div style={{ padding: "16px 20px", marginBottom: 28, background: "color-mix(in srgb, var(--brand-primary) 5%, transparent)", borderLeft: "3px solid var(--brand-primary)", borderRadius: "0 var(--radius-sm) var(--radius-sm) 0", fontSize: "0.92rem", lineHeight: 1.65, color: "var(--text-secondary)" }}>
      {children}
    </div>
  );
}

// Style signature for headings (re-implemented locally — small + reusable across files)
function CTSig({ style, dark, width = 80 }) {
  const c = dark ? "rgba(255,255,255,0.9)" : "var(--brand-primary)";
  if (style === "bold") {
    return (
      <div style={{ marginTop: 14, display: "flex", alignItems: "center", gap: 6 }}>
        <span style={{ display: "block", width: width * 0.55, height: 6, borderRadius: 3, background: c }} />
        <span style={{ display: "block", width: width * 0.18, height: 6, borderRadius: 3, background: c, opacity: 0.5 }} />
        <span style={{ display: "block", width: width * 0.08, height: 6, borderRadius: 3, background: c, opacity: 0.25 }} />
      </div>
    );
  }
  if (style === "elegant") {
    const accent = dark ? "rgba(255,255,255,0.9)" : "var(--brand-accent)";
    return (
      <div style={{
        marginTop: 14, width, height: 8,
        backgroundImage: `repeating-linear-gradient(135deg, ${accent} 0 1.4px, transparent 1.4px 7px)`,
        WebkitMaskImage: "linear-gradient(90deg, transparent 0%, black 15%, black 85%, transparent 100%)",
        maskImage: "linear-gradient(90deg, transparent 0%, black 15%, black 85%, transparent 100%)",
        opacity: 0.9,
      }} />
    );
  }
  return (
    <div style={{
      marginTop: 14, width, height: 2,
      background: `linear-gradient(90deg, transparent 0%, ${c} 15%, ${c} 85%, transparent 100%)`,
      opacity: 0.9,
    }} />
  );
}

function CTHeading({ style, children, size = 36, dark = false }) {
  const color = dark ? "#fff" : "var(--brand-primary)";
  if (style === "bold") {
    return (
      <h2 style={{ margin: 0, fontFamily: "var(--font-bold)", fontWeight: 800, fontStyle: "italic",
        textTransform: "uppercase", fontSize: size, lineHeight: 1.05, color, letterSpacing: 0 }}>{children}</h2>
    );
  }
  if (style === "elegant") {
    return (
      <h2 style={{ margin: 0, fontFamily: "var(--font-elegant)", fontWeight: 400, fontStyle: "italic",
        textTransform: "uppercase", fontSize: size * 0.94, lineHeight: 1.1, color, letterSpacing: "-0.005em" }}>{children}</h2>
    );
  }
  return (
    <h2 style={{ margin: 0, fontFamily: "var(--font-display)", fontWeight: 500,
      textTransform: "uppercase", fontSize: size, lineHeight: 1.1, color, letterSpacing: "0.01em" }}>{children}</h2>
  );
}

// ════════════════════════════════════════════════════════════════════════
// CTA FEATURE
// ════════════════════════════════════════════════════════════════════════

// Image-backed: full-bleed photo with overlay + content card on left
function CTAFeatureImage({ style, dark, tone = 0 }) {
  const palettes = [
    "linear-gradient(135deg, #5C0025 0%, #1a000a 100%)",   // maroon
    "linear-gradient(135deg, #006483 0%, #001a24 100%)",   // teal
    "linear-gradient(135deg, #6B4226 0%, #1f1409 100%)",   // umber
  ];
  return (
    <div style={{
      position: "relative", minHeight: 360, overflow: "hidden",
      background: palettes[tone % palettes.length],
    }}>
      {/* photo-feel overlay */}
      <div style={{ position: "absolute", inset: 0,
        backgroundImage: "radial-gradient(circle at 75% 30%, rgba(255,255,255,0.18) 0%, transparent 50%), radial-gradient(circle at 30% 80%, rgba(0,0,0,0.4) 0%, transparent 60%)" }} />
      {/* gradient veil for legibility */}
      <div style={{ position: "absolute", inset: 0,
        background: "linear-gradient(90deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.3) 50%, transparent 100%)" }} />

      <div style={{ position: "relative", padding: "60px 56px", maxWidth: 620 }}>
        <div style={{
          fontFamily: "var(--font-bold)", fontWeight: 700, fontSize: 11,
          textTransform: "uppercase", letterSpacing: "0.14em",
          color: "rgba(255,255,255,0.78)", marginBottom: 18,
        }}>Apply now</div>

        <CTHeading style={style} size={42} dark={true}>
          Bring your research to scale with TTI
        </CTHeading>
        <CTSig style={style} dark={true} width={120} />

        <p style={{
          margin: "22px 0 28px", maxWidth: 480,
          fontFamily: "var(--font-body)", fontSize: 16, lineHeight: 1.6,
          color: "rgba(255,255,255,0.92)",
        }}>
          The Texas A&M Transportation Institute partners with state and federal agencies on long-running, field-deployed research. Bring a question; leave with a multi-year program.
        </p>

        <div style={{ display: "flex", gap: 18, alignItems: "center" }}>
          {window.AggieButton ? (
            <>
              <AggieButton variant="primary" size="lg" dark>Submit a proposal</AggieButton>
              <AggieButton variant="ghost" size="lg" dark>How it works</AggieButton>
            </>
          ) : (
            <span style={{ color: "#fff" }}>[buttons]</span>
          )}
        </div>
      </div>
    </div>
  );
}

// Solid-color: full-color block, two-column copy + CTA
function CTAFeatureSolid({ style, dark, color = "maroon" }) {
  const onDark = color === "maroon" || dark;
  const bg = color === "gold"
    ? "#DDAC37"
    : (color === "lightgray" ? "var(--surface-sunken)" : "var(--brand-primary)");
  const fgPrimary = color === "gold" ? "#2A0E15" : (color === "lightgray" ? "var(--text-primary)" : "#fff");
  const fgSecondary = color === "gold" ? "rgba(42,14,21,0.8)" : (color === "lightgray" ? "var(--text-secondary)" : "rgba(255,255,255,0.85)");

  // For non-maroon non-gold: darkness logic for heading sig
  const headingDark = color !== "lightgray";

  return (
    <div style={{ background: bg, padding: "56px 60px", display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 56, alignItems: "center" }}>
      <div>
        <div style={{
          fontFamily: "var(--font-bold)", fontWeight: 700, fontSize: 11,
          textTransform: "uppercase", letterSpacing: "0.14em",
          color: fgSecondary, marginBottom: 16,
        }}>Stay current</div>
        <CTHeading style={style} size={40} dark={headingDark}>
          Quarterly research bulletin, in your inbox
        </CTHeading>
        <CTSig style={style} dark={headingDark} width={108} />
        <p style={{
          margin: "20px 0 0", maxWidth: 460,
          fontFamily: "var(--font-body)", fontSize: 15.5, lineHeight: 1.6,
          color: fgPrimary,
        }}>
          Three-paragraph summaries of our most-read reports, delivered the first Tuesday of every quarter. No marketing copy, no upsell — just the work.
        </p>
      </div>

      {/* Right column: form */}
      <div>
        <label style={{
          display: "block",
          fontFamily: "var(--font-bold)", fontWeight: 700, fontSize: 12,
          textTransform: "uppercase", letterSpacing: "0.12em",
          color: fgSecondary, marginBottom: 8,
        }}>Email address</label>
        <div style={{ display: "flex", gap: 0, marginBottom: 12 }}>
          <input
            type="email"
            placeholder="your@email.edu"
            style={{
              flex: 1, height: 50,
              border: `2px solid ${color === "lightgray" ? "#000" : (color === "gold" ? "#2A0E15" : "rgba(255,255,255,0.9)")}`,
              borderRight: "none",
              padding: "0 14px", fontFamily: "var(--font-bold)", fontSize: 14,
              background: color === "lightgray" ? "#fff" : (color === "gold" ? "rgba(255,255,255,0.18)" : "rgba(0,0,0,0.18)"),
              color: fgPrimary,
              outline: "none",
            }}
            readOnly
          />
          <button style={{
            height: 50, padding: "0 22px",
            background: color === "lightgray" ? "var(--brand-primary)" : (color === "gold" ? "#2A0E15" : "#DDAC37"),
            color: color === "lightgray" ? "#fff" : (color === "gold" ? "#DDAC37" : "#2A0E15"),
            border: "none",
            fontFamily: "var(--font-bold)", fontWeight: 700, fontSize: 13,
            textTransform: "uppercase", letterSpacing: "0.1em",
            cursor: "pointer",
          }}>Subscribe</button>
        </div>
        <div style={{ fontFamily: "var(--font-body)", fontSize: 12, color: fgSecondary }}>
          We never share your address. Unsubscribe in one click.
        </div>
      </div>
    </div>
  );
}

function CTAFeaturePage() {
  const item = (window.AGGIE_CATALOG || []).find(c => c.id === "cta-feature");
  return (
    <PageShell item={item}>
      <CTIntro>
        The <strong>loudest editorial surface short of a page header.</strong> Use to drive a single, important action — proposal submission, mailing-list signup, registration. Two flavors: <strong>image-backed</strong> (photographic field, white text) or <strong>solid-color</strong> (maroon, gold, or lightgray field). Headline carries the page's style signature.
      </CTIntro>

      <CTSectionLabel>Image-backed · three styles</CTSectionLabel>
      {["default", "bold", "elegant"].map((s, i) => (
        <CTBox key={s} dark={false} label={`style = ${s} · image-backed`} padded={false}>
          <CTAFeatureImage style={s} dark={false} tone={i} />
        </CTBox>
      ))}

      <CTSectionLabel>Solid-color · three fields · default style</CTSectionLabel>
      <CTBox dark={false} label="color = maroon (brand primary)" padded={false}>
        <CTAFeatureSolid style="default" color="maroon" />
      </CTBox>
      <CTBox dark={false} label="color = gold (brand accent)" padded={false}>
        <CTAFeatureSolid style="default" color="gold" />
      </CTBox>
      <CTBox dark={false} label="color = lightgray (subtle)" padded={false}>
        <CTAFeatureSolid style="default" color="lightgray" />
      </CTBox>

      <CTSectionLabel>Solid-color × style cross-reference · maroon field</CTSectionLabel>
      <CTBox dark={false} label="style = bold · maroon" padded={false}>
        <CTAFeatureSolid style="bold" color="maroon" />
      </CTBox>
      <CTBox dark={false} label="style = elegant · maroon" padded={false}>
        <CTAFeatureSolid style="elegant" color="maroon" />
      </CTBox>

      <CTSpecRow>
        <CTSpec label="Min height" value="360px" note="image-backed needs the breathing room" />
        <CTSpec label="Title size" value="40–42px" note="just below page-header H1, just above slab H2" />
        <CTSpec label="Image overlay" value="55% → 0% gradient" note="left-side veil keeps text legible" />
        <CTSpec label="Limit" value="One per page" note="more than one = noise" />
      </CTSpecRow>
    </PageShell>
  );
}

// ════════════════════════════════════════════════════════════════════════
// CTA LINKS
// ════════════════════════════════════════════════════════════════════════

const CTA_LINK_SAMPLES = [
  { icon: "file-text",      title: "Annual report",            desc: "FY2024 financials, projects, and outcomes." },
  { icon: "users",          title: "Researchers",              desc: "Browse 240+ TTI staff and partner researchers." },
  { icon: "briefcase",      title: "Career opportunities",     desc: "Open positions across labs, field teams, and admin." },
  { icon: "calendar",       title: "Upcoming events",          desc: "Conferences, workshops, and short courses." },
  { icon: "graduation-cap", title: "Student programs",         desc: "Internships, fellowships, and student labs." },
  { icon: "newspaper",      title: "Press & media",            desc: "Recent coverage and press contacts." },
];

function CTALinkItem({ link, style, dark, large }) {
  const fg = dark ? "#fff" : "var(--text-primary)";
  const muted = dark ? "rgba(255,255,255,0.78)" : "var(--text-secondary)";
  const accent = dark ? "#DDAC37" : "var(--brand-primary)";

  return (
    <a href="#" onClick={e => e.preventDefault()} style={{
      display: "flex", gap: 18, padding: large ? "26px 24px" : "20px 22px",
      background: dark ? "rgba(255,255,255,0.04)" : "#fff",
      border: dark ? "1px solid rgba(255,255,255,0.12)" : "1px solid var(--surface-border)",
      textDecoration: "none", color: "inherit",
      alignItems: "flex-start",
    }}>
      <div style={{
        flexShrink: 0, width: large ? 56 : 44, height: large ? 56 : 44,
        background: dark ? "rgba(221,172,55,0.15)" : "color-mix(in srgb, var(--brand-primary) 8%, transparent)",
        display: "flex", alignItems: "center", justifyContent: "center",
        ...(style === "elegant" ? {
          backgroundImage: dark
            ? "repeating-linear-gradient(135deg, rgba(221,172,55,0.4) 0 1.4px, transparent 1.4px 7px)"
            : "repeating-linear-gradient(135deg, color-mix(in srgb, var(--brand-primary) 25%, transparent) 0 1.4px, transparent 1.4px 7px)",
          background: dark ? "rgba(221,172,55,0.12)" : "color-mix(in srgb, var(--brand-primary) 5%, transparent)",
        } : {}),
      }}>
        <LucideIcon name={link.icon} size={large ? 26 : 22} color={accent} strokeWidth={1.6} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
          {/* Title — uses style heading for big size, but smaller scale for the row */}
          <CTHeading style={style} size={large ? 22 : 18} dark={dark}>{link.title}</CTHeading>
        </div>
        <p style={{
          margin: "10px 0 0",
          fontFamily: "var(--font-body)", fontSize: large ? 14 : 13, lineHeight: 1.55,
          color: muted,
        }}>{link.desc}</p>
      </div>
      <div style={{ flexShrink: 0, paddingTop: 4 }}>
        <LucideIcon name="arrow-right" size={20} color={accent} />
      </div>
    </a>
  );
}

function CTALinksPage() {
  const item = (window.AGGIE_CATALOG || []).find(c => c.id === "cta-links");
  return (
    <PageShell item={item}>
      <CTIntro>
        Group of large, icon-prefixed text links — the "where to next?" panel. Use as a hub-page footer or as a sidebar in long articles. <strong>2 / 3 columns</strong> at hero scale; vertical stack on mobile. Each item is a full-bleed clickable area: icon tile + title + description + chevron.
      </CTIntro>

      <CTSectionLabel>3-up · large · default style</CTSectionLabel>
      <CTBox dark={false} label="style = default">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
          {CTA_LINK_SAMPLES.slice(0, 3).map((l, i) => (
            <CTALinkItem key={i} link={l} style="default" dark={false} large />
          ))}
        </div>
      </CTBox>

      <CTSectionLabel>3-up · across all three styles</CTSectionLabel>
      {["bold", "elegant"].map(s => (
        <CTBox key={s} dark={false} label={`style = ${s}`}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
            {CTA_LINK_SAMPLES.slice(0, 3).map((l, i) => (
              <CTALinkItem key={i} link={l} style={s} dark={false} large />
            ))}
          </div>
        </CTBox>
      ))}

      <CTSectionLabel>2-up · denser · default style</CTSectionLabel>
      <CTBox dark={false} label="style = default · 2-column">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 14 }}>
          {CTA_LINK_SAMPLES.map((l, i) => (
            <CTALinkItem key={i} link={l} style="default" dark={false} large={false} />
          ))}
        </div>
      </CTBox>

      <CTSectionLabel>On dark · 3-up · bold style</CTSectionLabel>
      <CTBox dark={true} label="style = bold · on brand maroon">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
          {CTA_LINK_SAMPLES.slice(0, 3).map((l, i) => (
            <CTALinkItem key={i} link={l} style="bold" dark={true} large />
          ))}
        </div>
      </CTBox>

      <CTSpecRow>
        <CTSpec label="Icon tile" value="44 / 56px" note="dense / large variants" />
        <CTSpec label="Hit target" value="entire row" note="never just the title — the whole card is the link" />
        <CTSpec label="Trailing arrow" value="always present" note="visual affordance for 'this goes somewhere'" />
        <CTSpec label="Group size" value="3–6 items" note="more than 6 → use Link list collections instead" />
      </CTSpecRow>
    </PageShell>
  );
}

// ════════════════════════════════════════════════════════════════════════
// BUTTON SLAB
// ════════════════════════════════════════════════════════════════════════

const BUTTON_SLAB_SAMPLES = {
  apply: [
    { icon: "file-text",     label: "Submit proposal" },
    { icon: "calendar",      label: "Request meeting" },
    { icon: "download",      label: "RFP guidelines" },
    { icon: "phone",         label: "Contact program officer" },
  ],
  research: [
    { icon: "search",        label: "Browse projects" },
    { icon: "users",         label: "Find a researcher" },
    { icon: "filter",        label: "Filter by topic" },
  ],
  data: [
    { icon: "database",      label: "Open dataset" },
    { icon: "map",           label: "View map" },
    { icon: "download",      label: "Download CSV" },
    { icon: "code",          label: "API docs" },
  ],
};

function ButtonSlabBlock({ style, dark, color = "maroon", buttons, label }) {
  const isMaroon = color === "maroon";
  const isGold = color === "gold";
  const isLight = color === "lightgray";
  const onDark = isMaroon;

  const bg = isGold ? "#DDAC37" : (isLight ? "var(--surface-sunken)" : "var(--brand-primary)");
  const fgPrimary = isGold ? "#2A0E15" : (isLight ? "var(--text-primary)" : "#fff");
  const buttonBg = isMaroon ? "#DDAC37" : (isGold ? "#2A0E15" : "var(--brand-primary)");
  const buttonFg = isMaroon ? "#2A0E15" : (isGold ? "#DDAC37" : "#fff");
  const sigDark = !isLight;

  return (
    <div style={{ background: bg, padding: "44px 56px" }}>
      {label && (
        <>
          <div style={{
            fontFamily: "var(--font-bold)", fontWeight: 700, fontSize: 11,
            textTransform: "uppercase", letterSpacing: "0.14em",
            color: isLight ? "var(--text-muted)" : (isGold ? "rgba(42,14,21,0.7)" : "rgba(255,255,255,0.72)"),
            marginBottom: 12,
          }}>{label.eyebrow}</div>
          <CTHeading style={style} size={28} dark={sigDark}>{label.title}</CTHeading>
          <CTSig style={style} dark={sigDark} width={88} />
          <div style={{ height: 28 }} />
        </>
      )}
      <div style={{
        display: "grid", gridTemplateColumns: `repeat(${buttons.length}, minmax(0, 1fr))`, gap: 1,
        background: isLight ? "var(--surface-border)" : (isGold ? "rgba(42,14,21,0.18)" : "rgba(255,255,255,0.18)"),
      }}>
        {buttons.map((b, i) => (
          <a key={i} href="#" onClick={e => e.preventDefault()} style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: 12,
            padding: "22px 18px",
            background: buttonBg, color: buttonFg,
            fontFamily: "var(--font-bold)", fontWeight: 700, fontSize: 14,
            textTransform: "uppercase", letterSpacing: "0.1em",
            textDecoration: "none",
          }}>
            <LucideIcon name={b.icon} size={18} color={buttonFg} />
            {b.label}
          </a>
        ))}
      </div>
    </div>
  );
}

function ButtonSlabPage() {
  const item = (window.AGGIE_CATALOG || []).find(c => c.id === "button-slab");
  return (
    <PageShell item={item}>
      <CTIntro>
        Full-bleed action band. Use at the bottom of long-form research pages, hub indexes, or post-article footers. <strong>3–4 buttons</strong> work best — more than that and individual labels get cramped. Comes in three field colors (maroon / gold / lightgray) and supports an optional eyebrow + title slug above the buttons.
      </CTIntro>

      <CTSectionLabel>Three styles · maroon field · with title</CTSectionLabel>
      {["default", "bold", "elegant"].map(s => (
        <CTBox key={s} dark={false} label={`style = ${s} · maroon`} padded={false}>
          <ButtonSlabBlock
            style={s}
            color="maroon"
            buttons={BUTTON_SLAB_SAMPLES.apply}
            label={{ eyebrow: "Get involved", title: "Work with TTI" }}
          />
        </CTBox>
      ))}

      <CTSectionLabel>Field-color variants · default style</CTSectionLabel>
      <CTBox dark={false} label="color = gold (brand accent)" padded={false}>
        <ButtonSlabBlock style="default" color="gold" buttons={BUTTON_SLAB_SAMPLES.research}
          label={{ eyebrow: "Browse our work", title: "Research portal" }} />
      </CTBox>
      <CTBox dark={false} label="color = lightgray (subtle)" padded={false}>
        <ButtonSlabBlock style="default" color="lightgray" buttons={BUTTON_SLAB_SAMPLES.data}
          label={{ eyebrow: "Open data", title: "Public datasets" }} />
      </CTBox>

      <CTSectionLabel>Without title · maroon · 4 buttons</CTSectionLabel>
      <CTBox dark={false} label="title-less variant — for use under existing section content" padded={false}>
        <ButtonSlabBlock style="default" color="maroon" buttons={BUTTON_SLAB_SAMPLES.apply} />
      </CTBox>

      <CTSpecRow>
        <CTSpec label="Button count" value="3–4 ideal" note="2 = looks empty; 5+ = labels cramped" />
        <CTSpec label="Button height" value="auto" note="22px vertical pad — comfortable on touch + cursor" />
        <CTSpec label="Field colors" value="maroon · gold · lightgray" note="picks affect button reverse-color automatically" />
        <CTSpec label="Edge" value="full-bleed" note="extends to viewport edges; ignores body gutters" />
      </CTSpecRow>
    </PageShell>
  );
}

Object.assign(window, {
  CTAFeaturePage, CTALinksPage, ButtonSlabPage,
});
