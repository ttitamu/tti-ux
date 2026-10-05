<?php
/**
 * TuxCodeBlock — PHP & WordPress / Kadence component renderer.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
namespace Tti\Tux\Components;

final class TuxCodeBlock
{
    public string $code;
    public string $lang = text;
    public string $filename = 'undefined';
    public bool $lineNumbers = false;
    public bool $noCopy = false;
    public bool $noDownload = false;

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
            '<figure class="tux-code-block">%s</figure>',
            $content
        );
    }
}
