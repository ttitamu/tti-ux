<?php
/**
 * TuxAbstract — PHP & WordPress / Kadence component renderer.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
namespace Tti\Tux\Components;

final class TuxAbstract
{
    public ?string $background = null;
    public ?string $methods = null;
    public ?string $results = null;
    public ?string $conclusion = null;
    public ?string $keywords = null;
    public string $variant = 'structured';
    public int $level = 4;
    public ?string $plainSummary = null;
    public ?string $policyTakeaways = null;
    public ?string $doi = null;
    public ?string $projectNumber = null;
    public ?string $citation = null;
    public ?string $division = null;

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
            '<section class="tux-abstract">%s</section>',
            $content
        );
    }
}
