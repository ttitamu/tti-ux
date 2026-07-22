/* global React, PageShell, AGGIE_CATALOG, LucideIcon */
/*
 * AggieIconLink.jsx — Batch 9: Icon-prefixed and link-list editorial blocks.
 *
 *   Icon feature collection — 3/4-up grid; each cell is icon + headline + body.
 *                             "What we do" / "our services" pattern.
 *   Icon list collections   — vertical list, icon left + label/desc right.
 *                             Denser than icon-feature; stacks well in narrow rails.
 *   Link list collections   — grouped resource lists with arrow/caret rows.
 *                             Editorial wayfinding, often used in landing-page footers.
 *   Link slab               — full-width band of inline links over a colored
 *                             background; "in this section" footer-of-page nav.
 *
 * Helper prefix: IL (IconLink). Always-local helpers — never import a generic
 * SectionLabel/Box/Spec from another batch (Babel scope collisions).
 *
 * Lineage (INF-2):
 *   • Link list & link slab — anatomy informed by SharePoint Quick-Links
 *     (Button, Compact, Filmstrip, Grid, List, Tiles — 13 frames).
 *     SharePoint maps the same editorial intent to six layouts; ours
 *     condense to: list = SharePoint Compact/List, slab = SharePoint
 *     Button/Filmstrip (horizontal-band variants). The icon + label + arrow
 *     row rhythm is shared.
 *   • Icon feature collection — informed by SharePoint Quick-Links Grid
 *     (icon-top tile w/ headline + description). TUX keeps the maroon
 *     tinted icon-box; SharePoint uses a flat Fluent fill.
 *   • Icon list — informed by SharePoint Quick-Links Compact (icon-left
 *     row, denser than the grid). Dense / regular density tiers map to
 *     SharePoint's "compact" toggle in the web part.
 *
 * Identity stays TUX: Lucide @ stroke 1.5 (not Fluent icons), tinted-square
 * icon containers in brand color, Work Sans 700 caps links. Never lift
 * Segoe UI or SharePoint blue.
 */

// ════════════════════════════════════════════════════════════════════════
// Shared helpers (IL prefix)
// ════════════════════════════════════════════════════════════════════════

function ILBox({ dark = false, label, padded = true, children }) {
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

function ILSectionLabel({ children }) {
  return (
    <div style={{ fontSize: "0.62rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--text-muted)", fontFamily: "var(--font-body-bold)", marginBottom: 12, marginTop: 16 }}>{children}</div>
  );
}

function ILSpecRow({ children }) {
  return (
    <div style={{ marginTop: 28, padding: "14px 18px", border: "1px solid var(--surface-border)", borderRadius: "var(--radius-md)", background: "var(--surface-raised)", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>{children}</div>
  );
}

function ILSpec({ label, value, note }) {
  return (
    <div>
      <div style={{ fontSize: "0.6rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-muted)", fontFamily: "var(--font-body-bold)" }}>{label}</div>
      <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem", color: "var(--brand-primary)", marginTop: 3, fontWeight: 500 }}>{value}</div>
      {note && <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: 2, lineHeight: 1.4 }}>{note}</div>}
    </div>
  );
}

function ILIntro({ children }) {
  return (
    <div style={{ padding: "16px 20px", marginBottom: 28, background: "color-mix(in srgb, var(--brand-primary) 5%, transparent)", borderLeft: "3px solid var(--brand-primary)", borderRadius: "0 var(--radius-sm) var(--radius-sm) 0", fontSize: "0.92rem", lineHeight: 1.65, color: "var(--text-secondary)" }}>
      {children}
    </div>
  );
}

/* Style signature — same proportions as the rest of the kit. */
function ILSig({ style, dark, width = 80 }) {
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
        backgroundImage: `repeating-linear-gradient(135deg, ${accent} 0 1px, transparent 1px 5px)`,
        WebkitMaskImage: "linear-gradient(90deg, transparent 0%, black 15%, black 85%, transparent 100%)",
        maskImage: "linear-gradient(90deg, transparent 0%, black 15%, black 85%, transparent 100%)",
        opacity: 0.75,
      }} />
    );
  }
  // default — hairline rule, fades at both ends
  return (
    <div style={{
      width, height: 1,
      background: `linear-gradient(90deg, transparent 0%, ${c} 15%, ${c} 85%, transparent 100%)`,
      opacity: 0.85,
    }} />
  );
}

