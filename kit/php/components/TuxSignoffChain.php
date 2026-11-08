<?php
/**
 * TuxSignoffChain — PHP & WordPress / Kadence component renderer.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
namespace Tti\Tux\Components;

final class TuxSignoffChain
{
    public ?string $stages = null;
    public ?string $activeStageId = null;
    public ?string $attestationText = null;
    public ?string $decisionOptions = null;
    public string $decisionLabel = 'Continuation Decision';
    public ?string $modelValue = null;
    public bool $showActions = true;
    public string $approveLabel = 'Approve & Sign Off';
    public string $rejectLabel = 'Return for Revision';

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
            '<div class="tux-signoff-chain">%s</div>',
            $content
        );
    }
}
