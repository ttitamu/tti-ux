<?php
/**
 * Plugin Name: TTI-UX Core
 * Plugin URI: https://code.tti.tamu.edu/tti/tti-ux
 * Description: The official Texas A&M Transportation Institute (TTI) Design System for WordPress. Delivers WCAG 2.2 Level AAA tokens, Kadence integration, Gutenberg block patterns, and web component shortcodes.
 * Version: 3.0.0
 * Author: Texas A&M Transportation Institute
 * Author URI: https://tti.tamu.edu
 * License: Apache-2.0
 * Text Domain: tti-ux
 */

if (!defined('ABSPATH')) {
    exit;
}

define('TTI_UX_VERSION', '3.0.0');
define('TTI_UX_PLUGIN_DIR', plugin_dir_path(__FILE__));
define('TTI_UX_PLUGIN_URL', plugin_dir_url(__FILE__));

/**
 * Enqueue TUX tokens, fonts, WCAG AAA modernization bridge, and Web Component runtime.
 */
function tti_ux_enqueue_assets() {
    // 1. Enqueue Google / Host Fonts (Roboto, Open Sans, JetBrains Mono)
    wp_enqueue_style(
        'tti-ux-fonts',
        'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&family=Open+Sans:ital,wght@0,400;0,600;0,700;1,400&family=Roboto:ital,wght@0,400;0,500;0,700;1,400&family=Work+Sans:ital,wght@0,400;0,600;0,700;0,800;1,400;1,700&display=swap',
        array(),
        TTI_UX_VERSION
    );

    // 2. Canonical TUX Tokens (CSS Custom Properties)
    wp_enqueue_style(
        'tti-ux-tokens',
        'https://cdn.jsdelivr.net/gh/ttitamu/tti-ux@v3.0.0/kit/css/tux-tokens.css',
        array(),
        TTI_UX_VERSION
    );

    // 3. TTI-UX WCAG 2.2 Level AAA Modernization Bridge (zero-JS tables, forms, 44px targets)
    wp_enqueue_style(
        'tti-ux-bridge',
        'https://cdn.jsdelivr.net/gh/ttitamu/tti-ux@v3.0.0/kit/css/tux-bridge.css',
        array('tti-ux-tokens'),
        TTI_UX_VERSION
    );

    // 4. Web Components Engine (enables <tux-*> custom elements in page markup)
    wp_enqueue_script(
        'tti-ux-elements',
        'https://cdn.jsdelivr.net/gh/ttitamu/tti-ux@v3.0.0/packages/elements/dist/tux-elements.js',
        array(),
        TTI_UX_VERSION,
        array('strategy' => 'defer', 'in_footer' => true)
    );

    // 5. Inject theme switcher listener script
    $inline_script = "
    (function() {
        var theme = localStorage.getItem('tux-theme') || 'tti';
        document.documentElement.setAttribute('data-theme', theme);
    })();
    ";
    wp_add_inline_script('tti-ux-elements', $inline_script, 'before');
}
add_action('wp_enqueue_scripts', 'tti_ux_enqueue_assets');
add_action('admin_enqueue_scripts', 'tti_ux_enqueue_assets');

/**
 * Hook into Kadence Theme palette filter to sync TUX brand tokens.
 */
function tti_ux_kadence_palette($palette) {
    if (!is_array($palette)) {
        return $palette;
    }
    // Set canonical maroon & gold
    $palette[0]['color'] = '#500000'; // Aggie Maroon
    $palette[1]['color'] = '#3C0000'; // Deep Maroon
    $palette[2]['color'] = '#CFA935'; // Institutional Gold
    $palette[3]['color'] = '#221F1F'; // Reading Charcoal
    $palette[4]['color'] = '#374151'; // Secondary Slate
    $palette[5]['color'] = '#E5E7EB'; // Border Gray
    $palette[6]['color'] = '#F9FAFB'; // Surface Sunken
    $palette[7]['color'] = '#FFFFFF'; // White Canvas
    $palette[8]['color'] = '#FFFFFF'; // Pure White
    return $palette;
}
add_filter('kadence_global_palette', 'tti_ux_kadence_palette', 20);

// Include Gutenberg Blocks, Block Patterns, and Shortcodes
require_once TTI_UX_PLUGIN_DIR . 'includes/shortcodes.php';
require_once TTI_UX_PLUGIN_DIR . 'includes/patterns.php';
