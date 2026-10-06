<?php
/**
 * TuxChartHeatmap — PHP & WordPress / Kadence component renderer.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
namespace Tti\Tux\Components;

final class TuxChartHeatmap
{
    public string $rows;
    public string $cols;
    public string $values;
    public int $width = 640;
    public int $height = 280;
    public string $ramp = maroon;
    public string $bins = 5;
    public bool $valueLabels = false;
    public bool $legend = true;
    public int $colLabelEvery = 0;
    public string $format = '(n:';
    public int $decimals = 1;
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
            '<figure class="tux-chart-heatmap">%s</figure>',
            $content
        );
    }
}
