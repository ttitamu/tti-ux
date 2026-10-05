<?php
/**
 * TuxErrorPage — PHP & WordPress / Kadence component renderer.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
namespace Tti\Tux\Components;

final class TuxErrorPage
{
    public string $code = '404';
    public string $title = 'undefined';
    public string $lede = 'undefined';
    public string $actions = 'undefined';
    public bool $inline = false;
    public string $icon = 'undefined';
    public string $details = 'undefined';

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
            '<section class="tux-error-page">%s</section>',
            $content
        );
    }
}
