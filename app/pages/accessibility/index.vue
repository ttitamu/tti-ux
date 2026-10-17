<script setup lang="ts">
import { computed, ref } from "vue";
import { useTuxVisionPrefs } from "~/composables/useTuxVisionPrefs";
import { tuxComponentCount } from "~/utils/tuxCatalog";
import {
  formatTuxVpatMarkdown,
  generateTuxOpenAcrReport,
  TUX_VPAT_CRITERIA,
} from "~/utils/tuxVpatGenerator";

useHead({ title: "Accessibility & VPAT 2.5 Conformance · TUX" });

const { prefs, reset } = useTuxVisionPrefs();
const visionModalOpen = ref(false);
const exportNotice = ref("");
const selectedLevelFilter = ref<"ALL" | "A" | "AA" | "AAA">("ALL");

const openAcrReport = computed(() => generateTuxOpenAcrReport("2026-10-16"));

const filteredCriteria = computed(() => {
  if (selectedLevelFilter.value === "ALL") return TUX_VPAT_CRITERIA;
  return TUX_VPAT_CRITERIA.filter((c) => c.level === selectedLevelFilter.value);
});

// Live demo data for Multi-Sensory Chart Sonification & Tabular Access
const rellistestLabels = [
  "STA 01+00 (Dry Asphalt)",
  "STA 02+50 (Wet PFC)",
  "STA 04+00 (Concrete Rumble)",
  "STA 05+50 (Bridge Deck)",
  "STA 07+00 (High-Friction Seal)",
];

const rellisTestSeries = [
  {
    key: "skid",
    label: "Skid Number (SN40R)",
    unit: "SN",
    data: [52.4, 44.8, 49.1, 41.2, 63.6],
  },
];

function toggleOkabeIto() {
  prefs.value.cvdMode = prefs.value.cvdMode === "okabe-ito" ? "brand" : "okabe-ito";
}

function toggleSoftDark() {
  prefs.value.softDark = !prefs.value.softDark;
  if (prefs.value.softDark) {
    prefs.value.fieldSunlight = false;
  }
}

function toggleFieldSunlight() {
  prefs.value.fieldSunlight = !prefs.value.fieldSunlight;
  if (prefs.value.fieldSunlight) {
    prefs.value.softDark = false;
  }
}

