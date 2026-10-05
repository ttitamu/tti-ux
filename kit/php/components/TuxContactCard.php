<?php
/**
 * TuxContactCard — PHP & WordPress / Kadence component renderer.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
namespace Tti\Tux\Components;

final class TuxContactCard
{
    public string $name;
    public string $role = 'undefined';
    public string $affiliation = 'undefined';
    public string $credentials = 'undefined';
    public string $image = 'undefined';
    public string $initial = 'undefined';
    public string $tone = maroon;
    public string $contacts = '()';
    public string $layout = vertical;

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
            '<article class="tux-contact-card">%s</article>',
            $content
        );
    }
}
