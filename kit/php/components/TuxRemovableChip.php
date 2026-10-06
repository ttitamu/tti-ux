<?php
/**
 * TuxRemovableChip — PHP & WordPress / Kadence component renderer.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
namespace Tti\Tux\Components;

final class TuxRemovableChip
{
    public string $icon = 'undefined';
    public bool $removable = false;
    public string $size = md;
    public bool $selected = false;
    public bool $disabled = false;
    public string $removeLabel = 'undefined';
    public bool $clickToRemove = false;

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
            '<span class="tux-removable-chip">%s</span>',
            $content
        );
    }
}
