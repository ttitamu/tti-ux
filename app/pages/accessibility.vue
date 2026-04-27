<script setup lang="ts">
useHead({ title: "Accessibility · tti-ux" });

// Audit summary lives statically here. Refresh after each audit run by
// pasting from contrast-report.json's `summary` field. Keeping it
// inline (rather than fetching the report) keeps the page renderable
// in static/SSR contexts without a build-time data step.
const auditSummary = {
  date: "2026-04-27",
  total: 282,
  themes: ["tti (light)", "tti-dark", "tti-hc (high contrast)"],
  aa: { pass: 282, fail: 0 },
  aaa: { pass: 282, fail: 0 },
};

// What the automated audit covers vs what's by review only.
const automated = [
  {
    criterion: "1.4.3 Contrast (Minimum)",
    level: "AA",
    threshold: "4.5:1 normal text · 3:1 large text",
    status: "pass",
    note: "Verified by /contrast-audit on every commit (CI gate).",
  },
  {
    criterion: "1.4.6 Contrast (Enhanced)",
    level: "AAA",
    threshold: "7:1 normal text · 4.5:1 large text",
    status: "pass",
    note: "Same audit pipeline, AAA threshold. CI gates on AAA — a regression fails the build.",
  },
  {
    criterion: "1.4.11 Non-text Contrast",
    level: "AA",
    threshold: "3:1 for UI component boundaries + state indicators",
    status: "manual",
    note: "Borders, focus rings, and disabled-state indicators reviewed during component design. Not yet covered by automated audit.",
  },
];

const manual = [
  {
    criterion: "1.3.1 Info and Relationships",
    level: "A",
    note: "Components emit semantic HTML — landmarks, headings, lists, ARIA when needed. Native <details>/<summary> for disclosures, native <table> for tabular data.",
  },
  {
    criterion: "2.1.1 Keyboard",
    level: "A",
    note: "Every interactive primitive is keyboard-operable. Focus rings rendered via :focus-visible.",
  },
  {
    criterion: "2.4.7 Focus Visible",
    level: "AA",
    note: "All focusable elements show a visible focus ring (--shadow-focus token).",
  },
  {
    criterion: "2.4.11 Focus Not Obscured (Minimum)",
    level: "AA (2.2)",
    note: "Sticky header is present but z-index ordering keeps focused content visible. Long forms may need scroll-padding tuning per use case.",
  },
  {
    criterion: "2.4.12 Focus Not Obscured (Enhanced)",
    level: "AAA (2.2)",
    note: "Best-effort. Some sticky-header layouts may briefly partially-cover focused content during transitions.",
  },
  {
    criterion: "2.5.7 Dragging Movements",
    level: "AA (2.2)",
    note: "No drag-only interactions in the catalog. The TuxTreemap zoom is click-to-drill, not drag.",
  },
  {
    criterion: "2.5.8 Target Size (Minimum)",
    level: "AA (2.2)",
    note: "Buttons and primary nav items meet 24×24 CSS pixels. Some inline meta-action buttons (close-X in modals, etc.) are exactly 24×24; sidebar links are 28+.",
  },
  {
    criterion: "3.2.6 Consistent Help",
    level: "A (2.2)",
    note: "Footer position + content is consistent across pages (TuxFooter is the unified anchor).",
  },
  {
    criterion: "3.3.7 Redundant Entry",
    level: "A (2.2)",
    note: "No multi-step flows in the catalog. PECAN and tti-ai-studio downstream consumers handle this in their own flows.",
  },
];

const themeBadgeClass = (status: string) => {
  if (status === "pass") return "ax-badge ax-badge--pass";
  if (status === "manual") return "ax-badge ax-badge--manual";
  return "ax-badge ax-badge--fail";
};
</script>

