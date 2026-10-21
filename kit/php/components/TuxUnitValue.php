<?php
/**
 * TuxUnitValue — PHP & WordPress / Kadence component renderer.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
namespace Tti\Tux\Components;

final class TuxUnitValue
{
    public ?int $value = null;
    public ?string $unit = null;
    public ?int $ci = null;
    public ?int $decimals = null;
    public string $label = '';
    public string $station = '';
    public string $variant = 'inline';
    public bool $interactive = false;
    public ?string $system = null;
    public ?string $division = null;

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
            '<span class="tux-unit-value">%s</span>',
            $content
        );
    }
}
