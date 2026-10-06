<?php
/**
 * TuxPlayground — PHP & WordPress / Kadence component renderer.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
namespace Tti\Tux\Components;

final class TuxPlayground
{
    public string $tag = 'undefined';
    public string $componentName = 'undefined';
    public string $controls;
    public string $presets = '()';
    public string $title = 'Interactive';
    public string $eyebrow = 'Live';
    public string $slotProp = 'undefined';
    public string $defaultSlotText = 'undefined';
    public bool $selfClosing = false;
    public string $codeTemplate = 'undefined';
    public string $previewPadding = 'p-8';
    public bool $enableDeepLinking = true;

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
            '<div class="tux-playground">%s</div>',
            $content
        );
    }
}
