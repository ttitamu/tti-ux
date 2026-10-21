<?php
/**
 * TuxToolCall — PHP & WordPress / Kadence component renderer.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
namespace Tti\Tux\Components;

final class TuxToolCall
{
    public string $verb;
    public string $arg;
    public string $status = 'completed';
    public int $elapsedMs;
    public string $diff;
    public string $icon;
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
            '<div class="tux-tool-call">%s</div>',
            $content
        );
    }
}
