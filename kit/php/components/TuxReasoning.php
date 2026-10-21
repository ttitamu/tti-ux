<?php
/**
 * TuxReasoning — PHP & WordPress / Kadence component renderer.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
namespace Tti\Tux\Components;

final class TuxReasoning
{
    public int $duration = 3.4;
    public int $tokensPerSec;
    public bool $defaultOpen = false;

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
            '<div class="tux-reasoning">%s</div>',
            $content
        );
    }
}
