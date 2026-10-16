<?php
/**
 * TuxCodeMaroon — PHP & WordPress / Kadence component renderer.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
namespace Tti\Tux\Components;

final class TuxCodeMaroon
{
    public bool $active = false;
    public string $tone = 'error';
    public string $title;
    public string $message;
    public string $detailsUrl = 'https://tti.tamu.edu/emergency/';
    public string $detailsLabel;
    public bool $dismissible = false;
    public bool $modelValue = false;
    public bool $sticky = false;

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
            '<div class="tux-code-maroon">%s</div>',
            $content
        );
    }
}
