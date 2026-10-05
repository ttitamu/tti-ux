<?php
/**
 * TuxTableCaption — PHP & WordPress / Kadence component renderer.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
namespace Tti\Tux\Components;

final class TuxTableCaption
{
    public string $label = 'Table';
    public string $number;
    public string $caption = 'undefined';
    public string $source = 'undefined';
    public string $placement = above;

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
            '<div class="tux-table-caption">%s</div>',
            $content
        );
    }
}
