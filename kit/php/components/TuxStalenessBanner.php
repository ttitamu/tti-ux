<?php
/**
 * TuxStalenessBanner — PHP & WordPress / Kadence component renderer.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
namespace Tti\Tux\Components;

final class TuxStalenessBanner
{
    public bool $stale = false;
    public string $verifiedUntil = undefined;
    public string $lastVerified = undefined;
    public int $reviewCadenceDays = 90;
    public string $owner = 'undefined';
    public string $pageId = 'undefined';
    public bool $dismissable = true;
    public bool $showVerifiedBadge = false;

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
            '<div class="tux-staleness-banner">%s</div>',
            $content
        );
    }
}
