<?php
/**
 * TuxAnnouncementBanner — PHP & WordPress / Kadence component renderer.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
namespace Tti\Tux\Components;

final class TuxAnnouncementBanner
{
    public string $id = 'undefined';
    public string $tone = 'info';
    public string $icon = 'undefined';
    public string $eyebrow = 'undefined';
    public string $message = 'undefined';
    public string $action = 'undefined';
    public bool $dismissable = true;

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
            '<Transition class="tux-announcement-banner">%s</Transition>',
            $content
        );
    }
}
