<script setup lang="ts">
useHead({ title: "TuxPhotoGrid · TUX" });

const photoItems = [
  { alt: "Aerial view of the connected vehicle test track at the Texas A&M RELLIS Campus", tone: "maroon" as const, caption: "Connected vehicle test track", credit: "TTI Photography · 2025" },
  { alt: "Rural highway intersection at Site 04 with high-friction surface treatment and chevron alignment signage", tone: "charcoal" as const, caption: "Site 04 · before/after study", credit: "Hassan et al. · 2024" },
  { alt: "Researchers monitoring real-time corridor telemetry displays inside the TTI MovementLab control room", tone: "gold" as const, caption: "MovementLab · Q3 2025" },
  { alt: "TTI field instrumentation crew calibrating roadside radar sensors across the 12-county study region", tone: "maroon" as const, caption: "Field crew · 12-county deployment" },
  { alt: "Keynote address on roadway safety and human factors at the 2025 TTI Annual Transportation Symposium", tone: "charcoal" as const, caption: "Symposium · 2025 keynote" },
  { alt: "Heavy commercial freight platoon traveling along the instrumented Interstate 10 Houston corridor segment", tone: "gold" as const, caption: "Freight corridor · Houston segment" },
];

const logoItems = [
  { alt: "Texas Department of Transportation (TxDOT)", tone: "maroon" as const },
  { alt: "Federal Highway Administration (FHWA)",  tone: "charcoal" as const },
  { alt: "National Science Foundation (NSF)",   tone: "gold" as const },
  { alt: "American Association of State Highway and Transportation Officials (AASHTO)", tone: "maroon" as const },
  { alt: "United States Department of Transportation (USDOT)", tone: "charcoal" as const },
  { alt: "Texas A&M Transportation Institute (TTI)",   tone: "gold" as const },
];

const exampleVue = `<TuxPhotoGrid :items="photoItems" :columns="3" />`;
</script>

<template>
  <div class="space-y-12">
    <TuxPageHeader eyebrow="component" title="TuxPhotoGrid">
      Uniform image grid. <strong>Photo</strong> kind for research
      photography and project galleries (4:3, full color, optional
      caption + credit). <strong>Logo</strong> kind for partner /
      sponsor walls (1:1, grayscale by default, color on hover). Auto-fits
      columns to the viewport — `columns` is a target, not a hard limit.
    </TuxPageHeader>

    <section>
      <p class="eyebrow">canonical</p>
      <h2 class="heading--bold text-xl font-bold">Photo grid · 3-up</h2>
      <p class="text-sm text-text-secondary mb-3">
        Items rendered with labeled gradient placeholders since this is
        the design system; in real consumers, pass <code>src</code> for
        each item.
      </p>
      <TuxExample class="mt-4" :vue="exampleVue">
        <TuxPhotoGrid :items="photoItems" :columns="3" />
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">photo grid · 4-up</p>
      <h2 class="heading--bold text-xl font-bold">Denser layout</h2>
      <TuxExample class="mt-4">
        <TuxPhotoGrid :items="photoItems" :columns="4" />
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">logo wall</p>
      <h2 class="heading--bold text-xl font-bold">Sponsor / partner / agency</h2>
      <p class="text-sm text-text-secondary mb-3">
        Pass <code>kind="logo"</code>. Square aspect, grayscale-by-default
        treatment, hover restores color. Captions are suppressed — the
        alt text carries the agency name.
      </p>
      <TuxExample class="mt-4">
        <TuxPhotoGrid kind="logo" :items="logoItems" :columns="6" />
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">aspect override</p>
      <h2 class="heading--bold text-xl font-bold">16:9 widescreen</h2>
      <p class="text-sm text-text-secondary mb-3">
        Pass <code>aspect="16/9"</code> for cinematic layouts.
      </p>
      <TuxExample class="mt-4">
        <TuxPhotoGrid :items="photoItems.slice(0, 3)" :columns="3" aspect="16/9" />
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">props</p>
      <h2 class="heading--bold text-xl font-bold">Props + item shape</h2>
      <ul class="mt-4 space-y-2 text-sm">
        <li><code>items</code> — array of <code>{ src?, alt?, caption?, credit?, tone?, href? }</code>. Required.</li>
        <li><code>kind</code> — <code>"photo" | "logo"</code>. Defaults to <code>"photo"</code>.</li>
        <li><code>columns</code> — <code>2..6</code>. Auto-fits to viewport.</li>
        <li><code>aspect</code> — <code>"4/3" | "1/1" | "16/9" | "3/4"</code>. Defaults: 4/3 for photos, 1/1 for logos.</li>
        <li>Items without <code>src</code> render labeled gradient placeholders for design mocks. Tone cycles maroon/gold/charcoal.</li>
        <li>Items with <code>href</code> become clickable tiles with corner-drop hover.</li>
      </ul>
    </section>
  </div>
</template>
