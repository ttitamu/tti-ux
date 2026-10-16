<?php
/**
 * TuxIdentity — PHP & WordPress / Kadence component renderer.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
namespace Tti\Tux\Components;

final class TuxIdentity
{
    public string $name;
    public string $superhead;
    public string $level = 'institution';
    public string $orientation = 'horizontal';
    public string $kind = 'lockup';
    public string $href;
    public int $logoSize = 0;

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
            '<div class="tux-identity">%s</div>',
            $content
        );
    }
}
