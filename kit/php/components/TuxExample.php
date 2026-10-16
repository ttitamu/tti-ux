<?php
/**
 * TuxExample — PHP & WordPress / Kadence component renderer.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
namespace Tti\Tux\Components;

final class TuxExample
{
    public string $vue;
    public string $react;
    public string $wc;
    public string $razor;
    public string $python;
    public string $php;
    public string $swift;
    public string $kotlin;
    public string $source;
    public string $css;
    public string $powerbi;
    public string $title;
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
