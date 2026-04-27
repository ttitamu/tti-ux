/* global React, PageShell, LucideIcon, AGGIE_CATALOG */
/*
 * AggieSiteNav.jsx — Site navigation family.
 *
 * AggieUX's "site header" is two stacked bars:
 *   1. Utility nav    — small upper strip: persona switcher, quicklinks, search, (optional CTAs)
 *   2. Identity nav   — the main bar: identity (left) + primary menu (center/right) + primary CTA
 *
 * The family varies by SITE TYPE:
 *   • University              — top-level TTI site
 *   • Center / Program        — a center or program under the institute
 *   • Department              — a department within a center
 *   • Application w/ Nav      — internal tool with its own nav (e.g. PECAN)
 *   • Application only        — internal tool with no nav, just identity + user menu
 *
 * Each has a dark-mode mirror. Identity type (lockup vs text) and menu type
 * (dropdown vs mega) are orthogonal — documented on Identities and Menus pages.
 */

function SiteNavPage() {
  const item = (window.AGGIE_CATALOG || []).find(c => c.id === "navigation");
  return (
    <PageShell item={item}>
      <SNIntro>
        The site header is two stacked bars: a thin <strong>utility nav</strong> on top (persona switcher, search, quicklinks, optional CTAs) and the taller <strong>identity nav</strong> beneath it (identity + primary menu). Site type drives composition. Identity type and menu type are configured independently — see <a href="#identities" style={{ color: "var(--brand-primary)" }}>Identities</a> and <a href="#menus" style={{ color: "var(--brand-primary)" }}>Menus</a>.
      </SNIntro>

      <TypeBlock
        type="University"
        desc="Top-level institutional site (e.g. tti.tamu.edu). Utility nav is busier — persona switcher, quicklinks, search, CTAs. Identity uses the institution lockup."
      >
        <SiteHeader type="university" dark={false} />
        <SiteHeader type="university" dark={true} />
      </TypeBlock>

      <TypeBlock
        type="Center / Program"
        desc="A named center or program under the institute. Identity includes the parent institution superhead. Utility row is trimmed — just login + search."
      >
        <SiteHeader type="center" dark={false} />
        <SiteHeader type="center" dark={true} />
      </TypeBlock>

      <TypeBlock
        type="Department"
        desc="A department within a center. Identity shows a department rule under the parent name. Simplest utility bar."
      >
        <SiteHeader type="department" dark={false} />
        <SiteHeader type="department" dark={true} />
      </TypeBlock>

      <TypeBlock
        type="Application with nav"
        desc="Internal tool (e.g. PECAN). Utility nav replaced with app utility — user menu, help, notifications. Primary nav carries app sections."
      >
        <SiteHeader type="app" dark={false} />
        <SiteHeader type="app" dark={true} />
      </TypeBlock>

      <TypeBlock
        type="Application only"
        desc="Single-pane tool with no menu structure. Identity + user menu only. Cleanest possible header."
      >
        <SiteHeader type="app-only" dark={false} />
        <SiteHeader type="app-only" dark={true} />
      </TypeBlock>

      <SNHeading eyebrow="spec" title="At a glance" />
      <SNSpecs>
        <SNSpecItem label="Utility nav height" value="40px" note="44px touch target on small screens" />
        <SNSpecItem label="Identity nav height" value="92px" note="sticky in scroll; reduces to 64px when stuck" />
        <SNSpecItem label="Total (University)" value="132px" />
        <SNSpecItem label="Total (Application)" value="64px" note="no utility bar" />
      </SNSpecs>
    </PageShell>
  );
}

// ── shell helpers ─────────────────────────────────────────────────────
function SNIntro({ children }) {
  return (
    <div style={{ padding: "16px 20px", marginBottom: 36, background: "color-mix(in srgb, var(--brand-primary) 5%, transparent)", borderLeft: "3px solid var(--brand-primary)", borderRadius: "0 var(--radius-sm) var(--radius-sm) 0", fontSize: "0.92rem", lineHeight: 1.65, color: "var(--text-secondary)" }}>
      {children}
    </div>
  );
}

function SNHeading({ eyebrow, title, sub }) {
  return (
    <div style={{ marginTop: 44, marginBottom: 16 }}>
      <div style={{ fontSize: "0.66rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--text-muted)", fontFamily: "var(--font-body-bold)", marginBottom: 8 }}>{eyebrow}</div>
      <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.35rem", fontWeight: 500, margin: "0 0 6px", textTransform: "uppercase", letterSpacing: "0.015em" }}>{title}</h2>
      {sub && <p style={{ margin: 0, fontSize: "0.88rem", color: "var(--text-secondary)", maxWidth: 680 }}>{sub}</p>}
    </div>
  );
}

