<?php
/**
 * TuxChartBar — PHP & WordPress / Kadence component renderer.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
namespace Tti\Tux\Components;

final class TuxChartBar
{
    public string $labels;
    public string $series;
    public int $width = 640;
    public int $height = 280;
    public string $orientation = vertical;
    public string $variant = grouped;
    public bool $valueLabels = true;
    public bool $inBarLabels = false;
    public bool $gridlines = true;
    public bool $legend = false;
    public int $ticks = 5;
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
            '<figure class="tux-chart-bar">%s</figure>',
            $content
        );
    }
}
