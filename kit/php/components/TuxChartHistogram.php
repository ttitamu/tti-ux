<?php
/**
 * TuxChartHistogram — PHP & WordPress / Kadence component renderer.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
namespace Tti\Tux\Components;

final class TuxChartHistogram
{
    public ?string $values = null;
    public int $width = 640;
    public int $height = 280;
    public int $binCount = 12;
    public ?string $percentiles = null;
    public bool $normalize = false;
    public bool $gridlines = true;
    public int $ticks = 5;
    public ?string $xLabel = null;
    public ?string $format = null;
    public int $decimals = 1;
    public ?string $ariaSummary = null;
    public ?string $units = null;
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
