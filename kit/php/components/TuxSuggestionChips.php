<?php
/**
 * TuxSuggestionChips — PHP & WordPress / Kadence component renderer.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
namespace Tti\Tux\Components;

final class TuxSuggestionChips
{
    public ?string $items = null;
    public ?string $label = null;
    public ?string $ariaLabel = null;
    public bool $noArrow = false;

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
            '<section class="tux-suggestion-chips">%s</section>',
            $content
        );
    }
}
