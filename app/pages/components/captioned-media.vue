<script setup lang="ts">
useHead({ title: "TuxCaptionedMedia · tti-ux" });

const exampleVue = `<TuxCaptionedMedia
  alt="Connected vehicle test track at Rellis Campus"
  eyebrow="Figure 3"
  caption="The 412-mile continuously-instrumented freight corridor under construction during the Q3 2025 deployment window."
  credit="TTI Photography · 2025"
/>`;
</script>

<template>
  <div class="space-y-12">
    <TuxPageHeader eyebrow="component" title="TuxCaptionedMedia">
      Single image (or video frame) embedded inline in body content with
      a structured caption + credit. Four aspect ratios, three alignment
      treatments. For galleries, use <code>TuxPhotoGrid</code>; for video
      embeds, drop an <code>&lt;iframe&gt;</code> into the
      <code>#media</code> slot — the wrapper handles aspect ratio.
    </TuxPageHeader>

    <section>
      <p class="eyebrow">canonical</p>
      <h2 class="heading--bold text-xl font-bold">16:9 · full width</h2>
      <TuxExample class="mt-4" :vue="exampleVue">
        <TuxCaptionedMedia
          alt="Connected vehicle test track at Rellis Campus"
          eyebrow="Figure 3"
          caption="The 412-mile continuously-instrumented freight corridor under construction during the Q3 2025 deployment window."
          credit="TTI Photography · 2025"
        />
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">aspect ratios</p>
      <h2 class="heading--bold text-xl font-bold">16:9 / 4:3 / 1:1 / 3:4</h2>
      <p class="text-sm text-text-secondary mb-3">
        Pick the ratio that matches the source. 16:9 for video frames and
        landscape photography, 4:3 for editorial portraits of buildings or
        crews, 1:1 for product shots and close-ups, 3:4 for environmental
        portraits.
      </p>
      <TuxExample class="mt-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TuxCaptionedMedia aspect="16/9" alt="16:9 widescreen" caption="16:9 — video frames, landscape photography" tone="maroon" />
          <TuxCaptionedMedia aspect="4/3"  alt="4:3 editorial"   caption="4:3 — editorial photography, the institutional default" tone="gold" />
          <TuxCaptionedMedia aspect="1/1"  alt="1:1 square"      caption="1:1 — product shots, close-ups, social-shareable" tone="charcoal" />
          <TuxCaptionedMedia aspect="3/4"  alt="3:4 portrait"    caption="3:4 — environmental portraits, faculty photos" tone="maroon" />
        </div>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">align="right" · pull-right pattern</p>
      <h2 class="heading--bold text-xl font-bold">In flowing prose</h2>
      <p class="text-sm text-text-secondary mb-3">
        Pass <code>align="right"</code> to float the figure to the right
        column with text wrapping around it. Drops back to full-width
        below 48rem viewports.
      </p>
      <TuxExample class="mt-4">
        <div class="max-w-3xl">
          <TuxCaptionedMedia
            align="right"
            aspect="4/3"
            alt="Field crew at site 04"
            eyebrow="On site"
            caption="Field crew during the 2024 reconstruction window."
            credit="J. Hassan · 2024"
            tone="maroon"
          />
          <p class="text-text-secondary leading-relaxed mb-3">
            Roadway departure crashes account for more than half of rural
            fatalities, and the persistent geographic distribution of these
            events points to enduring infrastructure conditions rather than
            transient driver behavior. TTI's twelve-county before/after
            study began in 2020, with reconstruction work staggered across
            three field seasons.
          </p>
          <p class="text-text-secondary leading-relaxed mb-3">
            Each treated intersection received high-friction surface
            treatment, retroreflective markings, and a chevron alignment
            package; control intersections received only routine
            maintenance. Compliance gains held steady through the 36-month
            follow-up window.
          </p>
          <p class="text-text-secondary leading-relaxed">
            Three of the twelve treated sites also showed measurable
            reductions in late-night crashes — a secondary outcome that the
            team is investigating in a follow-on dissertation project.
          </p>
        </div>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">video embed</p>
      <h2 class="heading--bold text-xl font-bold">#media slot</h2>
      <p class="text-sm text-text-secondary mb-3">
        The <code>#media</code> slot replaces the image with whatever you
        pass — <code>&lt;iframe&gt;</code>, <code>&lt;video&gt;</code>,
        SVG, custom canvas. The aspect ratio + caption rhythm stay
        consistent.
      </p>
      <TuxExample class="mt-4">
        <TuxCaptionedMedia
          aspect="16/9"
          eyebrow="Demo"
          caption="Placeholder video frame — drop in a YouTube/Vimeo iframe via the #media slot."
          credit="TTI MovementLab"
        >
          <template #media>
            <div class="w-full h-full grid place-items-center bg-surface-sunken text-text-muted text-sm font-mono">
              &lt;iframe src="https://www.youtube.com/embed/..."&gt;
            </div>
          </template>
        </TuxCaptionedMedia>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">props</p>
      <h2 class="heading--bold text-xl font-bold">Props reference</h2>
      <ul class="mt-4 space-y-2 text-sm">
        <li><code>src</code> + <code>alt</code> — image URL + alt text. If <code>src</code> is omitted, renders a labeled gradient placeholder.</li>
        <li><code>eyebrow</code>, <code>caption</code>, <code>credit</code> — structured caption parts.</li>
        <li><code>aspect</code> — <code>"16/9" | "4/3" | "1/1" | "3/4"</code>. Defaults to <code>"16/9"</code>.</li>
        <li><code>align</code> — <code>"full" | "wide" | "right"</code>. Defaults to <code>"full"</code>.</li>
        <li><code>tone</code> — placeholder gradient tone. Defaults to <code>"maroon"</code>.</li>
        <li><code>#media</code> slot — replace the image with arbitrary media (iframe, video, SVG).</li>
      </ul>
    </section>
  </div>
</template>
