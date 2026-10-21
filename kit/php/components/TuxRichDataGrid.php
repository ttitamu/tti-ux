<?php
/**
 * TuxRichDataGrid — PHP & WordPress / Kadence component renderer.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
namespace Tti\Tux\Components;

final class TuxRichDataGrid
{
    public ?string $columns = null;
    public ?string $rows = null;
    public string $rowKey = 'id';
    public ?string $title = null;
    public ?string $meta = null;
    public string $searchPlaceholder = 'Search…';
    public bool $showSearch = true;
    public bool $showFilter = true;
    public bool $showColumns = true;
    public bool $showExport = true;
    public ?string $filters = null;
    public ?string $selected = null;
    public bool $selectionDisabled = false;
    public ?string $bulkActions = null;
    public ?string $expanded = null;
    public bool $expansionDisabled = false;
    public ?string $sortKey = null;
    public ?string $sortDir = null;
    public string $maxHeight = '440px';
    public bool $virtualized = false;
    public int $virtualRowHeight = 44;
    public string $density = 'comfortable';
    public string $paginationLabel = '';
    public ?string $paginationTokens = null;
    public ?string $projectNumber = null;
    public ?string $doi = null;
    public ?string $citation = null;
    public bool $showUnitToggle = false;

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
