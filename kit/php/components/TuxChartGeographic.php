<?php
/**
 * TuxChartGeographic — PHP & WordPress / Kadence component renderer.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
namespace Tti\Tux\Components;

final class TuxChartGeographic
{
    public string $kind;
    public string $palette = 'maroon';
    public string $title;
    public string $legendLabel = 'Value';
    public string $legendStops = '()';
    public bool $showLegend = true;
    public string $counties = '()';
    public string $districts = '()';
    public string $states = '()';
    public string $highlight = 'TX';
    public int $dots = 600;
    public string $dotLegend = '1';
    public string $flows = '()';
    public string $flowLegend = 'Daily';

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
            '<div class="tux-chart-geographic">%s</div>',
            $content
        );
    }
}
