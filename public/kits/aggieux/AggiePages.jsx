/* global React, LucideIcon, AGGIE_CATALOG, PageShell, ScaffoldPlaceholder */
/*
 * AggiePages.jsx — page-level content.
 *
 * Two special pages get real content:
 *   - "intro"          → overview / what this kit is / how to use
 *   - "style-variants" → live demo of default/bold/elegant section headers
 *
 * Everything else uses PageShell + ScaffoldPlaceholder (from AggieChrome.jsx)
 * as the default — they'll be fleshed out in future passes.
 */

// ─── IntroPage ─────────────────────────────────────────────────────────────
function IntroPage() {
  const catalog = window.AGGIE_CATALOG || [];
  const counts = catalog.reduce((acc, c) => { acc[c.page] = (acc[c.page] || 0) + 1; return acc; }, {});
  const totalFams = catalog.length;
  const readyFams = catalog.filter(c => c.status === "ready").length;
  const scaffoldFams = catalog.filter(c => c.status === "scaffold").length;

  return (
    <div style={{ padding: "48px 48px 80px", maxWidth: 920 }}>
      <div style={{ fontSize: "0.68rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.11em", color: "var(--text-muted)", fontFamily: "var(--font-body-bold)", marginBottom: 10 }}>
        Foundations · overview
      </div>
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: "2.8rem", fontWeight: 500, letterSpacing: "0.01em", margin: "0 0 18px", textTransform: "uppercase", lineHeight: 1.05 }}>
        AggieUX reference kit
      </h1>
      <p style={{ fontSize: "1.05rem", lineHeight: 1.65, color: "var(--text-secondary)", margin: "0 0 18px", maxWidth: 680 }}>
        A TTI-branded recreation of the <strong>Aggie UX 1.7</strong> editorial component library — the public-facing design system shared across TAMU institutions. We're rebuilding these components here so <strong>tux</strong> (our internal Nuxt UI layer) can ship the same editorial patterns with TTI's typographic system (Oswald / Open Sans / Work Sans / Georgia) and color palette.
      </p>
      <p style={{ fontSize: "0.95rem", lineHeight: 1.65, color: "var(--text-secondary)", margin: "0 0 32px", maxWidth: 680 }}>
        This is a <strong>reference kit</strong> — the Vue/Nuxt source of truth lives in the <code>tti-ux</code> repo. Components here are mocked in React for review speed; each page documents the Figma path, style variants, and on-dark behavior so the translation to Vue SFCs is mechanical.
      </p>

      {/* ─── Stat row ─── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 0, border: "1px solid var(--surface-border)", borderRadius: "var(--radius-md)", overflow: "hidden", marginBottom: 40, background: "var(--surface-raised)" }}>
        <StatCell label="families" value={totalFams} />
        <StatCell label="ready" value={readyFams} accent="var(--state-success)" />
        <StatCell label="scaffolded" value={scaffoldFams} accent="var(--brand-accent)" />
        <StatCell label="style variants" value="3×" sub="default · bold · elegant" />
      </div>

      {/* ─── Sections ─── */}
      <SectionBlock title="What's in scope" eyebrow="scope">
        <p>Every component family from AggieUX 1.7, organized into four sections mirroring the Figma file:</p>
        <ul style={{ margin: "10px 0 0", padding: 0, listStyle: "none", display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10 }}>
          {Object.entries(counts).map(([page, count]) => (
            <li key={page} style={{ fontSize: "0.88rem", color: "var(--text-secondary)", padding: "10px 14px", background: "var(--surface-raised)", border: "1px solid var(--surface-border)", borderRadius: "var(--radius-sm)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontWeight: 500, color: "var(--text-primary)" }}>{page}</span>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.78rem", color: "var(--text-muted)" }}>{count} {count === 1 ? "family" : "families"}</span>
            </li>
          ))}
        </ul>
      </SectionBlock>

      <SectionBlock title="How to read each page" eyebrow="orientation">
        <p>Every component page shows:</p>
        <ol style={{ margin: "10px 0 0 20px", padding: 0, lineHeight: 1.75 }}>
          <li><strong>Status chip</strong> — scaffold / in progress / ready.</li>
          <li><strong>Style variants</strong> — which of <code>default</code> / <code>bold</code> / <code>elegant</code> apply.</li>
          <li><strong>Figma source</strong> — the node path in Aggie UX v1.7 that this family maps to.</li>
          <li><strong>The mock</strong> — each style side-by-side, with an On Dark=True mirror where applicable.</li>
        </ol>
      </SectionBlock>

      <SectionBlock title="What v2.0 will add" eyebrow="forward-looking">
        <p>Once AggieUX 2.0 publishes, this kit will roll in:</p>
        <ul style={{ margin: "10px 0 0 20px", padding: 0, lineHeight: 1.75, color: "var(--text-secondary)" }}>
          <li>Mega menu variants (in addition to dropdown)</li>
          <li>Lockup identity + text identity — four navigation combinations total</li>
          <li>Consistency-tightened class names per the v2.0 changelog</li>
          <li>Accessibility structural updates</li>
        </ul>
      </SectionBlock>

      <SectionBlock title="Relationship to tux" eyebrow="the stack">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 0, border: "1px solid var(--surface-border)", borderRadius: "var(--radius-md)", overflow: "hidden" }}>
          <StackCell layer="1" name="AggieUX 1.7 / 2.0" desc="TAMU-wide editorial component system. This kit mirrors its library here." />
          <StackCell layer="2" name="tux" desc="TTI's Nuxt UI layer — inherits AggieUX editorial patterns, applies TTI typography + palette, adds internal-app primitives." accent />
          <StackCell layer="3" name="PECAN (and siblings)" desc="Internal apps for research/admin staff. Consume tux components directly." />
        </div>
      </SectionBlock>
    </div>
  );
}