/* Style-aware section title (eyebrow + headline + sig). */
function ILSectionHead({ style, dark, eyebrow, title, lede, align = "left" }) {
  const headColor = dark ? "white" : "var(--text-primary)";
  const ledeColor = dark ? "rgba(255,255,255,0.85)" : "var(--text-secondary)";
  const eyebrowColor = dark ? "rgba(255,255,255,0.75)" : "var(--text-muted)";

  let headFamily = "var(--font-display)";
  let headTransform = "uppercase";
  let headWeight = 500;
  let headStyle = "normal";
  let headLetter = "0.01em";
  let headSize = "1.55rem";

  if (style === "bold") {
    headFamily = "var(--font-body-bold)";
    headWeight = 700;
    headTransform = "none";
    headLetter = 0;
    headSize = "1.55rem";
  } else if (style === "elegant") {
    headFamily = "var(--font-elegant, Georgia, serif)";
    headWeight = 400;
    headStyle = "italic";
    headTransform = "none";
    headLetter = "-0.005em";
    headSize = "1.7rem";
  }

  return (
    <div style={{ marginBottom: 28, textAlign: align }}>
      {eyebrow && (
        <div style={{ fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: eyebrowColor, fontFamily: "var(--font-body-bold)", marginBottom: 8 }}>{eyebrow}</div>
      )}
      <h3 style={{ fontFamily: headFamily, fontSize: headSize, fontWeight: headWeight, fontStyle: headStyle, textTransform: headTransform, letterSpacing: headLetter, margin: "0 0 12px", lineHeight: 1.15, color: headColor }}>{title}</h3>
      <div style={{ display: "flex", justifyContent: align === "center" ? "center" : "flex-start" }}>
        <ILSig style={style} dark={dark} width={86} />
      </div>
      {lede && (
        <p style={{ margin: "14px 0 0", fontSize: "0.95rem", lineHeight: 1.6, color: ledeColor, maxWidth: 580, marginLeft: align === "center" ? "auto" : 0, marginRight: align === "center" ? "auto" : 0 }}>{lede}</p>
      )}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════
// Inline icon (renders Lucide via the global LucideIcon helper)
// Falls back to a quiet square if the icon name isn't found.
// ════════════════════════════════════════════════════════════════════════
function ILIcon({ name, size = 28, color }) {
  if (window.LucideIcon) {
    return <LucideIcon name={name} size={size} color={color || "currentColor"} strokeWidth={1.5} />;
  }
  return <div style={{ width: size, height: size, background: "currentColor", opacity: 0.2, borderRadius: 3 }} />;
}

// ════════════════════════════════════════════════════════════════════════
// Icon Feature Collection
// 3-up and 4-up grids; icon + headline + body, optional CTA link.
// ════════════════════════════════════════════════════════════════════════

const ICON_FEATURE_DATA = [
  { icon: "route",       title: "Mobility planning",   body: "Pre-construction analysis, traffic forecasting, and corridor studies for state and local DOTs." },
  { icon: "shield-check",title: "Safety research",     body: "Crash data analysis, vulnerable-road-user studies, and operational guidance for safer streets." },
  { icon: "binary",      title: "Connected systems",   body: "Connected and automated vehicle deployment, ITS evaluation, and roadway infrastructure readiness." },
  { icon: "leaf",        title: "Resilient corridors", body: "Climate-resilient design, freight infrastructure, and supply-chain risk modeling for ports and rail." },
];

function IFCell({ data, style, dark, accent, withLink = true }) {
  const headFamily = style === "bold" ? "var(--font-body-bold)"
                   : style === "elegant" ? "var(--font-elegant, Georgia, serif)"
                   : "var(--font-display)";
  const headWeight = style === "bold" ? 700 : 500;
  const headStyle = style === "elegant" ? "italic" : "normal";
  const headTransform = style === "bold" || style === "elegant" ? "none" : "uppercase";

  const titleColor = dark ? "white" : "var(--text-primary)";
  const bodyColor = dark ? "rgba(255,255,255,0.82)" : "var(--text-secondary)";
  const linkColor = dark ? "white" : "var(--brand-primary)";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{
        width: 52, height: 52, borderRadius: 4,
        background: dark ? "rgba(255,255,255,0.12)" : "color-mix(in srgb, var(--brand-primary) 8%, transparent)",
        color: dark ? "white" : (accent || "var(--brand-primary)"),
        display: "flex", alignItems: "center", justifyContent: "center",
        marginBottom: 4,
      }}>
        <ILIcon name={data.icon} size={26} />
      </div>
      <h4 style={{
        margin: 0, fontFamily: headFamily, fontSize: "1.1rem",
        fontWeight: headWeight, fontStyle: headStyle, textTransform: headTransform,
        letterSpacing: headTransform === "uppercase" ? "0.01em" : 0,
        color: titleColor, lineHeight: 1.2,
      }}>{data.title}</h4>
      <p style={{ margin: 0, fontSize: "0.9rem", lineHeight: 1.6, color: bodyColor }}>{data.body}</p>
      {withLink && (
        <a href="#" onClick={(e) => e.preventDefault()} style={{
          marginTop: 4, fontFamily: "var(--font-body-bold)", fontSize: "0.72rem",
          fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
          color: linkColor, textDecoration: "none",
          display: "inline-flex", alignItems: "center", gap: 6,
        }}>
          Learn more
          <span style={{ fontSize: "0.85em", marginTop: -1 }}>→</span>
        </a>
      )}
    </div>
  );
}

