<?php
/**
 * TuxRecordDiff — PHP & WordPress / Kadence component renderer.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
namespace Tti\Tux\Components;

final class TuxRecordDiff
{
    public ?string $fields = null;
    public string $beforeLabel = 'Baseline';
    public string $afterLabel = 'Current';
    public bool $changesOnlyDefault = false;
    public ?string $title = null;

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
            '<div class="tux-record-diff">%s</div>',
            $content
        );
    }
}
