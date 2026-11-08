<?php
/**
 * TuxPeriodPicker — PHP & WordPress / Kadence component renderer.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
namespace Tti\Tux\Components;

final class TuxPeriodPicker
{
    public ?string $modelValue = null;
    public ?string $presets = null;
    public ?string $label = null;
    public bool $allowCompare = true;
    public ?int $stepDays = null;

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
            '<div class="tux-period-picker">%s</div>',
            $content
        );
    }
}
