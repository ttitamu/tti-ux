<?php
/**
 * TuxBadge — PHP & WordPress / Kadence component renderer.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
namespace Tti\Tux\Components;

final class TuxBadge
{
    public string $tier = 'undefined';
    public string $status = 'undefined';
    public string $tone = 'undefined';
    public string $kind = 'default';
    public string $variant = 'undefined';
    public bool $bold = false;
    public bool $dot = false;
    public string $icon = 'undefined';
    public string $count = undefined;
    public string $label = 'undefined';
    public bool $uppercase = false;

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
            '<UBadge class="tux-badge">%s</UBadge>',
            $content
        );
    }
}