function StatCell({ label, value, sub, accent }) {
  return (
    <div style={{ padding: "20px 22px", borderRight: "1px solid var(--surface-border)" }}>
      <div style={{ fontFamily: "var(--font-display)", fontSize: "2.2rem", fontWeight: 500, color: accent || "var(--brand-primary)", lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-muted)", marginTop: 6, fontFamily: "var(--font-body-bold)" }}>{label}</div>
      {sub && <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: 4, fontFamily: "var(--font-mono)" }}>{sub}</div>}
    </div>
  );
}

function SectionBlock({ title, eyebrow, children }) {
  return (
    <div style={{ marginBottom: 36 }}>
      <div style={{ fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.11em", color: "var(--text-muted)", fontFamily: "var(--font-body-bold)", marginBottom: 8 }}>{eyebrow}</div>
      <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: 500, margin: "0 0 12px", textTransform: "uppercase", letterSpacing: "0.01em" }}>{title}</h2>
      <div style={{ fontSize: "0.92rem", lineHeight: 1.65, color: "var(--text-secondary)" }}>{children}</div>
    </div>
  );
}

function StackCell({ layer, name, desc, accent }) {
  return (
    <div style={{ padding: "18px 20px", borderRight: "1px solid var(--surface-border)", background: accent ? "color-mix(in srgb, var(--brand-primary) 5%, transparent)" : "var(--surface-raised)" }}>
      <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--text-muted)", marginBottom: 4 }}>layer {layer}</div>
      <div style={{ fontFamily: "var(--font-display)", fontSize: "1rem", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.02em", color: accent ? "var(--brand-primary)" : "var(--text-primary)", marginBottom: 8 }}>{name}</div>
      <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>{desc}</div>
    </div>
  );
}

// ─── StyleVariantsPage — cross-reference of the three styles ───────────────
function StyleVariantsPage() {
  const item = (window.AGGIE_CATALOG || []).find(c => c.id === "style-variants");
  return (
    <PageShell item={item}>
      <p style={{ fontSize: "0.95rem", lineHeight: 1.65, color: "var(--text-secondary)", maxWidth: 680, margin: "-8px 0 28px" }}>
        Every component family supports three visual styles. Here's what the <em>signature</em> — the editorial rule anchoring each section header — looks like in each.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 0, border: "1px solid var(--surface-border)", borderRadius: "var(--radius-md)", overflow: "hidden" }}>
        {["default", "bold", "elegant"].map((s) => (
          <VariantExample key={s} variant={s} />
        ))}
      </div>
    </PageShell>
  );
}

function VariantExample({ variant }) {
  // ── Per-variant typography ──────────────────────────────────────
  const typeConfig = {
    default: {
      fontFamily: "var(--font-display)",
      fontWeight: 500,
      fontStyle: "normal",
      textTransform: "uppercase",
      letterSpacing: "0.01em",
      title: "Section title reads like this",
    },
    bold: {
      fontFamily: "var(--font-body-bold)",
      fontWeight: 700,
      fontStyle: "normal",
      textTransform: "none",
      letterSpacing: 0,
      title: "Section title reads like this",
    },
    elegant: {
      // Elegant = italic hero voice. The title itself sets the italic tone.
      fontFamily: "var(--font-elegant, Georgia, serif)",
      fontWeight: 400,
      fontStyle: "italic",
      textTransform: "none",
      letterSpacing: "-0.005em",
      title: "A section title, composed",
    },
  }[variant];

  return (
    <div style={{ padding: "30px 26px 28px", borderRight: "1px solid var(--surface-border)", minHeight: 240, display: "flex", flexDirection: "column" }}>
      <div style={{ fontSize: "0.62rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--text-muted)", fontFamily: "var(--font-body-bold)", marginBottom: 22 }}>
        style = <span style={{ color: "var(--brand-primary)" }}>{variant}</span>
      </div>

      <div style={{ fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-muted)", marginBottom: 8, fontFamily: "var(--font-body-bold)" }}>
        superhead
      </div>

      <h3 style={{
        fontFamily: typeConfig.fontFamily,
        fontSize: variant === "elegant" ? "1.55rem" : "1.35rem",
        fontWeight: typeConfig.fontWeight,
        fontStyle: typeConfig.fontStyle,
        textTransform: typeConfig.textTransform,
        letterSpacing: typeConfig.letterSpacing,
        margin: "0 0 14px",
        lineHeight: 1.2,
        color: "var(--text-primary)",
      }}>
        {typeConfig.title}
      </h3>

      {/* ── Signature rule — now sits UNDER the title, not above ── */}
      <VariantSignature variant={variant} />

      <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.6, margin: "14px 0 0" }}>
        Supporting lede copy underneath the section header. The typeface and signature mark differ per variant.
      </p>
    </div>
  );
}

