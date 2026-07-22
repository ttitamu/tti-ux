/* global React, PageShell, AGGIE_CATALOG, MediaBox, AvatarBox */
/*
 * AggieNewsContact.jsx — Batch 8: News + Contact + Collection-feature.
 *
 *   News collection         — paginated list of articles with date, dek, thumb.
 *   Contact card collection — faculty/staff directory, photo + name + title + links.
 *   Contact cards (B)       — alternate layout: horizontal, inline with copy.
 *   Collection feature      — "three latest from a larger collection" featured pull.
 *
 * Helper prefix: NC (News-Contact). Local helpers — never import a generic
 * SectionLabel/Box/Spec from another batch (collisions break Babel scope).
 *
 * Lineage (INF-2):
 *   • News collection — anatomy informed by SharePoint Web News (Hub, List,
 *     Side-by-side, Top-story, Tiles, Carousel — 13 frames). SharePoint
 *     names a clean set of editorial layouts that map to ours: Hub = 3-up
 *     card grid (canonical "news hub" page), List = thumb-left rows,
 *     Side-by-side = featured + secondary column, Top-story = oversized
 *     hero + supporting tiles, Tiles = uniform grid, Carousel = horizontal
 *     scroll. SharePoint's metadata row (avatar · author · date · views)
 *     is the structural baseline for our optional metadata row.
 *   • Contact card collection — anatomy informed by SharePoint People
 *     (3 frames) — square portrait + name + title + contact links. TUX
 *     keeps the editorial Work Sans 700 caps title; SharePoint uses Segoe
 *     UI semibold sentence case.
 *   • Collection feature — informed by SharePoint Highlighted-Content
 *     Compact (3-up "latest from" pull), retitled to fit TUX's "view-all"
 *     header rhythm.
 *
 * Identity stays TUX: maroon eyebrow, signature rule on featured-card
 * variants, italic Work Sans dates, JetBrains Mono numerals. Never lift
 * Segoe UI or SharePoint blue.
 */

// ════════════════════════════════════════════════════════════════════════
// Shared helpers (NC prefix)
// ════════════════════════════════════════════════════════════════════════

function NCBox({ dark = false, label, padded = true, children }) {
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

function NCSectionLabel({ children }) {
  return (
    <div style={{ fontSize: "0.62rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--text-muted)", fontFamily: "var(--font-body-bold)", marginBottom: 12, marginTop: 16 }}>{children}</div>
  );
}

function NCSpecRow({ children }) {
  return (
    <div style={{ marginTop: 28, padding: "14px 18px", border: "1px solid var(--surface-border)", borderRadius: "var(--radius-md)", background: "var(--surface-raised)", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>{children}</div>
  );
}

function NCSpec({ label, value, note }) {
  return (
    <div>
      <div style={{ fontSize: "0.6rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-muted)", fontFamily: "var(--font-body-bold)" }}>{label}</div>
      <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem", color: "var(--brand-primary)", marginTop: 3, fontWeight: 500 }}>{value}</div>
      {note && <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: 2, lineHeight: 1.4 }}>{note}</div>}
    </div>
  );
}

function NCIntro({ children }) {
  return (
    <div style={{ padding: "16px 20px", marginBottom: 28, background: "color-mix(in srgb, var(--brand-primary) 5%, transparent)", borderLeft: "3px solid var(--brand-primary)", borderRadius: "0 var(--radius-sm) var(--radius-sm) 0", fontSize: "0.92rem", lineHeight: 1.65, color: "var(--text-secondary)" }}>
      {children}
    </div>
  );
}

function NCSig({ style, dark, width = 80 }) {
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
    <div style={{ width, height: 2, background: `linear-gradient(90deg, transparent 0%, ${c} 15%, ${c} 85%, transparent 100%)`, opacity: 0.9 }} />
  );
}

function NCHeadline(style) {
  if (style === "bold") return { fontFamily: "var(--font-bold)", fontWeight: 800, fontStyle: "italic", textTransform: "uppercase", letterSpacing: "-0.005em", lineHeight: 1.05 };
  if (style === "elegant") return { fontFamily: "var(--font-elegant, Georgia, serif)", fontWeight: 400, fontStyle: "italic", textTransform: "none", letterSpacing: "-0.01em", lineHeight: 1.1 };
  return { fontFamily: "var(--font-display)", fontWeight: 500, fontStyle: "normal", textTransform: "uppercase", letterSpacing: "0.005em", lineHeight: 1.1 };
}

// ════════════════════════════════════════════════════════════════════════
// NEWS COLLECTION
// ════════════════════════════════════════════════════════════════════════

