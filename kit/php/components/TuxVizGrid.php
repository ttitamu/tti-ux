<?php
/**
 * TuxVizGrid — PHP & WordPress / Kadence component renderer.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
namespace Tti\Tux\Components;

final class TuxVizGrid
{
    public string $cols = '2';
    public string $eyebrow = 'undefined';
    public string $title = 'undefined';
    public string $dek = 'undefined';

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
            '<section class="tux-viz-grid">%s</section>',
            $content
        );
    }
}
