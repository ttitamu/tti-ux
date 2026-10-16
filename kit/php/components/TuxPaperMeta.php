<?php
/**
 * TuxPaperMeta — PHP & WordPress / Kadence component renderer.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
namespace Tti\Tux\Components;

final class TuxPaperMeta
{
    public string $doi;
    public string $license;
    public string $funders;
    public string $published;
    public string $version;
    public string $type;
    public string $pages;
    public string $venue;

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
