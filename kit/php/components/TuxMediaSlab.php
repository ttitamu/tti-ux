<?php
/**
 * TuxMediaSlab — PHP & WordPress / Kadence component renderer.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
namespace Tti\Tux\Components;

final class TuxMediaSlab
{
    public string $src = 'undefined';
    public string $alt;
    public string $eyebrow = 'undefined';
    public string $title;
    public string $dek = 'undefined';
    public string $layout = overlay;
    public string $imageSide = right;
    public string $height = standard;
    public string $tone = maroon;

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
            '<section class="tux-media-slab">%s</section>',
            $content
        );
    }
}
