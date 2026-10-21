<?php
/**
 * TuxDocsSidebar — PHP & WordPress / Kadence component renderer.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
namespace Tti\Tux\Components;

final class TuxDocsSidebar
{
    public ?string $tree = null;
    public string $title = 'Docs';
    public bool $search = true;
    public string $searchPlaceholder = 'Filter docs…';
    public string $storageKey = 'tux-docs-sidebar';
    public bool $exclusiveTopLevel = false;

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
            '<nav class="tux-docs-sidebar">%s</nav>',
            $content
        );
    }
}
