<?php
/**
 * TuxToolCall — PHP & WordPress / Kadence component renderer.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
namespace Tti\Tux\Components;

final class TuxToolCall
{
    public ?string $verb = null;
    public ?string $arg = null;
    public string $status = 'completed';
    public ?int $elapsedMs = null;
    public ?string $diff = null;
    public ?string $icon = null;
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
