<?php
/**
 * TuxMapEmbed — PHP & WordPress / Kadence component renderer.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
namespace Tti\Tux\Components;

final class TuxMapEmbed
{
    public string $src;
    public string $eyebrow;
    public string $title;
    public string $subtitle;
    public string $source;
    public string $aspect = '16/9';
    public int $height;
    public string $iframeTitle;
    public bool $attribution = true;
    public bool $skeleton = true;

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
            '<figure class="tux-map-embed">%s</figure>',
            $content
        );
    }
}
