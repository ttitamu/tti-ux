<?php
/**
 * TuxSignupFeature — PHP & WordPress / Kadence component renderer.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
namespace Tti\Tux\Components;

final class TuxSignupFeature
{
    public string $title;
    public string $eyebrow = 'undefined';
    public string $dek = 'undefined';
    public string $actionLabel = 'Subscribe';
    public string $placeholder = 'your@email.edu';
    public string $consent = 'We';
    public string $modelValue;
    public string $tone = neutral;
    public string $variant = default;

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
            '<section class="tux-signup-feature">%s</section>',
            $content
        );
    }
}
