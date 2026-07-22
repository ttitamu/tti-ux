/* global React, PageShell, AGGIE_CATALOG, LucideIcon */
/*
 * AggieDataDisplay.jsx — Batch 11: Data display.
 *
 *   Description list — collection of icon-led TERM/DEFINITION cards laid
 *                      out in a flex-wrap row. Variant axes (per Figma 1.7):
 *                      • Number of Cards 2 / 3 / 4 / 5 / 6
 *                      • Has Section Intro true / false
 *                      • Has Wrap Divider  true / false  (3px dashed dot rule)
 *                      • Show Icon         true / false
 *                      • Has CTA           true / false
 *                      • Style             default / bold / elegant
 *                      • Dark mode         true / false
 *                      Card dims 368×133, 24px gap.
 *                      Term:  Work Sans 700 24/33 — brand primary maroon.
 *                      Def:   Open Sans 16/24 — black.
 *
 *   Tables           — semantic <table> with 270-px wide × 56-px tall cells,
 *                      2px borders, 16px padding (per Figma 1.7).
 *                      Cell types: default / col header / row header / zebra / sortable.
 *                      Style variants:
 *                        default → black borders, Open Sans body
 *                        bold    → gray  borders, Work Sans body, gray col-header bg
 *                        elegant → "Slim" — no body borders, 1px header rules
 *                      Captions:  none / top-large (20px Open Sans) / bottom-small.
 *                      Optional: row header column, sortable col headers, zebra rows.
 *
 * Helper prefix: DD (DataDisplay). Prefixed to avoid Babel cross-file collisions.
 */

// ════════════════════════════════════════════════════════════════════════
// Shared helpers (DD prefix)
// ════════════════════════════════════════════════════════════════════════

