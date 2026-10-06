<?php
/**
 * TuxBetaRibbon — PHP & WordPress / Kadence component renderer.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
namespace Tti\Tux\Components;

final class TuxBetaRibbon
{
    public string $variant = 'corner';
    public string $kind = 'preview';
    public string $label = 'undefined';
    public string $corner = 'top-right';
    public string $message = 'undefined';

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
            '<div class="tux-beta-ribbon">%s</div>',
            $content
        );
    }
}
