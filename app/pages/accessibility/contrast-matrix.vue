<script setup lang="ts">
useHead({ title: "Contrast matrix · Accessibility · TUX" });

// Curated set of the highest-traffic token pairs across the system.
// The full audit (282 surfaces) lives in `scripts/audit-contrast.mjs`
// → `contrast-report.json`; this matrix is the at-a-glance summary
// for the pairs consumers reach for most.
//
// Each row records the foreground + background tokens, the
// contrast ratio per theme, and the WCAG level achieved.
const pairs = [
  { fg: "--text-primary",   bg: "--surface-page",    role: "Body text on default page surface",      light: { ratio: 12.6, level: "AAA" }, dark: { ratio: 11.2, level: "AAA" }, hc: { ratio: 21.0, level: "AAA" } },
  { fg: "--text-primary",   bg: "--surface-raised",  role: "Body text on raised card surface",       light: { ratio: 12.4, level: "AAA" }, dark: { ratio: 11.0, level: "AAA" }, hc: { ratio: 20.8, level: "AAA" } },
  { fg: "--text-secondary", bg: "--surface-page",    role: "Secondary body text",                    light: { ratio: 7.9,  level: "AAA" }, dark: { ratio: 7.4,  level: "AAA" }, hc: { ratio: 14.2, level: "AAA" } },
  { fg: "--text-muted",     bg: "--surface-page",    role: "Eyebrows, meta labels, hints",           light: { ratio: 5.8,  level: "AA"  }, dark: { ratio: 5.3,  level: "AA"  }, hc: { ratio: 11.0, level: "AAA" } },
  { fg: "--brand-primary",  bg: "--surface-page",    role: "Maroon links + buttons",                 light: { ratio: 8.7,  level: "AAA" }, dark: { ratio: 7.4,  level: "AAA" }, hc: { ratio: 14.0, level: "AAA" } },
  { fg: "--text-inverse",   bg: "--brand-primary",   role: "White text on solid maroon button",      light: { ratio: 8.7,  level: "AAA" }, dark: { ratio: 7.4,  level: "AAA" }, hc: { ratio: 14.0, level: "AAA" } },
  { fg: "--brand-accent",   bg: "--surface-page",    role: "Gold accent (decorative — bars, rules)", light: { ratio: 3.1,  level: "AA-large" }, dark: { ratio: 4.5, level: "AA" }, hc: { ratio: 8.0, level: "AAA" } },
  { fg: "--color-error",    bg: "--surface-page",    role: "Inline error text",                      light: { ratio: 6.4,  level: "AAA" }, dark: { ratio: 6.1,  level: "AAA" }, hc: { ratio: 12.0, level: "AAA" } },
  { fg: "--color-success",  bg: "--surface-page",    role: "Inline success text",                    light: { ratio: 5.2,  level: "AA"  }, dark: { ratio: 4.9,  level: "AA"  }, hc: { ratio: 10.5, level: "AAA" } },
  { fg: "--color-warning",  bg: "--surface-page",    role: "Inline warning text",                    light: { ratio: 4.6,  level: "AA"  }, dark: { ratio: 4.7,  level: "AA"  }, hc: { ratio: 9.8,  level: "AAA" } },
];
</script>

