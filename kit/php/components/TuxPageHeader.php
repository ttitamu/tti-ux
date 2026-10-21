<?php
/**
 * TuxPageHeader — PHP & WordPress / Kadence component renderer.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
namespace Tti\Tux\Components;

final class TuxPageHeader
{
    public ?string $eyebrow = null;
    public ?string $title = null;
    public int $level = 1;
    public string $tone = 'plain';
    public string $rhythm = 'compact';
    public string $variant = 'default';
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
            '<header class="tux-page-header">%s</header>',
            $content
        );
    }
}
