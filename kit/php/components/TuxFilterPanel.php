<?php
/**
 * TuxFilterPanel — PHP & WordPress / Kadence component renderer.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
namespace Tti\Tux\Components;

final class TuxFilterPanel
{
    public string $facets;
    public string $modelValue = '()';
    public string $title;

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
            '<aside class="tux-filter-panel">%s</aside>',
            $content
        );
    }
}
