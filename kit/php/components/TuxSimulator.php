<?php
/**
 * TuxSimulator — PHP & WordPress / Kadence component renderer.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
namespace Tti\Tux\Components;

final class TuxSimulator
{
    public string $title = 'Workload & Cost Simulator';
    public ?string $subtitle = null;
    public ?string $parameters = null;
    public ?string $presets = null;
    public string $primaryLabel = 'Proposed Pool';
    public string $comparisonLabel = 'Baseline Pool';
    public int $budgetLimit = 0;
    public string $currencySymbol = '$';
    public bool $showComparison = true;

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
            '<section class="tux-simulator">%s</section>',
            $content
        );
    }
}
