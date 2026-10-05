<?php
/**
 * TuxArtifact — PHP & WordPress / Kadence component renderer.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
namespace Tti\Tux\Components;

final class TuxArtifact
{
    public string $title;
    public string $meta = 'undefined';
    public string $icon = 'lucide:file-code';
    public string $actions = '()';
    public bool $busy = false;

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
            '<section class="tux-artifact">%s</section>',
            $content
        );
    }
}
