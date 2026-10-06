<script setup lang="ts">
import { ref } from "vue";
import { useTuxClipboard } from "~/composables/useTuxClipboard";

useHead({ title: "WordPress & Kadence Integration · TUX" });

const activeTab = ref<"child-theme" | "plugin" | "patterns" | "bridge">("child-theme");

const { copied: copiedFunctions, copy: copyFunctions } = useTuxClipboard();
const { copied: copiedStyle, copy: copyStyle } = useTuxClipboard();
const { copied: copiedThemeJson, copy: copyThemeJson } = useTuxClipboard();
const { copied: copiedShortcode, copy: copyShortcode } = useTuxClipboard();
const { copied: copiedBridge, copy: copyBridge } = useTuxClipboard();

// Active Child Theme Code File Tab
const activeCodeFile = ref<"functions" | "style" | "theme">("functions");

const functionsPhpSnippet = `<?php
/**
 * Functions and definitions for TTI Kadence Child Theme.
 * @package Kadence_Child_TTI
 * @version 3.0.0
 */
if (!defined('ABSPATH')) exit;

define('TTI_KADENCE_CHILD_VERSION', '3.0.0');

// Enqueue stylesheets, canonical tokens, and WCAG AAA bridge
add_action('wp_enqueue_scripts', function() {
    wp_enqueue_style('kadence-parent-style', get_template_directory_uri() . '/style.css');
    wp_enqueue_style('kadence-child-tti-style', get_stylesheet_directory_uri() . '/style.css', ['kadence-parent-style'], TTI_KADENCE_CHILD_VERSION);
    wp_enqueue_style('tux-tokens', 'https://cdn.jsdelivr.net/gh/ttitamu/tti-ux@v3.0.0/kit/css/tux-tokens.css', [], TTI_KADENCE_CHILD_VERSION);
    wp_enqueue_style('tux-bridge', 'https://cdn.jsdelivr.net/gh/ttitamu/tti-ux@v3.0.0/kit/css/tux-bridge.css', ['tux-tokens'], TTI_KADENCE_CHILD_VERSION);
    wp_enqueue_script('tux-elements', 'https://cdn.jsdelivr.net/gh/ttitamu/tti-ux@v3.0.0/packages/elements/dist/tux-elements.js', [], TTI_KADENCE_CHILD_VERSION, ['strategy' => 'defer', 'in_footer' => true]);
}, 20);

// Configure Kadence Global Palette with official TTI brand values
add_filter('kadence_global_palette', function($palette) {
    return array_replace(is_array($palette) ? $palette : [], [
        0 => ['color' => '#500000', 'name' => __('TTI Maroon (Primary)', 'kadence-child-tti'), 'slug' => 'theme-palette1'],
        1 => ['color' => '#3C0000', 'name' => __('Deep Maroon', 'kadence-child-tti'), 'slug' => 'theme-palette2'],
        2 => ['color' => '#CFA935', 'name' => __('Institutional Gold', 'kadence-child-tti'), 'slug' => 'theme-palette3'],
        3 => ['color' => '#221F1F', 'name' => __('Reading Charcoal', 'kadence-child-tti'), 'slug' => 'theme-palette4'],
        4 => ['color' => '#374151', 'name' => __('Secondary Slate', 'kadence-child-tti'), 'slug' => 'theme-palette5'],
    ]);
}, 20);

// Render Tier 1 Institutional Utility Bar above Kadence header
add_action('kadence_before_header', function() {
    ?>
    <aside class="tti-utility-bar" aria-label="<?php esc_attr_e('Institutional Utility Links', 'kadence-child-tti'); ?>">
        <div class="tti-utility-bar__agency">
            <a href="https://tti.tamu.edu" target="_blank" rel="noopener noreferrer">
                <?php esc_html_e('Texas A&M Transportation Institute', 'kadence-child-tti'); ?> &nearr;
            </a>
        </div>
        <nav class="tti-utility-bar__nav" aria-label="<?php esc_attr_e('Utility Navigation', 'kadence-child-tti'); ?>">
            <a href="https://tti.tamu.edu/jobs/"><?php esc_html_e('Jobs', 'kadence-child-tti'); ?></a>
            <a href="https://tti.tamu.edu/pressroom/"><?php esc_html_e('Pressroom', 'kadence-child-tti'); ?></a>
            <a href="https://tti.tamu.edu/directory/"><?php esc_html_e('Directory', 'kadence-child-tti'); ?></a>
            <a href="https://tti.tamu.edu/contact/"><?php esc_html_e('Contact', 'kadence-child-tti'); ?></a>
        </nav>
    </aside>
    <?php
}, 5);`;

