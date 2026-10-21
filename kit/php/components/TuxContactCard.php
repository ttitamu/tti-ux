<?php
/**
 * TuxContactCard — PHP & WordPress / Kadence component renderer.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
namespace Tti\Tux\Components;

final class TuxContactCard
{
    public ?string $name = null;
    public ?string $role = null;
    public ?string $affiliation = null;
    public ?string $credentials = null;
    public ?string $image = null;
    public ?string $initial = null;
    public string $tone = 'maroon';
    public ?string $contacts = null;
    public string $layout = 'vertical';

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
