<?php
/**
 * TuxAvatar — PHP & WordPress / Kadence component renderer.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
namespace Tti\Tux\Components;

final class TuxAvatar
{
    public string $name;
    public string $initials;
    public string $photoUrl;
    public string $size = 'md';
    public string $dot;
    public bool $decorative = true;
    public string $alt;

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
            '<span class="tux-avatar">%s</span>',
            $content
        );
    }
}
