<?php
/**
 * TuxPaperMeta — PHP & WordPress / Kadence component renderer.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
namespace Tti\Tux\Components;

final class TuxPaperMeta
{
    public ?string $doi = null;
    public ?string $license = null;
    public ?string $funders = null;
    public ?string $published = null;
    public ?string $version = null;
    public ?string $type = null;
    public ?string $pages = null;
    public ?string $venue = null;

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
