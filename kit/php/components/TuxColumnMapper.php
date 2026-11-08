<?php
/**
 * TuxColumnMapper — PHP & WordPress / Kadence component renderer.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
namespace Tti\Tux\Components;

final class TuxColumnMapper
{
    public ?string $sourceColumns = null;
    public ?string $sampleRows = null;
    public ?string $targetFields = null;
    public ?string $modelValue = null;
    public string $confirmLabel = 'Apply Mapping';

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
            '<div class="tux-column-mapper">%s</div>',
            $content
        );
    }
}
