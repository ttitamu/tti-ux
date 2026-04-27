<script setup lang="ts">
useHead({ title: "TuxFooter · tti-ux" });

// Demo data — same shape as what app.vue passes for the live footer.
const demoSocial = [
  { icon: "lucide:linkedin",  label: "LinkedIn",  href: "https://www.linkedin.com/company/texas-a-m-transportation-institute/" },
  { icon: "lucide:facebook",  label: "Facebook",  href: "https://www.facebook.com/TTITAMUS" },
  { icon: "lucide:instagram", label: "Instagram", href: "https://www.instagram.com/ttitamus/" },
  { icon: "lucide:youtube",   label: "YouTube",   href: "https://www.youtube.com/user/TTIVideoChannel" },
  { icon: "lucide:twitter",   label: "X (Twitter)", href: "https://x.com/TTITAMUS" },
];

const demoColumns = [
  {
    heading: "State Resources",
    links: [
      { label: "The State of Texas",         href: "https://www.texas.gov/" },
      { label: "Texas Homeland Security",    href: "https://gov.texas.gov/organization/hs" },
      { label: "Texas Veterans Portal",      href: "https://veterans.portal.texas.gov/" },
      { label: "State Expenditure Database", href: "https://comptroller.texas.gov/transparency/" },
    ],
  },
  {
    heading: "Policies",
    links: [
      { label: "TAMUS Risk, Fraud & Misconduct Hotline", href: "#" },
      { label: "Digital Accessibility",                  href: "#" },
      { label: "Site Policies",                          href: "#" },
      { label: "Open Records Policy",                    href: "#" },
    ],
  },
];

const fullExampleVue = `<TuxFooter
  :columns="[
    { heading: 'State Resources', links: [...] },
    { heading: 'Policies',        links: [...] },
  ]"
  :social="[
    { icon: 'lucide:linkedin', label: 'LinkedIn', href: '...' },
    { icon: 'lucide:facebook', label: 'Facebook', href: '...' },
    ...
  ]"
>
  <template #preferences>
    <button @click="toggleHighContrast">High-contrast mode</button>
  </template>
</TuxFooter>`;

const slimExampleVue = `<!-- Pass no columns / no social — you get the
     identity block + mandatory legal strip. -->
<TuxFooter />`;
</script>

<template>
  <div class="space-y-12">
    <TuxPageHeader eyebrow="component" title="TuxFooter">
      The unified institutional footer. Maroon marketing top + black
      legal strip in a single component, mirroring the shape every
      tti.tamu.edu / tamu.edu / pvamu.edu surface uses. Earlier we
      shipped this as three pieces (slim app footer, marketing
      footer, TAMUS legal subfooter) — collapsed into one because
      every shipped TTI surface needs the same anchor.
      <strong>The black legal strip is mandatory and not
      configurable</strong> — TAMUS lockup, tagline, and state-agency
      links are fixed per AggieUX policy.
    </TuxPageHeader>

    <section>
      <p class="eyebrow">canonical</p>
      <h2 class="heading--bold text-xl font-bold">Full institutional footer</h2>
      <p class="text-sm text-text-secondary mb-3">
        The shape used on the style guide itself, on marcom landing
        pages, and on docs sites. Pass <code>columns</code> and
        <code>social</code> to populate the marketing top; the black
        legal strip below renders unconditionally.
      </p>
      <TuxExample class="mt-4" :vue="fullExampleVue">
        <div class="border border-surface-border rounded-md overflow-hidden">
          <div class="p-12 bg-surface-page text-center text-text-muted text-sm">
            (page content)
          </div>
          <TuxFooter
            :columns="demoColumns"
            :social="demoSocial"
          />
        </div>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">app dashboard</p>
      <h2 class="heading--bold text-xl font-bold">Slim — no marketing columns</h2>
      <p class="text-sm text-text-secondary mb-3">
        Drop the <code>columns</code> and <code>social</code> props
        and the maroon top compresses to just the identity block
        (logo + name + address + phone). The right shape for app
        contexts where marketing-y link grids would feel out of
        place — PECAN dashboards, tti-ai-studio sessions.
      </p>
      <TuxExample class="mt-4" :vue="slimExampleVue">
        <div class="border border-surface-border rounded-md overflow-hidden">
          <div class="p-12 bg-surface-page text-center text-text-muted text-sm">
            (page content)
          </div>
          <TuxFooter />
        </div>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">props</p>
      <h2 class="heading--bold text-xl font-bold">Props</h2>
      <ul class="mt-4 space-y-2 text-sm">
        <li><code>name</code> — institution name. Defaults to TTI.
          Override for sibling-institution builds (PVAMU, Tarleton, WTAMU).</li>
        <li><code>address</code> — multi-line address (split on newlines).</li>
        <li><code>phone</code> — phone number, rendered as a
          <code>tel:</code> link. Pass <code>null</code> to hide.</li>
        <li><code>logo</code> — logo path. Defaults to
          <code>/logo.svg</code>; the component inverts it to
          render light-on-maroon.</li>
        <li><code>logoSize</code> — px width/height. Defaults to 80.</li>
        <li><code>social</code> — array of
          <code>{ icon, label, href }</code>. Renders as a circular-button
          row beneath the address. Pass empty to hide.</li>
        <li><code>columns</code> — array of
          <code>{ heading, links: [{ label, href?, to? }] }</code>.
          Two columns is canonical; three+ works on wide containers.
          Pass empty to hide.</li>
        <li><code>year</code> — © year. Defaults to current year.</li>
      </ul>
      <h3 class="heading--bold font-bold mt-6 mb-2 text-sm">Slot</h3>
      <ul class="space-y-2 text-sm">
        <li><code>#preferences</code> — optional row beneath the
          state-agency links in the legal strip. Used in the style
          guide for the high-contrast toggle (per ADR-0006:
          accessibility-as-compliance).</li>
      </ul>
    </section>
  </div>
</template>
