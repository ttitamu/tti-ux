<?php
/**
 * TuxPaperMeta — PHP & WordPress / Kadence component renderer.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
namespace Tti\Tux\Components;

final class TuxPaperMeta
{
    public string $doi = 'undefined';
    public string $license = 'undefined';
    public string $funders = 'undefined';
    public string $published = 'undefined';
    public string $version = 'undefined';
    public string $type = 'undefined';
    public string $pages = 'undefined';
    public string $venue = 'undefined';

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
            '<dl class="tux-paper-meta">%s</dl>',
            $content
        );
    }
}
