<?php
/**
 * TuxAcknowledgments — PHP & WordPress / Kadence component renderer.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
namespace Tti\Tux\Components;

final class TuxAcknowledgments
{
    public ?string $funding = null;
    public ?string $acknowledgments = null;
    public ?string $conflicts = null;
    public ?string $ethics = null;
    public int $level = 4;

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
            '<section class="tux-acknowledgments">%s</section>',
            $content
        );
    }
}
