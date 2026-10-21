<?php
/**
 * TuxTileGrid — PHP & WordPress / Kadence component renderer.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
namespace Tti\Tux\Components;

final class TuxTileGrid
{
    public string $title = '';
    public string $subtitle = '';
    public ?string $tiles = null;
    public int $columns = 3;
    public string $surface = 'eggshell';

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
            '<section class="tux-tile-grid">%s</section>',
            $content
        );
    }
}
