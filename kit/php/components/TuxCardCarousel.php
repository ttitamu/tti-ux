<?php
/**
 * TuxCardCarousel — PHP & WordPress / Kadence component renderer.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
namespace Tti\Tux\Components;

final class TuxCardCarousel
{
    public string $items = 'undefined';
    public string $eyebrow = 'undefined';
    public string $title = 'undefined';
    public bool $bare = false;
    public bool $arrows = true;
    public bool $dots = false;
    public bool $loop = false;
    public int $slidesToScroll = 1;
    public string $align = start;
    public string $gap = '1rem';
    public string $ariaLabel = 'Carousel';

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
            '<div class="tux-card-carousel">%s</div>',
            $content
        );
    }
}
