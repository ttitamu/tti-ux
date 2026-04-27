/* global React, PageShell, LucideIcon, AGGIE_CATALOG */
/*
 * AggieBreadcrumbs.jsx — Breadcrumbs family.
 *
 *   • Home icon + "Home" (Work Sans 700, teal, underlined)
 *   • Pipe separator (rgb(209,209,209))
 *   • Italic intermediate links (Work Sans italic, teal)
 *   • Final crumb = plain text, no decoration
 *
 * Page-depth variants:
 *   Landing | L2 | L3 | Article
 * Dark-mode mirror.
 */

function BreadcrumbsPage() {
  const item = (window.AGGIE_CATALOG || []).find(c => c.id === "breadcrumbs");
  const depths = [
    { name: "Landing",  trail: ["Home"] },
    { name: "L2",       trail: ["Home", "Research"] },
    { name: "L3",       trail: ["Home", "Research", "Transportation safety"] },
    { name: "Article",  trail: ["Home", "Research", "Transportation safety", "Connected Vehicle Pilot"] },
  ];
  return (
    <PageShell item={item}>
      <div style={{ padding: "16px 20px", marginBottom: 28, background: "color-mix(in srgb, var(--brand-primary) 5%, transparent)", borderLeft: "3px solid var(--brand-primary)", borderRadius: "0 var(--radius-sm) var(--radius-sm) 0", fontSize: "0.92rem", lineHeight: 1.65, color: "var(--text-secondary)" }}>
        Breadcrumbs sit <strong>above the page header</strong> on every non-landing page. The <strong>home crumb</strong> is always present. Intermediate crumbs are italic links. The current page is plain text — not a link to itself. Use <code style={{ fontFamily: "var(--font-mono)", fontSize: "0.85em", background: "rgba(0,0,0,0.05)", padding: "1px 5px", borderRadius: 3 }}>&rsaquo;</code> separators on small viewports (under 560px) where the pipe rule would feel cramped.
      </div>

      {depths.map((d, i) => (
        <div key={d.name} style={{ marginBottom: 28 }}>
          <div style={{ fontSize: "0.62rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--text-muted)", fontFamily: "var(--font-body-bold)", marginBottom: 10 }}>
            page depth · {d.name} ({d.trail.length} crumb{d.trail.length > 1 ? "s" : ""})
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <BreadcrumbBox dark={false}><Breadcrumbs dark={false} trail={d.trail} /></BreadcrumbBox>
            <BreadcrumbBox dark={true}><Breadcrumbs dark={true} trail={d.trail} /></BreadcrumbBox>
          </div>
        </div>
      ))}

      <div style={{ marginTop: 30, padding: "14px 18px", border: "1px solid var(--surface-border)", borderRadius: "var(--radius-md)", background: "var(--surface-raised)", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
        <BCSpec label="Type" value="Work Sans" note="14px, weight 700 on home + links" />
        <BCSpec label="Home link" value="#006483" note="teal, underlined" />
        <BCSpec label="Intermediate" value="italic" note="Work Sans italic, same color" />
        <BCSpec label="Separator" value="│  or  ›" note="rule at &gt;560px, chevron below" />
      </div>
    </PageShell>
  );
}

function BreadcrumbBox({ dark, children }) {
  return (
    <div style={{ border: "1px solid var(--surface-border)", borderRadius: "var(--radius-md)", overflow: "hidden" }}>
      <div style={{ padding: "6px 14px", fontSize: "0.62rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: dark ? "rgba(255,255,255,0.75)" : "var(--text-muted)", fontFamily: "var(--font-body-bold)", background: dark ? "var(--brand-primary)" : "var(--surface-sunken)", borderBottom: dark ? "1px solid rgba(255,255,255,0.15)" : "1px solid var(--surface-border)" }}>
        {dark ? "on dark" : "on light"}
      </div>
      <div style={{ padding: "20px 24px", background: dark ? "var(--brand-primary)" : "#fff" }}>
        {children}
      </div>
    </div>
  );
}

function Breadcrumbs({ dark, trail }) {
  const linkColor = dark ? "#8BCAD8" : "#006483";
  const currentColor = dark ? "rgba(255,255,255,0.85)" : "rgba(0,0,0,0.75)";
  const ruleColor = dark ? "rgba(255,255,255,0.35)" : "rgb(209,209,209)";
  return (
    <nav style={{ display: "flex", alignItems: "center", gap: 10, fontFamily: "var(--font-body-bold)", fontSize: 14, color: currentColor, lineHeight: 1, flexWrap: "wrap" }}>
      {trail.map((label, i) => {
        const isLast = i === trail.length - 1;
        const isHome = i === 0;
        return (
          <React.Fragment key={i}>
            {i > 0 && <span style={{ width: 1, height: 14, background: ruleColor, display: "inline-block" }} />}
            {isHome ? (
              <a href="#" onClick={e => e.preventDefault()} style={{ display: "inline-flex", alignItems: "center", gap: 6, color: linkColor, textDecoration: "underline", fontWeight: 700, fontStyle: "normal" }}>
                <LucideIcon name="home" size={13} color={linkColor} />
                {label}
              </a>
            ) : isLast ? (
              <span style={{ color: currentColor, fontWeight: 400, fontStyle: "normal" }}>{label}</span>
            ) : (
              <a href="#" onClick={e => e.preventDefault()} style={{ color: linkColor, fontStyle: "italic", fontWeight: 400, textDecoration: "none" }}>{label}</a>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}

function BCSpec({ label, value, note }) {
  return (
    <div>
      <div style={{ fontSize: "0.6rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-muted)", fontFamily: "var(--font-body-bold)" }}>{label}</div>
      <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem", color: "var(--brand-primary)", marginTop: 3, fontWeight: 500 }} dangerouslySetInnerHTML={{ __html: value }} />
      {note && <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: 2, lineHeight: 1.4 }} dangerouslySetInnerHTML={{ __html: note }} />}
    </div>
  );
}

Object.assign(window, { BreadcrumbsPage });
