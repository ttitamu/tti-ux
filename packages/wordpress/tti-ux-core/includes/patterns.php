<?php
/**
 * TTI-UX Block Patterns (v3.0.0)
 *
 * Pre-assembled page layouts for the Gutenberg Block Editor.
 * Delivers institutional TTI Communications & Marketing designs out of the box.
 */

if (!defined('ABSPATH')) {
    exit;
}

function tti_ux_register_patterns() {
    register_block_pattern_category(
        'tti-ux',
        array('label' => __('TTI Design System (TUX 3.0)', 'tti-ux'))
    );

    // Pattern 1: Research Project Hero & Big Stat
    register_block_pattern(
        'tti-ux/research-hero',
        array(
            'title'       => __('TTI Research Hero & Stats', 'tti-ux'),
            'description' => __('A branded research hero banner with big statistics.', 'tti-ux'),
            'categories'  => array('tti-ux', 'header'),
            'content'     => '
                <!-- wp:html -->
                <div class="tux-pattern-research-hero p-8 bg-surface-raised border border-surface-border" style="background:#ffffff; border:1px solid #e5e7eb; padding:2rem; margin:1.5rem 0;">
                    <p style="font-size:12px; text-transform:uppercase; letter-spacing:0.08em; color:#500000; font-weight:700; margin-bottom:4px;">Sponsored Research Initiative</p>
                    <h1 style="color:#500000; font-size:2rem; font-weight:800; border-bottom:2px solid #CFA935; padding-bottom:8px; margin-top:0;">Autonomous Corridor Operations</h1>
                    <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:1.5rem; margin:1.5rem 0;">
                        <tux-big-stat value="650" suffix="+" label="Active connected testbeds" tone="maroon" size="md"></tux-big-stat>
                        <tux-big-stat value="99.4" suffix="%" label="V2X Packet Delivery Ratio" tone="gold" size="md"></tux-big-stat>
                        <tux-big-stat value="42" suffix=" mi" label="Instrumented Freeway" tone="neutral" size="md"></tux-big-stat>
                    </div>
                </div>
                <!-- /wp:html -->
            ',
        )
    );

    // Pattern 2: Center Profile Card Grid
    register_block_pattern(
        'tti-ux/center-grid',
        array(
            'title'       => __('TTI Center Focus Areas', 'tti-ux'),
            'description' => __('Three-column card grid for program focus areas with sharp rectangular CTA styling.', 'tti-ux'),
            'categories'  => array('tti-ux', 'columns'),
            'content'     => '
                <!-- wp:html -->
                <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:1.5rem; margin:2rem 0;">
                    <div style="border:1px solid #e5e7eb; padding:1.5rem; background:#ffffff; border-radius:0px;">
                        <p style="font-size:11px; text-transform:uppercase; color:#500000; font-weight:700;">Program Area</p>
                        <h3 style="color:#500000; font-size:1.25rem; font-weight:700; margin:0.5rem 0;">Roadway Safety &amp; Crash Analysis</h3>
                        <p style="color:#374151; font-size:0.95rem; line-height:1.5;">Evaluating collision mitigation technologies on high-speed rural and urban corridors.</p>
                        <a href="/safety" style="display:inline-block; margin-top:1rem; background:#500000; color:#ffffff; padding:8px 16px; text-decoration:none; font-weight:600; font-size:0.9rem;">View Program &rarr;</a>
                    </div>
                    <div style="border:1px solid #e5e7eb; padding:1.5rem; background:#ffffff; border-radius:0px;">
                        <p style="font-size:11px; text-transform:uppercase; color:#500000; font-weight:700;">Program Area</p>
                        <h3 style="color:#500000; font-size:1.25rem; font-weight:700; margin:0.5rem 0;">Connected &amp; Automated Vehicles</h3>
                        <p style="color:#374151; font-size:0.95rem; line-height:1.5;">Testing edge sensor networks and V2X broadcast algorithms in real-world environments.</p>
                        <a href="/connected" style="display:inline-block; margin-top:1rem; background:#500000; color:#ffffff; padding:8px 16px; text-decoration:none; font-weight:600; font-size:0.9rem;">View Program &rarr;</a>
                    </div>
                    <div style="border:1px solid #e5e7eb; padding:1.5rem; background:#ffffff; border-radius:0px;">
                        <p style="font-size:11px; text-transform:uppercase; color:#500000; font-weight:700;">Program Area</p>
                        <h3 style="color:#500000; font-size:1.25rem; font-weight:700; margin:0.5rem 0;">Pavements &amp; Advanced Materials</h3>
                        <p style="color:#374151; font-size:0.95rem; line-height:1.5;">Accelerated pavement testing for heavy freight, asphalt recycling, and sustainable binders.</p>
                        <a href="/materials" style="display:inline-block; margin-top:1rem; background:#500000; color:#ffffff; padding:8px 16px; text-decoration:none; font-weight:600; font-size:0.9rem;">View Program &rarr;</a>
                    </div>
                </div>
                <!-- /wp:html -->
            ',
        )
    );

    // Pattern 3: WCAG 2.2 Level AAA Telemetry Data Grid
    register_block_pattern(
        'tti-ux/telemetry-table',
        array(
            'title'       => __('TTI WCAG AAA Data Grid', 'tti-ux'),
            'description' => __('Data table pre-styled with Aggie Maroon header, gold keyline, zebra striping, and 7:1 contrast.', 'tti-ux'),
            'categories'  => array('tti-ux', 'tables'),
            'content'     => '
                <!-- wp:html -->
                <div class="tux-bridge" style="margin:2rem 0; overflow-x:auto;">
                    <table style="width:100%; border-collapse:collapse; text-align:left; font-size:0.9rem;">
                        <thead>
                            <tr style="background-color:#500000; color:#ffffff; border-bottom:3px solid #CFA935;">
                                <th style="padding:12px 16px; font-weight:700;">Corridor Station</th>
                                <th style="padding:12px 16px; font-weight:700;">County</th>
                                <th style="padding:12px 16px; font-weight:700; text-align:right;">Mean Speed (mph)</th>
                                <th style="padding:12px 16px; font-weight:700; text-align:right;">V2X Telemetry Health</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr style="background-color:#ffffff; border-bottom:1px solid #e5e7eb;">
                                <td style="padding:12px 16px; font-weight:600; color:#500000;">IH-35 Segment 4A</td>
                                <td style="padding:12px 16px; color:#374151;">Travis</td>
                                <td style="padding:12px 16px; text-align:right; font-variant-numeric:tabular-nums;">64.8</td>
                                <td style="padding:12px 16px; text-align:right; color:#15803d; font-weight:600;">99.8% (Nominal)</td>
                            </tr>
                            <tr style="background-color:#f9fafb; border-bottom:1px solid #e5e7eb;">
                                <td style="padding:12px 16px; font-weight:600; color:#500000;">IH-10 West Transitway</td>
                                <td style="padding:12px 16px; color:#374151;">Harris</td>
                                <td style="padding:12px 16px; text-align:right; font-variant-numeric:tabular-nums;">58.2</td>
                                <td style="padding:12px 16px; text-align:right; color:#15803d; font-weight:600;">99.2% (Nominal)</td>
                            </tr>
                            <tr style="background-color:#ffffff; border-bottom:1px solid #e5e7eb;">
                                <td style="padding:12px 16px; font-weight:600; color:#500000;">US-290 Connected Bypass</td>
                                <td style="padding:12px 16px; color:#374151;">Waller</td>
                                <td style="padding:12px 16px; text-align:right; font-variant-numeric:tabular-nums;">71.4</td>
                                <td style="padding:12px 16px; text-align:right; color:#ca8a04; font-weight:600;">96.5% (Warning)</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <!-- /wp:html -->
            ',
        )
    );

    // Pattern 4: Executive Research Factsheet
    register_block_pattern(
        'tti-ux/executive-factsheet',
        array(
            'title'       => __('TTI Executive Factsheet', 'tti-ux'),
            'description' => __('Key research findings callout box with gold keyline accent.', 'tti-ux'),
            'categories'  => array('tti-ux', 'text'),
            'content'     => '
                <!-- wp:html -->
                <div style="background:#ffffff; border:1px solid #e5e7eb; border-left:4px solid #CFA935; padding:1.5rem; margin:1.5rem 0;">
                    <p style="font-size:11px; text-transform:uppercase; color:#500000; font-weight:700; margin:0 0 6px 0;">Executive Brief</p>
                    <h3 style="color:#500000; font-size:1.35rem; font-weight:700; margin:0 0 0.75rem 0;">Key Findings &amp; Policy Recommendations</h3>
                    <p style="color:#221F1F; font-size:1rem; line-height:1.6; margin:0 0 1rem 0;">Field evaluations across 12 automated intersections demonstrated a <strong>34% reduction</strong> in severe conflicting movements during peak transition periods.</p>
                    <div style="display:flex; gap:12px; flex-wrap:wrap;">
                        <span style="display:inline-flex; align-items:center; background:rgba(80,0,0,0.06); color:#500000; padding:4px 10px; font-size:12px; font-weight:600;">Report 0-6987-1</span>
                        <span style="display:inline-flex; align-items:center; background:rgba(207,169,53,0.15); color:#221F1F; padding:4px 10px; font-size:12px; font-weight:600;">TxDOT Research</span>
                    </div>
                </div>
                <!-- /wp:html -->
            ',
        )
    );
}
add_action('init', 'tti_ux_register_patterns');
