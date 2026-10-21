<?php
/**
 * TuxBadge — PHP & WordPress / Kadence component renderer.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
namespace Tti\Tux\Components;

final class TuxBadge
{
    public ?string $tier = null;
    public ?string $status = null;
    public ?string $tone = null;
    public string $kind = 'default';
    public ?string $variant = null;
    public bool $bold = false;
    public bool $dot = false;
    public ?string $icon = null;
    public ?string $count = null;
    public ?string $label = null;
    public bool $uppercase = false;
    public string $shape = 'default';
    public bool $glyph = false;
    public ?string $los = null;
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
            '<div class="tux-badge">%s</div>',
            $content
        );
    }
}
