<?php
/**
 * TuxAbstract — PHP & WordPress / Kadence component renderer.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
namespace Tti\Tux\Components;

final class TuxAbstract
{
    public string $background = 'undefined';
    public string $methods = 'undefined';
    public string $results = 'undefined';
    public string $conclusion = 'undefined';
    public string $keywords = 'undefined';
    public string $variant = structured;
    public string $level = 4;

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
            '<section class="tux-abstract">%s</section>',
            $content
        );
    }
}
