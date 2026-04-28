<script setup lang="ts">
useHead({ title: "TuxSiteNav · TUX" });

const universityNav = {
  identity: {
    level: "institution" as const,
    name: "Texas A&M Transportation Institute",
    href: "/",
  },
  utilityNav: [
    { label: "Apply",   to: "#" },
    { label: "Visit",   to: "#" },
    { label: "Give",    to: "#" },
    { label: "Library", to: "#" },
  ],
  primaryNav: [
    {
      label: "Research",
      megaMenu: {
        columns: [
          {
            heading: "Programs",
            items: [
              { label: "Connected & Automated Vehicles", to: "#", description: "Field-deployed sensor networks" },
              { label: "Roadway Safety",                  to: "#", description: "12-county before/after studies" },
              { label: "Mobility & Economics",            to: "#", description: "Equity-weighted DOT frameworks" },
              { label: "Policy Translation",              to: "#", description: "Research-to-guidance pipelines" },
            ],
          },
          {
            heading: "Resources",
            items: [
              { label: "Active solicitations", to: "#" },
              { label: "Publications",         to: "#" },
              { label: "Past projects",        to: "#" },
              { label: "Datasets",             to: "#" },
            ],
          },
          {
            heading: "For sponsors",
            items: [
              { label: "Sponsored research",   to: "#" },
              { label: "Industry liaison",     to: "#" },
              { label: "Co-funded programs",   to: "#" },
            ],
          },
        ],
        featured: {
          eyebrow: "2025 report",
          title: "Twelve-county roadway study",
          description: "Three-year compliance gains held steady through follow-up. Read the full findings.",
          to: "#",
        },
      },
    },
    {
      label: "About",
      dropdown: [
        { label: "Mission",    to: "#", description: "How TTI fits in TAMUS" },
        { label: "Leadership", to: "#" },
        { label: "Centers",    to: "#" },
        { label: "Contact",    to: "#" },
      ],
    },
    { label: "News",     to: "#" },
    { label: "Careers",  to: "#" },
  ],
};

const appNav = {
  identity: {
    level: "department" as const,
    superhead: "Texas A&M Transportation Institute",
    name: "PECAN",
    href: "/",
  },
  primaryNav: [
    { label: "Indices",     to: "#" },
    { label: "Scans",       to: "#" },
    { label: "Classifiers", to: "#" },
    {
      label: "Settings",
      dropdown: [
        { label: "Tokens", to: "#" },
        { label: "Agents", to: "#" },
        { label: "Audit log", to: "#" },
      ],
    },
  ],
};

const exampleVue = `<TuxSiteNav
  :identity="{ level: 'institution', name: 'Texas A&M Transportation Institute', href: '/' }"
  :utility-nav="[
    { label: 'Apply',   to: '/apply' },
    { label: 'Visit',   to: '/visit' },
    { label: 'Give',    to: '/give' },
  ]"
  search
  :primary-nav="[
    { label: 'Research', megaMenu: { columns: [...], featured: {...} } },
    { label: 'About',    dropdown: [...] },
    { label: 'News',     to: '/news' },
  ]"
/>`;
</script>

