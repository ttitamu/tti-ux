/* global React, PageShell, AGGIE_CATALOG, LucideIcon */
/*
 * AggieTemplates.jsx — Batch 17: Page templates / whole-page mockups.
 *
 * Four assemblies showing how individual component families compose into
 * production pages:
 *   Center landing     — research center home page
 *   News article       — single news/press story
 *   Faculty profile    — researcher detail page
 *   Event detail       — workshop/conference detail page
 *
 * Each mockup renders at full width but at ~70% type/spacing density so
 * the user can read the entire page composition without scrolling forever.
 * Tabs across the top switch between the four; the active mockup gets a
 * "View on its own" link in case the user wants a fresh artboard later.
 *
 * Helper prefix: TP (Templates).
 */

const { useState } = React;

// ════════════════════════════════════════════════════════════════════════
// Shared helpers (TP prefix)
// ════════════════════════════════════════════════════════════════════════

function TPSectionLabel({ children }) {
  return (
    <div style={{ fontSize: "0.62rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--text-muted)", fontFamily: "var(--font-body-bold)", marginBottom: 12, marginTop: 16 }}>{children}</div>
  );
}

function TPIntro({ children }) {
  return (
    <div style={{ padding: "16px 20px", marginBottom: 28, background: "color-mix(in srgb, var(--brand-primary) 5%, transparent)", borderLeft: "3px solid var(--brand-primary)", borderRadius: "0 var(--radius-sm) var(--radius-sm) 0", fontSize: "0.92rem", lineHeight: 1.65, color: "var(--text-secondary)" }}>
      {children}
    </div>
  );
}

