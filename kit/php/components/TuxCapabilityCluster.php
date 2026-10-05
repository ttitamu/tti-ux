<?php
/**
 * TuxCapabilityCluster — PHP & WordPress / Kadence component renderer.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
namespace Tti\Tux\Components;

final class TuxCapabilityCluster
{
    public string $title = 'RESEARCH';
    public string $kicker = 'Research';
    public string $subtitle = 'Applied';
    public string $capabilities = '()';
    public string $columns = 3;

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
            '<section class="tux-capability-cluster">%s</section>',
            $content
        );
    }
}