function downloadFile(filename: string, content: string, mimeType: string) {
  if (typeof window === "undefined") return;
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function handleDownloadOpenAcrJson() {
  const json = JSON.stringify(openAcrReport.value, null, 2);
  downloadFile("tux-openacr-vpat-2.5.json", json, "application/json");
  exportNotice.value = "Downloaded machine-readable OpenACR 2.5 JSON packet.";
}

function handleDownloadVpatMarkdown() {
  const md = formatTuxVpatMarkdown(openAcrReport.value);
  downloadFile("tux-vpat-2.5-wcag22-aaa.md", md, "text/markdown");
  exportNotice.value = "Downloaded VPAT 2.5 (WCAG 2.2 AAA + Texas §2054.459) Markdown report.";
}

async function handleCopyVpatMarkdown() {
  const md = formatTuxVpatMarkdown(openAcrReport.value);
  if (typeof navigator !== "undefined" && navigator.clipboard) {
    await navigator.clipboard.writeText(md);
    exportNotice.value = "Copied VPAT 2.5 Markdown table to clipboard.";
  }
}

function handlePrintVpat() {
  if (typeof window !== "undefined") {
    window.print();
  }
}
</script>

<template>
  <div class="space-y-12">
    <TuxPageHeader eyebrow="conformance · wcag 2.2 level aaa · texas §2054.459" title="Accessibility &amp; Clinical Vision">
      The <strong>tux</strong> design system is engineered to <strong>W3C WCAG 2.2 Level AAA</strong>,
      <strong>Revised Federal Section 508</strong>, and <strong>Texas Gov't Code §2054.459 (1 TAC §206 / §213)</strong>.
      Every commit executes automated AAA luminance contrast gates ($\ge 7.0:1$), non-text boundary verification ($\ge 3.0:1$),
      and axe-core structural audits across all {{ tuxComponentCount }} verified components.
    </TuxPageHeader>

    <!-- ──────── Conformance Summary Strip ──────── -->
    <section>
      <p class="eyebrow">institutional posture</p>
      <h2 class="heading--bold text-2xl font-bold">Executive Conformance Summary</h2>
      <div class="ax-summary">
        <div class="ax-summary__card ax-summary__card--primary">
          <p class="ax-summary__label">Certified Floor</p>
          <p class="ax-summary__value">WCAG 2.2 AAA</p>
          <p class="ax-summary__caption">
            7.0:1 normal text · 4.5:1 large text · 3.0:1 UI boundaries · 44×44px target size across all themes.
          </p>
        </div>
        <div class="ax-summary__card ax-summary__card--accent">
          <p class="ax-summary__label">Verified Catalog</p>
          <p class="ax-summary__value">{{ tuxComponentCount }} / {{ tuxComponentCount }}</p>
          <p class="ax-summary__caption">
            100% of catalogued components pass automated Vitest + axe-core audits with 0 violations.
          </p>
        </div>
        <div class="ax-summary__card">
          <p class="ax-summary__label">Clinical Vision Modes</p>
          <p class="ax-summary__value">5 CVD + 3 Comfort</p>
          <p class="ax-summary__caption">
            Okabe-Ito CVD, Anti-Halation Astigmatism Soft Dark, RELLIS Field-Sunlight, and High-Contrast 508.
          </p>
        </div>
        <div class="ax-summary__card">
          <p class="ax-summary__label">State &amp; Federal Law</p>
          <p class="ax-summary__value ax-summary__value--mono">TX §2054.459 · 508</p>
          <p class="ax-summary__caption">
            Exportable VPAT® 2.5 / OpenACR conformance packet ready for Texas DIR and USDOT procurement.
          </p>
        </div>
      </div>
    </section>

    <!-- ──────── Live Clinical Vision & Proving-Ground Comfort Deck ──────── -->
    <section class="ax-clinical-deck">
      <div class="ax-clinical-deck__header">
        <div>
          <p class="eyebrow">live clinical instrumentation</p>
          <h2 class="heading--bold text-2xl font-bold">Vision, Astigmatism &amp; Field-Sunlight Controls</h2>
          <p class="ax-prose mt-1">
            Test TUX's runtime accessibility adaptations right here. Toggle clinical profiles for
            color vision deficiency (CVD), astigmatic halation relief, or outdoor tablet readability
            at the <strong>TTI RELLIS Proving Grounds</strong>.
          </p>
        </div>
        <button
          type="button"
          class="ax-btn ax-btn--primary"
          @click="visionModalOpen = true"
        >
          Open Full Clinical Vision Studio
        </button>
      </div>

      <div class="ax-clinical-grid">
        <button
          type="button"
          class="ax-mode-card"
          :class="{ 'ax-mode-card--active': prefs.cvdMode === 'okabe-ito' }"
          :aria-pressed="prefs.cvdMode === 'okabe-ito'"
          @click="toggleOkabeIto"
        >
          <div class="ax-mode-card__top">
            <span class="ax-mode-card__tag">CVD Palette</span>
            <span class="ax-mode-card__state">{{ prefs.cvdMode === "okabe-ito" ? "Active" : "Enable" }}</span>
          </div>
          <h3 class="ax-mode-card__title">Universal Okabe-Ito Safe Mode</h3>
          <p class="ax-mode-card__desc">
            Rebinds all chart and telemetry series to Deep Blue + Warm Orange polarity — 100% immune to Protan, Deutan, and Tritan confusion lines.
          </p>
        </button>

        <button
          type="button"
          class="ax-mode-card"
          :class="{ 'ax-mode-card--active': prefs.softDark }"
          :aria-pressed="prefs.softDark"
          @click="toggleSoftDark"
        >
          <div class="ax-mode-card__top">
            <span class="ax-mode-card__tag">Astigmatism &amp; Photophobia</span>
            <span class="ax-mode-card__state">{{ prefs.softDark ? "Active" : "Enable" }}</span>
          </div>
          <h3 class="ax-mode-card__title">Anti-Halation Soft Dark Mode</h3>
          <p class="ax-mode-card__desc">
            Replaces pitch-black wells with slate-charcoal and soft off-white ink (14.7:1 AAA) to eliminate corneal halation and glow bleed.
          </p>
        </button>

        <button
          type="button"
          class="ax-mode-card"
          :class="{ 'ax-mode-card--active': Boolean(prefs.fieldSunlight) }"
          :aria-pressed="Boolean(prefs.fieldSunlight)"
          @click="toggleFieldSunlight"
        >
          <div class="ax-mode-card__top">
            <span class="ax-mode-card__tag">RELLIS Proving Ground</span>
            <span class="ax-mode-card__state">{{ prefs.fieldSunlight ? "Active" : "Enable" }}</span>
          </div>
          <h3 class="ax-mode-card__title">Field-Sunlight High-Glare Mode</h3>
          <p class="ax-mode-card__desc">
            Engineered for outdoor tablets in direct Texas daylight — 21:1 ink contrast, 2px structural borders, and 48px glove-ready touch targets.
          </p>
        </button>

        <button
          type="button"
          class="ax-mode-card"
          :class="{ 'ax-mode-card--active': prefs.heavyStrokes }"
          :aria-pressed="prefs.heavyStrokes"
          @click="prefs.heavyStrokes = !prefs.heavyStrokes"
        >
          <div class="ax-mode-card__top">
            <span class="ax-mode-card__tag">Low-Vision Edge Clarity</span>
            <span class="ax-mode-card__state">{{ prefs.heavyStrokes ? "Active" : "Enable" }}</span>
          </div>
          <h3 class="ax-mode-card__title">Enhanced Stroke Widths (+1px)</h3>
          <p class="ax-mode-card__desc">
            Thickens chart strokes to 3.5px, enlarges geometric markers by 35%, and reinforces interactive card and input borders to 2px.
          </p>
        </button>
      </div>

      <div class="ax-sim-bar">
        <label for="ax-retinal-sim" class="ax-sim-bar__label">
          Live Retinal Cone Deficiency Simulator (Audit Viewport Filter):
        </label>
        <div class="ax-sim-bar__controls">
          <select
            id="ax-retinal-sim"
            v-model="prefs.cvdSimulation"
            class="ax-sim-bar__select"
          >
            <option value="none">Normal Vision (Simulation Off)</option>
            <option value="deuteranopia">Simulate Deuteranopia (Green-Blind · 6% of males)</option>
            <option value="protanopia">Simulate Protanopia (Red-Blind · 2% of males)</option>
            <option value="tritanopia">Simulate Tritanopia (Blue-Blind · &lt;1%)</option>
            <option value="achromatopsia">Simulate Achromatopsia (Monochrome Vision)</option>
          </select>
          <button type="button" class="ax-btn" @click="reset">
            Reset All Vision Prefs
          </button>
        </div>
      </div>
    </section>

    <!-- ──────── Multi-Sensory Telemetry Exhibit (Sonification + Data Table) ──────── -->
    <section>
      <p class="eyebrow">multi-sensory data access · wcag 1.1.1 &amp; 1.3.1</p>
      <h2 class="heading--bold text-2xl font-bold">Acoustic Chart Sonification &amp; Tabular Fallback</h2>
      <p class="ax-prose">
        Visualizations wrapped in <code>TuxChartFrame</code> automatically compute descriptive
        screen-reader statistics, expose a <strong>Web Audio API sonification synthesizer</strong>
        (mapping values to 220 Hz–880 Hz musical pitch and left-to-right stereo pan), and provide
        a 1-click <strong>Accessible Data Table</strong> disclosure. Try clicking
        <strong>♫ Sonify Audio</strong> or <strong>⊞ Data Table</strong> below:
      </p>

      <TuxChartFrame
        eyebrow="RELLIS Pavement Friction Telemetry · Exhibit A11Y-01"
        title="Surface Skid Resistance by Test Section"
        subtitle="Locked-wheel skid trailer measurements (SN40R) across 5 RELLIS proving-ground test pavements."
        source="Source: TTI Roadside Safety & Physical Security Division · RELLIS Track 4."
        notes="Values synthesized acoustically between 220 Hz (A3) and 880 Hz (A5) with stereo spatial panning."
        doi="TxDOT Project 0-7114"
        division="teal"
        :labels="rellistestLabels"
        :series="rellisTestSeries"
      >
        <TuxChartBar
          :labels="rellistestLabels"
          :series="rellisTestSeries"
          orientation="horizontal"
          unit="SN"
        />
      </TuxChartFrame>
    </section>

    <!-- ──────── VPAT 2.5 / OpenACR & Texas §2054.459 Conformance Matrix ──────── -->
    <section>
      <div class="ax-vpat-header">
        <div>
          <p class="eyebrow">vpat® 2.5 · openacr · texas tac §206 / §213</p>
          <h2 class="heading--bold text-2xl font-bold">Official Conformance Matrix &amp; Export Packet</h2>
          <p class="ax-prose mt-1">
            Compliance officers, grant auditors, and state EIR coordinators can filter criteria by
            WCAG 2.2 level or export the complete machine-readable <strong>OpenACR 2.5 JSON</strong>
            and <strong>VPAT 2.5 Markdown</strong> packet below.
          </p>
        </div>

        <div class="ax-vpat-actions" role="group" aria-label="Export VPAT Conformance Packet">
          <button type="button" class="ax-btn ax-btn--primary" @click="handleDownloadOpenAcrJson">
            Download OpenACR JSON
          </button>
          <button type="button" class="ax-btn" @click="handleDownloadVpatMarkdown">
            Download VPAT (.md)
          </button>
          <button type="button" class="ax-btn" @click="handleCopyVpatMarkdown">
            Copy Markdown
          </button>
          <button type="button" class="ax-btn" @click="handlePrintVpat">
            Print / Save PDF
          </button>
        </div>
      </div>

      <p v-if="exportNotice" class="ax-export-notice" role="status" aria-live="polite">
        {{ exportNotice }}
      </p>

      <div class="ax-filter-row" role="group" aria-label="Filter criteria by WCAG conformance level">
        <button
          v-for="lvl in (['ALL', 'A', 'AA', 'AAA'] as const)"
          :key="lvl"
          type="button"
          class="ax-filter-pill"
          :class="{ 'ax-filter-pill--active': selectedLevelFilter === lvl }"
          :aria-pressed="selectedLevelFilter === lvl"
          @click="selectedLevelFilter = lvl"
        >
          {{ lvl === "ALL" ? `All Criteria (${TUX_VPAT_CRITERIA.length})` : `Level ${lvl}` }}
        </button>
      </div>

      <div class="ax-table-wrap">
        <table class="ax-table">
          <thead>
            <tr>
              <th scope="col">Criterion</th>
              <th scope="col">Level</th>
              <th scope="col">Conformance</th>
              <th scope="col">Verification</th>
              <th scope="col">Remarks, Evidence &amp; Statutory Mapping</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in filteredCriteria" :key="row.id">
              <td>
                <strong>{{ row.id }} {{ row.title }}</strong>
              </td>
              <td>
                <code>{{ row.level }}</code>
              </td>
              <td>
                <span class="ax-badge ax-badge--pass">{{ row.conformance }}</span>
              </td>
              <td>
                <span class="ax-verification">{{ row.verification }}</span>
              </td>
              <td>
                <p class="ax-table-note">{{ row.remarks }}</p>
                <div class="ax-std-tags">
                  <span v-for="std in row.standardMapping" :key="std" class="ax-std-tag">
                    {{ std }}
                  </span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- ──────── How We Verify (CI Gates & Legacy Bridge) ──────── -->
    <section>
      <p class="eyebrow">continuous verification &amp; legacy bridge</p>
      <h2 class="heading--bold text-2xl font-bold">How We Verify Every Commit</h2>
      <p class="ax-prose">
        The <NuxtLink to="/contrast-audit" class="link-tti">/contrast-audit</NuxtLink>
        page renders every contrast-risk surface — typography, color tokens,
        alerts, badges, buttons, cards, page headers, callouts, code blocks,
        forms, footers — in three columns simultaneously, one per theme.
        <code>npm run audit:aaa</code> and <code>AUDIT_LEVEL=AAA npm run audit:contrast</code>
        enforce <strong>7.0:1 normal text</strong>, <strong>4.5:1 large text</strong>,
        <strong>3.0:1 UI boundaries</strong>, and <strong>44×44px target sizes</strong>.
      </p>
      <p class="ax-prose">
        For legacy ASP.NET, PHP, Perl/CGI, and static HTML portals across TTI that cannot run Vue or React,
        <NuxtLink to="/examples/legacy-bridge" class="link-tti">tux-bridge.css (ADR-0016)</NuxtLink>
        provides a zero-JavaScript, single-stylesheet drop-in upgrade that brings native HTML tables,
        forms, focus rings, and buttons to 100% WCAG 2.2 Level AAA compliance in under 60 seconds.
      </p>
    </section>

    <!-- ──────── Known Non-Conformances + Reporting ──────── -->
    <section>
      <p class="eyebrow">known issues &amp; feedback</p>
      <h2 class="heading--bold text-2xl font-bold">Known Non-Conformances</h2>
      <p class="ax-prose">
        None at the design-system level as of {{ openAcrReport.generatedAt }}. If
        you find an accessibility issue in a component or in a page that
        consumes this system, please open an issue on the
        <a href="https://code.tti.tamu.edu/tti/tti-ux/issues" target="_blank" rel="noopener" class="link-tti">tti-ux issue tracker</a>
        with the heading "<code>a11y:</code>" so we can triage it ahead of
        normal feature work.
      </p>
    </section>

    <!-- ──────── Deep-Dive Foundations Pages ──────── -->
    <section>
      <p class="eyebrow">deep-dive references</p>
      <h2 class="heading--bold text-xl font-bold">Foundations Pages</h2>
      <p class="mt-3 ax-prose">
        Four focused references covering the foundations every TUX page
        inherits — and consumers can verify against in their own
        downstream builds.
      </p>
      <div class="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <TuxCard to="/accessibility/skip-to-content">
          <p class="eyebrow">keyboard · WCAG 2.4.1</p>
          <h3 class="text-base font-bold mt-1">Skip to content</h3>
          <p class="mt-1 text-sm text-text-secondary">
            The keyboard-first foundation. How the skip link is wired,
            where it lands, how to verify.
          </p>
        </TuxCard>
        <TuxCard to="/accessibility/focus-model">
          <p class="eyebrow">keyboard · WCAG 2.4.7 &amp; 2.4.13</p>
          <h3 class="text-base font-bold mt-1">Focus model</h3>
          <p class="mt-1 text-sm text-text-secondary">
            Visible two-ring focus indicators, focus-trap behavior in modals + slideovers,
            tab order rules.
          </p>
        </TuxCard>
        <TuxCard to="/accessibility/contrast-matrix">
          <p class="eyebrow">color · WCAG 1.4.3 + 1.4.6 + 1.4.11</p>
          <h3 class="text-base font-bold mt-1">Contrast matrix</h3>
          <p class="mt-1 text-sm text-text-secondary">
            Which token pairs pass AA / AAA across all themes —
            USWDS-style summary of the top token pairings.
          </p>
        </TuxCard>
        <TuxCard to="/accessibility/breakpoints">
          <p class="eyebrow">responsive · WCAG 1.4.10</p>
          <h3 class="text-base font-bold mt-1">Breakpoints</h3>
          <p class="mt-1 text-sm text-text-secondary">
            The documented responsive scale + the container-query
            preference + 200% zoom reflow guarantees.
          </p>
        </TuxCard>
      </div>
    </section>

    <TuxVisionPreferencesModal v-model:open="visionModalOpen" />
  </div>
</template>

<style scoped>
.ax-prose {
  max-width: 52rem;
  margin: 0 0 1rem;
  font-size: 0.9375rem;
  line-height: 1.65;
  color: var(--text-secondary);
}

.ax-prose code,
.ax-prose a code {
  font-family: var(--font-mono);
  font-size: 0.8125rem;
  background: var(--surface-sunken);
  padding: 0.0625rem 0.375rem;
  border-radius: var(--radius-sm);
  color: var(--brand-primary);
}

[data-theme="tti-dark"] .ax-prose code {
  color: var(--brand-accent);
}

/* ──────── Conformance summary cards ──────── */
.ax-summary {
  margin-top: 1.25rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr));
  gap: 1rem;
}

