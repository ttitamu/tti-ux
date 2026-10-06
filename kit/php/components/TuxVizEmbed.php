<?php
/**
 * TuxVizEmbed — PHP & WordPress / Kadence component renderer.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
namespace Tti\Tux\Components;

final class TuxVizEmbed
{
    public string $src;
    public string $provider = 'generic';
    public string $title;
    public string $eyebrow = 'undefined';
    public string $ratio = '16/9';
    public string $sandbox = 'undefined';
    public string $referrerpolicy = 'strict-origin-when-cross-origin';
    public bool $openInNew = true;
    public string $posterSrc = 'undefined';
    public string $posterAlt;

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
            '<figure class="tux-viz-embed">%s</figure>',
            $content
        );
    }
}
