<?php
/**
 * TuxThresholdBar — PHP & WordPress / Kadence component renderer.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
namespace Tti\Tux\Components;

final class TuxThresholdBar
{
    public ?string $title = null;
    public ?string $segments = null;
    public ?int $limit = null;
    public string $unit = '';
    public string $unitPosition = 'suffix';
    public int $decimals = 1;
    public float $warningRatio = 0.85;
    public bool $showLegend = true;

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
            '<div class="tux-threshold-bar">%s</div>',
            $content
        );
    }
}
