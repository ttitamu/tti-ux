<?php
/**
 * TuxPageContainer — PHP & WordPress / Kadence component renderer.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
namespace Tti\Tux\Components;

final class TuxPageContainer
{
    public string $width = default;
    public bool $flush = false;
    public string $as = 'div';

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
            '<component class="tux-page-container">%s</component>',
            $content
        );
    }
}
