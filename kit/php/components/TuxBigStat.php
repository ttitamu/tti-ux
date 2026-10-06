<?php
/**
 * TuxBigStat — PHP & WordPress / Kadence component renderer.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
namespace Tti\Tux\Components;

final class TuxBigStat
{
    public string $value;
    public string $suffix = null;
    public string $label;
    public string $source = null;
    public string $variant = default;
    public string $tone = maroon;
    public string $size = md;

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
            '<div class="tux-big-stat">%s</div>',
            $content
        );
    }
}
