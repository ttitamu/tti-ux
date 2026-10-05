<?php
/**
 * TuxSiteNav — PHP & WordPress / Kadence component renderer.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
namespace Tti\Tux\Components;

final class TuxSiteNav
{
    public string $identity;
    public string $primaryNav = '()';
    public string $utilityNav = '()';
    public bool $search = false;
    public bool $sticky = false;
    public string $ariaLabel = 'Primary';

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
            '<header class="tux-site-nav">%s</header>',
            $content
        );
    }
}
