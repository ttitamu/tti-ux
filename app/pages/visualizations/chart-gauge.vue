<script setup lang="ts">
// Per ADR-0010, keep top-level <script setup> expressions plain JS.
useHead({ title: "TuxChartGauge · TUX" });

const utilizationBands = [
  { from: 0,  to: 60,  intent: "ok"    },
  { from: 60, to: 85,  intent: "warn"  },
  { from: 85, to: 100, intent: "alert" },
];

const slaBands = [
  { from: 0,  to: 95,  intent: "alert" },
  { from: 95, to: 99,  intent: "warn"  },
  { from: 99, to: 100, intent: "ok"    },
];

const basicVue = `<tux-chart-gauge
  :value="78"
  :min="0"
  :max="100"
  center-label="On-time delivery"
  :center-value="78"
  units="%"
/>`;

const bandsVue = `<tux-chart-gauge
  :value="72"
  :min="0"
  :max="100"
  :bands="[
    { from: 0,  to: 60,  intent: 'ok'    },
    { from: 60, to: 85,  intent: 'warn'  },
    { from: 85, to: 100, intent: 'alert' },
  ]"
  center-label="Token utilization"
  :center-value="72"
  units="%"
/>`;

const progressVue = `<tux-chart-gauge
  variant="progress"
  :value="6420"
  :min="0"
  :max="8000"
  center-label="Context used"
  :center-value="6420"
  units=" tok"
/>`;

const slaVue = `<tux-chart-gauge
  variant="progress"
  :value="99.84"
  :min="95"
  :max="100"
  :bands="[
    { from: 0,  to: 95,  intent: 'alert' },
    { from: 95, to: 99,  intent: 'warn'  },
    { from: 99, to: 100, intent: 'ok'    },
  ]"
  center-label="API uptime"
  :center-value="99.84"
  units="%"
/>`;
</script>

<template>
  <div class="space-y-10">
    <TuxPageHeader eyebrow="visualization · native chart" title="TuxChartGauge">
      270° arc gauge for <strong>single-target</strong> metrics where
      one value matters and the target zones are qualitative
      (ok/warn/alert) or hard limits. Use sparingly — research
      dashboards rarely need gauges. Good fits: token utilization,
      SLA uptime, compliance score. Bad fits: anything contextual
      (use <code>TuxBigStat</code> + <code>TuxSparkline</code>).
      <br><br>
      <span class="text-sm text-text-muted">
        Two variants: <code>arc</code> (default, with needle + bands)
        and <code>progress</code> (single filled arc, no needle).
      </span>
    </TuxPageHeader>

    <section>
      <p class="eyebrow">flagship · arc with needle</p>
      <h2 class="heading--bold text-xl font-bold">On-time delivery</h2>
      <p class="mt-2 text-sm text-text-secondary leading-relaxed max-w-2xl">
        No bands — neutral track with a needle at <code>value</code>.
        Use when target zones aren't well-defined; the needle
        position itself is the signal.
      </p>
      <TuxExample class="mt-4" :vue="basicVue">
        <TuxChartGauge
          :value="78"
          :min="0"
          :max="100"
          center-label="On-time delivery"
          :center-value="78"
          units="%"
        />
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">arc with tone bands</p>
      <h2 class="heading--bold text-xl font-bold">Token utilization</h2>
      <p class="mt-2 text-sm text-text-secondary leading-relaxed max-w-2xl">
        Pass <code>bands</code> to mark target zones. Each band has
        <code>from</code>, <code>to</code>, and either an
        <code>intent</code> (ok / warn / alert — status tokens) or a
        <code>toneIndex</code> (1..8 chart palette). The needle reads
        against the bands.
      </p>
      <TuxExample class="mt-4" :vue="bandsVue">
        <TuxChartGauge
          :value="72"
          :min="0"
          :max="100"
          :bands="utilizationBands"
          center-label="Token utilization"
          :center-value="72"
          units="%"
        />
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">progress variant</p>
      <h2 class="heading--bold text-xl font-bold">Radial progress</h2>
      <p class="mt-2 text-sm text-text-secondary leading-relaxed max-w-2xl">
        Pass <code>variant="progress"</code> for a single filled arc
        with no needle and no bands. Better for percent-of-max
        ("X tokens of Y context") where there are no qualitative
        zones.
      </p>
      <TuxExample class="mt-4" :vue="progressVue">
        <TuxChartGauge
          variant="progress"
          :value="6420"
          :min="0"
          :max="8000"
          center-label="Context used"
          :center-value="6420"
          units=" tok"
        />
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">progress + tone</p>
      <h2 class="heading--bold text-xl font-bold">SLA uptime</h2>
      <p class="mt-2 text-sm text-text-secondary leading-relaxed max-w-2xl">
        Bands work in <code>progress</code> mode too — the fill color
        picks up the band intent the current value falls into. Here,
        99.84% sits in the ok zone (above 99), so the arc draws
        green.
      </p>
      <TuxExample class="mt-4" :vue="slaVue">
        <TuxChartGauge
          variant="progress"
          :value="99.84"
          :min="95"
          :max="100"
          :bands="slaBands"
          center-label="API uptime"
          :center-value="99.84"
          units="%"
          :decimals="2"
        />
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">when not to use a gauge</p>
      <h2 class="heading--bold text-xl font-bold">Reach for BigStat instead</h2>
      <p class="mt-2 text-sm text-text-secondary leading-relaxed max-w-2xl">
        If the metric doesn't have a single normative target (e.g.
        "files ingested per month" — bigger is *usually* better, but
        the answer is contextual), use
        <NuxtLink to="/components/big-stat" class="link-tti">TuxBigStat</NuxtLink>
        plus
        <NuxtLink to="/visualizations/sparkline" class="link-tti">TuxSparkline</NuxtLink>
        for the trend. Gauges imply normativity that research data
        often doesn't have.
      </p>
    </section>
  </div>
</template>
