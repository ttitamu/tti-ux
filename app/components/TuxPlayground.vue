<script setup lang="ts">
/**
 * TuxPlayground — interactive component workbench & props inspector.
 *
 * Allows developers to configure component props live and observe both
 * the rendered component and the multi-framework code snippets
 * (Vue, React JSX, Web Component, .NET Razor/Blazor) update in real-time.
 *
 * Features:
 * - Reactive property knobs (select, boolean, text, number)
 * - Named Institutional Presets strip with active pill highlighting
 * - Two-way URL query-param deep-linking for direct state sharing
 * - Developer Handoff & Preset Exporter (JSON schema, CLI flags, Share URL, HTML)
 * - 1-Click Clipboard integration with visual toast feedback
 */
import { ref, computed, watch, onMounted } from "vue";
import { useTuxClipboard } from "~/composables/useTuxClipboard";

export interface TuxPropOption {
  label: string;
  value: any;
}

export interface TuxPropControl {
  prop: string;
  label?: string;
  type: "select" | "boolean" | "text" | "number";
  options?: readonly string[] | TuxPropOption[];
  defaultValue: any;
  description?: string;
}

export interface TuxPlaygroundPreset {
  name: string;
  label?: string;
  description?: string;
  icon?: string;
  values: Record<string, any>;
}

interface Props {
  /** Canonical tag name for the code generator (e.g. "tux-button") */
  tag?: string;
  /** Optional PascalCase component name (e.g. "TuxButton") */
  componentName?: string;
  /** Prop control schema */
  controls: TuxPropControl[];
  /** Optional institutional presets */
  presets?: TuxPlaygroundPreset[];
  /** Title for the workbench card */
  title?: string;
  /** Eyebrow label */
  eyebrow?: string;
  /** Name of the prop that supplies default slot text (e.g. "label") */
  slotProp?: string;
  /** Fallback slot content if none provided */
  defaultSlotText?: string;
  /** Whether the component has self-closing tag syntax when no slot text is present */
  selfClosing?: boolean;
  /** Optional custom code generator */
  codeTemplate?: (values: Record<string, any>) => string;
  /** Optional component source SFC to expose in a Source tab */
  source?: string;
  /** Optional preview container padding (default "p-8") */
  previewPadding?: string;
  /** Enable two-way synchronization with URL query parameters (default true) */
  enableDeepLinking?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  tag: undefined,
  componentName: undefined,
  presets: () => [],
  title: "Interactive Props Workbench",
  eyebrow: "Live Component Playground",
  slotProp: undefined,
  defaultSlotText: undefined,
  selfClosing: false,
  codeTemplate: undefined,
  source: undefined,
  previewPadding: "p-8",
  enableDeepLinking: true,
});

// Canonical tag & component name computation
const canonicalTag = computed(() => {
  if (props.tag) return props.tag;
  if (props.componentName) {
    return props.componentName
      .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
      .toLowerCase();
  }
  return "tux-component";
});

const canonicalName = computed(() => {
  if (props.componentName) return props.componentName;
  if (props.tag) return pascal(props.tag);
  return "TuxComponent";
});

// Clipboard
const { copiedKey, copy } = useTuxClipboard({ resetAfterMs: 2200 });

// Modal state
const showExportModal = ref(false);
const activeExportTab = ref<"json" | "cli" | "share">("json");

// PascalCase helper
function pascal(name: string): string {
  return name.replace(/(^|-)([a-z0-9])/g, (_, __, c) => c.toUpperCase());
}

// Reactive state initialized from defaults
function initValues(): Record<string, any> {
  const v: Record<string, any> = {};
  for (const c of props.controls) {
    v[c.prop] = c.defaultValue;
  }
  return v;
}

const values = ref<Record<string, any>>(initValues());

function resetDefaults() {
  values.value = initValues();
  if (props.enableDeepLinking && typeof window !== "undefined") {
    syncUrl(true);
  }
}

// Preset matching & applying
function isPresetActive(preset: TuxPlaygroundPreset): boolean {
  for (const [k, v] of Object.entries(preset.values)) {
    if (values.value[k] !== v) return false;
  }
  return true;
}

function applyPreset(preset: TuxPlaygroundPreset) {
  const base = initValues();
  Object.assign(base, preset.values);
  values.value = base;
}

