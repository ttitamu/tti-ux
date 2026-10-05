<?php
/**
 * TuxScrollTop — PHP & WordPress / Kadence component renderer.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
namespace Tti\Tux\Components;

final class TuxScrollTop
{
    public int $threshold = 160;
    public string $position = bottom-right;
    public string $ariaLabel = 'Scroll';

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
            '<button class="tux-scroll-top">%s</button>',
            $content
        );
    }
}
