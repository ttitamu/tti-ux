/* global React, PageShell, AGGIE_CATALOG, LucideIcon */
/*
 * AggieFilters.jsx — Batch 14: Pagination + Horizontal filters + Sidebar filtration.
 *
 *   Pagination          — page-of-N control. Prev / numbered pages /
 *                          Next, separated by 1px hairlines. Active
 *                          page is filled-maroon. 51-px-tall row,
 *                          centered.
 *
 *   Horizontal filters  — top-of-list filter bar. Inline-select
 *                          dropdowns (label + value) sit shoulder-to-
 *                          shoulder; optional search bar on the right.
 *                          Light-gray surround band with 36px padding.
 *
 *   Sidebar filtration  — left-rail filter panel. Heading + search +
 *                          radio group + checkbox group + select(s) +
 *                          submit/clear button row. 368-wide, 12-px
 *                          radius card. Two backgrounds: light-gray
 *                          and maroon (dark).
 *
 * Helper prefix: FT (Filters).
 */

// ════════════════════════════════════════════════════════════════════════
// Shared helpers (FT prefix)
// ════════════════════════════════════════════════════════════════════════

function FTBox({ dark = false, label, padded = true, children }) {
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

function FTSectionLabel({ children }) {
  return (
    <div style={{ fontSize: "0.62rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--text-muted)", fontFamily: "var(--font-body-bold)", marginBottom: 12, marginTop: 16 }}>{children}</div>
  );
}

function FTSpecRow({ children }) {
  return (
    <div style={{ marginTop: 28, padding: "14px 18px", border: "1px solid var(--surface-border)", borderRadius: "var(--radius-md)", background: "var(--surface-raised)", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>{children}</div>
  );
}

function FTSpec({ label, value, note }) {
  return (
    <div>
      <div style={{ fontSize: "0.6rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-muted)", fontFamily: "var(--font-body-bold)" }}>{label}</div>
      <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem", color: "var(--brand-primary)", marginTop: 3, fontWeight: 500 }}>{value}</div>
      {note && <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: 2, lineHeight: 1.4 }}>{note}</div>}
    </div>
  );
}

function FTIntro({ children }) {
  return (
    <div style={{ padding: "16px 20px", marginBottom: 28, background: "color-mix(in srgb, var(--brand-primary) 5%, transparent)", borderLeft: "3px solid var(--brand-primary)", borderRadius: "0 var(--radius-sm) var(--radius-sm) 0", fontSize: "0.92rem", lineHeight: 1.65, color: "var(--text-secondary)" }}>
      {children}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════
// PAGINATION atoms
// ════════════════════════════════════════════════════════════════════════

function FTPageButton({ n, active = false, dark = false }) {
  const fg = dark ? (active ? "var(--brand-primary)" : "rgba(255,255,255,0.85)") : (active ? "#fff" : "var(--text-primary)");
  const bg = active ? (dark ? "#fff" : "var(--brand-primary)") : "transparent";
  return (
    <button style={{
      width: 38, height: 38, border: "none", background: bg, color: fg,
      fontFamily: "var(--font-body-bold)", fontWeight: 700, fontSize: 14,
      cursor: "pointer",
    }}>{n}</button>
  );
}

function FTSep({ dark }) {
  return <div style={{ width: 1, height: 36, background: dark ? "rgba(255,255,255,0.2)" : "rgb(217,217,217)" }} />;
}

function FTPagination({ dark = false, current = 3, total = 12 }) {
  const fg = dark ? "rgba(255,255,255,0.9)" : "var(--brand-primary)";
  const arrowText = (label, dir) => (
    <button style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      background: "transparent", border: "none", cursor: "pointer",
      fontFamily: "var(--font-body-bold)", fontWeight: 700, fontStyle: "italic",
      fontSize: 14, color: fg, textTransform: "uppercase", letterSpacing: "0.06em",
      padding: "8px 14px",
    }}>
      {dir === "prev" && <LucideIcon name="chevron-left" size={14} />}
      {label}
      {dir === "next" && <LucideIcon name="chevron-right" size={14} />}
    </button>
  );

  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "center", gap: 14,
      padding: "20px 0",
    }}>
      {arrowText("Previous", "prev")}
      <FTSep dark={dark} />
      {[1, 2, 3, 4, 5].map(n => (
        <FTPageButton key={n} n={n} active={n === current} dark={dark} />
      ))}
      <FTSep dark={dark} />
      {arrowText("Next", "next")}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════
