<script setup lang="ts">
useHead({ title: "Tokens · TUX" });

const brand = [
  { name: "tti-maroon (Aggie Maroon)", hex: "#500000", var: "--tti-maroon" },
  { name: "tti-maroon-deep",           hex: "#3C0000", var: "--tti-maroon-deep" },
  { name: "tti-gold (Warm Gold)",       hex: "#CFA935", var: "--tti-gold" },
  { name: "tti-navy",                  hex: "#005480", var: "--tti-navy" },
  { name: "tti-teal",                  hex: "#006F79", var: "--tti-teal" },
  { name: "tti-forest",                hex: "#285C4D", var: "--tti-forest" },
  { name: "tti-charcoal",              hex: "#232323", var: "--tti-charcoal" },
];

const spectrumDivisions = [
  { division: "Crash Testing & Roadside Safety",       color: "Aggie Maroon", hex: "#500000", var: "--spectrum-maroon" },
  { division: "Network Modeling & Connected Infra",     color: "Deep Blue",    hex: "#005480", var: "--spectrum-blue" },
  { division: "Policy, Air Quality & Economic Analysis", color: "Institutional Teal", hex: "#006F79", var: "--spectrum-teal" },
  { division: "Transit Mobility & Multimodal",          color: "Forest Green", hex: "#285C4D", var: "--spectrum-green" },
  { division: "Human Factors & Automated Vehicles",     color: "Warm Gold",    hex: "#CFA935", var: "--spectrum-gold" },
];

const semantic = [
  { name: "brand-primary",   var: "--brand-primary",   role: "Primary action + identity (Aggie Maroon #500000)" },
  { name: "brand-accent",    var: "--brand-accent",    role: "Warm Gold underline rules + active keylines (#CFA935)" },
  { name: "brand-secondary", var: "--brand-secondary", role: "Inline text links (Deep Blue #005480)" },
  { name: "surface-page",    var: "--surface-page",    role: "Page canvas background" },
  { name: "surface-eggshell", var: "--surface-eggshell", role: "Comm editorial background wash (#F9F9F7)" },
  { name: "surface-cool-gray", var: "--surface-cool-gray", role: "Comm subtle container wash (#E8E8E8)" },
  { name: "surface-raised",  var: "--surface-raised",  role: "Cards, header, raised panels" },
  { name: "surface-sunken",  var: "--surface-sunken",  role: "Footer, subtle well" },
  { name: "surface-border",  var: "--surface-border",  role: "Dividers + input borders" },
  { name: "text-primary",    var: "--text-primary",    role: "Body copy (high-contrast charcoal #040404)" },
  { name: "text-secondary",  var: "--text-secondary",  role: "Labels, meta" },
  { name: "text-muted",      var: "--text-muted",      role: "Captions, timestamps" },
  { name: "text-inverse",    var: "--text-inverse",    role: "Text on dark fills" },
  { name: "text-brand",      var: "--text-brand",      role: "Hover + active nav" },
];

const status = [
  { name: "color-success", var: "--color-success" },
  { name: "color-warning", var: "--color-warning" },
  { name: "color-danger",  var: "--color-danger"  },
  { name: "color-error",   var: "--color-error"   },
  { name: "color-info",    var: "--color-info"    },
];

const maroonShades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

const shadows = [
  { name: "shadow-sm", var: "--shadow-sm" },
  { name: "shadow-md", var: "--shadow-md" },
  { name: "shadow-lg", var: "--shadow-lg" },
  { name: "shadow-focus", var: "--shadow-focus" },
];

const radii = [
  { name: "radius-sm", var: "--radius-sm" },
  { name: "radius-md", var: "--radius-md" },
  { name: "radius-lg", var: "--radius-lg" },
  { name: "radius-xl", var: "--radius-xl" },
];
</script>

