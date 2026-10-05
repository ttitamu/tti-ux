<?php
/**
 * TuxSplashScreen — PHP & WordPress / Kadence component renderer.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
namespace Tti\Tux\Components;

final class TuxSplashScreen
{
    public bool $loaded = false;
    public string $status = 'Loading…';
    public bool $hidden = false;
    public int $fadeDelay = 300;

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
            '<Transition class="tux-splash-screen">%s</Transition>',
            $content
        );
    }
}
