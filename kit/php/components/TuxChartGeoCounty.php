<?php
/**
 * TuxChartGeoCounty — PHP & WordPress / Kadence component renderer.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
namespace Tti\Tux\Components;

final class TuxChartGeoCounty
{
    public string $counties;
    public string $legendLabel;
    public string $legendStops;

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
            '<svg class="tux-chart-geo-county">%s</svg>',
            $content
        );
    }
}
