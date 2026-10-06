<script setup lang="ts">
/**
 * Design Token Studio & Playground — TUX 3.0
 *
 * Interactive token customization environment designed in alignment with
 * TTI Communications & Marketing brand standards. Enables live-tuning of
 * corner roundness, typography, brand colors, and component density across
 * live TUX components.
 *
 * Features:
 *   - Turnkey Presets (including "TTI Kadence Institutional" for tti.tamu.edu parity)
 *   - Real-time CSS custom property reactivity on the preview canvas
 *   - Export synchronizers for CSS Variables, Tailwind, and WordPress / Kadence theme.json
 *   - In-app "Submit Idea to Forgejo" modal with prefilled issue templates and 1-click links
 */

useHead({
  title: "Design Token Playground · TUX",
  meta: [
    {
      name: "description",
      content: "Interactive design token studio for live-testing component roundness, fonts, and colors with WordPress/Kadence export.",
    },
  ],
});

interface Preset {
  id: string;
  name: string;
  description: string;
  badge: string;
  radius: number; // in px
  fontFamily: string;
  fontName: string;
  primaryColor: string;
  accentColor: string;
  density: "compact" | "standard" | "roomy";
  shape: "default" | "sharp" | "pill";
  theme: "light" | "dark";
}

const presets: Preset[] = [
  {
    id: "tti-kadence",
    name: "TTI Kadence Institutional",
    description: "Design parity with tti.tamu.edu — sharp corners, Roboto typography, Maroon (#500000), and Warm Gold rule.",
    badge: "Comm Alignment",
    radius: 0,
    fontFamily: "'Roboto', sans-serif",
    fontName: "Roboto (TTI Official)",
    primaryColor: "#500000",
    accentColor: "#CFA935",
    density: "standard",
    shape: "sharp",
    theme: "light",
  },
  {
    id: "tux-modern",
    name: "TUX Modern App",
    description: "Modern balanced app profile — subtle 4px radius, Inter typography, rich maroon with gold highlights.",
    badge: "App Recommended",
    radius: 4,
    fontFamily: "'Inter', sans-serif",
    fontName: "Inter (Modern Web)",
    primaryColor: "#5C0025",
    accentColor: "#DDAC37",
    density: "standard",
    shape: "default",
    theme: "light",
  },
  {
    id: "ops-console",
    name: "Operations Console",
    description: "Dense, high-contrast operational surface with compact 2px radius, monospace data accents, and dark canvas.",
    badge: "Operations / TMC",
    radius: 2,
    fontFamily: "'JetBrains Mono', monospace",
    fontName: "JetBrains Mono (Ops)",
    primaryColor: "#6BB4C0",
    accentColor: "#F5D98A",
    density: "compact",
    shape: "sharp",
    theme: "dark",
  },
  {
    id: "friendly-portal",
    name: "Editorial Magazine",
    description: "Academic editorial layout with serif headings, roomy 8px card curvature, and TTI Maroon.",
    badge: "Editorial / Longform",
    radius: 8,
    fontFamily: "Georgia, 'Times New Roman', serif",
    fontName: "Georgia (Editorial)",
    primaryColor: "#500000",
    accentColor: "#B89332",
    density: "roomy",
    shape: "default",
    theme: "light",
  },
];

// Active Studio State
const activePresetId = ref<string>("tti-kadence");
const radius = ref<number>(0);
const fontChoice = ref<string>("'Roboto', sans-serif");
const primaryColor = ref<string>("#500000");
const accentColor = ref<string>("#CFA935");
const density = ref<"compact" | "standard" | "roomy">("standard");
const shape = ref<"default" | "sharp" | "pill">("sharp");
const canvasTheme = ref<"light" | "dark">("light");

// Demo Component States
const buttonClickCount = ref(0);
const sampleInput = ref("Connected Freight Corridor Study");
const sampleSelect = ref("automated-vehicles");
const sampleToggle = ref(true);
const sampleCheckbox = ref(true);
const alertDismissed = ref(false);

// Export Tab State
const activeExportTab = ref<"css" | "kadence" | "tailwind">("kadence");
const copiedKey = ref<string | null>(null);

// Forgejo Modal State
const isForgejoModalOpen = ref(false);
const issueTitle = ref("");
const issueNotes = ref("Aligning TUX component radius and typography with TTI Communications Kadence WordPress theme.");
const savedIdeas = ref<Array<{ title: string; date: string; preset: string }>>([]);

// Radius Options
const radiusOptions = [
  { label: "Sharp (0px)", value: 0 },
  { label: "Subtle (2px)", value: 2 },
  { label: "Standard (4px)", value: 4 },
  { label: "Smooth (8px)", value: 8 },
  { label: "Curved (12px)", value: 12 },
  { label: "Pill (9999px)", value: 9999 },
];

