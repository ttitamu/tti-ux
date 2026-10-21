<?php
/**
 * TuxFormField — PHP & WordPress / Kadence component renderer.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
namespace Tti\Tux\Components;

final class TuxFormField
{
    public ?string $label = null;
    public ?string $help = null;
    public ?string $hint = null;
    public ?string $error = null;
    public bool $required = false;
    public ?string $inputId = null;
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
