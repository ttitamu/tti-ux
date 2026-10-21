<?php
/**
 * TuxGroundedSources — PHP & WordPress / Kadence component renderer.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
namespace Tti\Tux\Components;

final class TuxGroundedSources
{
    public ?string $sources = null;
    public string $dlpLabel = 'Zero-PII DLP Verified';

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
            '<div class="tux-grounded-sources">%s</div>',
            $content
        );
    }
}