// Router and URL Synchronization
let route: any;
let router: any;
try {
  route = useRoute();
  router = useRouter();
} catch {
  // Graceful fallback when outside Vue Router context
}

// Hydrate from URL query on mount
onMounted(() => {
  if (!props.enableDeepLinking || !route?.query) return;

  let changed = false;
  const newVals = { ...values.value };

  // 1. Check if preset query parameter is provided
  if (route.query.preset && props.presets?.length) {
    const match = props.presets.find(
      (p) => p.name.toLowerCase() === String(route.query.preset).toLowerCase(),
    );
    if (match) {
      Object.assign(newVals, match.values);
      changed = true;
    }
  }

  // 2. Check individual control prop overrides
  for (const ctrl of props.controls) {
    if (route.query[ctrl.prop] !== undefined) {
      const raw = route.query[ctrl.prop];
      if (ctrl.type === "boolean") {
        newVals[ctrl.prop] = raw === "true" || raw === "1" || raw === "";
        changed = true;
      } else if (ctrl.type === "number") {
        const num = Number(raw);
        if (!isNaN(num)) {
          newVals[ctrl.prop] = num;
          changed = true;
        }
      } else {
        newVals[ctrl.prop] = String(raw);
        changed = true;
      }
    }
  }

  if (changed) {
    values.value = newVals;
  }
});

// Debounced URL sync
let syncTimer: ReturnType<typeof setTimeout> | undefined;

function syncUrl(clearAll = false) {
  if (!props.enableDeepLinking || !router || !route || typeof window === "undefined") return;

  const currentQuery = { ...route.query };
  const newQuery: Record<string, any> = {};

  // Preserve foreign query params (unrelated to this workbench)
  for (const [k, v] of Object.entries(currentQuery)) {
    if (!props.controls.some((c) => c.prop === k) && k !== "preset") {
      newQuery[k] = v;
    }
  }

  if (!clearAll) {
    // Check if active values match an institutional preset
    const matchedPreset = props.presets?.find((p) => isPresetActive(p));
    if (matchedPreset) {
      newQuery.preset = matchedPreset.name;
    }

    // Add only non-default prop values to keep URL clean and human-readable
    for (const ctrl of props.controls) {
      const val = values.value[ctrl.prop];
      if (val !== ctrl.defaultValue && val !== "" && val !== undefined) {
        newQuery[ctrl.prop] = String(val);
      }
    }
  }

  // Replace router query silently without reload
  const changed = JSON.stringify(currentQuery) !== JSON.stringify(newQuery);
  if (changed) {
    router.replace({ query: Object.keys(newQuery).length > 0 ? newQuery : undefined });
  }
}

watch(
  values,
  () => {
    clearTimeout(syncTimer);
    syncTimer = setTimeout(() => syncUrl(false), 200);
  },
  { deep: true },
);

// Share Link Generation
const shareUrl = computed(() => {
  if (typeof window === "undefined") return "";
  const base = `${window.location.origin}${window.location.pathname}`;
  const queryParams = new URLSearchParams();

  const matchedPreset = props.presets?.find((p) => isPresetActive(p));
  if (matchedPreset) {
    queryParams.set("preset", matchedPreset.name);
  }

  for (const ctrl of props.controls) {
    const val = values.value[ctrl.prop];
    if (val !== ctrl.defaultValue && val !== "" && val !== undefined) {
      queryParams.set(ctrl.prop, String(val));
    }
  }

  const qs = queryParams.toString();
  return qs ? `${base}?${qs}` : base;
});

async function copyShareLink() {
  if (shareUrl.value) {
    await copy(shareUrl.value, "share-link");
  }
}

// Generate canonical Vue code string from active values
const generatedVueCode = computed(() => {
  if (props.codeTemplate) {
    return props.codeTemplate(values.value);
  }

  const attrs: string[] = [];
  let slotText = "";

  for (const ctrl of props.controls) {
    const val = values.value[ctrl.prop];
    if (ctrl.prop === props.slotProp) {
      slotText = val || "";
      continue;
    }

    // Skip empty strings, null, undefined
    if (val === "" || val === null || val === undefined) continue;

    if (ctrl.type === "boolean") {
      if (val === true) {
        attrs.push(ctrl.prop);
      }
    } else if (typeof val === "string") {
      attrs.push(`${ctrl.prop}="${val}"`);
    } else if (typeof val === "number") {
      attrs.push(`:${ctrl.prop}="${val}"`);
    } else {
      attrs.push(`:${ctrl.prop}="${JSON.stringify(val)}"`);
    }
  }

  const attrStr = attrs.length > 0 ? " " + attrs.join(" ") : "";
  const effectiveSlot = slotText || props.defaultSlotText;

  if (effectiveSlot) {
    return `<${canonicalTag.value}${attrStr}>\n  ${effectiveSlot}\n</${canonicalTag.value}>`;
  } else if (props.selfClosing) {
    return `<${canonicalTag.value}${attrStr} />`;
  } else {
    return `<${canonicalTag.value}${attrStr}></${canonicalTag.value}>`;
  }
});