function TPFrame({ label, children, height = "auto" }) {
  return (
    <div style={{
      border: "1px solid var(--surface-border)",
      borderRadius: "var(--radius-md)",
      overflow: "hidden",
      background: "var(--surface-page)",
    }}>
      <div style={{
        padding: "9px 14px", fontSize: "0.62rem", fontWeight: 700,
        textTransform: "uppercase", letterSpacing: "0.12em",
        color: "var(--text-muted)", fontFamily: "var(--font-body-bold)",
        background: "var(--surface-sunken)",
        borderBottom: "1px solid var(--surface-border)",
        display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <span>{label}</span>
        <span style={{ fontFamily: "var(--font-mono)", fontWeight: 500, opacity: 0.6, fontSize: "0.6rem" }}>1280 × auto · light</span>
      </div>
      <div style={{ height, overflow: "hidden", background: "#fafaf9" }}>
        {children}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════
// Building-block atoms used inside the templates
// ════════════════════════════════════════════════════════════════════════

function TPSiteHeader() {
  return (
    <div style={{ background: "#fff", borderBottom: "1px solid rgb(229,229,229)" }}>
      {/* Identity bar */}
      <div style={{
        background: "var(--brand-primary)", color: "#fff",
        padding: "8px 32px", display: "flex", justifyContent: "space-between",
        fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em",
        fontFamily: "var(--font-body-bold)",
      }}>
        <span>Texas A&M Transportation Institute</span>
        <span style={{ display: "flex", gap: 18, opacity: 0.85 }}>
          <span>For researchers</span>
          <span>For sponsors</span>
          <span>Newsroom</span>
        </span>
      </div>
      {/* Main nav */}
      <div style={{ padding: "16px 32px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 36, height: 36, background: "var(--brand-primary)", clipPath: "polygon(50% 0, 100% 100%, 0 100%)" }} />
          <div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: "1rem", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.02em", color: "var(--text-primary)" }}>TTI</div>
            <div style={{ fontSize: "0.65rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.1em", fontFamily: "var(--font-body-bold)", fontWeight: 700 }}>Transportation Institute</div>
          </div>
        </div>
        <nav style={{ display: "flex", gap: 28, fontSize: "0.85rem", fontWeight: 600 }}>
          <span style={{ color: "var(--text-primary)" }}>About</span>
          <span style={{ color: "var(--text-primary)" }}>Research</span>
          <span style={{ color: "var(--text-primary)" }}>Centers &amp; programs</span>
          <span style={{ color: "var(--text-primary)" }}>People</span>
          <span style={{ color: "var(--text-primary)" }}>Publications</span>
          <span style={{ color: "var(--text-primary)" }}>News</span>
        </nav>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <LucideIcon name="search" size={16} color="var(--text-secondary)" />
          <button style={{
            padding: "8px 16px", border: "1px solid var(--brand-primary)",
            background: "transparent", color: "var(--brand-primary)",
            fontFamily: "var(--font-body-bold)", fontWeight: 700,
            fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.1em", cursor: "pointer",
          }}>Donate</button>
        </div>
      </div>
    </div>
  );
}

function TPBreadcrumb({ trail }) {
  return (
    <div style={{ padding: "12px 32px", fontSize: "0.78rem", color: "var(--text-muted)", display: "flex", gap: 8, alignItems: "center" }}>
      {trail.map((t, i) => (
        <React.Fragment key={i}>
          {i > 0 && <LucideIcon name="chevron-right" size={11} />}
          <span style={{ color: i === trail.length - 1 ? "var(--text-primary)" : "var(--text-muted)", fontWeight: i === trail.length - 1 ? 600 : 400 }}>{t}</span>
        </React.Fragment>
      ))}
    </div>
  );
}

function TPSiteFooter() {
  return (
    <footer style={{ background: "var(--brand-primary)", color: "#fff", padding: "48px 32px 0", marginTop: 0 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1.4fr repeat(4, 1fr)", gap: 36, marginBottom: 36 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <div style={{ width: 32, height: 32, background: "#F4D58D", clipPath: "polygon(50% 0, 100% 100%, 0 100%)" }} />
            <div style={{ fontFamily: "var(--font-display)", fontSize: "0.95rem", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.04em" }}>Texas A&M<br/>Transportation Institute</div>
          </div>
          <div style={{ fontSize: "0.78rem", lineHeight: 1.6, opacity: 0.85 }}>
            3135 TAMU<br/>College Station, TX 77843-3135<br/>(979) 845-1535
          </div>
        </div>
        {[
          { h: "Research", l: ["Centers & programs", "Areas of expertise", "Publications", "Patents & licensing"] },
          { h: "People",   l: ["Researchers", "Leadership", "Open positions", "Student programs"] },
          { h: "About",    l: ["Mission & history", "Annual report", "Newsroom", "Contact"] },
          { h: "Connect",  l: ["LinkedIn", "Twitter", "YouTube", "Subscribe"] },
        ].map((c, i) => (
          <div key={i}>
            <div style={{ fontFamily: "var(--font-body-bold)", fontWeight: 700, fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 14, color: "#F4D58D" }}>{c.h}</div>
            {c.l.map(item => (
              <div key={item} style={{ fontSize: "0.82rem", lineHeight: 2, opacity: 0.92 }}>{item}</div>
            ))}
          </div>
        ))}
      </div>
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.18)", padding: "20px 0", display: "flex", justifyContent: "space-between", fontSize: "0.72rem", opacity: 0.7 }}>
        <span>© 2026 Texas A&M Transportation Institute · A Member of The Texas A&M University System</span>
        <span style={{ display: "flex", gap: 18 }}>
          <span>Privacy</span>
          <span>Accessibility</span>
          <span>State Link Policy</span>
        </span>
      </div>
    </footer>
  );
}

function TPSig({ width = 64 }) {
  return <div style={{ width, height: 1, background: "linear-gradient(90deg, transparent 0%, var(--brand-primary) 15%, var(--brand-primary) 85%, transparent 100%)", margin: "16px 0 12px" }} />;
}

function TPEyebrow({ children, color }) {
  return <div style={{ fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em", color: color || "var(--text-muted)", fontFamily: "var(--font-body-bold)", marginBottom: 8 }}>{children}</div>;
}

// ════════════════════════════════════════════════════════════════════════
// TEMPLATE 1 — CENTER LANDING
// ════════════════════════════════════════════════════════════════════════

function TPCenterLanding() {
  return (
    <div>
      <TPSiteHeader />
      <TPBreadcrumb trail={["Home", "Centers & programs", "Center for Connected Vehicles"]} />

      {/* Page header — full bleed display */}
      <section style={{ background: "var(--brand-primary)", color: "#fff", padding: "60px 32px 48px" }}>
        <div style={{ maxWidth: 1100 }}>
          <TPEyebrow color="#F4D58D">Center for</TPEyebrow>
          <h1 style={{
            fontFamily: "var(--font-display)", fontSize: "3.4rem", fontWeight: 500,
            textTransform: "uppercase", letterSpacing: "0.005em",
            margin: "0 0 16px", lineHeight: 1.05, color: "#fff",
          }}>
            Connected &amp; Automated Vehicles
          </h1>
          <div style={{ height: 2, width: 120, background: "#F4D58D", marginBottom: 20 }} />
          <p style={{ fontSize: "1.15rem", lineHeight: 1.55, maxWidth: 720, opacity: 0.92, margin: 0, fontFamily: "var(--font-body)" }}>
            Studying how vehicle-to-everything communication, automated driving systems, and
            evolving infrastructure reshape Texas roadways — from rural freight corridors to
            dense urban interchanges.
          </p>
          <div style={{ display: "flex", gap: 14, marginTop: 28 }}>
            <button style={{ padding: "12px 24px", border: "none", background: "#F4D58D", color: "var(--brand-primary)", fontFamily: "var(--font-body-bold)", fontWeight: 700, fontSize: "0.82rem", textTransform: "uppercase", letterSpacing: "0.1em", cursor: "pointer" }}>Our research areas</button>
            <button style={{ padding: "12px 24px", border: "1px solid rgba(255,255,255,0.35)", background: "transparent", color: "#fff", fontFamily: "var(--font-body-bold)", fontWeight: 700, fontSize: "0.82rem", textTransform: "uppercase", letterSpacing: "0.1em", cursor: "pointer" }}>Meet the team</button>
          </div>
        </div>
      </section>

      {/* Factoids strip */}
      <section style={{ padding: "48px 32px", borderBottom: "1px solid rgb(229,229,229)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 32 }}>
          {[
            { n: "$48M", l: "active research portfolio", s: "across 67 projects" },
            { n: "240+",  l: "researchers and staff",     s: "core + affiliated faculty" },
            { n: "32",    l: "industry partners",          s: "OEMs, agencies, suppliers" },
            { n: "12 yr", l: "leadership in the field",    s: "since center founding in 2014" },
          ].map((f, i) => (
            <div key={i} style={{ borderLeft: i > 0 ? "1px solid rgb(229,229,229)" : "none", paddingLeft: i > 0 ? 32 : 0 }}>
              <div style={{ fontFamily: "var(--font-display)", fontSize: "2.6rem", fontWeight: 500, color: "var(--brand-primary)", lineHeight: 1, letterSpacing: "0.005em" }}>{f.n}</div>
              <div style={{ fontFamily: "var(--font-body-bold)", fontWeight: 700, fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-primary)", marginTop: 8 }}>{f.l}</div>
              <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: 4 }}>{f.s}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Research areas — cards w/ featured */}
      <section style={{ padding: "56px 32px", background: "#fff" }}>
        <TPEyebrow>Areas of expertise</TPEyebrow>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "2rem", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.005em", margin: "0 0 6px", lineHeight: 1.15 }}>What we research</h2>
        <TPSig />
        <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr 1fr", gap: 24, marginTop: 28 }}>
          {/* Featured card */}
          <article style={{ border: "1px solid var(--surface-border)", borderRadius: "var(--radius-md)", overflow: "hidden", background: "#fff" }}>
            <div style={{ aspectRatio: "16 / 9", background: "linear-gradient(135deg, color-mix(in srgb, var(--brand-primary) 18%, transparent), color-mix(in srgb, var(--brand-primary) 6%, transparent))", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)" }}>
              <LucideIcon name="image" size={36} />
            </div>
            <div style={{ padding: 24 }}>
              <TPEyebrow color="var(--brand-primary)">Flagship program</TPEyebrow>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.005em", margin: "0 0 10px", lineHeight: 1.2 }}>Truck Platooning &amp; Freight Corridors</h3>
              <p style={{ fontSize: "0.92rem", lineHeight: 1.6, color: "var(--text-secondary)", margin: "0 0 14px" }}>
                Quantifying fuel, safety, and capacity impacts of cooperative truck-platooning across
                Texas's rural freight network. Field deployments along I-10 and I-35.
              </p>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontFamily: "var(--font-body-bold)", fontWeight: 700, fontStyle: "italic", fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--brand-primary)" }}>Read more <LucideIcon name="arrow-up-right" size={12} /></span>
            </div>
          </article>
          {/* Secondary cards */}
          {[
            { t: "V2X Communications",     d: "DSRC, C-V2X, and 5G testing — protocol stacks for the next decade of cooperative driving." },
            { t: "Human Factors of Automation", d: "How drivers cede and reclaim control — distraction, trust, takeover-time studies." },
          ].map((c, i) => (
            <article key={i} style={{ border: "1px solid var(--surface-border)", borderRadius: "var(--radius-md)", padding: 22, background: "#fff" }}>
              <div style={{ width: 38, height: 38, borderRadius: 8, background: "color-mix(in srgb, var(--brand-primary) 12%, transparent)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--brand-primary)", marginBottom: 14 }}>
                <LucideIcon name={i === 0 ? "wifi" : "user-check"} size={18} />
              </div>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.15rem", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.005em", margin: "0 0 10px", lineHeight: 1.2 }}>{c.t}</h3>
              <p style={{ fontSize: "0.86rem", lineHeight: 1.55, color: "var(--text-secondary)", margin: "0 0 14px" }}>{c.d}</p>
              <span style={{ fontFamily: "var(--font-body-bold)", fontWeight: 700, fontStyle: "italic", fontSize: "0.74rem", textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--brand-primary)" }}>Explore →</span>
            </article>
          ))}
        </div>
      </section>

      {/* Split feature — leadership quote */}
      <section style={{ padding: "56px 32px", background: "var(--surface-sunken)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: 48, alignItems: "center" }}>
          <div style={{ aspectRatio: "5 / 4", background: "linear-gradient(135deg, color-mix(in srgb, var(--brand-primary) 22%, transparent), color-mix(in srgb, var(--brand-primary) 8%, transparent))", borderRadius: "var(--radius-md)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)" }}>
            <LucideIcon name="image" size={42} />
          </div>
          <div>
            <TPEyebrow>From the director</TPEyebrow>
            <blockquote style={{
              fontFamily: "var(--font-display)", fontSize: "1.65rem", fontWeight: 500,
              textTransform: "uppercase", letterSpacing: "0.005em",
              lineHeight: 1.25, margin: "12px 0 24px", color: "var(--text-primary)",
            }}>
              "The corridor is the laboratory. Every mile of Texas freight network is a
              chance to validate what works at speed, in heat, with real cargo."
            </blockquote>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 44, height: 44, borderRadius: "50%", background: "color-mix(in srgb, var(--brand-primary) 18%, transparent)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-display)", color: "var(--brand-primary)", fontSize: "1rem", fontWeight: 500 }}>DA</div>
              <div>
                <div style={{ fontFamily: "var(--font-body-bold)", fontWeight: 700, fontSize: "0.9rem" }}>Dr. Diego Alvarez</div>
                <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>Director · Center for Connected Vehicles</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* News collection */}
      <section style={{ padding: "56px 32px", background: "#fff" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 4 }}>
          <div>
            <TPEyebrow>Latest from the center</TPEyebrow>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "2rem", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.005em", margin: 0, lineHeight: 1.15 }}>News &amp; updates</h2>
          </div>
          <span style={{ fontFamily: "var(--font-body-bold)", fontWeight: 700, fontStyle: "italic", fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--brand-primary)" }}>All news →</span>
        </div>
        <TPSig />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 28, marginTop: 28 }}>
          {[
            { tag: "Press release", date: "Apr 22, 2026", t: "TTI awarded $4.2M FHWA contract for automated truck-platooning study", d: "The four-year program begins this fall and spans I-10 and I-35 corridors." },
            { tag: "Publication",   date: "Apr 14, 2026", t: "New report: Pavement performance under extreme heat in El Paso district", d: "5-year longitudinal study now open-access in the TTI repository." },
            { tag: "Event",         date: "Apr 03, 2026", t: "Texas Connected & Automated Vehicles Workshop registration opens", d: "May 14 at TTI Headquarters — early-bird rates through April 30." },
          ].map((n, i) => (
            <article key={i}>
              <div style={{ aspectRatio: "16 / 10", background: "linear-gradient(135deg, color-mix(in srgb, var(--brand-primary) 14%, transparent), color-mix(in srgb, var(--brand-primary) 4%, transparent))", borderRadius: "var(--radius-sm)", marginBottom: 14, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)" }}>
                <LucideIcon name="image" size={28} />
              </div>
              <div style={{ display: "flex", gap: 12, fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.1em", fontFamily: "var(--font-body-bold)", fontWeight: 700, color: "var(--text-muted)", marginBottom: 8 }}>
                <span style={{ color: "var(--brand-primary)" }}>{n.tag}</span>
                <span>·</span>
                <span>{n.date}</span>
              </div>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.15rem", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.005em", margin: "0 0 8px", lineHeight: 1.2 }}>{n.t}</h3>
              <p style={{ fontSize: "0.85rem", lineHeight: 1.55, color: "var(--text-secondary)", margin: 0 }}>{n.d}</p>
            </article>
          ))}
        </div>
      </section>

      {/* CTA slab */}
      <section style={{ padding: "48px 32px", background: "var(--brand-primary)", color: "#fff" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 32, flexWrap: "wrap" }}>
          <div>
            <TPEyebrow color="#F4D58D">Partner with us</TPEyebrow>
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.65rem", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.005em", margin: 0, color: "#fff", lineHeight: 1.2 }}>Sponsor research, host a project, or join the consortium.</h3>
          </div>
          <button style={{ padding: "14px 28px", border: "none", background: "#F4D58D", color: "var(--brand-primary)", fontFamily: "var(--font-body-bold)", fontWeight: 700, fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.1em", cursor: "pointer" }}>Get in touch</button>
        </div>
      </section>

      <TPSiteFooter />
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════
// TEMPLATE 2 — NEWS ARTICLE
// ════════════════════════════════════════════════════════════════════════

function TPNewsArticle() {
  return (
    <div>
      <TPSiteHeader />
      <TPBreadcrumb trail={["Home", "Newsroom", "Press releases", "FHWA contract awarded"]} />

      {/* Article header */}
      <article style={{ maxWidth: 760, margin: "0 auto", padding: "48px 24px 0" }}>
        <div style={{ display: "flex", gap: 12, fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.12em", fontFamily: "var(--font-body-bold)", fontWeight: 700, color: "var(--text-muted)", marginBottom: 12 }}>
          <span style={{ color: "var(--brand-primary)" }}>Press release</span>
          <span>·</span>
          <span>April 22, 2026</span>
          <span>·</span>
          <span>5 min read</span>
        </div>
        <h1 style={{
          fontFamily: "var(--font-display)", fontSize: "2.6rem", fontWeight: 500,
          textTransform: "uppercase", letterSpacing: "0.005em",
          lineHeight: 1.1, margin: "0 0 18px",
        }}>
          TTI Awarded $4.2M FHWA Contract to Study Automated Truck-Platooning Impacts on Texas Freight Corridors
        </h1>
        <TPSig width={80} />
        <p style={{ fontSize: "1.18rem", lineHeight: 1.55, color: "var(--text-secondary)", margin: "0 0 24px", fontStyle: "italic" }}>
          The four-year program — the largest single platooning study FHWA has funded —
          will deploy instrumented truck pairs along I-10 and I-35 to quantify fuel, safety,
          and capacity impacts at scale.
        </p>
        <div style={{ display: "flex", gap: 16, alignItems: "center", paddingBottom: 28, borderBottom: "1px solid rgb(229,229,229)" }}>
          <div style={{ width: 44, height: 44, borderRadius: "50%", background: "color-mix(in srgb, var(--brand-primary) 18%, transparent)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-display)", color: "var(--brand-primary)", fontWeight: 500 }}>HM</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "var(--font-body-bold)", fontWeight: 700, fontSize: "0.85rem" }}>Hayes Mendoza</div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Communications · TTI Press Office</div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {["share-2", "linkedin", "twitter"].map(i => (
              <button key={i} style={{ width: 34, height: 34, border: "1px solid var(--surface-border)", borderRadius: 4, background: "transparent", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-secondary)", cursor: "pointer" }}>
                <LucideIcon name={i} size={14} />
              </button>
            ))}
          </div>
        </div>
      </article>

      {/* Body */}
      <article style={{ maxWidth: 760, margin: "0 auto", padding: "32px 24px 48px", fontSize: "1rem", lineHeight: 1.75, color: "var(--text-secondary)" }}>
        <p style={{ marginTop: 0 }}>
          The Federal Highway Administration this week announced TTI as lead investigator
          on a four-year, $4.2 million study of how cooperative truck platooning performs
          across Texas's busiest freight corridors. Project lead Dr. Diego Alvarez and a
          team drawn from three TTI research centers will instrument fifteen Class-8 truck
          pairs and conduct continuous field deployments through 2030.
        </p>
        <p>
          The study answers a question that has dogged platooning policy since the first
          DSRC field trials a decade ago: what really happens when cooperative driving meets
          mile-marker-by-mile-marker reality — at-grade crossings, weigh stations, weather
          extremes, and shared lanes with non-cooperative traffic.
        </p>

        {/* Pullquote */}
        <blockquote style={{
          margin: "32px 0", padding: "24px 28px",
          borderLeft: "4px solid var(--brand-primary)",
          background: "color-mix(in srgb, var(--brand-primary) 5%, transparent)",
          fontFamily: "var(--font-display)", fontSize: "1.4rem", fontWeight: 500,
          textTransform: "uppercase", letterSpacing: "0.005em",
          lineHeight: 1.25, color: "var(--text-primary)",
        }}>
          "We've validated the physics in simulation. Now we need 10,000 instrumented miles
          to learn what the simulation can't tell us."
          <footer style={{ marginTop: 14, fontFamily: "var(--font-body)", fontSize: "0.82rem", textTransform: "none", letterSpacing: 0, fontWeight: 500, color: "var(--text-muted)", fontStyle: "italic" }}>— Dr. Diego Alvarez, principal investigator</footer>
        </blockquote>

        <p>
          The work builds on TTI's I-35 connected-vehicle testbed, which has hosted V2X
          experiments since 2019. Field crews will instrument participating trucks with
          dual radar, V2X radios, fuel-flow telemetry, and 360° camera arrays — feeding a
          purpose-built data lake hosted at the Riverside Campus.
        </p>

        {/* Inline factoid strip */}
        <div style={{
          margin: "32px 0", padding: "24px 28px",
          background: "var(--surface-sunken)",
          borderRadius: "var(--radius-md)",
          display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 28,
        }}>
          {[
            { n: "$4.2M", l: "FHWA contract" },
            { n: "15",    l: "instrumented truck pairs" },
            { n: "10K+",  l: "miles of field telemetry" },
          ].map((f, i) => (
            <div key={i}>
              <div style={{ fontFamily: "var(--font-display)", fontSize: "2rem", fontWeight: 500, color: "var(--brand-primary)", lineHeight: 1 }}>{f.n}</div>
              <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: 6, fontFamily: "var(--font-body-bold)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>{f.l}</div>
            </div>
          ))}
        </div>

        <p>
          Findings will be published quarterly through the TTI Open Research Repository,
          with annual policy briefings to FHWA, TxDOT, and the Texas freight industry
          coalition.
        </p>
      </article>

      {/* Story footer — author + tags + related */}
      <section style={{ maxWidth: 760, margin: "0 auto", padding: "0 24px 48px" }}>
        <div style={{ borderTop: "1px solid rgb(229,229,229)", paddingTop: 24, display: "flex", flexWrap: "wrap", gap: 8 }}>
          {["Connected vehicles", "Freight", "FHWA", "Truck platooning", "Field study"].map(t => (
            <span key={t} style={{ padding: "5px 12px", border: "1px solid var(--surface-border)", borderRadius: 999, fontSize: "0.75rem", color: "var(--text-secondary)" }}>{t}</span>
          ))}
        </div>
      </section>

      {/* Related */}
      <section style={{ padding: "48px 32px", background: "var(--surface-sunken)" }}>
        <div style={{ maxWidth: 1024, margin: "0 auto" }}>
          <TPEyebrow>Related coverage</TPEyebrow>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.6rem", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.005em", margin: 0, lineHeight: 1.15 }}>More from the freight beat</h2>
          <TPSig />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24, marginTop: 24 }}>
            {[
              { t: "USDOT freight resilience pooled-fund kicks off",        d: "Mar 14, 2026" },
              { t: "Texas Crash Cost Estimate methodology hits v3.0",       d: "Mar 02, 2026" },
              { t: "El Paso pavement-heat study published in TRB Record",   d: "Feb 21, 2026" },
            ].map((n, i) => (
              <article key={i} style={{ background: "#fff", border: "1px solid var(--surface-border)", borderRadius: "var(--radius-sm)", padding: 18 }}>
                <div style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-muted)", fontFamily: "var(--font-body-bold)", fontWeight: 700, marginBottom: 8 }}>{n.d}</div>
                <h4 style={{ fontFamily: "var(--font-display)", fontSize: "1rem", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.005em", margin: 0, lineHeight: 1.25 }}>{n.t}</h4>
              </article>
            ))}
          </div>
        </div>
      </section>

      <TPSiteFooter />
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════
// TEMPLATE 3 — FACULTY PROFILE
// ════════════════════════════════════════════════════════════════════════

function TPFacultyProfile() {
  return (
    <div>
      <TPSiteHeader />
      <TPBreadcrumb trail={["Home", "People", "Researchers", "Dr. Marisol Adler"]} />

      {/* Profile header */}
      <section style={{ padding: "48px 32px", background: "#fff", borderBottom: "1px solid rgb(229,229,229)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "240px 1fr 280px", gap: 40, alignItems: "flex-start", maxWidth: 1280, margin: "0 auto" }}>
          {/* Portrait */}
          <div style={{
            aspectRatio: "4 / 5",
            background: "linear-gradient(135deg, color-mix(in srgb, var(--brand-primary) 22%, transparent), color-mix(in srgb, var(--brand-primary) 6%, transparent))",
            borderRadius: "var(--radius-md)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "var(--font-display)", fontSize: "4rem", fontWeight: 500,
            color: "var(--brand-primary)", letterSpacing: "0.02em",
          }}>MA</div>

          {/* Identity + headline */}
          <div>
            <TPEyebrow>Senior Research Engineer</TPEyebrow>
            <h1 style={{
              fontFamily: "var(--font-display)", fontSize: "2.6rem", fontWeight: 500,
              textTransform: "uppercase", letterSpacing: "0.005em",
              margin: "0 0 4px", lineHeight: 1.05,
            }}>Dr. Marisol Adler</h1>
            <div style={{ fontSize: "1rem", color: "var(--text-muted)", marginBottom: 18, fontStyle: "italic" }}>
              Roadway Operations · Center for Transportation Safety
            </div>
            <TPSig width={120} />
            <p style={{ fontSize: "1rem", lineHeight: 1.65, color: "var(--text-secondary)", margin: "12px 0 20px", maxWidth: 600 }}>
              Marisol leads TTI's adaptive signal-control research portfolio. Her work
              integrates field telemetry, simulation, and machine learning to make
              corridor-scale signal timing responsive to actual conditions — not the
              90-day average.
            </p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {["Adaptive signal control", "Corridor optimization", "Microsimulation", "Field telemetry", "Texas freight"].map(t => (
                <span key={t} style={{ padding: "5px 11px", border: "1px solid color-mix(in srgb, var(--brand-primary) 30%, transparent)", borderRadius: 999, fontSize: "0.74rem", color: "var(--brand-primary)", fontWeight: 500 }}>{t}</span>
              ))}
            </div>
          </div>

          {/* Contact card */}
          <div style={{ border: "1px solid var(--surface-border)", borderRadius: "var(--radius-md)", padding: 22, background: "var(--surface-sunken)" }}>
            <TPEyebrow>Contact</TPEyebrow>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, fontSize: "0.86rem" }}>
              <a style={{ display: "flex", gap: 10, alignItems: "center", color: "var(--text-primary)", textDecoration: "none" }}>
                <LucideIcon name="mail" size={14} color="var(--brand-primary)" />
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem" }}>m-adler@tti.tamu.edu</span>
              </a>
              <a style={{ display: "flex", gap: 10, alignItems: "center", color: "var(--text-primary)", textDecoration: "none" }}>
                <LucideIcon name="phone" size={14} color="var(--brand-primary)" />
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem" }}>(979) 845-1535 ext. 4218</span>
              </a>
              <a style={{ display: "flex", gap: 10, alignItems: "center", color: "var(--text-primary)", textDecoration: "none" }}>
                <LucideIcon name="map-pin" size={14} color="var(--brand-primary)" />
                <span>Riverside Campus · Bldg 7029, Rm 240</span>
              </a>
              <a style={{ display: "flex", gap: 10, alignItems: "center", color: "var(--text-primary)", textDecoration: "none" }}>
                <LucideIcon name="graduation-cap" size={14} color="var(--brand-primary)" />
                <span>Ph.D. Civil Engineering · UT Austin, 2014</span>
              </a>
            </div>
            <button style={{
              width: "100%", marginTop: 20,
              padding: "11px 18px", border: "none",
              background: "var(--brand-primary)", color: "#fff",
              fontFamily: "var(--font-body-bold)", fontWeight: 700,
              fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: "0.1em", cursor: "pointer",
            }}>Schedule a meeting</button>
            <button style={{
              width: "100%", marginTop: 8,
              padding: "11px 18px", border: "1px solid var(--surface-border)",
              background: "transparent", color: "var(--text-primary)",
              fontFamily: "var(--font-body-bold)", fontWeight: 700,
              fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: "0.1em", cursor: "pointer",
            }}>Download CV</button>
          </div>
        </div>
      </section>

      {/* Body — 2-col with sidebar */}
      <section style={{ padding: "48px 32px", maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 48, alignItems: "flex-start" }}>
          {/* Main */}
          <div>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.005em", margin: "0 0 6px" }}>About</h2>
            <TPSig />
            <p style={{ fontSize: "0.98rem", lineHeight: 1.75, color: "var(--text-secondary)", marginTop: 14 }}>
              Marisol joined TTI in 2015 after postdoctoral work at the University of California
              Berkeley PATH program. She holds a Ph.D. in Civil Engineering from the University
              of Texas at Austin (2014) and a B.S. from Texas A&M (2008).
            </p>
            <p style={{ fontSize: "0.98rem", lineHeight: 1.75, color: "var(--text-secondary)" }}>
              Her current portfolio includes the FHWA-funded Texas Adaptive Corridor program,
              the I-10 freight signal-coordination study, and a collaborative effort with the
              City of Austin on emergency-vehicle preemption.
            </p>

            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.005em", margin: "32px 0 6px" }}>Recent publications</h2>
            <TPSig />
            <div style={{ marginTop: 14 }}>
              {[
                { y: "2026", t: "Corridor-scale adaptive signal control under non-recurrent congestion", v: "Transportation Research Part C, Vol. 162", a: "Adler, M. · Bonham, T. · Caldwell, M." },
                { y: "2025", t: "Field validation of microscopic flow models on Texas urban freight corridors", v: "TRB Record, 2719", a: "Adler, M. · Bishop, T." },
                { y: "2025", t: "Emergency-vehicle preemption — a year of telemetry from Austin", v: "TTI Technical Report 0-7142-R3", a: "Adler, M. · Choi, W. · Cardenas, I." },
              ].map((p, i) => (
                <div key={i} style={{ padding: "16px 0", borderBottom: i === 2 ? "none" : "1px solid rgb(235,235,235)" }}>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "var(--brand-primary)", fontWeight: 600, marginBottom: 4 }}>{p.y}</div>
                  <div style={{ fontFamily: "var(--font-body-bold)", fontWeight: 700, fontSize: "0.96rem", marginBottom: 4, lineHeight: 1.35 }}>{p.t}</div>
                  <div style={{ fontSize: "0.84rem", color: "var(--text-secondary)", fontStyle: "italic" }}>{p.v}</div>
                  <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: 3 }}>{p.a}</div>
                </div>
              ))}
            </div>

            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.005em", margin: "32px 0 6px" }}>Active projects</h2>
            <TPSig />
            <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
              {[
                { t: "Texas Adaptive Corridor",       s: "FHWA · 2024–2027", d: "Statewide adaptive signal-control program covering 12 corridors." },
                { t: "I-10 Freight Signal Coordination", s: "TxDOT · 2025–2026", d: "Phase-2 deployment of cooperative signal timing on the I-10 logistics route." },
              ].map((p, i) => (
                <div key={i} style={{ padding: 16, border: "1px solid var(--surface-border)", borderRadius: "var(--radius-sm)" }}>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--text-muted)", fontWeight: 600, marginBottom: 4 }}>{p.s}</div>
                  <div style={{ fontFamily: "var(--font-body-bold)", fontWeight: 700, fontSize: "0.92rem", marginBottom: 4 }}>{p.t}</div>
                  <div style={{ fontSize: "0.82rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>{p.d}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <aside style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ border: "1px solid var(--surface-border)", borderRadius: "var(--radius-md)", padding: 20 }}>
              <TPEyebrow>By the numbers</TPEyebrow>
              <div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 12 }}>
                {[
                  { n: "47", l: "publications" },
                  { n: "$12.3M", l: "funded research" },
                  { n: "11", l: "years at TTI" },
                  { n: "8", l: "Ph.D. students advised" },
                ].map((s, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", borderBottom: i === 3 ? "none" : "1px solid rgb(235,235,235)", paddingBottom: i === 3 ? 0 : 14 }}>
                    <span style={{ fontFamily: "var(--font-display)", fontSize: "1.4rem", fontWeight: 500, color: "var(--brand-primary)", lineHeight: 1 }}>{s.n}</span>
                    <span style={{ fontSize: "0.78rem", color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.06em", fontFamily: "var(--font-body-bold)", fontWeight: 700 }}>{s.l}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ border: "1px solid var(--surface-border)", borderRadius: "var(--radius-md)", padding: 20 }}>
              <TPEyebrow>Affiliations</TPEyebrow>
              <ul style={{ margin: "12px 0 0", padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 10, fontSize: "0.84rem", color: "var(--text-secondary)" }}>
                <li>TRB · ACP25 Standing Committee</li>
                <li>ITE · Texas District board member</li>
                <li>IEEE ITSS · Senior member</li>
                <li>Center for Transportation Safety</li>
              </ul>
            </div>
          </aside>
        </div>
      </section>

      <TPSiteFooter />
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════
// TEMPLATE 4 — EVENT DETAIL
// ════════════════════════════════════════════════════════════════════════

function TPEventDetail() {
  return (
    <div>
      <TPSiteHeader />
      <TPBreadcrumb trail={["Home", "Events", "Workshops", "Connected & Automated Vehicles Workshop"]} />

      {/* Event header */}
      <section style={{ padding: "48px 32px", background: "var(--brand-primary)", color: "#fff" }}>
        <div style={{ maxWidth: 1024, margin: "0 auto", display: "grid", gridTemplateColumns: "120px 1fr", gap: 36 }}>
          {/* Date block */}
          <div style={{ textAlign: "center", borderRight: "2px solid #F4D58D", paddingRight: 24 }}>
            <div style={{ fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.18em", color: "rgba(255,255,255,0.75)", fontFamily: "var(--font-body-bold)" }}>Thursday</div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: "1.4rem", fontWeight: 500, textTransform: "uppercase", color: "#fff", marginTop: 8 }}>May</div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: "4rem", fontWeight: 500, color: "#F4D58D", lineHeight: 1, marginTop: 4 }}>14</div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem", color: "rgba(255,255,255,0.7)", marginTop: 10 }}>2026</div>
          </div>
          {/* Title + meta */}
          <div>
            <span style={{ display: "inline-block", padding: "4px 12px", border: "1px solid rgba(244,213,141,0.5)", borderRadius: 999, fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.14em", color: "#F4D58D", fontFamily: "var(--font-body-bold)", fontWeight: 700, marginBottom: 14 }}>Workshop · Day 1 of 1</span>
            <h1 style={{
              fontFamily: "var(--font-display)", fontSize: "2.7rem", fontWeight: 500,
              textTransform: "uppercase", letterSpacing: "0.005em",
              margin: "0 0 18px", lineHeight: 1.05, color: "#fff",
            }}>Texas Connected &amp; Automated Vehicles Workshop</h1>
            <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "10px 18px", fontSize: "0.92rem", maxWidth: 600 }}>
              <span style={{ display: "flex", alignItems: "center", gap: 8, opacity: 0.7 }}><LucideIcon name="clock" size={14} color="#F4D58D" /> When</span>
              <span style={{ color: "#fff" }}>9:00 a.m. – 4:30 p.m. CDT · check-in opens at 8:30</span>
              <span style={{ display: "flex", alignItems: "center", gap: 8, opacity: 0.7 }}><LucideIcon name="map-pin" size={14} color="#F4D58D" /> Where</span>
              <span style={{ color: "#fff" }}>TTI Headquarters, Bryan-College Station Conference Center, Room 240</span>
              <span style={{ display: "flex", alignItems: "center", gap: 8, opacity: 0.7 }}><LucideIcon name="users" size={14} color="#F4D58D" /> Audience</span>
              <span style={{ color: "#fff" }}>Researchers, agency partners, graduate students</span>
              <span style={{ display: "flex", alignItems: "center", gap: 8, opacity: 0.7 }}><LucideIcon name="ticket" size={14} color="#F4D58D" /> Cost</span>
              <span style={{ color: "#fff" }}>$120 general · $60 students · early-bird ends April 30</span>
            </div>
            <div style={{ display: "flex", gap: 12, marginTop: 28 }}>
              <button style={{ padding: "13px 26px", border: "none", background: "#F4D58D", color: "var(--brand-primary)", fontFamily: "var(--font-body-bold)", fontWeight: 700, fontSize: "0.82rem", textTransform: "uppercase", letterSpacing: "0.1em", cursor: "pointer" }}>Register now</button>
              <button style={{ padding: "13px 22px", border: "1px solid rgba(255,255,255,0.4)", background: "transparent", color: "#fff", fontFamily: "var(--font-body-bold)", fontWeight: 700, fontSize: "0.82rem", textTransform: "uppercase", letterSpacing: "0.1em", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 8 }}><LucideIcon name="calendar-plus" size={13} color="#fff" /> Add to calendar</button>
            </div>
          </div>
        </div>
      </section>

      {/* Body */}
      <section style={{ padding: "48px 32px", maxWidth: 1024, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 48, alignItems: "flex-start" }}>
          {/* Main */}
          <div>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.005em", margin: "0 0 6px" }}>About this workshop</h2>
            <TPSig />
            <p style={{ fontSize: "1rem", lineHeight: 1.75, color: "var(--text-secondary)", marginTop: 14 }}>
              The fifth annual Texas CAV Workshop convenes practitioners, researchers, and
              policymakers around what's actually deployed — not what's promised. Sessions
              focus on field results from active testbeds across the state, with case studies
              spanning urban arterials, rural freight, and emergency response.
            </p>

            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.005em", margin: "32px 0 6px" }}>Agenda</h2>
            <TPSig />
            <div style={{ marginTop: 14 }}>
              {[
                { time: "9:00",  block: "Welcome &amp; opening remarks",                speaker: "Dr. Diego Alvarez, TTI" },
                { time: "9:30",  block: "Keynote — V2X at scale: lessons from I-35",     speaker: "Dr. Marcus Caldwell, TTI" },
                { time: "10:30", block: "Coffee &amp; demos",                            speaker: "Lobby" },
                { time: "11:00", block: "Panel — Cooperative truck platooning in Texas", speaker: "FHWA · TxDOT · industry" },
                { time: "12:30", block: "Lunch",                                          speaker: "Dining hall" },
                { time: "1:30",  block: "Field demonstrations",                          speaker: "Riverside Annex · Field Lab 4" },
                { time: "3:00",  block: "Workshop session — research roadmap 2026–2030", speaker: "Breakout rooms A–C" },
                { time: "4:15",  block: "Closing remarks &amp; reception",               speaker: "Dr. Marisol Adler" },
              ].map((row, i) => (
                <div key={i} style={{
                  display: "grid", gridTemplateColumns: "80px 1fr",
                  gap: 18, padding: "12px 0",
                  borderBottom: i === 7 ? "none" : "1px solid rgb(235,235,235)",
                }}>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem", color: "var(--brand-primary)", fontWeight: 600 }}>{row.time}</div>
                  <div>
                    <div style={{ fontFamily: "var(--font-body-bold)", fontWeight: 700, fontSize: "0.95rem", color: "var(--text-primary)" }} dangerouslySetInnerHTML={{ __html: row.block }} />
                    <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: 2, fontStyle: "italic" }}>{row.speaker}</div>
                  </div>
                </div>
              ))}
            </div>

            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.005em", margin: "32px 0 6px" }}>Featured speakers</h2>
            <TPSig />
            <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
              {[
                { i: "MC", n: "Dr. Marcus Caldwell", r: "Center for Air Quality" },
                { i: "MA", n: "Dr. Marisol Adler",   r: "Roadway Operations" },
                { i: "DA", n: "Dr. Diego Alvarez",   r: "Freight Mobility" },
              ].map((s, i) => (
                <div key={i} style={{ padding: 16, border: "1px solid var(--surface-border)", borderRadius: "var(--radius-md)" }}>
                  <div style={{ width: 48, height: 48, borderRadius: "50%", background: "color-mix(in srgb, var(--brand-primary) 18%, transparent)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-display)", fontSize: "1.05rem", fontWeight: 500, color: "var(--brand-primary)", marginBottom: 12 }}>{s.i}</div>
                  <div style={{ fontFamily: "var(--font-body-bold)", fontWeight: 700, fontSize: "0.92rem" }}>{s.n}</div>
                  <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: 2 }}>{s.r}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <aside style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ background: "var(--surface-sunken)", borderRadius: "var(--radius-md)", padding: 20 }}>
              <TPEyebrow>Quick facts</TPEyebrow>
              <dl style={{ margin: "12px 0 0", display: "grid", gridTemplateColumns: "1fr", gap: 10, fontSize: "0.84rem" }}>
                {[
                  ["Format", "In-person · Hybrid available"],
                  ["Capacity", "180 attendees"],
                  ["CEUs", "0.7 PDH credits"],
                  ["Parking", "Free, Lot 4"],
                  ["Streaming", "Day-of YouTube link"],
                ].map(([k, v]) => (
                  <div key={k} style={{ paddingBottom: 8, borderBottom: "1px solid rgb(229,229,229)" }}>
                    <dt style={{ fontFamily: "var(--font-body-bold)", fontWeight: 700, fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-muted)" }}>{k}</dt>
                    <dd style={{ margin: "3px 0 0", color: "var(--text-primary)" }}>{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div style={{ border: "1px solid color-mix(in srgb, var(--brand-primary) 30%, transparent)", borderRadius: "var(--radius-md)", padding: 20, background: "color-mix(in srgb, var(--brand-primary) 4%, transparent)" }}>
              <TPEyebrow color="var(--brand-primary)">Sponsored by</TPEyebrow>
              <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 12 }}>
                {["FHWA", "TxDOT", "Texas A&M System"].map(s => (
                  <div key={s} style={{ height: 44, background: "#fff", border: "1px solid var(--surface-border)", borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-body-bold)", fontWeight: 700, fontSize: "0.85rem", color: "var(--text-muted)", letterSpacing: "0.08em" }}>{s}</div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </section>

      <TPSiteFooter />
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════
// TEMPLATES PAGE — tabs across 4 mockups
// ════════════════════════════════════════════════════════════════════════

const TP_TEMPLATES = [
  { id: "landing",  label: "Center landing",  Mockup: TPCenterLanding,  blurb: "Research-center home page — page header, factoid strip, areas-of-expertise cards, leadership pull-quote, news collection, partnership CTA, footer." },
  { id: "news",     label: "News article",    Mockup: TPNewsArticle,    blurb: "Single press story — headline, eyebrow + dateline, lede, author byline, body with pull-quote and inline factoid strip, tag cloud, related stories." },
  { id: "profile",  label: "Faculty profile", Mockup: TPFacultyProfile, blurb: "Researcher detail page — portrait, headline + tags, contact card, about, recent publications, active projects, by-the-numbers + affiliations sidebar." },
  { id: "event",    label: "Event detail",    Mockup: TPEventDetail,    blurb: "Workshop/conference detail — date block + maroon hero, agenda table, featured speakers, quick-facts + sponsors sidebar, register CTA." },
];

function TemplatesPage() {
  const item = (window.AGGIE_CATALOG || []).find(c => c.id === "templates");
  const [active, setActive] = useState(TP_TEMPLATES[0].id);
  const current = TP_TEMPLATES.find(t => t.id === active);
  const Mockup = current.Mockup;

  return (
    <PageShell item={item}>
      <TPIntro>
        <strong>Page templates</strong> — four whole-page assemblies showing how the
        component families compose into production pages. None of these introduce new
        primitives; everything you see is built from page headers, cards, factoids,
        pull-quotes, contact cards, news collections, footers, etc. Tabs switch between
        the four; each renders in a 1280-wide light frame so the full page composition
        is visible at a glance.
      </TPIntro>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 0, borderBottom: "1px solid var(--surface-border)", marginBottom: 18 }}>
        {TP_TEMPLATES.map(t => (
          <button
            key={t.id}
            onClick={() => setActive(t.id)}
            style={{
              padding: "12px 20px", border: "none",
              background: "transparent",
              color: t.id === active ? "var(--brand-primary)" : "var(--text-muted)",
              fontFamily: "var(--font-body-bold)", fontWeight: 700,
              fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: "0.08em",
              cursor: "pointer", position: "relative", marginBottom: -1,
              borderBottom: t.id === active ? "2px solid var(--brand-primary)" : "2px solid transparent",
            }}>
            {t.label}
          </button>
        ))}
      </div>

      <div style={{ marginBottom: 14, fontSize: "0.92rem", lineHeight: 1.6, color: "var(--text-secondary)" }}>
        {current.blurb}
      </div>

      <TPSectionLabel>{current.label}</TPSectionLabel>
      <TPFrame label={current.label.toUpperCase()}>
        <div style={{ width: "100%", overflow: "hidden" }}>
          <Mockup />
        </div>
      </TPFrame>

      <div style={{ marginTop: 28, padding: "14px 18px", border: "1px solid var(--surface-border)", borderRadius: "var(--radius-md)", background: "var(--surface-raised)", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
        <div>
          <div style={{ fontSize: "0.6rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-muted)", fontFamily: "var(--font-body-bold)" }}>composition</div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem", color: "var(--brand-primary)", marginTop: 3, fontWeight: 500 }}>{TP_TEMPLATES.length} templates</div>
          <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: 2, lineHeight: 1.4 }}>Built from already-shipped component families.</div>
        </div>
        <div>
          <div style={{ fontSize: "0.6rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-muted)", fontFamily: "var(--font-body-bold)" }}>chrome</div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem", color: "var(--brand-primary)", marginTop: 3, fontWeight: 500 }}>shared</div>
          <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: 2, lineHeight: 1.4 }}>Identity bar + main nav + footer constant across all four.</div>
        </div>
        <div>
          <div style={{ fontSize: "0.6rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-muted)", fontFamily: "var(--font-body-bold)" }}>style variant</div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem", color: "var(--brand-primary)", marginTop: 3, fontWeight: 500 }}>default shown</div>
          <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: 2, lineHeight: 1.4 }}>All three style variants apply — these mockups demonstrate composition, not switching.</div>
        </div>
        <div>
          <div style={{ fontSize: "0.6rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-muted)", fontFamily: "var(--font-body-bold)" }}>scale</div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem", color: "var(--brand-primary)", marginTop: 3, fontWeight: 500 }}>1280-wide</div>
          <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: 2, lineHeight: 1.4 }}>Type and spacing densities tuned for desktop reading.</div>
        </div>
      </div>
    </PageShell>
  );
}

// ════════════════════════════════════════════════════════════════════════
// EXPORT
// ════════════════════════════════════════════════════════════════════════

Object.assign(window, { TemplatesPage });
