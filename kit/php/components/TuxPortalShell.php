<?php
/**
 * TuxPortalShell — PHP & WordPress / Kadence component renderer.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
namespace Tti\Tux\Components;

final class TuxPortalShell
{
    public string $portalTitle;
    public string $portalBadge;
    public string $portalBadgeVariant = gold;
    public string $navItems = '()';
    public string $actionText;
    public string $actionTo;
    public string $actionHref;
    public string $utilityLinks;
    public string $agencyName = 'Texas';
    public string $agencyUrl = 'https://tti.tamu.edu';
    public string $homeUrl = '/';
    public bool $showSearch = true;
    public bool $stickyHeader = true;
    public string $breadcrumbs = '()';
    public string $maxWidth = standard;
    public bool $showFeedback = true;
    public string $feedbackLabel = 'Feedback';
    public bool $showFooter = true;
    public string $headerProps = '()';
    public string $footerProps;
    public string $mainClass;
    public string $as;

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
            '<div class="tux-portal-shell">%s</div>',
            $content
        );
    }
}