// HORIZONTAL FILTERS atoms
// ════════════════════════════════════════════════════════════════════════

function FTInlineSelect({ label, value, dark = false }) {
  const labelColor = dark ? "rgba(255,255,255,0.75)" : "var(--text-muted)";
  const valueColor = dark ? "#fff" : "var(--text-primary)";
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4, minWidth: 160 }}>
      <div style={{
        fontFamily: "var(--font-body-bold)", fontWeight: 700, fontSize: 11,
        letterSpacing: "0.1em", textTransform: "uppercase", color: labelColor,
      }}>{label}</div>
      <button style={{
        display: "inline-flex", alignItems: "center", justifyContent: "space-between",
        gap: 12, padding: "10px 14px",
        background: dark ? "rgba(255,255,255,0.06)" : "#fff",
        border: `1px solid ${dark ? "rgba(255,255,255,0.25)" : "var(--surface-border)"}`,
        color: valueColor, fontFamily: "var(--font-body)", fontSize: 14, fontWeight: 600,
        cursor: "pointer", minHeight: 42,
      }}>
        <span>{value}</span>
        <LucideIcon name="chevron-down" size={14} />
      </button>
    </div>
  );
}

function FTSearchBar({ dark = false, placeholder = "culverts" }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4, minWidth: 280 }}>
      <div style={{
        fontFamily: "var(--font-body-bold)", fontWeight: 700, fontSize: 11,
        letterSpacing: "0.1em", textTransform: "uppercase",
        color: dark ? "rgba(255,255,255,0.75)" : "var(--text-muted)",
      }}>Search</div>
      <div style={{ display: "flex", alignItems: "stretch" }}>
        <input defaultValue={placeholder} style={{
          flex: 1, minHeight: 42, padding: "10px 14px", border: `1px solid ${dark ? "rgba(255,255,255,0.25)" : "var(--surface-border)"}`,
          background: dark ? "rgba(255,255,255,0.06)" : "#fff",
          color: dark ? "#fff" : "var(--text-primary)",
          fontFamily: "var(--font-body)", fontSize: 14, outline: "none",
        }} />
        <button style={{
          padding: "0 18px", background: "var(--brand-primary)", color: "#fff",
          border: "none", fontFamily: "var(--font-body-bold)", fontWeight: 700,
          fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer",
          display: "inline-flex", alignItems: "center", gap: 8,
        }}>
          <LucideIcon name="search" size={14} /> Search
        </button>
      </div>
    </div>
  );
}

