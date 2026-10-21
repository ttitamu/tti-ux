<?php
/**
 * TuxBigStat — PHP & WordPress / Kadence component renderer.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
namespace Tti\Tux\Components;

final class TuxBigStat
{
    public ?string $value = null;
    public ?string $suffix = null;
    public ?string $label = null;
    public ?string $source = null;
    public string $variant = 'default';
    public string $tone = 'maroon';
    public string $size = 'md';
    public ?string $sampleSize = null;
    public ?string $confidenceInterval = null;
    public ?string $doi = null;
    public ?string $division = null;

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
            '<div class="tux-big-stat">%s</div>',
            $content
        );
    }
}