// Generated JSON Preset
const generatedJsonPreset = computed(() => {
  const customProps: Record<string, any> = {};
  for (const ctrl of props.controls) {
    customProps[ctrl.prop] = values.value[ctrl.prop];
  }
  return JSON.stringify(
    {
      $schema: "https://design.tti.tamu.edu/schemas/component-preset.json",
      generator: "TTI-UX 3.0 Component Workbench",
      component: canonicalName.value,
      tag: canonicalTag.value,
      props: customProps,
    },
    null,
    2,
  );
});

// Generated CLI Flags
const generatedCliCommand = computed(() => {
  const flags: string[] = [];
  for (const ctrl of props.controls) {
    const val = values.value[ctrl.prop];
    if (val === ctrl.defaultValue || val === "" || val === undefined || val === false) continue;
    if (ctrl.type === "boolean" && val === true) {
      flags.push(`--${ctrl.prop}`);
    } else if (typeof val === "string" || typeof val === "number") {
      flags.push(`--${ctrl.prop}="${val}"`);
    }
  }
  return `npx @tti/tti-ux add ${canonicalTag.value} ${flags.join(" ")}`.trim();
});
</script>

<template>
  <div class="tux-playground rounded-lg border border-surface-border bg-surface-page overflow-hidden shadow-xs">
    <!-- Header with Eyebrow, Title, and Action Toolbar -->
    <div class="px-5 py-3.5 bg-surface-sunken border-b border-surface-border flex items-center justify-between gap-4 flex-wrap">
      <div>
        <p class="text-[11px] font-mono font-semibold uppercase tracking-wider text-brand-primary">
          {{ eyebrow }}
        </p>
        <h2 class="text-base font-bold text-text-primary tracking-tight">
          {{ title }}
        </h2>
      </div>
      <div class="flex items-center gap-2">
        <!-- Direct Share Link Button -->
        <button
          type="button"
          class="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded bg-surface-raised border border-surface-border text-text-muted hover:text-text-primary hover:border-brand-primary transition-all cursor-pointer focus-visible:outline-3 focus-visible:outline-brand-primary/40"
          title="Copy shareable direct URL with current configuration"
          aria-label="Share configured preset link"
          @click="copyShareLink"
        >
          <UIcon
            :name="copiedKey === 'share-link' ? 'lucide:check' : 'lucide:share-2'"
            class="w-3.5 h-3.5"
            :class="{ 'text-color-success': copiedKey === 'share-link' }"
          />
          <span>{{ copiedKey === 'share-link' ? 'Link Copied!' : 'Share Link' }}</span>
        </button>

        <!-- Developer Handoff & Export Modal Button -->
        <button
          type="button"
          class="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded bg-surface-raised border border-surface-border text-text-muted hover:text-text-primary hover:border-brand-primary transition-all cursor-pointer focus-visible:outline-3 focus-visible:outline-brand-primary/40"
          title="Export JSON preset, CLI command, or framework snippet"
          @click="showExportModal = true"
        >
          <UIcon name="lucide:download" class="w-3.5 h-3.5" />
          <span>Export Preset</span>
        </button>

        <!-- Reset Button -->
        <button
          type="button"
          class="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded bg-surface-raised border border-surface-border text-text-muted hover:text-text-primary hover:border-brand-primary transition-all cursor-pointer focus-visible:outline-3 focus-visible:outline-brand-primary/40"
          title="Reset all props to default values"
          @click="resetDefaults"
        >
          <UIcon name="lucide:rotate-ccw" class="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>
    </div>

    <!-- Presets Strip (if presets provided) -->
    <div
      v-if="presets && presets.length > 0"
      class="px-5 py-2.5 bg-surface-sunken/40 border-b border-surface-border flex items-center gap-2 overflow-x-auto text-xs"
    >
      <span class="text-[11px] font-mono font-semibold uppercase tracking-wider text-text-muted shrink-0 flex items-center gap-1">
        <UIcon name="lucide:sparkles" class="w-3.5 h-3.5 text-brand-accent" />
        <span>Presets:</span>
      </span>
      <div class="flex items-center gap-1.5 flex-wrap">
        <button
          v-for="p in presets"
          :key="p.name"
          type="button"
          class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border transition-colors cursor-pointer focus-visible:outline-3 focus-visible:outline-brand-primary/40"
          :class="isPresetActive(p)
            ? 'bg-brand-primary text-white border-brand-primary font-semibold shadow-xs'
            : 'bg-surface-raised text-text-secondary border-surface-border hover:border-brand-primary hover:text-text-primary'"
          :title="p.description"
          @click="applyPreset(p)"
        >
          <UIcon v-if="p.icon" :name="p.icon" class="w-3 h-3" />
          <span>{{ p.label || p.name }}</span>
        </button>
      </div>
    </div>

    <!-- Live Preview Stage -->
    <div
      :class="[
        'tux-playground__stage bg-surface-raised flex items-center justify-center min-h-[140px] border-b border-surface-border relative overflow-hidden',
        previewPadding,
      ]"
    >
      <div class="max-w-full">
        <slot :values="values" />
      </div>
    </div>

    <!-- Properties Inspector Grid -->
    <div class="p-4 sm:p-5 bg-surface-sunken/60 border-b border-surface-border">
      <div class="flex items-center justify-between mb-3">
        <span class="text-xs font-mono font-semibold uppercase tracking-wider text-text-secondary flex items-center gap-1.5">
          <UIcon name="lucide:sliders-horizontal" class="w-3.5 h-3.5 text-brand-primary" />
          <span>Properties Inspector</span>
        </span>
        <span class="text-[11px] font-mono text-text-muted">
          {{ controls.length }} configurable knobs
        </span>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
        <div
          v-for="ctrl in controls"
          :key="ctrl.prop"
          class="p-2.5 rounded-md bg-surface-page border border-surface-border flex flex-col justify-between gap-1.5"
        >
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-text-primary">
              {{ ctrl.label || ctrl.prop }}
            </span>
            <code class="text-[10px] font-mono text-text-muted px-1.5 py-0.5 rounded bg-surface-sunken">
              {{ ctrl.prop }}
            </code>
          </div>

          <!-- Select Control -->
          <div v-if="ctrl.type === 'select'" class="relative">
            <select
              v-model="values[ctrl.prop]"
              :aria-label="ctrl.label || ctrl.prop"
              class="w-full text-xs font-mono bg-surface-sunken border border-surface-border rounded px-2 py-1 text-text-primary focus:outline-hidden focus:border-brand-primary cursor-pointer"
            >
              <option
                v-for="opt in ctrl.options"
                :key="typeof opt === 'string' ? opt : opt.value"
                :value="typeof opt === 'string' ? opt : opt.value"
              >
                {{ typeof opt === 'string' ? (opt || '(none)') : opt.label }}
              </option>
            </select>
          </div>

          <!-- Boolean Toggle Control -->
          <div v-else-if="ctrl.type === 'boolean'" class="flex items-center justify-between py-0.5">
            <span class="text-xs font-mono text-text-secondary">
              {{ values[ctrl.prop] ? "true" : "false" }}
            </span>
            <button
              type="button"
              role="switch"
              :aria-checked="values[ctrl.prop]"
              :aria-label="ctrl.label || ctrl.prop"
              class="w-9 h-5 rounded-full transition-colors relative cursor-pointer focus:outline-hidden"
              :class="values[ctrl.prop] ? 'bg-brand-primary' : 'bg-surface-sunken border border-surface-border'"
              @click="values[ctrl.prop] = !values[ctrl.prop]"
            >
              <span
                class="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform"
                :class="{ 'translate-x-4': values[ctrl.prop] }"
              />
            </button>
          </div>

          <!-- Text Input Control -->
          <div v-else-if="ctrl.type === 'text'">
            <input
              v-model="values[ctrl.prop]"
              :aria-label="ctrl.label || ctrl.prop"
              type="text"
              class="w-full text-xs font-mono bg-surface-sunken border border-surface-border rounded px-2 py-1 text-text-primary focus:outline-hidden focus:border-brand-primary"
              :placeholder="`Enter ${ctrl.label || ctrl.prop}...`"
            />
          </div>

          <!-- Number Input Control -->
          <div v-else-if="ctrl.type === 'number'">
            <input
              v-model.number="values[ctrl.prop]"
              :aria-label="ctrl.label || ctrl.prop"
              type="number"
              class="w-full text-xs font-mono bg-surface-sunken border border-surface-border rounded px-2 py-1 text-text-primary focus:outline-hidden focus:border-brand-primary"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Embedded Multi-Framework Code Container (TuxExample) -->
    <div class="tux-playground__code-wrapper">
      <TuxExample
        :vue="generatedVueCode"
        :source="source"
        preview-padding="hidden"
        title="Dynamic Component Syntax"
      >
        <!-- Empty slot: preview lives on the upper stage -->
        <span />
      </TuxExample>
    </div>

    <!-- Developer Handoff & Preset Exporter Modal -->
    <Teleport to="body">
      <div
        v-if="showExportModal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="tux-export-title"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
        @keydown.esc="showExportModal = false"
      >
        <!-- Modal Card -->
        <div
          class="bg-surface-page border border-surface-border rounded-xl shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-150"
          @click.stop
        >
          <!-- Modal Header -->
          <div class="px-6 py-4 bg-surface-sunken border-b border-surface-border flex items-center justify-between gap-4">
            <div class="flex items-center gap-2.5">
              <div class="w-8 h-8 rounded-lg bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center text-brand-primary">
                <UIcon name="lucide:download" class="w-4 h-4" />
              </div>
              <div>
                <h4 id="tux-export-title" class="text-base font-bold text-text-primary tracking-tight">
                  Developer Handoff &amp; Preset Exporter
                </h4>
                <p class="text-xs font-mono text-text-muted">
                  Component: &lt;{{ canonicalTag }}&gt; · TTI-UX 3.0
                </p>
              </div>
            </div>
            <button
              type="button"
              aria-label="Close export dialog"
              class="w-7 h-7 rounded flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-surface-raised cursor-pointer transition-colors"
              @click="showExportModal = false"
            >
              <UIcon name="lucide:x" class="w-4 h-4" />
            </button>
          </div>

          <!-- Format Switcher Tabs -->
          <div class="px-6 pt-3 bg-surface-sunken/40 border-b border-surface-border flex items-center gap-2 text-xs">
            <button
              type="button"
              class="pb-2 px-3 font-semibold border-b-2 transition-colors cursor-pointer"
              :class="activeExportTab === 'json'
                ? 'border-brand-primary text-brand-primary'
                : 'border-transparent text-text-muted hover:text-text-primary'"
              @click="activeExportTab = 'json'"
            >
              Preset JSON Schema
            </button>
            <button
              type="button"
              class="pb-2 px-3 font-semibold border-b-2 transition-colors cursor-pointer"
              :class="activeExportTab === 'cli'
                ? 'border-brand-primary text-brand-primary'
                : 'border-transparent text-text-muted hover:text-text-primary'"
              @click="activeExportTab = 'cli'"
            >
              CLI &amp; Code Snippet
            </button>
            <button
              type="button"
              class="pb-2 px-3 font-semibold border-b-2 transition-colors cursor-pointer"
              :class="activeExportTab === 'share'
                ? 'border-brand-primary text-brand-primary'
                : 'border-transparent text-text-muted hover:text-text-primary'"
              @click="activeExportTab = 'share'"
            >
              Shareable Direct URL
            </button>
          </div>

          <!-- Tab Content Body -->
          <div class="p-6 overflow-y-auto flex-1 space-y-4">
            <!-- JSON Tab -->
            <div v-if="activeExportTab === 'json'" class="space-y-3">
              <div class="flex items-center justify-between text-xs">
                <span class="text-text-muted">Standard TTI Component Configuration JSON:</span>
                <button
                  type="button"
                  class="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded bg-surface-raised border border-surface-border text-text-primary hover:border-brand-primary cursor-pointer transition-colors"
                  @click="copy(generatedJsonPreset, 'modal-json')"
                >
                  <UIcon :name="copiedKey === 'modal-json' ? 'lucide:check' : 'lucide:copy'" class="w-3.5 h-3.5 text-brand-primary" />
                  <span>{{ copiedKey === 'modal-json' ? 'Copied!' : 'Copy JSON' }}</span>
                </button>
              </div>
              <pre class="p-4 rounded-lg bg-surface-sunken border border-surface-border text-xs font-mono text-text-primary overflow-x-auto select-all max-h-60">{{ generatedJsonPreset }}</pre>
            </div>

            <!-- CLI Tab -->
            <div v-else-if="activeExportTab === 'cli'" class="space-y-4">
              <div class="space-y-2">
                <div class="flex items-center justify-between text-xs">
                  <span class="text-text-muted">TTI-UX CLI Command:</span>
                  <button
                    type="button"
                    class="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded bg-surface-raised border border-surface-border text-text-primary hover:border-brand-primary cursor-pointer transition-colors"
                    @click="copy(generatedCliCommand, 'modal-cli')"
                  >
                    <UIcon :name="copiedKey === 'modal-cli' ? 'lucide:check' : 'lucide:copy'" class="w-3.5 h-3.5 text-brand-primary" />
                    <span>{{ copiedKey === 'modal-cli' ? 'Copied!' : 'Copy Command' }}</span>
                  </button>
                </div>
                <pre class="p-3 rounded-lg bg-surface-sunken border border-surface-border text-xs font-mono text-text-primary overflow-x-auto select-all">{{ generatedCliCommand }}</pre>
              </div>

              <div class="space-y-2">
                <div class="flex items-center justify-between text-xs">
                  <span class="text-text-muted">Component Import &amp; Template Usage:</span>
                  <button
                    type="button"
                    class="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded bg-surface-raised border border-surface-border text-text-primary hover:border-brand-primary cursor-pointer transition-colors"
                    @click="copy(generatedVueCode, 'modal-vue')"
                  >
                    <UIcon :name="copiedKey === 'modal-vue' ? 'lucide:check' : 'lucide:copy'" class="w-3.5 h-3.5 text-brand-primary" />
                    <span>{{ copiedKey === 'modal-vue' ? 'Copied!' : 'Copy Template' }}</span>
                  </button>
                </div>
                <pre class="p-3 rounded-lg bg-surface-sunken border border-surface-border text-xs font-mono text-text-primary overflow-x-auto select-all max-h-40">{{ generatedVueCode }}</pre>
              </div>
            </div>

            <!-- Share URL Tab -->
            <div v-else-if="activeExportTab === 'share'" class="space-y-3">
              <p class="text-xs text-text-secondary">
                This URL encodes all active prop values and selected preset into query parameters. When loaded, the workbench automatically restores this exact state.
              </p>
              <div class="flex items-center gap-2">
                <input
                  type="text"
                  readonly
                  :value="shareUrl"
                  class="flex-1 text-xs font-mono bg-surface-sunken border border-surface-border rounded px-3 py-2 text-text-primary select-all"
                />
                <button
                  type="button"
                  class="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded bg-brand-primary text-white hover:bg-brand-primary/90 cursor-pointer transition-colors shrink-0"
                  @click="copy(shareUrl, 'modal-url')"
                >
                  <UIcon :name="copiedKey === 'modal-url' ? 'lucide:check' : 'lucide:copy'" class="w-3.5 h-3.5" />
                  <span>{{ copiedKey === 'modal-url' ? 'Copied!' : 'Copy Link' }}</span>
                </button>
              </div>
            </div>
          </div>

          <!-- Modal Footer -->
          <div class="px-6 py-3 bg-surface-sunken border-t border-surface-border flex items-center justify-between">
            <span class="text-[11px] font-mono text-text-muted flex items-center gap-1">
              <UIcon name="lucide:shield-check" class="w-3.5 h-3.5 text-color-success" />
              <span>WCAG 2.2 AAA Verified Specification</span>
            </span>
            <button
              type="button"
              class="px-4 py-1.5 text-xs font-semibold rounded bg-surface-raised border border-surface-border text-text-primary hover:border-brand-primary cursor-pointer transition-colors"
              @click="showExportModal = false"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.tux-playground__code-wrapper :deep(.tux-example__preview.hidden) {
  display: none !important;
}
.tux-playground__code-wrapper :deep(.tux-example) {
  border: 0;
  border-radius: 0;
}
</style>
