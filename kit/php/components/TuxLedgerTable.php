<?php
/**
 * TuxLedgerTable — PHP & WordPress / Kadence component renderer.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
namespace Tti\Tux\Components;

final class TuxLedgerTable
{
    public ?string $caption = null;
    public ?string $groups = null;
    public string $valuePrefix = '';
    public string $valueSuffix = '';
    public int $decimals = 2;
    public bool $showQuantityRate = true;
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
            '<div class="tux-ledger-table">%s</div>',
            $content
        );
    }
}
