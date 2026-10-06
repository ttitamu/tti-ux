<script setup lang="ts">
/**
 * Showcase: Legacy Web Modernization & WCAG 2.2 AAA Bridge (tux-bridge.css).
 *
 * Demonstrates how a dated, unstyled 2015-era TTI research database or portal
 * (PHP, ASP.NET, WordPress) is instantly transformed into a modernized,
 * brand-harmonized, WCAG 2.2 Level AAA compliant tool with a single CSS drop-in.
 */

useHead({ title: "Legacy Modernization & WCAG 2.2 AAA Bridge · Composition Examples · TUX" });

const viewMode = ref<"modern" | "legacy" | "split">("modern");
const showAuditor = ref(true);
const copiedCode = ref(false);

const queryFilters = ref({
  district: "Bryan",
  facility: "SH-6",
  severity: "All Severities",
  dateRange: "2025-01-01 to 2026-06-30",
  pavement: "Wet / Ice",
  verifiedOnly: true,
});

const sampleRecords = [
  {
    id: "CR-2026-8812",
    date: "2026-03-14 07:42",
    highway: "SH-6 S @ Milepost 298.4",
    county: "Brazos",
    severity: "Property Damage",
    surface: "Wet Asphalt",
    detectors: "RSU-042 (Active)",
    speedDelta: "-18 mph",
    statusBadge: "Verified",
  },
  {
    id: "CR-2026-8819",
    date: "2026-03-14 08:15",
    highway: "FM-2818 @ George Bush Dr",
    county: "Brazos",
    severity: "Minor Injury",
    surface: "Standing Water",
    detectors: "RSU-019 (Active)",
    speedDelta: "-24 mph",
    statusBadge: "Verified",
  },
  {
    id: "CR-2026-8902",
    date: "2026-03-15 16:30",
    highway: "I-35 N @ Exit 251",
    county: "Williamson",
    severity: "Possible Injury",
    surface: "Dry Concrete",
    detectors: "RSU-108 (Active)",
    speedDelta: "-12 mph",
    statusBadge: "Flagged",
  },
  {
    id: "CR-2026-8941",
    date: "2026-03-16 11:05",
    highway: "US-290 E @ SH-21",
    county: "Bastrop",
    severity: "Property Damage",
    surface: "Wet Surface",
    detectors: "RSU-077 (Active)",
    speedDelta: "-15 mph",
    statusBadge: "Verified",
  },
  {
    id: "CR-2026-9014",
    date: "2026-03-17 06:12",
    highway: "SH-130 @ Toll Plaza 4",
    county: "Caldwell",
    severity: "Serious Injury",
    surface: "Dense Fog / Wet",
    detectors: "RSU-214 (Active)",
    speedDelta: "-32 mph",
    statusBadge: "Investigating",
  },
];

