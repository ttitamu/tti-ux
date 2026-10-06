<?php
/**
 * TuxTOC — PHP & WordPress / Kadence component renderer.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
namespace Tti\Tux\Components;

final class TuxTOC
{
    public string $items = 'undefined';
    public string $target = 'article';
    public string $levels = '()';
    public string $title = 'On';
    public bool $noTitle = false;
    public string $variant = comm;

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
            '<nav class="tux-toc">%s</nav>',
            $content
        );
    }
}
