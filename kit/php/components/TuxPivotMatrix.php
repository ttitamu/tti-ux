<?php
/**
 * TuxPivotMatrix — PHP & WordPress / Kadence component renderer.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
namespace Tti\Tux\Components;

final class TuxPivotMatrix
{
    public ?string $caption = null;
    public ?string $rowLabels = null;
    public ?string $colLabels = null;
    public ?string $values = null;
    public string $rowHeaderLabel = 'Category';
    public string $valuePrefix = '';
    public string $valueSuffix = '';
    public int $decimals = 0;
    public bool $shaded = true;

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
            '<div class="tux-pivot-matrix">%s</div>',
            $content
        );
    }
}
