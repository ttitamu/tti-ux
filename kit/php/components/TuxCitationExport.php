<?php
/**
 * TuxCitationExport — PHP & WordPress / Kadence component renderer.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
namespace Tti\Tux\Components;

final class TuxCitationExport
{
    public string $citation;
    public string $label = 'Cite';
    public string $variant = outline;

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
            '<UDropdownMenu class="tux-citation-export">%s</UDropdownMenu>',
            $content
        );
    }
}
