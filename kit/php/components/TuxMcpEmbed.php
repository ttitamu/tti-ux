<?php
/**
 * TuxMcpEmbed — PHP & WordPress / Kadence component renderer.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
namespace Tti\Tux\Components;

final class TuxMcpEmbed
{
    public string $appName;
    public string $appIcon = 'lucide:plug';
    public string $appIconUrl = 'undefined';
    public string $source = 'undefined';
    public bool $loading = false;
    public bool $collapsible = true;
    public bool $expandable = true;
    public bool $closable = true;
    public bool $collapsed = false;

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
            '<section class="tux-mcp-embed">%s</section>',
            $content
        );
    }
}
