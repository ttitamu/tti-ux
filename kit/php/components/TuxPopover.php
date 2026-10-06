<?php
/**
 * TuxPopover — PHP & WordPress / Kadence component renderer.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
namespace Tti\Tux\Components;

final class TuxPopover
{
    public string $title = 'undefined';
    public string $body = 'undefined';
    public string $mode = click;
    public string $side = bottom;
    public bool $arrow = true;
    public bool $disabled = false;
    public string $width = md;

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
            '<UPopover class="tux-popover">%s</UPopover>',
            $content
        );
    }
}
