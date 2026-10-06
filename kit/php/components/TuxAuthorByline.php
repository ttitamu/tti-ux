<?php
/**
 * TuxAuthorByline — PHP & WordPress / Kadence component renderer.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
namespace Tti\Tux\Components;

final class TuxAuthorByline
{
    public string $authors;
    public string $affiliations = '()';
    public string $layout = compact;

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
            '<section class="tux-author-byline">%s</section>',
            $content
        );
    }
}
