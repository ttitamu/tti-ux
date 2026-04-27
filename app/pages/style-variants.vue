<script setup lang="ts">
useHead({ title: "Style variants · tti-ux" });
</script>

<template>
  <div class="space-y-12">
    <TuxPageHeader eyebrow="foundations" title="Style variants">
      tux ships three section styles. Most product surfaces sit in
      <strong>default</strong> and stay there. <strong>Bold</strong> is for
      marketing splashes and athletic surfaces. <strong>Elegant</strong> is for
      research, policy, and administrative pages. Opt in with
      <code>.style--bold</code> or <code>.style--elegant</code> on any
      ancestor — or with a per-component BEM modifier.
    </TuxPageHeader>

    <!-- Default style -->
    <section class="space-y-4">
      <p class="eyebrow">style 1 / 3</p>
      <h2 class="heading--bold text-3xl font-bold">Default — Oswald + maroon hairline</h2>
      <p class="max-w-3xl text-text-secondary leading-relaxed">
        Quietest of the three. Used everywhere a section needs structure but
        not personality — dashboards, admin chrome, table-heavy pages,
        internal tooling. Headings inherit
        <code>--font-display</code> (Oswald), and
        <code>.section-header</code> renders a soft-faded maroon hairline below
        the title.
      </p>

      <div class="rounded-md border border-surface-border bg-surface-raised p-8 space-y-6">
        <div>
          <p class="eyebrow">research operations</p>
          <h3 class="section-header text-base">Recent activity</h3>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="card-static p-6">
            <p class="eyebrow">scan</p>
            <h4 class="text-lg font-bold mt-1">Q4 grant deliverables</h4>
            <p class="mt-2 text-sm text-text-secondary">
              4,217 files indexed across 12 directories. Two classifiers
              flagged for review.
            </p>
          </div>
          <div class="card-static p-6">
            <p class="eyebrow">classifier</p>
            <h4 class="text-lg font-bold mt-1">CLS-204 · ITAR detection</h4>
            <p class="mt-2 text-sm text-text-secondary">
              Last retrained 2026-04-12. 93.4% precision on validation set.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Bold style -->
    <section class="style--bold space-y-4">
      <p class="eyebrow">style 2 / 3</p>
      <h2 class="heading--bold text-3xl font-bold">Bold — Work Sans + stacked maroon bars</h2>
      <p class="max-w-3xl text-text-secondary leading-relaxed">
        Eye-catching. Right for marketing splashes, athletic-flavored landing
        pages, event blocks. Headings are heavy Work Sans (800-weight,
        mixed-case, italic hero flourish on
        <code>.heading--display</code>), and the section signature is a
        stacked-bar rule that reads like punctuation.
      </p>

      <div class="rounded-md border border-surface-border bg-surface-raised p-8 space-y-6">
        <div>
          <span class="dot-grid" aria-hidden="true" />
          <p class="eyebrow mt-2">2026 transportation symposium</p>
          <h3 class="section-header--bold text-2xl">Register today</h3>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="card-static--bold">
            <p class="eyebrow">keynote</p>
            <h4 class="text-xl font-extrabold mt-1">Connected vehicle research</h4>
            <p class="mt-2 text-sm text-text-secondary">
              Day 1 · 9:00 AM · Rellis Conference Center.
            </p>
          </div>
          <div class="card-static--bold">
            <p class="eyebrow">workshop</p>
            <h4 class="text-xl font-extrabold mt-1">Hands-on PECAN intake</h4>
            <p class="mt-2 text-sm text-text-secondary">
              Day 2 · 1:00 PM · Bring your own corpus. Limited to 30 seats.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Elegant style -->
    <section class="style--elegant space-y-4">
      <p class="eyebrow">style 3 / 3</p>
      <h2 class="heading--bold text-3xl font-bold">Elegant — Georgia + diagonal hash</h2>
      <p class="max-w-3xl text-text-secondary leading-relaxed">
        Refined and stately. Used for research publications, annual reports,
        faculty profiles, policy and administrative surfaces. Headings switch
        to Georgia (a system serif, no font fetch needed), the section
        signature becomes a soft-faded diagonal hash, and cards drop the
        2px maroon outline for a dotted maroon border.
      </p>

      <div class="rounded-md border border-surface-border bg-surface-raised p-8 space-y-6">
        <div>
          <span class="hash-pattern hash-pattern--narrow hash-pattern--sm" aria-hidden="true" />
          <p class="eyebrow mt-2">annual report 2025</p>
          <h3 class="section-header--elegant text-2xl">Director's letter</h3>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <article class="card-static--elegant">
            <p class="eyebrow">publication</p>
            <h4 class="heading--elegant heading--elegant--italic text-xl mt-1">
              Microsimulation in rural corridor planning
            </h4>
            <p class="mt-2 text-sm text-text-secondary">
              Authored by R. Chen, M. Acosta. Transportation Research Record,
              Vol. 2671, Issue 4 — pp. 88–101.
            </p>
          </article>
          <article class="card-static--elegant">
            <p class="eyebrow">faculty</p>
            <h4 class="heading--elegant text-xl mt-1">Dr. Lina Velazquez</h4>
            <p class="mt-2 text-sm text-text-secondary">
              Senior Research Scientist · Connected & Automated Vehicles
              Program · 2018–present.
            </p>
          </article>
        </div>
      </div>
    </section>

    <!-- Per-component opt-in note -->
    <section class="space-y-3">
      <p class="eyebrow">opt-in</p>
      <h2 class="heading--bold text-2xl font-bold">Page-level vs per-component</h2>
      <p class="max-w-3xl text-text-secondary leading-relaxed">
        The class hierarchy is intentional. Apply <code>.style--bold</code> or
        <code>.style--elegant</code> on a page wrapper and every heading,
        section header, and card under it picks up the variant. To embed a
        single bold hero or elegant pull-quote inside an otherwise default
        page, reach for the BEM modifiers directly:
        <code>.section-header--bold</code>, <code>.card-static--elegant</code>,
        <code>.heading--elegant</code>. The modifier route doesn't leak
        because no parent <code>.style--*</code> wrapper changes
        <code>--font-display</code>.
      </p>
    </section>
  </div>
</template>
