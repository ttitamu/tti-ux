<?php
/**
 * TuxAppSwitcher — PHP & WordPress / Kadence component renderer.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
namespace Tti\Tux\Components;

final class TuxAppSwitcher
{
    public string $apps;
    public string $ariaLabel = 'Switch';
    public string $heading = 'TTI';
    public string $footerText = 'undefined';
    public string $presentation = popover;

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
            '<UPopover class="tux-app-switcher">%s</UPopover>',
            $content
        );
    }
}
