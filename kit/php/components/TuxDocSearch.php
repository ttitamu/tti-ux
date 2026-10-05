<?php
/**
 * TuxDocSearch — PHP & WordPress / Kadence component renderer.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
namespace Tti\Tux\Components;

final class TuxDocSearch
{
    public string $items = 'undefined';
    public string $placeholder = 'Search';
    public int $maxResults = 8;

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
            '<div class="tux-doc-search">%s</div>',
            $content
        );
    }
}
