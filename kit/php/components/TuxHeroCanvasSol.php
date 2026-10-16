<?php
/**
 * TuxHeroCanvasSol — PHP & WordPress / Kadence component renderer.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
namespace Tti\Tux\Components;

final class TuxHeroCanvasSol
{
    public string $blend = 'seamless';
    public bool $interactive = true;
    public bool $showControls = true;
    public string $minHeight = '34rem';
    public string $mode = 'adaptive';

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
            '<div class="tux-hero-canvas-sol">%s</div>',
            $content
        );
    }
}
