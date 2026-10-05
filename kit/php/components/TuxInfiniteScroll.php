<?php
/**
 * TuxInfiniteScroll — PHP & WordPress / Kadence component renderer.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
namespace Tti\Tux\Components;

final class TuxInfiniteScroll
{
    public int $loaded;
    public int $total;
    public bool $loading = false;
    public bool $keyboardFallback = false;
    public string $rootMargin = '200px';
    public string $noun = 'undefined';
    public string $nounPlural = 'undefined';

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
            '<div class="tux-infinite-scroll">%s</div>',
            $content
        );
    }
}
