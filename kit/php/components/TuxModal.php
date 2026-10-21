<?php
/**
 * TuxModal — PHP & WordPress / Kadence component renderer.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
namespace Tti\Tux\Components;

final class TuxModal
{
    public bool $open = false;
    public ?string $title = null;
    public ?string $eyebrow = null;
    public ?string $size = null;
    public string $variant = 'standard';

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
            '<div class="tux-modal">%s</div>',
            $content
        );
    }
}
