<?php
/**
 * TuxRateSchedule — PHP & WordPress / Kadence component renderer.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
namespace Tti\Tux\Components;

final class TuxRateSchedule
{
    public string $title = 'Effective-Dated Rate Schedule';
    public ?string $subtitle = null;
    public ?string $items = null;
    public string $currencySymbol = '$';
    public int $sampleQuantity = 100;
    public bool $editable = true;
    public string $statusFilter = 'all';

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
            '<section class="tux-rate-schedule">%s</section>',
            $content
        );
    }
}
