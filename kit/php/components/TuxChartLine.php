<?php
/**
 * TuxChartLine — PHP & WordPress / Kadence component renderer.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
namespace Tti\Tux\Components;

final class TuxChartLine
{
    public string $labels;
    public string $series;
    public int $width = 640;
    public int $height = 280;
    public bool $markers = false;
    public bool $endLabels = true;
    public bool $legend = false;
    public bool $gridlines = true;
    public int $yTicks = 5;

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
            '<figure class="tux-chart-line">%s</figure>',
            $content
        );
    }
}
