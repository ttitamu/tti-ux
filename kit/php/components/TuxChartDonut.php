<?php
/**
 * TuxChartDonut — PHP & WordPress / Kadence component renderer.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
namespace Tti\Tux\Components;

final class TuxChartDonut
{
    public ?string $slices = null;
    public int $size = 280;
    public string $palette = 'brand';
    public bool $patterns = false;
    public float $thickness = 0.5;
    public bool $sliceLabels = true;
    public bool $legend = false;
    public ?string $centerLabel = null;
    public ?string $centerValue = null;
    public int $minSlice = 3;
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
            '<figure class="tux-chart-donut">%s</figure>',
            $content
        );
    }
}
