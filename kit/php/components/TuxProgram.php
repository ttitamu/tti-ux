<?php
/**
 * TuxProgram — PHP & WordPress / Kadence component renderer.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
namespace Tti\Tux\Components;

final class TuxProgram
{
    public string $name;
    public string $eyebrow;
    public string $summary;
    public string $hero;
    public string $leads;
    public string $funders;
    public string $metrics;

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
            '<article class="tux-program">%s</article>',
            $content
        );
    }
}
