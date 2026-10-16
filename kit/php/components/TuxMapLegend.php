<?php
/**
 * TuxMapLegend — PHP & WordPress / Kadence component renderer.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
namespace Tti\Tux\Components;

final class TuxMapLegend
{
    public string $title;
    public string $eyebrow;
    public string $entries;
    public string $layout = 'stacked';
    public string $gradient;
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
