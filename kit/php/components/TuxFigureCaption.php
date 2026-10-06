<?php
/**
 * TuxFigureCaption — PHP & WordPress / Kadence component renderer.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
namespace Tti\Tux\Components;

final class TuxFigureCaption
{
    public string $label = 'Figure';
    public string $number;
    public string $caption = 'undefined';
    public string $source = 'undefined';
    public string $placement = below;

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
            '<figure class="tux-figure-caption">%s</figure>',
            $content
        );
    }
}
