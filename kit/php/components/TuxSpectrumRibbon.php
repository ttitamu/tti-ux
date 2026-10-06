<?php
/**
 * TuxSpectrumRibbon — PHP & WordPress / Kadence component renderer.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
namespace Tti\Tux\Components;

final class TuxSpectrumRibbon
{
    public string $size = sm;
    public string $orientation = horizontal;
    public bool $showLabels = false;
    public bool $rounded = false;
    public string $ariaLabel = 'TTI';
    public string $bands = '()';

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
            '<div class="tux-spectrum-ribbon">%s</div>',
            $content
        );
    }
}
