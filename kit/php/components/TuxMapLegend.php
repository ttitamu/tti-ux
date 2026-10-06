<?php
/**
 * TuxMapLegend — PHP & WordPress / Kadence component renderer.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
namespace Tti\Tux\Components;

final class TuxMapLegend
{
    public string $title = 'undefined';
    public string $eyebrow = 'undefined';
    public string $entries = 'undefined';
    public string $layout = stacked;
    public string $gradient = 'undefined';
    public string $minLabel;
    public string $maxLabel;
    public string $css;
    public string $stops;

    public function __construct(array $attributes = [])
    {
        foreach ($attributes as $key => $value) {
            if (property_exists($this, $key)) {
                $this->$key = $value;
            }
        }
    }

    public function render(string $content = ''): string
    {
        return sprintf(
            '<div class="tux-map-legend">%s</div>',
            $content
        );
    }
}
