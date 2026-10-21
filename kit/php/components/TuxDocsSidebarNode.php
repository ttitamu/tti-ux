<?php
/**
 * TuxDocsSidebarNode — PHP & WordPress / Kadence component renderer.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
namespace Tti\Tux\Components;

final class TuxDocsSidebarNode
{
    public ?string $section = null;
    public ?string $path = null;
    public ?string $query = null;
    public ?string $openMap = null;
    public ?string $isOpen = null;
    public ?string $isActive = null;
    public ?string $onToggle = null;
    public ?int $depth = null;

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
