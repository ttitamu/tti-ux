<?php
/**
 * TuxReactiveSidebar — PHP & WordPress / Kadence component renderer.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
namespace Tti\Tux\Components;

final class TuxReactiveSidebar
{
    public string $sections;
    public string $allSections;
    public bool $collapsed = false;
    public string $activeAreaTitle;
    public string $activeAreaIcon = 'lucide:layers';
    public bool $search = true;
    public string $searchPlaceholder;
    public bool $showAll = false;
    public bool $defaultExpanded = false;
    public bool $exclusive = false;

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
            '<nav class="tux-reactive-sidebar">%s</nav>',
            $content
        );
    }
}
