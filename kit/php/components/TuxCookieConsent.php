<?php
/**
 * TuxCookieConsent — PHP & WordPress / Kadence component renderer.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
namespace Tti\Tux\Components;

final class TuxCookieConsent
{
    public string $storageKey = 'tux-cookie-consent';
    public string $position = 'bottom-right';
    public string $message;
    public string $privacyHref = '/privacy';
    public bool $initiallyExpanded = false;

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
            '<div class="tux-cookie-consent">%s</div>',
            $content
        );
    }
}
