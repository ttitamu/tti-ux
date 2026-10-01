<script setup lang="ts">
import { ref } from "vue";
import { useTuxClipboard } from "~/composables/useTuxClipboard";

useHead({ title: "Turnkey WordPress Integration · TTI-UX 3.0" });

const activeTab = ref<"child-theme" | "plugin" | "patterns" | "bridge">("child-theme");

const { copied: copiedFunctions, copy: copyFunctions } = useTuxClipboard();
const { copied: copiedStyle, copy: copyStyle } = useTuxClipboard();
const { copied: copiedThemeJson, copy: copyThemeJson } = useTuxClipboard();
const { copied: copiedShortcode, copy: copyShortcode } = useTuxClipboard();
const { copied: copiedPattern, copy: copyPattern } = useTuxClipboard();
const { copied: copiedBridge, copy: copyBridge } = useTuxClipboard();

// Active Child Theme Code File Tab
const activeCodeFile = ref<"functions" | "style" | "theme">("functions");

const functionsPhpSnippet = `<?php
/**
 * Functions and definitions for TTI Kadence Child Theme.
 *
 * @package Kadence_Child_TTI
 * @version 3.0.0
 */

if (!defined('ABSPATH')) {
    exit;
}

define('TTI_KADENCE_CHILD_VERSION', '3.0.0');

/**
 * Enqueue parent and child stylesheets, TUX canonical tokens, and WCAG AAA bridge.
 */
function tti_kadence_child_enqueue_scripts() {
    // 1. Parent Kadence stylesheet
    wp_enqueue_style(
        'kadence-parent-style',
        get_template_directory_uri() . '/style.css',
        array(),
        wp_get_theme()->parent() ? wp_get_theme()->parent()->get('Version') : TTI_KADENCE_CHILD_VERSION
    );

    // 2. Child theme stylesheet
    wp_enqueue_style(
        'kadence-child-tti-style',
        get_stylesheet_directory_uri() . '/style.css',
        array('kadence-parent-style'),
        TTI_KADENCE_CHILD_VERSION
    );

    // 3. TTI-UX Canonical Design Tokens (CSS Custom Properties)
    wp_enqueue_style(
        'tux-tokens',
        'https://cdn.jsdelivr.net/gh/ttitamu/tti-ux@v3.0.0/kit/css/tux-tokens.css',
        array(),
        TTI_KADENCE_CHILD_VERSION
    );

    // 4. TTI-UX WCAG 2.2 Level AAA Modernization Bridge
    wp_enqueue_style(
        'tux-bridge',
        'https://cdn.jsdelivr.net/gh/ttitamu/tti-ux@v3.0.0/kit/css/tux-bridge.css',
        array('tux-tokens'),
        TTI_KADENCE_CHILD_VERSION
    );

    // 5. TTI Web Components Runtime (custom elements)
    wp_enqueue_script(
        'tux-elements',
        'https://cdn.jsdelivr.net/gh/ttitamu/tti-ux@v3.0.0/packages/elements/dist/tux-elements.js',
        array(),
        TTI_KADENCE_CHILD_VERSION,
        array('strategy' => 'defer', 'in_footer' => true)
    );
}
add_action('wp_enqueue_scripts', 'tti_kadence_child_enqueue_scripts', 20);

/**
 * Configure Kadence Global Palette with official TTI Communications & Marketing brand values.
 */
function tti_kadence_child_global_palette($palette) {
    if (!is_array($palette)) {
        $palette = array();
    }

    $tti_colors = array(
        0 => array('color' => '#500000', 'name' => __('TTI Maroon (Primary)', 'kadence-child-tti'), 'slug' => 'theme-palette1'),
        1 => array('color' => '#3C0000', 'name' => __('Deep Maroon (Primary Deep)', 'kadence-child-tti'), 'slug' => 'theme-palette2'),
        2 => array('color' => '#CFA935', 'name' => __('Institutional Gold (Accent)', 'kadence-child-tti'), 'slug' => 'theme-palette3'),
        3 => array('color' => '#221F1F', 'name' => __('Reading Charcoal (Text Primary)', 'kadence-child-tti'), 'slug' => 'theme-palette4'),
        4 => array('color' => '#374151', 'name' => __('Secondary Slate (Text Muted)', 'kadence-child-tti'), 'slug' => 'theme-palette5'),
        5 => array('color' => '#E5E7EB', 'name' => __('Border Gray (Surface Border)', 'kadence-child-tti'), 'slug' => 'theme-palette6'),
        6 => array('color' => '#F9FAFB', 'name' => __('Sunken Canvas (Surface Sunken)', 'kadence-child-tti'), 'slug' => 'theme-palette7'),
        7 => array('color' => '#FFFFFF', 'name' => __('White Canvas (Surface Page)', 'kadence-child-tti'), 'slug' => 'theme-palette8'),
        8 => array('color' => '#FFFFFF', 'name' => __('Pure White (Surface Raised)', 'kadence-child-tti'), 'slug' => 'theme-palette9'),
    );

    foreach ($tti_colors as $index => $color_info) {
        $palette[$index] = $color_info;
    }

    return $palette;
}
add_filter('kadence_global_palette', 'tti_kadence_child_global_palette', 20);

/**
 * Render Tier 1 Institutional Utility Bar above the Kadence header.
 */
function tti_kadence_render_utility_bar() {
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
}
add_action('kadence_before_header', 'tti_kadence_render_utility_bar', 5);`;

