<?php
/**
 * TuxAlphaNav — PHP & WordPress / Kadence component renderer.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
namespace Tti\Tux\Components;

final class TuxAlphaNav
{
    public string $letters = '()';
    public string $available = 'undefined';
    public string $mode = anchor;
    public bool $sticky = false;
    public bool $showAll = false;
    public string $modelValue = null;
    public string $ariaLabel = 'Jump';

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
            '<nav class="tux-alpha-nav">%s</nav>',
            $content
        );
    }
}
