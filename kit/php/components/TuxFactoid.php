<?php
/**
 * TuxFactoid — PHP & WordPress / Kadence component renderer.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
namespace Tti\Tux\Components;

final class TuxFactoid
{
    public string $items;
    public string $variant = default;
    public string $columns = 3;
    public string $eyebrow = 'undefined';
    public string $title = 'undefined';
    public string $dek = 'undefined';

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
            '<section class="tux-factoid">%s</section>',
            $content
        );
    }
}
