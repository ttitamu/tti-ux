<?php
/**
 * TuxTreeNode — PHP & WordPress / Kadence component renderer.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
namespace Tti\Tux\Components;

final class TuxTreeNode
{
    public string $node;
    public int $depth;
    public string $selectedId;
    public string $isExpanded;
    public bool $showGuides = false;

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
            '<li class="tux-tree-node">%s</li>',
            $content
        );
    }
}
