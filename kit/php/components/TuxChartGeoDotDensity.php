<?php
/**
 * TuxChartGeoDotDensity — PHP & WordPress / Kadence component renderer.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
namespace Tti\Tux\Components;

final class TuxChartGeoDotDensity
{
    public int $dots;
    public string $dotLegend;

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
            '<svg class="tux-chart-geo-dot-density">%s</svg>',
            $content
        );
    }
}