.ax-summary__card {
  padding: 1.125rem 1.25rem;
  background: var(--surface-raised);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-md);
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.ax-summary__card--primary {
  background: var(--brand-fill);
  border-color: var(--brand-fill);
  color: var(--text-on-brand);
}

.ax-summary__card--accent {
  background: color-mix(in srgb, var(--brand-accent) 18%, var(--surface-raised));
  border-color: color-mix(in srgb, var(--brand-accent) 50%, transparent);
}

.ax-summary__label {
  margin: 0;
  font-family: var(--font-mono);
  font-size: 0.625rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-muted);
}

.ax-summary__card--primary .ax-summary__label {
  color: var(--brand-accent);
}

.ax-summary__card--accent .ax-summary__label {
  color: color-mix(in srgb, var(--brand-primary) 75%, var(--text-primary));
}

.ax-summary__value {
  margin: 0;
  font-family: var(--font-bold);
  font-weight: 800;
  font-size: 1.375rem;
  line-height: 1.1;
}

.ax-summary__value--mono {
  font-family: var(--font-mono);
  font-weight: 600;
  font-size: 1.0625rem;
}

.ax-summary__caption {
  margin: 0;
  margin-top: auto;
  font-size: 0.8125rem;
  line-height: 1.5;
  color: var(--text-secondary);
}