function IconFeaturePage() {
  const item = (window.AGGIE_CATALOG || []).find(c => c.id === "icon-feature");
  return (
    <PageShell item={item}>
      <ILIntro>
        Icon features sit on landing pages and section hubs as the answer to <em>"what do we do?"</em>. Every cell is an icon, a short verb-phrase headline, two-to-three lines of body, and an optional next-step link. Three- or four-up grids — go four-up only when content is genuinely terse.
      </ILIntro>

      <ILSectionLabel>3-up · default</ILSectionLabel>
      <ILBox label="grid · 3-up · with link · default">
        <ILSectionHead style="default" eyebrow="What we research" title="Areas of expertise" lede="The TTI portfolio spans the lifecycle of a transportation system — from pre-construction modeling to long-term performance evaluation." />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 36, marginTop: 32 }}>
          {ICON_FEATURE_DATA.slice(0, 3).map((d, i) => <IFCell key={i} data={d} style="default" dark={false} />)}
        </div>
      </ILBox>

      <ILSectionLabel>4-up · bold</ILSectionLabel>
      <ILBox label="grid · 4-up · with link · bold">
        <ILSectionHead style="bold" eyebrow="Capabilities" title="Four research pillars" lede="Each pillar is a multi-decade program with anchor faculty, dedicated test facilities, and federal/state funding portfolios." />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 28, marginTop: 32 }}>
          {ICON_FEATURE_DATA.map((d, i) => <IFCell key={i} data={d} style="bold" dark={false} accent="var(--brand-accent)" />)}
        </div>
      </ILBox>

      <ILSectionLabel>3-up · elegant</ILSectionLabel>
      <ILBox label="grid · 3-up · with link · elegant">
        <ILSectionHead style="elegant" eyebrow="Areas of expertise" title="Where our work lives" lede="A multi-disciplinary practice grounded in field measurement, evidence-based policy, and the patient discipline of long-running studies." />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 36, marginTop: 32 }}>
          {ICON_FEATURE_DATA.slice(0, 3).map((d, i) => <IFCell key={i} data={d} style="elegant" dark={false} />)}
        </div>
      </ILBox>

      <ILSectionLabel>3-up · on dark · default</ILSectionLabel>
      <ILBox dark label="grid · 3-up · on dark · default">
        <ILSectionHead style="default" dark eyebrow="What we research" title="Areas of expertise" lede="The TTI portfolio spans the lifecycle of a transportation system — from pre-construction modeling to long-term performance evaluation." />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 36, marginTop: 32 }}>
          {ICON_FEATURE_DATA.slice(0, 3).map((d, i) => <IFCell key={i} data={d} style="default" dark={true} />)}
        </div>
      </ILBox>

      <ILSpecRow>
        <ILSpec label="grid"      value="3-up · 4-up" note="3-up is the editorial default; 4-up only with terse copy." />
        <ILSpec label="icon size" value="26 / 52 box"  note="Lucide @ stroke 1.5; 52px tinted square as containing block." />
        <ILSpec label="headline"  value="font-display" note="Style variant swaps display family + casing." />
        <ILSpec label="link"      value="Work Sans 700" note="Buttons + form controls + inline CTAs are the constants." />
      </ILSpecRow>
    </PageShell>
  );
}

