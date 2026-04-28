<script setup lang="ts">
useHead({ title: "TuxLinkSlab · TUX" });

const sectionLinks = [
  { label: "About",     to: "#", icon: "lucide:info",      description: "Mission, history, leadership" },
  { label: "Programs",  to: "#", icon: "lucide:flag",      description: "All research areas" },
  { label: "News",      to: "#", icon: "lucide:newspaper", description: "Latest from the field" },
  { label: "Contact",   to: "#", icon: "lucide:mail",      description: "Sponsored research, press, careers" },
];

const exampleVue = `<TuxLinkSlab :links="links" tone="neutral" />`;
</script>

<template>
  <div class="space-y-12">
    <TuxPageHeader eyebrow="component" title="TuxLinkSlab">
      Full-width horizontal band of prominent links — the
      "footer-of-section navigation" pattern. Distinct from
      <code>TuxLinkList</code> (which is a multi-column grouped list):
      this one is a single band of equal-weight calls between major
      sections. Three tones (plain / neutral / maroon).
    </TuxPageHeader>

    <section>
      <p class="eyebrow">canonical</p>
      <h2 class="heading--bold text-xl font-bold">Neutral · routing band</h2>
      <TuxExample class="mt-4" :vue="exampleVue">
        <TuxLinkSlab :links="sectionLinks" tone="neutral" />
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">tones</p>
      <h2 class="heading--bold text-xl font-bold">Plain / neutral / maroon</h2>
      <p class="text-sm text-text-secondary mb-3">
        <strong>Plain</strong> sits transparent on the page surface,
        useful for inline section breaks. <strong>Neutral</strong> is the
        most common — gentle contrast band. <strong>Maroon</strong> is
        the loudest call, save for once per page (or never, on
        information-dense surfaces).
      </p>
      <TuxExample class="mt-4">
        <div class="space-y-4">
          <TuxLinkSlab :links="sectionLinks" tone="plain" />
          <TuxLinkSlab :links="sectionLinks" tone="neutral" />
          <TuxLinkSlab :links="sectionLinks" tone="maroon" />
        </div>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">no descriptions</p>
      <h2 class="heading--bold text-xl font-bold">Compact label-only</h2>
      <p class="text-sm text-text-secondary mb-3">
        Drop <code>description</code> per item for a tighter band when
        the labels speak for themselves.
      </p>
      <TuxExample class="mt-4">
        <TuxLinkSlab
          tone="neutral"
          :links="[
            { label: 'Research',     to: '#', icon: 'lucide:microscope' },
            { label: 'Publications', to: '#', icon: 'lucide:book-open' },
            { label: 'People',       to: '#', icon: 'lucide:users' },
            { label: 'Apply',        to: '#', icon: 'lucide:graduation-cap' },
          ]"
        />
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">props</p>
      <h2 class="heading--bold text-xl font-bold">Props + link shape</h2>
      <ul class="mt-4 space-y-2 text-sm">
        <li><code>links</code> — array of <code>{ label, to?, href?, icon?, description? }</code>. Required.</li>
        <li><code>tone</code> — <code>"plain" | "neutral" | "maroon"</code>. Defaults to <code>"plain"</code>.</li>
        <li>Whole link is the click target. Auto-fits to row width — drops to a stacked single-column at narrow container widths.</li>
      </ul>
    </section>
  </div>
</template>
