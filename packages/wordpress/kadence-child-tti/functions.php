<?php
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
 *
 * @param array $palette Default Kadence palette.
 * @return array Institutional TTI palette.
 */
function tti_kadence_child_global_palette($palette) {
    if (!is_array($palette)) {
        $palette = array();
    }

    $tti_colors = array(
        0 => array('color' => '#500000', 'name' => __('Aggie Maroon (Primary)', 'kadence-child-tti'), 'slug' => 'theme-palette1'),
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
add_action('kadence_before_header', 'tti_kadence_render_utility_bar', 5);
