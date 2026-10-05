<?php
/**
 * TuxMobileFrame — PHP & WordPress / Kadence component renderer.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
namespace Tti\Tux\Components;

final class TuxMobileFrame
{
    public string $platform = 'ios';
    public int $width = 280;
    public string $color = undefined;
    public bool $statusBar = true;
    public string $time = '9:41';
    public bool $notch = true;
    public bool $homeIndicator = true;
    public string $navStyle = 'gesture';
    public string $ariaLabel = 'undefined';

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
            '<figure class="tux-mobile-frame">%s</figure>',
            $content
        );
    }
}
