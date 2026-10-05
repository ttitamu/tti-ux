<?php
/**
 * TuxTree — PHP & WordPress / Kadence component renderer.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
namespace Tti\Tux\Components;

final class TuxTree
{
    public string $items;
    public string $defaultExpanded = 'undefined';
    public string $storageKey = 'undefined';
    public bool $showGuides = true;
    public string $ariaLabel = 'Tree';

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
            '<ul class="tux-tree">%s</ul>',
            $content
        );
    }
}
