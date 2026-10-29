<?php
/**
 * TuxStageBoard — PHP & WordPress / Kadence component renderer.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
namespace Tti\Tux\Components;

final class TuxStageBoard
{
    public ?string $stages = null;
    public ?string $items = null;
    public string $metricPrefix = '';
    public string $metricSuffix = '';
    public int $decimals = 0;
    public bool $movable = true;

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
            '<div class="tux-stage-board">%s</div>',
            $content
        );
    }
}
