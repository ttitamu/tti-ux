<script setup lang="ts">
useHead({ title: "TuxFooter + TuxSubfooter · tti-ux" });

const exampleVue = `<TuxFooter
  version="PECAN v2.14.3"
  name="Texas A&M Transportation Institute"
  :links="[
    { label: 'Docs',      to: '/docs' },
    { label: 'Support',   href: 'https://helpdesk.tti.tamu.edu' },
    { label: 'Status',    href: 'https://status.tti.tamu.edu' },
    { label: 'Changelog', to: '/changelog' },
  ]"
/>
<TuxSubfooter />`;
</script>

<template>
  <div class="space-y-12">
    <TuxPageHeader eyebrow="component" title="TuxFooter + TuxSubfooter">
      Two components, paired on every shipped surface.
      <strong>TuxFooter</strong> is the slim app-level compliance strip
      (version + © + utility links) for internal tools.
      <strong>TuxSubfooter</strong> is the mandatory TAMUS legal strip —
      Texas A&amp;M University System requirement, content fixed per
      AggieUX guidance, only the institute name in the © line varies.
    </TuxPageHeader>

    <section>
      <p class="eyebrow">canonical pairing</p>
      <h2 class="heading--bold text-xl font-bold">App footer + TAMUS subfooter</h2>
      <p class="text-sm text-text-secondary mb-3">
        How PECAN, tti-ai-studio, and tux's own pages should anchor —
        TuxFooter on top, TuxSubfooter directly below. Don't separate
        them with other content.
      </p>
      <TuxExample class="mt-4" :vue="exampleVue">
        <div class="border border-surface-border rounded-md overflow-hidden">
          <div class="p-12 bg-surface-page text-center text-text-muted text-sm">
            (page content)
          </div>
          <TuxFooter
            version="PECAN v2.14.3"
            name="Texas A&M Transportation Institute"
            :links="[
              { label: 'Docs',      to: '/docs' },
              { label: 'Support',   href: 'https://helpdesk.tti.tamu.edu' },
              { label: 'Status',    href: 'https://status.tti.tamu.edu' },
              { label: 'Changelog', to: '/changelog' },
            ]"
          />
          <TuxSubfooter />
        </div>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">TuxFooter only</p>
      <h2 class="heading--bold text-xl font-bold">App footer in isolation</h2>
      <p class="text-sm text-text-secondary mb-3">
        Slim by design — <strong>14px vertical padding</strong>, single line
        of content. Version pill renders monospace in brand color (gold on
        dark theme).
      </p>
      <TuxExample class="mt-4">
        <div class="border border-surface-border rounded-md overflow-hidden">
          <TuxFooter
            version="tti-ai-studio v0.4.2"
            name="Texas A&M Transportation Institute"
            :links="[
              { label: 'Sessions', to: '/sessions' },
              { label: 'Models',   to: '/models' },
              { label: 'API keys', to: '/keys' },
              { label: 'Help',     href: 'https://helpdesk.tti.tamu.edu' },
            ]"
          />
        </div>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">TuxSubfooter only</p>
      <h2 class="heading--bold text-xl font-bold">TAMUS legal strip in isolation</h2>
      <p class="text-sm text-text-secondary mb-3">
        Drop-in, no configuration needed in the typical case. The institute
        name in the © line and the year are the only knobs — every other
        element (lockup, tagline, link list) is fixed by TAMUS policy.
      </p>
      <TuxExample class="mt-4">
        <div class="border border-surface-border rounded-md overflow-hidden">
          <TuxSubfooter />
        </div>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">props</p>
      <h2 class="heading--bold text-xl font-bold">Props reference</h2>
      <h3 class="font-bold mt-4 mb-1 text-sm">TuxFooter</h3>
      <ul class="space-y-2 text-sm">
        <li><code>name</code> — institute name in the © line. Defaults to TTI.</li>
        <li><code>version</code> — monospace pill on the left (e.g. <code>"PECAN v2.14.3"</code>). Optional.</li>
        <li><code>year</code> — © year. Defaults to current year.</li>
        <li><code>links</code> — utility links on the right. Each <code>{ label, to?, href? }</code>. Internal <code>to</code> uses NuxtLink; external <code>href</code> opens in new tab.</li>
      </ul>
      <h3 class="font-bold mt-4 mb-1 text-sm">TuxSubfooter</h3>
      <ul class="space-y-2 text-sm">
        <li><code>name</code> — institute name in the © line. Defaults to TTI; override for sibling-institution builds (PVAMU, Tarleton, WTAMU).</li>
        <li><code>address</code> — address text after the © line. Defaults to TTI's College Station address.</li>
        <li><code>year</code> — © year. Defaults to current year.</li>
        <li><strong>Everything else is fixed.</strong> The lockup, tagline, and state-agency link list are mandated by TAMUS policy and not configurable.</li>
      </ul>
    </section>
  </div>
</template>
