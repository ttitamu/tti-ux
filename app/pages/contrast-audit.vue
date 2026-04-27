<script setup lang="ts">
// /contrast-audit — every contrast-risk Tux component rendered three
// times side-by-side, one column per theme (tti / tti-dark / tti-hc).
// The page is the input to scripts/audit-contrast.mjs (puppeteer +
// WCAG ratio computation) and also a standalone visual review tool.
//
// Theming: tokens.css scopes every theme's CSS vars under
// [data-theme="…"], so wrapping each column in a data-theme div
// renders three independent themes on one page. The browser's own
// active theme (from <html data-theme>) doesn't apply inside these
// wrappers because the attribute selector matches the closer
// ancestor.
//
// Adding a component to the audit: drop it into the <ColumnContent>
// component below. It renders once but appears three times — one in
// each themed column.

useHead({ title: "Contrast audit · tti-ux" });

definePageMeta({
  // Skip prerender — this page is for local audit + visual review,
  // not part of the production deploy. Generating it pulls every
  // component into the static bundle for no shipped value, and
  // some components rely on client-only code (Mermaid, Shiki).
  layout: "default",
});

const themes = [
  { id: "tti",      label: "Light",         description: "Default theme — TTI maroon on near-white surface." },
  { id: "tti-dark", label: "Dark",          description: "Dark mode — same brand vocabulary, inverted surfaces." },
  { id: "tti-hc",   label: "High-contrast", description: "WCAG AAA opt-in — pure black/white + bolder borders." },
];
</script>

