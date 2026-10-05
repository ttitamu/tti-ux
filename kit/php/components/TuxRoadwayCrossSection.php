<?php
/**
 * TuxRoadwayCrossSection — PHP & WordPress / Kadence component renderer.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
namespace Tti\Tux\Components;

final class TuxRoadwayCrossSection
{
    public string $preset = urban-managed;
    public string $initialView = 3d-perspective;
    public string $height = '560px';
    public bool $interactive = true;
    public int $initialPitch = 0;
    public int $initialYaw = 0;

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
            '<div class="tux-roadway-cross-section">%s</div>',
            $content
        );
    }
}