const NEWS_ITEMS = [
  { date: "Apr 18, 2026", category: "Research", title: "Roadside-sensor pilot finds black-ice formation 22 minutes earlier than human reporting", dek: "A five-month TTI pilot along I-40 produced the first quantitative baseline for early-warning lead time on rural Texas corridors.", author: "Marcus Reyes", read: 6 },
  { date: "Apr 11, 2026", category: "Policy",   title: "TxDOT awards TTI $4.2M to extend FM-1942 study corridor through 2028", dek: "The renewed contract expands sensor coverage to 14 sites and brings drone-based shoulder-geometry surveys into the methodology.", author: "Daniella Ortiz", read: 4 },
  { date: "Apr 03, 2026", category: "Field",    title: "What our crash-reconstruction team learned from a winter of dashcam footage", dek: "Six investigators, 1,400 hours of video, and a few new questions about how late-night fatigue actually distributes across a route.", author: "Howard Lim", read: 9 },
  { date: "Mar 28, 2026", category: "Research", title: "Crash-rate reductions tracked to corridor-by-corridor signage redesign", dek: "Comparative data from twelve study sites suggests the variable-message signs in the Panhandle are pulling more weight than expected.", author: "Aja Patel", read: 7 },
  { date: "Mar 22, 2026", category: "Outreach", title: "TTI hosts the Coordinated Statewide Transportation Research Program convening at Riverside Campus", dek: "Three days, 240 attendees, and one keynote from the FHWA on the future of work-zone safety modeling.", author: "Communications Office", read: 3 },
];

function NewsItem({ n, layout = "row", style = "default", dark = false }) {
  const fg = dark ? "#fff" : "var(--text-primary)";
  const muted = dark ? "rgba(255,255,255,0.7)" : "var(--text-muted)";
  const sec = dark ? "rgba(255,255,255,0.82)" : "var(--text-secondary)";
  const accent = dark ? "var(--brand-accent)" : "var(--brand-primary)";
  const head = NCHeadline(style);

  if (layout === "row") {
    return (
      <article style={{
        display: "grid", gridTemplateColumns: "200px 1fr auto", gap: 28, alignItems: "start",
        padding: "22px 0", borderBottom: dark ? "1px solid rgba(255,255,255,0.18)" : "1px solid var(--surface-border)",
      }}>
        <div style={{ width: 200 }}>
          <MediaBox style={style} ratio="3/2" w={200} h={134} label={`thumb`} onDark={dark} />
        </div>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
            <span style={{ fontFamily: "var(--font-body-bold)", fontSize: "0.66rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.16em", color: accent }}>{n.category}</span>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.74rem", color: muted }}>{n.date}</span>
          </div>
          <h3 style={{ ...head, fontSize: "1.25rem", margin: "0 0 8px", color: fg }}>{n.title}</h3>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "0.92rem", lineHeight: 1.6, color: sec, margin: "0 0 8px", maxWidth: 620 }}>{n.dek}</p>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.74rem", color: muted }}>
            By {n.author} · {n.read} min read
          </div>
        </div>
        <div style={{ paddingTop: 4 }}>
          <span style={{ fontFamily: "var(--font-body-bold)", fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: accent }}>Read →</span>
        </div>
      </article>
    );
  }

  // card layout (used in 3-up grid)
  return (
    <article style={{ display: "flex", flexDirection: "column", gap: 0 }}>
      <MediaBox style={style} ratio="16/9" w={400} h={225} label={n.category} onDark={dark} />
      <div style={{ padding: "16px 0 0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
          <span style={{ fontFamily: "var(--font-body-bold)", fontSize: "0.64rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.16em", color: accent }}>{n.category}</span>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: muted }}>{n.date}</span>
        </div>
        <h3 style={{ ...head, fontSize: "1.05rem", margin: "0 0 8px", color: fg }}>{n.title}</h3>
        <p style={{ fontFamily: "var(--font-body)", fontSize: "0.86rem", lineHeight: 1.55, color: sec, margin: "0 0 10px" }}>{n.dek}</p>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: muted }}>By {n.author} · {n.read} min read</div>
      </div>
    </article>
  );
}

