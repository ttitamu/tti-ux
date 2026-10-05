<?php
/**
 * TuxContextMeter — PHP & WordPress / Kadence component renderer.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
namespace Tti\Tux\Components;

final class TuxContextMeter
{
    public int $used;
    public int $max;
    public string $breakdown = 'undefined';

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
            '<UPopover class="tux-context-meter">%s</UPopover>',
            $content
        );
    }
}
