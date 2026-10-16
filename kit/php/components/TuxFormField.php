<?php
/**
 * TuxFormField — PHP & WordPress / Kadence component renderer.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
namespace Tti\Tux\Components;

final class TuxFormField
{
    public string $label;
    public string $help;
    public string $hint;
    public string $error;
    public bool $required = false;
    public string $inputId;
    public string $layout = 'stacked';

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
