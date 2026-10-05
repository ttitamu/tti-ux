<?php
/**
 * TuxDocsSidebarNode — PHP & WordPress / Kadence component renderer.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
namespace Tti\Tux\Components;

final class TuxDocsSidebarNode
{
    public string $section;
    public string $path;
    public string $query;
    public string $openMap;
    public string $isOpen;
    public string $isActive;
    public string $onToggle;
    public int $depth;

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
            '<li class="tux-docs-sidebar-node">%s</li>',
            $content
        );
    }
}
