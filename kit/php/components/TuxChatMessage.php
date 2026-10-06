<?php
/**
 * TuxChatMessage — PHP & WordPress / Kadence component renderer.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
namespace Tti\Tux\Components;

final class TuxChatMessage
{
    public string $role = 'user';
    public string $author;
    public string $timestamp = 'undefined';
    public string $meta = 'undefined';
    public string $initials = 'undefined';

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
            '<article class="tux-chat-message">%s</article>',
            $content
        );
    }
}
