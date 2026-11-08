<?php
/**
 * TuxProportionalInput — PHP & WordPress / Kadence component renderer.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
namespace Tti\Tux\Components;

final class TuxProportionalInput
{
    public ?string $modelValue = null;
    public int $targetTotal = 100;
    public string $unit = '%';
    public int $decimals = 1;
    public int $step = 1;
    public ?string $title = null;

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
            '<div class="tux-proportional-input">%s</div>',
            $content
        );
    }
}
