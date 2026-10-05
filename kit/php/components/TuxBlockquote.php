<?php
/**
 * TuxBlockquote — PHP & WordPress / Kadence component renderer.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
namespace Tti\Tux\Components;

final class TuxBlockquote
{
    public string $quote;
    public string $attribution = null;
    public string $role = null;
    public string $layout = centered;
    public string $variant = default;

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
            '<figure class="tux-blockquote">%s</figure>',
            $content
        );
    }
}
