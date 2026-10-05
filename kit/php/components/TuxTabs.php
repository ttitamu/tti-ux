<?php
/**
 * TuxTabs — PHP & WordPress / Kadence component renderer.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
namespace Tti\Tux\Components;

final class TuxTabs
{
    public string $items;
    public string $modelValue = undefined;
    public string $orientation = horizontal;
    public string $size = md;
    public string $variant = default;

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
            '<UTabs class="tux-tabs">%s</UTabs>',
            $content
        );
    }
}
