<?php
/**
 * TuxKeyValueInput — PHP & WordPress / Kadence component renderer.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
namespace Tti\Tux\Components;

final class TuxKeyValueInput
{
    public ?string $modelValue = null;
    public ?string $schema = null;
    public bool $strictKeys = false;
    public string $keyPlaceholder = 'key';
    public string $valuePlaceholder = 'value';
    public string $addLabel = 'Add attribute';

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
            '<div class="tux-key-value-input">%s</div>',
            $content
        );
    }
}
