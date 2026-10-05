<?php
/**
 * TuxFileDropzone — PHP & WordPress / Kadence component renderer.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
namespace Tti\Tux\Components;

final class TuxFileDropzone
{
    public string $modelValue = '()';
    public string $accept = 'undefined';
    public bool $multiple = false;
    public int $maxSize = 50;
    public int $maxFiles = 10;
    public bool $disabled = false;
    public string $label = 'undefined';
    public string $hint = 'undefined';

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
            '<div class="tux-file-dropzone">%s</div>',
            $content
        );
    }
}
