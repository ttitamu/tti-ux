<?php
/**
 * TuxResearcher — PHP & WordPress / Kadence component renderer.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
namespace Tti\Tux\Components;

final class TuxResearcher
{
    public string $name;
    public string $role;
    public string $portrait = 'undefined';
    public string $center = 'undefined';
    public string $orcid = 'undefined';
    public string $email = 'undefined';
    public string $bio = 'undefined';
    public string $projects = 'undefined';
    public string $metrics = 'undefined';
    public string $layout = default;
    public string $to = 'undefined';

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
