/* global React, PageShell, AGGIE_CATALOG, LucideIcon */
/*
 * AggieSpecialized.jsx — Batch 13: Specialized page headers + News story footer.
 *
 *   Specialized page headers — two distinct header patterns that don't
 *                              fit the Standard page header rhythm:
 *                                • Standard News Story Header
 *                                    Back-link · Category-tag · H1 ·
 *                                    deck · byline · read-time
 *                                    Used on every news article body.
 *                                • Profile Page Header
 *                                    Hero band w/ breadcrumbs ·
 *                                    overlapping portrait disc ·
 *                                    name + title + affiliation
 *                                    card · optional Administrative
 *                                    Contact band underneath.
 *                              Both render in the standard 1500-wide
 *                              frame; profile uses an inset 1077-wide
 *                              white card overlapping the maroon
 *                              hero pennant.
 *
 *   News story footer        — end-of-article block. Two templates:
 *                                • Standard — short, single-row.
 *                                  TAM divider centered, optional
 *                                  Tags row + Media Contact box +
 *                                  Share This Story icon row.
 *                                • Landing — taller, two-column.
 *                                  Same components but stacked left
 *                                  with the TAM divider sitting flush
 *                                  right, and a separator before the
 *                                  next article block.
 *                              Three boolean toggles (Has Tags / Has
 *                              Media Contact / Has Social Share) make
 *                              the matrix.
 *
 * Helper prefix: SP (Specialized). All shared helpers prefixed.
 */

// ════════════════════════════════════════════════════════════════════════
// Shared helpers (SP prefix)
// ════════════════════════════════════════════════════════════════════════

function SPBox({ dark = false, label, padded = true, children }) {
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

function SPSectionLabel({ children }) {
  return (
    <div style={{ fontSize: "0.62rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--text-muted)", fontFamily: "var(--font-body-bold)", marginBottom: 12, marginTop: 16 }}>{children}</div>
  );
}

function SPSpecRow({ children }) {
  return (
    <div style={{ marginTop: 28, padding: "14px 18px", border: "1px solid var(--surface-border)", borderRadius: "var(--radius-md)", background: "var(--surface-raised)", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>{children}</div>
  );
}

function SPSpec({ label, value, note }) {
  return (
    <div>
      <div style={{ fontSize: "0.6rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-muted)", fontFamily: "var(--font-body-bold)" }}>{label}</div>
      <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem", color: "var(--brand-primary)", marginTop: 3, fontWeight: 500 }}>{value}</div>
      {note && <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: 2, lineHeight: 1.4 }}>{note}</div>}
    </div>
  );
}

function SPIntro({ children }) {
  return (
    <div style={{ padding: "16px 20px", marginBottom: 28, background: "color-mix(in srgb, var(--brand-primary) 5%, transparent)", borderLeft: "3px solid var(--brand-primary)", borderRadius: "0 var(--radius-sm) var(--radius-sm) 0", fontSize: "0.92rem", lineHeight: 1.65, color: "var(--text-secondary)" }}>
      {children}
    </div>
  );
}

// Style signature for News-Story-Header H1
function SPStyleSig({ style, width = 320 }) {
  const c = "var(--brand-primary)";
  if (style === "bold") {
    return (
      <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
        <div style={{ width: width * 0.55, height: 5, background: c, opacity: 1 }} />
        <div style={{ width: width * 0.18, height: 5, background: c, opacity: 0.5 }} />
        <div style={{ width: width * 0.08, height: 5, background: c, opacity: 0.25 }} />
      </div>
    );
  }
  if (style === "elegant") {
    return (
      <div style={{
        width, height: 8,
        background: `repeating-linear-gradient(135deg, ${c} 0 1.5px, transparent 1.5px 5px)`,
        WebkitMaskImage: "linear-gradient(90deg, #000 0%, #000 60%, transparent 100%)",
        maskImage: "linear-gradient(90deg, #000 0%, #000 60%, transparent 100%)",
      }} />
    );
  }
  return (
    <div style={{ width, height: 1.5, background: `linear-gradient(90deg, transparent, ${c} 12%, ${c} 88%, transparent)` }} />
  );
}

// TAM "Block T" divider — minimal stamp for footers
function SPTAMDivider() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16, color: "var(--brand-primary)" }}>
      <div style={{ flex: 1, height: 1, background: "var(--text-muted)", opacity: 0.3 }} />
      <div style={{
        width: 28, height: 28,
        background: "var(--brand-primary)",
        color: "#fff",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18,
        lineHeight: 1, letterSpacing: 0,
      }}>T</div>
      <div style={{ flex: 1, height: 1, background: "var(--text-muted)", opacity: 0.3 }} />
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════
// SUB-DEMOS
// ════════════════════════════════════════════════════════════════════════

