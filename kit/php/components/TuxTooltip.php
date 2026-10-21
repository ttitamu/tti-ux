<?php
/**
 * TuxTooltip — PHP & WordPress / Kadence component renderer.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
namespace Tti\Tux\Components;

final class TuxTooltip
{
    public ?string $text = null;
    public ?string $title = null;
    public ?string $kbds = null;
    public string $side = 'top';
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
            '<div class="tux-tooltip">%s</div>',
            $content
        );
    }
}
