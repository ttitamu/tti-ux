<?php
/**
 * TuxCardSlab — PHP & WordPress / Kadence component renderer.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
namespace Tti\Tux\Components;

final class TuxCardSlab
{
    public string $cards;
    public int $columns = 3;
    public string $aspect = '4/5';
    public string $heading;
    public string $eyebrow;
    public bool $inset = false;

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
            '<section class="tux-card-slab">%s</section>',
            $content
        );
    }
}