function DDBox({ dark = false, label, padded = true, children }) {
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

function DDSectionLabel({ children }) {
  return (
    <div style={{ fontSize: "0.62rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--text-muted)", fontFamily: "var(--font-body-bold)", marginBottom: 12, marginTop: 16 }}>{children}</div>
  );
}

function DDSpecRow({ children }) {
  return (
    <div style={{ marginTop: 28, padding: "14px 18px", border: "1px solid var(--surface-border)", borderRadius: "var(--radius-md)", background: "var(--surface-raised)", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>{children}</div>
  );
}

function DDSpec({ label, value, note }) {
  return (
    <div>
      <div style={{ fontSize: "0.6rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-muted)", fontFamily: "var(--font-body-bold)" }}>{label}</div>
      <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem", color: "var(--brand-primary)", marginTop: 3, fontWeight: 500 }}>{value}</div>
      {note && <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: 2, lineHeight: 1.4 }}>{note}</div>}
    </div>
  );
}

function DDIntro({ children }) {
  return (
    <div style={{ padding: "16px 20px", marginBottom: 28, background: "color-mix(in srgb, var(--brand-primary) 5%, transparent)", borderLeft: "3px solid var(--brand-primary)", borderRadius: "0 var(--radius-sm) var(--radius-sm) 0", fontSize: "0.92rem", lineHeight: 1.65, color: "var(--text-secondary)" }}>
      {children}
    </div>
  );
}

// 3px dashed dot rule used as the section-wrap divider (matches Figma DividerTypeDotsColorLight)
function DDDottedRule({ dark }) {
  const c = dark ? "rgba(255,255,255,0.55)" : "rgb(209,209,209)";
  return (
    <div style={{
      width: "100%", height: 0,
      borderTop: `3px dashed ${c}`,
      marginBottom: 32,
    }} />
  );
}

// ── Section intro: kicker + heading. Style-switched per variant.
function DDSectionIntro({ style, dark, kicker, title, lede }) {
  const titleColor = dark ? "#fff" : "var(--text-primary)";
  const ledeColor = dark ? "rgba(255,255,255,0.86)" : "var(--text-secondary)";
  const kickerColor = dark ? "rgba(255,255,255,0.7)" : "var(--text-muted)";

  let titleStyle;
  if (style === "bold") {
    titleStyle = { fontFamily: "var(--font-body-bold)", fontWeight: 700, fontStyle: "italic", textTransform: "uppercase", letterSpacing: "0.01em", fontSize: "1.5rem", lineHeight: 1.15 };
  } else if (style === "elegant") {
    titleStyle = { fontFamily: "var(--font-elegant, Georgia, serif)", fontWeight: 400, fontStyle: "italic", textTransform: "uppercase", letterSpacing: "-0.005em", fontSize: "1.6rem", lineHeight: 1.15 };
  } else {
    titleStyle = { fontFamily: "var(--font-display)", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.01em", fontSize: "1.45rem", lineHeight: 1.15 };
  }

  return (
    <div style={{ marginBottom: 28, maxWidth: 720 }}>
      {kicker && (
        <div style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: kickerColor, fontFamily: "var(--font-body-bold)", marginBottom: 6 }}>{kicker}</div>
      )}
      <h3 style={{ ...titleStyle, color: titleColor, margin: 0 }}>{title}</h3>
      {lede && <p style={{ margin: "10px 0 0", fontSize: "0.95rem", lineHeight: 1.55, color: ledeColor }}>{lede}</p>}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════
// Description list
// ════════════════════════════════════════════════════════════════════════
//
// Per Figma: each "Description List Item" is a 368×133 card with:
//   • optional 24×24 icon at left
//   • Term:  Work Sans 700 24/33 — TTI maroon (rgb(115,47,47))
//   • Def:   Open Sans regular 16/24 — black
//   • optional CTA link below def
// Cards are flex-wrapped in rows; the SECTION grid below holds a fixed
// number of cards (2/3/4/5/6) so the whole section fits cleanly on one
// or two rows.

const DL_DATA_EVENT = [
  { icon: "calendar",  term: "Date & time",       def: "Thursday, May 14, 2026 · 9:00 a.m. – 4:30 p.m. CDT" },
  { icon: "map-pin",   term: "Location",          def: "TTI Headquarters, Bryan-College Station Conference Center, Room 240" },
  { icon: "users",     term: "Audience",          def: "Transportation researchers, agency partners, graduate students" },
  { icon: "ticket",    term: "Cost",              def: "Free; registration required by May 7", cta: "Register" },
];

const DL_DATA_PUB = [
  { icon: "user",          term: "Authors",           def: "L. Patel, R. Okafor, M. Chen, S. Vasquez" },
  { icon: "building-2",    term: "Sponsor",           def: "Texas Department of Transportation (TxDOT)" },
  { icon: "hash",          term: "Project number",    def: "0-7142-R3" },
  { icon: "file-text",     term: "Length",            def: "184 pages · 12 figures · 28 references" },
  { icon: "calendar-days", term: "Publication date",  def: "March 2026" },
  { icon: "link",          term: "DOI",               def: "10.5555/tti.0-7142-R3", cta: "Open in repository" },
];

const DL_DATA_SPEC = [
  { icon: "truck",      term: "Vehicle class",     def: "Class 8 tractor-trailer (FHWA classification)" },
  { icon: "gauge",      term: "Test speed range",  def: "30 – 65 mph in 5-mph increments" },
  { icon: "scan-line",  term: "Sensor count",      def: "12× LiDAR · 6× radar · 4× camera" },
  { icon: "activity",   term: "Sample rate",       def: "100 Hz across all channels" },
  { icon: "route",      term: "Test track",        def: "1.5 mi closed loop · TTI Riverside Campus" },
  { icon: "thermometer", term: "Surface & ambient", def: "Dry asphalt · 78–82 °F · winds < 5 mph" },
];

// 24×24 icon glyph — placeholder square w/ lucide-like outline.
function DDIcon({ name, dark, color }) {
  const c = color || (dark ? "rgba(255,255,255,0.95)" : "var(--brand-primary)");
  if (typeof window !== "undefined" && window.LucideIcon) {
    return <LucideIcon name={name} size={24} color={c} strokeWidth={1.6} />;
  }
  return (
    <div style={{ width: 24, height: 24, border: `1.6px solid ${c}`, borderRadius: 4 }} />
  );
}

// One 368×133-ish description card. Figma exact, but with min-content height
// so longer copy doesn't clip.
function DDListItem({ row, style, dark, showIcon }) {
  // Figma: term is rgb(115,47,47) — that IS our brand primary maroon (#732F2F-ish)
  const termColor = dark ? "rgba(255,255,255,0.96)" : "var(--brand-primary)";
  const defColor  = dark ? "rgba(255,255,255,0.85)" : "var(--text-primary)";
  const ctaColor  = dark ? "rgba(255,255,255,0.95)" : "var(--brand-primary)";

  // Per-style term typography
  let termStyle;
  if (style === "bold") {
    termStyle = { fontFamily: "var(--font-body-bold)", fontWeight: 700, fontSize: 22, lineHeight: "30px", textTransform: "uppercase", letterSpacing: "0.02em" };
  } else if (style === "elegant") {
    termStyle = { fontFamily: "var(--font-elegant, Georgia, serif)", fontWeight: 400, fontStyle: "italic", fontSize: 24, lineHeight: "32px", letterSpacing: "-0.005em" };
  } else {
    // Default — exact Figma: Work Sans 700 24/33
    termStyle = { fontFamily: "var(--font-body-bold)", fontWeight: 700, fontSize: 24, lineHeight: "33px" };
  }

  return (
    <div style={{
      flex: "1 1 280px",
      minWidth: 0,
      display: "flex",
      flexDirection: "row",
      gap: 14,
      padding: "4px 0",
    }}>
      {showIcon && (
        <div style={{ flex: "0 0 28px", paddingTop: 4 }}>
          <DDIcon name={row.icon || "circle"} dark={dark} />
        </div>
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ ...termStyle, color: termColor, margin: 0 }}>{row.term}</div>
        <div style={{
          marginTop: 4,
          fontFamily: "var(--font-body)",
          fontSize: 16,
          lineHeight: "24px",
          color: defColor,
        }}>
          {row.def}
        </div>
        {row.cta && (
          <a href="#" onClick={(e) => e.preventDefault()} style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            marginTop: 8,
            fontFamily: "var(--font-body-bold)",
            fontWeight: 700, fontSize: 13,
            letterSpacing: "0.08em", textTransform: "uppercase",
            color: ctaColor, textDecoration: "none",
            borderBottom: `1px solid ${ctaColor}`,
            paddingBottom: 1,
          }}>
            {row.cta}
            <span aria-hidden style={{ fontSize: 14, lineHeight: 1 }}>→</span>
          </a>
        )}
      </div>
    </div>
  );
}