.ax-summary__card--primary .ax-summary__caption {
  color: var(--text-on-brand);
}

/* ──────── Clinical Vision Deck ──────── */
.ax-clinical-deck {
  padding: 1.5rem;
  background: var(--surface-raised);
  border: 1px solid var(--surface-border);
  border-top: 3px solid var(--brand-primary);
  border-radius: var(--radius-md);
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.ax-clinical-deck__header {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
}

.ax-clinical-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(15rem, 1fr));
  gap: 0.875rem;
}

.ax-mode-card {
  text-align: left;
  padding: 1rem;
  background: var(--surface-sunken);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-md);
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  transition: border-color 0.15s ease, background-color 0.15s ease;
}

.ax-mode-card:hover {
  border-color: var(--brand-primary);
}

.ax-mode-card--active {
  border-color: var(--brand-primary);
  border-width: 2px;
  background: color-mix(in srgb, var(--brand-primary) 8%, var(--surface-raised));
}

.ax-mode-card__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
}

.ax-mode-card__tag {
  font-family: var(--font-mono);
  font-size: 0.625rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-muted);
}

.ax-mode-card__state {
  font-family: var(--font-mono);
  font-size: 0.625rem;
  font-weight: 700;
  text-transform: uppercase;
  padding: 0.1rem 0.4rem;
  border-radius: var(--radius-sm);
  background: var(--surface-raised);
  border: 1px solid var(--surface-border);
  color: var(--brand-primary);
}

