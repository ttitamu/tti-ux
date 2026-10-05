<?php
/**
 * TuxTooltip — PHP & WordPress / Kadence component renderer.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
namespace Tti\Tux\Components;

final class TuxTooltip
{
    public string $text;
    public string $title = 'undefined';
    public string $kbds = 'undefined';
    public string $side = top;
    public bool $arrow = true;
    public bool $disabled = false;

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
            '<TooltipProvider class="tux-tooltip">%s</TooltipProvider>',
            $content
        );
    }
}
