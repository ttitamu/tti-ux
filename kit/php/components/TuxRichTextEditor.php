<?php
/**
 * TuxRichTextEditor — PHP & WordPress / Kadence component renderer.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
namespace Tti\Tux\Components;

final class TuxRichTextEditor
{
    public string $modelValue;
    public string $placeholder = 'Start';
    public bool $disabled = false;
    public string $minHeight = '12rem';
    public string $maxHeight = 'auto';
    public string $toolbar = ();
    public string $headingLevels = ();
    public bool $showCount = true;
    public bool $fullscreenable = true;
    public string $ariaLabel = 'Rich';

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
            '<div class="tux-rich-text-editor">%s</div>',
            $content
        );
    }
}
