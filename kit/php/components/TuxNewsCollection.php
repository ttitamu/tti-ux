<?php
/**
 * TuxNewsCollection — PHP & WordPress / Kadence component renderer.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
namespace Tti\Tux\Components;

final class TuxNewsCollection
{
    public string $items;
    public string $layout = stacked;
    public string $columns = 3;
    public string $readMore = 'Read';

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
            '<ul class="tux-news-collection">%s</ul>',
            $content
        );
    }
}
