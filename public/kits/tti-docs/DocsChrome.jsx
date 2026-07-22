/* global React, TuxCard, TuxButton, TuxSectionHeader, TuxBadge, LucideIcon, TuxAlert */

const { useState: _useState } = React;

// ─── DocsHeader — sticky top nav ────────────────────────────────────────────
function DocsHeader({ route, onNavigate }) {
  const navItems = [
    { key: "foundations", label: "Foundations" },
    { key: "typography",  label: "Typography" },
    { key: "tokens",      label: "Tokens" },
    { key: "components",  label: "Components" },
    { key: "motion",      label: "Motion" },
  ];
  return (
    <header style={{ position: "sticky", top: 0, zIndex: 10, background: "color-mix(in srgb, var(--surface-raised) 94%, transparent)", borderBottom: "1px solid var(--surface-border)", backdropFilter: "blur(6px)" }}>
      <div style={{ maxWidth: 1180, margin: "0 auto", display: "flex", alignItems: "center", gap: 28, padding: "14px 32px" }}>
        <a
          href="#"
          onClick={(e) => { e.preventDefault(); onNavigate("home"); }}
          style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", color: "inherit" }}
        >
          <img src="../../assets/logo.svg" width="30" height="30" alt="" />
          <div>
            <div style={{ fontSize: "0.9rem", fontWeight: 700, letterSpacing: "0.02em" }}>tti-ux</div>
            <div style={{ fontSize: "0.62rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "var(--tracking-wider)", marginTop: 1 }}>living style guide</div>
          </div>
        </a>
        <nav style={{ display: "flex", gap: 4, marginLeft: 12 }}>
          {navItems.map((n) => {
            const active = route === n.key;
            const [hover, setHover] = [false, () => {}]; // inline items
            return (
              <a
                key={n.key}
                href="#"
                onClick={(e) => { e.preventDefault(); onNavigate(n.key); }}
                className="docs-nav-link"
                data-active={active ? "true" : "false"}
                style={{
                  padding: "6px 12px",
                  borderRadius: "var(--radius-sm)",
                  fontSize: "0.825rem",
                  fontWeight: active ? 600 : 500,
                  color: active ? "var(--brand-primary)" : "var(--text-secondary)",
                  textDecoration: "none",
                  background: active ? "color-mix(in srgb, var(--brand-primary) 6%, transparent)" : "transparent",
                  borderBottom: active ? "2px solid var(--brand-primary)" : "2px solid transparent",
                  borderRadius: 0,
                  transition: "all 150ms",
                }}
              >
                {n.label}
              </a>
            );
          })}
        </nav>
        <div style={{ flex: 1 }} />
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 10px", background: "var(--surface-sunken)", borderRadius: "var(--radius-md)", minWidth: 220 }}>
          <LucideIcon name="search" size={13} />
          <input
            placeholder="Search components, tokens…"
            style={{ flex: 1, border: "none", background: "transparent", outline: "none", fontSize: "0.8rem", fontFamily: "inherit", color: "var(--text-primary)" }}
          />
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--text-muted)", background: "var(--surface-raised)", padding: "2px 5px", borderRadius: 3, border: "1px solid var(--surface-border)" }}>⌘K</span>
        </div>
        <a
          href="https://github.com/anthonyguevara/tti-ux-test"
          target="_blank"
          rel="noopener"
          style={{ color: "var(--text-secondary)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6, fontSize: "0.8rem" }}
        >
          <LucideIcon name="file-text" size={14} />
          Repo
        </a>
      </div>
    </header>
  );
}

// ─── DocsFooter — editorial footer with accessibility toggle ───────────────
function DocsFooter({ highContrast, onToggleHC }) {
  return (
    <footer style={{ borderTop: "1px solid var(--surface-border)", background: "var(--surface-sunken)", marginTop: 80 }}>
      <div style={{ maxWidth: 1180, margin: "0 auto", padding: "48px 32px 36px", display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 40 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <img src="../../assets/logo.svg" width="28" height="28" alt="" />
            <div style={{ fontSize: "0.9rem", fontWeight: 700 }}>tti-ux</div>
          </div>
          <p style={{ fontSize: "0.8rem", lineHeight: 1.6, color: "var(--text-secondary)", maxWidth: 380, margin: 0 }}>
            The shared UI/UX layer for internal Nuxt 4 apps at the <strong>Texas A&amp;M Transportation Institute</strong>. An agency of the State of Texas and member of The Texas A&amp;M University System.
          </p>
        </div>
        <FooterCol title="system">
          <FooterLink>Foundations</FooterLink>
          <FooterLink>Typography</FooterLink>
          <FooterLink>Tokens</FooterLink>
          <FooterLink>Components</FooterLink>
          <FooterLink>Motion</FooterLink>
        </FooterCol>
        <FooterCol title="build">
          <FooterLink>Getting started</FooterLink>
          <FooterLink>Nuxt UI integration</FooterLink>
          <FooterLink>Institution themes</FooterLink>
          <FooterLink>Contribution guide</FooterLink>
        </FooterCol>
        <FooterCol title="meta">
          <FooterLink>Changelog</FooterLink>
          <FooterLink>Accessibility statement</FooterLink>
          <FooterLink>Licensing</FooterLink>
        </FooterCol>
      </div>
      <div style={{ borderTop: "1px solid var(--surface-border)", padding: "18px 32px" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, fontSize: "0.75rem", color: "var(--text-muted)", flexWrap: "wrap" }}>
          <div>tti-ux · v0.1.0 · © 2026 Texas A&amp;M Transportation Institute · Apache 2.0</div>
          <label style={{ display: "inline-flex", alignItems: "center", gap: 8, cursor: "pointer", userSelect: "none" }}>
            <input
              type="checkbox"
              checked={highContrast}
              onChange={onToggleHC}
              style={{ accentColor: "var(--brand-primary)" }}
            />
            <span>High-contrast mode (WCAG AAA)</span>
          </label>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, children }) {
  return (
    <div>
      <div className="eyebrow" style={{ marginBottom: 12 }}>{title}</div>
      <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
        {children}
      </ul>
    </div>
  );
}

function FooterLink({ children }) {
  const [hover, setHover] = _useState(false);
  return (
    <li>
      <a
        href="#"
        onClick={(e) => e.preventDefault()}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{ fontSize: "0.825rem", color: hover ? "var(--brand-primary)" : "var(--text-secondary)", textDecoration: "none", transition: "color 120ms" }}
      >
        {children}
      </a>
    </li>
  );
}

Object.assign(window, { DocsHeader, DocsFooter });
