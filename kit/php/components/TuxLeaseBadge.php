<?php
/**
 * TuxLeaseBadge — PHP & WordPress / Kadence component renderer.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
namespace Tti\Tux\Components;

final class TuxLeaseBadge
{
    public ?string $label = null;
    public ?int $remainingHours = null;
    public ?string $expiresLabel = null;
    public int $warningHours = 72;
    public bool $extendable = false;
    public bool $releasable = false;
    public string $extendLabel = 'Extend';
    public string $releaseLabel = 'Release';

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
            '<div class="tux-lease-badge">%s</div>',
            $content
        );
    }
}
