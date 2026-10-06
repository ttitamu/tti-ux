<?php
/**
 * TuxAppFrame — PHP & WordPress / Kadence component renderer.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
namespace Tti\Tux\Components;

final class TuxAppFrame
{
    public string $title = 'undefined';
    public string $eyebrow = 'undefined';
    public bool $useSystemAccent = false;
    public bool $unifiedToolbar = true;
    public bool $forceChrome = false;

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
            '<header class="tux-app-frame">%s</header>',
            $content
        );
    }
}