// Font Options
const fontOptions = [
  { label: "Roboto (TTI Official)", value: "'Roboto', sans-serif" },
  { label: "Inter (Modern Web)", value: "'Inter', sans-serif" },
  { label: "Open Sans (TUX Default)", value: "'Open Sans', sans-serif" },
  { label: "Georgia (Editorial)", value: "Georgia, 'Times New Roman', serif" },
  { label: "JetBrains Mono (Ops / Code)", value: "'JetBrains Mono', monospace" },
];

// Color Palettes
const maroonPresets = ["#500000", "#5C0025", "#7A0019", "#3C0018", "#15457E", "#283544"];
const goldPresets = ["#CFA935", "#DDAC37", "#B89332", "#F1C40F", "#D4AF37", "#E3BA4F"];

// Apply Preset
function applyPreset(p: Preset) {
  activePresetId.value = p.id;
  radius.value = p.radius;
  fontChoice.value = p.fontFamily;
  primaryColor.value = p.primaryColor;
  accentColor.value = p.accentColor;
  density.value = p.density;
  shape.value = p.shape;
  canvasTheme.value = p.theme;
}

// Initialize with TTI Kadence preset
onMounted(() => {
  applyPreset(presets[0]);
  try {
    const stored = localStorage.getItem("tux-token-ideas");
    if (stored) savedIdeas.value = JSON.parse(stored);
  } catch (_) {}
});

// Generated Code Snippets
const cssVariablesCode = computed(() => {
  return `:root {
  /* TUX Custom Token Overrides */
  --brand-primary: ${primaryColor.value};
  --brand-accent: ${accentColor.value};
  --font-body: ${fontChoice.value};
  --font-display: ${fontChoice.value};
  --radius-sm: ${Math.max(0, radius.value - 2)}px;
  --radius-md: ${radius.value}px;
  --radius-lg: ${radius.value * 2}px;
  --radius-full: ${radius.value === 0 ? "0px" : "9999px"};
}`;
});

const kadenceThemeJsonCode = computed(() => {
  return `{
  "$schema": "https://schemas.wp.org/trunk/theme.json",
  "version": 3,
  "settings": {
    "color": {
      "palette": [
        {
          "slug": "brand-primary",
          "color": "${primaryColor.value}",
          "name": "TTI Maroon"
        },
        {
          "slug": "brand-accent",
          "color": "${accentColor.value}",
          "name": "TTI Warm Gold"
        }
      ]
    },
    "typography": {
      "fontFamilies": [
        {
          "fontFamily": "${fontChoice.value}",
          "slug": "primary",
          "name": "TTI Brand Font"
        }
      ]
    },
    "custom": {
      "tux": {
        "buttonRadius": "${radius.value}px",
        "cardRadius": "${radius.value}px",
        "ruleColor": "${accentColor.value}"
      }
    }
  }
}`;
});

const tailwindConfigCode = computed(() => {
  return `// tailwind.config.ts extension snippet
export default {
  theme: {
    extend: {
      colors: {
        'brand-primary': '${primaryColor.value}',
        'brand-accent': '${accentColor.value}',
      },
      borderRadius: {
        DEFAULT: '${radius.value}px',
        md: '${radius.value}px',
        lg: '${radius.value * 2}px',
      },
      fontFamily: {
        sans: [${fontChoice.value}],
      },
    },
  },
};`;
});

// Copy Code
async function copyToClipboard(text: string, key: string) {
  try {
    await navigator.clipboard.writeText(text);
    copiedKey.value = key;
    setTimeout(() => {
      if (copiedKey.value === key) copiedKey.value = null;
    }, 2000);
  } catch (_) {}
}

// Open Forgejo Modal
function openForgejoModal() {
  const currentPreset = presets.find((p) => p.id === activePresetId.value);
  issueTitle.value = `[Token Idea] ${currentPreset ? currentPreset.name : "Custom Token Set"}: ${radius.value}px radius, ${fontChoice.value.split(",")[0]}`;
  isForgejoModalOpen.value = true;
}

