<?php
/**
 * TuxSectionHeader — PHP & WordPress / Kadence component renderer.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
namespace Tti\Tux\Components;

final class TuxSectionHeader
{
    public int $level = 2;
    public ?string $title = null;
    public ?string $secondaryTitle = null;
    public ?string $subtitle = null;
    public ?string $kicker = null;
    public string $variant = 'institutional';
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
            '<header class="tux-section-header">%s</header>',
            $content
        );
    }
}
