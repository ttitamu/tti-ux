<?php
/**
 * TuxChartSunburst — PHP & WordPress / Kadence component renderer.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
namespace Tti\Tux\Components;

final class TuxChartSunburst
{
    public ?string $data = null;
    public int $size = 320;
    public string $centerLabel = 'Total';
    public ?string $formatTotal = null;
    public ?string $formatValue = null;
    public bool $showLegend = true;
    public ?string $palette = null;
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
            '<div class="tux-chart-sunburst">%s</div>',
            $content
        );
    }
}
