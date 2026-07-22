<script setup lang="ts">
useHead({ title: "Breakpoints · Accessibility · TUX" });

// Sourced from design/tokens.json (`breakpoint` block) and
// globals.css (`@theme --breakpoint-*` aliases). Mirrors Tailwind v4
// defaults; documented here so consumers see the responsive scale
// alongside spacing and type.
const breakpoints = [
  { name: "xs",  px: 0,    rem: 0,     note: "Mobile portrait. No min-width media query — the default surface." },
  { name: "sm",  px: 640,  rem: 40,    note: "Mobile landscape, small tablets." },
  { name: "md",  px: 768,  rem: 48,    note: "Tablets. Sidebar layout's #aside slot starts showing here." },
  { name: "lg",  px: 1024, rem: 64,    note: "Laptops. Sidebar collapses to icon-only at this width (resizable)." },
  { name: "xl",  px: 1280, rem: 80,    note: "Desktop. Sidebar at full width with labels." },
  { name: "2xl", px: 1536, rem: 96,    note: "Wide desktop. Editorial measure caps at ~72ch — pages don't grow past this." },
];

// Component-level breakpoints — TUX prefers container queries over
// viewport media queries (see ADR-0007). The viewport scale above
// stays for cases where the layout shifts based on the *viewport*
// (sidebar, mobile-first nav drawer); component-level responsiveness
// keys off container width.
</script>

<template>
  <div class="space-y-8">
    <TuxPageHeader eyebrow="accessibility · responsive" title="Breakpoints">
      The documented responsive scale alongside spacing and type.
      Mirrors Tailwind v4 defaults (sourced from
      <code>design/tokens.json</code>'s <code>breakpoint</code> block);
      published here so consumers reach for the same values designers
      do.
      <br><br>
      <span class="text-sm text-text-muted">
        TUX prefers <strong>container queries</strong> over viewport
        media queries for component-level responsiveness (see
        <NuxtLink to="/docs/adr/0007-container-queries-over-viewport-media-queries" class="link-tti">ADR-0007</NuxtLink>).
        The scale below is reserved for cases where the *layout* shifts
        based on viewport (sidebar collapse, mobile nav drawer, page-
        level grid).
      </span>
    </TuxPageHeader>

    <section>
      <p class="eyebrow">the scale</p>
      <h2 class="heading--bold text-xl font-bold">Six anchors</h2>
      <div class="breakpoints">
        <table class="breakpoints__table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Min-width</th>
              <th>Rem</th>
              <th>Tailwind / TUX usage</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="bp in breakpoints" :key="bp.name">
              <td><code>{{ bp.name }}</code></td>
              <td><span class="breakpoints__num">{{ bp.px === 0 ? '0' : bp.px.toLocaleString() + ' px' }}</span></td>
              <td><span class="breakpoints__num">{{ bp.rem === 0 ? '0' : bp.rem + ' rem' }}</span></td>
              <td>{{ bp.note }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <section>
      <p class="eyebrow">container queries</p>
      <h2 class="heading--bold text-xl font-bold">Component-level responsiveness</h2>
      <p class="mt-2 text-sm text-text-secondary leading-relaxed max-w-2xl">
        Most TUX components key responsive behavior off their
        <em>own width</em> via <code>@container</code> queries — so a
        header in a 320px sidebar tile and the same header in a 1200px
        main column behave the same shape, just stacked vs. side-by-
        side. Why this matters for accessibility: layouts adapt
        regardless of where the component is composed, so screen-reader
        + zoomed-in users (text scaled to 200%) get the same correct
        adaptation as desktop users.
      </p>
      <TuxCodeBlock
        class="mt-3"
        lang="css"
        :code="'/* Container-query pattern — see TuxPageHeader, TuxFactoid,\\n   TuxRichDataGrid expanded rows, etc. */\\n.tux-component {\\n  container-type: inline-size;\\n}\\n\\n@container (max-width: 32rem) {\\n  .tux-component__layout {\\n    flex-direction: column;\\n    gap: 0.5rem;\\n  }\\n}'"
      />
    </section>

    <section>
      <p class="eyebrow">text scaling</p>
      <h2 class="heading--bold text-xl font-bold">200% zoom + reflow</h2>
      <p class="mt-2 text-sm text-text-secondary leading-relaxed max-w-2xl">
        WCAG 1.4.10 (Reflow · Level AA) requires content to render at
        320 CSS pixels wide without horizontal scrolling (except for
        data tables, code blocks, and other 2D content). TUX components
        meet this by using container queries — when zoom forces a
        component into a narrow effective container, it adapts the
        same way it would in a small viewport.
      </p>
      <p class="mt-3 text-sm text-text-secondary leading-relaxed max-w-2xl">
        Tested at: 100%, 200%, 400% zoom across light / dark / HC
        themes via the contrast-audit run.
      </p>
    </section>

    <p class="text-xs text-text-muted">
      <NuxtLink to="/accessibility" class="link-tti">← Back to accessibility index</NuxtLink>
    </p>
  </div>
</template>

<style scoped>
.breakpoints {
  overflow-x: auto;
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-md);
}
.breakpoints__table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.8125rem;
}
.breakpoints__table thead tr {
  background: color-mix(in srgb, var(--brand-primary) 6%, var(--surface-raised));
  border-bottom: 2px solid var(--brand-primary);
}
.breakpoints__table th,
.breakpoints__table td {
  padding: 0.625rem 0.875rem;
  text-align: left;
  border-bottom: 1px solid var(--surface-border);
  vertical-align: top;
}
.breakpoints__table th {
  font-family: var(--font-bold);
  font-weight: 700;
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: var(--tracking-wider, 0.05em);
  color: var(--text-muted);
}
.breakpoints__table code {
  font-family: var(--font-mono);
  font-weight: 600;
  color: var(--text-primary);
}
.breakpoints__num {
  font-family: var(--font-mono);
  font-variant-numeric: tabular-nums;
  color: var(--text-primary);
}
</style>
