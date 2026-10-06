<script setup lang="ts">
/**
 * Composition example: Institutional Error Pages (404, 401, 403, 503, 500)
 * Demonstrates TuxErrorPage and app/error.vue handling across all standard HTTP failure modes.
 */
useHead({ title: "Institutional Error Pages (404, 401, 403, 503, 500) · TUX" });

const activeCode = ref<"404" | "401" | "403" | "503" | "500" | "custom">("404");
const showDiagnostics = ref(true);
const inlineMode = ref(true);

const codes = [
  { id: "404", label: "404 Not Found", icon: "lucide:compass", badge: "Standard" },
  { id: "401", label: "401 Unauthorized", icon: "lucide:shield-alert", badge: "Auth" },
  { id: "403", label: "403 Forbidden", icon: "lucide:lock", badge: "Security" },
  { id: "503", label: "503 Maintenance", icon: "lucide:wrench", badge: "Operations" },
  { id: "500", label: "500 Server Error", icon: "lucide:server-crash", badge: "Fatal" },
  { id: "custom", label: "Custom Exception", icon: "lucide:alert-triangle", badge: "Override" },
] as const;

const customTitle = ref("Network Partition Detected");
const customLede = ref("The remote computing node at the TTI RELLIS Campus is temporarily unreachable. Failover in progress.");
const simulatedTrace = ref(`[InstitutionalTraceException]: Connection timeout to rellis-cluster.tti.tamu.edu:9443
    at TCPConnectWrap.afterConnect [as oncomplete] (node:net:1607:16)
    at TCPConnectWrap.callbackTrampoline (node:internal/async_hooks:130:17)
    Status: TTI-FAILOVER-TRIGGERED
    Correlation-ID: tti-node-tx-77492-ax9`);
</script>

