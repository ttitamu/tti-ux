<?php
/**
 * TuxCommandPalette — PHP & WordPress / Kadence component renderer.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
namespace Tti\Tux\Components;

final class TuxCommandPalette
{
    public string $groups;
    public string $placeholder = 'Type';
    public bool $disableHotkey = false;
    public string $hotkey = 'k';
    public bool $showTabs = true;
    public string $defaultTab = 'all';

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
            '<dialog class="tux-command-palette">%s</dialog>',
            $content
        );
    }
}