// Section: a flex-wrap row of N cards.
function DescriptionListSection({ rows, style, dark, showIcon = true, hasDivider = false, hasIntro = true, kicker, title, lede }) {
  return (
    <div>
      {hasDivider && <DDDottedRule dark={dark} />}
      {hasIntro && <DDSectionIntro style={style} dark={dark} kicker={kicker} title={title} lede={lede} />}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        columnGap: 24,
        rowGap: 28,
      }}>
        {rows.map((r, i) => (
          <DDListItem key={i} row={r} style={style} dark={dark} showIcon={showIcon} />
        ))}
      </div>
    </div>
  );
}

// ── Description list page
function DescriptionListPage() {
  const item = (window.AGGIE_CATALOG || []).find(c => c.id === "description-list");

  return (
    <PageShell item={item}>
      <DDIntro>
        Per AggieUX 1.7, a description list is a <em>collection of icon-led term/definition cards</em>, not a vertical key-value table. Cards (368&nbsp;×&nbsp;133 in source) flex-wrap in rows of 2, 3, 4, 5, or 6. Each card has an optional 24-px icon, a Work&nbsp;Sans-700 term in TTI maroon, an Open&nbsp;Sans definition, and an optional CTA. The whole section gets an optional intro block and an optional dashed dot rule above.
      </DDIntro>

      {/* ───────── 2-up · with intro · default · light ───────── */}
      <DDSectionLabel>2 cards · has section intro · default · light</DDSectionLabel>
      <DDBox label="Style=Default · Cards=2 · Intro=true · Divider=false">
        <DescriptionListSection
          rows={DL_DATA_EVENT.slice(0, 2)}
          style="default"
          kicker="upcoming workshop"
          title="Connected freight corridor planning"
          lede="A working session for state DOTs, MPOs, and freight industry partners. Two-day format, hands-on planning exercises, signed minutes for the I-35 corridor study."
        />
      </DDBox>

      {/* ───────── 3-up · with intro · default · light ───────── */}
      <DDSectionLabel>3 cards · has section intro · default · light</DDSectionLabel>
      <DDBox label="Style=Default · Cards=3 · Intro=true · Divider=false">
        <DescriptionListSection
          rows={DL_DATA_EVENT.slice(0, 3)}
          style="default"
          kicker="upcoming workshop"
          title="Connected freight corridor planning"
          lede="A working session for state DOTs, MPOs, and freight industry partners."
        />
      </DDBox>

      {/* ───────── 4-up · with intro + dashed divider · default · light ───────── */}
      <DDSectionLabel>4 cards · with intro + section-wrap divider · default · light</DDSectionLabel>
      <DDBox label="Style=Default · Cards=4 · Intro=true · Divider=true">
        <DescriptionListSection
          rows={DL_DATA_EVENT}
          style="default"
          hasDivider
          kicker="upcoming workshop"
          title="Connected freight corridor planning"
          lede="A working session for state DOTs, MPOs, and freight industry partners."
        />
      </DDBox>

      {/* ───────── 4-up · no intro, no icons · default · light ───────── */}
      <DDSectionLabel>4 cards · no intro · no icons · default · light</DDSectionLabel>
      <DDBox label="Style=Default · Cards=4 · Intro=false · Show Icon=false">
        <DescriptionListSection
          rows={DL_DATA_EVENT}
          style="default"
          hasIntro={false}
          showIcon={false}
        />
      </DDBox>

      {/* ───────── 6-up · publication metadata · default · light ───────── */}
      <DDSectionLabel>6 cards · publication metadata · default · light</DDSectionLabel>
      <DDBox label="Style=Default · Cards=6 · Intro=true · Divider=true">
        <DescriptionListSection
          rows={DL_DATA_PUB}
          style="default"
          hasDivider
          kicker="publication"
          title="Heavy-vehicle braking benchmarks: 2026 update"
          lede="Final report for TxDOT project 0-7142, including instrumentation appendix and BibTeX export."
        />
      </DDBox>

      {/* ───────── Bold · 5-up · spec sheet ───────── */}
      <DDSectionLabel>5 cards · bold variant — uppercase italic terms</DDSectionLabel>
      <DDBox label="Style=Bold · Cards=5 · Intro=true · Divider=true">
        <DescriptionListSection
          rows={DL_DATA_SPEC.slice(0, 5)}
          style="bold"
          hasDivider
          kicker="test parameters"
          title="Class 8 LiDAR / radar test rig"
          lede="Configuration documented for Heavy-Vehicle Braking Benchmarks, FY 2026."
        />
      </DDBox>

      {/* ───────── Elegant · 6-up · spec sheet ───────── */}
      <DDSectionLabel>6 cards · elegant variant — italic-serif terms</DDSectionLabel>
      <DDBox label="Style=Elegant · Cards=6 · Intro=true · Divider=true">
        <DescriptionListSection
          rows={DL_DATA_SPEC}
          style="elegant"
          hasDivider
          kicker="test parameters"
          title="Class 8 LiDAR / radar test rig"
          lede="Configuration documented for Heavy-Vehicle Braking Benchmarks, FY 2026."
        />
      </DDBox>

      {/* ───────── On dark ───────── */}
      <DDSectionLabel>on dark</DDSectionLabel>
      <DDBox dark label="Style=Default · Cards=4 · Intro=true · Dark mode=true">
        <DescriptionListSection
          rows={DL_DATA_EVENT}
          style="default"
          dark
          kicker="upcoming workshop"
          title="Connected freight corridor planning"
          lede="A working session for state DOTs, MPOs, and freight industry partners."
        />
      </DDBox>

      <DDBox dark label="Style=Bold · Cards=6 · Dark mode=true">
        <DescriptionListSection
          rows={DL_DATA_PUB}
          style="bold"
          dark
          hasDivider
          kicker="publication"
          title="Heavy-vehicle braking benchmarks: 2026 update"
          lede="Final report for TxDOT project 0-7142."
        />
      </DDBox>

      <DDSpecRow>
        <DDSpec label="card dims" value="368 × 133 (Figma source)" note="Implementation here is fluid; min-width 280px, flex-wraps." />
        <DDSpec label="term type" value="Work Sans 700 · 24 / 33" note="Color: TTI maroon rgb(115,47,47) — i.e. our --brand-primary." />
        <DDSpec label="def type" value="Open Sans 400 · 16 / 24" note="Default black; --text-primary in our system." />
        <DDSpec label="section axes" value="cards · intro · divider · icon · CTA · style · dark" note="All independently togglable per Figma 1.7 component variants." />
      </DDSpecRow>
    </PageShell>
  );
}

