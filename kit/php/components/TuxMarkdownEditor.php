<?php
/**
 * TuxMarkdownEditor — PHP & WordPress / Kadence component renderer.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
namespace Tti\Tux\Components;

final class TuxMarkdownEditor
{
    public string $modelValue;
    public int $rows = 12;
    public int $minLength = undefined;
    public int $maxLength = undefined;
    public string $placeholder = 'Write';
    public bool $preview = true;
    public bool $disabled = false;
    public string $ariaLabel = 'Markdown';

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
            '<div class="tux-markdown-editor">%s</div>',
            $content
        );
    }
}
