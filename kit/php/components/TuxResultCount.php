<?php
/**
 * TuxResultCount — PHP & WordPress / Kadence component renderer.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
namespace Tti\Tux\Components;

final class TuxResultCount
{
    public ?int $page = null;
    public ?int $pageSize = null;
    public ?int $total = null;
    public ?string $noun = null;
    public ?string $nounPlural = null;
    public ?string $pageSizeOptions = null;
    public bool $hideRange = false;
    public string $pageSizeLabel = 'per page';

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
            '<div class="tux-result-count">%s</div>',
            $content
        );
    }
}