// ════════════════════════════════════════════════════════════════════════
// Tables
// ════════════════════════════════════════════════════════════════════════
//
// Per Figma: each cell is 270×56 with 16px padding all around. Body text is
// Open Sans 16/24. Cell flavors:
//   • Default body cell:    bg #fff, border 2px solid #000  (default style)
//                           bg #fff, border 2px solid #A7A7A7  (Style 2/bold — Work Sans body)
//                           bg #fff, no border  (Style "Slim" — elegant)
//   • Column header:        Open Sans 700, bg #fff w/ 2px black border (default)
//                           bg #EAEAEA w/ 2px gray border (Style 2 — Work Sans 700)
//                           bg #fff w/ 1px black border (Slim — elegant)
//   • Row header:           Open Sans 700, bg #EAEAEA, border 2px #A7A7A7
//   • Zebra alt-row:        same border as default but differentiates per style
//   • Sortable col header:  default-style header w/ a leading sort glyph
//
// Per Figma: caption is "Top/Large" (Open Sans 20/30 #3E3E3E, with 16px bottom
// padding) or "Bottom/Small" (Open Sans 14, lighter, top padding) or none.

const TBL_PROJECTS = {
  caption: "Active TTI research projects, FY 2026 (selected)",
  cols: [
    { label: "Project no.",  align: "left",  sortable: false },
    { label: "Title",        align: "left",  sortable: true,  sortDir: "desc" },
    { label: "Sponsor",      align: "left",  sortable: false },
    { label: "PI",           align: "left",  sortable: false },
    { label: "Status",       align: "left",  sortable: false },
  ],
  rowHeaderCol: 0,
  rows: [
    ["0-7142-R3", "Heavy-vehicle braking benchmarks",            "TxDOT",         "Patel, L.",     "Active"],
    ["0-7188-01", "Connected freight corridor signal coord.",    "TxDOT / FHWA",  "Okafor, R.",    "Reporting"],
    ["6-7301-R1", "Rural roadway departure mitigation",          "FHWA",          "Chen, M.",      "Active"],
    ["7-7409",    "Pedestrian safety in school zones",           "TxDOT",         "Vasquez, S.",   "Kickoff"],
    ["0-7512",    "EV freight charging infrastructure",          "TxDOT",         "Hartwell, J.",  "Active"],
  ],
};