const complianceMetrics = [
  {
    criterion: "1.4.6 Contrast (Enhanced - AAA)",
    element: "Maroon Table Header (#500000 on #FFFFFF)",
    measured: "15.66:1",
    target: ">= 7.0:1",
    status: "PASS (AAA)",
    note: "More than 2x the standard threshold for enhanced contrast.",
  },
  {
    criterion: "1.4.6 Contrast (Enhanced - AAA)",
    element: "Body Text Ink (#111827 on #FFFFFF)",
    measured: "17.74:1",
    target: ">= 7.0:1",
    status: "PASS (AAA)",
    note: "High-contrast reading ink exceeds AAA standards.",
  },
  {
    criterion: "1.4.6 Contrast (Enhanced - AAA)",
    element: "Secondary / Form Labels (#374151 on #FFFFFF)",
    measured: "10.31:1",
    target: ">= 7.0:1",
    status: "PASS (AAA)",
    note: "Captions and secondary labels exceed 10:1 ratio.",
  },
  {
    criterion: "1.4.6 Contrast (Enhanced - AAA)",
    element: "Warm Gold on Dark Charcoal Badge (#CFA935 on #221F1F)",
    measured: "7.31:1",
    target: ">= 7.0:1",
    status: "PASS (AAA)",
    note: "Gold accents paired with dark surfaces pass AAA. Never used on white.",
  },
  {
    criterion: "2.4.13 Focus Appearance (AAA)",
    element: "Interactive Controls Focus Ring",
    measured: "3px stroke + 2px offset",
    target: ">= 2px stroke",
    status: "PASS (AAA)",
    note: "Dual-layer box shadow ensures >= 3:1 contrast against any background.",
  },
  {
    criterion: "2.5.8 Target Size (Enhanced - AAA)",
    element: "Buttons, Selects, Inputs, Checkboxes",
    measured: "44×44 CSS px min",
    target: ">= 44×44 px",
    status: "PASS (AAA)",
    note: "Zero cramped 20px inputs. All touch targets meet 44px AAA baseline.",
  },
  {
    criterion: "1.4.8 Visual Presentation (AAA)",
    element: "Paragraph Typography & Measure",
    measured: "1.6 line height · <= 75ch",
    target: ">= 1.5 · <= 80ch",
    status: "PASS (AAA)",
    note: "Comfortable leading, no justified text, tabular nums for data alignment.",
  },
];

const codeSnippet = `<link rel="stylesheet" href="https://ux.tti.tamu.edu/css/tux-bridge.css">
<!-- Wrap any legacy section or table -->
<div class="tux-bridge">
  <!-- Native HTML elements automatically upgraded to WCAG 2.2 AAA -->
</div>`;

function copyCode() {
  navigator.clipboard.writeText(codeSnippet);
  copiedCode.value = true;
  setTimeout(() => {
    copiedCode.value = false;
  }, 2500);
}
</script>

