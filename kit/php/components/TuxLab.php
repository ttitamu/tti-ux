<?php
/**
 * TuxLab — PHP & WordPress / Kadence component renderer.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
namespace Tti\Tux\Components;

final class TuxLab
{
    public string $name;
    public string $summary;
    public string $logo;
    public int $projectsCount;
    public int $peopleCount;
    public string $location;
    public string $leaders;
    public string $focus;
    public string $to;

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
