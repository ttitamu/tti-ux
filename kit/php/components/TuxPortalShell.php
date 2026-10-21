<?php
/**
 * TuxPortalShell — PHP & WordPress / Kadence component renderer.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
namespace Tti\Tux\Components;

final class TuxPortalShell
{
    public string $portalTitle = '';
    public string $portalBadge = '';
    public string $portalBadgeVariant = 'gold';
    public ?string $navItems = null;
    public string $actionText = '';
    public string $actionTo = '';
    public string $actionHref = '';
    public ?string $utilityLinks = null;
    public string $agencyName = 'Texas A&M Transportation Institute';
    public string $agencyUrl = 'https://tti.tamu.edu';
    public string $homeUrl = '/';
    public bool $showSearch = true;
    public bool $stickyHeader = true;
    public ?string $breadcrumbs = null;
    public string $maxWidth = 'standard';
    public bool $showFeedback = true;
    public string $feedbackLabel = 'Feedback';
    public bool $showFooter = true;
    public ?string $headerProps = null;
    public ?string $footerProps = null;
    public string $mainClass = 'py-8';
    public string $as = 'main';

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
