<?php
/**
 * TuxConfirmDialog — PHP & WordPress / Kadence component renderer.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
namespace Tti\Tux\Components;

final class TuxConfirmDialog
{
    public bool $open = false;
    public ?string $title = null;
    public ?string $eyebrow = null;
    public ?string $confirmLabel = null;
    public string $cancelLabel = 'Cancel';
    public string $variant = 'destructive';
    public bool $confirmDisabled = false;
    public bool $loading = false;
    public string $size = 'sm';

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
            '<div class="tux-confirm-dialog">%s</div>',
            $content
        );
    }
}
