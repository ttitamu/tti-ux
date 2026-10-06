<?php
/**
 * TuxChartFrame — PHP & WordPress / Kadence component renderer.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
namespace Tti\Tux\Components;

final class TuxChartFrame
{
    public string $eyebrow;
    public string $title;
    public string $subtitle;
    public string $source;
    public string $notes;
    public bool $bare = false;

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
            '<figure class="tux-chart-frame">%s</figure>',
            $content
        );
    }
}
