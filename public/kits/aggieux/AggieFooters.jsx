/* global React, PageShell, LucideIcon, AGGIE_CATALOG */
/*
 * AggieFooters.jsx — Footer + Subfooter families.
 *
 * Footer:
 *   • Main block — logo column + N link columns (2-4 columns), optional newsletter block
 *   • Compliance footer — social icons, utility links (accessibility, privacy, etc)
 *
 * Subfooter (TAMUS legal strip):
 *   • MANDATORY on every TTI page per README rule
 *   • Horizontal strip: TAMUS lockup + cycling footer + Coordinated Statewide Transportation
 *     Research Program tagline + © University line + state-agency compliance links
 */

function FootersPage() {
  const item = (window.AGGIE_CATALOG || []).find(c => c.id === "footers");
  return (
    <PageShell item={item}>
      <FIntro>
        The site footer is a two-block structure — a <strong>main block</strong> (logo + link columns + optional newsletter) above a slim <strong>compliance footer</strong> (social + utility links). Every TTI site then closes with the <a href="#subfooter" style={{ color: "var(--brand-primary)" }}>TAMUS subfooter</a> — non-negotiable, legally required.
      </FIntro>

      <FSection eyebrow="column layout" title="3 columns · default" desc="The most common arrangement. Logo column + Institute + Research. Used on tti.tamu.edu.">
        <FBox dark={false}><SiteFooter dark={false} columns={3} /></FBox>
        <FBox dark={true}><SiteFooter dark={true} columns={3} /></FBox>
      </FSection>

      <FSection eyebrow="column layout" title="4 columns · broad site" desc="When there's more to surface — publications, news, contact. Use on large sites with many sub-sections.">
        <FBox dark={false}><SiteFooter dark={false} columns={4} /></FBox>
        <FBox dark={true}><SiteFooter dark={true} columns={4} /></FBox>
      </FSection>

      <FSection eyebrow="with newsletter" title="3 columns + newsletter" desc="Replace one link column with an email signup. Keep the search bar on the right.">
        <FBox dark={false}><SiteFooter dark={false} columns={3} newsletter /></FBox>
        <FBox dark={true}><SiteFooter dark={true} columns={3} newsletter /></FBox>
      </FSection>

      <FSection eyebrow="compact" title="Application footer" desc="For internal tools (PECAN, etc). Skip the main block; compliance strip only, with app-specific utility links.">
        <FBox dark={false}><AppFooter dark={false} /></FBox>
        <FBox dark={true}><AppFooter dark={true} /></FBox>
      </FSection>

      <FSpecStrip>
        <FSpec label="Main block padding" value="48px 0" note="top + bottom" />
        <FSpec label="Column gap" value="24px" />
        <FSpec label="Column width" value="368px" note="fixed · flows to 2-col under 960px" />
        <FSpec label="Compliance footer" value="56px tall" note="#f1f1f1 light · rgba(0,0,0,0.3) dark" />
      </FSpecStrip>
    </PageShell>
  );
}

function SubfooterPage() {
  const item = (window.AGGIE_CATALOG || []).find(c => c.id === "subfooter");
  return (
    <PageShell item={item}>
      <FIntro>
        The <strong>TAMUS subfooter</strong> is the legal strip that appears beneath the site footer on every page. It's a Texas A&amp;M University System requirement for all TAMUS member institutions. It must include the TAMUS lockup, the Coordinated Statewide Transportation Research Program tagline (TTI-specific), state-agency compliance links, and the © line. <strong>Do not modify the link list, tagline wording, or lockup.</strong>
      </FIntro>

      <FSection eyebrow="required" title="Standard TAMUS subfooter" desc="Drop in as-is. The only field you configure is the institute name in the © line.">
        <FBox dark={false}><TAMUSSubfooter dark={false} /></FBox>
        <FBox dark={true}><TAMUSSubfooter dark={true} /></FBox>
      </FSection>

      <FSection eyebrow="legal checklist" title="Required links">
        <SubfooterRules />
      </FSection>
    </PageShell>
  );
}

