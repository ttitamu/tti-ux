<?php
/**
 * TuxBranchNav — PHP & WordPress / Kadence component renderer.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
namespace Tti\Tux\Components;

final class TuxBranchNav
{
    public ?int $modelValue = null;
    public ?int $total = null;
    public bool $loop = false;
    public bool $hideSingleton = true;
    public string $ariaLabel = 'Response alternatives';

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
            '<nav class="tux-branch-nav">%s</nav>',
            $content
        );
    }
}
