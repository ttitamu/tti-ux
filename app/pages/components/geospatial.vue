<script setup lang="ts">
useHead({ title: "Geospatial cluster · TUX" });

// I-35 sample corridor (Bryan/College Station section, mile 174 to 195).
const i35Segments = [
  { from: 174, to: 178, label: "Pre-treatment baseline", toneIndex: 6 },
  { from: 178, to: 184, label: "Treatment zone A — signage", toneIndex: 4 },
  { from: 184, to: 188, label: "Construction zone", toneIndex: 7 },
  { from: 188, to: 192, label: "Treatment zone B — geometry", toneIndex: 1 },
  { from: 192, to: 195, label: "Post-treatment baseline", toneIndex: 6 },
];

const i35Events = [
  { mile: 175.5, label: "FM 60 intersection",  icon: "lucide:crosshair", toneIndex: 2 },
  { mile: 180,   label: "Site 12 instrumentation", icon: "lucide:radar", toneIndex: 3 },
  { mile: 186.5, label: "Incident — 2024-09-14",   icon: "lucide:alert-triangle", toneIndex: 7 },
  { mile: 189,   label: "Treatment applied",        icon: "lucide:check-circle", toneIndex: 4 },
  { mile: 193,   label: "Site 18 instrumentation",  icon: "lucide:radar", toneIndex: 3 },
];

// Crash rate per mile, 22 miles
const crashRate = [
  3.2, 3.4, 3.1, 2.8, 2.9, 3.0, 2.6, 2.4, 2.0, 1.8,
  1.5, 1.4, 2.1, 2.8, 3.5, 2.2, 1.6, 1.4, 1.3, 1.5,
  1.8, 2.0,
];

const tierEntries = [
  { label: "Public",     color: "var(--chart-1)", shape: "square" as const },
  { label: "Internal",   color: "var(--chart-2)", shape: "square" as const },
  { label: "Restricted", color: "var(--chart-3)", shape: "square" as const },
  { label: "ITAR",       color: "var(--chart-7)", shape: "square" as const },
];

const aadtGradient = {
  minLabel: "5K AADT",
  maxLabel: "150K AADT",
  stops: [
    { color: "#fde6e1", label: "25K" },
    { color: "#f4a999", label: "50K" },
    { color: "#cb6353", label: "100K" },
    { color: "#5C0025" },
  ],
};
</script>

