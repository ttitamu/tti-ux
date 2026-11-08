<?php
/**
 * TuxUptimeStrip — PHP & WordPress / Kadence component renderer.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
namespace Tti\Tux\Components;

final class TuxUptimeStrip
{
    public ?string $serviceName = null;
    public ?string $serviceGroup = null;
    public ?string $buckets = null;
    public string $windowLabel = 'Last 30 days';
    public float $slaTargetPct = 99.9;
    public ?int $currentLatencyMs = null;

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
            '<div class="tux-uptime-strip">%s</div>',
            $content
        );
    }
}
