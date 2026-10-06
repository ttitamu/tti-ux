<?php
/**
 * TuxValidationSummary — PHP & WordPress / Kadence component renderer.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
namespace Tti\Tux\Components;

final class TuxValidationSummary
{
    public string $errors;
    public string $title = 'Please';
    public string $variant = error;

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
            '<div class="tux-validation-summary">%s</div>',
            $content
        );
    }
}
