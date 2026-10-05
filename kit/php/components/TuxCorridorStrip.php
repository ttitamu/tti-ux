<?php
/**
 * TuxCorridorStrip — PHP & WordPress / Kadence component renderer.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
namespace Tti\Tux\Components;

final class TuxCorridorStrip
{
    public string $name = 'undefined';
    public int $fromMile;
    public int $toMile;
    public string $segments = 'undefined';
    public string $events = 'undefined';
    public string $values = 'undefined';
    public string $valuesLabel = 'undefined';
    public string $direction = 'undefined';
    public int $width = 800;
    public int $height = 140;
    public int $tickEvery = 5;

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
