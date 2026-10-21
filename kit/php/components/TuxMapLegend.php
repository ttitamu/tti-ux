<?php
/**
 * TuxMapLegend — PHP & WordPress / Kadence component renderer.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
namespace Tti\Tux\Components;

final class TuxMapLegend
{
    public ?string $title = null;
    public ?string $eyebrow = null;
    public ?string $entries = null;
    public string $layout = 'stacked';
    public ?string $gradient = null;
    public ?string $minLabel = null;
    public ?string $maxLabel = null;
    public ?string $css = null;
    public ?string $stops = null;

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
            '<div class="tux-map-legend">%s</div>',
            $content
        );
    }
}