// Generate Markdown Proposal for Forgejo
const forgejoMarkdownProposal = computed(() => {
  return `### Proposal Summary
${issueNotes.value}

### Proposed Token Configuration
- **Preset Origin**: \`${activePresetId.value}\`
- **Border Radius**: \`${radius.value}px\` (Shape: \`${shape.value}\`)
- **Primary Typography**: \`${fontChoice.value}\`
- **Brand Primary Color**: \`${primaryColor.value}\` (TTI Maroon)
- **Brand Accent Rule**: \`${accentColor.value}\` (Warm Gold)
- **Component Density**: \`${density.value}\`

### WordPress & Kadence Theme Compatibility
The following \`theme.json\` block aligns TTI WordPress Kadence blocks with TUX applications:

\`\`\`json
${kadenceThemeJsonCode.value}
\`\`\`

### CSS Variables Output
\`\`\`css
${cssVariablesCode.value}
\`\`\`

---
*Generated via TUX 3.0 Design Token Studio · Texas A&M Transportation Institute*`;
});

// URL to create issue on Forgejo
const forgejoIssueUrl = computed(() => {
  const base = "https://code.tti.tamu.edu/tti/tti-ux/issues/new";
  const params = new URLSearchParams({
    title: issueTitle.value,
    body: forgejoMarkdownProposal.value,
  });
  return `${base}?${params.toString()}`;
});

// Save Local Idea
function saveLocalIdea() {
  const newIdea = {
    title: issueTitle.value,
    date: new Date().toLocaleDateString(),
    preset: activePresetId.value,
  };
  savedIdeas.value.unshift(newIdea);
  try {
    localStorage.setItem("tux-token-ideas", JSON.stringify(savedIdeas.value.slice(0, 10)));
  } catch (_) {}
  copiedKey.value = "idea-saved";
  setTimeout(() => {
    if (copiedKey.value === "idea-saved") copiedKey.value = null;
  }, 2000);
}
</script>

