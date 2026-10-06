<?php
/**
 * TuxRuleBuilder — PHP & WordPress / Kadence component renderer.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
namespace Tti\Tux\Components;

final class TuxRuleBuilder
{
    public string $modelValue;
    public string $fields;
    public bool $showActions = true;
    public int $maxDepth = 3;

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
            '<div class="tux-rule-builder">%s</div>',
            $content
        );
    }
}
