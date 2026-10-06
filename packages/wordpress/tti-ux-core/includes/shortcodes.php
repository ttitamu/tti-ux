<?php
/**
 * TTI-UX Core Shortcodes (v3.0.0)
 *
 * Provides turnkey shortcodes for Classic Editor, Gutenberg Shortcode blocks,
 * and page builders (Elementor, Divi, Beaver Builder).
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Shortcode: [tux_stat value="126" suffix="M" label="..." tone="maroon" variant="default" size="md"]
 */
function tti_ux_shortcode_stat($atts) {
    $a = shortcode_atts(array(
        'value'   => '',
        'suffix'  => '',
        'label'   => '',
        'source'  => '',
        'tone'    => 'maroon',
        'variant' => 'default',
        'size'    => 'md',
    ), $atts, 'tux_stat');

    return sprintf(
        '<tux-big-stat value="%s" suffix="%s" label="%s" source="%s" tone="%s" variant="%s" size="%s"></tux-big-stat>',
        esc_attr($a['value']),
        esc_attr($a['suffix']),
        esc_attr($a['label']),
        esc_attr($a['source']),
        esc_attr($a['tone']),
        esc_attr($a['variant']),
        esc_attr($a['size'])
    );
}
add_shortcode('tux_stat', 'tti_ux_shortcode_stat');

/**
 * Shortcode: [tux_alert variant="info" title="Important Notice"]Content[/tux_alert]
 */
function tti_ux_shortcode_alert($atts, $content = null) {
    $a = shortcode_atts(array(
        'variant' => 'info',
        'title'   => '',
    ), $atts, 'tux_alert');

    return sprintf(
        '<tux-alert variant="%s" title="%s">%s</tux-alert>',
        esc_attr($a['variant']),
        esc_attr($a['title']),
        do_shortcode($content)
    );
}
add_shortcode('tux_alert', 'tti_ux_shortcode_alert');

/**
 * Shortcode: [tux_card to="https://..." padded="true"]Content[/tux_card]
 */
function tti_ux_shortcode_card($atts, $content = null) {
    $a = shortcode_atts(array(
        'to'     => '',
        'padded' => 'true',
    ), $atts, 'tux_card');

    return sprintf(
        '<tux-card to="%s" padded="%s">%s</tux-card>',
        esc_attr($a['to']),
        esc_attr($a['padded']),
        do_shortcode($content)
    );
}
add_shortcode('tux_card', 'tti_ux_shortcode_card');

/**
 * Shortcode: [tux_heading title="Program Overview" level="2"]
 * Renders signature TTI Maroon Heading with Warm Gold Underline.
 */
function tti_ux_shortcode_heading($atts) {
    $a = shortcode_atts(array(
        'title' => '',
        'level' => '2',
    ), $atts, 'tux_heading');

    $tag = in_array($a['level'], array('1', '2', '3', '4'), true) ? 'h' . $a['level'] : 'h2';

    return sprintf(
        '<%s class="tti-section-header" style="color: #500000; font-weight: 700; border-bottom: 2px solid #CFA935; padding-bottom: 8px; margin-top: 2rem; margin-bottom: 1.25rem;">%s</%s>',
        $tag,
        esc_html($a['title']),
        $tag
    );
}
add_shortcode('tux_heading', 'tti_ux_shortcode_heading');

/**
 * Shortcode: [tux_portal_header agency="Texas A&M Transportation Institute" search="true"]
 * Injects Tier 1 utility bar and agency branding.
 */
function tti_ux_shortcode_portal_header($atts) {
    $a = shortcode_atts(array(
        'agency' => 'Texas A&M Transportation Institute',
        'search' => 'true',
    ), $atts, 'tux_portal_header');

    ob_start();
    ?>
    <aside class="tti-utility-bar" aria-label="<?php esc_attr_e('Institutional Utility Links', 'tti-ux'); ?>" style="background-color: #500000; color: #ffffff; padding: 8px 16px; font-size: 13px; font-family: inherit; display: flex; justify-content: space-between; align-items: center;">
        <div class="tti-utility-bar__agency" style="font-weight: 600;">
            <a href="https://tti.tamu.edu" target="_blank" rel="noopener noreferrer" style="color: #ffffff; text-decoration: none;">
                <?php echo esc_html($a['agency']); ?> &nearr;
            </a>
        </div>
        <nav class="tti-utility-bar__nav" aria-label="<?php esc_attr_e('Utility Navigation', 'tti-ux'); ?>" style="display: flex; gap: 16px;">
            <a href="https://tti.tamu.edu/jobs/" style="color: #ffffff; text-decoration: none;"><?php esc_html_e('Jobs', 'tti-ux'); ?></a>
            <a href="https://tti.tamu.edu/pressroom/" style="color: #ffffff; text-decoration: none;"><?php esc_html_e('Pressroom', 'tti-ux'); ?></a>
            <a href="https://tti.tamu.edu/directory/" style="color: #ffffff; text-decoration: none;"><?php esc_html_e('Directory', 'tti-ux'); ?></a>
            <a href="https://tti.tamu.edu/contact/" style="color: #ffffff; text-decoration: none;"><?php esc_html_e('Contact', 'tti-ux'); ?></a>
        </nav>
    </aside>
    <?php
    return ob_get_clean();
}
add_shortcode('tux_portal_header', 'tti_ux_shortcode_portal_header');

/**
 * Shortcode: [tux_staleness stale="true" date="2026-09-01" owner="Safety Division"]
 */
function tti_ux_shortcode_staleness($atts) {
    $a = shortcode_atts(array(
        'stale' => 'true',
        'date'  => '',
        'owner' => 'TTI Research Division',
    ), $atts, 'tux_staleness');

    if ($a['stale'] !== 'true') {
        return '';
    }

    return sprintf(
        '<div class="tux-staleness-alert" role="region" aria-label="%s" style="background-color: rgba(207, 169, 53, 0.12); border-left: 4px solid #CFA935; padding: 12px 16px; margin: 16px 0; font-size: 13px; color: #221F1F;">
            <strong>%s:</strong> %s %s. %s: %s.
        </div>',
        esc_attr__('Data Staleness Advisory', 'tti-ux'),
        esc_html__('Notice', 'tti-ux'),
        esc_html__('This dataset was last audited on', 'tti-ux'),
        esc_html($a['date'] ?: date('Y-m-d')),
        esc_html__('Maintained by', 'tti-ux'),
        esc_html($a['owner'])
    );
}
add_shortcode('tux_staleness', 'tti_ux_shortcode_staleness');
