<?php
/**
 * TuxFormField — PHP & WordPress / Kadence component renderer.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
namespace Tti\Tux\Components;

final class TuxFormField
{
    public string $label;
    public string $help = 'undefined';
    public string $hint = 'undefined';
    public string $error = 'undefined';
    public bool $required = false;
    public string $inputId = 'undefined';
    public string $layout = stacked;

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
            '<div class="tux-form-field">%s</div>',
            $content
        );
    }
}