<template>
  <div class="audit">
    <header class="audit__header">
      <p class="eyebrow">tooling</p>
      <h1 class="heading--bold text-2xl font-bold">Contrast audit</h1>
      <p class="audit__intro">
        Every contrast-risk surface rendered in all three themes side-by-side.
        Run <code>npm&nbsp;run&nbsp;audit:contrast</code> to crawl this page
        with puppeteer, compute WCAG contrast ratios for every text/background
        pair, and fail on anything below 4.5:1 (or 3:1 for large text).
      </p>
    </header>

    <div class="audit__columns">
      <section
        v-for="theme in themes"
        :key="theme.id"
        :data-theme="theme.id"
        class="audit__column"
      >
        <header class="audit__column-header">
          <p class="audit__theme-label">{{ theme.label }}</p>
          <p class="audit__theme-id">data-theme="{{ theme.id }}"</p>
          <p class="audit__theme-desc">{{ theme.description }}</p>
        </header>

        <!-- ──────── TYPOGRAPHY ──────── -->
        <section class="audit__section" data-audit-group="typography">
          <p class="audit__section-label">typography</p>
          <h1 class="audit__h1">H1 · Editorial</h1>
          <h2 class="audit__h2">H2 · Section title</h2>
          <h3 class="audit__h3">H3 · Subsection</h3>
          <p class="audit__body">
            Body text — Open Sans set at 15px on
            <code>var(--text-primary)</code>. The quick brown fox jumps over
            the lazy dog. 0123456789.
          </p>
          <p class="audit__body audit__body--secondary">
            Secondary text — <code>var(--text-secondary)</code>. Muted by 8%
            for hierarchy without sacrificing readability.
          </p>
          <p class="audit__body audit__body--muted">
            Muted text — <code>var(--text-muted)</code>. Lowest stop in the
            text-color ramp; metadata, captions, eyebrows.
          </p>
          <p>
            <a href="#" class="link-tti">Inline link</a> in TTI navy
            <span class="link-tti">styled span</span>.
          </p>
        </section>

        <!-- ──────── COLOR TOKENS ──────── -->
        <section class="audit__section" data-audit-group="tokens">
          <p class="audit__section-label">color tokens</p>
          <div class="audit__swatch-grid">
            <div class="audit__swatch" style="background: var(--brand-fill); color: #fff;">
              <span class="audit__swatch-name">brand-fill</span>
              <span class="audit__swatch-on">white text · marketing panel</span>
            </div>
            <div class="audit__swatch" style="background: var(--brand-accent); color: #1f1c1c;">
              <span class="audit__swatch-name">brand-accent</span>
              <span class="audit__swatch-on">dark text · gold accent</span>
            </div>
            <div class="audit__swatch" style="background: var(--surface-page); color: var(--brand-primary); border: 1px solid var(--surface-border);">
              <span class="audit__swatch-name">brand-primary</span>
              <span class="audit__swatch-on">brand-text on page</span>
            </div>
            <div class="audit__swatch" style="background: var(--surface-page); color: var(--text-primary); border: 1px solid var(--surface-border);">
              <span class="audit__swatch-name">surface-page</span>
              <span class="audit__swatch-on">primary text</span>
            </div>
            <div class="audit__swatch" style="background: var(--surface-raised); color: var(--text-primary); border: 1px solid var(--surface-border);">
              <span class="audit__swatch-name">surface-raised</span>
              <span class="audit__swatch-on">primary text</span>
            </div>
            <div class="audit__swatch" style="background: var(--surface-sunken); color: var(--text-secondary);">
              <span class="audit__swatch-name">surface-sunken</span>
              <span class="audit__swatch-on">secondary text</span>
            </div>
          </div>
        </section>

        <!-- ──────── ALERTS ──────── -->
        <section class="audit__section" data-audit-group="alerts">
          <p class="audit__section-label">TuxAlert · all variants</p>
          <div class="audit__stack">
            <TuxAlert variant="info"       title="Info alert"       >Default informational message with a body line.</TuxAlert>
            <TuxAlert variant="success"    title="Success alert"    >Operation completed without errors.</TuxAlert>
            <TuxAlert variant="warning"    title="Warning alert"    >Heads up — review before proceeding.</TuxAlert>
            <TuxAlert variant="danger"     title="Danger alert"     >Destructive action; double-check.</TuxAlert>
            <TuxAlert variant="tip"        title="Tip alert"        >Soft guidance, low-stakes.</TuxAlert>
            <TuxAlert variant="compliance" title="Compliance alert" >ITAR-tagged corpus segment. Token-gated.</TuxAlert>
          </div>
        </section>

        <!-- ──────── BADGES ──────── -->
        <section class="audit__section" data-audit-group="badges">
          <p class="audit__section-label">TuxBadge · tiers + states + tags</p>
          <div class="audit__inline-row">
            <TuxBadge tier="public">public</TuxBadge>
            <TuxBadge tier="internal">internal</TuxBadge>
            <TuxBadge tier="sensitive">sensitive</TuxBadge>
            <TuxBadge tier="restricted">restricted</TuxBadge>
          </div>
          <div class="audit__inline-row">
            <TuxBadge status="completed">completed</TuxBadge>
            <TuxBadge status="running">running</TuxBadge>
            <TuxBadge status="failed">failed</TuxBadge>
            <TuxBadge status="queued">queued</TuxBadge>
          </div>
          <div class="audit__inline-row">
            <TuxBadge kind="tag">topic:safety</TuxBadge>
            <TuxBadge kind="tag">env:prod</TuxBadge>
            <TuxBadge kind="count" :count="42">files</TuxBadge>
          </div>
        </section>

        <!-- ──────── BUTTONS ──────── -->
        <section class="audit__section" data-audit-group="buttons">
          <p class="audit__section-label">TuxButton · all intents</p>
          <div class="audit__inline-row">
            <TuxButton intent="primary">Primary</TuxButton>
            <TuxButton intent="secondary">Secondary</TuxButton>
            <TuxButton intent="ghost">Ghost</TuxButton>
            <TuxButton intent="destructive">Destructive</TuxButton>
          </div>
        </section>

        <!-- ──────── CARDS ──────── -->
        <section class="audit__section" data-audit-group="cards">
          <p class="audit__section-label">TuxCard · static + linked</p>
          <div class="audit__stack">
            <TuxCard>
              <p class="eyebrow">card · static</p>
              <h3 class="text-lg font-bold">Static card content</h3>
              <p class="mt-1 text-sm text-text-secondary">
                Body copy on a card surface. Tests muted and secondary text
                contrast against the elevated raised surface.
              </p>
            </TuxCard>
            <TuxCard to="#">
              <p class="eyebrow">card · linked</p>
              <h3 class="text-lg font-bold">Linked card with corner-drop</h3>
              <p class="mt-1 text-sm text-text-secondary">
                Hover triggers the maroon corner-drop signature. Active link
                state flips to brand-primary text on a 3% maroon-tint bg.
              </p>
            </TuxCard>
          </div>
        </section>

        <!-- ──────── PAGE HEADERS ──────── -->
        <section class="audit__section" data-audit-group="page-headers">
          <p class="audit__section-label">TuxPageHeader · all tones</p>
          <TuxPageHeader eyebrow="plain" title="Plain tone header">
            Body copy on the page surface, default tone.
          </TuxPageHeader>
          <TuxPageHeader eyebrow="neutral" title="Neutral tone" tone="neutral">
            Sunken-gray panel.
          </TuxPageHeader>
          <TuxPageHeader eyebrow="maroon" title="Maroon tone" tone="maroon">
            Inverted text on the brand surface — highest-contrast risk.
          </TuxPageHeader>
        </section>

        <!-- ──────── CALLOUTS + BLOCKQUOTE ──────── -->
        <section class="audit__section" data-audit-group="editorial">
          <p class="audit__section-label">editorial accents</p>
          <TuxCallout kind="fact">
            <p>Drift reconciler closed 412 stale entries this morning.</p>
          </TuxCallout>
          <TuxCallout kind="stat">
            <p>Agent-04 has been quiet since 12:14. Heartbeat alive.</p>
          </TuxCallout>
          <TuxBlockquote
            quote="Engineering-only treatments rarely hold past 24 months — this one is doing something different."
            attribution="Dr. Lina Hassan"
            role="PI · Roadway Safety"
          />
        </section>

        <!-- ──────── CODE ──────── -->
        <section class="audit__section" data-audit-group="code">
          <p class="audit__section-label">code surfaces</p>
          <p class="audit__body">
            Inline <code>code</code> token rendering, plus a fenced block:
          </p>
          <pre class="audit__pre"><code>const greet = (name: string) =&gt; {
  console.log(`hello ${name}`);
};</code></pre>
        </section>

        <!-- ──────── FORM CONTROLS ──────── -->
        <section class="audit__section" data-audit-group="forms">
          <p class="audit__section-label">form controls</p>
          <div class="audit__form-row">
            <label class="audit__label" for="audit-input-{{ theme.id }}">Text input</label>
            <input
              :id="`audit-input-${theme.id}`"
              type="text"
              class="audit__input"
              placeholder="Placeholder text"
              value="Filled value"
            >
          </div>
          <div class="audit__form-row">
            <label class="audit__label" :for="`audit-select-${theme.id}`">Select</label>
            <select :id="`audit-select-${theme.id}`" class="audit__input">
              <option>Option one</option>
              <option>Option two</option>
            </select>
          </div>
        </section>

        <!-- ──────── FOOTER ──────── -->
        <section class="audit__section" data-audit-group="footer">
          <p class="audit__section-label">TuxFooter · maroon + legal strip</p>
          <div class="audit__footer-frame">
            <TuxFooter
              tagline=""
              :columns="[
                { heading: 'State Resources', links: [
                  { label: 'The State of Texas',         href: '#' },
                  { label: 'Texas Veterans Portal',      href: '#' },
                ]},
                { heading: 'Policies', links: [
                  { label: 'Site Policies', href: '#' },
                  { label: 'Open Records', href: '#' },
                ]},
              ]"
              :social="[
                { icon: 'lucide:linkedin', label: 'LinkedIn', href: '#' },
                { icon: 'lucide:facebook', label: 'Facebook', href: '#' },
              ]"
            />
          </div>
        </section>
      </section>
    </div>
  </div>
