<?php
/**
 * TuxLoadMore — PHP & WordPress / Kadence component renderer.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
namespace Tti\Tux\Components;

final class TuxLoadMore
{
    public int $loaded;
    public int $total;
    public bool $loading = false;
    public string $noun;
    public string $nounPlural;
    public string $label;
    public string $terminalLabel;

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
            '<div class="tux-load-more">%s</div>',
            $content
        );
    }
}
