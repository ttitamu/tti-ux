<?php
/**
 * TuxFootnote — PHP & WordPress / Kadence component renderer.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
namespace Tti\Tux\Components;

final class TuxFootnote
{
    public ?int $n = null;
    public ?string $text = null;
    public string $idPrefix = 'fn';

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
            '<div class="tux-footnote">%s</div>',
            $content
        );
    }
}
