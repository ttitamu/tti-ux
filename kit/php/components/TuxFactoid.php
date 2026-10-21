<?php
/**
 * TuxFactoid — PHP & WordPress / Kadence component renderer.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
namespace Tti\Tux\Components;

final class TuxFactoid
{
    public ?string $items = null;
    public string $variant = 'default';
    public int $columns = 3;
    public ?string $eyebrow = null;
    public ?string $title = null;
    public ?string $dek = null;

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
            '<section class="tux-factoid">%s</section>',
            $content
        );
    }
}
