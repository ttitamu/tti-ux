<?php
/**
 * TuxEntityPicker — PHP & WordPress / Kadence component renderer.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
namespace Tti\Tux\Components;

final class TuxEntityPicker
{
    public ?string $modelValue = null;
    public ?string $options = null;
    public ?string $label = null;
    public string $placeholder = 'Search by code, title, or owner…';
    public bool $clearable = true;

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
            '<div class="tux-entity-picker">%s</div>',
            $content
        );
    }
}