// ════════════════════════════════════════════════════════════════════════
// Icon List Collections
// Vertical list — icon + label/desc per row. Denser than icon-feature.
// ════════════════════════════════════════════════════════════════════════

const ICON_LIST_DATA = [
  { icon: "phone",          label: "979-317-2000",                desc: "Main switchboard, College Station" },
  { icon: "mail",           label: "comms@tti.tamu.edu",          desc: "Press inquiries and media requests" },
  { icon: "map-pin",        label: "3135 TAMU, College Station",  desc: "Riverside Campus headquarters" },
  { icon: "calendar-clock", label: "Mon–Fri · 8am–5pm CT",        desc: "Standard operating hours" },
];

const ICON_LIST_FEATURES = [
  { icon: "users",           label: "650+ researchers",     desc: "Faculty, staff, and graduate research assistants across 14 divisions." },
  { icon: "graduation-cap",  label: "Tier-1 R&D",           desc: "Among the largest university-affiliated transportation research programs in the nation." },
  { icon: "flask-conical",   label: "Field-tested labs",    desc: "Test facilities for crashworthiness, work-zone safety, pavement, and CAV deployment." },
  { icon: "globe",           label: "Statewide footprint",  desc: "Twelve regional offices serving every TxDOT district and most major Texas metros." },
];

