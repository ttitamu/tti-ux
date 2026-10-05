<script setup lang="ts">
import tuxCommandPaletteSource from "~/components/TuxCommandPalette.vue?raw";
import type { TuxPropControl } from "~/components/TuxPlayground.vue";
import type { CommandGroup } from "~/components/TuxCommandPalette.vue";

useHead({ title: "TuxCommandPalette · TUX" });

const localPaletteRef = ref<{ open: (tab?: string) => void; close: () => void } | null>(null);

const playgroundControls: TuxPropControl[] = [
  {
    prop: "placeholder",
    label: "Input Placeholder",
    type: "text",
    defaultValue: "Type a command, token (--), component (@), or search…",
  },
  {
    prop: "defaultTab",
    label: "Default Filter Tab",
    type: "select",
    options: [
      { label: "All categories (all)", value: "all" },
      { label: "Quick Actions (actions)", value: "actions" },
      { label: "Component Lab (components)", value: "components" },
      { label: "Design Tokens (tokens)", value: "tokens" },
      { label: "Documentation (docs)", value: "docs" },
    ],
    defaultValue: "all",
  },
  {
    prop: "showTabs",
    label: "Show Filter Tabs",
    type: "boolean",
    defaultValue: true,
  },
  {
    prop: "hotkey",
    label: "Trigger Hotkey",
    type: "text",
    defaultValue: "k",
  },
];

const sampleGroups: CommandGroup[] = [
  {
    heading: "⚡ Quick Actions",
    category: "actions",
    items: [
      {
        id: "act-theme",
        label: "Toggle dark mode",
        description: "Flip between light + dark palettes",
        icon: "lucide:moon",
        shortcut: "⌘ ⇧ D",
        category: "actions",
        badge: "Theme",
        badgeTone: "brand",
      },
      {
        id: "act-copy-url",
        label: "Copy current URL",
        description: "Share a deep link to this page",
        icon: "lucide:link",
        category: "actions",
        badge: "Share",
        badgeTone: "neutral",
        copyText: "https://tti.tamu.edu/tux",
      },
    ],
  },
  {
    heading: "🎨 Design Tokens",
    category: "tokens",
    items: [
      {
        id: "tok-maroon",
        label: "--brand-primary",
        description: "#5C0025 · Primary brand action fill",
        category: "tokens",
        badge: "brand",
        badgeTone: "brand",
        tokenValue: "#5C0025",
        isColor: true,
        copyText: "var(--brand-primary)",
      },
      {
        id: "tok-gold",
        label: "--brand-accent",
        description: "#DDAC37 · Signature ochre gold accent",
        category: "tokens",
        badge: "semantic",
        badgeTone: "brand",
        tokenValue: "#DDAC37",
        isColor: true,
        copyText: "var(--brand-accent)",
      },
      {
        id: "tok-status-ok",
        label: "--status-ok",
        description: "#258818 · Normal operational telemetry state",
        category: "tokens",
        badge: "ops",
        badgeTone: "ok",
        tokenValue: "#258818",
        isColor: true,
        copyText: "var(--status-ok)",
      },
    ],
  },
  {
    heading: "🧩 Components",
    category: "components",
    items: [
      { id: "cmp-button", label: "TuxButton", description: "Primary interactive buttons", icon: "lucide:rectangle-horizontal", to: "/components/button", category: "components", badge: "actions", badgeTone: "brand" },
      { id: "cmp-card", label: "TuxCard", description: "Branded content slabs and interactive links", icon: "lucide:square-stack", to: "/components/card", category: "components", badge: "publishing", badgeTone: "brand" },
      { id: "cmp-alert", label: "TuxAlert", description: "Docusaurus-style admonitions and callouts", icon: "lucide:message-square", to: "/components/alert", category: "components", badge: "feedback", badgeTone: "brand" },
    ],
  },
  {
    heading: "📚 Documentation",
    category: "docs",
    items: [
      { id: "doc-tokens", label: "Tokens Catalog", description: "Every color, shadow, and radius token", icon: "lucide:palette", to: "/tokens", category: "docs", badge: "Doc", badgeTone: "neutral" },
      { id: "doc-adr12", label: "ADR-0012: Cross-Framework Distribution", description: "Web components and framework packaging", icon: "lucide:book-open", to: "/docs/adr/0012-cross-framework-distribution-via-web-components", category: "docs", badge: "ADR", badgeTone: "neutral" },
    ],
  },
];
</script>