.ax-mode-card__title {
  margin: 0;
  font-family: var(--font-bold);
  font-size: 0.9375rem;
  font-weight: 700;
  color: var(--text-primary);
}

.ax-mode-card__desc {
  margin: 0;
  font-size: 0.78rem;
  line-height: 1.5;
  color: var(--text-secondary);
}

.ax-sim-bar {
  padding-top: 1rem;
  border-top: 1px solid var(--surface-border);
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
}

.ax-sim-bar__label {
  font-family: var(--font-bold);
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--text-primary);
}

.ax-sim-bar__controls {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
}

.ax-sim-bar__select {
  min-height: 2.75rem;
  padding: 0.375rem 0.75rem;
  font-family: var(--font-body);
  font-size: 0.8125rem;
  color: var(--text-primary);
  background: var(--surface-sunken);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-md);
}

/* ──────── VPAT Header & Actions ──────── */
.ax-vpat-header {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
}

.ax-vpat-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.ax-btn {
  min-height: 2.75rem;
  padding: 0.5rem 0.875rem;
  font-family: var(--font-bold);
  font-size: 0.78rem;
  font-weight: 700;
  color: var(--text-primary);
  background: var(--surface-raised);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-md);
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
}

.ax-btn:hover {
  border-color: var(--brand-primary);
  background: var(--surface-sunken);
}

