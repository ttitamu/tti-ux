<?php
/**
 * TuxPortalHeader — PHP & WordPress / Kadence component renderer.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
namespace Tti\Tux\Components;

final class TuxPortalHeader
{
    public string $mode = comm;
    public string $agencyName = 'Texas';
    public string $agencyUrl = 'https://tti.tamu.edu';
    public string $homeUrl = '/';
    public string $portalTitle;
    public string $portalBadge;
    public string $portalBadgeVariant = gold;
    public string $utilityLinks = '()';
    public bool $showSearch = true;
    public bool $showSpectrumRibbon = false;
    public string $intranetApps = '()';

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
            '<header class="tux-portal-header">%s</header>',
            $content
        );
    }
}