function ILRow({ data, style, dark, dense = false }) {
  const headFamily = style === "bold" ? "var(--font-body-bold)"
                   : style === "elegant" ? "var(--font-elegant, Georgia, serif)"
                   : "var(--font-display)";
  const headWeight = style === "bold" ? 700 : 500;
  const headStyle = style === "elegant" ? "italic" : "normal";
  const headTransform = style === "bold" || style === "elegant" ? "none" : "uppercase";
  const labelColor = dark ? "white" : "var(--text-primary)";
  const descColor = dark ? "rgba(255,255,255,0.78)" : "var(--text-muted)";
  const iconBg = dark ? "rgba(255,255,255,0.12)" : "color-mix(in srgb, var(--brand-primary) 7%, transparent)";
  const iconColor = dark ? "white" : "var(--brand-primary)";

  return (
    <div style={{
      display: "grid", gridTemplateColumns: `${dense ? 38 : 46}px 1fr`, gap: dense ? 14 : 18,
      padding: dense ? "10px 0" : "16px 0",
      borderBottom: dark ? "1px solid rgba(255,255,255,0.14)" : "1px solid var(--surface-border)",
      alignItems: dense ? "center" : "flex-start",
    }}>
      <div style={{
        width: dense ? 36 : 44, height: dense ? 36 : 44, borderRadius: 4,
        background: iconBg, color: iconColor,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <ILIcon name={data.icon} size={dense ? 18 : 22} />
      </div>
      <div>
        <div style={{
          fontFamily: dense ? "var(--font-body-bold)" : headFamily,
          fontSize: dense ? "0.92rem" : "1rem",
          fontWeight: dense ? 700 : headWeight,
          fontStyle: dense ? "normal" : headStyle,
          textTransform: dense ? "none" : headTransform,
          letterSpacing: dense ? 0 : (headTransform === "uppercase" ? "0.01em" : 0),
          color: labelColor, lineHeight: 1.3,
        }}>{data.label}</div>
        {data.desc && <div style={{ marginTop: 3, fontSize: dense ? "0.78rem" : "0.86rem", color: descColor, lineHeight: 1.5 }}>{data.desc}</div>}
      </div>
    </div>
  );
}

function IconListPage() {
  const item = (window.AGGIE_CATALOG || []).find(c => c.id === "icon-list");
  return (
    <PageShell item={item}>
      <ILIntro>
        Icon lists are the tighter cousin of icon-features — vertical, scannable, sized for sidebars and split-feature columns. Two flavors: a <em>contact-style dense list</em> for utility info (phone, email, address) and a <em>feature-style list</em> with descriptive copy under each label.
      </ILIntro>

      <ILSectionLabel>contact-style · dense · default</ILSectionLabel>
      <ILBox label="list · contact · dense · default">
        <div style={{ maxWidth: 520 }}>
          <ILSectionHead style="default" eyebrow="Get in touch" title="Headquarters" />
          <div style={{ marginTop: 8 }}>
            {ICON_LIST_DATA.map((d, i) => <ILRow key={i} data={d} style="default" dark={false} dense />)}
          </div>
        </div>
      </ILBox>

      <ILSectionLabel>feature-style · with descriptions · bold</ILSectionLabel>
      <ILBox label="list · feature · bold">
        <div style={{ maxWidth: 640 }}>
          <ILSectionHead style="bold" eyebrow="Why TTI" title="Built for scale" />
          <div style={{ marginTop: 8 }}>
            {ICON_LIST_FEATURES.map((d, i) => <ILRow key={i} data={d} style="bold" dark={false} />)}
          </div>
        </div>
      </ILBox>

      <ILSectionLabel>feature-style · elegant</ILSectionLabel>
      <ILBox label="list · feature · elegant">
        <div style={{ maxWidth: 640 }}>
          <ILSectionHead style="elegant" eyebrow="At a glance" title="Our practice, in brief" />
          <div style={{ marginTop: 8 }}>
            {ICON_LIST_FEATURES.slice(0, 3).map((d, i) => <ILRow key={i} data={d} style="elegant" dark={false} />)}
          </div>
        </div>
      </ILBox>

      <ILSectionLabel>contact-style · on dark</ILSectionLabel>
      <ILBox dark label="list · contact · dense · on dark">
        <div style={{ maxWidth: 520 }}>
          <ILSectionHead style="default" dark eyebrow="Get in touch" title="Headquarters" />
          <div style={{ marginTop: 8 }}>
            {ICON_LIST_DATA.map((d, i) => <ILRow key={i} data={d} style="default" dark={true} dense />)}
          </div>
        </div>
      </ILBox>

      <ILSpecRow>
        <ILSpec label="row height"  value="dense / regular" note="Dense for utility info; regular when descriptions are present." />
        <ILSpec label="icon box"    value="36 / 44px"        note="Tinted brand-tint background, brand color icon stroke." />
        <ILSpec label="label face"  value="varies by style"  note="Dense rows always Work Sans 700, regardless of style." />
        <ILSpec label="separator"   value="1px hairline"     note="Border-bottom on each row; last row drops the rule via :last-child." />
      </ILSpecRow>
    </PageShell>
  );
}

// ════════════════════════════════════════════════════════════════════════
// Link List Collections
// Grouped resource lists. Title + arrow rows; multiple groups side by side.
// ════════════════════════════════════════════════════════════════════════

const LINK_GROUPS = [
  {
    title: "For sponsors",
    links: [
      { label: "Active research portfolio", note: "PDF · 2.4 MB" },
      { label: "How we structure projects" },
      { label: "Reporting standards & deliverables" },
      { label: "Cost-share calculator", note: "Tool" },
    ],
  },
  {
    title: "For the public",
    links: [
      { label: "Pressroom and recent coverage" },
      { label: "Public records and FOIA" },
      { label: "Visit Riverside Campus" },
      { label: "Crash-test footage archive" },
    ],
  },
  {
    title: "For researchers",
    links: [
      { label: "Author guidelines" },
      { label: "Submit to TTI Annual Report" },
      { label: "Data sharing policy", note: "Updated 2025" },
      { label: "Internal grant programs" },
    ],
  },
];

function LLRow({ link, style, dark }) {
  const linkColor = dark ? "white" : "var(--text-primary)";
  const hoverColor = "var(--brand-primary)";
  const noteColor = dark ? "rgba(255,255,255,0.65)" : "var(--text-muted)";
  return (
    <a href="#" onClick={(e) => e.preventDefault()} style={{
      display: "grid", gridTemplateColumns: "1fr auto", alignItems: "baseline", gap: 14,
      padding: "13px 0",
      borderBottom: dark ? "1px solid rgba(255,255,255,0.14)" : "1px solid var(--surface-border)",
      color: linkColor, textDecoration: "none",
      transition: "color 120ms ease",
    }}
    onMouseEnter={(e) => { if (!dark) e.currentTarget.style.color = hoverColor; }}
    onMouseLeave={(e) => { if (!dark) e.currentTarget.style.color = linkColor; }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
        <span style={{ fontSize: "0.95rem", fontWeight: 500, lineHeight: 1.35 }}>{link.label}</span>
        {link.note && <span style={{ fontSize: "0.72rem", fontFamily: "var(--font-mono)", color: noteColor }}>{link.note}</span>}
      </div>
      <span aria-hidden style={{ fontSize: "1rem", opacity: 0.7, marginLeft: "auto" }}>→</span>
    </a>
  );
}

function LLGroup({ group, style, dark }) {
  const headFamily = style === "bold" ? "var(--font-body-bold)"
                   : style === "elegant" ? "var(--font-elegant, Georgia, serif)"
                   : "var(--font-display)";
  const headTransform = style === "bold" || style === "elegant" ? "none" : "uppercase";
  const headStyle = style === "elegant" ? "italic" : "normal";
  const headWeight = style === "bold" ? 700 : 500;
  const headColor = dark ? "white" : "var(--text-primary)";

  return (
    <div>
      <h4 style={{
        margin: "0 0 6px",
        fontFamily: headFamily, fontSize: "1.15rem",
        fontWeight: headWeight, fontStyle: headStyle,
        textTransform: headTransform,
        letterSpacing: headTransform === "uppercase" ? "0.01em" : 0,
        color: headColor, lineHeight: 1.2,
      }}>{group.title}</h4>
      <ILSig style={style} dark={dark} width={62} />
      <div style={{ marginTop: 10 }}>
        {group.links.map((l, i) => <LLRow key={i} link={l} style={style} dark={dark} />)}
      </div>
    </div>
  );
}

function LinkListPage() {
  const item = (window.AGGIE_CATALOG || []).find(c => c.id === "link-list");
  return (
    <PageShell item={item}>
      <ILIntro>
        Link lists are the editorial answer to "where do I go for X?" — grouped by audience, each row a clean text link with optional file/format notation. Group headings carry the section signature; rows use a hairline separator with a right-arrow affordance.
      </ILIntro>

      <ILSectionLabel>3-up groups · default</ILSectionLabel>
      <ILBox label="link-list · 3 groups · default">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 36 }}>
          {LINK_GROUPS.map((g, i) => <LLGroup key={i} group={g} style="default" dark={false} />)}
        </div>
      </ILBox>

      <ILSectionLabel>3-up groups · bold</ILSectionLabel>
      <ILBox label="link-list · 3 groups · bold">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 36 }}>
          {LINK_GROUPS.map((g, i) => <LLGroup key={i} group={g} style="bold" dark={false} />)}
        </div>
      </ILBox>

      <ILSectionLabel>2-up groups · elegant</ILSectionLabel>
      <ILBox label="link-list · 2 groups · elegant">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 48 }}>
          {LINK_GROUPS.slice(0, 2).map((g, i) => <LLGroup key={i} group={g} style="elegant" dark={false} />)}
        </div>
      </ILBox>

      <ILSectionLabel>3-up groups · on dark · default</ILSectionLabel>
      <ILBox dark label="link-list · 3 groups · on dark · default">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 36 }}>
          {LINK_GROUPS.map((g, i) => <LLGroup key={i} group={g} style="default" dark={true} />)}
        </div>
      </ILBox>

      <ILSpecRow>
        <ILSpec label="groups"     value="2 · 3 · 4-up"   note="3 is the canonical layout; 4 only at full-width." />
        <ILSpec label="row"        value="link · → · note" note="Right-arrow affordance always; secondary note as monospace caption." />
        <ILSpec label="hover"      value="brand color"   note="Light theme only — on dark stays white to avoid contrast loss." />
        <ILSpec label="separator"  value="1px hairline"   note="Border-bottom on each row including last (visual closure)." />
        <ILSpec label="lineage"    value="SharePoint Quick-Links Compact/List" note="Anatomy only · TUX type and color" />
      </ILSpecRow>
    </PageShell>
  );
}

