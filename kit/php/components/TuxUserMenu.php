<?php
/**
 * TuxUserMenu — PHP & WordPress / Kadence component renderer.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
namespace Tti\Tux\Components;

final class TuxUserMenu
{
    public string $state;
    public string $identity = 'undefined';
    public string $signInHref = 'undefined';
    public string $signInLabel = 'Sign';
    public string $items = '()';
    public string $prefs = '()';
    public bool $showSignOut = true;
    public string $placement = cluster;
    public string $statusLine = 'undefined';

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
            '<div class="tux-user-menu">%s</div>',
            $content
        );
    }
}
