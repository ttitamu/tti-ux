<?php
/**
 * TuxLab — PHP & WordPress / Kadence component renderer.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
namespace Tti\Tux\Components;

final class TuxLab
{
    public string $name;
    public string $summary = 'undefined';
    public string $logo = 'undefined';
    public int $projectsCount = undefined;
    public int $peopleCount = undefined;
    public string $location = 'undefined';
    public string $leaders = 'undefined';
    public string $focus = 'undefined';
    public string $to = 'undefined';

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
