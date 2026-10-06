<?php
/**
 * TuxSkeleton — PHP & WordPress / Kadence component renderer.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
namespace Tti\Tux\Components;

final class TuxSkeleton
{
    public string $kind = 'primitive';
    public string $variant = 'block';
    public string $width = '100%';
    public string $height = 'undefined';
    public string $radius = 'undefined';
    public int $count = 3;
    public string $animated = 'shimmer';
    public string $label = 'Loading…';

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
            '<div class="tux-skeleton">%s</div>',
            $content
        );
    }
}
