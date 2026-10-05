<?php
/**
 * TuxRecordHighlights — PHP & WordPress / Kadence component renderer.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
namespace Tti\Tux\Components;

final class TuxRecordHighlights
{
    public string $title;
    public string $eyebrow = 'undefined';
    public string $icon = 'undefined';
    public string $items = '()';

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
            '<div class="tux-record-highlights">%s</div>',
            $content
        );
    }
}
