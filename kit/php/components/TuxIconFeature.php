<?php
/**
 * TuxIconFeature — PHP & WordPress / Kadence component renderer.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
namespace Tti\Tux\Components;

final class TuxIconFeature
{
    public ?string $items = null;
    public string $layout = 'grid';
    public int $columns = 3;

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
            '<ul class="tux-icon-feature">%s</ul>',
            $content
        );
    }
}
