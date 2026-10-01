<script setup lang="ts">
import tuxStatusSource from "~/components/TuxStatus.vue?raw";
import tuxOpsCss from "../../../kit/css/tux-ops.css?raw";
import { TUX_OPS_STATES } from "../../utils/tux-ops";

useHead({ title: "TuxStatus · TUX" });

const states = TUX_OPS_STATES;

const chipVue = `<tux-status state="ok" />
<tux-status state="warning" />
<tux-status state="unknown" />
<tux-status state="critical" />
<tux-status state="pending" />
<tux-status state="maintenance" />`;

const textVue = `<tux-status state="ok" kind="text" />
<tux-status state="critical" kind="text" />`;

const dotVue = `<tux-status state="ok" kind="dot" />
<tux-status state="warning" kind="dot" />
<tux-status state="critical" kind="dot" />`;

const ackedVue = `<tux-status state="critical" />
<tux-status state="critical" acked />`;

const overlayVue = `<!-- Consumer markup you do not own. Map onto TUX classes. -->
<tr class="tux-status-row--critical">
  <td>atlas.tti.tamu.edu</td>
  <td><span class="tux-status tux-status--critical">CRITICAL</span></td>
</tr>`;
</script>

<template>
  <div class="space-y-10">
    <TuxPageHeader eyebrow="component" title="TuxStatus">
      Operational state — the five-state ramp plus maintenance.
      Distinct from <code>TuxBadge status</code>, which is job
      lifecycle (queued / running / completed) on the semantic
      palette. Maroon is never a state; gold is never the word.
      The <strong>CSS</strong> tab is the drop-in overlay
      (<code>kit/css/tux-ops.css</code>), the same way charts
      expose a Power BI tab.
    </TuxPageHeader>

    <section>
      <p class="eyebrow">ramp</p>
      <h2 class="heading--bold text-xl font-bold">Chips</h2>
      <p class="text-sm text-text-secondary mb-3">
        Fill + ink from <code>--status-*</code>. Scan order is
        green → yellow → orange → true red, then pending grey and
        maintenance blue.
      </p>
      <TuxExample
        class="mt-4"
        :vue="chipVue"
        :css="tuxOpsCss"
        :source="tuxStatusSource"
      >
        <div class="flex flex-wrap gap-2">
          <TuxStatus v-for="s in states" :key="s" :state="s" />
        </div>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">roles</p>
      <h2 class="heading--bold text-xl font-bold">Text and dot</h2>
      <TuxExample class="mt-4" :vue="textVue" :css="tuxOpsCss">
        <div class="flex flex-wrap gap-4 items-center">
          <TuxStatus state="ok" kind="text" />
          <TuxStatus state="critical" kind="text" />
        </div>
      </TuxExample>
      <TuxExample class="mt-4" :vue="dotVue" :css="tuxOpsCss">
        <div class="flex flex-wrap gap-3 items-center">
          <TuxStatus state="ok" kind="dot" />
          <TuxStatus state="warning" kind="dot" />
          <TuxStatus state="critical" kind="dot" />
        </div>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">owned vs live</p>
      <h2 class="heading--bold text-xl font-bold">Acknowledged</h2>
      <p class="text-sm text-text-secondary mb-3">
        Still a problem, but someone is on it. Sinks to
        <code>--surface-sunken</code> — not pending grey, which
        reads as UNKNOWN in the dark theme.
      </p>
      <TuxExample class="mt-4" :vue="ackedVue" :css="tuxOpsCss">
        <div class="flex flex-wrap gap-2">
          <TuxStatus state="critical" />
          <TuxStatus state="critical" acked />
        </div>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">overlay</p>
      <h2 class="heading--bold text-xl font-bold">Paint foreign markup</h2>
      <p class="text-sm text-text-secondary mb-3">
        The kit never learns <code>.serviceOK</code>. You stamp
        TUX classes onto the host, or you emit an owned document
        (see <NuxtLink class="link-tti" to="/examples/ops-board">ops board</NuxtLink>).
      </p>
      <TuxExample class="mt-4" :vue="overlayVue" :css="tuxOpsCss">
        <table class="tux-ops-table">
          <thead>
            <tr>
              <th>Host</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr class="tux-status-row--ok">
              <td>code.tti.tamu.edu</td>
              <td><TuxStatus state="ok" /></td>
            </tr>
            <tr class="tux-status-row--critical">
              <td>atlas.tti.tamu.edu</td>
              <td><TuxStatus state="critical" /></td>
            </tr>
            <tr class="tux-status-row--maintenance">
              <td>lab-gpu-04</td>
              <td><TuxStatus state="maintenance" /></td>
            </tr>
          </tbody>
        </table>
      </TuxExample>
    </section>
  </div>
</template>
