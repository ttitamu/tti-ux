/* global React, PageShell, AGGIE_CATALOG, LucideIcon */
/*
 * AggieDirectory.jsx — Batch 15: Alpha nav + Directory + Glossary.
 *
 *   Alpha nav  — A–Z jump strip. 26 letter buttons in one row, with
 *                "active" letters (those that have entries) bold + maroon
 *                and "empty" letters muted + non-clickable. Sticky-able.
 *
 *   Directory  — staff/people listing pattern. Combines alpha nav + a
 *                grid of person cards (image + name + role + dept +
 *                contact). Two density variants: compact (text-only) and
 *                photo (with portrait). Ships a "no results" empty state.
 *
 *   Glossary   — term/definition listing. Alpha nav at top + grouped
 *                section headers (giant letter) + dl rows underneath.
 *                Two layouts: 1-column (long defs) and 2-column (short
 *                defs).
 *
 * Helper prefix: DR (Directory).
 */

// ════════════════════════════════════════════════════════════════════════
// Shared helpers (DR prefix)
// ════════════════════════════════════════════════════════════════════════

function DRBox({ dark = false, label, padded = true, children }) {
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

function DRSectionLabel({ children }) {
  return (
    <div style={{ fontSize: "0.62rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--text-muted)", fontFamily: "var(--font-body-bold)", marginBottom: 12, marginTop: 16 }}>{children}</div>
  );
}

function DRSpecRow({ children }) {
  return (
    <div style={{ marginTop: 28, padding: "14px 18px", border: "1px solid var(--surface-border)", borderRadius: "var(--radius-md)", background: "var(--surface-raised)", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>{children}</div>
  );
}

function DRSpec({ label, value, note }) {
  return (
    <div>
      <div style={{ fontSize: "0.6rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-muted)", fontFamily: "var(--font-body-bold)" }}>{label}</div>
      <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem", color: "var(--brand-primary)", marginTop: 3, fontWeight: 500 }}>{value}</div>
      {note && <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: 2, lineHeight: 1.4 }}>{note}</div>}
    </div>
  );
}

function DRIntro({ children }) {
  return (
    <div style={{ padding: "16px 20px", marginBottom: 28, background: "color-mix(in srgb, var(--brand-primary) 5%, transparent)", borderLeft: "3px solid var(--brand-primary)", borderRadius: "0 var(--radius-sm) var(--radius-sm) 0", fontSize: "0.92rem", lineHeight: 1.65, color: "var(--text-secondary)" }}>
      {children}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════
// ALPHA NAV atom — used by Alpha-nav page itself + Directory + Glossary
// ════════════════════════════════════════════════════════════════════════

function DRAlphaNav({
  dark = false,
  active = "C",
  enabledLetters = null, // Set; null = all enabled
  showAll = true,
  size = "md",           // "sm" | "md" | "lg"
}) {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  const cell = size === "lg" ? 38 : size === "sm" ? 26 : 32;
  const fontSize = size === "lg" ? 16 : size === "sm" ? 12 : 14;

  return (
    <div style={{
      display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 0,
      padding: dark ? "12px 8px" : "10px 8px",
      borderTop: dark ? "1px solid rgba(255,255,255,0.15)" : "1px solid rgb(217,217,217)",
      borderBottom: dark ? "1px solid rgba(255,255,255,0.15)" : "1px solid rgb(217,217,217)",
      background: dark ? "rgba(0,0,0,0.18)" : "transparent",
    }}>
      {showAll && (
        <button style={{
          height: cell, padding: "0 12px", border: "none", background: "transparent",
          color: dark ? "rgba(255,255,255,0.8)" : "var(--text-secondary)",
          fontFamily: "var(--font-body-bold)", fontWeight: 700, fontStyle: "italic",
          fontSize: fontSize - 1, textTransform: "uppercase", letterSpacing: "0.08em", cursor: "pointer",
        }}>All</button>
      )}
      {letters.map((L) => {
        const isEnabled = enabledLetters ? enabledLetters.has(L) : true;
        const isActive = isEnabled && L === active;
        const fg = isActive
          ? (dark ? "#fff" : "var(--brand-primary)")
          : isEnabled
            ? (dark ? "rgba(255,255,255,0.9)" : "var(--text-primary)")
            : (dark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.25)");
        return (
          <button key={L} disabled={!isEnabled} style={{
            width: cell, height: cell, border: "none", background: "transparent",
            color: fg,
            fontFamily: "var(--font-body-bold)",
            fontWeight: isActive ? 700 : isEnabled ? 600 : 400,
            fontSize, cursor: isEnabled ? "pointer" : "default",
            textDecoration: isActive ? "underline" : "none",
            textUnderlineOffset: 4, textDecorationThickness: 2,
          }}>{L}</button>
        );
      })}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════
// ALPHA NAV PAGE
// ════════════════════════════════════════════════════════════════════════

function AlphaNavPage() {
  const item = (window.AGGIE_CATALOG || []).find(c => c.id === "alpha-nav");

  // some-letters-enabled set (typical real directory)
  const sparse = new Set("ABCEFHKLMNPRSTW".split(""));

  return (
    <PageShell item={item}>
      <DRIntro>
        <strong>Alpha nav</strong> — a 26-letter jump strip used by Directory and Glossary
        to bypass long alphabetic lists. Letters that have entries render as clickable;
        letters with zero entries render muted and disabled. The active selection is bold,
        maroon, and underlined. An optional <em>All</em> chip resets the filter. Three sizes
        (sm / md / lg) match the host page's vertical rhythm.
      </DRIntro>

      <DRSectionLabel>Default — all letters enabled</DRSectionLabel>
      <DRBox label="Light · medium · active = C" padded={false}>
        <div style={{ padding: "24px 32px" }}>
          <DRAlphaNav active="C" size="md" />
        </div>
      </DRBox>

      <DRSectionLabel>Sparse — only letters with entries are active</DRSectionLabel>
      <DRBox label="Light · medium · 15 of 26 enabled" padded={false}>
        <div style={{ padding: "24px 32px" }}>
          <DRAlphaNav active="H" size="md" enabledLetters={sparse} />
        </div>
      </DRBox>

      <DRSectionLabel>Sizes</DRSectionLabel>
      <DRBox label="All three sizes" padded={false}>
        <div style={{ padding: "24px 32px", display: "flex", flexDirection: "column", gap: 18 }}>
          <div>
            <div style={{ fontSize: "0.6rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--text-muted)", fontFamily: "var(--font-body-bold)", marginBottom: 6 }}>SM · 26-px cells</div>
            <DRAlphaNav active="M" size="sm" />
          </div>
          <div>
            <div style={{ fontSize: "0.6rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--text-muted)", fontFamily: "var(--font-body-bold)", marginBottom: 6 }}>MD · 32-px cells (default)</div>
            <DRAlphaNav active="M" size="md" />
          </div>
          <div>
            <div style={{ fontSize: "0.6rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--text-muted)", fontFamily: "var(--font-body-bold)", marginBottom: 6 }}>LG · 38-px cells</div>
            <DRAlphaNav active="M" size="lg" />
          </div>
        </div>
      </DRBox>

      <DRSectionLabel>Dark — on maroon</DRSectionLabel>
      <DRBox label="Dark · medium · active = R" padded={false} dark>
        <div style={{ padding: "24px 32px" }}>
          <DRAlphaNav active="R" size="md" enabledLetters={sparse} dark />
        </div>
      </DRBox>

      <DRSpecRow>
        <DRSpec label="cells" value="26 + All" note="A–Z buttons; optional 'All' resets." />
        <DRSpec label="active" value="bold + underline" note="Maroon on light; white on dark. 2px underline, 4px offset." />
        <DRSpec label="empty letter" value="opacity 0.25" note="Disabled — not focusable, no hover state." />
        <DRSpec label="rules" value="hairline ⊤⊥" note="1px borders top + bottom; sticky-friendly." />
      </DRSpecRow>
    </PageShell>
  );
}

// ════════════════════════════════════════════════════════════════════════
// DIRECTORY PAGE
// ════════════════════════════════════════════════════════════════════════

const DR_PEOPLE = [
  { last: "Adler",       first: "Marisol",    title: "Senior Research Engineer",       dept: "Roadway Operations",      email: "m-adler@tti.edu" },
  { last: "Alvarez",     first: "Diego",      title: "Program Manager",                dept: "Freight Mobility",        email: "d-alvarez@tti.edu" },
  { last: "Anders",      first: "Priya",      title: "Postdoctoral Researcher",        dept: "Human Factors",           email: "p-anders@tti.edu" },
  { last: "Bonham",      first: "Theresa",    title: "Associate Research Scientist",   dept: "Transit Mobility",        email: "t-bonham@tti.edu" },
  { last: "Caldwell",    first: "Marcus",     title: "Director, Center for Air Quality", dept: "Environment & Air Quality", email: "m-caldwell@tti.edu" },
];

function DRPersonRow({ p, dark = false }) {
  return (
    <div style={{
      display: "grid", gridTemplateColumns: "1fr 1.4fr 1fr",
      gap: 24, padding: "18px 0",
      borderBottom: dark ? "1px solid rgba(255,255,255,0.18)" : "1px solid rgb(229,229,229)",
      alignItems: "baseline",
    }}>
      <div>
        <div style={{
          fontFamily: "var(--font-display)", fontSize: "1.05rem", fontWeight: 500,
          textTransform: "uppercase", letterSpacing: "0.01em",
          color: dark ? "#fff" : "var(--text-primary)",
          lineHeight: 1.2,
        }}>
          {p.last}, {p.first}
        </div>
        <div style={{ fontSize: "0.82rem", color: dark ? "rgba(255,255,255,0.72)" : "var(--text-muted)", marginTop: 4 }}>
          {p.title}
        </div>
      </div>
      <div style={{ fontSize: "0.88rem", color: dark ? "rgba(255,255,255,0.85)" : "var(--text-secondary)", lineHeight: 1.55 }}>
        {p.dept}
      </div>
      <div style={{
        fontFamily: "var(--font-mono)", fontSize: "0.8rem",
        color: dark ? "#F4D58D" : "var(--brand-primary)",
        textDecoration: "underline", textDecorationStyle: "dotted", textUnderlineOffset: 3,
      }}>
        {p.email}
      </div>
    </div>
  );
}

function DRPhotoCard({ p, dark = false }) {
  // Initials avatar — placeholder for portrait.
  const initials = (p.first[0] + p.last[0]).toUpperCase();
  return (
    <div style={{
      display: "flex", flexDirection: "column", gap: 14,
      padding: 18,
      background: dark ? "rgba(255,255,255,0.05)" : "var(--surface-raised)",
      border: dark ? "1px solid rgba(255,255,255,0.12)" : "1px solid var(--surface-border)",
      borderRadius: "var(--radius-md)",
    }}>
      <div style={{
        width: "100%", aspectRatio: "1 / 1",
        background: dark
          ? "linear-gradient(135deg, rgba(255,255,255,0.12), rgba(255,255,255,0.04))"
          : "linear-gradient(135deg, color-mix(in srgb, var(--brand-primary) 18%, transparent), color-mix(in srgb, var(--brand-primary) 4%, transparent))",
        border: dark ? "1px solid rgba(255,255,255,0.12)" : "1px solid var(--surface-border)",
        borderRadius: "var(--radius-sm)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "var(--font-display)", fontSize: "2.4rem", fontWeight: 500,
        textTransform: "uppercase", letterSpacing: "0.02em",
        color: dark ? "#fff" : "var(--brand-primary)",
        opacity: 0.85,
      }}>{initials}</div>

      <div>
        <div style={{
          fontFamily: "var(--font-display)", fontSize: "1.1rem", fontWeight: 500,
          textTransform: "uppercase", letterSpacing: "0.01em",
          color: dark ? "#fff" : "var(--text-primary)",
          lineHeight: 1.2, marginBottom: 4,
        }}>
          {p.first} {p.last}
        </div>
        <div style={{ fontSize: "0.82rem", color: dark ? "rgba(255,255,255,0.75)" : "var(--text-muted)", lineHeight: 1.5 }}>
          {p.title}
        </div>
        <div style={{ fontSize: "0.78rem", color: dark ? "rgba(255,255,255,0.62)" : "var(--text-muted)", marginTop: 6, fontStyle: "italic" }}>
          {p.dept}
        </div>
        <div style={{
          marginTop: 10,
          fontFamily: "var(--font-mono)", fontSize: "0.78rem",
          color: dark ? "#F4D58D" : "var(--brand-primary)",
        }}>
          {p.email}
        </div>
      </div>
    </div>
  );
}

function DRDirectoryHeader({ dark = false, title = "A staff directory" }) {
  return (
    <div style={{ padding: "20px 28px 0" }}>
      <div style={{ fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: dark ? "rgba(255,255,255,0.7)" : "var(--text-muted)", fontFamily: "var(--font-body-bold)", marginBottom: 8 }}>
        directory
      </div>
      <h2 style={{
        fontFamily: "var(--font-display)", fontSize: "1.7rem", fontWeight: 500,
        textTransform: "uppercase", letterSpacing: "0.01em",
        color: dark ? "#fff" : "var(--text-primary)",
        margin: "0 0 16px", lineHeight: 1.15,
      }}>{title}</h2>
    </div>
  );
}

function DirectoryPage() {
  const item = (window.AGGIE_CATALOG || []).find(c => c.id === "directory");
  const sparse = new Set("ABCDEFHJKLMNPRSTW".split(""));

  return (
    <PageShell item={item}>
      <DRIntro>
        <strong>Directory</strong> — staff/people listing pattern. Combines an Alpha-nav
        strip with a list (compact) or grid (photo) of person entries. Compact rows are
        text-only and pack tightly; photo cards add a portrait and breathe more. Both
        share the same data shape (name + title + dept + email) and ship a no-results
        empty state.
      </DRIntro>

      <DRSectionLabel>Compact — text rows under alpha nav</DRSectionLabel>
      <DRBox label="Light · five rows · active = A" padded={false}>
        <DRDirectoryHeader title="Researchers — A" />
        <div style={{ padding: "0 28px" }}>
          <DRAlphaNav active="A" enabledLetters={sparse} size="md" />
        </div>
        <div style={{ padding: "0 28px 24px" }}>
          {DR_PEOPLE.slice(0, 3).map(p => <DRPersonRow key={p.email} p={p} />)}
        </div>
      </DRBox>

      <DRSectionLabel>Photo grid — letter B selected</DRSectionLabel>
      <DRBox label="Light · 4-up portrait grid · active = B" padded={false}>
        <DRDirectoryHeader title="Faculty — B" />
        <div style={{ padding: "0 28px" }}>
          <DRAlphaNav active="B" enabledLetters={sparse} size="md" />
        </div>
        <div style={{ padding: "24px 28px 24px", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
          <DRPhotoCard p={DR_PEOPLE[3]} />
          <DRPhotoCard p={{ last: "Becker",   first: "Hugo",    title: "Research Associate",      dept: "Crash Avoidance",         email: "h-becker@tti.edu" }} />
          <DRPhotoCard p={{ last: "Bertrand", first: "Liana",   title: "Project Engineer",        dept: "Pavement & Materials",    email: "l-bertrand@tti.edu" }} />
          <DRPhotoCard p={{ last: "Bishop",   first: "Tyrese",  title: "Postdoctoral Researcher", dept: "Connected Vehicles",      email: "t-bishop@tti.edu" }} />
        </div>
      </DRBox>

      <DRSectionLabel>Empty state — letter X</DRSectionLabel>
      <DRBox label="Light · zero results" padded={false}>
        <DRDirectoryHeader title="Staff — X" />
        <div style={{ padding: "0 28px" }}>
          <DRAlphaNav active="X" enabledLetters={sparse} size="md" />
        </div>
        <div style={{
          margin: "32px 28px 36px", padding: "44px 28px",
          border: "1px dashed var(--surface-border)", borderRadius: "var(--radius-md)",
          textAlign: "center", color: "var(--text-muted)",
          background: "color-mix(in srgb, var(--brand-primary) 2%, transparent)",
        }}>
          <div style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.02em", color: "var(--text-primary)", marginBottom: 6 }}>
            No entries under "X"
          </div>
          <div style={{ fontSize: "0.88rem", lineHeight: 1.55 }}>
            Try a different letter, or <span style={{ color: "var(--brand-primary)", textDecoration: "underline", textDecorationStyle: "dotted", textUnderlineOffset: 3, fontWeight: 600 }}>view all researchers</span>.
          </div>
        </div>
      </DRBox>

      <DRSectionLabel>Dark — compact rows on maroon</DRSectionLabel>
      <DRBox label="Dark · three rows · active = C" padded={false} dark>
        <DRDirectoryHeader title="Researchers — C" dark />
        <div style={{ padding: "0 28px" }}>
          <DRAlphaNav active="C" enabledLetters={sparse} size="md" dark />
        </div>
        <div style={{ padding: "0 28px 24px" }}>
          <DRPersonRow dark p={DR_PEOPLE[4]} />
          <DRPersonRow dark p={{ last: "Cardenas", first: "Iris",  title: "Senior Research Engineer", dept: "Multimodal Freight",  email: "i-cardenas@tti.edu" }} />
          <DRPersonRow dark p={{ last: "Choi",     first: "Wendy", title: "Research Specialist",     dept: "Human Factors",        email: "w-choi@tti.edu" }} />
        </div>
      </DRBox>

      <DRSpecRow>
        <DRSpec label="row layout" value="3 cols · 1fr 1.4fr 1fr" note="Name+title / Dept / Email. Hairline divider every row." />
        <DRSpec label="photo grid" value="4-up · gap 16" note="Square avatar + 4-line metadata block. Falls back to initials." />
        <DRSpec label="email" value="dotted underline" note="Maroon on light, gold (--brand-accent) on dark." />
        <DRSpec label="empty state" value="dashed card" note="Suggests alternate letter + 'view all' fallback link." />
      </DRSpecRow>
    </PageShell>
  );
}

// ════════════════════════════════════════════════════════════════════════
// GLOSSARY PAGE
// ════════════════════════════════════════════════════════════════════════

const DR_GLOSSARY = {
  A: [
    { term: "AADT", def: "Annual Average Daily Traffic — total volume of vehicle traffic on a roadway segment over a year, divided by 365. The basis for nearly every roadway capacity calculation." },
    { term: "Access management", def: "The systematic control of driveway, median, and intersection spacing along a corridor to balance throughput and adjacent land-use access." },
  ],
  B: [
    { term: "Buffer zone", def: "A separation strip — typically grass, planting, or a physical barrier — between vehicular travel lanes and pedestrian or bicycle facilities." },
  ],
  C: [
    { term: "Capacity", def: "The maximum sustainable hourly flow rate at which vehicles or persons can traverse a point or short segment under prevailing roadway, geometric, traffic, and control conditions." },
    { term: "Connected vehicle (CV)", def: "A vehicle equipped to communicate with other vehicles, infrastructure, and the cloud via DSRC, C-V2X, or cellular links." },
    { term: "Crash modification factor", def: "A multiplier applied to a baseline crash frequency to estimate how a treatment will change expected crash counts." },
  ],
};

const DR_GLOSSARY_2COL = {
  A: [
    { term: "AADT",     def: "Annual Average Daily Traffic." },
    { term: "AASHTO",   def: "American Association of State Highway and Transportation Officials." },
    { term: "ADT",      def: "Average Daily Traffic — sub-yearly traffic averages." },
  ],
  B: [
    { term: "BRT",      def: "Bus Rapid Transit — high-frequency, dedicated-lane bus service." },
    { term: "BUFR",     def: "Binary Universal Form for the Representation of meteorological data." },
  ],
  C: [
    { term: "C-V2X",    def: "Cellular Vehicle-to-Everything communications." },
    { term: "CMF",      def: "Crash Modification Factor." },
    { term: "Corridor", def: "A geographically contiguous transportation route." },
  ],
};

function DRGlossaryHeader({ L, dark = false, count }) {
  return (
    <div style={{
      display: "flex", alignItems: "baseline", gap: 18,
      padding: "20px 0 14px",
      borderBottom: dark ? "2px solid rgba(255,255,255,0.45)" : "2px solid var(--brand-primary)",
      marginBottom: 16, marginTop: 24,
    }}>
      <div style={{
        fontFamily: "var(--font-display)", fontSize: "3.2rem", fontWeight: 500,
        lineHeight: 1, color: dark ? "#fff" : "var(--brand-primary)",
        letterSpacing: "0.01em",
      }}>{L}</div>
      <div style={{
        fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em",
        color: dark ? "rgba(255,255,255,0.7)" : "var(--text-muted)",
        fontFamily: "var(--font-body-bold)",
      }}>
        {count} {count === 1 ? "term" : "terms"}
      </div>
    </div>
  );
}

function DRGlossaryRow({ term, def, dark = false }) {
  return (
    <div style={{
      display: "grid", gridTemplateColumns: "minmax(140px, 200px) 1fr",
      gap: 28, padding: "14px 0",
      borderBottom: dark ? "1px solid rgba(255,255,255,0.15)" : "1px solid rgb(229,229,229)",
    }}>
      <dt style={{
        fontFamily: "var(--font-body-bold)", fontWeight: 700,
        fontSize: "0.95rem", color: dark ? "#fff" : "var(--text-primary)",
        margin: 0,
      }}>{term}</dt>
      <dd style={{
        margin: 0, fontSize: "0.92rem", lineHeight: 1.6,
        color: dark ? "rgba(255,255,255,0.85)" : "var(--text-secondary)",
      }}>{def}</dd>
    </div>
  );
}

function DRGlossaryCompact({ term, def, dark = false }) {
  return (
    <div style={{
      padding: "10px 0", borderBottom: dark ? "1px solid rgba(255,255,255,0.12)" : "1px solid rgb(235,235,235)",
    }}>
      <div style={{
        fontFamily: "var(--font-body-bold)", fontWeight: 700,
        fontSize: "0.88rem", color: dark ? "#fff" : "var(--text-primary)",
        marginBottom: 2,
      }}>{term}</div>
      <div style={{
        fontSize: "0.85rem", lineHeight: 1.5,
        color: dark ? "rgba(255,255,255,0.78)" : "var(--text-secondary)",
      }}>{def}</div>
    </div>
  );
}

function GlossaryPage() {
  const item = (window.AGGIE_CATALOG || []).find(c => c.id === "glossary");
  const enabled = new Set(Object.keys(DR_GLOSSARY));

  return (
    <PageShell item={item}>
      <DRIntro>
        <strong>Glossary</strong> — term/definition listing pattern. Alpha nav anchors
        the top; below it, each letter section opens with a giant display-letter header
        + count, followed by a description list (<code>&lt;dl&gt;</code>) of terms. Two
        layouts cover most cases: <em>1-column</em> for long, prose-style definitions,
        and <em>2-column</em> for short acronym-style entries.
      </DRIntro>

      <DRSectionLabel>1-column — long definitions</DRSectionLabel>
      <DRBox label="Light · prose-style entries" padded={false}>
        <div style={{ padding: "20px 28px" }}>
          <div style={{ fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--text-muted)", fontFamily: "var(--font-body-bold)", marginBottom: 8 }}>
            transportation glossary
          </div>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.7rem", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.01em", margin: "0 0 16px", lineHeight: 1.15 }}>
            Terms used in TTI publications
          </h2>
        </div>
        <div style={{ padding: "0 28px" }}>
          <DRAlphaNav active="A" enabledLetters={enabled} size="md" />
        </div>
        <div style={{ padding: "0 28px 28px" }}>
          {Object.entries(DR_GLOSSARY).map(([L, terms]) => (
            <div key={L}>
              <DRGlossaryHeader L={L} count={terms.length} />
              <dl style={{ margin: 0 }}>
                {terms.map(t => <DRGlossaryRow key={t.term} {...t} />)}
              </dl>
            </div>
          ))}
        </div>
      </DRBox>

      <DRSectionLabel>2-column — acronyms / short defs</DRSectionLabel>
      <DRBox label="Light · packed acronym layout" padded={false}>
        <div style={{ padding: "20px 28px" }}>
          <div style={{ fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--text-muted)", fontFamily: "var(--font-body-bold)", marginBottom: 8 }}>
            acronyms
          </div>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.7rem", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.01em", margin: "0 0 16px", lineHeight: 1.15 }}>
            TTI &amp; transportation acronyms
          </h2>
        </div>
        <div style={{ padding: "0 28px" }}>
          <DRAlphaNav active="C" enabledLetters={enabled} size="md" />
        </div>
        <div style={{ padding: "0 28px 28px" }}>
          {Object.entries(DR_GLOSSARY_2COL).map(([L, terms]) => (
            <div key={L}>
              <DRGlossaryHeader L={L} count={terms.length} />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 36px" }}>
                {terms.map(t => <DRGlossaryCompact key={t.term} {...t} />)}
              </div>
            </div>
          ))}
        </div>
      </DRBox>

      <DRSectionLabel>Dark — single section, on maroon</DRSectionLabel>
      <DRBox label="Dark · 1-column · letter C section only" padded={false} dark>
        <div style={{ padding: "20px 28px" }}>
          <div style={{ fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "rgba(255,255,255,0.7)", fontFamily: "var(--font-body-bold)", marginBottom: 8 }}>
            transportation glossary
          </div>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.7rem", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.01em", margin: "0 0 16px", lineHeight: 1.15, color: "#fff" }}>
            Terms — letter C
          </h2>
        </div>
        <div style={{ padding: "0 28px" }}>
          <DRAlphaNav active="C" enabledLetters={enabled} size="md" dark />
        </div>
        <div style={{ padding: "0 28px 28px" }}>
          <DRGlossaryHeader L="C" count={DR_GLOSSARY.C.length} dark />
          <dl style={{ margin: 0 }}>
            {DR_GLOSSARY.C.map(t => <DRGlossaryRow key={t.term} {...t} dark />)}
          </dl>
        </div>
      </DRBox>

      <DRSpecRow>
        <DRSpec label="section header" value="3.2rem display L" note="Giant letter + 2px maroon underline + term count eyebrow." />
        <DRSpec label="1-col row" value="200 / 1fr" note="Term column maxes at 200px; def fills remaining width." />
        <DRSpec label="2-col row" value="1fr · 1fr · 36px gap" note="For acronym-style short definitions only." />
        <DRSpec label="dividers" value="1px hairline" note="Between every term row; between letter sections by virtue of header underline." />
      </DRSpecRow>
    </PageShell>
  );
}

// ════════════════════════════════════════════════════════════════════════
// EXPORT
// ════════════════════════════════════════════════════════════════════════

Object.assign(window, { AlphaNavPage, DirectoryPage, GlossaryPage });