<template>
  <div class="space-y-12">
    <TuxPageHeader eyebrow="components · geospatial cluster" title="Geospatial / map">
      Four components that extend TuxChartGeographic toward general
      maps + corridor analysis. Library-agnostic by design:
      TuxMapEmbed wraps any iframe-friendly map provider; TuxMapMarker
      ships as SVG that any map lib (Mapbox / Leaflet / MapLibre)
      can render as a custom marker.
    </TuxPageHeader>

    <section class="space-y-3">
      <p class="eyebrow">corridor visualization</p>
      <h2 class="heading--bold text-xl font-bold">TuxCorridorStrip — I-35, mile 174–195</h2>
      <p class="text-sm text-text-secondary max-w-3xl">
        Native SVG horizontal strip for 1-D corridor data. Mile-
        markers, colored treatment / control segments, point events,
        and an optional value-series spark above (crash rate per
        mile in this example).
      </p>
      <TuxCorridorStrip
        name="I-35 corridor study, central Texas section"
        direction="Northbound  →"
        :from-mile="174"
        :to-mile="195"
        :segments="i35Segments"
        :events="i35Events"
        :values="crashRate"
        values-label="Crash rate per mile"
        :width="900"
        :height="160"
      />

      <div class="text-xs text-text-muted">
        Hover the events / segments for tooltips. Five segments
        (baseline / treatment A / construction / treatment B /
        baseline) + 5 events (intersections, instrumentation,
        incident, treatment applied).
      </div>
    </section>

    <section class="space-y-3">
      <p class="eyebrow">map embed · library-agnostic</p>
      <h2 class="heading--bold text-xl font-bold">TuxMapEmbed</h2>
      <p class="text-sm text-text-secondary max-w-3xl">
        Wraps a third-party map iframe (Mapbox Studio, Google Maps,
        ArcGIS Online, etc.) in TUX brand chrome. Eyebrow + title +
        subtitle above; source caption below. Skeleton placeholder
        while the iframe loads. Drop a <code>TuxMapLegend</code>
        into the <code>#legend</code> slot for in-surface legends.
      </p>
      <TuxMapEmbed
        eyebrow="Exhibit 14.02"
        title="Texas Triangle corridor density"
        subtitle="Annual Average Daily Traffic (AADT) on Texas Triangle interstates, 2024."
        source="Source: TxDOT 2024 Annual AADT release · TTI MovementLab"
        :height="360"
      >
        <!-- Placeholder for the demo — in real use this would be an
             iframe src or a Mapbox/Leaflet mount target. -->
        <div class="flex flex-col items-center justify-center h-full text-center p-6">
          <Icon name="lucide:map" :size="32" class="text-text-muted mb-2" />
          <p class="text-sm text-text-muted">
            [Map placeholder — in production this slot is your map
            iframe or Mapbox/MapLibre mount target.]
          </p>
        </div>

        <template #legend>
          <TuxMapLegend
            title="AADT density"
            layout="gradient"
            :gradient="aadtGradient"
          />
        </template>
      </TuxMapEmbed>
    </section>

    <section class="space-y-3">
      <p class="eyebrow">map legend · three layouts</p>
      <h2 class="heading--bold text-xl font-bold">TuxMapLegend</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        <div>
          <p class="text-xs text-text-muted uppercase tracking-wider mb-2">layout="stack"</p>
          <TuxMapLegend
            eyebrow="Tiers"
            title="Access tier"
            :entries="tierEntries"
          />
        </div>
        <div>
          <p class="text-xs text-text-muted uppercase tracking-wider mb-2">layout="inline"</p>
          <TuxMapLegend
            layout="inline"
            :entries="tierEntries"
          />
        </div>
        <div>
          <p class="text-xs text-text-muted uppercase tracking-wider mb-2">layout="gradient"</p>
          <TuxMapLegend
            layout="gradient"
            title="AADT density"
            :gradient="aadtGradient"
          />
        </div>
      </div>
    </section>

    <section class="space-y-3">
      <p class="eyebrow">map markers · five research-typed shapes</p>
      <h2 class="heading--bold text-xl font-bold">TuxMapMarker</h2>
      <p class="text-sm text-text-secondary max-w-3xl">
        SVG markers ready to drop into any map library as custom
        markers, or use standalone as a legend swatch. Five kinds —
        intersection (diamond pin), corridor (bar), site (circle
        with halo), incident (warning triangle), treatment
        (checkmark). Optional number badge for site IDs.
      </p>

      <div class="grid grid-cols-2 md:grid-cols-5 gap-4 mt-3">
        <div class="text-center">
          <TuxMapMarker kind="intersection" size="lg" title="Intersection — FM 60" />
          <p class="text-xs text-text-secondary mt-2">intersection</p>
        </div>
        <div class="text-center">
          <TuxMapMarker kind="corridor" size="lg" title="Corridor segment endpoint" />
          <p class="text-xs text-text-secondary mt-2">corridor</p>
        </div>
        <div class="text-center">
          <TuxMapMarker kind="site" size="lg" :number="12" title="Site 12" />
          <p class="text-xs text-text-secondary mt-2">site (with number)</p>
        </div>
        <div class="text-center">
          <TuxMapMarker kind="incident" size="lg" title="Incident — 2024-09-14" />
          <p class="text-xs text-text-secondary mt-2">incident</p>
        </div>
        <div class="text-center">
          <TuxMapMarker kind="treatment" size="lg" title="Treatment applied" />
          <p class="text-xs text-text-secondary mt-2">treatment</p>
        </div>
      </div>

      <div class="mt-6">
        <p class="text-xs text-text-muted uppercase tracking-wider mb-2">size scale (sm · md · lg)</p>
        <div class="flex items-end gap-3">
          <TuxMapMarker kind="site" size="sm" :number="1" />
          <TuxMapMarker kind="site" size="md" :number="2" />
          <TuxMapMarker kind="site" size="lg" :number="3" />
        </div>
      </div>
    </section>
  </div>
</template>
