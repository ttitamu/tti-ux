<?php
/**
 * TuxLinkSlab — PHP & WordPress / Kadence component renderer.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
namespace Tti\Tux\Components;

final class TuxLinkSlab
{
    public string $links;
    public string $tone = plain;
    public string $ariaLabel = 'Section';

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
            '<nav class="tux-link-slab">%s</nav>',
            $content
        );
    }
}
