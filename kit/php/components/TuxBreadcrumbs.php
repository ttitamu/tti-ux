<?php
/**
 * TuxBreadcrumbs — PHP & WordPress / Kadence component renderer.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
namespace Tti\Tux\Components;

final class TuxBreadcrumbs
{
    public string $trail;
    public bool $homeIcon = true;
    public bool $chevron = false;
    public string $ariaLabel = 'Breadcrumb';

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
            '<nav class="tux-breadcrumbs">%s</nav>',
            $content
        );
    }
}
