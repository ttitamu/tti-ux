<?php
/**
 * TuxAlert — PHP & WordPress / Kadence component renderer.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
namespace Tti\Tux\Components;

final class TuxAlert
{
    public string $variant = 'info';
    public string $title = 'undefined';
    public string $description = 'undefined';
    public string $icon = 'undefined';

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
            '<UAlert class="tux-alert">%s</UAlert>',
            $content
        );
    }
}
