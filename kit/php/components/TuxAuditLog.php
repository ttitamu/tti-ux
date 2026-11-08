<?php
/**
 * TuxAuditLog — PHP & WordPress / Kadence component renderer.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
namespace Tti\Tux\Components;

final class TuxAuditLog
{
    public string $title = 'Immutable Governance Audit Log';
    public ?string $entries = null;
    public bool $searchable = true;
    public string $initialCategory = 'all';
    public bool $exportable = true;

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
            '<section class="tux-audit-log">%s</section>',
            $content
        );
    }
}
