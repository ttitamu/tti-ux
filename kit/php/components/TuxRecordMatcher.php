<?php
/**
 * TuxRecordMatcher — PHP & WordPress / Kadence component renderer.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
namespace Tti\Tux\Components;

final class TuxRecordMatcher
{
    public ?string $items = null;
    public bool $allowRuleCreation = true;
    public string $ruleCheckboxLabel = 'Remember this mapping rule for future records';
    public string $acceptLabel = 'Confirm Match';
    public string $dismissLabel = 'Defer';

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
            '<div class="tux-record-matcher">%s</div>',
            $content
        );
    }
}
