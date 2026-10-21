<?php
/**
 * TuxECharts — PHP & WordPress / Kadence component renderer.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
namespace Tti\Tux\Components;

final class TuxECharts
{
    public ?string $options = null;
    public string $height = '380px';
    public string $width = '100%';
    public string $ariaTitle = 'Interactive data visualization';
    public string $ariaSummary = '';
    public ?string $extensions = null;
    public ?string $maps = null;
    public bool $loading = false;
    public bool $notMerge = false;

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
            '<div class="tux-echarts">%s</div>',
            $content
        );
    }
}
