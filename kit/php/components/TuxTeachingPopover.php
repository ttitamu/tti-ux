<?php
/**
 * TuxTeachingPopover — PHP & WordPress / Kadence component renderer.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
namespace Tti\Tux\Components;

final class TuxTeachingPopover
{
    public bool $modelValue = false;
    public int $step = 1;
    public int $totalSteps = 1;
    public string $title = 'undefined';
    public bool $onBrand = false;
    public bool $noDismiss = false;
    public string $primaryLabel = 'undefined';
    public string $secondaryLabel = 'Skip';
    public bool $noSecondary = false;

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
            '<Teleport class="tux-teaching-popover">%s</Teleport>',
            $content
        );
    }
}
