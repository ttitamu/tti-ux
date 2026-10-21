<?php
/**
 * TuxReportWebFrame — PHP & WordPress / Kadence component renderer.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
namespace Tti\Tux\Components;

final class TuxReportWebFrame
{
    public ?string $eyebrow = null;
    public ?string $title = null;
    public ?string $lede = null;
    public ?string $byline = null;
    public ?string $date = null;
    public ?string $readingTime = null;
    public ?string $toc = null;
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
