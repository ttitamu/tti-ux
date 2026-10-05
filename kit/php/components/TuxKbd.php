<?php
/**
 * TuxKbd — PHP & WordPress / Kadence component renderer.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
namespace Tti\Tux\Components;

final class TuxKbd
{
    public string $value = 'undefined';
    public string $keys = 'undefined';
    public string $size = sm;
    public string $separator;

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
            '<span class="tux-kbd">%s</span>',
            $content
        );
    }
}