const TBL_DATA = {
  caption: "Stopping distance by speed and surface — Class 8 tractor-trailer",
  captionPosition: "top",
  cols: [
    { label: "Speed (mph)",          align: "right", sortable: false },
    { label: "Dry asphalt (ft)",     align: "right", sortable: true,  sortDir: "asc" },
    { label: "Wet asphalt (ft)",     align: "right", sortable: false },
    { label: "Loose gravel (ft)",    align: "right", sortable: false },
    { label: "Δ vs. 2024 baseline",  align: "right", sortable: false },
  ],
  rowHeaderCol: 0,
  rows: [
    ["30", "112", "148", "182", "−6.1%"],
    ["40", "176", "232", "294", "−5.4%"],
    ["50", "258", "338", "438", "−4.8%"],
    ["55", "303", "398", "521", "−4.2%"],
    ["65", "405", "532", "712", "−3.6%"],
  ],
};

// Per-style cell flavors (matches Figma)
function ddCellFlavor(style, dark) {
  // We adapt the Figma colors to our token palette so dark mode works,
  // but keep the *structural* differences between styles intact.
  if (style === "bold") {
    return {
      bodyBorder: dark ? "1px solid rgba(255,255,255,0.35)" : "2px solid #A7A7A7",
      headerBorder: dark ? "1px solid rgba(255,255,255,0.5)" : "2px solid #A7A7A7",
      headerBg: dark ? "rgba(255,255,255,0.08)" : "#EAEAEA",
      rowHeaderBg: dark ? "rgba(255,255,255,0.08)" : "#EAEAEA",
      rowHeaderBorder: dark ? "1px solid rgba(255,255,255,0.5)" : "2px solid #A7A7A7",
      bodyFont: "var(--font-body-bold)",
      headerFont: "var(--font-body-bold)",
      headerWeight: 700,
      headerFontStyle: "normal",
      headerTransform: "uppercase",
      headerLetter: "0.04em",
      bodyWeight: 400,
    };
  }
  if (style === "elegant") {
    return {
      bodyBorder: "none",
      headerBorder: dark ? "1px solid rgba(255,255,255,0.5)" : "1px solid #000",
      headerBg: "transparent",
      rowHeaderBg: "transparent",
      rowHeaderBorder: dark ? "1px solid rgba(255,255,255,0.5)" : "1px solid #000",
      bodyFont: "var(--font-body)",
      headerFont: "var(--font-elegant, Georgia, serif)",
      headerWeight: 400,
      headerFontStyle: "italic",
      headerTransform: "none",
      headerLetter: "-0.005em",
      bodyWeight: 400,
    };
  }
  // default
  return {
    bodyBorder: dark ? "1px solid rgba(255,255,255,0.5)" : "2px solid #000",
    headerBorder: dark ? "1px solid rgba(255,255,255,0.7)" : "2px solid #000",
    headerBg: dark ? "transparent" : "#fff",
    rowHeaderBg: dark ? "rgba(255,255,255,0.08)" : "#EAEAEA",
    rowHeaderBorder: dark ? "1px solid rgba(255,255,255,0.5)" : "2px solid #A7A7A7",
    bodyFont: "var(--font-body)",
    headerFont: "var(--font-body-bold)",
    headerWeight: 700,
    headerFontStyle: "normal",
    headerTransform: "none",
    headerLetter: "0",
    bodyWeight: 400,
  };
}

