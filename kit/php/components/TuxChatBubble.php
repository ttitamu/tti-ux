<?php
/**
 * TuxChatBubble — PHP & WordPress / Kadence component renderer.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
namespace Tti\Tux\Components;

final class TuxChatBubble
{
    public string $mode = bubble;
    public string $role = assistant;
    public string $title = 'Assistant';
    public string $subtitle = 'Institutional';
    public string $state = idle;
    public string $teaser = 'undefined';
    public string $tail = none;
    public bool $dismissible = false;
    public bool $open = true;
    public string $suggestions = '()';

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
            '<div class="tux-chat-bubble">%s</div>',
            $content
        );
    }
}
