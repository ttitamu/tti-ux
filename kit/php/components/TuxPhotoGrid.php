<?php
/**
 * TuxPhotoGrid — PHP & WordPress / Kadence component renderer.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
namespace Tti\Tux\Components;

final class TuxPhotoGrid
{
    public string $items;
    public string $kind = photo;
    public string $columns = 3;
    public string $aspect = undefined;

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
            '<ul class="tux-photo-grid">%s</ul>',
            $content
        );
    }
}
