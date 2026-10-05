<?php
/**
 * TuxTestimonial — PHP & WordPress / Kadence component renderer.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
namespace Tti\Tux\Components;

final class TuxTestimonial
{
    public string $items;
    public string $layout = grid;
    public string $columns = 3;
    public string $variant = default;

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
            '<ul class="tux-testimonial">%s</ul>',
            $content
        );
    }
}