// ─── News-Story-Header — title block + meta ─────────────────────────────
function SPNewsStoryHeader({ dark = false, style = "default", hasReadTime = true, hasOriginalLink = false, withSidebar = true, withImage = false }) {
  const text = dark ? "rgba(255,255,255,0.92)" : "var(--text-primary)";
  const muted = dark ? "rgba(255,255,255,0.65)" : "var(--text-muted)";
  const link = dark ? "rgb(118,194,221)" : "rgb(0,100,131)";

  const titleStyle = (() => {
    if (style === "bold") return { fontFamily: "var(--font-display-bold)", fontWeight: 700, fontStyle: "italic", textTransform: "uppercase", letterSpacing: "0.005em", lineHeight: 1.04 };
    if (style === "elegant") return { fontFamily: "var(--font-display-elegant)", fontWeight: 400, fontStyle: "italic", textTransform: "uppercase", letterSpacing: "0.005em", lineHeight: 1.05 };
    return { fontFamily: "var(--font-display)", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.01em", lineHeight: 1.04 };
  })();

  return (
    <div style={{ width: withSidebar ? 760 : "100%", maxWidth: "100%" }}>
      {/* Back link */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: "var(--font-body-bold)", fontWeight: 700, fontStyle: "italic", fontSize: 14, color: link, marginBottom: 18 }}>
        <span style={{ display: "inline-block", width: 0, height: 0, borderTop: "5px solid transparent", borderBottom: "5px solid transparent", borderRight: `6px solid ${link}` }} />
        BACK TO ALL NEWS
      </div>

      {/* Category + tags row */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14, flexWrap: "wrap" }}>
        <div style={{
          padding: "5px 11px",
          background: "rgba(216,158,76,0.15)",
          color: dark ? "rgb(232,198,143)" : "rgb(123,86,28)",
          fontFamily: "var(--font-body-bold)", fontWeight: 700, fontSize: 11, letterSpacing: "0.1em",
          textTransform: "uppercase",
        }}>RESEARCH</div>
        <span style={{ fontSize: 11, fontFamily: "var(--font-body-bold)", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: muted }}>· Transportation Safety</span>
      </div>

      {/* H1 */}
      <h1 style={{ ...titleStyle, fontSize: 38, color: text, margin: "0 0 6px" }}>
        Texas crash-data dashboard wins national award
      </h1>
      <div style={{ marginBottom: 18 }}>
        <SPStyleSig style={style} width={240} />
      </div>

      {/* Dek */}
      <p style={{
        fontFamily: "var(--font-body)", fontSize: 18, lineHeight: 1.55, color: dark ? "rgba(255,255,255,0.78)" : "var(--text-secondary)",
        margin: "0 0 20px", maxWidth: 660,
      }}>
        Researchers used 12 years of geocoded incident reports to surface the
        intersections most likely to benefit from low-cost engineering changes.
      </p>

      {/* Byline + read time */}
      <div style={{ display: "flex", alignItems: "baseline", gap: 14, color: muted, fontSize: 13, fontFamily: "var(--font-body)", flexWrap: "wrap" }}>
        <span style={{ fontWeight: 600, color: dark ? "rgba(255,255,255,0.85)" : "var(--text-primary)" }}>By Joe Aggie, TTI Communications</span>
        {hasReadTime && (
          <>
            <span style={{ opacity: 0.5 }}>·</span>
            <span>April 14, 2026</span>
            <span style={{ opacity: 0.5 }}>·</span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
              <LucideIcon name="clock" size={12} /> 4&nbsp;min&nbsp;read
            </span>
          </>
        )}
        {hasOriginalLink && (
          <>
            <span style={{ opacity: 0.5 }}>·</span>
            <a style={{ color: link, fontWeight: 600 }}>View original →</a>
          </>
        )}
      </div>

      {/* Optional inline image */}
      {withImage && (
        <div style={{
          marginTop: 28, height: 280, background: "linear-gradient(135deg, var(--surface-sunken), var(--surface-raised))",
          border: "1px solid var(--surface-border)",
          display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)",
          fontFamily: "var(--font-mono)", fontSize: 12, letterSpacing: "0.1em",
        }}>HERO IMAGE · 16:9</div>
      )}
    </div>
  );
}