const styleCssSnippet = `/*
Theme Name: TTI Kadence Child Theme
Theme URI: https://code.tti.tamu.edu/tti/tti-ux
Description: Official Texas A&M Transportation Institute Child Theme for Kadence.
Template: kadence
Version: 3.0.0
*/

:root {
  --global-btn-radius: 0px !important;
  --global-palette1: #500000 !important; /* TTI Maroon */
  --global-palette2: #3c0000 !important; /* Deep Maroon */
  --global-palette3: #cfa935 !important; /* Warm Gold */
  --global-palette4: #221f1f !important; /* Reading Charcoal */
  --global-palette5: #374151 !important; /* Secondary Slate */
  --global-palette6: #e5e7eb !important; /* Border Gray */
  --global-palette7: #f9fafb !important; /* Surface Sunken */
  --global-palette8: #ffffff !important; /* Pure White */
}

/* 0px Sharp Rectangular Button Geometry */
.wp-block-button__link,
.kt-button,
button.wp-block-search__button,
input[type="submit"] {
  border-radius: 0px !important;
  font-weight: 600 !important;
  min-height: 44px !important;
  padding: 10px 24px !important;
}

/* Signature Heading Rhythm with Gold Underline */
.tti-section-header,
.entry-content h2.wp-block-heading {
  color: #500000 !important;
  font-weight: 700 !important;
  padding-bottom: 8px !important;
  border-bottom: 2px solid #cfa935 !important;
}`;

const themeJsonSnippet = `{
  "$schema": "https://schemas.wp.org/trunk/theme.json",
  "version": 3,
  "settings": {
    "color": {
      "palette": [
        { "slug": "theme-palette1", "color": "#500000", "name": "TTI Maroon" },
        { "slug": "theme-palette2", "color": "#3C0000", "name": "Deep Maroon" },
        { "slug": "theme-palette3", "color": "#CFA935", "name": "Institutional Gold" },
        { "slug": "theme-palette4", "color": "#221F1F", "name": "Reading Charcoal" },
        { "slug": "theme-palette5", "color": "#374151", "name": "Secondary Slate" }
      ]
    },
    "typography": {
      "fontFamilies": [
        { "fontFamily": "Roboto, sans-serif", "slug": "body", "name": "Roboto" },
        { "fontFamily": "Roboto, sans-serif", "slug": "heading", "name": "Roboto Heading" }
      ]
    }
  }
}`;

// Shortcode Preview State
const selectedShortcode = ref<"portal" | "stat" | "heading" | "alert" | "card" | "staleness">("portal");

const shortcodes = {
  portal: {
    title: "Institutional Utility Header",
    tag: '[tux_portal_header agency="Texas A&M Transportation Institute" search="true"]',
    description: "Renders the Tier 1 maroon utility bar with agency mark and links to Jobs, Pressroom, Directory, and Contact.",
  },
  stat: {
    title: "BigStat Metric Fact",
    tag: '[tux_stat value="650" suffix="+" label="Active Connected Testbeds" tone="maroon"]',
    description: "Displays an oversized metric fact with tabular numerals and maroon/gold accent tones.",
  },
  heading: {
    title: "Signature TTI Heading",
    tag: '[tux_heading title="Connected Corridors Research" level="2"]',
    description: "Emits a semantic H2 header in Maroon with the signature 2px Warm Gold underline keyline.",
  },
  alert: {
    title: "WCAG AAA Advisory Alert",
    tag: '[tux_alert variant="warning" title="Operations Advisory"]Corridor sensing test in progress on FM-2818.[/tux_alert]',
    description: "Renders an accessible alert callout banner with guaranteed 7:1 contrast.",
  },
  card: {
    title: "Program Focus Card",
    tag: '[tux_card to="/safety" padded="true"]<h3>Crash Analysis Program</h3><p>Collision mitigation.</p>[/tux_card]',
    description: "Container card with rectangular geometry and subtle hover elevation.",
  },
  staleness: {
    title: "Dataset Freshness Notice",
    tag: '[tux_staleness stale="true" date="2026-09-01" owner="Mobility Analysis Division"]',
    description: "Renders a metadata freshness advisory indicating when telemetry data was last audited.",
  },
};

