<?php
/**
 * TuxCorridorStrip — PHP & WordPress / Kadence component renderer.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
namespace Tti\Tux\Components;

final class TuxCorridorStrip
{
    public ?string $name = null;
    public ?int $fromMile = null;
    public ?int $toMile = null;
    public ?string $segments = null;
    public ?string $events = null;
    public ?string $values = null;
    public ?string $valuesLabel = null;
    public ?string $direction = null;
    public int $width = 800;
    public int $height = 140;
    public int $tickEvery = 5;
    public string $tickFormat = 'mile';
    public ?string $syncChannel = null;
    public ?int $activeMile = null;
    public bool $interactiveScrub = false;

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
            '<figure class="tux-corridor-strip">%s</figure>',
            $content
        );
    }
}
