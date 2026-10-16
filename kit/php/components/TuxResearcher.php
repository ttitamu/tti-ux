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
    public string $portrait;
    public string $center;
    public string $orcid;
    public string $email;
    public string $bio;
    public string $projects;
    public string $metrics;
    public string $layout = 'default';
    public string $to;

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
