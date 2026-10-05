<?php
/**
 * TuxChartGauge — PHP & WordPress / Kadence component renderer.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
namespace Tti\Tux\Components;

final class TuxChartGauge
{
    public int $value;
    public int $min = 0;
    public int $max = 100;
    public int $size = 240;
    public string $variant = arc;
    public string $bands = '()';
    public string $centerLabel = 'undefined';
    public string $centerValue = undefined;
    public string $units = 'undefined';
    public string $format = '(n:';
    public int $decimals = 1;
    public string $ariaSummary = 'undefined';

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
            '<figure class="tux-chart-gauge">%s</figure>',
            $content
        );
    }
}
