<?php
/**
 * TuxSplitPane — PHP & WordPress / Kadence component renderer.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
namespace Tti\Tux\Components;

final class TuxSplitPane
{
    public string $modelValue = null;
    public string $initialListWidth = '320px';
    public int $minListWidth = 220;
    public int $maxListWidth = 560;
    public string $id = 'undefined';
    public string $initialBottomHeight = '160px';
    public bool $showBottom = false;
    public string $listLabel = 'Records';
    public string $detailLabel = 'Detail';

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
            '<div class="tux-split-pane">%s</div>',
            $content
        );
    }
}