/* Signature rule — soft-faded, never a hard boxy cutoff. Sits under the title. */
function VariantSignature({ variant }) {
  if (variant === "default") {
    /* Default — a single hairline rule that fades at both ends. Subtle, editorial. */
    return (
      <div style={{ width: 72, height: 1, background: "linear-gradient(90deg, transparent 0%, var(--brand-primary) 15%, var(--brand-primary) 85%, transparent 100%)", opacity: 0.85 }} />
    );
  }

  if (variant === "bold") {
    /* Bold — a chunky primary bar + a thin tail. Feels like a punctuation stroke,
       not a cut-off piece of dotted line. */
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <div style={{ width: 32, height: 4, background: "var(--brand-primary)", borderRadius: 2 }} />
        <div style={{ width: 14, height: 4, background: "var(--brand-primary)", borderRadius: 2, opacity: 0.5 }} />
        <div style={{ width: 6, height: 4, background: "var(--brand-primary)", borderRadius: 2, opacity: 0.25 }} />
      </div>
    );
  }

  /* Elegant — a soft diagonal hash that fades out at its edges. Hand-set feel. */
  return (
    <div
      style={{
        width: 86,
        height: 6,
        backgroundImage:
          "repeating-linear-gradient(135deg, var(--brand-accent) 0 1px, transparent 1px 5px)",
        WebkitMaskImage:
          "linear-gradient(90deg, transparent 0%, black 15%, black 85%, transparent 100%)",
        maskImage:
          "linear-gradient(90deg, transparent 0%, black 15%, black 85%, transparent 100%)",
        opacity: 0.75,
      }}
    />
  );
}