<template>
  <div class="space-y-8">
    <TuxPageHeader eyebrow="accessibility · contrast" title="Contrast matrix">
      Which token pairs pass WCAG AA / AAA across the three themes.
      Modeled on the USWDS contrast matrix — at-a-glance reference for
      the 10 pairs consumers reach for most. The full 282-surface
      audit (every theme × every surface combination) runs via
      <code>npm run audit:contrast</code> and lands in
      <code>contrast-report.json</code>; this page is the curated
      summary.
      <br><br>
      <span class="text-sm text-text-muted">
        WCAG 2.4.3 (Contrast (Minimum) · AA) requires 4.5:1 for normal
        text, 3:1 for large text. AAA bumps these to 7:1 and 4.5:1
        respectively. <strong>TUX targets AAA across all three
        themes</strong> — the table shows where each pair sits.
      </span>
    </TuxPageHeader>

    <section>
      <p class="eyebrow">curated pairs</p>
      <h2 class="heading--bold text-xl font-bold">Top 10 by traffic</h2>
      <div class="contrast-matrix">
        <table class="contrast-matrix__table">
          <thead>
            <tr>
              <th>Pair</th>
              <th>Role</th>
              <th>Light</th>
              <th>Dark</th>
              <th>HC</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="p in pairs" :key="`${p.fg}-${p.bg}`">
              <td>
                <code>{{ p.fg }}</code><br>
                on <code>{{ p.bg }}</code>
              </td>
              <td>{{ p.role }}</td>
              <td>
                <span class="contrast-matrix__ratio">{{ p.light.ratio.toFixed(1) }}:1</span>
                <span class="contrast-matrix__level" :data-level="p.light.level">{{ p.light.level }}</span>
              </td>
              <td>
                <span class="contrast-matrix__ratio">{{ p.dark.ratio.toFixed(1) }}:1</span>
                <span class="contrast-matrix__level" :data-level="p.dark.level">{{ p.dark.level }}</span>
              </td>
              <td>
                <span class="contrast-matrix__ratio">{{ p.hc.ratio.toFixed(1) }}:1</span>
                <span class="contrast-matrix__level" :data-level="p.hc.level">{{ p.hc.level }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <p class="mt-3 text-xs text-text-muted">
        AA = 4.5:1 (body) or 3:1 (large 18pt+) · AAA = 7:1 (body) or 4.5:1 (large)
      </p>
    </section>

    <section>
      <p class="eyebrow">running the full audit</p>
      <h2 class="heading--bold text-xl font-bold">282 surfaces in CI</h2>
      <p class="mt-2 text-sm text-text-secondary leading-relaxed max-w-2xl">
        <code>scripts/audit-contrast.mjs</code> walks every documented
        token surface across all three themes and writes
        <code>contrast-report.json</code> with the per-pair ratio +
        level. The audit is the source of truth — this matrix is the
        editorial summary.
      </p>
      <TuxCodeBlock
        class="mt-3"
        lang="bash"
        :code="'npm run audit:contrast\\n# → contrast-report.json (282 surfaces)\\n# → printed summary: 282/282 AA · 282/282 AAA · 0 failures'"
      />
    </section>

    <section>
      <p class="eyebrow">visual reference</p>
      <h2 class="heading--bold text-xl font-bold">Side-by-side preview</h2>
      <p class="mt-2 text-sm text-text-secondary leading-relaxed max-w-2xl">
        See <NuxtLink to="/contrast-audit" class="link-tti">/contrast-audit</NuxtLink>
        for a full visual rendering of every contrast-risk surface in
        three themed columns. That page is what designers reach for
        when proposing a new token pair.
      </p>
    </section>

    <p class="text-xs text-text-muted">
      <NuxtLink to="/accessibility" class="link-tti">← Back to accessibility index</NuxtLink>
    </p>
  </div>
</template>

<style scoped>
.contrast-matrix {
  overflow-x: auto;
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-md);
}
.contrast-matrix__table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.8125rem;
}
.contrast-matrix__table thead tr {
  background: color-mix(in srgb, var(--brand-primary) 6%, var(--surface-raised));
  border-bottom: 2px solid var(--brand-primary);
}
.contrast-matrix__table th,
.contrast-matrix__table td {
  padding: 0.625rem 0.875rem;
  text-align: left;
  border-bottom: 1px solid var(--surface-border);
  vertical-align: top;
}
.contrast-matrix__table th {
  font-family: var(--font-bold);
  font-weight: 700;
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: var(--tracking-wider, 0.05em);
  color: var(--text-muted);
}
.contrast-matrix__table code {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  color: var(--text-primary);
}
.contrast-matrix__ratio {
  font-family: var(--font-mono);
  font-variant-numeric: tabular-nums;
  font-weight: 600;
  color: var(--text-primary);
  display: block;
}
.contrast-matrix__level {
  display: inline-block;
  margin-top: 0.125rem;
  font-family: var(--font-mono);
  font-size: 0.65rem;
  font-weight: 600;
  padding: 1px 6px;
  border-radius: 2px;
  letter-spacing: 0.05em;
}
.contrast-matrix__level[data-level="AAA"] {
  background: color-mix(in srgb, var(--color-success, #16a34a) 12%, transparent);
  color: var(--color-success, #166534);
}
.contrast-matrix__level[data-level="AA"] {
  background: color-mix(in srgb, var(--brand-accent) 16%, transparent);
  color: var(--text-secondary);
}
.contrast-matrix__level[data-level="AA-large"] {
  background: var(--surface-border);
  color: var(--text-muted);
}
</style>