function NCPagination({ dark }) {
  const fg = dark ? "#fff" : "var(--text-primary)";
  const muted = dark ? "rgba(255,255,255,0.7)" : "var(--text-muted)";
  const accent = dark ? "var(--brand-accent)" : "var(--brand-primary)";
  return (
    <div style={{ marginTop: 24, display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 18, borderTop: dark ? "1px solid rgba(255,255,255,0.18)" : "1px solid var(--surface-border)" }}>
      <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.78rem", color: muted }}>Showing 1–5 of 218</div>
      <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
        <button style={{ width: 36, height: 36, border: `1px solid ${dark ? "rgba(255,255,255,0.3)" : "var(--surface-border)"}`, background: "transparent", color: muted, cursor: "default", fontFamily: "var(--font-mono)" }}>‹</button>
        <button style={{ minWidth: 36, height: 36, padding: "0 12px", border: "none", background: accent, color: dark ? "var(--brand-primary)" : "#fff", cursor: "default", fontFamily: "var(--font-body-bold)", fontWeight: 700, fontSize: "0.8rem" }}>1</button>
        <button style={{ minWidth: 36, height: 36, padding: "0 12px", border: `1px solid ${dark ? "rgba(255,255,255,0.3)" : "var(--surface-border)"}`, background: "transparent", color: fg, cursor: "default", fontFamily: "var(--font-body-bold)", fontWeight: 700, fontSize: "0.8rem" }}>2</button>
        <button style={{ minWidth: 36, height: 36, padding: "0 12px", border: `1px solid ${dark ? "rgba(255,255,255,0.3)" : "var(--surface-border)"}`, background: "transparent", color: fg, cursor: "default", fontFamily: "var(--font-body-bold)", fontWeight: 700, fontSize: "0.8rem" }}>3</button>
        <span style={{ padding: "0 8px", color: muted, fontFamily: "var(--font-mono)" }}>…</span>
        <button style={{ minWidth: 36, height: 36, padding: "0 12px", border: `1px solid ${dark ? "rgba(255,255,255,0.3)" : "var(--surface-border)"}`, background: "transparent", color: fg, cursor: "default", fontFamily: "var(--font-body-bold)", fontWeight: 700, fontSize: "0.8rem" }}>44</button>
        <button style={{ width: 36, height: 36, border: `1px solid ${dark ? "rgba(255,255,255,0.3)" : "var(--surface-border)"}`, background: "transparent", color: fg, cursor: "default", fontFamily: "var(--font-mono)" }}>›</button>
      </div>
    </div>
  );
}

function NewsCollection({ style = "default", dark = false, layout = "list" }) {
  if (layout === "grid") {
    return (
      <div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 28 }}>
          {NEWS_ITEMS.slice(0, 3).map((n, i) => <NewsItem key={i} n={n} layout="card" style={style} dark={dark} />)}
        </div>
        <NCPagination dark={dark} />
      </div>
    );
  }

  if (layout === "featured") {
    return (
      <div>
        {/* hero featured */}
        <article style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 32, paddingBottom: 28, borderBottom: dark ? "1px solid rgba(255,255,255,0.18)" : "1px solid var(--surface-border)", marginBottom: 8 }}>
          <MediaBox style={style} ratio="16/9" w={720} h={405} label="lead story" onDark={dark} />
          <div>
            <div style={{ marginBottom: 12 }}><NCSig style={style} dark={dark} width={60} /></div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
              <span style={{ fontFamily: "var(--font-body-bold)", fontSize: "0.66rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.16em", color: dark ? "var(--brand-accent)" : "var(--brand-primary)" }}>Lead story · {NEWS_ITEMS[0].category}</span>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.74rem", color: dark ? "rgba(255,255,255,0.7)" : "var(--text-muted)" }}>{NEWS_ITEMS[0].date}</span>
            </div>
            <h3 style={{ ...NCHeadline(style), fontSize: "1.65rem", margin: "0 0 12px", color: dark ? "#fff" : "var(--text-primary)" }}>{NEWS_ITEMS[0].title}</h3>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "0.95rem", lineHeight: 1.6, color: dark ? "rgba(255,255,255,0.82)" : "var(--text-secondary)", margin: "0 0 12px" }}>{NEWS_ITEMS[0].dek}</p>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.74rem", color: dark ? "rgba(255,255,255,0.7)" : "var(--text-muted)" }}>By {NEWS_ITEMS[0].author} · {NEWS_ITEMS[0].read} min read</div>
          </div>
        </article>
        {/* tail rows */}
        {NEWS_ITEMS.slice(1, 4).map((n, i) => <NewsItem key={i} n={n} layout="row" style={style} dark={dark} />)}
        <NCPagination dark={dark} />
      </div>
    );
  }

  // list (default)
  return (
    <div>
      {NEWS_ITEMS.map((n, i) => <NewsItem key={i} n={n} layout="row" style={style} dark={dark} />)}
      <NCPagination dark={dark} />
    </div>
  );
}