// ─── Page router ───────────────────────────────────────────────────────────
function AggiePage({ id }) {
  const item = (window.AGGIE_CATALOG || []).find(c => c.id === id);
  if (!item) return <div style={{ padding: 48 }}>Unknown page: {id}</div>;

  if (id === "intro")          return <IntroPage />;
  if (id === "style-variants") return <StyleVariantsPage />;
  if (id === "identities" && window.IdentitiesPage) return <IdentitiesPage />;
  if (id === "menus"      && window.MenusPage)      return <MenusPage />;
  if (id === "navigation" && window.SiteNavPage)    return <SiteNavPage />;
  if (id === "breadcrumbs" && window.BreadcrumbsPage) return <BreadcrumbsPage />;
  if (id === "page-headers" && window.PageHeadersPage) return <PageHeadersPage />;
  if (id === "standard-page-header" && window.StandardPageHeaderPage) return <StandardPageHeaderPage />;
  if (id === "buttons" && window.ButtonsPage) return <ButtonsPage />;
  if (id === "alerts" && window.AlertsPage) return <AlertsPage />;
  if (id === "card-groups" && window.CardGroupsPage) return <CardGroupsPage />;
  if (id === "card-groups-featured" && window.CardGroupsFeaturedPage) return <CardGroupsFeaturedPage />;
  if (id === "standard-card-featured" && window.StandardCardFeaturedPage) return <StandardCardFeaturedPage />;
  if (id === "card-slab" && window.CardSlabPage) return <CardSlabPage />;
  if (id === "cta-feature" && window.CTAFeaturePage) return <CTAFeaturePage />;
  if (id === "cta-links" && window.CTALinksPage) return <CTALinksPage />;
  if (id === "button-slab" && window.ButtonSlabPage) return <ButtonSlabPage />;
  if (id === "callouts" && window.CalloutsPage) return <CalloutsPage />;
  if (id === "standalone-blockquote" && window.StandaloneBlockquotePage) return <StandaloneBlockquotePage />;
  if (id === "factoids" && window.FactoidsPage) return <FactoidsPage />;
  if (id === "testimonials" && window.TestimonialsPage) return <TestimonialsPage />;
  if (id === "search" && window.SearchPage)         return <SearchPage />;
  if (id === "search-block" && window.SearchBlockPage) return <SearchBlockPage />;
  if (id === "footers" && window.FootersPage)       return <FootersPage />;
  if (id === "subfooter" && window.SubfooterPage)   return <SubfooterPage />;
  if (id === "split-feature" && window.SplitFeaturePage) return <SplitFeaturePage />;
  if (id === "media-features" && window.MediaFeaturesPage) return <MediaFeaturesPage />;
  if (id === "media-slab" && window.MediaSlabPage) return <MediaSlabPage />;
  if (id === "captioned-media" && window.CaptionedMediaPage) return <CaptionedMediaPage />;
  if (id === "video-embed" && window.VideoEmbedPage) return <VideoEmbedPage />;
  if (id === "embed" && window.EmbedPage) return <EmbedPage />;
  if (id === "photo-grid" && window.PhotoGridPage) return <PhotoGridPage />;
  if (id === "logo-grid" && window.LogoGridPage) return <LogoGridPage />;
  if (id === "news-collection" && window.NewsCollectionPage) return <NewsCollectionPage />;
  if (id === "contact-cards" && window.ContactCardsPage) return <ContactCardsPage />;
  if (id === "contact-cards-b" && window.ContactCardsBPage) return <ContactCardsBPage />;
  if (id === "collection-feature" && window.CollectionFeaturePage) return <CollectionFeaturePage />;
  if (id === "icon-feature" && window.IconFeaturePage) return <IconFeaturePage />;
  if (id === "icon-list" && window.IconListPage) return <IconListPage />;
  if (id === "link-list" && window.LinkListPage) return <LinkListPage />;
  if (id === "link-slab" && window.LinkSlabPage) return <LinkSlabPage />;
  if (id === "accordion-groups" && window.AccordionGroupsPage) return <AccordionGroupsPage />;
  if (id === "publication-accordion" && window.PublicationAccordionPage) return <PublicationAccordionPage />;
  if (id === "qa-collections" && window.QACollectionsPage) return <QACollectionsPage />;

  return <PageShell item={item} />;
}

Object.assign(window, { IntroPage, StyleVariantsPage, AggiePage });
