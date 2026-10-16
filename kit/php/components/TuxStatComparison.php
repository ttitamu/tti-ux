<?php
/**
 * TuxStatComparison — PHP & WordPress / Kadence component renderer.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
namespace Tti\Tux\Components;

final class TuxStatComparison
{
    public string $eyebrow;
    public int $current;
    public int $previous;
    public string $suffix;
    public string $label;
    public string $layout = 'row';
    public int $decimals = 1;
    public string $polarity = 'direct';
    public string $deltaFormat = 'abs+pct';

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
            '<div class="tux-stat-comparison">%s</div>',
            $content
        );
    }
}
