<?php
/**
 * TuxChartHistogram — PHP & WordPress / Kadence component renderer.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
namespace Tti\Tux\Components;

final class TuxChartHistogram
{
    public string $values;
    public int $width = 640;
    public int $height = 280;
    public int $binCount = 12;
    public string $percentiles;
    public bool $normalize = false;
    public bool $gridlines = true;
    public int $ticks = 5;
    public string $xLabel;
    public string $format;
    public int $decimals = 1;
    public string $ariaSummary;
    public string $units;
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
            '<figure class="tux-chart-histogram">%s</figure>',
            $content
        );
    }
}
