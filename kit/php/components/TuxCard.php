<?php
/**
 * TuxCard — PHP & WordPress / Kadence component renderer.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
namespace Tti\Tux\Components;

final class TuxCard
{
    public string $to = 'undefined';
    public bool $padded = true;
    public bool $linked = false;

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
            '<NuxtLink class="tux-card">%s</NuxtLink>',
            $content
        );
    }
}