function DDTable({
  data,
  style = "default",
  dark = false,
  zebra = false,
  showColHeader = true,
  showRowHeader = false,
  captionPosition,
}) {
  const f = ddCellFlavor(style, dark);
  const textColor = dark ? "#fff" : "#000";
  const captionColor = dark ? "rgba(255,255,255,0.85)" : "rgb(62,62,62)";
  const zebraBg = dark ? "rgba(255,255,255,0.04)" : "color-mix(in srgb, var(--brand-primary) 4%, transparent)";

  // Caption position (top-large by default if data.caption provided; can override)
  const cap = data.caption;
  const capPos = captionPosition || data.captionPosition || (cap ? "top" : "none");

  const renderCaption = (pos) => {
    if (!cap || capPos !== pos) return null;
    if (pos === "top") {
      return (
        <caption style={{
          captionSide: "top", textAlign: "left",
          fontFamily: "var(--font-body)", fontSize: 20, lineHeight: "30px",
          color: captionColor, paddingBottom: 16,
        }}>
          {cap}
        </caption>
      );
    }
    return (
      <caption style={{
        captionSide: "bottom", textAlign: "left",
        fontFamily: "var(--font-body)", fontSize: 14, lineHeight: "20px",
        color: captionColor, paddingTop: 12, fontStyle: "italic",
      }}>
        {cap}
      </caption>
    );
  };

  const sortGlyph = (dir) => dir === "asc" ? "▲" : dir === "desc" ? "▼" : "↕";

  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{
        width: "100%", borderCollapse: "collapse",
        color: textColor,
      }}>
        {capPos === "top" && renderCaption("top")}
        {showColHeader && (
          <thead>
            <tr>
              {data.cols.map((c, i) => (
                <th key={i} scope="col" style={{
                  height: 56, padding: "16px 16px",
                  textAlign: c.align || "left",
                  background: f.headerBg,
                  border: f.headerBorder,
                  fontFamily: f.headerFont,
                  fontWeight: f.headerWeight,
                  fontStyle: f.headerFontStyle,
                  fontSize: 16,
                  lineHeight: "24px",
                  letterSpacing: f.headerLetter,
                  textTransform: f.headerTransform,
                  color: textColor,
                  whiteSpace: "nowrap",
                  verticalAlign: "middle",
                }}>
                  {c.sortable ? (
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                      <span aria-hidden style={{ fontSize: 11, opacity: c.sortDir ? 0.95 : 0.5 }}>
                        {sortGlyph(c.sortDir)}
                      </span>
                      <span>{c.label}</span>
                    </span>
                  ) : c.label}
                </th>
              ))}
            </tr>
          </thead>
        )}
        <tbody>
          {data.rows.map((row, ri) => {
            const isZebra = zebra && ri % 2 === 1;
            return (
              <tr key={ri} style={{ background: isZebra ? zebraBg : "transparent" }}>
                {row.map((cell, ci) => {
                  const isRowHeader = showRowHeader && ci === (data.rowHeaderCol ?? 0);
                  const numericRight = data.cols[ci]?.align === "right";
                  const sharedCell = {
                    height: 56,
                    padding: "16px 16px",
                    textAlign: data.cols[ci]?.align || "left",
                    fontFamily: numericRight ? "var(--font-mono)" : f.bodyFont,
                    fontVariantNumeric: numericRight ? "tabular-nums" : "normal",
                    fontWeight: f.bodyWeight,
                    fontSize: 16,
                    lineHeight: "24px",
                    color: textColor,
                    verticalAlign: "middle",
                    whiteSpace: "nowrap",
                  };
                  if (isRowHeader) {
                    return (
                      <th key={ci} scope="row" style={{
                        ...sharedCell,
                        fontFamily: f.headerFont,
                        fontWeight: f.headerWeight === 700 ? 700 : 600,
                        fontStyle: f.headerFontStyle,
                        textTransform: f.headerTransform,
                        letterSpacing: f.headerLetter,
                        background: f.rowHeaderBg,
                        border: f.rowHeaderBorder,
                      }}>{cell}</th>
                    );
                  }
                  return (
                    <td key={ci} style={{
                      ...sharedCell,
                      border: f.bodyBorder,
                    }}>{cell}</td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
        {capPos === "bottom" && renderCaption("bottom")}
      </table>
    </div>
  );
}

function TablesPage() {
  const item = (window.AGGIE_CATALOG || []).find(c => c.id === "tables");

  return (
    <PageShell item={item}>
      <DDIntro>
        Editorial data tables — semantic <code>&lt;table&gt;</code> with a <code>&lt;caption&gt;</code> and <code>&lt;th scope&gt;</code> headers. Per AggieUX 1.7, cells run 270&nbsp;×&nbsp;56 with 16-px padding and Open&nbsp;Sans 16/24 body. Three style variants alter the structural treatment, not the typography rhythm: <strong>default</strong> uses 2-px black borders all around; <strong>bold</strong> swaps to gray borders with a Work&nbsp;Sans body and a tinted column header; <strong>elegant</strong> ("Slim") strips body borders down to 1-px header rules. Optional row headers, sortable column headers, zebra alternation, and top/bottom caption positions are all independent toggles.
      </DDIntro>

      {/* ───────── Default: plain → caption → row header → zebra ───────── */}
      <DDSectionLabel>default style — 2 px black borders, Open Sans body</DDSectionLabel>

      <DDBox label="Style=Default · No caption · No row header · No zebra">
        <DDTable data={{ ...TBL_PROJECTS, caption: null }} style="default" />
      </DDBox>

      <DDBox label="Style=Default · Caption=Top/Large · No row header">
        <DDTable data={TBL_PROJECTS} style="default" />
      </DDBox>

      <DDBox label="Style=Default · Caption=Top/Large · Row header (col 0) · Zebra">
        <DDTable data={TBL_PROJECTS} style="default" showRowHeader zebra />
      </DDBox>

      <DDBox label="Style=Default · Caption=Bottom/Small · Sortable col header">
        <DDTable data={{ ...TBL_PROJECTS, captionPosition: "bottom" }} style="default" />
      </DDBox>

      {/* ───────── Bold ───────── */}
      <DDSectionLabel>bold style — gray borders, Work Sans body, tinted header</DDSectionLabel>

      <DDBox label="Style=Bold · Caption=Top/Large · Zebra">
        <DDTable data={TBL_PROJECTS} style="bold" zebra />
      </DDBox>

      <DDBox label="Style=Bold · Caption=Top/Large · Row header · Zebra · Sortable">
        <DDTable data={TBL_PROJECTS} style="bold" showRowHeader zebra />
      </DDBox>

      {/* ───────── Elegant / Slim ───────── */}
      <DDSectionLabel>elegant style ("Slim") — italic-serif headers, no body borders</DDSectionLabel>

      <DDBox label="Style=Elegant · Caption=Top/Large · No row header">
        <DDTable data={TBL_PROJECTS} style="elegant" />
      </DDBox>

      <DDBox label="Style=Elegant · Caption=Top/Large · Row header · Zebra">
        <DDTable data={TBL_PROJECTS} style="elegant" showRowHeader zebra />
      </DDBox>

      {/* ───────── Numeric data ───────── */}
      <DDSectionLabel>numeric data — right-aligned monospace, tabular figures</DDSectionLabel>

      <DDBox label="Style=Default · Numeric · Sortable col · Zebra">
        <DDTable data={TBL_DATA} style="default" zebra />
      </DDBox>

      <DDBox label="Style=Bold · Numeric · Row header · Zebra">
        <DDTable data={TBL_DATA} style="bold" showRowHeader zebra />
      </DDBox>

      <DDBox label="Style=Elegant · Numeric · Caption=Bottom/Small">
        <DDTable data={{ ...TBL_DATA, captionPosition: "bottom" }} style="elegant" zebra />
      </DDBox>

      {/* ───────── On dark ───────── */}
      <DDSectionLabel>on dark</DDSectionLabel>

      <DDBox dark label="Style=Default · Caption=Top · Zebra · Dark mode=true">
        <DDTable data={TBL_PROJECTS} style="default" dark zebra />
      </DDBox>

      <DDBox dark label="Style=Bold · Numeric · Row header · Dark mode=true">
        <DDTable data={TBL_DATA} style="bold" dark showRowHeader zebra />
      </DDBox>

      <DDBox dark label="Style=Elegant · Caption=Bottom · Dark mode=true">
        <DDTable data={{ ...TBL_PROJECTS, captionPosition: "bottom" }} style="elegant" dark zebra />
      </DDBox>

      <DDSpecRow>
        <DDSpec label="cell dims" value="270 × 56 · 16 px padding" note="From Figma TableCell. Body cells fluid in our impl." />
        <DDSpec label="body type" value="Open Sans 16 / 24 · Work Sans on bold" note="Numeric cols: JetBrains Mono w/ tabular-nums." />
        <DDSpec label="default borders" value="2 px solid #000 (light) · 1 px white-translucent (dark)" note="Bold = #A7A7A7 · Elegant = no body border, 1 px header." />
        <DDSpec label="caption" value="Top/Large 20 / 30 · Bottom/Small 14 ital" note="Per Figma Caption Options variant." />
      </DDSpecRow>
    </PageShell>
  );
}

// ════════════════════════════════════════════════════════════════════════
// Export
// ════════════════════════════════════════════════════════════════════════

Object.assign(window, {
  DescriptionListPage,
  TablesPage,
});
