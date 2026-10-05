<?php
/**
 * TuxFeedback — PHP & WordPress / Kadence component renderer.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
namespace Tti\Tux\Components;

final class TuxFeedback
{
    public string $pageId;
    public string $title = 'Was';
    public string $endpoint = '/api/feedback';
    public bool $allowDetails = true;

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
            '<section class="tux-feedback">%s</section>',
            $content
        );
    }
}