function TypeBlock({ type, desc, children }) {
  const [light, dark] = React.Children.toArray(children);
  return (
    <div style={{ marginBottom: 44 }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, marginBottom: 14 }}>
        <div>
          <div style={{ fontSize: "0.66rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--text-muted)", fontFamily: "var(--font-body-bold)", marginBottom: 6 }}>
            site type
          </div>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem", fontWeight: 500, margin: "0 0 6px", textTransform: "uppercase", letterSpacing: "0.015em" }}>{type}</h2>
          <p style={{ margin: 0, fontSize: "0.87rem", color: "var(--text-secondary)", lineHeight: 1.55, maxWidth: 760 }}>{desc}</p>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <HeaderFrame label="light">{light}</HeaderFrame>
        <HeaderFrame label="dark" dark>{dark}</HeaderFrame>
      </div>
    </div>
  );
}

function HeaderFrame({ label, dark, children }) {
  return (
    <div style={{ border: "1px solid var(--surface-border)", borderRadius: "var(--radius-md)", overflow: "hidden", background: dark ? "#2a2a2a" : "var(--surface-page)" }}>
      <div style={{ padding: "6px 14px", fontSize: "0.62rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: dark ? "rgba(255,255,255,0.7)" : "var(--text-muted)", fontFamily: "var(--font-body-bold)", borderBottom: dark ? "1px solid rgba(255,255,255,0.1)" : "1px solid var(--surface-border)", background: dark ? "rgba(0,0,0,0.2)" : "var(--surface-sunken)" }}>
        {label}
      </div>
      <div style={{ overflow: "hidden" }}>
        {children}
      </div>
    </div>
  );
}

// ── SiteHeader — the actual header render ──────────────────────────────
function SiteHeader({ type, dark }) {
  const bg = dark ? "var(--brand-primary)" : "#ffffff";
  const stripeBg = dark ? "rgba(0,0,0,0.25)" : "#f1f1f1";
  const stripeText = dark ? "rgba(255,255,255,0.85)" : "rgba(0,0,0,0.75)";
  const idText = dark ? "#ffffff" : "#222222";
  const navText = dark ? "#ffffff" : "#222222";
  const ruleColor = dark ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.1)";
  const accent = dark ? "#DDAC37" : "#5C0025";
  const logoSrc = dark ? "../../assets/logo-dark.svg" : "../../assets/logo.svg";

  const isApp = type === "app" || type === "app-only";
  const isAppOnly = type === "app-only";

  // identity content per type
  const identityName = isApp
    ? "PECAN"
    : type === "center"
    ? "Center for Transportation Safety"
    : type === "department"
    ? "Communications"
    : "Texas A\u2009&\u2009M Transportation Institute";

  const identitySuper = isApp
    ? null
    : type === "center"
    ? "Texas A\u2009&\u2009M Transportation Institute"
    : type === "department"
    ? "Center for Transportation Safety"
    : null;

  const primaryNav = isApp
    ? ["Projects", "Sponsors", "People", "Reports", "Admin"]
    : ["About", "Research", "People", "News", "Publications"];

  const activeIdx = isApp ? 0 : 1;

  return (
    <div style={{ background: bg, color: idText, fontFamily: "var(--font-body)" }}>
      {/* utility nav — top strip */}
      {!isAppOnly && (
        <div style={{ background: stripeBg, padding: "0 24px", height: 40, display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 12, color: stripeText }}>
          {/* left: persona / quicklinks */}
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            {!isApp && <UtilityLink icon="users" label="For researchers" dark={dark} />}
            {!isApp && <UtilityLink icon="graduation-cap" label="For students" dark={dark} />}
            {!isApp && <UtilityLink icon="building" label="For sponsors" dark={dark} />}
            {isApp && <UtilityLink icon="life-buoy" label="Help" dark={dark} />}
            {isApp && <UtilityLink icon="book-open" label="Docs" dark={dark} />}
          </div>
          {/* right: search / login */}
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "4px 10px", background: dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)", borderRadius: 3, color: stripeText, fontSize: 12 }}>
              <LucideIcon name="search" size={12} color={stripeText} />
              Search {!isApp && "tti.tamu.edu"}
            </div>
            {isApp ? (
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <LucideIcon name="bell" size={14} color={stripeText} />
                <div style={{ width: 24, height: 24, borderRadius: "50%", background: accent, color: dark ? "#2a0f15" : "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 600 }}>AG</div>
              </div>
            ) : (
              <UtilityLink icon="log-in" label="Sign in" dark={dark} />
            )}
          </div>
        </div>
      )}

      {/* identity nav — main bar */}
      <div style={{ padding: "0 24px", height: 92, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24, borderBottom: `1px solid ${ruleColor}` }}>
        {/* identity */}
        <div style={{ display: "flex", alignItems: "center", gap: 14, minWidth: 0, flexShrink: 0 }}>
          <img src={logoSrc} width="48" height="48" alt="" style={{ flexShrink: 0 }} />
          <div style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
            {identitySuper && (
              <span style={{ fontFamily: "var(--font-body)", fontSize: 11, letterSpacing: "0.02em", color: dark ? "rgba(255,255,255,0.75)" : "rgba(0,0,0,0.6)", lineHeight: 1.2, marginBottom: 2, whiteSpace: "nowrap" }}>
                {identitySuper}
              </span>
            )}
            {type === "department" && (
              <div style={{ height: 1, background: ruleColor, width: 32, marginBottom: 4 }} />
            )}
            <span style={{ fontFamily: isApp ? "var(--font-display)" : "var(--font-body)", fontSize: isApp ? 20 : 17, fontWeight: isApp ? 500 : 500, letterSpacing: isApp ? "0.02em" : "-0.005em", lineHeight: 1.15, color: idText, textTransform: isApp ? "uppercase" : "none", whiteSpace: "nowrap" }}>
              {identityName}
            </span>
          </div>
        </div>

        {/* primary nav (hide in app-only) */}
        {!isAppOnly && (
          <nav style={{ display: "flex", alignItems: "center", gap: 4, flex: 1, justifyContent: "flex-end" }}>
            {primaryNav.map((x, i) => {
              const active = i === activeIdx;
              return (
                <span key={x} style={{
                  padding: "8px 14px",
                  fontSize: 14,
                  fontWeight: active ? 600 : 500,
                  color: active ? accent : navText,
                  borderBottom: active ? `2px solid ${accent}` : "2px solid transparent",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 5,
                  fontFamily: "var(--font-body)",
                  whiteSpace: "nowrap",
                }}>
                  {x}
                  {(i === 1 || i === 3) && <LucideIcon name="chevron-down" size={12} color="currentColor" />}
                </span>
              );
            })}
            {/* primary CTA */}
            {!isApp && (
              <a href="#" onClick={e => e.preventDefault()} style={{
                marginLeft: 10,
                padding: "9px 18px",
                background: accent,
                color: dark ? "#2a0f15" : "#ffffff",
                fontFamily: "var(--font-body-bold)",
                fontWeight: 700,
                fontSize: 13.5,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                textDecoration: "none",
                whiteSpace: "nowrap",
              }}>
                Request research
              </a>
            )}
          </nav>
        )}

        {/* app-only: user menu on right */}
        {isAppOnly && (
          <div style={{ display: "flex", alignItems: "center", gap: 14, color: stripeText }}>
            <LucideIcon name="bell" size={16} color="currentColor" />
            <LucideIcon name="life-buoy" size={16} color="currentColor" />
            <div style={{ width: 30, height: 30, borderRadius: "50%", background: accent, color: dark ? "#2a0f15" : "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 600, fontFamily: "var(--font-body-bold)" }}>AG</div>
          </div>
        )}
      </div>
    </div>
  );
}

function UtilityLink({ icon, label, dark }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, color: "currentColor", opacity: 0.95, whiteSpace: "nowrap" }}>
      <LucideIcon name={icon} size={12} color="currentColor" />
      {label}
    </span>
  );
}

// ── spec helpers ──────────────────────────────────────────────────────
function SNSpecs({ children }) {
  const items = React.Children.toArray(children);
  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${items.length}, 1fr)`, border: "1px solid var(--surface-border)", borderRadius: "var(--radius-md)", overflow: "hidden", background: "var(--surface-raised)" }}>
      {items.map((c, i) => (
        <div key={i} style={{ padding: "14px 16px", borderLeft: i === 0 ? "none" : "1px solid var(--surface-border)" }}>{c}</div>
      ))}
    </div>
  );
}

function SNSpecItem({ label, value, note }) {
  return (
    <div>
      <div style={{ fontSize: "0.62rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-muted)", fontFamily: "var(--font-body-bold)" }}>{label}</div>
      <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.92rem", color: "var(--brand-primary)", marginTop: 3, fontWeight: 500 }}>{value}</div>
      {note && <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: 3, lineHeight: 1.4 }}>{note}</div>}
    </div>
  );
}

Object.assign(window, { SiteNavPage, SiteHeader });
