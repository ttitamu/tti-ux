<?php
/**
 * TuxVizRPlot — PHP & WordPress / Kadence component renderer.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
namespace Tti\Tux\Components;

final class TuxVizRPlot
{
    public ?string $src = null;
    public string $kind = 'image';
    public ?string $title = null;
    public ?string $eyebrow = null;
    public string $ratio = '16/10';
    public string $alt = '';
    public ?string $src2x = null;
    public ?string $source = null;
    public int $level = 3;

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
            '<figure class="tux-viz-rplot">%s</figure>',
            $content
        );
    }
}
