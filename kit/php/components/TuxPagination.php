<?php
/**
 * TuxPagination — PHP & WordPress / Kadence component renderer.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
namespace Tti\Tux\Components;

final class TuxPagination
{
    public int $total;
    public int $modelValue;
    public int $pageSize = 20;
    public int $siblingCount = 1;
    public int $boundaryCount = 1;
    public bool $showStatus = false;
    public string $noun = 'result';
    public string $pluralNoun = 'undefined';
    public string $ariaLabel = 'Pagination';

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
            '<nav class="tux-pagination">%s</nav>',
            $content
        );
    }
}
