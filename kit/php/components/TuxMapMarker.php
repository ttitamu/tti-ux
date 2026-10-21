<?php
/**
 * TuxMapMarker — PHP & WordPress / Kadence component renderer.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
namespace Tti\Tux\Components;

final class TuxMapMarker
{
    public ?string $kind = null;
    public ?string $number = null;
    public ?int $toneIndex = null;
    public string $size = 'md';
    public ?string $title = null;

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
            '<svg class="tux-map-marker">%s</svg>',
            $content
        );
    }
}
