<?php
/**
 * TuxCorridorStrip — PHP & WordPress / Kadence component renderer.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
namespace Tti\Tux\Components;

final class TuxCorridorStrip
{
    public string $name;
    public int $fromMile;
    public int $toMile;
    public string $segments;
    public string $events;
    public string $values;
    public string $valuesLabel;
    public string $direction;
    public int $width = 800;
    public int $height = 140;
    public int $tickEvery = 5;
    public string $tickFormat = 'mile';
    public string $syncChannel;
    public int $activeMile;
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
