<?php
/**
 * TuxSpectrumFacts — PHP & WordPress / Kadence component renderer.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
namespace Tti\Tux\Components;

final class TuxSpectrumFacts
{
    public string $title = 'QUICK';
    public string $subtitle;
    public string $items = '()';
    public string $tone = dark;
    public bool $showTopRibbon = true;

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
            '<section class="tux-spectrum-facts">%s</section>',
            $content
        );
    }
}
