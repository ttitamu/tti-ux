<?php
/**
 * TuxAnnouncementBanner — PHP & WordPress / Kadence component renderer.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
namespace Tti\Tux\Components;

final class TuxAnnouncementBanner
{
    public ?string $id = null;
    public string $tone = 'info';
    public ?string $icon = null;
    public ?string $eyebrow = null;
    public ?string $message = null;
    public ?string $action = null;
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
            '<div class="tux-announcement-banner">%s</div>',
            $content
        );
    }
}
