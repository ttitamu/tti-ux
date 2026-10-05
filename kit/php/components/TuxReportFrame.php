<?php
/**
 * TuxReportFrame — PHP & WordPress / Kadence component renderer.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
namespace Tti\Tux\Components;

final class TuxReportFrame
{
    public string $size = 'letter';
    public string $density = 'editorial';
    public bool $breakAfter = false;
    public string $title = 'undefined';
    public string $eyebrow = 'undefined';

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
            '<article class="tux-report-frame">%s</article>',
            $content
        );
    }
}
