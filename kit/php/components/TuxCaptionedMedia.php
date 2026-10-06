<?php
/**
 * TuxCaptionedMedia — PHP & WordPress / Kadence component renderer.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
namespace Tti\Tux\Components;

final class TuxCaptionedMedia
{
    public string $src = 'undefined';
    public string $alt;
    public string $caption = 'undefined';
    public string $credit = 'undefined';
    public string $eyebrow = 'undefined';
    public string $aspect = 16/9;
    public string $align = full;
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
            '<figure class="tux-captioned-media">%s</figure>',
            $content
        );
    }
}
