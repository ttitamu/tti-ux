<?php
/**
 * TuxStepper — PHP & WordPress / Kadence component renderer.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
namespace Tti\Tux\Components;

final class TuxStepper
{
    public ?string $steps = null;
    public int $currentIndex = 0;
    public string $orientation = 'horizontal';
    public bool $showDescriptions = true;
    public string $ariaLabel = 'Progress';
    public string $stationFormat = 'number';
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
            '<nav class="tux-stepper">%s</nav>',
            $content
        );
    }
}