<template>
  <div class="space-y-12">
    <TuxPageHeader eyebrow="foundations" title="Tokens">
      Every color, shadow, and radius the system exposes. Switch themes with the
      contrast toggle in the header — the same swatches below will redraw.
    </TuxPageHeader>

    <!-- Interactive Token Studio Callout -->
    <div class="p-5 rounded-2xl bg-surface-raised border border-brand-primary/30 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div class="space-y-1">
        <div class="flex items-center gap-2">
          <span class="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-brand-primary text-white uppercase tracking-wider">
            Interactive 3.0
          </span>
          <h2 class="text-base font-bold text-text-primary m-0">Design Token Studio &amp; Playground</h2>
        </div>
        <p class="text-xs text-text-secondary m-0 max-w-2xl">
          Live-tune corner roundness, typography, and brand colors to ensure harmony with TTI Communications brand guidelines and export directly to WordPress Kadence theme.json.
        </p>
      </div>
      <NuxtLink
        to="/tokens/playground"
        class="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg bg-brand-primary text-white hover:bg-brand-primary-deep transition-colors shadow-xs flex-shrink-0"
      >
        <UIcon name="lucide:sliders" class="w-4 h-4" />
        <span>Open Token Studio →</span>
      </NuxtLink>
    </div>

    <section>
      <p class="eyebrow">brand anchor</p>
      <h2 class="heading--bold text-xl font-bold">TTI palette</h2>
      <div class="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
        <div v-for="c in brand" :key="c.name" class="rounded-none overflow-hidden border border-surface-border">
          <div class="h-20" :style="{ background: `var(${c.var})` }" />
          <div class="p-3">
            <div class="text-sm font-semibold">{{ c.name }}</div>
            <div class="text-xs font-mono text-text-muted">{{ c.hex }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- 5-Band Institutional Spectrum & Division Mapping -->
    <section>
      <p class="eyebrow">communications identity</p>
      <h2 class="heading--bold text-xl font-bold">5-Band Division Spectrum</h2>
      <p class="mt-2 text-xs text-text-secondary max-w-2xl">
        The official color ribbon designed by the TTI Communications team, mapping each color band directly to one of the five TTI research divisions.
      </p>
      <TuxSpectrumRibbon height="md" class="my-4" />
      <div class="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        <div v-for="s in spectrumDivisions" :key="s.var" class="rounded-none overflow-hidden border border-surface-border bg-surface-raised">
          <div class="h-16" :style="{ background: `var(${s.var})` }" />
          <div class="p-3 space-y-1">
            <span class="text-[10px] font-mono font-bold uppercase tracking-wider block" :style="{ color: `var(${s.var})` }">
              {{ s.color }}
            </span>
            <p class="text-xs font-bold text-text-primary m-0 line-clamp-2 leading-tight">
              {{ s.division }}
            </p>
            <span class="text-[11px] font-mono text-text-muted block">{{ s.hex }}</span>
          </div>
        </div>
      </div>
    </section>

    <section>
      <p class="eyebrow">semantic roles</p>
      <h2 class="heading--bold text-xl font-bold">Surfaces &amp; text</h2>
      <div class="mt-4 rounded-md border border-surface-border overflow-hidden">
        <table class="w-full text-sm">
          <thead class="bg-surface-sunken text-text-secondary uppercase text-xs tracking-wider">
            <tr>
              <th class="text-left px-4 py-2">swatch</th>
              <th class="text-left px-4 py-2">token</th>
              <th class="text-left px-4 py-2">role</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="c in semantic" :key="c.name" class="border-t border-surface-border">
              <td class="px-4 py-2">
                <span
                  class="inline-block w-6 h-6 rounded-sm border border-surface-border align-middle"
                  :style="{ background: `var(${c.var})` }"
                />
              </td>
              <td class="px-4 py-2 font-mono text-xs">{{ c.var }}</td>
              <td class="px-4 py-2 text-text-secondary">{{ c.role }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <section>
      <p class="eyebrow">status</p>
      <h2 class="heading--bold text-xl font-bold">State colors</h2>
      <div class="mt-4 flex flex-wrap gap-3">
        <div v-for="c in status" :key="c.name" class="flex items-center gap-2">
          <span
            class="w-6 h-6 rounded-sm border border-surface-border"
            :style="{ background: `var(${c.var})` }"
          />
          <span class="text-sm font-mono">{{ c.var }}</span>
        </div>
      </div>
    </section>

    <section>
      <p class="eyebrow">primary palette</p>
      <h2 class="heading--bold text-xl font-bold">Maroon ramp</h2>
      <p class="mt-2 text-sm text-text-secondary">
        Nuxt UI resolves <code>color="primary"</code> against these — anchored at #5C0025 = 500.
      </p>
      <div class="mt-4 flex rounded-md overflow-hidden border border-surface-border">
        <div
          v-for="s in maroonShades"
          :key="s"
          class="flex-1 text-[10px] font-mono text-center py-4"
          :style="{
            background: `var(--color-maroon-${s})`,
            color: s >= 500 ? 'white' : '#221F1F',
          }"
        >
          {{ s }}
        </div>
      </div>
    </section>

    <section class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div>
        <p class="eyebrow">elevation</p>
        <h2 class="heading--bold text-xl font-bold">Shadows</h2>
        <div class="mt-4 space-y-4">
          <div v-for="s in shadows" :key="s.name" class="flex items-center gap-4">
            <div
              class="w-16 h-16 rounded-md bg-surface-raised"
              :style="{ boxShadow: `var(${s.var})` }"
            />
            <div>
              <div class="text-sm font-semibold">{{ s.name }}</div>
              <div class="text-xs font-mono text-text-muted">{{ s.var }}</div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <p class="eyebrow">shape</p>
        <h2 class="heading--bold text-xl font-bold">Radii</h2>
        <div class="mt-4 space-y-4">
          <div v-for="r in radii" :key="r.name" class="flex items-center gap-4">
            <div
              class="w-16 h-16 bg-surface-sunken border border-surface-border"
              :style="{ borderRadius: `var(${r.var})` }"
            />
            <div>
              <div class="text-sm font-semibold">{{ r.name }}</div>
              <div class="text-xs font-mono text-text-muted">{{ r.var }}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
