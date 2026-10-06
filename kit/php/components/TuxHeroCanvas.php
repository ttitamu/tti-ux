<?php
/**
 * TuxHeroCanvas — PHP & WordPress / Kadence component renderer.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
namespace Tti\Tux\Components;

final class TuxHeroCanvas
{
    public string $variant = wash;
    public string $blend = seamless;
    public bool $interactive = true;
    public bool $showControls = true;
    public string $minHeight = '32rem';

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
            '<div class="tux-hero-canvas">%s</div>',
            $content
        );
    }
}
