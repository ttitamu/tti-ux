<?php
/**
 * TuxSectionHeader — PHP & WordPress / Kadence component renderer.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
namespace Tti\Tux\Components;

final class TuxSectionHeader
{
    public string $level = 2;
    public string $title = 'undefined';
    public string $secondaryTitle = 'undefined';
    public string $subtitle = 'undefined';
    public string $kicker = 'undefined';
    public string $variant = institutional;

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
