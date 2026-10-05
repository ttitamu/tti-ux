<?php
/**
 * TuxSparkline — PHP & WordPress / Kadence component renderer.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
namespace Tti\Tux\Components;

final class TuxSparkline
{
    public string $data;
    public int $width = 120;
    public int $height = 32;
    public string $tone = 'brand';
    public int $strokeWidth = 1.5;
    public bool $showArea = false;
    public bool $showLastPoint = true;
    public bool $showDelta = false;
    public string $deltaFormat = percent;
    public string $ariaSummary = 'undefined';
    public string $units = 'undefined';

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
            '<span class="tux-sparkline">%s</span>',
            $content
        );
    }
}
