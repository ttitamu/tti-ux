<?php
/**
 * TuxStatementSheet — PHP & WordPress / Kadence component renderer.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
namespace Tti\Tux\Components;

final class TuxStatementSheet
{
    public ?string $statementId = null;
    public string $title = 'Resource Chargeback Statement';
    public ?string $periodLabel = null;
    public ?string $issueDate = null;
    public string $status = 'settled';
    public ?string $issuer = null;
    public ?string $recipient = null;
    public ?string $lines = null;
    public ?string $adjustments = null;
    public ?string $approvals = null;
    public ?string $remittanceRef = null;
    public ?string $digest = null;
    public string $currencySymbol = '$';
    public bool $showPrintAction = true;

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
            '<article class="tux-statement-sheet">%s</article>',
            $content
        );
    }
}
