<?php
/**
 * TuxExample — PHP & WordPress / Kadence component renderer.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
namespace Tti\Tux\Components;

final class TuxExample
{
    public string $vue = 'undefined';
    public string $react = 'undefined';
    public string $wc = 'undefined';
    public string $razor = 'undefined';
    public string $source = 'undefined';
    public string $css = 'undefined';
    public string $powerbi = 'undefined';
    public string $title = 'undefined';
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
