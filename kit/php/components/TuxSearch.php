<?php
/**
 * TuxSearch — PHP & WordPress / Kadence component renderer.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
namespace Tti\Tux\Components;

final class TuxSearch
{
    public string $modelValue;
    public string $variant = 'field';
    public string $blockBar = 'field';
    public string $size = regular;
    public string $placeholder = 'Search';
    public string $heading = 'undefined';
    public string $lede = 'undefined';
    public string $ariaLabel = 'undefined';
    public string $actionLabel = 'Search';
    public string $actionIcon = 'undefined';
    public string $leadingIcon = lucide:search;
    public bool $clearable = true;
    public bool $loading = false;
    public bool $disabled = false;
    public bool $cornerDrop = false;
    public bool $forceFocus = false;

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
            '<div class="tux-search">%s</div>',
            $content
        );
    }
}
