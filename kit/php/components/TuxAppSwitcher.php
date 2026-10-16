<?php
/**
 * TuxAppSwitcher — PHP & WordPress / Kadence component renderer.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
namespace Tti\Tux\Components;

final class TuxAppSwitcher
{
    public string $apps;
    public string $ariaLabel;
    public string $heading;
    public string $footerText;
    public string $presentation = 'popover';

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
            '<div class="tux-app-switcher">%s</div>',
            $content
        );
    }
}
