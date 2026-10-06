<?php
/**
 * TuxChartGeoTitle — PHP & WordPress / Kadence component renderer.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
namespace Tti\Tux\Components;

final class TuxChartGeoTitle
{
    public string $title;
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
            '<text class="tux-chart-geo-title">%s</text>',
            $content
        );
    }
}
