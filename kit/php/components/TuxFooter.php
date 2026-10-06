<?php
/**
 * TuxFooter — PHP & WordPress / Kadence component renderer.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
namespace Tti\Tux\Components;

final class TuxFooter
{
    public string $name = 'Texas';
    public string $address = 'Texas';
    public string $phone = (979);
    public string $logo = '/logo.svg';
    public int $logoSize = 80;
    public string $brandLockup = /TTI_white.png;
    public string $brandLockupAlt = 'Texas';
    public string $social = '()';
    public string $columns = '()';
    public string $tagline = 'Coordinated';
    public int $year = ();

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
            '<footer class="tux-footer">%s</footer>',
            $content
        );
    }
}
