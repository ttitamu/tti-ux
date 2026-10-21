<?php
/**
 * TuxResearcher — PHP & WordPress / Kadence component renderer.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
namespace Tti\Tux\Components;

final class TuxResearcher
{
    public ?string $name = null;
    public ?string $role = null;
    public ?string $portrait = null;
    public ?string $center = null;
    public ?string $orcid = null;
    public ?string $email = null;
    public ?string $bio = null;
    public ?string $projects = null;
    public ?string $metrics = null;
    public string $layout = 'default';
    public ?string $to = null;

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
            '<article class="tux-researcher">%s</article>',
            $content
        );
    }
}
