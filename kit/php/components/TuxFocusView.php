<?php
/**
 * TuxFocusView — PHP & WordPress / Kadence component renderer.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
namespace Tti\Tux\Components;

final class TuxFocusView
{
    public bool $open = false;
    public string $title = 'undefined';
    public string $eyebrow = 'undefined';
    public bool $dismissOnBackdropClick = true;
    public bool $dismissOnEscape = true;
    public string $backLabel = 'Close';

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
            '<Teleport class="tux-focus-view">%s</Teleport>',
            $content
        );
    }
}
