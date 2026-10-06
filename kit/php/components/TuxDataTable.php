<?php
/**
 * TuxDataTable — PHP & WordPress / Kadence component renderer.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
namespace Tti\Tux\Components;

final class TuxDataTable
{
    public string $columns;
    public string $rows = '()';
    public string $groups = '()';
    public string $rowKey = 'id';
    public string $tableNumber;
    public string $caption;
    public string $description;
    public string $sortKey = 'undefined';
    public string $sortDir = undefined;
    public bool $sticky = false;
    public string $maxHeight = '20rem';
    public string $density = comfortable;
    public bool $banded = true;
    public string $footnotes = '()';
    public string $source;
    public string $totals = 'undefined';

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
            '<figure class="tux-data-table">%s</figure>',
            $content
        );
    }
}