<template>
  <div class="space-y-10">
    <TuxSectionHeader
      :level="1"
      title="System Error Boundaries"
      secondary-title="404, 401, 403, 503, 500"
      variant="two-tone-rule"
      kicker="ERROR STATES"
      subtitle="Error templates with editorial typography, 5-band spectrum ribbons, sharp buttons, and recovery actions for Texas A&M Transportation Institute applications."
    />

    <!-- Controls Panel -->
    <div class="p-5 bg-surface-raised border border-surface-border space-y-4">
      <div class="flex flex-wrap items-center justify-between gap-4">
        <div>
          <span class="text-xs font-mono uppercase tracking-wider text-text-muted">Select Preset:</span>
          <div class="flex flex-wrap gap-2 mt-2">
            <button
              v-for="c in codes"
              :key="c.id"
              type="button"
              class="px-3.5 py-1.5 text-xs font-mono font-medium border transition-colors flex items-center gap-2 cursor-pointer"
              :class="activeCode === c.id
                ? 'bg-brand-primary text-text-inverse border-brand-primary shadow-xs'
                : 'bg-surface-sunken text-text-secondary border-surface-border hover:border-brand-primary/40'"
              @click="activeCode = c.id"
            >
              <UIcon :name="c.icon" class="w-3.5 h-3.5" />
              <span>{{ c.label }}</span>
            </button>
          </div>
        </div>

        <div class="flex items-center gap-4">
          <label class="flex items-center gap-2 text-xs font-mono text-text-secondary cursor-pointer">
            <input type="checkbox" v-model="showDiagnostics" class="accent-brand-primary cursor-pointer" />
            <span>Show Diagnostic Well</span>
          </label>
          <label class="flex items-center gap-2 text-xs font-mono text-text-secondary cursor-pointer">
            <input type="checkbox" v-model="inlineMode" class="accent-brand-primary cursor-pointer" />
            <span>Inline Container Mode</span>
          </label>
        </div>
      </div>

      <!-- Custom Overrides Inputs -->
      <div v-if="activeCode === 'custom'" class="pt-4 border-t border-surface-border grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
        <div>
          <label class="block text-text-muted mb-1">Custom Title:</label>
          <input
            v-model="customTitle"
            class="w-full bg-surface-sunken border border-surface-border px-3 py-1.5 text-text-primary rounded-none focus:outline-brand-primary"
          />
        </div>
        <div>
          <label class="block text-text-muted mb-1">Custom Lede:</label>
          <input
            v-model="customLede"
            class="w-full bg-surface-sunken border border-surface-border px-3 py-1.5 text-text-primary rounded-none focus:outline-brand-primary"
          />
        </div>
      </div>
    </div>

    <!-- Live Preview Stage -->
    <div class="border border-surface-border bg-surface-sunken/40 p-1 md:p-6 overflow-hidden">
      <div class="bg-surface-page border border-surface-border shadow-sm">
        <TuxErrorPage
          v-if="activeCode !== 'custom'"
          :code="activeCode"
          :inline="inlineMode"
          :details="showDiagnostics ? simulatedTrace : undefined"
        />
        <TuxErrorPage
          v-else
          code="504"
          :title="customTitle"
          :lede="customLede"
          :inline="inlineMode"
          icon="lucide:satellite-dish"
          :details="showDiagnostics ? simulatedTrace : undefined"
          :actions="[
            { label: 'Retry Cluster Connection', intent: 'primary', icon: 'lucide:refresh-cw' },
            { label: 'View System Telemetry', to: '/components/health', intent: 'secondary', icon: 'lucide:activity' },
          ]"
        />
      </div>
    </div>

    <!-- Implementation Architecture -->
    <section class="space-y-4">
      <TuxSectionHeader>Institutional Implementation</TuxSectionHeader>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TuxCard>
          <p class="eyebrow">Nuxt 4 Root Boundary</p>
          <h3 class="text-base font-bold">Standard <code class="text-brand-primary">app/error.vue</code></h3>
          <p class="mt-2 text-xs text-text-secondary leading-relaxed">
            In Nuxt 4, uncaught router exceptions and SSR halts flow to the root <code class="text-xs bg-surface-sunken px-1">app/error.vue</code> boundary.
            It wraps <code class="text-xs bg-surface-sunken px-1">&lt;TuxErrorPage&gt;</code> with institutional header navigation, brand lockup, and
            <code class="text-xs bg-surface-sunken px-1">clearError({ redirect: '/' })</code> hooks.
          </p>
          <pre class="mt-3 p-3 bg-surface-sunken border border-surface-border text-[11px] font-mono text-text-secondary overflow-x-auto"><code>&lt;script setup lang="ts"&gt;
import type { NuxtError } from "#app";
defineProps&lt;{ error: NuxtError }&gt;();
const handleError = () => clearError({ redirect: "/" });
&lt;/script&gt;

&lt;template&gt;
  &lt;TuxErrorPage
    :code="String(error.statusCode || 404)"
    :title="error.statusMessage"
    :details="error.stack"
    :actions="[
      { label: 'Return Home', intent: 'primary', onClick: handleError }
    ]"
  /&gt;
&lt;/template&gt;</code></pre>
        </TuxCard>

        <TuxCard>
          <p class="eyebrow">WCAG 2.2 Level AAA Compliance</p>
          <h3 class="text-base font-bold">Accessibility Guarantees</h3>
          <p class="mt-2 text-xs text-text-secondary leading-relaxed">
            Every error condition implements <code class="text-xs bg-surface-sunken px-1">role="alert"</code> and <code class="text-xs bg-surface-sunken px-1">aria-live="polite"</code>
            so screen readers announce the state change immediately without interrupting critical speech synthesizers.
          </p>
          <ul class="mt-3 space-y-1.5 text-xs text-text-secondary list-disc pl-4">
            <li><strong>Contrast:</strong> Minimum 7.0:1 contrast ratio across TTI Maroon, dark ink, and eggshell surfaces.</li>
            <li><strong>Touch Targets:</strong> Primary recovery buttons preserve minimum 44px hit-box sizing.</li>
            <li><strong>Keyboard Focus:</strong> 3px high-visibility gold/maroon focus rings on all interactive recovery links.</li>
          </ul>
        </TuxCard>
      </div>
    </section>
  </div>
</template>