// ──────────────────────────────────────────────────────────────────
// SiteFooter — the main footer block + compliance row
// ──────────────────────────────────────────────────────────────────
function SiteFooter({ dark, columns = 3, newsletter = false }) {
  const bg = dark ? "var(--brand-primary)" : "#ffffff";
  const textColor = dark ? "#fff" : "#222";
  const mutedColor = dark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.6)";
  const headColor = dark ? "rgba(255,255,255,0.9)" : "#5C0025";
  const ruleColor = dark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.08)";
  const logoSrc = dark ? "../../assets/logo-dark.svg" : "../../assets/logo.svg";

  const colData = [
    { head: "About", links: ["Our story", "Leadership", "Careers", "Contact"] },
    { head: "Research", links: ["Focus areas", "Publications", "Proving Ground", "Data & tools"] },
    { head: "Connect", links: ["News", "Events", "Media inquiries", "Subscribe"] },
    { head: "Resources", links: ["For students", "For sponsors", "For partners", "Give to TTI"] },
  ];

  const visibleCols = colData.slice(0, newsletter ? columns - 1 : columns);

  return (
    <div style={{ background: bg, color: textColor, fontFamily: "var(--font-body)" }}>
      {/* main block */}
      <div style={{ display: "grid", gridTemplateColumns: newsletter ? `320px repeat(${columns - 1}, 1fr) 1.2fr` : `320px repeat(${columns - 1}, 1fr)`, gap: 24, padding: "40px 32px" }}>
        {/* logo column */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <img src={logoSrc} width="52" height="52" alt="" />
            <div style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
              <span style={{ fontSize: 10.5, letterSpacing: "0.02em", color: mutedColor, lineHeight: 1.2 }}>an agency of the State of Texas</span>
              <span style={{ fontFamily: "var(--font-body)", fontSize: 15, fontWeight: 500, color: textColor, lineHeight: 1.25, letterSpacing: "-0.005em" }}>
                Texas A&nbsp;&amp;&nbsp;M Transportation Institute
              </span>
            </div>
          </div>
          <div style={{ fontSize: 13, color: mutedColor, lineHeight: 1.55 }}>
            3135 TAMU<br />
            College Station, TX 77843-3135<br />
            <span style={{ color: dark ? "#DDAC37" : "#006483" }}>(979) 317-2000</span>
          </div>
        </div>

        {/* link columns */}
        {visibleCols.map((col, i) => (
          <div key={i} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 13, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.08em", color: headColor }}>
              {col.head}
            </div>
            {col.links.map((x, j) => (
              <span key={j} style={{ fontSize: 13.5, color: textColor, lineHeight: 1.4 }}>{x}</span>
            ))}
          </div>
        ))}

        {/* newsletter block */}
        {newsletter && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 13, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.08em", color: headColor }}>
              Stay in the loop
            </div>
            <div style={{ fontSize: 13, color: mutedColor, lineHeight: 1.5 }}>
              Monthly research brief. No filler.
            </div>
            <div style={{ display: "flex", border: `2px solid ${dark ? "rgba(255,255,255,0.6)" : "#000"}`, height: 42, background: dark ? "rgba(255,255,255,0.08)" : "#fff", marginTop: 4 }}>
              <div style={{ flex: 1, display: "flex", alignItems: "center", padding: "0 12px", fontFamily: "var(--font-body-bold)", fontStyle: "italic", fontSize: 13.5, color: dark ? "rgba(255,255,255,0.65)" : "rgb(83,83,83)" }}>
                your@email.edu
              </div>
              <button style={{ padding: "0 14px", background: dark ? "#DDAC37" : "#5C0025", color: dark ? "#2A0E15" : "#fff", border: "none", fontFamily: "var(--font-body-bold)", fontWeight: 700, fontSize: 12, textTransform: "uppercase", letterSpacing: "0.05em", cursor: "pointer" }}>
                Subscribe
              </button>
            </div>
          </div>
        )}
      </div>

      {/* compliance footer */}
      <div style={{ borderTop: `1px solid ${ruleColor}`, padding: "14px 32px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, background: dark ? "rgba(0,0,0,0.25)" : "rgba(0,0,0,0.03)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          {["linkedin", "twitter", "youtube", "rss"].map(i => (
            <LucideIcon key={i} name={i} size={14} color={mutedColor} />
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 18, fontSize: 11.5, color: mutedColor }}>
          {["Accessibility", "Site policies", "Privacy", "Sitemap"].map(x => <span key={x}>{x}</span>)}
        </div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────
// AppFooter — slim compliance strip for internal tools
// ──────────────────────────────────────────────────────────────────
function AppFooter({ dark }) {
  const bg = dark ? "rgba(0,0,0,0.3)" : "rgba(0,0,0,0.04)";
  const textColor = dark ? "rgba(255,255,255,0.75)" : "rgba(0,0,0,0.65)";
  return (
    <div style={{ background: bg, padding: "14px 32px", display: "flex", alignItems: "center", justifyContent: "space-between", fontFamily: "var(--font-body)", fontSize: 12, color: textColor }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: dark ? "#DDAC37" : "#5C0025", fontWeight: 600 }}>PECAN v2.14.3</span>
        <span style={{ opacity: 0.6 }}>·</span>
        <span>© 2026 Texas A&nbsp;&amp;&nbsp;M Transportation Institute</span>
      </div>
      <div style={{ display: "flex", gap: 16 }}>
        <span>Docs</span>
        <span>Support</span>
        <span>Status</span>
        <span>Changelog</span>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────
// TAMUSSubfooter — the mandatory state-system legal strip
// ──────────────────────────────────────────────────────────────────
function TAMUSSubfooter({ dark }) {
  const bg = dark ? "#1a1a1a" : "#2a2a2a"; // always darker than site footer
  const textColor = "rgba(255,255,255,0.85)";
  const mutedColor = "rgba(255,255,255,0.55)";
  const linkColor = "#DDAC37";

  return (
    <div style={{ background: bg, color: textColor, padding: "22px 32px", fontFamily: "var(--font-body)", fontSize: 12, lineHeight: 1.6 }}>
      <div style={{ display: "grid", gridTemplateColumns: "auto 1fr auto", gap: 32, alignItems: "flex-start" }}>
        {/* TAMUS lockup placeholder */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 44, height: 44, borderRadius: "50%", background: "rgba(255,255,255,0.12)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 500, color: linkColor, border: "1px solid rgba(221,172,55,0.3)" }}>
            A
          </div>
          <div>
            <div style={{ fontSize: 10, letterSpacing: "0.04em", color: mutedColor, textTransform: "uppercase" }}>A Member of</div>
            <div style={{ fontFamily: "var(--font-body-bold)", fontWeight: 600, fontSize: 13, color: textColor }}>The Texas A&nbsp;&amp;&nbsp;M University System</div>
          </div>
        </div>

        {/* middle column: tagline + © */}
        <div style={{ fontSize: 12, color: textColor, lineHeight: 1.5, minWidth: 0 }}>
          <div style={{ color: mutedColor, marginBottom: 4 }}>
            Coordinated Statewide Transportation Research Program
          </div>
          <div>
            © 2026 Texas A&nbsp;&amp;&nbsp;M Transportation Institute · 3135 TAMU · College Station, TX 77843-3135
          </div>
          <div style={{ marginTop: 6, display: "flex", flexWrap: "wrap", gap: 14 }}>
            {["State Link Policy", "Texas Veterans Portal", "Open Records / Public Information", "Risk, Fraud & Misconduct Hotline", "Statewide Search", "Site Links & Policies"].map(x => (
              <span key={x} style={{ color: linkColor, borderBottom: `1px solid ${linkColor}`, paddingBottom: 1 }}>{x}</span>
            ))}
          </div>
        </div>

        {/* right column: system seal placeholder */}
        <div style={{ textAlign: "right", fontSize: 10, color: mutedColor }}>
          <div style={{ width: 50, height: 50, borderRadius: "50%", border: `2px solid ${mutedColor}`, marginLeft: "auto", marginBottom: 4 }} />
          State of<br />Texas
        </div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────
// Rules checklist for subfooter
// ──────────────────────────────────────────────────────────────────
function SubfooterRules() {
  const rules = [
    { label: "TAMUS lockup", body: "Left-anchored. Links to tamus.edu. Never substitute with just the TTI logo here." },
    { label: "Tagline", body: "\u201CCoordinated Statewide Transportation Research Program\u201D \u2014 TTI-specific. Must appear verbatim." },
    { label: "© line", body: "\u00A9 [year] Texas A\u2009\u0026\u2009M Transportation Institute + address. Update year each January." },
    { label: "State Link Policy", body: "Required for all .edu sites in the TAMUS network. Do not rename or remove." },
    { label: "Veterans Portal", body: "Links to veterans.portal.texas.gov. State agency requirement." },
    { label: "Open Records", body: "Texas Public Information Act compliance. Links to tti.tamu.edu/about/open-records." },
    { label: "Risk/Fraud Hotline", body: "TAMUS hotline link. Required by Texas Government Code." },
    { label: "Statewide Search", body: "Links to search.texas.gov. State agency standard." },
  ];
  return (
    <div style={{ border: "1px solid var(--surface-border)", borderRadius: "var(--radius-md)", overflow: "hidden", background: "var(--surface-raised)" }}>
      {rules.map((r, i) => (
        <div key={r.label} style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: 20, padding: "12px 18px", borderTop: i === 0 ? "none" : "1px solid var(--surface-border)" }}>
          <div style={{ fontFamily: "var(--font-body-bold)", fontSize: "0.82rem", fontWeight: 600, color: "var(--brand-primary)" }}>{r.label}</div>
          <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.55 }}>{r.body}</div>
        </div>
      ))}
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────
// Shell helpers
// ──────────────────────────────────────────────────────────────────
function FIntro({ children }) {
  return (
    <div style={{ padding: "16px 20px", marginBottom: 32, background: "color-mix(in srgb, var(--brand-primary) 5%, transparent)", borderLeft: "3px solid var(--brand-primary)", borderRadius: "0 var(--radius-sm) var(--radius-sm) 0", fontSize: "0.92rem", lineHeight: 1.65, color: "var(--text-secondary)" }}>
      {children}
    </div>
  );
}

function FSection({ eyebrow, title, desc, children }) {
  return (
    <div style={{ marginBottom: 36 }}>
      <div style={{ marginBottom: 14 }}>
        <div style={{ fontSize: "0.66rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--text-muted)", fontFamily: "var(--font-body-bold)", marginBottom: 6 }}>{eyebrow}</div>
        <div style={{ fontFamily: "var(--font-display)", fontSize: "1.05rem", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.015em" }}>{title}</div>
        {desc && <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: 4, lineHeight: 1.55, maxWidth: 720 }}>{desc}</div>}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {children}
      </div>
    </div>
  );
}

function FBox({ dark, children }) {
  return (
    <div style={{ border: "1px solid var(--surface-border)", borderRadius: "var(--radius-md)", overflow: "hidden" }}>
      <div style={{ padding: "6px 14px", fontSize: "0.62rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: dark ? "rgba(255,255,255,0.75)" : "var(--text-muted)", fontFamily: "var(--font-body-bold)", background: dark ? "var(--brand-primary)" : "var(--surface-sunken)", borderBottom: dark ? "1px solid rgba(255,255,255,0.15)" : "1px solid var(--surface-border)" }}>
        {dark ? "on dark" : "on light"}
      </div>
      <div style={{ background: dark ? "var(--brand-primary)" : "#fff" }}>{children}</div>
    </div>
  );
}

function FSpecStrip({ children }) {
  const items = React.Children.toArray(children);
  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${items.length}, 1fr)`, border: "1px solid var(--surface-border)", borderRadius: "var(--radius-md)", overflow: "hidden", background: "var(--surface-raised)", marginTop: 16 }}>
      {items.map((c, i) => <div key={i} style={{ padding: "14px 16px", borderLeft: i === 0 ? "none" : "1px solid var(--surface-border)" }}>{c}</div>)}
    </div>
  );
}

function FSpec({ label, value, note }) {
  return (
    <div>
      <div style={{ fontSize: "0.6rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-muted)", fontFamily: "var(--font-body-bold)" }}>{label}</div>
      <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem", color: "var(--brand-primary)", marginTop: 3, fontWeight: 500 }}>{value}</div>
      {note && <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: 2, lineHeight: 1.4 }}>{note}</div>}
    </div>
  );
}

Object.assign(window, { FootersPage, SubfooterPage, SiteFooter, TAMUSSubfooter });
