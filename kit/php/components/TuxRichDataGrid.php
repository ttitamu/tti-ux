<?php
/**
 * TuxRichDataGrid — PHP & WordPress / Kadence component renderer.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
namespace Tti\Tux\Components;

final class TuxRichDataGrid
{
    public string $columns;
    public string $rows;
    public string $rowKey = 'id';
    public string $title = 'undefined';
    public string $meta = 'undefined';
    public string $searchPlaceholder = 'Search…';
    public bool $showSearch = true;
    public bool $showFilter = true;
    public bool $showColumns = true;
    public bool $showExport = true;
    public string $filters = '()';
    public string $selected = ();
    public bool $selectionDisabled = false;
    public string $bulkActions = '()';
    public string $expanded = ();
    public bool $expansionDisabled = false;
    public string $sortKey = 'undefined';
    public string $sortDir = undefined;
    public string $maxHeight = '440px';
    public bool $virtualized = false;
    public int $virtualRowHeight = 44;
    public string $density = comfortable;
    public string $paginationLabel;
    public string $paginationTokens = '()';

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
            '<div class="tux-rich-data-grid">%s</div>',
            $content
        );
    }
}