<template>
  <div class="space-y-8 pb-16">
    <!-- Header with Breadcrumbs & Action Ribbon -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-surface-border">
      <div>
        <div class="flex items-center gap-2 text-xs font-mono text-text-muted uppercase tracking-wider mb-2">
          <NuxtLink to="/tokens" class="hover:text-brand-primary">Foundations</NuxtLink>
          <span>/</span>
          <span class="text-text-primary">Tokens</span>
          <span>/</span>
          <span class="text-brand-primary font-bold">Playground</span>
        </div>
        <div class="flex items-center gap-3">
          <h1 class="text-3xl font-extrabold text-brand-primary tracking-tight m-0">
            Design Token Studio
          </h1>
          <span class="text-xs font-mono font-bold px-2 py-0.5 rounded bg-brand-primary/10 border border-brand-primary/30 text-brand-primary">
            v3.0 Live Tuner
          </span>
        </div>
        <p class="text-sm text-text-secondary mt-1.5 max-w-3xl">
          Live-test component roundness, fonts, and colors to ensure harmony with TTI Communications brand standards and Kadence WordPress themes.
        </p>
      </div>

      <!-- Action Cluster -->
      <div class="flex items-center gap-2 flex-wrap">
        <TuxButton
          intent="secondary"
          size="sm"
          icon="lucide:refresh-cw"
          @click="applyPreset(presets[0])"
        >
          Reset to Comm Parity
        </TuxButton>
        <TuxButton
          intent="primary"
          size="sm"
          icon="lucide:lightbulb"
          @click="openForgejoModal"
        >
          Submit Idea to Forgejo
        </TuxButton>
      </div>
    </div>

    <!-- Presets Grid -->
    <section class="space-y-3">
      <div class="flex items-center justify-between">
        <h2 class="text-xs font-mono font-bold uppercase tracking-wider text-text-muted m-0">
          Target System Presets
        </h2>
        <span class="text-xs text-text-muted">Click any preset to load instantly</span>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <button
          v-for="p in presets"
          :key="p.id"
          class="text-left p-3.5 rounded-xl border transition-all duration-200 relative group flex flex-col justify-between"
          :class="[
            activePresetId === p.id
              ? 'bg-surface-raised border-brand-primary ring-2 ring-brand-primary/20 shadow-md'
              : 'bg-surface-sunken border-surface-border hover:bg-surface-raised hover:border-text-muted/40',
          ]"
          @click="applyPreset(p)"
        >
          <div>
            <div class="flex items-center justify-between gap-1 mb-1.5">
              <span class="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-brand-primary/10 text-brand-primary border border-brand-primary/20">
                {{ p.badge }}
              </span>
              <span
                class="w-3 h-3 rounded-full border border-surface-border"
                :style="{ background: p.primaryColor }"
                :title="`Primary: ${p.primaryColor}`"
              />
            </div>
            <h3 class="text-sm font-bold text-text-primary group-hover:text-brand-primary m-0">
              {{ p.name }}
            </h3>
            <p class="text-xs text-text-muted mt-1 line-clamp-2 leading-relaxed">
              {{ p.description }}
            </p>
          </div>

          <div class="mt-3 pt-2 border-t border-surface-border/60 flex items-center justify-between text-[11px] font-mono text-text-muted">
            <span>Radius: {{ p.radius }}px</span>
            <span>{{ p.density }}</span>
          </div>
        </button>
      </div>
    </section>

    <!-- Main Workspace: Tuning Controls (Left) + Live Canvas (Right) -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      <!-- Tuning Controls Panel (Col 5) -->
      <div class="lg:col-span-5 space-y-6 bg-surface-raised p-5 rounded-2xl border border-surface-border shadow-sm">
        <div class="flex items-center justify-between pb-3 border-b border-surface-border">
          <h2 class="text-sm font-bold text-text-primary flex items-center gap-2 m-0">
            <UIcon name="lucide:sliders" class="w-4 h-4 text-brand-primary" />
            <span>Interactive Token Knobs</span>
          </h2>
          <span class="text-xs font-mono text-text-muted">Live CSS injection</span>
        </div>

        <!-- 1. Corner Radius Knob -->
        <div class="space-y-2">
          <div class="flex items-center justify-between text-xs font-semibold">
            <label class="text-text-primary flex items-center gap-1.5">
              <UIcon name="lucide:square" class="w-3.5 h-3.5 text-text-muted" />
              <span>Corner Roundness</span>
            </label>
            <span class="font-mono text-brand-primary">{{ radius }}px</span>
          </div>
          <div class="grid grid-cols-3 gap-1.5">
            <button
              v-for="r in radiusOptions"
              :key="r.value"
              class="px-2 py-1.5 text-xs font-mono rounded border transition-colors text-center"
              :class="[
                radius === r.value
                  ? 'bg-brand-primary text-white border-brand-primary font-bold shadow-xs'
                  : 'bg-surface-sunken text-text-secondary border-surface-border hover:bg-surface-raised',
              ]"
              @click="radius = r.value"
            >
              {{ r.label }}
            </button>
          </div>
        </div>

        <!-- 2. Typography Knob -->
        <div class="space-y-2">
          <div class="flex items-center justify-between text-xs font-semibold">
            <label class="text-text-primary flex items-center gap-1.5">
              <UIcon name="lucide:type" class="w-3.5 h-3.5 text-text-muted" />
              <span>Typography Family</span>
            </label>
          </div>
          <select
            v-model="fontChoice"
            aria-label="Typography Family"
            class="w-full text-xs font-mono px-3 py-2 rounded-lg bg-surface-sunken border border-surface-border text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary"
          >
            <option v-for="f in fontOptions" :key="f.value" :value="f.value">
              {{ f.label }}
            </option>
          </select>
        </div>

        <!-- 3. Primary Brand Color -->
        <div class="space-y-2">
          <div class="flex items-center justify-between text-xs font-semibold">
            <label class="text-text-primary flex items-center gap-1.5">
              <UIcon name="lucide:palette" class="w-3.5 h-3.5 text-text-muted" />
              <span>Brand Primary (Maroon Anchor)</span>
            </label>
            <span class="font-mono text-xs text-text-muted">{{ primaryColor }}</span>
          </div>
          <div class="flex items-center gap-2">
            <button
              v-for="c in maroonPresets"
              :key="c"
              type="button"
              :aria-label="'Select maroon color ' + c"
              class="w-7 h-7 rounded-md border transition-transform hover:scale-110 flex items-center justify-center cursor-pointer"
              :class="primaryColor === c ? 'ring-2 ring-offset-1 ring-brand-primary' : 'border-surface-border'"
              :style="{ background: c }"
              @click="primaryColor = c"
            >
              <UIcon v-if="primaryColor === c" name="lucide:check" class="w-3.5 h-3.5 text-white" />
            </button>
            <input
              v-model="primaryColor"
              type="color"
              aria-label="Custom primary color"
              class="w-8 h-8 rounded border border-surface-border cursor-pointer bg-transparent"
              title="Custom primary color"
            />
          </div>
        </div>

        <!-- 4. Accent Gold Color -->
        <div class="space-y-2">
          <div class="flex items-center justify-between text-xs font-semibold">
            <label class="text-text-primary flex items-center gap-1.5">
              <UIcon name="lucide:sparkles" class="w-3.5 h-3.5 text-text-muted" />
              <span>Brand Accent (Gold Rule & Badges)</span>
            </label>
            <span class="font-mono text-xs text-text-muted">{{ accentColor }}</span>
          </div>
          <div class="flex items-center gap-2">
            <button
              v-for="c in goldPresets"
              :key="c"
              type="button"
              :aria-label="'Select gold accent color ' + c"
              class="w-7 h-7 rounded-md border transition-transform hover:scale-110 flex items-center justify-center cursor-pointer"
              :class="accentColor === c ? 'ring-2 ring-offset-1 ring-brand-primary' : 'border-surface-border'"
              :style="{ background: c }"
              @click="accentColor = c"
            >
              <UIcon v-if="accentColor === c" name="lucide:check" class="w-3.5 h-3.5 text-brand-primary" />
            </button>
            <input
              v-model="accentColor"
              type="color"
              aria-label="Custom accent color"
              class="w-8 h-8 rounded border border-surface-border cursor-pointer bg-transparent"
              title="Custom accent color"
            />
          </div>
        </div>

        <!-- 5. Component Geometry & Shape -->
        <div class="space-y-2">
          <label class="text-xs font-semibold text-text-primary block">
            Button Shape Profile
          </label>
          <div class="grid grid-cols-3 gap-2">
            <button
              class="px-2 py-1.5 text-xs font-mono rounded border transition-colors text-center"
              :class="shape === 'sharp' ? 'bg-brand-primary text-white border-brand-primary font-bold' : 'bg-surface-sunken text-text-secondary border-surface-border'"
              @click="shape = 'sharp'"
            >
              Sharp (Kadence)
            </button>
            <button
              class="px-2 py-1.5 text-xs font-mono rounded border transition-colors text-center"
              :class="shape === 'default' ? 'bg-brand-primary text-white border-brand-primary font-bold' : 'bg-surface-sunken text-text-secondary border-surface-border'"
              @click="shape = 'default'"
            >
              Token Default
            </button>
            <button
              class="px-2 py-1.5 text-xs font-mono rounded border transition-colors text-center"
              :class="shape === 'pill' ? 'bg-brand-primary text-white border-brand-primary font-bold' : 'bg-surface-sunken text-text-secondary border-surface-border'"
              @click="shape = 'pill'"
            >
              Pill
            </button>
          </div>
        </div>

        <!-- 6. Density & Theme Toggles -->
        <div class="pt-3 border-t border-surface-border grid grid-cols-2 gap-4">
          <div>
            <label class="text-xs font-semibold text-text-primary block mb-1.5">Density</label>
            <div class="flex rounded-lg border border-surface-border p-0.5 bg-surface-sunken text-xs font-mono">
              <button
                class="flex-1 py-1 rounded text-center transition-colors"
                :class="density === 'compact' ? 'bg-surface-raised font-bold text-brand-primary shadow-xs' : 'text-text-muted'"
                @click="density = 'compact'"
              >
                Compact
              </button>
              <button
                class="flex-1 py-1 rounded text-center transition-colors"
                :class="density === 'standard' ? 'bg-surface-raised font-bold text-brand-primary shadow-xs' : 'text-text-muted'"
                @click="density = 'standard'"
              >
                Standard
              </button>
              <button
                class="flex-1 py-1 rounded text-center transition-colors"
                :class="density === 'roomy' ? 'bg-surface-raised font-bold text-brand-primary shadow-xs' : 'text-text-muted'"
                @click="density = 'roomy'"
              >
                Roomy
              </button>
            </div>
          </div>

          <div>
            <label class="text-xs font-semibold text-text-primary block mb-1.5">Studio Theme</label>
            <div class="flex rounded-lg border border-surface-border p-0.5 bg-surface-sunken text-xs font-mono">
              <button
                class="flex-1 py-1 rounded text-center transition-colors flex items-center justify-center gap-1"
                :class="canvasTheme === 'light' ? 'bg-surface-raised font-bold text-brand-primary shadow-xs' : 'text-text-muted'"
                @click="canvasTheme = 'light'"
              >
                <UIcon name="lucide:sun" class="w-3.5 h-3.5" />
                <span>Light</span>
              </button>
              <button
                class="flex-1 py-1 rounded text-center transition-colors flex items-center justify-center gap-1"
                :class="canvasTheme === 'dark' ? 'bg-surface-raised font-bold text-brand-primary shadow-xs' : 'text-text-muted'"
                @click="canvasTheme = 'dark'"
              >
                <UIcon name="lucide:moon" class="w-3.5 h-3.5" />
                <span>Dark</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Live Reactive Component Canvas (Col 7) -->
      <div class="lg:col-span-7 space-y-6">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h2 class="text-sm font-bold text-text-primary m-0">Live Component Preview Canvas</h2>
          </div>
          <span class="text-xs font-mono text-text-muted">Dynamic DOM Reactivity</span>
        </div>

        <!-- The Canvas Container with Injected Reactive Token CSS Properties -->
        <div
          class="border rounded-2xl transition-all duration-300 p-6 space-y-8 shadow-sm overflow-hidden"
          :class="[
            canvasTheme === 'light'
              ? 'bg-white text-zinc-900 border-zinc-200'
              : 'bg-zinc-950 text-zinc-100 border-zinc-800',
          ]"
          :style="{
            fontFamily: fontChoice,
            '--brand-primary': primaryColor,
            '--brand-accent': accentColor,
            '--radius-md': `${radius}px`,
          }"
        >
          <!-- 1. TTI Signature Institutional Heading -->
          <div>
            <TuxSectionHeader
              title="Automated Transportation Systems"
              subtitle="Texas A&M Transportation Institute — Connected Infrastructure Division"
              kicker="03 // LIVING PUBLICATION"
              variant="institutional"
            />
          </div>

          <!-- 2. Action Buttons Cluster -->
          <div class="space-y-2">
            <div class="text-xs font-mono uppercase tracking-wider text-text-muted">
              Interactive Buttons
            </div>
            <div class="flex items-center gap-3 flex-wrap">
              <TuxButton
                intent="primary"
                :shape="shape"
                icon="lucide:play"
                @click="buttonClickCount++"
              >
                Run Telemetry ({{ buttonClickCount }})
              </TuxButton>
              <TuxButton intent="secondary" :shape="shape" icon="lucide:download">
                Export Dataset
              </TuxButton>
              <TuxButton intent="ghost" :shape="shape">
                Dismiss
              </TuxButton>
              <TuxButton intent="destructive" :shape="shape" icon="lucide:trash-2">
                Purge
              </TuxButton>
            </div>
          </div>

          <!-- 3. Form Controls Row -->
          <div class="space-y-2">
            <div class="text-xs font-mono uppercase tracking-wider text-text-muted">
              Interactive Form Inputs
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label for="preview-project-title" class="text-xs font-semibold block mb-1 opacity-80">Research Project Title</label>
                <input
                  id="preview-project-title"
                  v-model="sampleInput"
                  type="text"
                  class="w-full text-xs px-3 py-2 border transition-all duration-200"
                  :style="{
                    borderRadius: `${radius}px`,
                    borderColor: 'var(--surface-border, #ccc)',
                  }"
                />
              </div>

              <div>
                <label for="preview-program-category" class="text-xs font-semibold block mb-1 opacity-80">Program Category</label>
                <select
                  id="preview-program-category"
                  v-model="sampleSelect"
                  class="w-full text-xs px-3 py-2 border transition-all duration-200"
                  :style="{
                    borderRadius: `${radius}px`,
                    borderColor: 'var(--surface-border, #ccc)',
                  }"
                >
                  <option value="automated-vehicles">Connected & Automated Vehicles</option>
                  <option value="freight-mobility">Freight & Multimodal Mobility</option>
                  <option value="workzone-safety">Smart Workzone Telemetry</option>
                </select>
              </div>
            </div>

            <!-- Toggles & Checkbox -->
            <div class="flex items-center gap-6 pt-1 text-xs">
              <label class="flex items-center gap-2 cursor-pointer">
                <input
                  v-model="sampleCheckbox"
                  type="checkbox"
                  class="cursor-pointer accent-[var(--brand-primary)]"
                />
                <span>Include Executive Briefing</span>
              </label>

              <label class="flex items-center gap-2 cursor-pointer">
                <input
                  v-model="sampleToggle"
                  type="checkbox"
                  role="switch"
                  class="cursor-pointer accent-[var(--brand-primary)]"
                />
                <span>Peer-Review Complete</span>
              </label>
            </div>
          </div>

          <!-- 4. Research Publication Card (Parity with tti.tamu.edu news/cards) -->
          <div
            class="border transition-all duration-200 p-4 space-y-3"
            :style="{
              borderRadius: `${radius}px`,
              borderColor: 'var(--surface-border, #e5e5e5)',
              background: canvasTheme === 'light' ? '#fafafa' : '#18181b',
            }"
          >
            <div class="flex items-start justify-between gap-4">
              <div>
                <div class="flex items-center gap-2 mb-1.5">
                  <span
                    class="text-[10px] font-mono font-bold uppercase px-1.5 py-0.5"
                    :style="{
                      background: accentColor,
                      color: primaryColor,
                      borderRadius: `${Math.max(0, radius - 2)}px`,
                    }"
                  >
                    CAV Research
                  </span>
                  <span class="text-[11px] font-mono opacity-60">Published Sep 2026</span>
                </div>
                <h3
                  class="text-base font-bold m-0 leading-snug cursor-pointer hover:underline"
                  :style="{ color: primaryColor }"
                >
                  Freight Platooning Evaluation along the I-10 Texas Innovation Corridor
                </h3>
              </div>
              <span
                class="text-xs font-bold px-2 py-1 border flex-shrink-0"
                :style="{
                  borderRadius: `${radius}px`,
                  borderColor: primaryColor,
                  color: primaryColor,
                }"
              >
                Peer-Reviewed
              </span>
            </div>

            <p class="text-xs opacity-80 leading-relaxed m-0">
              Cooperative adaptive cruise control evaluation demonstrating a 14.8% reduction in diesel fuel consumption across Class 8 heavy vehicles.
            </p>

            <div class="flex items-center justify-between pt-2 border-t border-dashed border-zinc-300 dark:border-zinc-700 text-xs">
              <span class="opacity-70 font-mono text-[11px]">DOI: 10.1177/036119812604921</span>
              <TuxButton intent="primary" size="xs" :shape="shape">
                Read Publication →
              </TuxButton>
            </div>
          </div>

          <!-- 5. BigStat KPI Widget -->
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div
              class="p-3 border"
              :style="{
                borderRadius: `${radius}px`,
                borderColor: 'var(--surface-border, #e5e5e5)',
              }"
            >
              <div class="text-[10px] font-mono uppercase opacity-70">Throughput Index</div>
              <div class="text-2xl font-black mt-0.5" :style="{ color: primaryColor }">99.4%</div>
              <div class="text-[10px] font-bold text-emerald-600 mt-1">↑ +4.2% YoY</div>
            </div>

            <div
              class="p-3 border"
              :style="{
                borderRadius: `${radius}px`,
                borderColor: 'var(--surface-border, #e5e5e5)',
              }"
            >
              <div class="text-[10px] font-mono uppercase opacity-70">Verified Tests</div>
              <div class="text-2xl font-black mt-0.5">219 / 219</div>
              <div class="text-[10px] font-bold text-emerald-600 mt-1">100% Pass Rate</div>
            </div>

            <div
              class="p-3 border col-span-2 sm:col-span-1"
              :style="{
                borderRadius: `${radius}px`,
                borderColor: 'var(--surface-border, #e5e5e5)',
              }"
            >
              <div class="text-[10px] font-mono uppercase opacity-70">Kadence Sync</div>
              <div class="text-2xl font-black mt-0.5" :style="{ color: accentColor }">Ready</div>
              <div class="text-[10px] opacity-70 mt-1">v3.0.0 Compatible</div>
            </div>
          </div>

          <!-- 6. Alert Notice Banner with Signature Gold Bar -->
          <div
            v-if="!alertDismissed"
            class="flex items-center justify-between gap-3 p-3 border-l-4"
            :style="{
              borderLeftColor: accentColor,
              borderRadius: `${radius}px`,
              background: canvasTheme === 'light' ? '#f4f4f5' : '#27272a',
            }"
          >
            <div class="flex items-center gap-2 text-xs">
              <UIcon name="lucide:info" class="w-4 h-4 text-brand-primary flex-shrink-0" />
              <span>Institutional adherence: components automatically synchronize with Texas A&M brand guidelines.</span>
            </div>
            <button
              class="opacity-60 hover:opacity-100 text-xs font-mono"
              @click="alertDismissed = true"
            >
              ✕
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Code & Token Synchronization Output -->
    <section class="bg-surface-raised rounded-2xl border border-surface-border p-6 space-y-4">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-surface-border">
        <div>
          <h2 class="text-base font-bold text-text-primary m-0 flex items-center gap-2">
            <UIcon name="lucide:code-2" class="w-5 h-5 text-brand-primary" />
            <span>Design Token Synchronization Exports</span>
          </h2>
          <p class="text-xs text-text-muted mt-0.5">
            Use these generated tokens directly in WordPress, CSS stylesheets, or Tailwind configs.
          </p>
        </div>

        <div class="flex items-center gap-2">
          <!-- Format Tabs -->
          <div class="flex rounded-lg border border-surface-border p-0.5 bg-surface-sunken text-xs font-mono">
            <button
              class="px-3 py-1 rounded transition-colors"
              :class="activeExportTab === 'kadence' ? 'bg-surface-raised font-bold text-brand-primary shadow-xs' : 'text-text-muted'"
              @click="activeExportTab = 'kadence'"
            >
              WordPress theme.json
            </button>
            <button
              class="px-3 py-1 rounded transition-colors"
              :class="activeExportTab === 'css' ? 'bg-surface-raised font-bold text-brand-primary shadow-xs' : 'text-text-muted'"
              @click="activeExportTab = 'css'"
            >
              CSS Variables
            </button>
            <button
              class="px-3 py-1 rounded transition-colors"
              :class="activeExportTab === 'tailwind' ? 'bg-surface-raised font-bold text-brand-primary shadow-xs' : 'text-text-muted'"
              @click="activeExportTab = 'tailwind'"
            >
              Tailwind Config
            </button>
          </div>

          <TuxButton
            intent="secondary"
            size="xs"
            icon="lucide:copy"
            @click="
              copyToClipboard(
                activeExportTab === 'kadence'
                  ? kadenceThemeJsonCode
                  : activeExportTab === 'css'
                  ? cssVariablesCode
                  : tailwindConfigCode,
                'export-code'
              )
            "
          >
            {{ copiedKey === "export-code" ? "Copied!" : "Copy Snippet" }}
          </TuxButton>
        </div>
      </div>

      <!-- Code Box -->
      <div class="relative">
        <pre class="m-0 p-4 rounded-xl bg-surface-sunken border border-surface-border text-xs font-mono overflow-x-auto max-h-72 leading-relaxed"><code>{{
          activeExportTab === "kadence"
            ? kadenceThemeJsonCode
            : activeExportTab === "css"
            ? cssVariablesCode
            : tailwindConfigCode
        }}</code></pre>
      </div>
    </section>

    <!-- Forgejo Submission Modal / Dialog -->
    <div
      v-if="isForgejoModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn"
      @click.self="isForgejoModalOpen = false"
    >
      <div class="bg-surface-raised border border-surface-border rounded-2xl shadow-2xl max-w-2xl w-full p-6 space-y-5 animate-scaleUp">
        <div class="flex items-start justify-between pb-3 border-b border-surface-border">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 rounded-lg bg-brand-primary/10 flex items-center justify-center text-brand-primary">
              <UIcon name="lucide:git-pull-request" class="w-4 h-4" />
            </div>
            <div>
              <h3 class="text-base font-bold text-text-primary m-0">Submit Token Idea to Forgejo</h3>
              <p class="text-xs text-text-muted mt-0.5">TTI Code repository: code.tti.tamu.edu/tti/tti-ux</p>
            </div>
          </div>
          <button
            class="text-text-muted hover:text-text-primary text-sm p-1"
            @click="isForgejoModalOpen = false"
          >
            ✕
          </button>
        </div>

        <div class="space-y-4">
          <div>
            <label class="text-xs font-semibold text-text-primary block mb-1">Issue Proposal Title</label>
            <input
              v-model="issueTitle"
              type="text"
              class="w-full text-xs font-mono px-3 py-2 rounded-lg bg-surface-sunken border border-surface-border text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary"
            />
          </div>

          <div>
            <label class="text-xs font-semibold text-text-primary block mb-1">Design Rationale / Context</label>
            <textarea
              v-model="issueNotes"
              rows="3"
              class="w-full text-xs px-3 py-2 rounded-lg bg-surface-sunken border border-surface-border text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary"
            />
          </div>

          <div>
            <label class="text-xs font-semibold text-text-primary block mb-1">Pre-filled Markdown Payload</label>
            <div class="relative">
              <pre class="m-0 p-3 rounded-lg bg-surface-sunken border border-surface-border text-[11px] font-mono overflow-x-auto max-h-48 leading-relaxed select-all"><code>{{ forgejoMarkdownProposal }}</code></pre>
            </div>
          </div>
        </div>

        <div class="flex items-center justify-between pt-3 border-t border-surface-border">
          <div class="flex items-center gap-2">
            <TuxButton
              intent="secondary"
              size="sm"
              icon="lucide:bookmark"
              @click="saveLocalIdea"
            >
              {{ copiedKey === "idea-saved" ? "Saved Locally!" : "Save Local Idea" }}
            </TuxButton>
            <TuxButton
              intent="secondary"
              size="sm"
              icon="lucide:copy"
              @click="copyToClipboard(forgejoMarkdownProposal, 'proposal-copied')"
            >
              {{ copiedKey === "proposal-copied" ? "Copied!" : "Copy Markdown" }}
            </TuxButton>
          </div>

          <div class="flex items-center gap-2">
            <TuxButton intent="ghost" size="sm" @click="isForgejoModalOpen = false">
              Cancel
            </TuxButton>
            <a
              :href="forgejoIssueUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded bg-brand-primary text-white hover:bg-brand-primary-deep transition-colors shadow-xs"
            >
              <UIcon name="lucide:external-link" class="w-3.5 h-3.5" />
              <span>Open in Forgejo Issues</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