// ════════════════════════════════════════════════════════════════════════
// Link Slab
// Full-width band of inline links, on a colored background.
// ════════════════════════════════════════════════════════════════════════

const SLAB_LINKS = [
  "Mobility planning",
  "Safety research",
  "Connected vehicles",
  "Resilient corridors",
  "Workforce development",
  "Center for transportation safety",
  "Texas A&M Transportation Institute",
];

function LSItem({ children, dark }) {
  const c = dark ? "white" : "var(--brand-primary)";
  return (
    <a href="#" onClick={(e) => e.preventDefault()} style={{
      fontFamily: "var(--font-body-bold)",
      fontSize: "0.78rem", fontWeight: 700,
      letterSpacing: "0.1em", textTransform: "uppercase",
      color: c, textDecoration: "none",
      display: "inline-flex", alignItems: "center", gap: 8,
      padding: "8px 0",
      whiteSpace: "nowrap",
    }}>
      {children}
      <span aria-hidden style={{ fontSize: "0.85em", opacity: 0.7 }}>→</span>
    </a>
  );
}

function LinkSlab({ style, dark, eyebrow, title }) {
  const bg = dark ? "var(--brand-primary)" : "color-mix(in srgb, var(--brand-primary) 6%, transparent)";
  const borderTop = dark ? "none" : "1px solid var(--surface-border)";
  const borderBottom = dark ? "none" : "1px solid var(--surface-border)";

  return (
    <div style={{
      background: bg,
      borderTop, borderBottom,
      padding: "32px 36px",
      margin: "0 -32px", /* break out of NCBox padding */
    }}>
      <div style={{ display: "grid", gridTemplateColumns: "minmax(180px, auto) 1fr", gap: 36, alignItems: "center" }}>
        <div>
          <div style={{
            fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase",
            color: dark ? "rgba(255,255,255,0.7)" : "var(--text-muted)",
            fontFamily: "var(--font-body-bold)", marginBottom: 6,
          }}>{eyebrow}</div>
          <div style={{
            fontFamily: style === "bold" ? "var(--font-body-bold)" : style === "elegant" ? "var(--font-elegant, Georgia, serif)" : "var(--font-display)",
            fontSize: "1.25rem",
            fontWeight: style === "bold" ? 700 : 500,
            fontStyle: style === "elegant" ? "italic" : "normal",
            textTransform: style === "default" ? "uppercase" : "none",
            letterSpacing: style === "default" ? "0.01em" : 0,
            color: dark ? "white" : "var(--text-primary)",
            lineHeight: 1.15,
          }}>{title}</div>
          <div style={{ marginTop: 10 }}>
            <ILSig style={style} dark={dark} width={70} />
          </div>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 28px", justifyContent: "flex-end" }}>
          {SLAB_LINKS.map((l, i) => <LSItem key={i} dark={dark}>{l}</LSItem>)}
        </div>
      </div>
    </div>
  );
}

