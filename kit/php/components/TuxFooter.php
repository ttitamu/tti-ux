<?php
/**
 * TuxFooter — PHP & WordPress / Kadence component renderer.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
namespace Tti\Tux\Components;

final class TuxFooter
{
    public string $name = 'Texas A&M Transportation Institute';
    public string $address = "Texas A&M Transportation Institute\nCollege Station, TX 77843";
    public string $phone = '(979) 317-2000';
    public string $logo = '/logo.svg';
    public int $logoSize = 80;
    public string $brandLockup = '/TTI_white.png';
    public string $brandLockupAlt = 'Texas A&M Transportation Institute';
    public ?string $social = null;
    public ?string $columns = null;
    public string $tagline = 'Coordinated Statewide Transportation Research Program';
    public ?int $year = null;

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
