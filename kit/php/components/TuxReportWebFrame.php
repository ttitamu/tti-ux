<?php
/**
 * TuxReportWebFrame — PHP & WordPress / Kadence component renderer.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
namespace Tti\Tux\Components;

final class TuxReportWebFrame
{
    public string $eyebrow = 'undefined';
    public string $title = 'undefined';
    public string $lede = 'undefined';
    public string $byline = 'undefined';
    public string $date = 'undefined';
    public string $readingTime = 'undefined';
    public string $toc = '()';
    public string $width = 'default';

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
            '<article class="tux-report-web-frame">%s</article>',
            $content
        );
    }
}
