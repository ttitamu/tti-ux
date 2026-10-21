<?php
/**
 * TuxInlineCitation — PHP & WordPress / Kadence component renderer.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
namespace Tti\Tux\Components;

final class TuxInlineCitation
{
    public ?int $n = null;
    public ?string $title = null;
    public ?string $href = null;
    public ?string $excerpt = null;
    public ?string $score = null;
    public ?string $label = null;

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
