<?php
/**
 * TuxSectionHeader — PHP & WordPress / Kadence component renderer.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
namespace Tti\Tux\Components;

final class TuxSectionHeader
{
    public int $level = 2;
    public string $title;
    public string $secondaryTitle;
    public string $subtitle;
    public string $kicker;
    public string $variant = 'institutional';

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
            '<header class="tux-section-header">%s</header>',
            $content
        );
    }
}
