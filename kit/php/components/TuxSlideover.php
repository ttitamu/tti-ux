<?php
/**
 * TuxSlideover — PHP & WordPress / Kadence component renderer.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
namespace Tti\Tux\Components;

final class TuxSlideover
{
    public string $side = right;
    public string $size = 'undefined';
    public string $title = 'undefined';
    public string $eyebrow = 'undefined';
    public bool $showClose = true;
    public bool $closeOnBackdrop = true;

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
            '<dialog class="tux-slideover">%s</dialog>',
            $content
        );
    }
}
