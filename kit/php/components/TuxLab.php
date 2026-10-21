<?php
/**
 * TuxLab — PHP & WordPress / Kadence component renderer.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
namespace Tti\Tux\Components;

final class TuxLab
{
    public ?string $name = null;
    public ?string $summary = null;
    public ?string $logo = null;
    public ?int $projectsCount = null;
    public ?int $peopleCount = null;
    public ?string $location = null;
    public ?string $leaders = null;
    public ?string $focus = null;
    public ?string $to = null;

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
            '<article class="tux-lab">%s</article>',
            $content
        );
    }
}
