<?php
/**
 * TuxInlineCitation — PHP & WordPress / Kadence component renderer.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
namespace Tti\Tux\Components;

final class TuxInlineCitation
{
    public int $n;
    public string $title;
    public string $href = 'undefined';
    public string $excerpt = 'undefined';
    public string $score = undefined;
    public string $label = 'undefined';

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
            '<UPopover class="tux-inline-citation">%s</UPopover>',
            $content
        );
    }
}
