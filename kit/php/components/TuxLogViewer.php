<?php
/**
 * TuxLogViewer — PHP & WordPress / Kadence component renderer.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
namespace Tti\Tux\Components;

final class TuxLogViewer
{
    public string $title = 'Operational Job & Telemetry Logs';
    public ?string $lines = null;
    public string $initialLevel = 'all';
    public bool $wrapLines = true;
    public bool $showLineNumbers = true;
    public string $maxHeight = '24rem';

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
            '<div class="tux-log-viewer">%s</div>',
            $content
        );
    }
}
