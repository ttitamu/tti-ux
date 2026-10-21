<?php
/**
 * TuxPlayground — PHP & WordPress / Kadence component renderer.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
namespace Tti\Tux\Components;

final class TuxPlayground
{
    public ?string $tag = null;
    public ?string $componentName = null;
    public ?string $controls = null;
    public ?string $presets = null;
    public string $title = 'Interactive Props Workbench';
    public string $eyebrow = 'Live Component Playground';
    public ?string $slotProp = null;
    public ?string $defaultSlotText = null;
    public bool $selfClosing = false;
    public ?string $codeTemplate = null;
    public ?string $source = null;
    public ?string $powerbi = null;
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
