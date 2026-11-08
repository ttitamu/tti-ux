<?php
/**
 * TuxResourceMeter — PHP & WordPress / Kadence component renderer.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
namespace Tti\Tux\Components;

final class TuxResourceMeter
{
    public ?string $title = null;
    public ?string $subtitle = null;
    public string $poolStatus = 'ok';
    public ?string $channels = null;
    public float $wasteThresholdRatio = 0.35;
    public float $saturationThresholdRatio = 0.85;
    public string $reclaimLabel = 'Reclaim Idle';
    public bool $showReclaimAction = true;

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
            '<div class="tux-resource-meter">%s</div>',
            $content
        );
    }
}
