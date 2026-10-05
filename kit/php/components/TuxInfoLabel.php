<?php
/**
 * TuxInfoLabel — PHP & WordPress / Kadence component renderer.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
namespace Tti\Tux\Components;

final class TuxInfoLabel
{
    public string $for = 'undefined';
    public bool $required = false;
    public string $trigger = hover;
    public string $infoAriaLabel = 'More';

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
            '<label class="tux-info-label">%s</label>',
            $content
        );
    }
}
