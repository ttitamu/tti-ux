<?php
/**
 * TuxComposer — PHP & WordPress / Kadence component renderer.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
namespace Tti\Tux\Components;

final class TuxComposer
{
    public string $modelValue;
    public string $placeholder = 'Ask';
    public string $models = '()';
    public string $modelId = 'undefined';
    public int $maxLength = 32000;
    public string $hint = '⌘↵';
    public bool $hideAttach = false;
    public string $attachLabel = 'Attach';
    public string $attachIcon = 'lucide:plus';
    public bool $cancelable = false;
    public string $cancelLabel = 'Cancel';

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
            '<div class="tux-composer">%s</div>',
            $content
        );
    }
}
