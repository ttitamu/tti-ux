<?php
/**
 * TuxEmptyState — PHP & WordPress / Kadence component renderer.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
namespace Tti\Tux\Components;

final class TuxEmptyState
{
    public string $kind = 'undefined';
    public string $icon = 'undefined';
    public string $title = 'undefined';
    public string $description = 'undefined';
    public bool $noCard = false;
    public bool $compact = false;

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
            '<div class="tux-empty-state">%s</div>',
            $content
        );
    }
}
