<script setup lang="ts">
// /install/figma — Figma & Penpot Design Kit

import { computed, ref } from "vue";

useHead({ title: "Figma Kit · TUX" });

const svgManifestGlob = import.meta.glob("../../../kit/figma/svg-components/manifest.json", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

const svgFilesGlob = import.meta.glob("../../../kit/figma/svg-components/*.svg", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

const dtcgGlob = import.meta.glob("../../../kit/figma/tokens.dtcg.json", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

const studioGlob = import.meta.glob("../../../kit/figma/tokens-studio.json", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

const varsGlob = import.meta.glob("../../../kit/figma/figma-variables.json", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

const codeConnectGlob = import.meta.glob("../../../kit/figma/code-connect.json", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

const pluginManifestGlob = import.meta.glob("../../../kit/figma/plugin/manifest.json", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

const pluginCodeGlob = import.meta.glob("../../../kit/figma/plugin/code.js", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

const pluginUiGlob = import.meta.glob("../../../kit/figma/plugin/ui.html", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

interface SvgSheetMeta {
  id: string;
  name: string;
  category: string;
  route: string;
  dimensions: string;
  description: string;
  file: string;
  svg: string;
}

interface CodeConnectEntry {
  name: string;
  tagName: string;
  category: string;
  blurb: string;
  route: string;
  figmaNodePattern: string;
  snippets: {
    vue: string;
    react: string;
    webComponents: string;
    blazor: string;
    wordpress: string;
  };
}

const rawManifest = JSON.parse(Object.values(svgManifestGlob)[0] ?? '{"sheets":[]}');
const svgById: Record<string, string> = {};
for (const [filePath, content] of Object.entries(svgFilesGlob)) {
  const m = filePath.match(/\/([^/]+)\.svg$/);
  if (m && m[1]) {
    svgById[m[1]] = content;
  }
}

const sheets: SvgSheetMeta[] = (rawManifest.sheets ?? []).map(
  (s: Omit<SvgSheetMeta, "svg">) => ({
    ...s,
    svg: svgById[s.id] ?? "",
  }),
);

const selectedCategory = ref<string>("All");
const categories = computed(() => {
  const set = new Set<string>(["All"]);
  for (const s of sheets) set.add(s.category);
  return [...set];
});

const filteredSheets = computed(() => {
  if (selectedCategory.value === "All") return sheets;
  return sheets.filter((s) => s.category === selectedCategory.value);
});

const copiedId = ref<string | null>(null);
const copiedMasterKit = ref(false);
const expandedSvgId = ref<string | null>(null);
const copiedTokensStudioQuick = ref(false);

const studioRaw = Object.values(studioGlob)[0] ?? "{}";
const codeConnectRaw = Object.values(codeConnectGlob)[0] ?? '{"components":[]}';
const pluginManifestRaw = Object.values(pluginManifestGlob)[0] ?? "{}";
const pluginCodeRaw = Object.values(pluginCodeGlob)[0] ?? "";
const pluginUiRaw = Object.values(pluginUiGlob)[0] ?? "";

/**
 * Combines all 18 SVG component sheets into a single 2-column Master SVG artboard
 * so Figma Web and Desktop users on the Free plan can paste the entire kit in one Cmd+V.
 */
const masterKitSvg = computed(() => {
  const colY: [number, number] = [88, 88];
  const groups: string[] = [];

  for (const sheet of sheets) {
    const dims = sheet.dimensions.split("x").map((n) => Number.parseInt(n, 10));
    const h = Number.isFinite(dims[1]) ? dims[1]! : 220;
    const col = colY[0] <= colY[1] ? 0 : 1;
    const x = col === 0 ? 24 : 816;
    const y = colY[col];

    const inner = sheet.svg
      .replace(/^\s*<svg[^>]*>/i, "")
      .replace(/<\/svg>\s*$/i, "")
      .trim();

    groups.push(`  <g id="Sheet-${sheet.id}" transform="translate(${x}, ${y})">\n${inner}\n  </g>`);
    colY[col] += h + 24;
  }

  const totalHeight = Math.max(colY[0], colY[1]) + 16;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 ${totalHeight}" width="1600" height="${totalHeight}" fill="none">
  <rect width="1600" height="${totalHeight}" rx="12" fill="#F3F2EE" stroke="#E2E0DA" stroke-width="1"/>
  <rect x="0" y="0" width="1600" height="64" rx="12" fill="#5C0025"/>
  <text x="28" y="30" fill="#FFFFFF" font-family="'Oswald', 'Open Sans', sans-serif" font-size="18" font-weight="700" letter-spacing="0.5">TUX MASTER FIGMA KIT — 18 VECTOR SHEETS (LIGHT, DARK &amp; HIGH CONTRAST TOKENS)</text>
  <text x="28" y="50" fill="#E2E0DA" font-family="'JetBrains Mono', monospace" font-size="11">Texas A&amp;M Transportation Institute · Paste into Figma Web or Desktop (Cmd+V / Ctrl+V) · Ungroup frames to use individual components</text>
${groups.join("\n")}
</svg>`;
});

async function copyMasterKitToClipboard() {
  if (import.meta.client && navigator.clipboard) {
    await navigator.clipboard.writeText(masterKitSvg.value);
    copiedMasterKit.value = true;
    setTimeout(() => {
      copiedMasterKit.value = false;
    }, 2200);
  }
}

async function copySvgToClipboard(sheet: SvgSheetMeta) {
  if (import.meta.client && navigator.clipboard) {
    await navigator.clipboard.writeText(sheet.svg);
    copiedId.value = sheet.id;
    setTimeout(() => {
      if (copiedId.value === sheet.id) copiedId.value = null;
    }, 2000);
  }
}

async function copyTokensStudioQuick() {
  if (import.meta.client && navigator.clipboard) {
    await navigator.clipboard.writeText(studioRaw);
    copiedTokensStudioQuick.value = true;
    setTimeout(() => {
      copiedTokensStudioQuick.value = false;
    }, 2000);
  }
}

function downloadTextFile(filename: string, content: string, mimeType = "application/json") {
  if (!import.meta.client) return;
  const blob = new Blob([content], { type: `${mimeType};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function downloadAllPluginFiles() {
  downloadTextFile("manifest.json", pluginManifestRaw, "application/json");
  setTimeout(() => downloadTextFile("code.js", pluginCodeRaw, "text/javascript"), 150);
  setTimeout(() => downloadTextFile("ui.html", pluginUiRaw, "text/html"), 300);
}

function svgDataUri(svg: string): string {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

// Interactive Code Connect Lookup (for users without paid Figma Dev Mode seats)
const parsedCodeConnect = JSON.parse(codeConnectRaw) as { components?: CodeConnectEntry[] };
const allCodeConnectComponents: CodeConnectEntry[] = parsedCodeConnect.components ?? [];
const ccSearchQuery = ref("");
const selectedCcName = ref(allCodeConnectComponents.find((c) => c.name === "TuxButton")?.name ?? allCodeConnectComponents[0]?.name ?? "");
const selectedCcFramework = ref<"vue" | "react" | "webComponents" | "blazor" | "wordpress">("vue");
const copiedCcSnippet = ref(false);

const filteredCcComponents = computed(() => {
  const q = ccSearchQuery.value.trim().toLowerCase();
  if (!q) return allCodeConnectComponents.slice(0, 24);
  return allCodeConnectComponents
    .filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.tagName.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q) ||
        c.blurb.toLowerCase().includes(q),
    )
    .slice(0, 24);
});

const activeCcEntry = computed(
  () =>
    allCodeConnectComponents.find((c) => c.name === selectedCcName.value) ??
    filteredCcComponents.value[0] ??
    allCodeConnectComponents[0],
);

const activeCcSnippet = computed(() => {
  if (!activeCcEntry.value) return "";
  return activeCcEntry.value.snippets[selectedCcFramework.value] ?? activeCcEntry.value.snippets.vue;
});

async function copyCcSnippet() {
  if (import.meta.client && navigator.clipboard && activeCcSnippet.value) {
    await navigator.clipboard.writeText(activeCcSnippet.value);
    copiedCcSnippet.value = true;
    setTimeout(() => {
      copiedCcSnippet.value = false;
    }, 2000);
  }
}

type ArtifactTabId = "dtcg" | "studio" | "variables" | "code-connect";
const activeArtifactTab = ref<ArtifactTabId>("dtcg");
const copiedArtifact = ref(false);

const artifactTabs: {
  id: ArtifactTabId;
  label: string;
  filename: string;
  path: string;
  description: string;
  raw: string;
}[] = [
  {
    id: "dtcg",
    label: "W3C DTCG 2025.10",
    filename: "tokens.dtcg.json",
    path: "kit/figma/tokens.dtcg.json",
    description:
      "W3C Design Tokens Community Group format with 3-mode TUX extensions (tti, tti-dark, tti-hc) for Figma, Penpot, and Style Dictionary.",
    raw: Object.values(dtcgGlob)[0] ?? "{}",
  },
  {
    id: "studio",
    label: "Tokens Studio",
    filename: "tokens-studio.json",
    path: "kit/figma/tokens-studio.json",
    description:
      "Multi-theme token set pre-configured for the free Tokens Studio for Figma plugin.",
    raw: studioRaw,
  },
  {
    id: "variables",
    label: "Figma Variables",
    filename: "figma-variables.json",
    path: "kit/figma/figma-variables.json",
    description:
      "Typed COLOR, FLOAT, and STRING variable definitions with 0..1 RGBA floats, scopes, and platform codeSyntax.",
    raw: Object.values(varsGlob)[0] ?? "{}",
  },
  {
    id: "code-connect",
    label: "Code Connect",
    filename: "code-connect.json",
    path: "kit/figma/code-connect.json",
    description:
      "Component registry mapping every Tux* primitive to Vue 3, React, Web Components, Blazor, and WordPress snippets.",
    raw: codeConnectRaw,
  },
];

const currentArtifact = computed(
  () => artifactTabs.find((t) => t.id === activeArtifactTab.value) ?? artifactTabs[0]!,
);

const currentArtifactPreview = computed(() => {
  const lines = currentArtifact.value.raw.split("\n");
  if (lines.length <= 40) return currentArtifact.value.raw;
  return [...lines.slice(0, 40), "  // ... (full payload in kit/figma/)"].join("\n");
});

async function copyArtifactJson() {
  if (import.meta.client && navigator.clipboard) {
    await navigator.clipboard.writeText(currentArtifact.value.raw);
    copiedArtifact.value = true;
    setTimeout(() => {
      copiedArtifact.value = false;
    }, 2000);
  }
}

const buildCommandSnippet = `npm run build:figma
npm run verify:figma`;
</script>

<template>
  <div class="space-y-10">
    <TuxBreadcrumbs
      :trail="[
        { label: 'Home', to: '/' },
        { label: 'Install', to: '/install' },
        { label: 'Figma Kit' },
      ]"
    />

    <TuxPageHeader eyebrow="kit · figma &amp; penpot" title="Figma Design Kit">
      Built for the <strong>free Figma Starter plan</strong> (Web and Desktop) and
      <strong>Penpot</strong>. Copy editable vector component sheets and color swatches directly to
      your clipboard, import W3C DTCG 2025.10 tokens, or run the local plugin without paying for
      Figma Professional, Enterprise Variables REST API, or Dev Mode seats.
    </TuxPageHeader>

    <!-- Quick Start Workflows -->
    <section class="space-y-4" aria-labelledby="workflows-heading">
      <TuxSectionHeader
        id="workflows-heading"
        title="Quick Start"
        subtitle="Three ways to load TUX into a free Figma account or Penpot workspace."
      />

      <div class="grid gap-4 lg:grid-cols-3">
        <!-- Workflow 1: Copy & Paste SVG (Web & Desktop Free) -->
        <TuxCard padded class="flex flex-col justify-between space-y-4">
          <div class="space-y-2.5">
            <div class="flex items-center justify-between gap-2">
              <span class="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase text-brand-primary">
                <UIcon name="lucide:copy" class="w-3.5 h-3.5" aria-hidden="true" />
                <span>1 · Clipboard</span>
              </span>
              <TuxBadge tone="success" variant="soft">Figma Web &amp; Desktop (Free)</TuxBadge>
            </div>
            <h3 class="text-base font-bold text-text-primary">
              Paste Vector Sheets &amp; Swatches
            </h3>
            <p class="text-sm text-text-secondary">
              Works in any browser with zero plugins installed. Copy all 18 sheets at once or copy
              individual component sheets below, then press <kbd>Cmd+V</kbd> (Mac) or
              <kbd>Ctrl+V</kbd> (Windows) on your Figma canvas to get editable frames, vector paths,
              and text layers.
            </p>
          </div>
          <div class="flex flex-wrap gap-2 pt-2 border-t border-surface-border-subtle">
            <TuxButton
              intent="primary"
              :icon="copiedMasterKit ? 'lucide:check' : 'lucide:copy'"
              class="flex-1 justify-center"
              @click="copyMasterKitToClipboard"
            >
              {{ copiedMasterKit ? "Copied All 18 Sheets" : "Copy All 18 Sheets" }}
            </TuxButton>
            <TuxButton
              intent="secondary"
              icon="lucide:arrow-down"
              href="#gallery-heading"
            >
              Browse
            </TuxButton>
          </div>
        </TuxCard>

        <!-- Workflow 2: Tokens Studio / Penpot (Web & Desktop Free) -->
        <TuxCard padded class="flex flex-col justify-between space-y-4">
          <div class="space-y-2.5">
            <div class="flex items-center justify-between gap-2">
              <span class="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase text-brand-primary">
                <UIcon name="lucide:palette" class="w-3.5 h-3.5" aria-hidden="true" />
                <span>2 · Token JSON</span>
              </span>
              <TuxBadge tone="brand" variant="soft">Figma Web &amp; Penpot</TuxBadge>
            </div>
            <h3 class="text-base font-bold text-text-primary">
              Tokens Studio &amp; W3C DTCG
            </h3>
            <p class="text-sm text-text-secondary">
              Using Figma in the browser? Copy <code>tokens-studio.json</code> into the free
              <strong>Tokens Studio for Figma</strong> community plugin, or import
              <code>tokens.dtcg.json</code> directly into <strong>Penpot</strong> to load Light,
              Dark, and High-Contrast themes.
            </p>
          </div>
          <div class="flex flex-wrap gap-2 pt-2 border-t border-surface-border-subtle">
            <TuxButton
              intent="primary"
              :icon="copiedTokensStudioQuick ? 'lucide:check' : 'lucide:copy'"
              class="flex-1 justify-center"
              @click="copyTokensStudioQuick"
            >
              {{ copiedTokensStudioQuick ? "Copied JSON" : "Copy Studio JSON" }}
            </TuxButton>
            <TuxButton
              intent="secondary"
              icon="lucide:download"
              @click="downloadTextFile('tokens-studio.json', studioRaw, 'application/json')"
            >
              .json
            </TuxButton>
          </div>
        </TuxCard>

        <!-- Workflow 3: Local Desktop Plugin (Free Starter Plan) -->
        <TuxCard padded class="flex flex-col justify-between space-y-4">
          <div class="space-y-2.5">
            <div class="flex items-center justify-between gap-2">
              <span class="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase text-brand-primary">
                <UIcon name="lucide:layers" class="w-3.5 h-3.5" aria-hidden="true" />
                <span>3 · Local Plugin</span>
              </span>
              <TuxBadge tone="neutral" variant="soft">Figma Desktop (Free)</TuxBadge>
            </div>
            <h3 class="text-base font-bold text-text-primary">
              Auto-Layout, Styles &amp; Variables
            </h3>
            <p class="text-sm text-text-secondary">
              The free Figma Desktop app lets any Starter account load local plugins via
              <strong>Plugins → Development → Import plugin from manifest…</strong>. Syncs Paint,
              Text, and Effect Styles, Auto-Layout components, and 3 single-mode Variable
              collections.
            </p>
          </div>
          <div class="pt-2 border-t border-surface-border-subtle">
            <TuxButton
              intent="primary"
              icon="lucide:download"
              class="w-full justify-center"
              @click="downloadAllPluginFiles"
            >
              Download 3 Plugin Files
            </TuxButton>
          </div>
        </TuxCard>
      </div>
    </section>

    <!-- Free Plan Compatibility Matrix -->
    <section class="space-y-4" aria-labelledby="free-plan-heading">
      <TuxSectionHeader
        id="free-plan-heading"
        title="Free Figma Plan Compatibility"
        subtitle="How TUX bypasses paid Figma Professional, Organization, and Enterprise restrictions."
      />

      <div class="overflow-x-auto rounded-lg border border-surface-border bg-surface-card">
        <table class="w-full text-left text-sm border-collapse">
          <thead>
            <tr class="border-b border-surface-border bg-surface-sunken text-xs font-mono uppercase text-text-secondary">
              <th class="py-3 px-4">Capability</th>
              <th class="py-3 px-4">Figma Paywall Limit</th>
              <th class="py-3 px-4">Figma Web (Free)</th>
              <th class="py-3 px-4">Figma Desktop (Free)</th>
              <th class="py-3 px-4">Penpot (Free / OSS)</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-surface-border-subtle text-text-secondary">
            <tr>
              <td class="py-3 px-4 font-semibold text-text-primary">
                Vector Component Library &amp; Color Swatches
              </td>
              <td class="py-3 px-4">
                Team Component Libraries require paid Professional seats
              </td>
              <td class="py-3 px-4">
                <span class="inline-flex items-center gap-1.5 text-status-ok font-medium">
                  <UIcon name="lucide:check-circle-2" class="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span>Copy SVG + <kbd>Cmd+V</kbd></span>
                </span>
              </td>
              <td class="py-3 px-4">
                <span class="inline-flex items-center gap-1.5 text-status-ok font-medium">
                  <UIcon name="lucide:check-circle-2" class="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span>Copy SVG or Auto-Layout Plugin</span>
                </span>
              </td>
              <td class="py-3 px-4">
                <span class="inline-flex items-center gap-1.5 text-status-ok font-medium">
                  <UIcon name="lucide:check-circle-2" class="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span>Paste or Import SVG</span>
                </span>
              </td>
            </tr>
            <tr>
              <td class="py-3 px-4 font-semibold text-text-primary">
                Multi-Theme Tokens (Light, Dark, High-Contrast)
              </td>
              <td class="py-3 px-4">
                Free Starter limits Variable Collections to 1 mode; REST API requires Enterprise
              </td>
              <td class="py-3 px-4">
                <span class="inline-flex items-center gap-1.5 text-status-ok font-medium">
                  <UIcon name="lucide:check-circle-2" class="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span>Tokens Studio JSON or Palette SVG</span>
                </span>
              </td>
              <td class="py-3 px-4">
                <span class="inline-flex items-center gap-1.5 text-status-ok font-medium">
                  <UIcon name="lucide:check-circle-2" class="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span>3 Single-Mode Collections + Paint Styles</span>
                </span>
              </td>
              <td class="py-3 px-4">
                <span class="inline-flex items-center gap-1.5 text-status-ok font-medium">
                  <UIcon name="lucide:check-circle-2" class="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span>Native <code>tokens.dtcg.json</code></span>
                </span>
              </td>
            </tr>
            <tr>
              <td class="py-3 px-4 font-semibold text-text-primary">
                Typography &amp; Elevation Styles
              </td>
              <td class="py-3 px-4">
                Unrestricted on Free Starter plan
              </td>
              <td class="py-3 px-4">
                <span class="inline-flex items-center gap-1.5 text-status-ok font-medium">
                  <UIcon name="lucide:check-circle-2" class="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span>Included in Foundations Sheet</span>
                </span>
              </td>
              <td class="py-3 px-4">
                <span class="inline-flex items-center gap-1.5 text-status-ok font-medium">
                  <UIcon name="lucide:check-circle-2" class="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span>1-Click Text &amp; Effect Styles Sync</span>
                </span>
              </td>
              <td class="py-3 px-4">
                <span class="inline-flex items-center gap-1.5 text-status-ok font-medium">
                  <UIcon name="lucide:check-circle-2" class="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span>Native DTCG Typography</span>
                </span>
              </td>
            </tr>
            <tr>
              <td class="py-3 px-4 font-semibold text-text-primary">
                Code Connect Snippets (Vue, React, WC, Blazor, WP)
              </td>
              <td class="py-3 px-4">
                Figma Code Connect requires paid Dev Mode / Organization seats
              </td>
              <td class="py-3 px-4">
                <span class="inline-flex items-center gap-1.5 text-status-ok font-medium">
                  <UIcon name="lucide:check-circle-2" class="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span>Web Inspector on this page</span>
                </span>
              </td>
              <td class="py-3 px-4">
                <span class="inline-flex items-center gap-1.5 text-status-ok font-medium">
                  <UIcon name="lucide:check-circle-2" class="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span>Built into Local Plugin + Web</span>
                </span>
              </td>
              <td class="py-3 px-4">
                <span class="inline-flex items-center gap-1.5 text-status-ok font-medium">
                  <UIcon name="lucide:check-circle-2" class="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span>Web Inspector + <code>code-connect.json</code></span>
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- Interactive Copy-to-Figma Component Gallery -->
    <section class="space-y-4" aria-labelledby="gallery-heading">
      <div class="flex flex-wrap items-end justify-between gap-4">
        <TuxSectionHeader
          id="gallery-heading"
          :title="`Vector Component Sheets (${sheets.length})`"
          subtitle="Copy any vector sheet or the complete 18-sheet master artboard and press Cmd+V / Ctrl+V in Figma."
        />
        <div class="flex flex-wrap items-center gap-2">
          <TuxButton
            size="sm"
            intent="primary"
            :icon="copiedMasterKit ? 'lucide:check' : 'lucide:copy'"
            @click="copyMasterKitToClipboard"
          >
            {{ copiedMasterKit ? "Copied Master SVG (Cmd+V in Figma)" : "Copy All 18 Sheets as Master SVG" }}
          </TuxButton>
          <TuxButton
            size="sm"
            intent="secondary"
            icon="lucide:download"
            @click="downloadTextFile('tux-figma-master-kit.svg', masterKitSvg, 'image/svg+xml')"
          >
            Download Master .svg
          </TuxButton>
        </div>
      </div>

      <div class="flex flex-wrap gap-1.5" role="group" aria-label="Filter component sheets by category">
        <TuxButton
          v-for="cat in categories"
          :key="cat"
          size="xs"
          :intent="selectedCategory === cat ? 'primary' : 'secondary'"
          :aria-pressed="selectedCategory === cat"
          @click="selectedCategory = cat"
        >
          {{ cat === "All" ? `All (${sheets.length})` : cat }}
        </TuxButton>
      </div>

      <div class="grid gap-5 lg:grid-cols-2">
        <TuxCard
          v-for="sheet in filteredSheets"
          :key="sheet.id"
          padded
          class="flex flex-col justify-between space-y-4"
        >
          <div class="space-y-3">
            <div class="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p class="eyebrow">{{ sheet.category }}</p>
                <h3 class="text-base font-bold text-text-primary">
                  {{ sheet.name }}
                </h3>
              </div>
              <span class="px-2 py-0.5 text-xs font-mono rounded bg-surface-sunken text-text-secondary">
                {{ sheet.dimensions }} px
              </span>
            </div>

            <p class="text-xs text-text-secondary">
              {{ sheet.description }}
            </p>

            <div class="overflow-hidden rounded border border-surface-border bg-surface-sunken p-2">
              <img
                :src="svgDataUri(sheet.svg)"
                :alt="`${sheet.name} Figma vector component sheet preview`"
                class="w-full h-auto block rounded"
                loading="lazy"
              >
            </div>
          </div>

          <div class="space-y-3 pt-2 border-t border-surface-border-subtle">
            <div class="flex flex-wrap items-center justify-between gap-2">
              <div class="flex flex-wrap items-center gap-2">
                <TuxButton
                  size="sm"
                  intent="primary"
                  :icon="copiedId === sheet.id ? 'lucide:check' : 'lucide:copy'"
                  @click="copySvgToClipboard(sheet)"
                >
                  {{ copiedId === sheet.id ? "Copied SVG" : "Copy SVG" }}
                </TuxButton>

                <TuxButton
                  size="sm"
                  intent="secondary"
                  icon="lucide:download"
                  @click="downloadTextFile(`${sheet.id}.svg`, sheet.svg, 'image/svg+xml')"
                >
                  .svg
                </TuxButton>

                <TuxButton
                  size="sm"
                  intent="ghost"
                  icon="lucide:code"
                  :aria-expanded="expandedSvgId === sheet.id"
                  @click="expandedSvgId = expandedSvgId === sheet.id ? null : sheet.id"
                >
                  {{ expandedSvgId === sheet.id ? "Hide Source" : "Source" }}
                </TuxButton>
              </div>

              <NuxtLink
                :to="sheet.route"
                class="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold text-brand-primary hover:underline"
              >
                <span>Docs</span>
                <UIcon name="lucide:arrow-right" class="w-3.5 h-3.5" aria-hidden="true" />
              </NuxtLink>
            </div>

            <div v-if="expandedSvgId === sheet.id" class="pt-1">
              <TuxCodeBlock
                :code="sheet.svg"
                language="xml"
                :filename="sheet.file"
              />
            </div>
          </div>
        </TuxCard>
      </div>
    </section>

    <!-- Free Code Connect Inspector (No Paid Dev Mode Required) -->
    <section class="space-y-4" aria-labelledby="code-connect-heading">
      <TuxSectionHeader
        id="code-connect-heading"
        title="Code Connect Inspector"
        subtitle="Look up production code snippets for any of the 183 TUX primitives without paying for Figma Dev Mode."
      />

      <TuxCard padded class="space-y-4">
        <div class="grid gap-4 lg:grid-cols-12">
          <div class="lg:col-span-5 space-y-3">
            <label for="cc-search-input" class="block text-xs font-mono uppercase text-text-secondary">
              Search 183 Components ({{ allCodeConnectComponents.length }} indexed)
            </label>
            <div class="relative">
              <input
                id="cc-search-input"
                v-model="ccSearchQuery"
                type="search"
                placeholder="Filter e.g. TuxButton, TuxStatus, table, modal..."
                class="w-full rounded border border-surface-border bg-surface-canvas px-3 py-2 text-sm text-text-primary focus:border-brand-primary focus:outline-none"
              >
            </div>
            <div class="flex flex-wrap gap-1.5 max-h-44 overflow-y-auto p-1">
              <TuxButton
                v-for="comp in filteredCcComponents"
                :key="comp.name"
                size="xs"
                :intent="activeCcEntry?.name === comp.name ? 'primary' : 'secondary'"
                @click="selectedCcName = comp.name"
              >
                {{ comp.name }}
              </TuxButton>
            </div>
          </div>

          <div v-if="activeCcEntry" class="lg:col-span-7 space-y-3">
            <div class="flex flex-wrap items-center justify-between gap-2">
              <div>
                <div class="flex items-center gap-2">
                  <h3 class="text-base font-bold text-text-primary">{{ activeCcEntry.name }}</h3>
                  <TuxBadge tone="neutral" variant="soft">{{ activeCcEntry.category }}</TuxBadge>
                </div>
                <p class="text-xs text-text-secondary mt-0.5">{{ activeCcEntry.blurb }}</p>
              </div>
              <NuxtLink
                :to="activeCcEntry.route"
                class="inline-flex items-center gap-1 text-xs font-semibold text-brand-primary hover:underline"
              >
                <span>Component Docs</span>
                <UIcon name="lucide:arrow-right" class="w-3.5 h-3.5" aria-hidden="true" />
              </NuxtLink>
            </div>

            <div class="flex flex-wrap items-center justify-between gap-2 pt-1">
              <div class="flex flex-wrap gap-1.5" role="tablist" aria-label="Target framework">
                <TuxButton
                  v-for="fw in [
                    { id: 'vue', label: 'Vue 3' },
                    { id: 'react', label: 'React' },
                    { id: 'webComponents', label: 'Web Component' },
                    { id: 'blazor', label: 'Blazor' },
                    { id: 'wordpress', label: 'WordPress' },
                  ] as const"
                  :key="fw.id"
                  size="xs"
                  :intent="selectedCcFramework === fw.id ? 'primary' : 'secondary'"
                  @click="selectedCcFramework = fw.id"
                >
                  {{ fw.label }}
                </TuxButton>
              </div>

              <TuxButton
                size="xs"
                intent="secondary"
                :icon="copiedCcSnippet ? 'lucide:check' : 'lucide:copy'"
                @click="copyCcSnippet"
              >
                {{ copiedCcSnippet ? "Copied" : "Copy Snippet" }}
              </TuxButton>
            </div>

            <TuxCodeBlock
              :code="activeCcSnippet"
              language="html"
              :filename="`${activeCcEntry.name} (${selectedCcFramework})`"
            />
          </div>
        </div>
      </TuxCard>
    </section>

    <!-- Deterministic Token & Code Connect JSON Payloads -->
    <section class="space-y-4" aria-labelledby="artifacts-heading">
      <TuxSectionHeader
        id="artifacts-heading"
        title="Token &amp; Code Connect Artifacts"
        subtitle="Compiled from design/tokens.json and app/utils/tuxCatalog.ts."
      />

      <div class="flex flex-wrap items-center justify-between gap-3">
        <div class="flex flex-wrap gap-1.5" role="tablist" aria-label="Figma JSON Artifacts">
          <TuxButton
            v-for="tab in artifactTabs"
            :key="tab.id"
            role="tab"
            size="sm"
            :intent="activeArtifactTab === tab.id ? 'primary' : 'secondary'"
            :aria-selected="activeArtifactTab === tab.id"
            @click="activeArtifactTab = tab.id"
          >
            {{ tab.label }}
          </TuxButton>
        </div>

        <div class="flex flex-wrap items-center gap-2">
          <TuxButton
            size="sm"
            intent="secondary"
            :icon="copiedArtifact ? 'lucide:check' : 'lucide:copy'"
            @click="copyArtifactJson"
          >
            {{ copiedArtifact ? "Copied" : `Copy ${currentArtifact.filename}` }}
          </TuxButton>

          <TuxButton
            size="sm"
            intent="secondary"
            icon="lucide:download"
            @click="downloadTextFile(currentArtifact.filename, currentArtifact.raw, 'application/json')"
          >
            Download
          </TuxButton>
        </div>
      </div>

      <p class="text-sm text-text-secondary">
        {{ currentArtifact.description }}
      </p>

      <TuxCodeBlock
        :code="currentArtifactPreview"
        language="json"
        :filename="currentArtifact.path"
      />
    </section>

    <!-- CLI Build & Verification -->
    <section class="space-y-3" aria-labelledby="cli-heading">
      <TuxSectionHeader
        id="cli-heading"
        title="CLI Generation"
      />
      <TuxCodeBlock
        :code="buildCommandSnippet"
        language="sh"
        filename="terminal"
      />
    </section>
  </div>
</template>