function NewsCollectionPage() {
  const item = (window.AGGIE_CATALOG || []).find(c => c.id === "news-collection");
  return (
    <PageShell item={item}>
      <NCIntro>
        Paginated stream of articles. Three layouts: <strong>list</strong> (most common — thumb + title + dek + meta in horizontal rows), <strong>grid</strong> (3-up cards for landing pages), <strong>featured</strong> (hero on top + 3 tail rows; the homepage news block). Every layout includes the bordered pagination strip below — counts left, page chips right. Category eyebrow uses brand maroon (gold on dark); date sits adjacent in mono.
      </NCIntro>

      <NCSectionLabel>List · default</NCSectionLabel>
      <NCBox label="default · list"><NewsCollection style="default" layout="list" /></NCBox>

      <NCSectionLabel>Featured · default</NCSectionLabel>
      <NCBox label="default · featured"><NewsCollection style="default" layout="featured" /></NCBox>

      <NCSectionLabel>Grid · default</NCSectionLabel>
      <NCBox label="default · grid"><NewsCollection style="default" layout="grid" /></NCBox>

      <NCSectionLabel>Bold</NCSectionLabel>
      <NCBox label="bold · featured"><NewsCollection style="bold" layout="featured" /></NCBox>

      <NCSectionLabel>Elegant</NCSectionLabel>
      <NCBox label="elegant · list"><NewsCollection style="elegant" layout="list" /></NCBox>

      <NCSectionLabel>On dark</NCSectionLabel>
      <NCBox dark label="default · list · on dark"><NewsCollection style="default" layout="list" dark /></NCBox>

      <NCSpecRow>
        <NCSpec label="Layouts" value="list / grid / featured" note="List default; featured for homepages" />
        <NCSpec label="Thumb" value="3:2 (list) · 16:9 (card)" note="Square crop only when source mandates" />
        <NCSpec label="Eyebrow" value="0.66rem caps" note="Category in maroon (gold on dark) + date mono" />
        <NCSpec label="Pagination" value="prev · 1 · 2 · 3 · … · n" note="Bordered strip; count left" />
        <NCSpec label="Lineage" value="SharePoint News" note="Hub / List / Side-by-side / Top-story / Tiles / Carousel — anatomy only" />
      </NCSpecRow>
    </PageShell>
  );
}

// ════════════════════════════════════════════════════════════════════════
// CONTACT CARDS — directory
// ════════════════════════════════════════════════════════════════════════

const PEOPLE = [
  { initials: "DO", name: "Daniella Ortiz",   title: "Senior Research Engineer",       group: "Roadway Geometry Lab",       email: "d-ortiz@tti.tamu.edu",   phone: "979-845-3712", office: "RELLIS 4203" },
  { initials: "MR", name: "Marcus Reyes",      title: "Research Specialist II",        group: "Connected Vehicles Program", email: "m-reyes@tti.tamu.edu",   phone: "979-845-3145", office: "Gibb Gilchrist 410" },
  { initials: "AP", name: "Aja Patel",         title: "Assistant Research Scientist",  group: "Crash Analysis & Modeling",  email: "a-patel@tti.tamu.edu",   phone: "979-845-2841", office: "Gibb Gilchrist 318" },
  { initials: "HL", name: "Howard Lim",        title: "Director, Field Operations",    group: "Field Operations",           email: "h-lim@tti.tamu.edu",     phone: "979-845-3209", office: "RELLIS 4116" },
  { initials: "JK", name: "Jess Kowalski",     title: "Postdoctoral Researcher",       group: "Connected Vehicles Program", email: "j-kowalski@tti.tamu.edu", phone: "979-845-3866", office: "Gibb Gilchrist 422" },
  { initials: "RC", name: "Reyna Castillo",    title: "Communications Manager",        group: "Communications Office",      email: "r-castillo@tti.tamu.edu", phone: "979-845-3027", office: "Gibb Gilchrist 110" },
];