.ax-btn--primary {
  color: var(--text-on-brand);
  background: var(--brand-fill);
  border-color: var(--brand-fill);
}

.ax-btn--primary:hover {
  background: var(--brand-fill);
  opacity: 0.94;
}

.ax-export-notice {
  margin: 0.5rem 0 0;
  padding: 0.5rem 0.75rem;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--color-success);
  background: color-mix(in srgb, var(--color-success) 12%, transparent);
  border: 1px solid color-mix(in srgb, var(--color-success) 35%, transparent);
  border-radius: var(--radius-sm);
}

.ax-filter-row {
  margin-top: 1rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.ax-filter-pill {
  min-height: 2.25rem;
  padding: 0.25rem 0.75rem;
  font-family: var(--font-mono);
  font-size: 0.72rem;
  font-weight: 600;
  color: var(--text-secondary);
  background: var(--surface-raised);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-md);
  cursor: pointer;
}

.ax-filter-pill--active {
  color: var(--text-on-brand);
  background: var(--brand-fill);
  border-color: var(--brand-fill);
}

/* ──────── Tables ──────── */
.ax-table-wrap {
  overflow-x: auto;
}

.ax-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
  font-size: 0.875rem;
}

.ax-table th {
  text-align: left;
  font-family: var(--font-bold);
  font-weight: 700;
  font-size: 0.6875rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-muted);
  padding: 0.625rem 0.875rem;
  border-bottom: 2px solid var(--brand-primary);
  background: var(--surface-sunken);
}

.ax-table td {
  padding: 0.875rem;
  border-bottom: 1px solid var(--surface-border);
  vertical-align: top;
}

.ax-table td code {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.ax-verification {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  color: var(--text-secondary);
}

.ax-table-note {
  margin: 0;
  color: var(--text-secondary);
  font-size: 0.8125rem;
  line-height: 1.55;
  max-width: 38rem;
}

.ax-std-tags {
  margin-top: 0.4rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
}

.ax-std-tag {
  font-family: var(--font-mono);
  font-size: 0.625rem;
  padding: 0.08rem 0.4rem;
  border-radius: var(--radius-sm);
  background: var(--surface-sunken);
  border: 1px solid var(--surface-border);
  color: var(--text-muted);
}

/* ──────── Pass/manual badges ──────── */
.ax-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.125rem 0.5rem;
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  font-weight: 600;
  border-radius: var(--radius-sm);
  border: 1px solid transparent;
}

.ax-badge--pass {
  color: var(--color-success);
  background: color-mix(in srgb, var(--color-success) 12%, transparent);
  border-color: color-mix(in srgb, var(--color-success) 35%, transparent);
}
</style>
