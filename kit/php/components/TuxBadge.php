<?php
/**
 * TuxBadge — PHP & WordPress / Kadence component renderer.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
namespace Tti\Tux\Components;

final class TuxBadge
{
    public string $tier;
    public string $status;
    public string $tone;
    public string $kind = 'default';
    public string $variant;
    public bool $bold = false;
    public bool $dot = false;
    public string $icon;
    public string $count;
    public string $label;
    public bool $uppercase = false;
    public string $shape = 'default';
    public bool $glyph = false;
    public string $los;
    public string $division;

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
            '<div class="tux-badge">%s</div>',
            $content
        );
    }
}
