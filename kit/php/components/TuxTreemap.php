<?php
/**
 * TuxTreemap — PHP & WordPress / Kadence component renderer.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
namespace Tti\Tux\Components;

final class TuxTreemap
{
    public string $data;
    public int $width = 720;
    public int $height = 460;
    public int $maxDepth = 2;
    public string $colorBy = size;
    public string $unit = bytes;
    public string $ariaLabel = 'Treemap';

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
            '<div class="tux-treemap">%s</div>',
            $content
        );
    }
}
