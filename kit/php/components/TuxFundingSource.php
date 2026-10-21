<?php
/**
 * TuxFundingSource — PHP & WordPress / Kadence component renderer.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
namespace Tti\Tux\Components;

final class TuxFundingSource
{
    public ?string $funder = null;
    public ?string $abbrev = null;
    public ?string $logo = null;
    public ?string $grant = null;
    public ?string $to = null;
    public string $size = 'md';
    public string $layout = 'inline';

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
            '<div class="tux-funding-source">%s</div>',
            $content
        );
    }
}