</template>

<style scoped>
.audit {
  margin: -2rem -2.5rem;
  /* Use the page bg explicitly so the audit page reads as a tool,
     distinct from the surrounding chrome. */
  min-height: 100vh;
  font-family: var(--font-body);
}

.audit__header {
  padding: 1.5rem 2rem;
  border-bottom: 1px solid var(--surface-border);
}

.audit__intro {
  margin: 0.75rem 0 0;
  max-width: 50rem;
  font-size: 0.875rem;
  color: var(--text-secondary);
  line-height: 1.55;
}

.audit__intro code {
  font-family: var(--font-mono);
  font-size: 0.8125rem;
  background: var(--surface-sunken);
  padding: 0.0625rem 0.3125rem;
  border-radius: var(--radius-sm);
}

/* The three theme columns. Each <section> sets its own data-theme,
   and CSS vars resolve to that theme's definitions for everything
   inside it. */
.audit__columns {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0;
  align-items: stretch;
}

@media (max-width: 80rem) {
  .audit__columns {
    grid-template-columns: 1fr;
  }
}

.audit__column {
  /* The column itself adopts its theme's surface-page color so the
     theme is "real" all the way to the column edge. */
  background: var(--surface-page);
  color: var(--text-primary);
  border-right: 1px solid var(--surface-border);
  padding: 1.25rem 1.25rem 3rem;
}