<template>
  <div class="space-y-12">
    <TuxPageHeader eyebrow="component" title="TuxCommandPalette">
      Command Palette 2.0 (⌘K). High-productivity search input with instant design token inspector,
      quick system actions, live color swatches, filter tabs, and fuzzy component census jump.
      Built on the native <code>&lt;dialog&gt;</code> element for zero-JS browser focus traps and accessibility.
    </TuxPageHeader>

    <!-- Interactive Workbench -->
    <section>
      <TuxPlayground
        tag="tux-command-palette"
        component-name="TuxCommandPalette"
        title="TuxCommandPalette Workbench"
        :controls="playgroundControls"
        :source="tuxCommandPaletteSource"
        :self-closing="true"
      >
        <template #default="{ values }">
          <div class="flex flex-col sm:flex-row items-center justify-center gap-4 py-6">
            <TuxButton
              intent="primary"
              size="lg"
              icon="lucide:command"
              @click="localPaletteRef?.open(values.defaultTab)"
            >
              Open Command Palette Preview
            </TuxButton>
            <span class="text-xs text-text-muted font-mono">
              (press <TuxKbd :keys="['meta', 'k']" size="xs" /> anywhere for global shell palette)
            </span>
          </div>

          <TuxCommandPalette
            ref="localPaletteRef"
            :groups="sampleGroups"
            :placeholder="values.placeholder"
            :show-tabs="values.showTabs"
            :default-tab="values.defaultTab"
            :hotkey="values.hotkey"
            :disable-hotkey="true"
          />
        </template>
      </TuxPlayground>
    </section>

    <!-- Prefix Filter Syntax -->
    <section>
      <p class="eyebrow">productivity</p>
      <h2 class="heading--bold text-xl font-bold">Instant Filter Prefixes</h2>
      <p class="text-sm text-text-secondary mb-4">
        Users can jump straight into specific subsystems simply by typing a single lead character:
      </p>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="p-4 rounded-md border border-surface-border bg-surface-raised space-y-1">
          <div class="flex items-center gap-2">
            <code class="text-brand-primary font-bold bg-wash-brand-12 px-1.5 py-0.5 rounded text-xs">&gt;</code>
            <span class="font-bold text-sm">Quick Actions</span>
          </div>
          <p class="text-xs text-text-muted">Type <code>&gt;</code> to filter to system commands, theme toggles, and framework switches.</p>
        </div>

        <div class="p-4 rounded-md border border-surface-border bg-surface-raised space-y-1">
          <div class="flex items-center gap-2">
            <code class="text-color-info font-bold bg-surface-sunken px-1.5 py-0.5 rounded text-xs">--</code>
            <span class="font-bold text-sm">Design Tokens</span>
          </div>
          <p class="text-xs text-text-muted">Type <code>--</code> or <code>token:</code> to inspect color swatches, roles, and copy CSS variables.</p>
        </div>

        <div class="p-4 rounded-md border border-surface-border bg-surface-raised space-y-1">
          <div class="flex items-center gap-2">
            <code class="text-brand-primary font-bold bg-wash-brand-12 px-1.5 py-0.5 rounded text-xs">@</code>
            <span class="font-bold text-sm">Component Lab</span>
          </div>
          <p class="text-xs text-text-muted">Type <code>@</code> or <code>comp:</code> to search across all 150+ catalogued TUX components.</p>
        </div>

        <div class="p-4 rounded-md border border-surface-border bg-surface-raised space-y-1">
          <div class="flex items-center gap-2">
            <code class="text-text-secondary font-bold bg-surface-sunken px-1.5 py-0.5 rounded text-xs">#</code>
            <span class="font-bold text-sm">Documentation</span>
          </div>
          <p class="text-xs text-text-muted">Type <code>#</code> or <code>doc:</code> to search design doctrines, ADR records, and guides.</p>
        </div>
      </div>
    </section>

    <!-- Architecture & Setup -->
    <section>
      <p class="eyebrow">architecture</p>
      <h2 class="heading--bold text-xl font-bold">Why native <code>&lt;dialog&gt;</code></h2>
      <p class="max-w-3xl text-sm text-text-secondary leading-relaxed mb-4">
        The browser natively provides modal focus trapping, ESC-to-close behavior, inert backdrop rendering, and
        proper accessibility roles when using <code>showModal()</code>. The TUX command palette builds upon this
        native standard, adding reactive keyboard list traversal, token swatch previewing, and non-intrusive toast integration.
      </p>

      <pre class="text-xs bg-surface-sunken border border-surface-border rounded p-4 overflow-x-auto font-mono"><code>&lt;script setup&gt;
import { ref } from "vue";

const paletteRef = ref(null);
const groups = [
  {
    heading: "⚡ Actions",
    category: "actions",
    items: [
      { id: "act-theme", label: "Toggle Dark Mode", action: () => toggleTheme() }
    ]
  },
  {
    heading: "🎨 Design Tokens",
    category: "tokens",
    items: [
      { id: "tok-primary", label: "--brand-primary", tokenValue: "#5C0025", isColor: true, copyText: "var(--brand-primary)" }
    ]
  }
];
&lt;/script&gt;

&lt;template&gt;
  &lt;TuxCommandPalette ref="paletteRef" :groups="groups" /&gt;
  &lt;TuxButton @click="paletteRef.open()"&gt;Quick Search&lt;/TuxButton&gt;
&lt;/template&gt;</code></pre>
    </section>
  </div>
</template>
