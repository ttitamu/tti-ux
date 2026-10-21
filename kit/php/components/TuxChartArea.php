<?php
/**
 * TuxChartArea — PHP & WordPress / Kadence component renderer.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
namespace Tti\Tux\Components;

final class TuxChartArea
{
    public ?string $labels = null;
    public ?string $series = null;
    public int $width = 640;
    public int $height = 280;
    public string $palette = 'brand';
    public bool $patterns = false;
    public string $variant = 'overlay';
    public bool $markers = false;
    public bool $endLabels = true;
    public bool $legend = false;
    public bool $gridlines = true;
    public int $ticks = 5;
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
            '<figure class="tux-chart-area">%s</figure>',
            $content
        );
    }
}