function FTHorizontalFilter({ dark = false, hasSearch = false }) {
  return (
    <div style={{
      padding: "28px 32px",
      background: dark ? "rgba(255,255,255,0.04)" : "#fff",
      border: dark ? "1px solid rgba(255,255,255,0.1)" : "1px solid var(--surface-border)",
      display: "flex", gap: 24, alignItems: "flex-end", flexWrap: "wrap",
    }}>
      <div style={{
        fontFamily: "var(--font-body-bold)", fontWeight: 700, fontSize: 12,
        letterSpacing: "0.1em", textTransform: "uppercase",
        color: dark ? "rgba(255,255,255,0.75)" : "var(--text-muted)",
        paddingBottom: 11,
      }}>Filter by</div>
      <FTInlineSelect dark={dark} label="Topic" value="All topics" />
      <FTInlineSelect dark={dark} label="Year" value="2024 – 2026" />
      <FTInlineSelect dark={dark} label="Author" value="Any" />
      {!hasSearch && <FTInlineSelect dark={dark} label="Type" value="Reports" />}
      {hasSearch && <FTSearchBar dark={dark} />}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════
// SIDEBAR FILTRATION atoms
// ════════════════════════════════════════════════════════════════════════

function FTRadioRow({ label, checked = false, dark = false }) {
  const fg = dark ? "rgba(255,255,255,0.92)" : "var(--text-primary)";
  const ringColor = dark ? "rgba(255,255,255,0.5)" : "var(--text-muted)";
  return (
    <label style={{ display: "flex", alignItems: "center", gap: 10, fontFamily: "var(--font-body)", fontSize: 14, color: fg, cursor: "pointer" }}>
      <span style={{
        width: 18, height: 18, borderRadius: "50%",
        border: `1.5px solid ${checked ? (dark ? "#fff" : "var(--brand-primary)") : ringColor}`,
        display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
      }}>
        {checked && <span style={{ width: 9, height: 9, borderRadius: "50%", background: dark ? "#fff" : "var(--brand-primary)" }} />}
      </span>
      {label}
    </label>
  );
}

function FTCheckRow({ label, checked = false, dark = false }) {
  const fg = dark ? "rgba(255,255,255,0.92)" : "var(--text-primary)";
  const ringColor = dark ? "rgba(255,255,255,0.5)" : "var(--text-muted)";
  return (
    <label style={{ display: "flex", alignItems: "center", gap: 10, fontFamily: "var(--font-body)", fontSize: 14, color: fg, cursor: "pointer" }}>
      <span style={{
        width: 18, height: 18,
        border: `1.5px solid ${checked ? (dark ? "#fff" : "var(--brand-primary)") : ringColor}`,
        background: checked ? (dark ? "#fff" : "var(--brand-primary)") : "transparent",
        display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        color: dark ? "var(--brand-primary)" : "#fff",
      }}>
        {checked && <LucideIcon name="check" size={12} strokeWidth={3} />}
      </span>
      {label}
    </label>
  );
}

function FTSelectField({ label, value, dark = false }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <div style={{
        fontFamily: "var(--font-body-bold)", fontWeight: 700, fontSize: 11,
        letterSpacing: "0.1em", textTransform: "uppercase",
        color: dark ? "rgba(255,255,255,0.75)" : "var(--text-muted)",
      }}>{label}</div>
      <button style={{
        display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8,
        padding: "10px 12px",
        background: dark ? "rgba(255,255,255,0.06)" : "#fff",
        border: `1px solid ${dark ? "rgba(255,255,255,0.25)" : "var(--surface-border)"}`,
        color: dark ? "#fff" : "var(--text-primary)",
        fontFamily: "var(--font-body)", fontSize: 14, fontWeight: 500, cursor: "pointer", minHeight: 40,
      }}>
        <span>{value}</span><LucideIcon name="chevron-down" size={14} />
      </button>
    </div>
  );
}

function FTSidebarFilter({ dark = false }) {
  const headingColor = dark ? "#fff" : "var(--text-primary)";
  const labelColor = dark ? "rgba(255,255,255,0.75)" : "var(--text-muted)";
  const cardBg = dark ? "rgba(255,255,255,0.04)" : "#fff";
  const sep = dark ? "rgba(255,255,255,0.15)" : "var(--surface-border)";

  const FieldsetLabel = ({ children }) => (
    <div style={{
      fontFamily: "var(--font-body-bold)", fontWeight: 700, fontSize: 11,
      letterSpacing: "0.1em", textTransform: "uppercase", color: labelColor, marginBottom: 10,
    }}>{children}</div>
  );

  return (
    <div style={{
      width: 320, padding: "24px",
      background: cardBg,
      borderRadius: 12,
      border: dark ? "1px solid rgba(255,255,255,0.12)" : "1px solid var(--surface-border)",
      display: "flex", flexDirection: "column", gap: 22,
    }}>
      <div>
        <div style={{ fontSize: "0.62rem", fontFamily: "var(--font-body-bold)", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: dark ? "rgba(255,255,255,0.6)" : "var(--text-muted)", marginBottom: 4 }}>Refine</div>
        <div style={{ fontFamily: "var(--font-display)", fontWeight: 500, fontSize: 22, textTransform: "uppercase", letterSpacing: "0.01em", color: headingColor }}>Find a publication</div>
      </div>

      {/* Search */}
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <FieldsetLabel>Keyword</FieldsetLabel>
        <div style={{ display: "flex", alignItems: "stretch" }}>
          <input placeholder="Search by title…" style={{
            flex: 1, padding: "10px 12px",
            border: `1px solid ${dark ? "rgba(255,255,255,0.25)" : "var(--surface-border)"}`,
            background: dark ? "rgba(255,255,255,0.06)" : "#fff",
            color: dark ? "#fff" : "var(--text-primary)",
            fontFamily: "var(--font-body)", fontSize: 14, outline: "none", minHeight: 40,
          }} />
          <button style={{
            padding: "0 14px", background: "var(--brand-primary)", color: "#fff",
            border: "none", cursor: "pointer", display: "inline-flex", alignItems: "center",
          }}>
            <LucideIcon name="search" size={14} />
          </button>
        </div>
      </div>

      <div style={{ height: 1, background: sep }} />

      {/* Radio */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <FieldsetLabel>Sort order</FieldsetLabel>
        <FTRadioRow dark={dark} label="Most recent" checked />
        <FTRadioRow dark={dark} label="Most cited" />
        <FTRadioRow dark={dark} label="Alphabetical" />
      </div>

      <div style={{ height: 1, background: sep }} />

      {/* Checkbox */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <FieldsetLabel>Topic</FieldsetLabel>
        <FTCheckRow dark={dark} label="Crash analytics" checked />
        <FTCheckRow dark={dark} label="Connected vehicles" checked />
        <FTCheckRow dark={dark} label="Roadway design" />
        <FTCheckRow dark={dark} label="Workforce" />
      </div>

      <div style={{ height: 1, background: sep }} />

      {/* Select */}
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <FTSelectField dark={dark} label="Year published" value="2024 – 2026" />
        <FTSelectField dark={dark} label="Document type" value="Final report" />
      </div>

      <div style={{ height: 1, background: sep }} />

      {/* Submission */}
      <div style={{ display: "flex", gap: 10 }}>
        <button style={{
          flex: 1, padding: "12px 16px", background: dark ? "#fff" : "var(--brand-primary)",
          color: dark ? "var(--brand-primary)" : "#fff", border: "none",
          fontFamily: "var(--font-body-bold)", fontWeight: 700, fontSize: 12,
          letterSpacing: "0.12em", textTransform: "uppercase", cursor: "pointer",
        }}>Apply</button>
        <button style={{
          padding: "12px 16px", background: "transparent",
          color: dark ? "rgba(255,255,255,0.85)" : "var(--text-secondary)",
          border: `1px solid ${dark ? "rgba(255,255,255,0.4)" : "var(--surface-border)"}`,
          fontFamily: "var(--font-body-bold)", fontWeight: 700, fontSize: 12,
          letterSpacing: "0.12em", textTransform: "uppercase", cursor: "pointer",
        }}>Clear</button>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════
// PAGES
// ════════════════════════════════════════════════════════════════════════

function PaginationPage() {
  const item = AGGIE_CATALOG.find((x) => x.id === "pagination");
  return (
    <PageShell item={item}>
      <FTIntro>
        <strong>Pagination</strong> — page-of-N control that sits at the bottom of every long list (news, publications, directory results). Italic-uppercase Previous and Next labels flank a strip of numbered pages, separated by 1px hairline rules. The active page is filled-maroon; rest are transparent. Centered, 51px tall, no background fill.
      </FTIntro>

      <FTSectionLabel>Light · active page in the middle</FTSectionLabel>
      <FTBox label="Default · 5-page strip · current = 3"><FTPagination current={3} /></FTBox>

      <FTSectionLabel>Light · edges — first / last page</FTSectionLabel>
      <FTBox label="First page selected"><FTPagination current={1} /></FTBox>
      <FTBox label="Last page selected"><FTPagination current={5} /></FTBox>

      <FTSectionLabel>Dark mode</FTSectionLabel>
      <FTBox dark={true} label="Dark · current = 3"><FTPagination dark={true} current={3} /></FTBox>
      <FTBox dark={true} label="Dark · current = 1"><FTPagination dark={true} current={1} /></FTBox>

      <FTSpecRow>
        <FTSpec label="Row height" value="51px" note="24px top + bottom padding inside its band" />
        <FTSpec label="Page button" value="38×38" note="Square; active fills with maroon, others transparent" />
        <FTSpec label="Separators" value="1px × 36px" note="rgb(217,217,217) light · rgba(255,255,255,0.2) dark" />
        <FTSpec label="Prev/Next type" value="Work Sans 700 italic" note="UPPERCASE 14px, paired with chevron icon" />
      </FTSpecRow>
    </PageShell>
  );
}

function HorizontalFiltersPage() {
  const item = AGGIE_CATALOG.find((x) => x.id === "horizontal-filters");
  return (
    <PageShell item={item}>
      <FTIntro>
        <strong>Horizontal filters</strong> — top-of-list filter bar. A row of inline-select dropdowns (each labelled with a Work Sans 700 uppercase eyebrow) sits in a 36-px-padded band. An optional Search bar takes the rightmost slot. Two booleans: <strong>Has Search</strong> + <strong>Dark Mode</strong> — four total combinations.
      </FTIntro>

      <FTSectionLabel>Light · with and without search</FTSectionLabel>
      <FTBox label="Light · no search — four dropdowns"><FTHorizontalFilter /></FTBox>
      <FTBox label="Light · with search"><FTHorizontalFilter hasSearch={true} /></FTBox>

      <FTSectionLabel>Dark · with and without search</FTSectionLabel>
      <FTBox dark={true} label="Dark · no search"><FTHorizontalFilter dark={true} /></FTBox>
      <FTBox dark={true} label="Dark · with search"><FTHorizontalFilter dark={true} hasSearch={true} /></FTBox>

      <FTSpecRow>
        <FTSpec label="Outer padding" value="36px" note="On the surrounding gray band" />
        <FTSpec label="Field gap" value="24px" note="Between dropdowns and the optional search bar" />
        <FTSpec label="Eyebrow label" value="11px Work Sans 700" note="UPPERCASE, 0.1em letterspacing" />
        <FTSpec label="Search button" value="Work Sans 700" note="Maroon fill, white label, no radius" />
      </FTSpecRow>
    </PageShell>
  );
}

function SidebarFiltrationPage() {
  const item = AGGIE_CATALOG.find((x) => x.id === "sidebar-filtration");
  return (
    <PageShell item={item}>
      <FTIntro>
        <strong>Sidebar filtration</strong> — the comprehensive filter rail that sits next to a directory or publication list. 320-px-wide card with 24-px padding and 12-px corner radius. Stack: <em>section heading → keyword search → radio group → checkbox group → select(s) → Apply / Clear</em>. Hairline dividers between sections. Two backgrounds — light card on light page, or dark card on maroon page.
      </FTIntro>

      <FTSectionLabel>Full sidebar — both backgrounds, side by side</FTSectionLabel>
      <FTBox label="Light card" padded={false}>
        <div style={{ padding: 32, display: "flex", justifyContent: "center" }}><FTSidebarFilter /></div>
      </FTBox>
      <FTBox dark={true} label="Dark card on maroon page" padded={false}>
        <div style={{ padding: 32, display: "flex", justifyContent: "center" }}><FTSidebarFilter dark={true} /></div>
      </FTBox>

      <FTSectionLabel>In-context — sidebar paired with results column</FTSectionLabel>
      <FTBox label="Sidebar + results column">
        <div style={{ display: "flex", gap: 24, alignItems: "flex-start" }}>
          <FTSidebarFilter />
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 12 }}>
            {[1, 2, 3, 4].map(i => (
              <div key={i} style={{
                padding: "20px 22px", border: "1px solid var(--surface-border)", background: "#fff",
                display: "flex", flexDirection: "column", gap: 6,
              }}>
                <div style={{ fontFamily: "var(--font-body-bold)", fontWeight: 700, fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)" }}>Final report · 2025</div>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 500, fontSize: 18, textTransform: "uppercase", letterSpacing: "0.01em", color: "var(--text-primary)" }}>Connected-vehicle pilot — phase {i} findings</div>
                <div style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--text-secondary)" }}>Vega · Adler · Chen · 142 pp.</div>
              </div>
            ))}
          </div>
        </div>
      </FTBox>

      <FTSpecRow>
        <FTSpec label="Card width" value="320px" note="Aligns to a 12-col grid's 3-col span at 1500-wide" />
        <FTSpec label="Card padding" value="24px" note="Radius 12px on the outer card" />
        <FTSpec label="Section gap" value="22px" note="With a 1px hairline between groups" />
        <FTSpec label="Submit row" value="Apply + Clear" note="Apply = filled maroon; Clear = ghost" />
      </FTSpecRow>
    </PageShell>
  );
}

// ════════════════════════════════════════════════════════════════════════
// EXPORTS
// ════════════════════════════════════════════════════════════════════════

window.PaginationPage = PaginationPage;
window.HorizontalFiltersPage = HorizontalFiltersPage;
window.SidebarFiltrationPage = SidebarFiltrationPage;
