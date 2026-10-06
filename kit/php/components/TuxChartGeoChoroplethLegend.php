<?php
/**
 * TuxChartGeoChoroplethLegend — PHP & WordPress / Kadence component renderer.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
namespace Tti\Tux\Components;

final class TuxChartGeoChoroplethLegend
{
    public string $ramp;
    public string $label;
    public string $stops;
    public int $x;
    public int $y;

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
            '<g class="tux-chart-geo-choropleth-legend">%s</g>',
            $content
        );
    }
}