const bridgeImportSnippet = `/* WordPress Admin -> Appearance -> Customize -> Additional CSS */
@import url('https://cdn.jsdelivr.net/gh/ttitamu/tti-ux@v3.0.0/kit/css/tux-tokens.css');
@import url('https://cdn.jsdelivr.net/gh/ttitamu/tti-ux@v3.0.0/kit/css/tux-bridge.css');

/* Elevates tables, forms, buttons, and headings to WCAG 2.2 AAA standards */`;
</script>

<template>
  <div class="space-y-8 pb-16">
    <TuxBreadcrumbs :trail="[{ label: 'Home', to: '/' }, { label: 'Install', to: '/install' }, { label: 'WordPress' }]" />

    <TuxPageHeader eyebrow="Distribution · WordPress" title="WordPress & Kadence Integration">
      Official Texas A&amp;M Transportation Institute design system integration for WordPress. Provides turnkey Kadence child themes,
      v3.0 Gutenberg block patterns, WCAG 2.2 Level AAA styles, and drop-in shortcodes.
      <template #actions>
        <div class="flex items-center gap-2 pt-1">
          <TuxBadge tone="success" variant="soft" class="font-mono text-xs">
            <UIcon name="lucide:shield-check" class="w-3.5 h-3.5 inline mr-1 text-emerald-500" />
            WCAG 2.2 AAA
          </TuxBadge>
          <TuxBadge tone="brand" variant="soft" class="font-mono text-xs">
            Kadence Parity
          </TuxBadge>
        </div>
      </template>
    </TuxPageHeader>

    <!-- Navigation Tabs (Horizontally Scrollable on Mobile) -->
    <div class="border-b border-surface-border overflow-x-auto scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
      <nav class="flex space-x-4 sm:space-x-6 text-sm font-medium min-w-max" aria-label="WordPress Integration Tabs">
        <button
          type="button"
          class="pb-3 border-b-2 font-mono text-xs transition-colors cursor-pointer flex items-center gap-2 whitespace-nowrap"
          :class="activeTab === 'child-theme' ? 'border-brand-primary text-brand-primary font-bold' : 'border-transparent text-text-muted hover:text-text-primary'"
          @click="activeTab = 'child-theme'"
        >
          <UIcon name="lucide:layout-template" class="w-4 h-4" />
          <span>Kadence Child Theme</span>
        </button>

        <button
          type="button"
          class="pb-3 border-b-2 font-mono text-xs transition-colors cursor-pointer flex items-center gap-2 whitespace-nowrap"
          :class="activeTab === 'plugin' ? 'border-brand-primary text-brand-primary font-bold' : 'border-transparent text-text-muted hover:text-text-primary'"
          @click="activeTab = 'plugin'"
        >
          <UIcon name="lucide:plug" class="w-4 h-4" />
          <span>TTI-UX Core Plugin</span>
        </button>

        <button
          type="button"
          class="pb-3 border-b-2 font-mono text-xs transition-colors cursor-pointer flex items-center gap-2 whitespace-nowrap"
          :class="activeTab === 'patterns' ? 'border-brand-primary text-brand-primary font-bold' : 'border-transparent text-text-muted hover:text-text-primary'"
          @click="activeTab = 'patterns'"
        >
          <UIcon name="lucide:blocks" class="w-4 h-4" />
          <span>Block Patterns</span>
        </button>

        <button
          type="button"
          class="pb-3 border-b-2 font-mono text-xs transition-colors cursor-pointer flex items-center gap-2 whitespace-nowrap"
          :class="activeTab === 'bridge' ? 'border-brand-primary text-brand-primary font-bold' : 'border-transparent text-text-muted hover:text-text-primary'"
          @click="activeTab = 'bridge'"
        >
          <UIcon name="lucide:sparkles" class="w-4 h-4" />
          <span>WCAG AAA Bridge</span>
        </button>
      </nav>
    </div>

    <!-- TAB 1: KADENCE CHILD THEME -->
    <div v-if="activeTab === 'child-theme'" class="space-y-6">
      <div class="p-5 rounded-xl border border-surface-border bg-surface-card space-y-4">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 class="text-base font-bold text-text-primary flex items-center gap-2">
              <UIcon name="lucide:folder-git-2" class="w-4 h-4 text-brand-primary" />
              <span>Turnkey Child Theme (<code>kadence-child-tti</code>)</span>
            </h2>
            <p class="text-xs text-text-secondary mt-1">
              Located at <code>packages/wordpress/kadence-child-tti/</code>. Injects official TTI Maroon, 0px button geometry, and WCAG AAA tokens.
            </p>
          </div>

          <NuxtLink
            to="/examples/portal-shell"
            class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-medium rounded-lg border border-surface-border bg-surface-raised hover:bg-surface-sunken text-text-primary transition-colors shrink-0"
          >
            <UIcon name="lucide:eye" class="w-3.5 h-3.5 text-brand-primary" />
            <span>Portal Preview</span>
          </NuxtLink>
        </div>

        <!-- Highlights Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
          <div class="p-3 rounded-lg border border-surface-border bg-surface-sunken">
            <span class="text-brand-primary font-semibold text-xs font-mono block mb-1">Global Palette</span>
            <p class="text-xs text-text-muted">Maroon (<code>#500000</code>) and Gold (<code>#CFA935</code>) customizer presets.</p>
          </div>
          <div class="p-3 rounded-lg border border-surface-border bg-surface-sunken">
            <span class="text-brand-primary font-semibold text-xs font-mono block mb-1">0px Geometry</span>
            <p class="text-xs text-text-muted">Sharp rectangular buttons with 44px touch targets.</p>
          </div>
          <div class="p-3 rounded-lg border border-surface-border bg-surface-sunken">
            <span class="text-brand-primary font-semibold text-xs font-mono block mb-1">Utility Bar</span>
            <p class="text-xs text-text-muted">Automated <code>kadence_before_header</code> institutional links.</p>
          </div>
          <div class="p-3 rounded-lg border border-surface-border bg-surface-sunken">
            <span class="text-emerald-600 dark:text-emerald-400 font-semibold text-xs font-mono block mb-1">WCAG 2.2 AAA</span>
            <p class="text-xs text-text-muted">Enqueues <code>tux-bridge.css</code> for 7:1 contrast.</p>
          </div>
        </div>
      </div>

      <!-- Quick Deployment -->
      <div class="p-4 rounded-xl border border-surface-border bg-surface-sunken/40 space-y-3">
        <h3 class="text-xs font-mono font-bold uppercase tracking-wider text-text-muted flex items-center gap-2">
          <UIcon name="lucide:terminal" class="w-3.5 h-3.5 text-brand-primary" />
          <span>Quick Deployment</span>
        </h3>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div class="p-3 rounded-lg bg-surface-card border border-surface-border space-y-1.5">
            <h4 class="font-bold text-text-primary">Admin Upload</h4>
            <ol class="list-decimal list-inside space-y-1 text-text-muted">
              <li>Zip directory: <code>zip -r kadence-child-tti.zip packages/wordpress/kadence-child-tti</code></li>
              <li>Navigate to <strong>Appearance &rarr; Themes &rarr; Add New &rarr; Upload</strong>.</li>
              <li>Upload <code>kadence-child-tti.zip</code> and activate.</li>
            </ol>
          </div>

          <div class="p-3 rounded-lg bg-surface-card border border-surface-border space-y-1.5">
            <h4 class="font-bold text-text-primary">WP-CLI Deploy</h4>
            <div class="font-mono bg-surface-sunken p-2 rounded border border-surface-border text-text-primary space-y-1">
              <p>cp -r packages/wordpress/kadence-child-tti /var/www/wp-content/themes/</p>
              <p>wp theme activate kadence-child-tti</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Child Theme Source Viewer -->
      <div class="space-y-3">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 class="text-sm font-semibold text-text-primary flex items-center gap-2">
            <UIcon name="lucide:file-code" class="w-4 h-4 text-brand-primary" />
            <span>Theme Source Code</span>
          </h3>

          <div class="flex items-center gap-1 bg-surface-sunken p-1 rounded-lg border border-surface-border text-xs font-mono shrink-0">
            <button
              type="button"
              class="px-2.5 py-1 rounded transition-colors cursor-pointer"
              :class="activeCodeFile === 'functions' ? 'bg-surface-raised text-text-primary font-bold shadow-xs' : 'text-text-muted hover:text-text-primary'"
              @click="activeCodeFile = 'functions'"
            >
              functions.php
            </button>
            <button
              type="button"
              class="px-2.5 py-1 rounded transition-colors cursor-pointer"
              :class="activeCodeFile === 'style' ? 'bg-surface-raised text-text-primary font-bold shadow-xs' : 'text-text-muted hover:text-text-primary'"
              @click="activeCodeFile = 'style'"
            >
              style.css
            </button>
            <button
              type="button"
              class="px-2.5 py-1 rounded transition-colors cursor-pointer"
              :class="activeCodeFile === 'theme' ? 'bg-surface-raised text-text-primary font-bold shadow-xs' : 'text-text-muted hover:text-text-primary'"
              @click="activeCodeFile = 'theme'"
            >
              theme.json
            </button>
          </div>
        </div>

        <div v-if="activeCodeFile === 'functions'" class="relative min-w-0 max-w-full">
          <button
            type="button"
            class="absolute right-3 top-3 z-10 inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono font-medium rounded bg-surface-raised/90 border border-surface-border text-text-primary hover:bg-surface-sunken cursor-pointer transition-colors"
            @click="copyFunctions(functionsPhpSnippet)"
          >
            <UIcon :name="copiedFunctions ? 'lucide:check' : 'lucide:copy'" class="w-3.5 h-3.5" :class="{ 'text-emerald-500': copiedFunctions }" />
            <span>{{ copiedFunctions ? "Copied!" : "Copy" }}</span>
          </button>
          <TuxCodeBlock :code="functionsPhpSnippet" language="php" filename="functions.php" />
        </div>

        <div v-else-if="activeCodeFile === 'style'" class="relative min-w-0 max-w-full">
          <button
            type="button"
            class="absolute right-3 top-3 z-10 inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono font-medium rounded bg-surface-raised/90 border border-surface-border text-text-primary hover:bg-surface-sunken cursor-pointer transition-colors"
            @click="copyStyle(styleCssSnippet)"
          >
            <UIcon :name="copiedStyle ? 'lucide:check' : 'lucide:copy'" class="w-3.5 h-3.5" :class="{ 'text-emerald-500': copiedStyle }" />
            <span>{{ copiedStyle ? "Copied!" : "Copy" }}</span>
          </button>
          <TuxCodeBlock :code="styleCssSnippet" language="css" filename="style.css" />
        </div>

        <div v-else-if="activeCodeFile === 'theme'" class="relative min-w-0 max-w-full">
          <button
            type="button"
            class="absolute right-3 top-3 z-10 inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono font-medium rounded bg-surface-raised/90 border border-surface-border text-text-primary hover:bg-surface-sunken cursor-pointer transition-colors"
            @click="copyThemeJson(themeJsonSnippet)"
          >
            <UIcon :name="copiedThemeJson ? 'lucide:check' : 'lucide:copy'" class="w-3.5 h-3.5" :class="{ 'text-emerald-500': copiedThemeJson }" />
            <span>{{ copiedThemeJson ? "Copied!" : "Copy" }}</span>
          </button>
          <TuxCodeBlock :code="themeJsonSnippet" language="json" filename="theme.json" />
        </div>
      </div>
    </div>

    <!-- TAB 2: TTI-UX CORE PLUGIN -->
    <div v-else-if="activeTab === 'plugin'" class="space-y-6">
      <div class="p-5 rounded-xl border border-surface-border bg-surface-card space-y-4">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 class="text-base font-bold text-text-primary flex items-center gap-2">
              <UIcon name="lucide:plug" class="w-4 h-4 text-brand-primary" />
              <span>TTI-UX Core Plugin</span>
            </h2>
            <p class="text-xs text-text-secondary mt-1">
              Universal plugin enabling web component runtimes, shortcodes, and block patterns across any theme.
            </p>
          </div>
          <TuxBadge tone="brand" variant="outline" class="font-mono text-xs shrink-0">v3.0.0 Standard</TuxBadge>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
          <div class="p-3 rounded-lg bg-surface-sunken border border-surface-border space-y-1">
            <h4 class="font-bold text-xs font-mono text-text-primary">1. Activate</h4>
            <p class="text-xs text-text-muted">Place <code>packages/wordpress/tti-ux-core</code> in <code>wp-content/plugins/</code>.</p>
          </div>
          <div class="p-3 rounded-lg bg-surface-sunken border border-surface-border space-y-1">
            <h4 class="font-bold text-xs font-mono text-text-primary">2. Auto-Enqueue</h4>
            <p class="text-xs text-text-muted">Loads Roboto font, CSS tokens, WCAG bridge, and custom elements runtime.</p>
          </div>
          <div class="p-3 rounded-lg bg-surface-sunken border border-surface-border space-y-1">
            <h4 class="font-bold text-xs font-mono text-text-primary">3. Host Agnostic</h4>
            <p class="text-xs text-text-muted">Runs across Gutenberg, Classic Editor, Elementor, and custom PHP templates.</p>
          </div>
        </div>
      </div>

      <!-- Shortcode Explorer -->
      <div class="p-4 rounded-xl border border-surface-border bg-surface-sunken/40 space-y-3">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h3 class="text-xs font-mono font-bold uppercase tracking-wider text-text-muted flex items-center gap-2">
            <UIcon name="lucide:code-2" class="w-3.5 h-3.5 text-brand-primary" />
            <span>Shortcode Directory</span>
          </h3>
          <span class="text-[11px] text-text-muted">Select shortcode to view parameters and preview output</span>
        </div>

        <!-- Selector Buttons -->
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
          <button
            v-for="(meta, key) in shortcodes"
            :key="key"
            type="button"
            class="p-2 rounded-lg border text-center text-xs font-mono transition-all cursor-pointer truncate"
            :class="selectedShortcode === key ? 'border-brand-primary bg-brand-primary/10 text-brand-primary font-bold shadow-xs' : 'border-surface-border bg-surface-card text-text-muted hover:text-text-primary'"
            @click="selectedShortcode = key as any"
          >
            [tux_{{ key }}]
          </button>
        </div>

        <!-- Shortcode Output Card -->
        <div class="p-4 rounded-lg bg-surface-card border border-surface-border space-y-3">
          <div class="flex items-center justify-between gap-2">
            <h4 class="font-bold text-sm text-text-primary truncate">{{ shortcodes[selectedShortcode].title }}</h4>
            <button
              type="button"
              class="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-mono font-medium rounded bg-surface-sunken border border-surface-border text-text-primary hover:bg-surface-raised cursor-pointer transition-colors shrink-0"
              @click="copyShortcode(shortcodes[selectedShortcode].tag)"
            >
              <UIcon :name="copiedShortcode ? 'lucide:check' : 'lucide:copy'" class="w-3 h-3" :class="{ 'text-emerald-500': copiedShortcode }" />
              <span>{{ copiedShortcode ? "Copied" : "Copy" }}</span>
            </button>
          </div>

          <p class="text-xs text-text-secondary">{{ shortcodes[selectedShortcode].description }}</p>

          <div class="font-mono text-xs bg-surface-sunken p-2.5 rounded border border-surface-border text-brand-primary overflow-x-auto select-all">
            {{ shortcodes[selectedShortcode].tag }}
          </div>

          <!-- Output Preview -->
          <div class="pt-2 border-t border-surface-border">
            <p class="text-[10px] font-mono text-text-muted uppercase tracking-wider mb-2">Rendered Preview</p>

            <div v-if="selectedShortcode === 'portal'" class="rounded border border-surface-border overflow-hidden">
              <aside class="bg-[#500000] text-white px-3 py-1.5 text-xs font-medium flex flex-wrap justify-between items-center gap-2">
                <span class="font-semibold text-xs">Texas A&amp;M Transportation Institute &nearr;</span>
                <nav class="flex gap-2.5 text-[11px] opacity-90">
                  <span>Jobs</span>
                  <span>Pressroom</span>
                  <span>Directory</span>
                  <span>Contact</span>
                </nav>
              </aside>
            </div>

            <div v-else-if="selectedShortcode === 'stat'" class="p-3 bg-surface-sunken rounded border border-surface-border flex items-baseline gap-2">
              <span class="text-2xl font-extrabold text-brand-primary font-mono">650+</span>
              <span class="text-xs text-text-muted font-mono">Active Connected Testbeds</span>
            </div>

            <div v-else-if="selectedShortcode === 'heading'">
              <h2 class="text-lg font-bold text-[#500000] pb-1.5 border-b-2 border-[#CFA935]">
                Connected Corridors Research
              </h2>
            </div>

            <div v-else-if="selectedShortcode === 'alert'">
              <TuxAlert variant="warning" title="Operations Advisory">
                Corridor sensing test in progress on FM-2818.
              </TuxAlert>
            </div>

            <div v-else-if="selectedShortcode === 'card'">
              <TuxCard padded class="max-w-md">
                <p class="text-xs font-mono uppercase text-[#500000] font-bold">Program Area</p>
                <h3 class="text-sm font-bold text-text-primary mt-0.5">Crash Analysis Program</h3>
                <p class="text-xs text-text-muted mt-0.5">Evaluating collision mitigation algorithms on high-speed rural corridors.</p>
              </TuxCard>
            </div>

            <div v-else-if="selectedShortcode === 'staleness'">
              <div class="p-2.5 bg-amber-500/10 border-l-4 border-[#CFA935] text-xs text-text-primary">
                <strong>Notice:</strong> Audited 2026-09-01 by Mobility Analysis Division.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- TAB 3: GUTENBERG BLOCK PATTERNS -->
    <div v-if="activeTab === 'patterns'" class="space-y-6">
      <div class="p-5 rounded-xl border border-surface-border bg-surface-card space-y-2">
        <h2 class="text-base font-bold text-text-primary flex items-center gap-2">
          <UIcon name="lucide:blocks" class="w-4 h-4 text-brand-primary" />
          <span>Gutenberg Block Patterns</span>
        </h2>
        <p class="text-xs text-text-secondary leading-relaxed">
          Pre-assembled block layouts available under <strong>Patterns &rarr; TTI Design System (TUX 3.0)</strong>.
          Complies with TTI Communications guidelines and WCAG 2.2 AAA contrast standards.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Pattern 1 -->
        <div class="p-4 rounded-xl border border-surface-border bg-surface-card space-y-2.5">
          <div class="flex items-center justify-between gap-2">
            <h3 class="font-bold text-xs text-text-primary truncate">1. Research Hero &amp; Stats</h3>
            <span class="text-[10px] font-mono px-1.5 py-0.5 rounded bg-surface-sunken text-text-muted shrink-0">tti-ux/research-hero</span>
          </div>
          <div class="p-3 bg-surface-sunken rounded border border-surface-border space-y-2 text-xs">
            <h4 class="text-sm font-bold text-[#500000] pb-1 border-b-2 border-[#CFA935]">Autonomous Corridors</h4>
            <div class="grid grid-cols-3 gap-2 pt-1 text-center">
              <div class="p-1.5 bg-surface-card rounded border border-surface-border">
                <span class="text-sm font-bold font-mono text-[#500000]">650+</span>
                <p class="text-[10px] text-text-muted">Testbeds</p>
              </div>
              <div class="p-1.5 bg-surface-card rounded border border-surface-border">
                <span class="text-sm font-bold font-mono text-[#CFA935]">99.4%</span>
                <p class="text-[10px] text-text-muted">PDR</p>
              </div>
              <div class="p-1.5 bg-surface-card rounded border border-surface-border">
                <span class="text-sm font-bold font-mono text-text-primary">42 mi</span>
                <p class="text-[10px] text-text-muted">Freeway</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Pattern 2 -->
        <div class="p-4 rounded-xl border border-surface-border bg-surface-card space-y-2.5">
          <div class="flex items-center justify-between gap-2">
            <h3 class="font-bold text-xs text-text-primary truncate">2. Telemetry Grid</h3>
            <span class="text-[10px] font-mono px-1.5 py-0.5 rounded bg-surface-sunken text-text-muted shrink-0">tti-ux/telemetry-table</span>
          </div>
          <div class="overflow-x-auto rounded border border-surface-border text-xs min-w-0 max-w-full">
            <table class="w-full text-left">
              <thead class="bg-[#500000] text-white border-b-2 border-[#CFA935]">
                <tr>
                  <th class="p-1.5 font-bold">Station</th>
                  <th class="p-1.5 font-bold">County</th>
                  <th class="p-1.5 font-bold text-right">Mean Speed</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-surface-border bg-surface-card">
                <tr>
                  <td class="p-1.5 font-semibold text-[#500000]">IH-35 Seg 4A</td>
                  <td class="p-1.5 text-text-muted">Travis</td>
                  <td class="p-1.5 text-right font-mono">64.8 mph</td>
                </tr>
                <tr class="bg-surface-sunken/40">
                  <td class="p-1.5 font-semibold text-[#500000]">IH-10 West</td>
                  <td class="p-1.5 text-text-muted">Harris</td>
                  <td class="p-1.5 text-right font-mono">58.2 mph</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Pattern 3 -->
        <div class="p-4 rounded-xl border border-surface-border bg-surface-card space-y-2.5">
          <div class="flex items-center justify-between gap-2">
            <h3 class="font-bold text-xs text-text-primary truncate">3. Center Focus Areas</h3>
            <span class="text-[10px] font-mono px-1.5 py-0.5 rounded bg-surface-sunken text-text-muted shrink-0">tti-ux/center-grid</span>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <div class="p-2.5 bg-surface-sunken rounded border border-surface-border">
              <p class="text-[9px] uppercase font-bold text-[#500000]">Program</p>
              <h5 class="font-bold text-text-primary">Roadway Safety</h5>
              <span class="inline-block mt-1.5 bg-[#500000] text-white px-2 py-0.5 text-[9px] font-semibold">View Program &rarr;</span>
            </div>
            <div class="p-2.5 bg-surface-sunken rounded border border-surface-border">
              <p class="text-[9px] uppercase font-bold text-[#500000]">Program</p>
              <h5 class="font-bold text-text-primary">Connected Vehicles</h5>
              <span class="inline-block mt-1.5 bg-[#500000] text-white px-2 py-0.5 text-[9px] font-semibold">View Program &rarr;</span>
            </div>
          </div>
        </div>

        <!-- Pattern 4 -->
        <div class="p-4 rounded-xl border border-surface-border bg-surface-card space-y-2.5">
          <div class="flex items-center justify-between gap-2">
            <h3 class="font-bold text-xs text-text-primary truncate">4. Executive Factsheet</h3>
            <span class="text-[10px] font-mono px-1.5 py-0.5 rounded bg-surface-sunken text-text-muted shrink-0">tti-ux/executive-factsheet</span>
          </div>
          <div class="p-2.5 bg-surface-sunken rounded border border-surface-border border-l-4 border-l-[#CFA935] space-y-1 text-xs">
            <p class="text-[9px] uppercase font-bold text-[#500000]">Policy Brief</p>
            <h5 class="font-bold text-text-primary">Intersections Evaluation</h5>
            <p class="text-text-muted text-[11px]">Field tests demonstrated 34% reduction in conflicting movements.</p>
          </div>
        </div>
      </div>
    </div>

    <!-- TAB 4: INSTANT WCAG AAA BRIDGE -->
    <div v-if="activeTab === 'bridge'" class="space-y-6">
      <div class="p-5 rounded-xl border border-surface-border bg-surface-card space-y-4">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 class="text-base font-bold text-text-primary flex items-center gap-2">
              <UIcon name="lucide:sparkles" class="w-4 h-4 text-emerald-500" />
              <span>Instant WCAG 2.2 AAA Modernization Bridge</span>
            </h2>
            <p class="text-xs text-text-secondary mt-1">
              Retrofit any existing TTI WordPress site in 60 seconds without switching themes or modifying template PHP files.
            </p>
          </div>
          <TuxBadge tone="success" variant="soft" class="font-mono text-xs shrink-0">Zero-JS CSS Drop-In</TuxBadge>
        </div>

        <div class="space-y-2 pt-1">
          <div class="flex items-center justify-between">
            <h3 class="text-xs font-mono font-bold uppercase tracking-wider text-text-muted">
              Appearance &rarr; Customize &rarr; Additional CSS
            </h3>
            <button
              type="button"
              class="inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-mono font-medium rounded bg-surface-sunken border border-surface-border text-text-primary hover:bg-surface-raised cursor-pointer transition-colors"
              @click="copyBridge(bridgeImportSnippet)"
            >
              <UIcon :name="copiedBridge ? 'lucide:check' : 'lucide:copy'" class="w-3 h-3" :class="{ 'text-emerald-500': copiedBridge }" />
              <span>{{ copiedBridge ? "Copied" : "Copy" }}</span>
            </button>
          </div>

          <TuxCodeBlock :code="bridgeImportSnippet" language="css" filename="Additional CSS" />
        </div>

        <!-- Before & After Comparison Link -->
        <div class="p-3.5 rounded-lg bg-surface-sunken border border-surface-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h4 class="font-bold text-xs text-text-primary">Forensic Side-by-Side Comparison</h4>
            <p class="text-xs text-text-muted">Inspect the interactive before/after SCTQS showcase with real-time WCAG 2.2 AAA meter.</p>
          </div>
          <NuxtLink
            to="/examples/legacy-bridge"
            class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-medium rounded-lg bg-brand-primary text-white hover:bg-brand-primary-deep transition-colors shrink-0"
          >
            <span>Open Legacy Bridge Showcase</span>
            <UIcon name="lucide:arrow-right" class="w-3.5 h-3.5" />
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>
