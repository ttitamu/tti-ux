<?php
/**
 * TuxCenterBadge — PHP & WordPress / Kadence component renderer.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
namespace Tti\Tux\Components;

final class TuxCenterBadge
{
    public string $center;
    public string $label;
    public string $icon;
    public int $toneIndex = 2;
    public bool $short = false;
    public string $size = 'md';
    public string $layout = 'chip';

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
            '<span class="tux-center-badge">%s</span>',
            $content
        );
    }
}
