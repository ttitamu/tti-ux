<?php
/**
 * TuxSegmentedInput — PHP & WordPress / Kadence component renderer.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
namespace Tti\Tux\Components;

final class TuxSegmentedInput
{
    public ?string $modelValue = null;
    public ?string $segments = null;
    public string $separator = '-';
    public ?string $label = null;
    public ?string $helpText = null;
    public bool $uppercase = true;
    public bool $disabled = false;

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
            '<div class="tux-segmented-input">%s</div>',
            $content
        );
    }
}