.audit__column:last-child {
  border-right: 0;
}

.audit__column-header {
  padding-bottom: 0.875rem;
  margin-bottom: 1.25rem;
  border-bottom: 2px solid var(--brand-primary);
}

.audit__theme-label {
  margin: 0;
  font-family: var(--font-bold);
  font-weight: 700;
  font-size: 1.125rem;
  color: var(--text-primary);
}

.audit__theme-id {
  margin: 0.125rem 0 0;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--text-muted);
}

.audit__theme-desc {
  margin: 0.4375rem 0 0;
  font-size: 0.8125rem;
  color: var(--text-secondary);
  line-height: 1.45;
}

.audit__section {
  margin-bottom: 2rem;
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
}

.audit__section-label {
  margin: 0;
  font-family: var(--font-mono);
  font-size: 0.625rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-muted);
  padding-bottom: 0.375rem;
  border-bottom: 1px solid var(--surface-border);
}

/* Typography samples */
.audit__h1 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 800;
  font-style: italic;
  text-transform: uppercase;
  font-family: var(--font-display);
  color: var(--text-primary);
}

.audit__h2 {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 700;
  font-family: var(--font-bold);
  color: var(--text-primary);
}

.audit__h3 {
  margin: 0;
  font-size: 0.9375rem;
  font-weight: 700;
  color: var(--text-primary);
}

.audit__body {
  margin: 0;
  font-size: 0.875rem;
  line-height: 1.55;
  color: var(--text-primary);
}

.audit__body--secondary { color: var(--text-secondary); }
.audit__body--muted     { color: var(--text-muted); }

.audit__body code {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  background: var(--surface-sunken);
  padding: 0.0625rem 0.3125rem;
  border-radius: var(--radius-sm);
}

/* Stack layout for vertical groupings */
.audit__stack {
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
}

.audit__inline-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4375rem;
  align-items: center;
}

/* Color swatches */
.audit__swatch-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.375rem;
}

.audit__swatch {
  padding: 0.625rem 0.75rem;
  border-radius: var(--radius-sm);
  font-size: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  min-height: 3.25rem;
}

.audit__swatch-name {
  font-family: var(--font-mono);
  font-weight: 600;
  font-size: 0.6875rem;
}

.audit__swatch-on {
  font-size: 0.75rem;
  opacity: 0.85;
}

/* Code surface */
.audit__pre {
  margin: 0;
  padding: 0.75rem 0.875rem;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  line-height: 1.55;
  background: var(--surface-sunken);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-sm);
  color: var(--text-primary);
  overflow-x: auto;
}

/* Form controls */
.audit__form-row {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.audit__label {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.audit__input {
  width: 100%;
  padding: 0.4375rem 0.625rem;
  font-family: inherit;
  font-size: 0.875rem;
  color: var(--text-primary);
  background: var(--surface-raised);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-sm);
}

.audit__input:focus-visible {
  outline: 2px solid var(--brand-primary);
  outline-offset: 1px;
}

.audit__input::placeholder {
  color: var(--text-muted);
}

/* Footer demo frame — overflow-hidden so the column-internal footer
   doesn't bleed past the column. */
.audit__footer-frame {
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-sm);
  overflow: hidden;
  font-size: 0.75rem;
}
</style>