<template>
  <div class="space-y-12">
    <TuxPageHeader eyebrow="component" title="TuxSiteNav · TuxDropdown · TuxMegaMenu">
      Institutional top-bar with identity lockup + primary nav. Each
      primary item can be a plain link, a <strong>TuxDropdown</strong>
      (single column of links), or a <strong>TuxMegaMenu</strong>
      (multi-column panel with optional featured tile). Optional utility
      strip above + search trigger. Five AggieUX site types
      (University / Center / Department / Application+nav / Application-only)
      all express via composition rather than a "type" prop.
    </TuxPageHeader>

    <section>
      <p class="eyebrow">canonical · university site</p>
      <h2 class="heading--bold text-xl font-bold">Utility nav + identity nav with mega menu + dropdown</h2>
      <p class="text-sm text-text-secondary mb-3">
        Hover or focus the <strong>Research</strong> entry for the
        full-width mega panel; <strong>About</strong> reveals a single-column
        dropdown. Both close on Escape and click-outside.
      </p>
      <TuxExample class="mt-4" :vue="exampleVue">
        <div class="border border-surface-border rounded-md overflow-hidden bg-surface-page" style="min-height: 16rem; container-type: inline-size">
          <TuxSiteNav v-bind="universityNav" search @search:open="() => {}" />
          <div class="px-6 py-12 text-center text-sm text-text-muted">
            (Page content — interact with the nav above.)
          </div>
        </div>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">application chrome</p>
      <h2 class="heading--bold text-xl font-bold">Internal product header</h2>
      <p class="text-sm text-text-secondary mb-3">
        Department-level identity, no utility strip, simpler primary
        nav. Pattern for PECAN, tti-ai-studio, and other internal IT
        product surfaces.
      </p>
      <TuxExample class="mt-4">
        <div class="border border-surface-border rounded-md overflow-hidden bg-surface-page" style="min-height: 12rem; container-type: inline-size">
          <TuxSiteNav v-bind="appNav" />
          <div class="px-6 py-10 text-center text-sm text-text-muted">
            (Application body.)
          </div>
        </div>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">dropdown · standalone</p>
      <h2 class="heading--bold text-xl font-bold">TuxDropdown alone (no SiteNav)</h2>
      <p class="text-sm text-text-secondary mb-3">
        TuxDropdown can also stand alone for inline-content "more
        actions" patterns or in custom navigation layouts that don't
        need the full TuxSiteNav scaffold.
      </p>
      <TuxExample class="mt-4">
        <div class="flex items-center gap-4">
          <TuxDropdown
            label="Resources"
            :items="[
              { label: 'Documentation',   to: '#', description: 'Architecture + API reference' },
              { label: 'Changelog',       to: '#', description: 'Per-release notes' },
              { label: 'Contributing',    to: '#', description: 'How to file issues + PRs' },
              { label: 'Status page',     href: 'https://status.tti.tamu.edu' },
            ]"
          />
          <TuxDropdown
            label="Account"
            :items="[
              { label: 'Profile',  to: '#' },
              { label: 'Tokens',   to: '#' },
              { label: 'Sign out', to: '#' },
            ]"
          />
        </div>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">props</p>
      <h2 class="heading--bold text-xl font-bold">Props reference</h2>
      <h3 class="font-bold mt-4 mb-1 text-sm">TuxSiteNav</h3>
      <ul class="space-y-2 text-sm">
        <li><code>identity</code> — TuxIdentity props (<code>level</code>, <code>name</code>, <code>href</code>, etc). Required.</li>
        <li><code>primaryNav</code> — array of <code>{ label, to?, href?, dropdown?, megaMenu? }</code>. Each item is one of: plain link / dropdown trigger / mega-menu trigger.</li>
        <li><code>utilityNav</code> — small upper-strip links. Optional.</li>
        <li><code>search</code> — show a search trigger in the utility bar (emits <code>@search:open</code>).</li>
        <li><code>sticky</code> — pin the entire nav at the top of the viewport.</li>
      </ul>
      <h3 class="font-bold mt-4 mb-1 text-sm">TuxDropdown</h3>
      <ul class="space-y-2 text-sm">
        <li><code>label</code> — trigger label. Required.</li>
        <li><code>items</code> — array of <code>{ label, to?, href?, description? }</code>.</li>
      </ul>
      <h3 class="font-bold mt-4 mb-1 text-sm">TuxMegaMenu</h3>
      <ul class="space-y-2 text-sm">
        <li><code>label</code> — trigger label. Required.</li>
        <li><code>columns</code> — array of <code>{ heading, items }</code>.</li>
        <li><code>featured</code> — optional <code>{ eyebrow?, title, description?, to?, href?, image? }</code> for the right-rail tile.</li>
      </ul>
    </section>
  </div>
</template>
