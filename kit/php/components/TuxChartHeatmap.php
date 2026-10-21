<?php
/**
 * TuxChartHeatmap — PHP & WordPress / Kadence component renderer.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
namespace Tti\Tux\Components;

final class TuxChartHeatmap
{
    public ?string $rows = null;
    public ?string $cols = null;
    public ?string $values = null;
    public int $width = 640;
    public int $height = 280;
    public string $ramp = 'maroon';
    public int $bins = 5;
    public bool $valueLabels = false;
    public bool $legend = true;
    public int $colLabelEvery = 0;
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
            '<figure class="tux-chart-heatmap">%s</figure>',
            $content
        );
    }
}
