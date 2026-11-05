<?php
/**
 * TuxAnomalyCard — PHP & WordPress / Kadence component renderer.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
namespace Tti\Tux\Components;

final class TuxAnomalyCard
{
    public string $id = 'anomaly-card';
    public ?string $title = null;
    public ?string $metricLabel = null;
    public ?string $currentValue = null;
    public ?string $baselineLabel = null;
    public ?string $deltaLabel = null;
    public ?string $projectionLabel = null;
    public string $severity = 'critical';
    public string $state = 'open';
    public ?string $ruleSummary = null;
    public ?string $series = null;
    public ?string $targetEntity = null;

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
            '<article class="tux-anomaly-card">%s</article>',
            $content
        );
    }
}
