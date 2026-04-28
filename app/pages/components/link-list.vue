<script setup lang="ts">
useHead({ title: "TuxLinkList · TUX" });

const groups = [
  {
    heading: "For sponsors",
    items: [
      { label: "Active solicitations",   to: "/sponsors/solicitations" },
      { label: "Sponsored research FAQ", to: "/sponsors/faq" },
      { label: "Past project archive",   to: "/sponsors/archive" },
      { label: "Contract templates",     href: "https://tamus.edu/legal/templates" },
    ],
  },
  {
    heading: "For partners",
    items: [
      { label: "Industry liaison",       to: "/partners/liaison",  description: "Single point of contact for IP, licensing, and joint research." },
      { label: "Co-funded programs",     to: "/partners/cofunded" },
      { label: "Collaboration agreement",href: "https://tamus.edu/legal/cra" },
    ],
  },
  {
    heading: "For students",
    items: [
      { label: "Graduate assistantships", to: "/students/ga", featured: true },
      { label: "Internship program",      to: "/students/internships" },
      { label: "Thesis sponsorship",      to: "/students/thesis" },
      { label: "Career portal",           href: "https://careers.tti.tamu.edu" },
    ],
  },
];

const exampleVue = `<TuxLinkList :groups="groups" :columns="3" />`;
</script>

<template>
  <div class="space-y-12">
    <TuxPageHeader eyebrow="component" title="TuxLinkList">
      Categorized resource list. Two layouts: <strong>columns</strong>
      (groups side-by-side, footer-of-section pattern) or
      <strong>stacked</strong> (top-to-bottom, sidebar resource list).
      Each link can carry an optional description, an external arrow
      (auto-detected on http(s) hrefs), or a <strong>featured</strong>
      flag for maroon left-bar emphasis.
    </TuxPageHeader>

    <section>
      <p class="eyebrow">canonical</p>
      <h2 class="heading--bold text-xl font-bold">3-column · footer of section</h2>
      <TuxExample class="mt-4" :vue="exampleVue">
        <TuxLinkList :groups="groups" :columns="3" />
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">stacked</p>
      <h2 class="heading--bold text-xl font-bold">Sidebar resource list</h2>
      <p class="text-sm text-text-secondary mb-3">
        Pass <code>layout="stacked"</code>. Right for inline content and
        sidebars where horizontal column space is constrained.
      </p>
      <TuxExample class="mt-4">
        <div class="max-w-sm">
          <TuxLinkList layout="stacked" :groups="groups" />
        </div>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">featured + descriptions</p>
      <h2 class="heading--bold text-xl font-bold">Mixed emphasis</h2>
      <p class="text-sm text-text-secondary mb-3">
        Pass <code>featured: true</code> on items that should be the
        primary call ("Apply now", "Start here"). Pass
        <code>description</code> on items that need more than a label.
      </p>
      <TuxExample class="mt-4">
        <TuxLinkList
          layout="stacked"
          :groups="[{
            heading: 'Get started',
            items: [
              { label: 'Apply for a graduate assistantship', to: '/apply', featured: true, description: 'Cohort opens September 1. Applications close December 15.' },
              { label: 'Browse the research catalog',         to: '/research' },
              { label: 'Subscribe to the quarterly bulletin', to: '/subscribe' },
              { label: 'Read the institutional report',       href: 'https://tti.tamu.edu/annual-report' },
            ],
          }]"
        />
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">props</p>
      <h2 class="heading--bold text-xl font-bold">Props + shape</h2>
      <ul class="mt-4 space-y-2 text-sm">
        <li><code>groups</code> — array of <code>{ heading?, items }</code>. Required.</li>
        <li>Each item — <code>{ label, to?, href?, description?, external?, featured? }</code>.</li>
        <li><code>external</code> — auto-detected when <code>href</code> starts with <code>http</code>; override explicitly if needed.</li>
        <li><code>featured</code> — maroon left-bar emphasis.</li>
        <li><code>layout</code> — <code>"columns" | "stacked"</code>. Defaults to <code>"columns"</code>.</li>
        <li><code>columns</code> — <code>2 | 3 | 4</code>. Columns layout only.</li>
      </ul>
    </section>
  </div>
</template>