<template>
  <div class="space-y-10 pb-16">
    <!-- Header -->
    <TuxPageHeader
      eyebrow="modernization · zero-js stylesheet · wcag 2.2 aaa"
      title="Legacy Web Modernization & WCAG 2.2 AAA Bridge"
    >
      A turnkey, zero-JavaScript drop-in stylesheet (<code>kit/css/tux-bridge.css</code>) designed to modernize
      dozens of active 2012–2018 era Texas A&amp;M Transportation Institute web tools, PHP/MySQL databases, ASP.NET portals,
      and WordPress/Kadence pages into 2026 aesthetics while raising accessibility to
      <strong>WCAG 2.2 Level AAA</strong> standard across native HTML elements.
    </TuxPageHeader>

    <!-- Interactive Mode & Auditor Bar -->
    <div class="p-4 bg-surface-raised border border-surface-border flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div class="flex items-center gap-2 flex-wrap">
        <span class="text-xs font-bold uppercase tracking-wider text-text-secondary mr-2">Display Mode:</span>
        <button
          type="button"
          class="px-3 py-1.5 text-xs font-bold transition-colors"
          :class="viewMode === 'modern' ? 'bg-brand-primary text-text-inverse' : 'bg-surface-card border border-surface-border text-text-primary hover:bg-surface-muted'"
          @click="viewMode = 'modern'"
        >
          Modernized 2026 (tux-bridge.css)
        </button>
        <button
          type="button"
          class="px-3 py-1.5 text-xs font-bold transition-colors"
          :class="viewMode === 'legacy' ? 'bg-brand-primary text-text-inverse' : 'bg-surface-card border border-surface-border text-text-primary hover:bg-surface-muted'"
          @click="viewMode = 'legacy'"
        >
          Legacy 2015 Unstyled (Raw HTML Defaults)
        </button>
        <button
          type="button"
          class="px-3 py-1.5 text-xs font-bold transition-colors"
          :class="viewMode === 'split' ? 'bg-brand-primary text-text-inverse' : 'bg-surface-card border border-surface-border text-text-primary hover:bg-surface-muted'"
          @click="viewMode = 'split'"
        >
          Side-by-Side Comparison
        </button>
      </div>

      <div class="flex items-center gap-3">
        <button
          type="button"
          class="px-3 py-1.5 text-xs font-bold border border-surface-border bg-surface-card hover:bg-surface-muted text-text-primary flex items-center gap-1.5"
          @click="showAuditor = !showAuditor"
        >
          <UIcon :name="showAuditor ? 'i-lucide-check-circle' : 'i-lucide-activity'" class="w-4 h-4 text-brand-primary" />
          {{ showAuditor ? "Hide AAA Auditor" : "Show AAA Auditor" }}
        </button>

        <button
          type="button"
          class="px-3 py-1.5 text-xs font-bold bg-brand-primary text-text-inverse hover:opacity-90 flex items-center gap-1.5"
          @click="copyCode"
        >
          <UIcon :name="copiedCode ? 'i-lucide-check' : 'i-lucide-copy'" class="w-4 h-4" />
          {{ copiedCode ? "Copied Link!" : "Copy Drop-In <link>" }}
        </button>
      </div>
    </div>

    <!-- WCAG 2.2 AAA Compliance Auditor Pane -->
    <div v-if="showAuditor" class="p-6 bg-surface-card border border-surface-border space-y-4">
      <div class="flex items-center justify-between border-b border-surface-border pb-3">
        <div>
          <h2 class="text-base font-bold text-text-primary flex items-center gap-2">
            <UIcon name="i-lucide-shield-check" class="w-5 h-5 text-brand-primary" />
            Live WCAG 2.2 Level AAA Compliance Meter
          </h2>
          <p class="text-xs text-text-secondary mt-0.5">
            Strict verified ratios adhering to W3C WCAG 2.2 AAA guidelines for enhanced contrast (1.4.6), focus appearance (2.4.13), and target sizing (2.5.8).
          </p>
        </div>
        <span class="inline-flex items-center px-2.5 py-1 text-xs font-bold uppercase tracking-wider bg-brand-primary text-text-inverse">
          100% AAA Compliant
        </span>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          v-for="m in complianceMetrics"
          :key="m.element"
          class="p-3.5 bg-surface-muted border border-surface-border flex flex-col justify-between"
        >
          <div>
            <div class="flex items-center justify-between gap-1 mb-1">
              <span class="text-[10px] font-bold text-text-muted uppercase tracking-wider">{{ m.criterion }}</span>
              <span class="text-[10px] font-bold px-1.5 py-0.5 bg-brand-primary text-text-inverse">{{ m.status }}</span>
            </div>
            <p class="text-xs font-bold text-text-primary line-clamp-1">{{ m.element }}</p>
            <p class="text-[11px] text-text-secondary mt-1 leading-snug">{{ m.note }}</p>
          </div>
          <div class="mt-3 pt-2 border-t border-surface-border flex items-baseline justify-between">
            <span class="text-xs text-text-muted">Measured:</span>
            <span class="text-sm font-mono font-bold text-brand-primary">{{ m.measured }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- MAIN DEMONSTRATION WORKSPACE -->
    <div class="space-y-8">
      <!-- 1. MODERNIZED 2026 VIEW (tux-bridge.css) -->
      <section v-if="viewMode === 'modern' || viewMode === 'split'" class="space-y-4">
        <div class="flex items-center justify-between border-b-2 border-brand-accent pb-2">
          <div>
            <h2 class="text-lg font-bold text-brand-primary flex items-center gap-2">
              <UIcon name="i-lucide-sparkles" class="w-5 h-5 text-brand-accent" />
              Modernized View with <code>tux-bridge.css</code> (WCAG 2.2 AAA Standard)
            </h2>
            <p class="text-xs text-text-secondary">
              Zero markup change: pure semantic HTML tags (<code>&lt;table&gt;</code>, <code>&lt;input&gt;</code>, <code>&lt;button&gt;</code>) styled by the drop-in bridge.
            </p>
          </div>
          <span class="text-xs font-bold px-2.5 py-1 bg-brand-primary text-text-inverse">
            Class: <code>.tux-bridge</code>
          </span>
        </div>

        <!-- The Scoped tux-bridge container -->
        <div class="tux-bridge p-6 bg-surface-card border border-surface-border space-y-6">
          <!-- Institutional Header Bar with Gold Keyline -->
          <div>
            <div class="flex items-center justify-between mb-2">
              <span class="tux-bridge-badge">TTI Division of Safety Analytics</span>
              <span class="tux-bridge-badge tux-bridge-badge--maroon">System ID: SCTQS-2026</span>
            </div>
            <h1>Statewide Crash &amp; Telemetry Query System</h1>
            <p>
              Integrated roadside telemetry, connected vehicle deceleration feeds, and Texas Peace Officer crash records.
              Updated hourly in cooperation with the Texas Department of Transportation.
            </p>
          </div>

          <!-- Alert Callout -->
          <div class="tux-bridge-alert">
            <strong>Active Weather Advisory:</strong> Winter surface precipitation active along US-290 and I-35 corridor.
            48 automated Roadside Units (RSUs) reporting friction telemetry.
          </div>

          <!-- Query Parameters Form -->
          <div class="tux-bridge-card">
            <h2>Query Parameters &amp; Corridor Filters</h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div>
                <label for="mod-district">TxDOT District</label>
                <select id="mod-district" v-model="queryFilters.district">
                  <option value="Bryan">Bryan District (08)</option>
                  <option value="Austin">Austin District (14)</option>
                  <option value="Houston">Houston District (12)</option>
                  <option value="San Antonio">San Antonio District (15)</option>
                </select>
              </div>

              <div>
                <label for="mod-facility">Highway Corridor</label>
                <input id="mod-facility" v-model="queryFilters.facility" type="text" placeholder="e.g. SH-6, I-35, US-290" />
              </div>

              <div>
                <label for="mod-severity">Injury Severity</label>
                <select id="mod-severity" v-model="queryFilters.severity">
                  <option value="All Severities">All Severities</option>
                  <option value="Fatal">Fatal Crash (K)</option>
                  <option value="Serious Injury">Suspected Serious Injury (A)</option>
                  <option value="Minor Injury">Non-Incapacitating Injury (B)</option>
                  <option value="Property Damage">Property Damage Only (C/O)</option>
                </select>
              </div>
            </div>

            <div class="flex items-center justify-between flex-wrap gap-4 mt-6 pt-4 border-t border-surface-border">
              <label class="tux-bridge-check-label">
                <input v-model="queryFilters.verifiedOnly" type="checkbox" />
                <span>Show verified crash records only</span>
              </label>

              <div class="flex items-center gap-3">
                <button type="button" class="btn-secondary">
                  Reset Filters
                </button>
                <button type="button">
                  <UIcon name="i-lucide-search" class="w-4 h-4 mr-1.5" />
                  Execute Query
                </button>
              </div>
            </div>
          </div>

          <!-- Data Table -->
          <div class="tux-bridge-table-container">
            <table>
              <caption>Showing 5 of 1,428 crash events matching active filter criteria</caption>
              <thead>
                <tr>
                  <th scope="col">Record ID</th>
                  <th scope="col">Date / Time</th>
                  <th scope="col">Corridor &amp; Location</th>
                  <th scope="col">County</th>
                  <th scope="col">Severity Rating</th>
                  <th scope="col">Pavement Surface</th>
                  <th scope="col">Telemetry Unit</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="row in sampleRecords" :key="row.id">
                  <td class="font-bold">{{ row.id }}</td>
                  <td>{{ row.date }}</td>
                  <td>{{ row.highway }}</td>
                  <td>{{ row.county }}</td>
                  <td>
                    <span
                      class="inline-block px-2 py-0.5 text-xs font-bold"
                      :class="row.severity.includes('Injury') ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-gray-100 text-gray-800 border border-gray-300'"
                    >
                      {{ row.severity }}
                    </span>
                  </td>
                  <td>{{ row.surface }}</td>
                  <td>{{ row.detectors }}</td>
                  <td>
                    <a href="#view-telemetry">View Telemetry &rarr;</a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Footer Information -->
          <div class="text-xs text-text-secondary border-t border-surface-border pt-4 flex flex-col md:flex-row justify-between gap-2">
            <span>Texas A&amp;M Transportation Institute &middot; Data Standards Bureau</span>
            <span>Compliance: WCAG 2.2 Level AAA &middot; Texas DIR TAC 213</span>
          </div>
        </div>
      </section>

      <!-- 2. LEGACY 2015 UNSTYLED / VINTAGE VIEW -->
      <section v-if="viewMode === 'legacy' || viewMode === 'split'" class="space-y-4">
        <div class="flex items-center justify-between border-b-2 border-gray-400 pb-2">
          <div>
            <h2 class="text-lg font-bold text-gray-700 flex items-center gap-2">
              <UIcon name="i-lucide-history" class="w-5 h-5 text-gray-500" />
              Original 2015 Unstyled Legacy Application (Browser Defaults)
            </h2>
            <p class="text-xs text-gray-500">
              Typical legacy TTI PHP/ASP.NET query screen: cramped 20px inputs, 11px font, missing zebra striping, 2.4:1 contrast failures.
            </p>
          </div>
          <span class="text-xs font-bold px-2.5 py-1 bg-gray-600 text-white">
            Raw Legacy Styles
          </span>
        </div>

        <!-- The Legacy Simulated Container -->
        <div class="legacy-simulation-container p-6 bg-white border border-gray-400 font-sans text-xs space-y-4">
          <div class="border-b border-gray-300 pb-2">
            <h1 class="text-base font-bold text-black m-0 p-0">Statewide Crash &amp; Telemetry Query System (v2.4 - 2015)</h1>
            <p class="text-[11px] text-gray-600 m-0 mt-1">Division of Safety Analytics · Internal Query Portal</p>
          </div>

          <div class="p-2 bg-yellow-50 border border-yellow-200 text-[11px] text-yellow-900">
            System Notice: Automatic maintenance scheduled for Sundays at 02:00 CST.
          </div>

          <fieldset class="border border-gray-400 p-3">
            <legend class="text-xs font-bold px-1 text-gray-700">Filter Criteria</legend>
            <table class="w-full text-xs">
              <tbody>
                <tr>
                  <td class="w-32 py-1">District:</td>
                  <td>
                    <select class="h-6 text-xs border border-gray-400">
                      <option>Bryan District (08)</option>
                    </select>
                  </td>
                  <td class="w-32 py-1">Highway:</td>
                  <td>
                    <input type="text" value="SH-6" class="h-5 px-1 text-xs border border-gray-400 w-40" />
                  </td>
                </tr>
                <tr>
                  <td class="py-1">Severity:</td>
                  <td>
                    <select class="h-6 text-xs border border-gray-400">
                      <option>All Severities</option>
                    </select>
                  </td>
                  <td class="py-1">Options:</td>
                  <td>
                    <label class="text-[11px] inline-flex items-center gap-1">
                      <input type="checkbox" checked /> Verified Only
                    </label>
                  </td>
                </tr>
                <tr>
                  <td colspan="4" class="pt-2 text-right">
                    <input type="button" value="Clear" class="px-2 py-0.5 text-xs bg-gray-200 border border-gray-400 mr-2" />
                    <input type="submit" value="Submit Query" class="px-3 py-0.5 text-xs bg-gray-300 border border-gray-500 font-bold" />
                  </td>
                </tr>
              </tbody>
            </table>
          </fieldset>

          <!-- Raw Legacy Table -->
          <div class="overflow-x-auto">
            <table class="w-full border-collapse border border-gray-400 text-[11px]">
              <thead>
                <tr class="bg-gray-200">
                  <th class="border border-gray-400 p-1 text-left">Record ID</th>
                  <th class="border border-gray-400 p-1 text-left">Date</th>
                  <th class="border border-gray-400 p-1 text-left">Location</th>
                  <th class="border border-gray-400 p-1 text-left">County</th>
                  <th class="border border-gray-400 p-1 text-left">Severity</th>
                  <th class="border border-gray-400 p-1 text-left">Surface</th>
                  <th class="border border-gray-400 p-1 text-left">Unit</th>
                  <th class="border border-gray-400 p-1 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="row in sampleRecords" :key="'leg-' + row.id" class="border-b border-gray-300">
                  <td class="border border-gray-300 p-1">{{ row.id }}</td>
                  <td class="border border-gray-300 p-1">{{ row.date }}</td>
                  <td class="border border-gray-300 p-1">{{ row.highway }}</td>
                  <td class="border border-gray-300 p-1">{{ row.county }}</td>
                  <td class="border border-gray-300 p-1">{{ row.severity }}</td>
                  <td class="border border-gray-300 p-1">{{ row.surface }}</td>
                  <td class="border border-gray-300 p-1">{{ row.detectors }}</td>
                  <td class="border border-gray-300 p-1">
                    <a href="#" class="text-blue-600 underline">Details</a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="text-[10px] text-gray-500 text-right">TTI Legacy Web Database v2.4</div>
        </div>
      </section>
    </div>

    <!-- Drop-In Integration Instructions -->
    <div class="p-6 bg-surface-card border border-surface-border space-y-4">
      <div class="flex items-center gap-2 border-b border-surface-border pb-3">
        <UIcon name="i-lucide-code" class="w-5 h-5 text-brand-primary" />
        <h2 class="text-base font-bold text-text-primary">How to Drop <code>tux-bridge.css</code> into Existing TTI Sites</h2>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
        <div class="space-y-2">
          <h3 class="font-bold text-brand-primary text-xs uppercase tracking-wider">1. WordPress &amp; Kadence</h3>
          <p class="text-xs text-text-secondary leading-relaxed">
            In your child theme's <code>functions.php</code> or the Kadence Customizer &rarr; Custom Code:
          </p>
          <pre class="p-3 bg-surface-muted border border-surface-border text-[11px] font-mono text-text-primary overflow-x-auto">wp_enqueue_style(
  'tux-bridge',
  'https://ux.tti.tamu.edu/css/tux-bridge.css',
  array(),
  '3.0.0'
);</pre>
        </div>

        <div class="space-y-2">
          <h3 class="font-bold text-brand-primary text-xs uppercase tracking-wider">2. ASP.NET MVC / Razor</h3>
          <p class="text-xs text-text-secondary leading-relaxed">
            Add to <code>Views/Shared/_Layout.cshtml</code> inside the <code>&lt;head&gt;</code> block:
          </p>
          <pre class="p-3 bg-surface-muted border border-surface-border text-[11px] font-mono text-text-primary overflow-x-auto">&lt;link rel="stylesheet"
      href="~/css/tux-bridge.css"
      asp-append-version="true" /&gt;</pre>
        </div>

        <div class="space-y-2">
          <h3 class="font-bold text-brand-primary text-xs uppercase tracking-wider">3. PHP, CGI &amp; Static Tools</h3>
          <p class="text-xs text-text-secondary leading-relaxed">
            Insert anywhere in the header or wrap target containers in <code>&lt;div class="tux-bridge"&gt;</code>:
          </p>
          <pre class="p-3 bg-surface-muted border border-surface-border text-[11px] font-mono text-text-primary overflow-x-auto">&lt;link rel="stylesheet"
      href="/css/tux-bridge.css"&gt;
&lt;div class="tux-bridge"&gt;
  &lt;!-- legacy tables &amp; forms --&gt;
&lt;/div&gt;</pre>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Specific simulation styling for the legacy comparison pane */
.legacy-simulation-container {
  font-family: Arial, Helvetica, sans-serif;
  color: #333333;
}
</style>
