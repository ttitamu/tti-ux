<?php
/**
 * TuxReactionBar — PHP & WordPress / Kadence component renderer.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
namespace Tti\Tux\Components;

final class TuxReactionBar
{
    public ?string $modelValue = null;
    public ?string $reactions = null;
    public ?string $counts = null;
    public string $size = 'md';

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
            '<div class="tux-reaction-bar">%s</div>',
            $content
        );
    }
}