<template>
  <div class="space-y-10">
    <TuxPageHeader eyebrow="conformance" title="Accessibility">
      The tti-ux design system is built to <strong>WCAG 2.2 Level AA</strong>
      conformance, with <strong>color contrast verified at Level AAA</strong>
      across all three themes (light, dark, high-contrast). Every commit
      runs an automated audit; a regression fails CI.
    </TuxPageHeader>

    <!-- ──────── Conformance summary ──────── -->
    <section>
      <p class="eyebrow">summary</p>
      <h2 class="heading--bold text-2xl font-bold">Conformance level</h2>
      <div class="ax-summary">
        <div class="ax-summary__card ax-summary__card--primary">
          <p class="ax-summary__label">Target</p>
          <p class="ax-summary__value">WCAG 2.2 AA</p>
          <p class="ax-summary__caption">Industry-standard conformance level for public-facing institutional sites.</p>
        </div>
        <div class="ax-summary__card ax-summary__card--accent">
          <p class="ax-summary__label">Color contrast</p>
          <p class="ax-summary__value">WCAG 2.2 AAA</p>
          <p class="ax-summary__caption">Higher than required — 7:1 normal text, 4.5:1 large text, verified across three themes.</p>
        </div>
        <div class="ax-summary__card">
          <p class="ax-summary__label">Audit run</p>
          <p class="ax-summary__value ax-summary__value--mono">{{ auditSummary.date }}</p>
          <p class="ax-summary__caption">{{ auditSummary.total }} text/background pairs across {{ auditSummary.themes.length }} themes — 100% pass at both AA and AAA.</p>
        </div>
      </div>
    </section>

    <!-- ──────── How we verify ──────── -->
    <section>
      <p class="eyebrow">tooling</p>
      <h2 class="heading--bold text-2xl font-bold">How we verify</h2>
      <p class="ax-prose">
        The <NuxtLink to="/contrast-audit" class="link-tti">/contrast-audit</NuxtLink>
        page renders every contrast-risk surface — typography, color tokens,
        alerts, badges, buttons, cards, page headers, callouts, code blocks,
        forms, footers — in three columns simultaneously, one per theme.
      </p>
      <p class="ax-prose">
        <code>npm run audit:contrast</code> spins up headless Chromium via
        puppeteer, walks every text-containing element in each themed column,
        computes effective foreground (alpha-composited up the parent chain)
        and effective background, and applies the WCAG 2.1 / 2.2 contrast formula
        (same in both spec versions). Results are written to
        <code>contrast-report.json</code>; the script exits non-zero if any
        pair drops below threshold. The
        <a href="https://github.com/anthonyguevara/tti-ux-test/blob/main/.github/workflows/audit-contrast.yml" target="_blank" rel="noopener" class="link-tti">contrast-audit workflow</a>
        runs this on every push and PR.
      </p>
      <p class="ax-prose">
        AAA gate is opt-in via <code>AUDIT_LEVEL=AAA</code>. We currently
        run AAA in CI — a contrast regression that drops a pair below
        7:1 fails the build.
      </p>
    </section>

    <!-- ──────── Audited criteria ──────── -->
    <section>
      <p class="eyebrow">automated</p>
      <h2 class="heading--bold text-2xl font-bold">Automated coverage</h2>
      <p class="ax-prose">
        These WCAG success criteria are verified mechanically on every push.
        A failure here blocks merge.
      </p>
      <table class="ax-table">
        <thead>
          <tr>
            <th>Criterion</th>
            <th>Level</th>
            <th>Status</th>
            <th>Detail</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in automated" :key="row.criterion">
            <td><strong>{{ row.criterion }}</strong></td>
            <td><code>{{ row.level }}</code></td>
            <td>
              <span :class="themeBadgeClass(row.status)">{{ row.status }}</span>
            </td>
            <td>
              <p class="ax-table-detail">{{ row.threshold }}</p>
              <p class="ax-table-note">{{ row.note }}</p>
            </td>
          </tr>
        </tbody>
      </table>
    </section>

    <!-- ──────── Manual review ──────── -->
    <section>
      <p class="eyebrow">manual</p>
      <h2 class="heading--bold text-2xl font-bold">Manual review</h2>
      <p class="ax-prose">
        These criteria are reviewed during component design and component
        review, not yet covered by automated audit. The plan is to grow the
        audit pipeline to cover more of these — keyboard-traversal smoke
        tests + target-size measurement are the next two on the roadmap.
      </p>
      <table class="ax-table">
        <thead>
          <tr>
            <th>Criterion</th>
            <th>Level</th>
            <th>Status</th>
            <th>Detail</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in manual" :key="row.criterion">
            <td><strong>{{ row.criterion }}</strong></td>
            <td><code>{{ row.level }}</code></td>
            <td>
              <span class="ax-badge ax-badge--manual">manual</span>
            </td>
            <td>
              <p class="ax-table-note">{{ row.note }}</p>
            </td>
          </tr>
        </tbody>
      </table>
    </section>

    <!-- ──────── Known non-conformances + reporting ──────── -->
    <section>
      <p class="eyebrow">known issues</p>
      <h2 class="heading--bold text-2xl font-bold">Known non-conformances</h2>
      <p class="ax-prose">
        None at the design-system level as of {{ auditSummary.date }}. If
        you find an accessibility issue in a component or in a page that
        consumes this system, please open an issue on the
        <a href="https://github.com/anthonyguevara/tti-ux-test/issues" target="_blank" rel="noopener" class="link-tti">tti-ux issue tracker</a>
        with the heading "<code>a11y:</code>" so we can triage it ahead of
        normal feature work.
      </p>
      <p class="ax-prose">
        Downstream products (PECAN, tti-ai-studio) inherit the system's
        contrast guarantees but compose pages on top — page-level
        accessibility (heading order, landmark structure, form-field
        labeling) is the consumer's responsibility. The
        <NuxtLink to="/design/components" class="link-tti">component doctrine</NuxtLink>
        notes per-component a11y considerations.
      </p>
    </section>
  </div>
