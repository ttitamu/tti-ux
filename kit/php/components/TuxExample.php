<?php
/**
 * TuxExample — PHP & WordPress / Kadence component renderer.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
namespace Tti\Tux\Components;

final class TuxExample
{
    public ?string $vue = null;
    public ?string $react = null;
    public ?string $wc = null;
    public ?string $razor = null;
    public ?string $python = null;
    public ?string $php = null;
    public ?string $swift = null;
    public ?string $kotlin = null;
    public ?string $source = null;
    public ?string $css = null;
    public ?string $powerbi = null;
    public ?string $title = null;
    public string $previewPadding = 'p-6';

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
            '<div class="tux-example">%s</div>',
            $content
        );
    }
}
