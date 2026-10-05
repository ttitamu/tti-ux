<?php
/**
 * TuxConfirmDialog — PHP & WordPress / Kadence component renderer.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
namespace Tti\Tux\Components;

final class TuxConfirmDialog
{
    public bool $open = false;
    public string $title;
    public string $eyebrow = 'undefined';
    public string $confirmLabel = 'undefined';
    public string $cancelLabel = 'Cancel';
    public string $variant = destructive;
    public bool $confirmDisabled = false;
    public bool $loading = false;
    public string $size = sm;

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
            '<TuxModal class="tux-confirm-dialog">%s</TuxModal>',
            $content
        );
    }
}