</template>

<style scoped>
.ax-prose {
  max-width: 50rem;
  margin: 0 0 1rem;
  font-size: 0.9375rem;
  line-height: 1.65;
  color: var(--text-secondary);
}

.ax-prose code,
.ax-prose a code {
  font-family: var(--font-mono);
  font-size: 0.8125rem;
  background: var(--surface-sunken);
  padding: 0.0625rem 0.375rem;
  border-radius: var(--radius-sm);
  color: var(--brand-primary);
}

[data-theme="tti-dark"] .ax-prose code {
  color: var(--brand-accent);
}

/* ──────── Conformance summary cards ──────── */
.ax-summary {
  margin-top: 1.25rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(15rem, 1fr));
  gap: 1rem;
}

.ax-summary__card {
  padding: 1.125rem 1.25rem;
  background: var(--surface-raised);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-md);
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.ax-summary__card--primary {
  background: var(--brand-fill);
  border-color: var(--brand-fill);
  color: rgba(255, 255, 255, 0.95);
}

.ax-summary__card--accent {
  background: color-mix(in srgb, var(--brand-accent) 18%, var(--surface-raised));
  border-color: color-mix(in srgb, var(--brand-accent) 45%, transparent);
}

.ax-summary__label {
  margin: 0;
  font-family: var(--font-mono);
  font-size: 0.625rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-muted);
}

.ax-summary__card--primary .ax-summary__label {
  color: var(--brand-accent);
}

.ax-summary__card--accent .ax-summary__label {
  color: color-mix(in srgb, var(--brand-primary) 75%, var(--text-primary));
}

.ax-summary__value {
  margin: 0;
  font-family: var(--font-bold);
  font-weight: 800;
  font-size: 1.375rem;
  line-height: 1.1;
}

.ax-summary__value--mono {
  font-family: var(--font-mono);
  font-weight: 600;
  font-size: 1.0625rem;
}

.ax-summary__caption {
  margin: 0;
  margin-top: auto;
  font-size: 0.8125rem;
  line-height: 1.5;
  color: var(--text-secondary);
}

.ax-summary__card--primary .ax-summary__caption {
  color: rgba(255, 255, 255, 0.85);
}

/* ──────── Tables ──────── */
.ax-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
  font-size: 0.875rem;
}

.ax-table th {
  text-align: left;
  font-family: var(--font-bold);
  font-weight: 700;
  font-size: 0.6875rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-muted);
  padding: 0.625rem 0.875rem;
  border-bottom: 2px solid var(--brand-primary);
  background: var(--surface-sunken);
}

.ax-table td {
  padding: 0.875rem;
  border-bottom: 1px solid var(--surface-border);
  vertical-align: top;
}

.ax-table td code {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.ax-table-detail {
  margin: 0 0 0.25rem;
  color: var(--text-primary);
  font-size: 0.875rem;
}

.ax-table-note {
  margin: 0;
  color: var(--text-secondary);
  font-size: 0.8125rem;
  line-height: 1.55;
  max-width: 36rem;
}

/* ──────── Pass/manual badges ──────── */
.ax-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.125rem 0.5rem;
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: lowercase;
  border-radius: var(--radius-sm);
  border: 1px solid transparent;
}

.ax-badge--pass {
  color: var(--color-success);
  background: color-mix(in srgb, var(--color-success) 12%, transparent);
  border-color: color-mix(in srgb, var(--color-success) 35%, transparent);
}

.ax-badge--manual {
  color: var(--text-secondary);
  background: var(--surface-sunken);
  border-color: var(--surface-border);
}

.ax-badge--fail {
  color: var(--color-error);
  background: color-mix(in srgb, var(--color-error) 12%, transparent);
  border-color: color-mix(in srgb, var(--color-error) 35%, transparent);
}
</style>