function ContactCardA({ p, style = "default", dark = false, withMedia = true }) {
  const fg = dark ? "#fff" : "var(--text-primary)";
  const muted = dark ? "rgba(255,255,255,0.7)" : "var(--text-muted)";
  const sec = dark ? "rgba(255,255,255,0.82)" : "var(--text-secondary)";
  const accent = dark ? "var(--brand-accent)" : "var(--brand-primary)";
  const head = NCHeadline(style);

  return (
    <article style={{
      border: dark ? "1px solid rgba(255,255,255,0.2)" : "1px solid var(--surface-border)",
      borderRadius: "var(--radius-md)",
      background: dark ? "rgba(0,0,0,0.18)" : "var(--surface-raised)",
      padding: "0",
      display: "flex", flexDirection: "column",
      overflow: "hidden",
    }}>
      {withMedia && (
        <div style={{ aspectRatio: "1/1", position: "relative" }}>
          <MediaBox style={style} ratio="1/1" w={400} h={400} label={p.initials} onDark={dark} />
        </div>
      )}
      <div style={{ padding: "18px 20px 22px", flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{ marginBottom: 10 }}><NCSig style={style} dark={dark} width={48} /></div>
        <h3 style={{ ...head, fontSize: "1.15rem", margin: "0 0 4px", color: fg }}>{p.name}</h3>
        <div style={{ fontFamily: "var(--font-body-bold)", fontSize: "0.78rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: accent, marginBottom: 4 }}>{p.title}</div>
        <div style={{ fontFamily: "var(--font-body)", fontSize: "0.84rem", color: sec, marginBottom: 14, fontStyle: style === "elegant" ? "italic" : "normal" }}>{p.group}</div>

        <div style={{
          marginTop: "auto", paddingTop: 12,
          borderTop: dark ? "1px solid rgba(255,255,255,0.15)" : "1px solid var(--surface-border)",
          display: "flex", flexDirection: "column", gap: 5,
          fontFamily: "var(--font-mono)", fontSize: "0.76rem",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
            <span style={{ color: muted, textTransform: "uppercase", letterSpacing: "0.08em", fontFamily: "var(--font-body-bold)", fontSize: "0.62rem" }}>Email</span>
            <span style={{ color: fg, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.email}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
            <span style={{ color: muted, textTransform: "uppercase", letterSpacing: "0.08em", fontFamily: "var(--font-body-bold)", fontSize: "0.62rem" }}>Phone</span>
            <span style={{ color: fg }}>{p.phone}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
            <span style={{ color: muted, textTransform: "uppercase", letterSpacing: "0.08em", fontFamily: "var(--font-body-bold)", fontSize: "0.62rem" }}>Office</span>
            <span style={{ color: fg }}>{p.office}</span>
          </div>
        </div>
      </div>
    </article>
  );
}

function ContactCardsPage() {
  const item = (window.AGGIE_CATALOG || []).find(c => c.id === "contact-cards");
  return (
    <PageShell item={item}>
      <NCIntro>
        The faculty/staff directory card. Vertical: square portrait, signature rule, name, role, group, then a mono-set contact strip (email · phone · office) with caps-key labels. Used in the 3-up directory grid and on lab/department pages. <strong>Card B</strong> (next page) is the horizontal alternate for inline-with-copy contexts.
      </NCIntro>

      <NCSectionLabel>3-up grid · default</NCSectionLabel>
      <NCBox label="default · 3-up">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
          {PEOPLE.slice(0, 3).map(p => <ContactCardA key={p.name} p={p} style="default" />)}
        </div>
      </NCBox>

      <NCSectionLabel>4-up grid (denser)</NCSectionLabel>
      <NCBox label="default · 4-up">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
          {PEOPLE.slice(0, 4).map(p => <ContactCardA key={p.name} p={p} style="default" />)}
        </div>
      </NCBox>

      <NCSectionLabel>Bold</NCSectionLabel>
      <NCBox label="bold · 3-up">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
          {PEOPLE.slice(0, 3).map(p => <ContactCardA key={p.name} p={p} style="bold" />)}
        </div>
      </NCBox>

      <NCSectionLabel>Elegant</NCSectionLabel>
      <NCBox label="elegant · 3-up">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
          {PEOPLE.slice(0, 3).map(p => <ContactCardA key={p.name} p={p} style="elegant" />)}
        </div>
      </NCBox>

      <NCSectionLabel>Without portrait</NCSectionLabel>
      <NCBox label="default · text-only">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
          {PEOPLE.slice(0, 3).map(p => <ContactCardA key={p.name} p={p} style="default" withMedia={false} />)}
        </div>
      </NCBox>

      <NCSectionLabel>On dark</NCSectionLabel>
      <NCBox dark label="default · 3-up · on dark">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
          {PEOPLE.slice(0, 3).map(p => <ContactCardA key={p.name} p={p} style="default" dark />)}
        </div>
      </NCBox>

      <NCSpecRow>
        <NCSpec label="Portrait" value="1:1 square" note="Optional · text-only fallback supported" />
        <NCSpec label="Title" value="caps · 0.78rem" note="Brand maroon (gold on dark) · Work Sans 700" />
        <NCSpec label="Contact" value="mono 13px" note="Caps-key label / value · 1px divider above" />
        <NCSpec label="Grid" value="3-up / 4-up" note="Stacks 2-up ≤720px; 1-up ≤480px" />
      </NCSpecRow>
    </PageShell>
  );
}

// ════════════════════════════════════════════════════════════════════════
// CONTACT CARDS (B) — horizontal
// ════════════════════════════════════════════════════════════════════════

function ContactCardB({ p, style = "default", dark = false, density = "regular" }) {
  const fg = dark ? "#fff" : "var(--text-primary)";
  const muted = dark ? "rgba(255,255,255,0.7)" : "var(--text-muted)";
  const sec = dark ? "rgba(255,255,255,0.82)" : "var(--text-secondary)";
  const accent = dark ? "var(--brand-accent)" : "var(--brand-primary)";
  const head = NCHeadline(style);
  const compact = density === "compact";

  return (
    <article style={{
      display: "grid",
      gridTemplateColumns: compact ? "64px 1fr auto" : `${compact ? 64 : 96}px 1.2fr 1.4fr auto`,
      gap: compact ? 16 : 22,
      alignItems: compact ? "center" : "start",
      padding: compact ? "14px 18px" : "20px 22px",
      border: dark ? "1px solid rgba(255,255,255,0.18)" : "1px solid var(--surface-border)",
      borderRadius: "var(--radius-sm)",
      background: dark ? "rgba(0,0,0,0.18)" : "var(--surface-raised)",
    }}>
      <div>
        <AvatarBox size={compact ? 56 : 88} initials={p.initials} onDark={dark} />
      </div>

      <div>
        <h3 style={{ ...head, fontSize: compact ? "0.98rem" : "1.15rem", margin: "0 0 3px", color: fg }}>{p.name}</h3>
        <div style={{ fontFamily: "var(--font-body-bold)", fontSize: compact ? "0.72rem" : "0.78rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: accent, marginBottom: compact ? 0 : 4 }}>{p.title}</div>
        {!compact && <div style={{ fontFamily: "var(--font-body)", fontSize: "0.84rem", color: sec, fontStyle: style === "elegant" ? "italic" : "normal" }}>{p.group}</div>}
      </div>

      {!compact && (
        <div style={{ display: "flex", flexDirection: "column", gap: 4, fontFamily: "var(--font-mono)", fontSize: "0.78rem", color: fg, paddingTop: 4 }}>
          <div><span style={{ color: muted, fontFamily: "var(--font-body-bold)", fontSize: "0.62rem", textTransform: "uppercase", letterSpacing: "0.08em", marginRight: 8 }}>EMAIL</span>{p.email}</div>
          <div><span style={{ color: muted, fontFamily: "var(--font-body-bold)", fontSize: "0.62rem", textTransform: "uppercase", letterSpacing: "0.08em", marginRight: 8 }}>PHONE</span>{p.phone}</div>
          <div><span style={{ color: muted, fontFamily: "var(--font-body-bold)", fontSize: "0.62rem", textTransform: "uppercase", letterSpacing: "0.08em", marginRight: 8 }}>OFFICE</span>{p.office}</div>
        </div>
      )}

      <div style={{ alignSelf: "center" }}>
        <span style={{
          display: "inline-flex", alignItems: "center", padding: compact ? "6px 12px" : "8px 16px",
          background: "transparent", color: accent,
          border: `2px solid ${accent}`,
          fontFamily: "var(--font-body-bold)", fontWeight: 700, fontSize: compact ? "0.7rem" : "0.74rem",
          textTransform: "uppercase", letterSpacing: "0.06em",
        }}>Profile →</span>
      </div>
    </article>
  );
}

function ContactCardsBPage() {
  const item = (window.AGGIE_CATALOG || []).find(c => c.id === "contact-cards-b");
  return (
    <PageShell item={item}>
      <NCIntro>
        Horizontal contact card — for sidebar inserts, project-team rosters, and inline-with-copy mentions where vertical card B would feel like a directory takeover. Two densities: <strong>regular</strong> (avatar + name + title + group + contact strip + CTA) and <strong>compact</strong> (avatar + name + title + CTA only — for tight contexts).
      </NCIntro>

      <NCSectionLabel>Stacked list · default</NCSectionLabel>
      <NCBox label="default · regular density">
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {PEOPLE.slice(0, 4).map(p => <ContactCardB key={p.name} p={p} style="default" />)}
        </div>
      </NCBox>

      <NCSectionLabel>Compact</NCSectionLabel>
      <NCBox label="default · compact">
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {PEOPLE.slice(0, 5).map(p => <ContactCardB key={p.name} p={p} style="default" density="compact" />)}
        </div>
      </NCBox>

      <NCSectionLabel>Bold</NCSectionLabel>
      <NCBox label="bold · regular">
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {PEOPLE.slice(0, 3).map(p => <ContactCardB key={p.name} p={p} style="bold" />)}
        </div>
      </NCBox>

      <NCSectionLabel>Elegant</NCSectionLabel>
      <NCBox label="elegant · regular">
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {PEOPLE.slice(0, 3).map(p => <ContactCardB key={p.name} p={p} style="elegant" />)}
        </div>
      </NCBox>

      <NCSectionLabel>2-column</NCSectionLabel>
      <NCBox label="default · 2-column compact">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10 }}>
          {PEOPLE.slice(0, 6).map(p => <ContactCardB key={p.name} p={p} style="default" density="compact" />)}
        </div>
      </NCBox>

      <NCSectionLabel>On dark</NCSectionLabel>
      <NCBox dark label="default · regular · on dark">
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {PEOPLE.slice(0, 3).map(p => <ContactCardB key={p.name} p={p} style="default" dark />)}
        </div>
      </NCBox>

      <NCSpecRow>
        <NCSpec label="Density" value="regular / compact" note="Compact: avatar + name + title + CTA" />
        <NCSpec label="Avatar" value="circle 56 / 88px" note="Compact / regular respectively" />
        <NCSpec label="Layout" value="stack / 2-col" note="2-col reads well at compact density" />
        <NCSpec label="CTA" value="ghost button" note="Always present — links to full profile" />
      </NCSpecRow>
    </PageShell>
  );
}

// ════════════════════════════════════════════════════════════════════════
// COLLECTION FEATURE
// ════════════════════════════════════════════════════════════════════════
//
// "three latest from a larger collection" — shown on landing pages to
// preview a deeper archive (publications, news, projects). Header has the
// usual signature + title + lede, plus a "VIEW ALL →" link top-right.

const COLL_TYPES = {
  publications: {
    eyebrow: "Recent publications",
    title: "Selected research from the last quarter.",
    lede: "Peer-reviewed papers, technical memos, and proceedings — pulled from the broader publications archive.",
    cta: "Browse all 412 publications",
    items: [
      { tag: "Tech memo · 2026", title: "Roadside-sensor placement strategy for early black-ice detection on rural arterials", meta: "Reyes, Ortiz, Patel · 28 pp." },
      { tag: "Journal · 2026",   title: "Variable-message-sign efficacy under low-volume traffic conditions: a 24-corridor comparative study", meta: "Patel, Lim · TRR 2790-04" },
      { tag: "Proceedings · 2025", title: "Drone-derived shoulder geometry as a complement to LiDAR survey in farm-to-market roadway analysis", meta: "Ortiz, Kowalski · TRB Annual Meeting" },
    ],
  },
  projects: {
    eyebrow: "Active research",
    title: "What our investigators are working on right now.",
    lede: "Three of the studies underway across the institute — connected-vehicle pilots, corridor analysis, and behavioral-modeling work.",
    cta: "View the full research portfolio",
    items: [
      { tag: "TxDOT · 0-7204", title: "Black-ice early-warning sensor pilot, I-40 corridor", meta: "PI: Reyes · 2024–2028 · $4.2M" },
      { tag: "FHWA · STEP",    title: "Variable-message-sign behavioral response under fatigue", meta: "PI: Patel · 2025–2027 · $1.8M" },
      { tag: "TxDOT · 0-7011", title: "Shoulder-geometry safety in low-volume rural networks", meta: "PI: Ortiz · 2025–2028 · $2.6M" },
    ],
  },
};

function CollectionFeature({ kind = "publications", style = "default", dark = false, layout = "stack" }) {
  const data = COLL_TYPES[kind];
  const fg = dark ? "#fff" : "var(--text-primary)";
  const muted = dark ? "rgba(255,255,255,0.7)" : "var(--text-muted)";
  const sec = dark ? "rgba(255,255,255,0.82)" : "var(--text-secondary)";
  const accent = dark ? "var(--brand-accent)" : "var(--brand-primary)";
  const head = NCHeadline(style);

  const itemEl = (it, i, last) => (
    <article key={i} style={{
      display: "grid", gridTemplateColumns: "1fr auto", gap: 24, alignItems: "center",
      padding: "20px 0",
      borderBottom: !last ? (dark ? "1px solid rgba(255,255,255,0.18)" : "1px solid var(--surface-border)") : "none",
    }}>
      <div>
        <div style={{ fontFamily: "var(--font-body-bold)", fontSize: "0.66rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.16em", color: accent, marginBottom: 6 }}>{it.tag}</div>
        <h3 style={{ ...head, fontSize: "1.05rem", margin: "0 0 6px", color: fg }}>{it.title}</h3>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.76rem", color: muted }}>{it.meta}</div>
      </div>
      <div>
        <span style={{
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          width: 36, height: 36, borderRadius: "50%",
          background: dark ? "rgba(255,255,255,0.1)" : "color-mix(in srgb, var(--brand-primary) 8%, transparent)",
          color: accent, fontFamily: "var(--font-body-bold)", fontWeight: 700,
        }}>→</span>
      </div>
    </article>
  );

  const itemsBlock = (
    <div>
      {data.items.map((it, i) => itemEl(it, i, i === data.items.length - 1))}
    </div>
  );

  const headerBlock = (
    <div>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 16, marginBottom: 6 }}>
        <div style={{ fontFamily: "var(--font-body-bold)", fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.16em", color: accent }}>{data.eyebrow}</div>
        <span style={{ fontFamily: "var(--font-body-bold)", fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: accent }}>{data.cta} →</span>
      </div>
      <div style={{ marginBottom: 14 }}><NCSig style={style} dark={dark} width={70} /></div>
      <h2 style={{ ...head, fontSize: "1.85rem", margin: "0 0 10px", color: fg }}>{data.title}</h2>
      <p style={{ fontFamily: "var(--font-body)", fontSize: "0.95rem", lineHeight: 1.6, color: sec, margin: 0, maxWidth: 580 }}>{data.lede}</p>
    </div>
  );

  if (layout === "split") {
    return (
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 56, alignItems: "start" }}>
        {headerBlock}
        {itemsBlock}
      </div>
    );
  }

  // stack
  return (
    <div>
      <div style={{ marginBottom: 12 }}>{headerBlock}</div>
      <div style={{ marginTop: 8 }}>{itemsBlock}</div>
    </div>
  );
}

function CollectionFeaturePage() {
  const item = (window.AGGIE_CATALOG || []).find(c => c.id === "collection-feature");
  return (
    <PageShell item={item}>
      <NCIntro>
        "Recent N from a larger collection." Lives on landing pages to preview a deeper archive — publications, projects, news, theses — without dragging the full archive UI in. Two layouts: <strong>stack</strong> (header above items, full width) and <strong>split</strong> (header left, items right; reads as an editorial spread). Both share the eyebrow + signature + headline + lede header and a "View all →" link top-right.
      </NCIntro>

      <NCSectionLabel>Publications · stack · default</NCSectionLabel>
      <NCBox label="default · publications · stack"><CollectionFeature kind="publications" style="default" layout="stack" /></NCBox>

      <NCSectionLabel>Publications · split</NCSectionLabel>
      <NCBox label="default · publications · split"><CollectionFeature kind="publications" style="default" layout="split" /></NCBox>

      <NCSectionLabel>Projects · stack</NCSectionLabel>
      <NCBox label="default · projects · stack"><CollectionFeature kind="projects" style="default" layout="stack" /></NCBox>

      <NCSectionLabel>Bold</NCSectionLabel>
      <NCBox label="bold · publications · split"><CollectionFeature kind="publications" style="bold" layout="split" /></NCBox>

      <NCSectionLabel>Elegant</NCSectionLabel>
      <NCBox label="elegant · projects · stack"><CollectionFeature kind="projects" style="elegant" layout="stack" /></NCBox>

      <NCSectionLabel>On dark</NCSectionLabel>
      <NCBox dark label="default · publications · split · on dark"><CollectionFeature kind="publications" style="default" layout="split" dark /></NCBox>

      <NCSpecRow>
        <NCSpec label="Items" value="3 default" note="2–4 supported · 3 is the canonical count" />
        <NCSpec label="Layouts" value="stack / split" note="Stack for full-width · split for spreads" />
        <NCSpec label="View-all" value="caps + arrow" note="Top-right of header · brand-color link" />
        <NCSpec label="Item row" value="hairline-divided" note="No thumbs — reads as a list, not cards" />
        <NCSpec label="Lineage" value="SharePoint Highlighted-Content Compact" note="3-up &quot;latest from&quot; pull — anatomy only" />
      </NCSpecRow>
    </PageShell>
  );
}

// ════════════════════════════════════════════════════════════════════════
// Export
// ════════════════════════════════════════════════════════════════════════

Object.assign(window, {
  NewsCollectionPage,
  ContactCardsPage,
  ContactCardsBPage,
  CollectionFeaturePage,
});
