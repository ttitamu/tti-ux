<?php
/**
 * TuxChartScatter — PHP & WordPress / Kadence component renderer.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
namespace Tti\Tux\Components;

final class TuxChartScatter
{
    public string $series;
    public string $xLabel = 'x';
    public string $yLabel = 'y';
    public int $width = 640;
    public int $height = 320;
    public bool $trendline = false;
    public bool $legend = true;
    public bool $gridlines = true;
    public int $xTicks = 6;
    public int $yTicks = 5;
    public string $format = '(n:';
    public int $decimals = 2;
    public string $ariaSummary = 'undefined';
    public string $units = 'undefined';
    public bool $tooltip = true;

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
            '<figure class="tux-chart-scatter">%s</figure>',
            $content
        );
    }
}
