<script setup lang="ts">
useHead({ title: "Tokens · TUX" });

const brand = [
  { name: "tti-maroon",      hex: "#5C0025", var: "--tti-maroon" },
  { name: "tti-maroon-deep", hex: "#500000", var: "--tti-maroon-deep" },
  { name: "tti-gold",        hex: "#DDAC37", var: "--tti-gold" },
  { name: "tti-navy",        hex: "#15457E", var: "--tti-navy" },
  { name: "tti-teal",        hex: "#4A8892", var: "--tti-teal" },
  { name: "tti-sage",        hex: "#66814F", var: "--tti-sage" },
  { name: "tti-charcoal",    hex: "#221F1F", var: "--tti-charcoal" },
];

const semantic = [
  { name: "brand-primary",   var: "--brand-primary",   role: "Primary action + identity (maroon)" },
  { name: "brand-accent",    var: "--brand-accent",    role: "Gold bars + warning accent" },
  { name: "brand-secondary", var: "--brand-secondary", role: "Inline text links (navy)" },
  { name: "surface-page",    var: "--surface-page",    role: "Page background" },
  { name: "surface-raised",  var: "--surface-raised",  role: "Cards, header, raised panels" },
  { name: "surface-sunken",  var: "--surface-sunken",  role: "Footer, subtle fill" },
  { name: "surface-border",  var: "--surface-border",  role: "Dividers + input borders" },
  { name: "text-primary",    var: "--text-primary",    role: "Body copy" },
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

    <section>
      <p class="eyebrow">brand anchor</p>
      <h2 class="heading--bold text-xl font-bold">TTI palette</h2>
      <div class="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
        <div v-for="c in brand" :key="c.name" class="rounded-md overflow-hidden border border-surface-border">
          <div class="h-20" :style="{ background: `var(${c.var})` }" />
          <div class="p-3">
            <div class="text-sm font-semibold">{{ c.name }}</div>
            <div class="text-xs font-mono text-text-muted">{{ c.hex }}</div>
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