const styleCssSnippet = `/*
Theme Name: TTI Kadence Child Theme
Theme URI: https://code.tti.tamu.edu/tti/tti-ux
Description: Official Texas A&M Transportation Institute (TTI) Child Theme for Kadence.
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

/* 0px Sharp Rectangular Button Profile */
.wp-block-button__link,
.kt-button,
button.wp-block-search__button,
input[type="submit"] {
  border-radius: 0px !important;
  font-weight: 600 !important;
  min-height: 44px !important;
  padding: 10px 24px !important;
}

/* TTI Signature Heading Rhythm with Gold Underline */
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

// Selected Shortcode Preview State
const selectedShortcode = ref<"stat" | "alert" | "portal" | "heading" | "card" | "staleness">("portal");

const shortcodes = {
  portal: {
    title: "Institutional Two-Tier Portal Bar",
    tag: '[tux_portal_header agency="Texas A&M Transportation Institute" search="true"]',
    description: "Renders the Tier 1 utility bar with official TTI agency link, utility links (Jobs, Pressroom, Directory, Contact), and search trigger.",
  },
  stat: {
    title: "BigStat Metric Fact",
    tag: '[tux_stat value="650" suffix="+" label="Active Connected Testbeds" tone="maroon" size="md"]',
    description: "Displays a large numerical metric with tabular numerals, label, and official maroon/gold accent tones.",
  },
  heading: {
    title: "Signature TTI Heading with Gold Rule",
    tag: '[tux_heading title="Connected Corridors Research" level="2"]',
    description: "Emits a semantic <h2> header in Maroon with the official 2px Warm Gold underline keyline.",
  },
  alert: {
    title: "Advisory & Feedback Alert",
    tag: '[tux_alert variant="warning" title="Operations Advisory"]Corridor sensing test in progress on FM-2818.[/tux_alert]',
    description: "Emits a WCAG 2.2 AAA compliant alert callout banner with 7:1 contrast.",
  },
  card: {
    title: "Focus Area Card Container",
    tag: '[tux_card to="/safety" padded="true"]<h3>Crash Analysis Program</h3><p>Collision mitigation.</p>[/tux_card]',
    description: "Container card with rectangular geometry and subtle hover elevation.",
  },
  staleness: {
    title: "Dataset Staleness Notice",
    tag: '[tux_staleness stale="true" date="2026-09-01" owner="Mobility Analysis Division"]',
    description: "Renders a metadata freshness advisory alerting researchers when data was last audited.",
  },
};

const bridgeImportSnippet = `/* In WordPress Admin: Appearance -> Customize -> Additional CSS */
@import url('https://cdn.jsdelivr.net/gh/ttitamu/tti-ux@v3.0.0/kit/css/tux-tokens.css');
@import url('https://cdn.jsdelivr.net/gh/ttitamu/tti-ux@v3.0.0/kit/css/tux-bridge.css');