// ─── Profile Page Header — hero pennant + portrait + admin contact ──────
function SPProfileHeader({ dark = false, style = "default", hasAdminContact = false, hasCustomTags = false, hasPhone = false, hasEmail = false, hasLocation = false }) {
  const titleStyle = (() => {
    if (style === "bold") return { fontFamily: "var(--font-display-bold)", fontWeight: 700, fontStyle: "italic", textTransform: "uppercase", letterSpacing: "0.005em" };
    if (style === "elegant") return { fontFamily: "var(--font-display-elegant)", fontWeight: 400, fontStyle: "italic", textTransform: "uppercase", letterSpacing: "0.005em" };
    return { fontFamily: "var(--font-display)", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.01em" };
  })();

  return (
    <div style={{ position: "relative", width: "100%", paddingBottom: hasAdminContact ? 0 : 24 }}>
      {/* Hero pennant — angled maroon shape */}
      <div style={{
        position: "absolute",
        top: 0, left: 0, right: 0,
        height: 220,
        background: "var(--brand-primary)",
        clipPath: "polygon(0 0, 100% 0, 100% 50%, 0 100%)",
      }} />

      {/* Breadcrumbs on dark hero */}
      <div style={{ position: "relative", padding: "20px 28px 0", color: "rgba(255,255,255,0.85)", fontSize: 12, fontFamily: "var(--font-body-bold)", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>
        Home · Faculty · Engineering
      </div>

      {/* Card row */}
      <div style={{ position: "relative", padding: "60px 28px 0 28px", display: "flex", alignItems: "stretch" }}>
        {/* Portrait disc — overlaps hero edge */}
        <div style={{
          position: "relative",
          width: 150, height: 150, borderRadius: "50%",
          background: "linear-gradient(135deg, rgb(149,70,59), rgb(80,28,28))",
          flexShrink: 0,
          marginTop: -40,
          border: "4px solid #fff",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "rgba(255,255,255,0.35)", fontFamily: "var(--font-display)", fontSize: 48, fontWeight: 500,
        }}>FL</div>

        {/* Info card */}
        <div style={{
          flex: 1, marginLeft: -40,
          background: "#fff",
          border: "1px solid var(--brand-primary)",
          padding: "30px 32px 26px 64px",
          display: "flex", flexDirection: "column", gap: 10,
        }}>
          <div style={{ ...titleStyle, fontSize: 30, lineHeight: 1.1, color: "var(--brand-primary)" }}>
            Dr. Marisol Vega
          </div>
          <div style={{ fontFamily: "var(--font-body-bold)", fontWeight: 700, fontSize: 16, color: "var(--text-primary)" }}>
            Senior Research Scientist · Connected Vehicle Group
          </div>
          <div style={{ fontFamily: "var(--font-body)", fontSize: 14, color: "var(--text-secondary)" }}>
            Transportation Engineering · Texas A&amp;M Transportation Institute
          </div>

          {/* Optional contact rail */}
          {(hasPhone || hasEmail || hasLocation) && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 22px", marginTop: 10, fontSize: 13, fontFamily: "var(--font-body)", color: "var(--text-secondary)" }}>
              {hasPhone && <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><LucideIcon name="phone" size={13} /> 979.555.0142</span>}
              {hasEmail && <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><LucideIcon name="mail" size={13} /> m-vega@tti.tamu.edu</span>}
              {hasLocation && <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><LucideIcon name="map-pin" size={13} /> Gilchrist Bldg · 304</span>}
            </div>
          )}

          {/* Optional custom tags */}
          {hasCustomTags && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 6 }}>
              {["Connected vehicles", "V2X", "Crash analytics", "Traffic safety"].map(t => (
                <span key={t} style={{ padding: "3px 9px", border: "1px solid var(--surface-border)", fontSize: 11, fontFamily: "var(--font-body-bold)", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-secondary)" }}>{t}</span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Administrative contact band */}
      {hasAdminContact && (
        <div style={{
          position: "relative", margin: "16px 28px 0 218px",
          background: "var(--surface-sunken)", border: "2px solid var(--brand-primary)",
          padding: "22px 28px",
          display: "flex", alignItems: "center", gap: 22,
        }}>
          <div style={{
            width: 70, height: 70, borderRadius: "50%",
            background: "linear-gradient(135deg, rgb(149,70,59), rgb(80,28,28))",
            flexShrink: 0, color: "rgba(255,255,255,0.4)", display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 500,
          }}>JA</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "var(--font-body-bold)", fontWeight: 700, fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 4 }}>Administrative Contact</div>
            <div style={{ fontFamily: "var(--font-body-bold)", fontWeight: 700, fontSize: 18, color: "var(--brand-primary)" }}>Joanne Adler</div>
            <div style={{ fontFamily: "var(--font-body)", fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.5 }}>
              Department Coordinator, Connected Vehicle Group<br />
              j-adler@tti.tamu.edu &nbsp;|&nbsp; 979.555.0188
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── News-Story-Footer atoms ─────────────────────────────────────────────
function SPTagsRow({ dark = false }) {
  return (
    <div>
      <div style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.01em", color: dark ? "#fff" : "var(--text-primary)", marginBottom: 10 }}>Tags</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {["Crash data", "Safety", "Dashboards", "Open data"].map(t => (
          <span key={t} style={{
            padding: "5px 11px",
            border: `1px solid ${dark ? "rgba(255,255,255,0.4)" : "var(--surface-border)"}`,
            fontFamily: "var(--font-body-bold)", fontWeight: 700, fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase",
            color: dark ? "rgba(255,255,255,0.85)" : "var(--text-secondary)",
          }}>{t}</span>
        ))}
      </div>
    </div>
  );
}

function SPMediaContact({ dark = false }) {
  return (
    <div>
      <div style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.01em", color: dark ? "#fff" : "var(--text-primary)", marginBottom: 10 }}>Media Contact</div>
      <div style={{
        padding: "14px 18px",
        border: `1px solid ${dark ? "rgba(255,255,255,0.25)" : "var(--surface-border)"}`,
        background: dark ? "rgba(255,255,255,0.04)" : "var(--surface-page)",
      }}>
        <div style={{ fontFamily: "var(--font-body-bold)", fontWeight: 700, fontSize: 15, color: dark ? "#fff" : "var(--text-primary)", marginBottom: 4 }}>Joe Aggie</div>
        <div style={{ fontSize: 13, color: dark ? "rgba(255,255,255,0.7)" : "var(--text-secondary)", lineHeight: 1.5 }}>
          Director of Strategic Communications<br />
          j-aggie@tti.tamu.edu &nbsp;|&nbsp; 979.555.0102
        </div>
      </div>
    </div>
  );
}

function SPSocialShare({ dark = false }) {
  const fg = dark ? "#fff" : "var(--brand-primary)";
  return (
    <div>
      <div style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.01em", color: dark ? "#fff" : "var(--text-primary)", marginBottom: 10 }}>Share This Story</div>
      <div style={{ display: "flex", gap: 10 }}>
        {["facebook", "linkedin", "twitter", "mail"].map(p => {
          const iconName = p === "twitter" ? "twitter" : p === "facebook" ? "facebook" : p === "linkedin" ? "linkedin" : "mail";
          return (
            <a key={p} style={{
              width: 32, height: 32, display: "inline-flex", alignItems: "center", justifyContent: "center",
              color: fg, cursor: "pointer",
            }}>
              <LucideIcon name={iconName} size={20} strokeWidth={1.5} />
            </a>
          );
        })}
      </div>
    </div>
  );
}

function SPNewsFooter({ dark = false, template = "standard", hasTags = true, hasContact = true, hasShare = true }) {
  const showAny = hasTags || hasContact || hasShare;

  if (template === "landing") {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
        <SPTAMDivider />
        {showAny && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
              {hasTags && <SPTagsRow dark={dark} />}
              {hasShare && <SPSocialShare dark={dark} />}
            </div>
            <div>
              {hasContact && <SPMediaContact dark={dark} />}
            </div>
          </div>
        )}
        <div style={{ height: 1, background: dark ? "rgba(255,255,255,0.15)" : "var(--surface-border)" }} />
        <div style={{ fontSize: 12, fontFamily: "var(--font-body-bold)", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: dark ? "rgba(255,255,255,0.55)" : "var(--text-muted)" }}>
          Up next →
        </div>
      </div>
    );
  }

  // Standard: single-row footer with TAM divider, then horizontal blocks
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <SPTAMDivider />
      {showAny && (
        <div style={{ display: "flex", gap: 36, flexWrap: "wrap" }}>
          {hasContact && <div style={{ flex: "1 1 280px", minWidth: 240 }}><SPMediaContact dark={dark} /></div>}
          {hasTags && <div style={{ flex: "1 1 240px", minWidth: 220 }}><SPTagsRow dark={dark} /></div>}
          {hasShare && <div style={{ flex: "0 0 auto" }}><SPSocialShare dark={dark} /></div>}
        </div>
      )}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════
// PAGES
// ════════════════════════════════════════════════════════════════════════

function SpecializedPageHeadersPage() {
  const item = AGGIE_CATALOG.find((x) => x.id === "specialized-page-headers");
  return (
    <PageShell item={item}>
      <SPIntro>
        <strong>Specialized page headers</strong> — two header patterns reserved for specific page templates.
        The <strong>Standard News Story Header</strong> introduces every news article with a back-link, category tag, H1, dek, and byline + read-time row.
        The <strong>Profile Page Header</strong> renders a maroon hero pennant with an overlapping portrait disc and an info card; an optional Administrative Contact band lives directly underneath. Both sit inside the canonical 1500-wide frame.
      </SPIntro>

      <SPSectionLabel>Standard news story header — three style variants</SPSectionLabel>
      <SPBox label="Default · with sidebar"><SPNewsStoryHeader style="default" withSidebar={true} /></SPBox>
      <SPBox label="Bold style"><SPNewsStoryHeader style="bold" withSidebar={true} /></SPBox>
      <SPBox label="Elegant style"><SPNewsStoryHeader style="elegant" withSidebar={true} /></SPBox>

      <SPSectionLabel>News story header — full-width (no sidebar) + with image</SPSectionLabel>
      <SPBox label="Full-width, default"><SPNewsStoryHeader style="default" withSidebar={false} /></SPBox>
      <SPBox label="With hero image"><SPNewsStoryHeader style="default" withSidebar={false} withImage={true} /></SPBox>

      <SPSectionLabel>News story header — dark mode</SPSectionLabel>
      <SPBox dark={true} label="Dark · default"><SPNewsStoryHeader dark={true} style="default" withSidebar={false} /></SPBox>
      <SPBox dark={true} label="Dark · bold"><SPNewsStoryHeader dark={true} style="bold" withSidebar={false} /></SPBox>

      <SPSectionLabel>News story header — meta-row variants</SPSectionLabel>
      <SPBox label="No read time"><SPNewsStoryHeader style="default" withSidebar={false} hasReadTime={false} /></SPBox>
      <SPBox label="With original-source link"><SPNewsStoryHeader style="default" withSidebar={false} hasOriginalLink={true} /></SPBox>

      <SPSectionLabel>Profile page header — three field combinations</SPSectionLabel>
      <SPBox label="Faculty — phone · email · location" padded={false}>
        <SPProfileHeader hasPhone hasEmail hasLocation />
      </SPBox>
      <SPBox label="Faculty — custom research tags" padded={false}>
        <SPProfileHeader hasCustomTags hasPhone hasEmail />
      </SPBox>
      <SPBox label="Faculty + administrative contact band" padded={false}>
        <SPProfileHeader hasAdminContact hasPhone hasEmail hasLocation />
      </SPBox>

      <SPSectionLabel>Profile page header — style variants (heading face)</SPSectionLabel>
      <SPBox label="Bold style — heading face changes only" padded={false}>
        <SPProfileHeader style="bold" hasPhone hasEmail hasLocation />
      </SPBox>
      <SPBox label="Elegant style" padded={false}>
        <SPProfileHeader style="elegant" hasPhone hasEmail hasLocation />
      </SPBox>

      <SPSpecRow>
        <SPSpec label="Frame width" value="1500px" note="Hero pennant spans full frame; card column is 1077px inset" />
        <SPSpec label="Hero pennant" value="height 220 · clip 50%→100%" note="Maroon angled band; breadcrumbs sit on it" />
        <SPSpec label="Portrait disc" value="150 · 4px white" note="Overlaps card by 40px on the left" />
        <SPSpec label="Admin contact" value="2px maroon border" note="Inset to align with card column edge" />
      </SPSpecRow>
    </PageShell>
  );
}

function NewsStoryFooterPage() {
  const item = AGGIE_CATALOG.find((x) => x.id === "news-story-footer");
  return (
    <PageShell item={item}>
      <SPIntro>
        <strong>News story footer</strong> — the end-of-article block. Two templates make the matrix: <strong>Standard</strong> (a single horizontal row used at the bottom of an article body) and <strong>Landing</strong> (a taller two-column block used when the footer is the bridge to the next article). Each one toggles three optional sections — Tags, Media Contact, Share — independently. The TAM <em>Block T</em> divider always opens the footer.
      </SPIntro>

      <SPSectionLabel>Standard template — toggles matrix</SPSectionLabel>
      <SPBox label="Standard — all three (Tags · Media Contact · Share)"><SPNewsFooter template="standard" /></SPBox>
      <SPBox label="Standard — Media Contact + Share only"><SPNewsFooter template="standard" hasTags={false} /></SPBox>
      <SPBox label="Standard — Tags + Share only"><SPNewsFooter template="standard" hasContact={false} /></SPBox>
      <SPBox label="Standard — Media Contact only"><SPNewsFooter template="standard" hasTags={false} hasShare={false} /></SPBox>
      <SPBox label="Standard — divider only"><SPNewsFooter template="standard" hasTags={false} hasContact={false} hasShare={false} /></SPBox>

      <SPSectionLabel>Landing template — bridge to the next article</SPSectionLabel>
      <SPBox label="Landing — all three"><SPNewsFooter template="landing" /></SPBox>
      <SPBox label="Landing — Media Contact + Share"><SPNewsFooter template="landing" hasTags={false} /></SPBox>
      <SPBox label="Landing — Tags + Media Contact"><SPNewsFooter template="landing" hasShare={false} /></SPBox>

      <SPSectionLabel>Dark mode — both templates</SPSectionLabel>
      <SPBox dark={true} label="Dark · Standard — all three"><SPNewsFooter dark={true} template="standard" /></SPBox>
      <SPBox dark={true} label="Dark · Landing — all three"><SPNewsFooter dark={true} template="landing" /></SPBox>

      <SPSpecRow>
        <SPSpec label="TAM divider" value="28×28 maroon stamp" note="Horizontal hairline rules either side, 30% opacity" />
        <SPSpec label="Standard layout" value="single row, 36px gap" note="Contact · Tags · Share, wraps on narrow viewports" />
        <SPSpec label="Landing layout" value="2-col, 40px gap" note="Tags + Share stack left, Contact on right" />
        <SPSpec label="Tags chip" value="11px Work Sans uppercase" note="1px hairline border, no fill" />
      </SPSpecRow>
    </PageShell>
  );
}

// ════════════════════════════════════════════════════════════════════════
// EXPORTS
// ════════════════════════════════════════════════════════════════════════

window.SpecializedPageHeadersPage = SpecializedPageHeadersPage;
window.NewsStoryFooterPage = NewsStoryFooterPage;
