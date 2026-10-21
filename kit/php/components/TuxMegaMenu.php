<?php
/**
 * TuxMegaMenu — PHP & WordPress / Kadence component renderer.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
namespace Tti\Tux\Components;

final class TuxMegaMenu
{
    public ?string $label = null;
    public ?string $columns = null;
    public ?string $featured = null;
    public ?string $to = null;

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
            '<div class="tux-mega-menu">%s</div>',
            $content
        );
    }
}