function LinkSlabPage() {
  const item = (window.AGGIE_CATALOG || []).find(c => c.id === "link-slab");
  return (
    <PageShell item={item}>
      <ILIntro>
        A link slab is the full-width footer-of-section nav — "in this section" or "explore further" — laid out as a single horizontal band over a tinted or branded background. Title sits left, links flow right with a small arrow on each. Use as a section break before the page footer.
      </ILIntro>

      <ILSectionLabel>tinted · default</ILSectionLabel>
      <ILBox label="slab · tinted · default" padded={true}>
        <LinkSlab style="default" dark={false} eyebrow="In this section" title="Explore our research" />
      </ILBox>

      <ILSectionLabel>tinted · bold</ILSectionLabel>
      <ILBox label="slab · tinted · bold" padded={true}>
        <LinkSlab style="bold" dark={false} eyebrow="In this section" title="Where the work goes next" />
      </ILBox>

      <ILSectionLabel>tinted · elegant</ILSectionLabel>
      <ILBox label="slab · tinted · elegant" padded={true}>
        <LinkSlab style="elegant" dark={false} eyebrow="In this section" title="Continue exploring" />
      </ILBox>

      <ILSectionLabel>brand-primary · on dark · default</ILSectionLabel>
      <ILBox dark label="slab · maroon · on dark · default" padded={true}>
        <LinkSlab style="default" dark={true} eyebrow="In this section" title="Explore our research" />
      </ILBox>

      <ILSpecRow>
        <ILSpec label="bg" value="tinted / maroon" note="Light: brand-primary @ 6% over surface. Dark: solid brand-primary." />
        <ILSpec label="links" value="Work Sans 700" note="Always uppercase, 0.78rem, with a trailing arrow." />
        <ILSpec label="layout" value="title L · links R" note="Two-column grid; links flex-wrap and right-align." />
        <ILSpec label="position" value="end of section" note="Sits between page body and global footer." />
        <ILSpec label="lineage" value="SharePoint Quick-Links Button/Filmstrip" note="Anatomy only · TUX type and color" />
      </ILSpecRow>
    </PageShell>
  );
}

// ════════════════════════════════════════════════════════════════════════
// Export
// ════════════════════════════════════════════════════════════════════════
Object.assign(window, {
  IconFeaturePage,
  IconListPage,
  LinkListPage,
  LinkSlabPage,
});
