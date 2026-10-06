<?php
/**
 * TuxEventCalendarRow — PHP & WordPress / Kadence component renderer.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
namespace Tti\Tux\Components;

final class TuxEventCalendarRow
{
    public string $day;
    public string $month;
    public string $title;
    public string $time;
    public string $location;
    public string $category;
    public string $to;
    public string $href;
    public string $actionText = 'View';
    public string $chipTone = green;

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
            '<article class="tux-event-calendar-row">%s</article>',
            $content
        );
    }
}
