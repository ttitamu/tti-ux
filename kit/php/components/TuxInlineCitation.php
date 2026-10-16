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
    public string $href;
    public string $excerpt;
    public string $score;
    public string $label;

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
            '<div class="tux-inline-citation">%s</div>',
            $content
        );
    }
}
