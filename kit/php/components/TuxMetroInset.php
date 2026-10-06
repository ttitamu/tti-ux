<?php
/**
 * TuxMetroInset — PHP & WordPress / Kadence component renderer.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
namespace Tti\Tux\Components;

final class TuxMetroInset
{
    public string $name;
    public string $highwayLabel;
    public int $height = 220;
    public string $palette = 'maroon';
    public string $seed;
    public int $cols = 8;
    public int $rows = 6;

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
            '<div class="tux-metro-inset">%s</div>',
            $content
        );
    }
}
