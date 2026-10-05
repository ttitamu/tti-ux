<?php
/**
 * TuxFAB — PHP & WordPress / Kadence component renderer.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
namespace Tti\Tux\Components;

final class TuxFAB
{
    public string $icon;
    public bool $extended = false;
    public string $size = md;
    public string $side = right;
    public string $ariaLabel = 'undefined';
    public bool $disabled = false;

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
            '<button class="tux-fab">%s</button>',
            $content
        );
    }
}