/* All tables, forms, buttons, and headings immediately adopt 2026 TTI Comm styles & WCAG AAA */`;
</script>

<template>
  <div class="space-y-8 pb-16">
    <TuxBreadcrumbs :trail="[{ label: 'Home', to: '/' }, { label: 'Install', to: '/install' }, { label: 'WordPress' }]" />

    <!-- Page Header -->
    <div class="flex flex-col md:flex-row md:items-start justify-between gap-4">
      <TuxPageHeader eyebrow="Distribution · WordPress" title="Turnkey WordPress & Kadence Integration">
        The official Texas A&amp;M Transportation Institute design system for WordPress. Provides turnkey Kadence child themes,
        v3.0 Gutenberg block patterns, WCAG 2.2 Level AAA styling, and drop-in shortcodes.
      </TuxPageHeader>

      <div class="flex items-center gap-2 shrink-0 pt-2">
        <TuxBadge tone="success" variant="soft" class="font-mono text-xs">
          <UIcon name="lucide:shield-check" class="w-3.5 h-3.5 inline mr-1 text-emerald-500" />
          WCAG 2.2 AAA Certified
        </TuxBadge>
        <TuxBadge tone="brand" variant="soft" class="font-mono text-xs">
          Kadence Parity
        </TuxBadge>
      </div>
    </div>

    <!-- Navigation Tabs -->
    <div class="border-b border-surface-border">
      <nav class="flex space-x-6 text-sm font-medium" aria-label="WordPress Integration Tabs">
        <button
          type="button"
          class="pb-3 border-b-2 font-mono text-xs transition-colors cursor-pointer flex items-center gap-2"
          :class="activeTab === 'child-theme' ? 'border-brand-primary text-brand-primary font-bold' : 'border-transparent text-text-muted hover:text-text-primary'"
          @click="activeTab = 'child-theme'"
        >
          <UIcon name="lucide:layout-template" class="w-4 h-4" />
          <span>Kadence Child Theme</span>
        </button>

        <button
          type="button"
          class="pb-3 border-b-2 font-mono text-xs transition-colors cursor-pointer flex items-center gap-2"
          :class="activeTab === 'plugin' ? 'border-brand-primary text-brand-primary font-bold' : 'border-transparent text-text-muted hover:text-text-primary'"
          @click="activeTab = 'plugin'"
        >
          <UIcon name="lucide:plug" class="w-4 h-4" />
          <span>TTI-UX Core Plugin (v3.0)</span>
        </button>

        <button
          type="button"
          class="pb-3 border-b-2 font-mono text-xs transition-colors cursor-pointer flex items-center gap-2"
          :class="activeTab === 'patterns' ? 'border-brand-primary text-brand-primary font-bold' : 'border-transparent text-text-muted hover:text-text-primary'"
          @click="activeTab = 'patterns'"
        >
          <UIcon name="lucide:blocks" class="w-4 h-4" />
          <span>Gutenberg Block Patterns</span>
        </button>

        <button
          type="button"
          class="pb-3 border-b-2 font-mono text-xs transition-colors cursor-pointer flex items-center gap-2"
          :class="activeTab === 'bridge' ? 'border-brand-primary text-brand-primary font-bold' : 'border-transparent text-text-muted hover:text-text-primary'"
          @click="activeTab = 'bridge'"
        >
          <UIcon name="lucide:sparkles" class="w-4 h-4" />
          <span>Instant WCAG AAA Bridge</span>
        </button>
      </nav>
    </div>

    <!-- TAB 1: KADENCE CHILD THEME -->
    <div v-if="activeTab === 'child-theme'" class="space-y-6">
      <div class="p-6 rounded-xl border border-surface-border bg-surface-card space-y-4">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 class="text-lg font-bold text-text-primary flex items-center gap-2">
              <UIcon name="lucide:folder-git-2" class="w-5 h-5 text-brand-primary" />
              <span>Turnkey Kadence Child Theme (<code>kadence-child-tti</code>)</span>
            </h2>
            <p class="text-sm text-text-muted mt-1">
              Ready-to-deploy child theme located at <code>packages/wordpress/kadence-child-tti/</code>.
              Pre-wires all official TTI Communications branding, 0px button geometry, and WCAG 2.2 AAA tokens.
            </p>
          </div>

          <div class="flex items-center gap-2">
            <NuxtLink
              to="/examples/portal-shell"
              class="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-mono font-medium rounded-lg border border-surface-border bg-surface-raised hover:bg-surface-sunken text-text-primary transition-colors"
            >
              <UIcon name="lucide:eye" class="w-3.5 h-3.5 text-brand-primary" />
              <span>Live Portal Preview</span>
            </NuxtLink>
          </div>
        </div>

        <!-- Child Theme Highlights Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          <div class="p-3.5 rounded-lg border border-surface-border bg-surface-sunken">
            <div class="flex items-center gap-2 text-brand-primary font-semibold text-xs font-mono">
              <span class="w-3 h-3 rounded-full bg-[#500000]" />
              <span>Kadence Palette Hook</span>
            </div>
            <p class="text-xs text-text-muted mt-1.5">
              Injects Maroon (<code>#500000</code>), Deep Maroon (<code>#3C0000</code>), and Warm Gold (<code>#CFA935</code>) into the customizer.
            </p>
          </div>

          <div class="p-3.5 rounded-lg border border-surface-border bg-surface-sunken">
            <div class="flex items-center gap-2 text-brand-primary font-semibold text-xs font-mono">
              <UIcon name="lucide:square" class="w-3.5 h-3.5 text-brand-primary" />
              <span>0px Button Geometry</span>
            </div>
            <p class="text-xs text-text-muted mt-1.5">
              Overrides Kadence global button settings with 0px sharp rectangular corners and 44px min touch targets.
            </p>
          </div>

          <div class="p-3.5 rounded-lg border border-surface-border bg-surface-sunken">
            <div class="flex items-center gap-2 text-brand-primary font-semibold text-xs font-mono">
              <UIcon name="lucide:menu" class="w-3.5 h-3.5 text-brand-primary" />
              <span>Tier 1 Utility Bar</span>
            </div>
            <p class="text-xs text-text-muted mt-1.5">
              Automatically hooks into <code>kadence_before_header</code> to render the maroon institutional top navigation.
            </p>
          </div>

          <div class="p-3.5 rounded-lg border border-surface-border bg-surface-sunken">
            <div class="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold text-xs font-mono">
              <UIcon name="lucide:shield-check" class="w-3.5 h-3.5 text-emerald-500" />
              <span>WCAG 2.2 AAA Bridge</span>
            </div>
            <p class="text-xs text-text-muted mt-1.5">
              Enqueues <code>tux-bridge.css</code> guaranteeing 7:1 contrast, 44px targets, and 3px dual-ring focus appearance.
            </p>
          </div>
        </div>
      </div>

      <!-- Installation Instructions -->
      <div class="p-5 rounded-xl border border-surface-border bg-surface-sunken/40 space-y-4">
        <h3 class="text-sm font-semibold text-text-primary flex items-center gap-2">
          <UIcon name="lucide:terminal" class="w-4 h-4 text-brand-primary" />
          <span>Quick Deployment (1 Minute Setup)</span>
        </h3>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div class="p-4 rounded-lg bg-surface-card border border-surface-border space-y-2">
            <h4 class="font-bold text-text-primary">Option A: WordPress Admin Upload</h4>
            <ol class="list-decimal list-inside space-y-1 text-text-muted">
              <li>Ensure the parent theme <strong>Kadence</strong> is installed in <code>Appearance -> Themes</code>.</li>
              <li>Zip the child theme directory: <code>zip -r kadence-child-tti.zip packages/wordpress/kadence-child-tti</code></li>
              <li>In WordPress, navigate to <strong>Appearance -> Themes -> Add New -> Upload Theme</strong>.</li>
              <li>Upload <code>kadence-child-tti.zip</code> and click <strong>Activate</strong>.</li>
            </ol>
          </div>

          <div class="p-4 rounded-lg bg-surface-card border border-surface-border space-y-2">
            <h4 class="font-bold text-text-primary">Option B: Git / WP-CLI Deploy</h4>
            <div class="font-mono bg-surface-sunken p-2.5 rounded border border-surface-border text-text-primary space-y-1">
              <p># Symlink or copy to WordPress themes dir</p>
              <p>cp -r packages/wordpress/kadence-child-tti /var/www/wp-content/themes/</p>
              <p>wp theme activate kadence-child-tti</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Child Theme Source Viewer -->
      <div class="space-y-3">
        <div class="flex items-center justify-between">
          <h3 class="text-sm font-semibold text-text-primary flex items-center gap-2">
            <UIcon name="lucide:file-code" class="w-4 h-4 text-brand-primary" />
            <span>Child Theme Source Files</span>
          </h3>

          <div class="flex items-center gap-1 bg-surface-sunken p-1 rounded-lg border border-surface-border text-xs font-mono">
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

        <div v-if="activeCodeFile === 'functions'" class="relative">
          <button
            type="button"
            class="absolute right-3 top-3 z-10 inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono font-medium rounded bg-surface-raised/90 border border-surface-border text-text-primary hover:bg-surface-sunken cursor-pointer transition-colors"
            @click="copyFunctions(functionsPhpSnippet)"
          >
            <UIcon :name="copiedFunctions ? 'lucide:check' : 'lucide:copy'" class="w-3.5 h-3.5" :class="{ 'text-emerald-500': copiedFunctions }" />
            <span>{{ copiedFunctions ? "Copied!" : "Copy functions.php" }}</span>
          </button>
          <TuxCodeBlock :code="functionsPhpSnippet" language="php" filename="functions.php" />
        </div>

        <div v-else-if="activeCodeFile === 'style'" class="relative">
          <button
            type="button"
            class="absolute right-3 top-3 z-10 inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono font-medium rounded bg-surface-raised/90 border border-surface-border text-text-primary hover:bg-surface-sunken cursor-pointer transition-colors"
            @click="copyStyle(styleCssSnippet)"
          >
            <UIcon :name="copiedStyle ? 'lucide:check' : 'lucide:copy'" class="w-3.5 h-3.5" :class="{ 'text-emerald-500': copiedStyle }" />
            <span>{{ copiedStyle ? "Copied!" : "Copy style.css" }}</span>
          </button>
          <TuxCodeBlock :code="styleCssSnippet" language="css" filename="style.css" />
        </div>

        <div v-else-if="activeCodeFile === 'theme'" class="relative">
          <button
            type="button"
            class="absolute right-3 top-3 z-10 inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono font-medium rounded bg-surface-raised/90 border border-surface-border text-text-primary hover:bg-surface-sunken cursor-pointer transition-colors"
            @click="copyThemeJson(themeJsonSnippet)"
          >
            <UIcon :name="copiedThemeJson ? 'lucide:check' : 'lucide:copy'" class="w-3.5 h-3.5" :class="{ 'text-emerald-500': copiedThemeJson }" />
            <span>{{ copiedThemeJson ? "Copied!" : "Copy theme.json" }}</span>
          </button>
          <TuxCodeBlock :code="themeJsonSnippet" language="json" filename="theme.json" />
        </div>
      </div>
    </div>

    <!-- TAB 2: TTI-UX CORE PLUGIN -->
    <div v-else-if="activeTab === 'plugin'" class="space-y-6">
      <div class="p-6 rounded-xl border border-surface-border bg-surface-card space-y-4">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-lg font-bold text-text-primary flex items-center gap-2">
              <UIcon name="lucide:plug" class="w-5 h-5 text-brand-primary" />
              <span>TTI-UX Core Plugin (v3.0.0)</span>
            </h2>
            <p class="text-sm text-text-muted mt-1">
              Universal WordPress plugin providing web component runtimes, shortcodes, and block patterns across any theme.
            </p>
          </div>
          <TuxBadge tone="brand" variant="outline" class="font-mono">v3.0.0 Standard</TuxBadge>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div class="p-4 rounded-lg bg-surface-sunken border border-surface-border space-y-1.5">
            <h4 class="font-bold text-xs font-mono text-text-primary">1. Activate Plugin</h4>
            <p class="text-xs text-text-muted">
              Copy <code>packages/wordpress/tti-ux-core</code> to <code>wp-content/plugins/</code> and activate via Plugins menu.
            </p>
          </div>
          <div class="p-4 rounded-lg bg-surface-sunken border border-surface-border space-y-1.5">
            <h4 class="font-bold text-xs font-mono text-text-primary">2. Automatic Enqueue</h4>
            <p class="text-xs text-text-muted">
              Enqueues Roboto, JetBrains Mono, <code>tux-tokens.css</code>, <code>tux-bridge.css</code>, and the Web Components engine.
            </p>
          </div>
          <div class="p-4 rounded-lg bg-surface-sunken border border-surface-border space-y-1.5">
            <h4 class="font-bold text-xs font-mono text-text-primary">3. Works Everywhere</h4>
            <p class="text-xs text-text-muted">
              Functions in the Gutenberg Block Editor, Classic Editor, Elementor, Divi, and custom PHP templates.
            </p>
          </div>
        </div>
      </div>

      <!-- Shortcode Explorer -->
      <div class="p-5 rounded-xl border border-surface-border bg-surface-sunken/40 space-y-4">
        <div class="flex items-center justify-between">
          <h3 class="text-sm font-semibold text-text-primary flex items-center gap-2">
            <UIcon name="lucide:code-2" class="w-4 h-4 text-brand-primary" />
            <span>Interactive Shortcode Reference</span>
          </h3>
          <span class="text-xs text-text-muted">Click a shortcode to inspect parameters and preview output</span>
        </div>

        <!-- Shortcode Selector Tabs -->
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          <button
            v-for="(meta, key) in shortcodes"
            :key="key"
            type="button"
            class="p-2.5 rounded-lg border text-left text-xs font-mono transition-all cursor-pointer"
            :class="selectedShortcode === key ? 'border-brand-primary bg-brand-primary/10 text-brand-primary font-bold shadow-xs' : 'border-surface-border bg-surface-card text-text-muted hover:text-text-primary'"
            @click="selectedShortcode = key as any"
          >
            [tux_{{ key }}]
          </button>
        </div>

        <!-- Shortcode Detail Card -->
        <div class="p-4 rounded-lg bg-surface-card border border-surface-border space-y-3">
          <div class="flex items-center justify-between">
            <h4 class="font-bold text-sm text-text-primary">{{ shortcodes[selectedShortcode].title }}</h4>
            <button
              type="button"
              class="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono font-medium rounded bg-surface-sunken border border-surface-border text-text-primary hover:bg-surface-raised cursor-pointer transition-colors"
              @click="copyShortcode(shortcodes[selectedShortcode].tag)"
            >
              <UIcon :name="copiedShortcode ? 'lucide:check' : 'lucide:copy'" class="w-3.5 h-3.5" :class="{ 'text-emerald-500': copiedShortcode }" />
              <span>{{ copiedShortcode ? "Copied!" : "Copy Shortcode" }}</span>
            </button>
          </div>

          <p class="text-xs text-text-muted">{{ shortcodes[selectedShortcode].description }}</p>

          <div class="font-mono text-xs bg-surface-sunken p-3 rounded border border-surface-border text-brand-primary select-all">
            {{ shortcodes[selectedShortcode].tag }}
          </div>

          <!-- Live Rendered Preview -->
          <div class="pt-2 border-t border-surface-border">
            <p class="text-[11px] font-mono text-text-muted uppercase tracking-wider mb-2">Live Web Output</p>

            <div v-if="selectedShortcode === 'portal'" class="rounded border border-surface-border overflow-hidden">
              <aside class="bg-[#500000] text-white px-4 py-2 text-xs font-medium flex justify-between items-center">
                <span class="font-semibold">Texas A&amp;M Transportation Institute &nearr;</span>
                <nav class="flex gap-3 text-[11px] opacity-90">
                  <span>Jobs</span>
                  <span>Pressroom</span>
                  <span>Directory</span>
                  <span>Contact</span>
                </nav>
              </aside>
            </div>

            <div v-else-if="selectedShortcode === 'stat'" class="p-4 bg-surface-sunken rounded border border-surface-border flex items-baseline gap-2">
              <span class="text-3xl font-extrabold text-brand-primary font-mono">650+</span>
              <span class="text-xs text-text-muted font-mono">Active Connected Testbeds</span>
            </div>

            <div v-else-if="selectedShortcode === 'heading'">
              <h2 class="text-xl font-bold text-[#500000] pb-2 border-b-2 border-[#CFA935]">
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
                <h3 class="text-base font-bold text-text-primary mt-1">Crash Analysis Program</h3>
                <p class="text-xs text-text-muted mt-1">Evaluating collision mitigation algorithms on high-speed rural corridors.</p>
              </TuxCard>
            </div>

            <div v-else-if="selectedShortcode === 'staleness'">
              <div class="p-3 bg-amber-500/10 border-l-4 border-[#CFA935] text-xs text-text-primary">
                <strong>Notice:</strong> This dataset was last audited on 2026-09-01. Maintained by Mobility Analysis Division.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- TAB 3: GUTENBERG BLOCK PATTERNS -->
    <div v-if="activeTab === 'patterns'" class="space-y-6">
      <div class="p-5 rounded-xl border border-surface-border bg-surface-card space-y-2">
        <h2 class="text-lg font-bold text-text-primary flex items-center gap-2">
          <UIcon name="lucide:blocks" class="w-5 h-5 text-brand-primary" />
          <span>Gutenberg Block Patterns</span>
        </h2>
        <p class="text-sm text-text-muted">
          Pre-assembled block layouts available in WordPress under <strong>Patterns &rarr; TTI Design System (TUX 3.0)</strong>.
          Every pattern adheres strictly to the official TTI Communications palette and WCAG 2.2 AAA standards.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Pattern 1 -->
        <div class="p-5 rounded-xl border border-surface-border bg-surface-card space-y-3">
          <div class="flex items-center justify-between">
            <h3 class="font-bold text-sm text-text-primary">1. TTI Research Hero &amp; Big Stats</h3>
            <span class="text-xs font-mono px-2 py-0.5 rounded bg-surface-sunken text-text-muted">tti-ux/research-hero</span>
          </div>
          <p class="text-xs text-text-muted">Prominent maroon hero banner with gold accent rule and 3-column metric cards.</p>
          <div class="p-4 bg-surface-sunken rounded border border-surface-border space-y-2 text-xs">
            <p class="font-bold uppercase tracking-wider text-[#500000] text-[10px]">Sponsored Research Initiative</p>
            <h4 class="text-base font-bold text-[#500000] pb-1 border-b-2 border-[#CFA935]">Autonomous Corridor Operations</h4>
            <div class="grid grid-cols-3 gap-2 pt-2 text-center">
              <div class="p-2 bg-surface-card rounded border border-surface-border">
                <span class="text-lg font-bold font-mono text-[#500000]">650+</span>
                <p class="text-[10px] text-text-muted">Testbeds</p>
              </div>
              <div class="p-2 bg-surface-card rounded border border-surface-border">
                <span class="text-lg font-bold font-mono text-[#CFA935]">99.4%</span>
                <p class="text-[10px] text-text-muted">PDR</p>
              </div>
              <div class="p-2 bg-surface-card rounded border border-surface-border">
                <span class="text-lg font-bold font-mono text-text-primary">42 mi</span>
                <p class="text-[10px] text-text-muted">Freeway</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Pattern 2 -->
        <div class="p-5 rounded-xl border border-surface-border bg-surface-card space-y-3">
          <div class="flex items-center justify-between">
            <h3 class="font-bold text-sm text-text-primary">2. TTI WCAG AAA Telemetry Grid</h3>
            <span class="text-xs font-mono px-2 py-0.5 rounded bg-surface-sunken text-text-muted">tti-ux/telemetry-table</span>
          </div>
          <p class="text-xs text-text-muted">Research telemetry table styled with Maroon header, gold keyline, and 7:1 contrast.</p>
          <div class="overflow-x-auto rounded border border-surface-border text-xs">
            <table class="w-full text-left">
              <thead class="bg-[#500000] text-white border-b-2 border-[#CFA935]">
                <tr>
                  <th class="p-2 font-bold">Station</th>
                  <th class="p-2 font-bold">County</th>
                  <th class="p-2 font-bold text-right">Mean Speed</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-surface-border bg-surface-card">
                <tr>
                  <td class="p-2 font-semibold text-[#500000]">IH-35 Seg 4A</td>
                  <td class="p-2 text-text-muted">Travis</td>
                  <td class="p-2 text-right font-mono">64.8 mph</td>
                </tr>
                <tr class="bg-surface-sunken/40">
                  <td class="p-2 font-semibold text-[#500000]">IH-10 West</td>
                  <td class="p-2 text-text-muted">Harris</td>
                  <td class="p-2 text-right font-mono">58.2 mph</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Pattern 3 -->
        <div class="p-5 rounded-xl border border-surface-border bg-surface-card space-y-3">
          <div class="flex items-center justify-between">
            <h3 class="font-bold text-sm text-text-primary">3. TTI Center Focus Areas Grid</h3>
            <span class="text-xs font-mono px-2 py-0.5 rounded bg-surface-sunken text-text-muted">tti-ux/center-grid</span>
          </div>
          <p class="text-xs text-text-muted">Three-column program cards with sharp rectangular Kadence button links.</p>
          <div class="grid grid-cols-2 gap-3 text-xs">
            <div class="p-3 bg-surface-sunken rounded border border-surface-border">
              <p class="text-[10px] uppercase font-bold text-[#500000]">Program Area</p>
              <h5 class="font-bold text-text-primary mt-0.5">Roadway Safety</h5>
              <span class="inline-block mt-2 bg-[#500000] text-white px-2 py-1 text-[10px] font-semibold">View Program &rarr;</span>
            </div>
            <div class="p-3 bg-surface-sunken rounded border border-surface-border">
              <p class="text-[10px] uppercase font-bold text-[#500000]">Program Area</p>
              <h5 class="font-bold text-text-primary mt-0.5">Connected Vehicles</h5>
              <span class="inline-block mt-2 bg-[#500000] text-white px-2 py-1 text-[10px] font-semibold">View Program &rarr;</span>
            </div>
          </div>
        </div>

        <!-- Pattern 4 -->
        <div class="p-5 rounded-xl border border-surface-border bg-surface-card space-y-3">
          <div class="flex items-center justify-between">
            <h3 class="font-bold text-sm text-text-primary">4. TTI Executive Research Factsheet</h3>
            <span class="text-xs font-mono px-2 py-0.5 rounded bg-surface-sunken text-text-muted">tti-ux/executive-factsheet</span>
          </div>
          <p class="text-xs text-text-muted">High-priority policy brief callout with gold vertical keyline and research tags.</p>
          <div class="p-3 bg-surface-sunken rounded border border-surface-border border-l-4 border-l-[#CFA935] space-y-1.5 text-xs">
            <p class="text-[10px] uppercase font-bold text-[#500000]">Executive Brief</p>
            <h5 class="font-bold text-text-primary">Key Findings &amp; Policy Recommendations</h5>
            <p class="text-text-muted text-[11px]">Field evaluations across 12 automated intersections demonstrated a 34% reduction in conflicting movements.</p>
            <div class="flex gap-2 pt-1">
              <span class="px-2 py-0.5 rounded bg-[#500000]/10 text-[#500000] font-mono text-[10px] font-bold">Report 0-6987-1</span>
              <span class="px-2 py-0.5 rounded bg-[#CFA935]/20 text-[#221F1F] font-mono text-[10px] font-bold">TxDOT Research</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- TAB 4: INSTANT WCAG AAA BRIDGE -->
    <div v-if="activeTab === 'bridge'" class="space-y-6">
      <div class="p-6 rounded-xl border border-surface-border bg-surface-card space-y-4">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-lg font-bold text-text-primary flex items-center gap-2">
              <UIcon name="lucide:sparkles" class="w-5 h-5 text-emerald-500" />
              <span>Instant WCAG 2.2 AAA Modernization Bridge</span>
            </h2>
            <p class="text-sm text-text-muted mt-1">
              Retrofit any existing TTI WordPress site in 60 seconds without switching themes or modifying template PHP files.
            </p>
          </div>
          <TuxBadge tone="success" variant="soft" class="font-mono">Zero-JS CSS Drop-In</TuxBadge>
        </div>

        <div class="space-y-3 pt-2">
          <div class="flex items-center justify-between">
            <h3 class="text-xs font-mono font-bold uppercase tracking-wider text-text-muted">
              Add to Appearance &rarr; Customize &rarr; Additional CSS
            </h3>
            <button
              type="button"
              class="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono font-medium rounded bg-surface-sunken border border-surface-border text-text-primary hover:bg-surface-raised cursor-pointer transition-colors"
              @click="copyBridge(bridgeImportSnippet)"
            >
              <UIcon :name="copiedBridge ? 'lucide:check' : 'lucide:copy'" class="w-3.5 h-3.5" :class="{ 'text-emerald-500': copiedBridge }" />
              <span>{{ copiedBridge ? "Copied!" : "Copy CSS Snippet" }}</span>
            </button>
          </div>

          <TuxCodeBlock :code="bridgeImportSnippet" language="css" filename="Additional CSS" />
        </div>

        <!-- Before & After Comparison Link -->
        <div class="p-4 rounded-lg bg-surface-sunken border border-surface-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h4 class="font-bold text-xs text-text-primary">Want to inspect the forensic side-by-side comparison?</h4>
            <p class="text-xs text-text-muted">Explore the interactive before/after SCTQS showcase with real-time WCAG 2.2 AAA meter.</p>
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
