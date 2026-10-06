<?php

namespace Tti\Tux;

/**
 * Tux — PHP helper class for rendering TTI-UX components.
 *
 * Usage in vanilla PHP:
 *   <?= Tux::bigStat(value: '126', suffix: 'M', label: 'Annual Expenditure', tone: 'maroon') ?>
 *
 * Usage in Laravel / Blade templates:
 *   {!! Tux::card(to: '/research', content: '<h3>Project</h3>') !!}
 */
class Tux
{
    /**
     * Render a TuxBigStat metric.
     */
    public static function bigStat(
        string|int|float $value,
        string $label,
        ?string $suffix = null,
        ?string $source = null,
        string $tone = 'maroon',
        string $variant = 'default',
        string $size = 'md'
    ): string {
        $attrs = [
            'value'   => (string)$value,
            'label'   => $label,
            'tone'    => $tone,
            'variant' => $variant,
            'size'    => $size,
        ];
        if ($suffix !== null) {
            $attrs['suffix'] = $suffix;
        }
        if ($source !== null) {
            $attrs['source'] = $source;
        }

        return self::renderElement('tux-big-stat', $attrs);
    }

    /**
     * Render a TuxCard container.
     */
    public static function card(
        string $content,
        ?string $to = null,
        bool $padded = true,
        bool $linked = false
    ): string {
        $attrs = [
            'padded' => $padded ? 'true' : 'false',
            'linked' => $linked ? 'true' : 'false',
        ];
        if ($to !== null) {
            $attrs['to'] = $to;
        }

        return self::renderElement('tux-card', $attrs, $content);
    }

    /**
     * Render a TuxAlert notice.
     */
    public static function alert(
        string $content,
        string $variant = 'info',
        ?string $title = null
    ): string {
        $attrs = ['variant' => $variant];
        if ($title !== null) {
            $attrs['title'] = $title;
        }

        return self::renderElement('tux-alert', $attrs, $content);
    }

    /**
     * Helper to format HTML custom element.
     */
    protected static function renderElement(string $tag, array $attributes, ?string $innerContent = null): string
    {
        $attrString = '';
        foreach ($attributes as $key => $val) {
            $attrString .= ' ' . htmlspecialchars($key, ENT_QUOTES, 'UTF-8') . '="' . htmlspecialchars($val, ENT_QUOTES, 'UTF-8') . '"';
        }

        if ($innerContent === null) {
            return "<{$tag}{$attrString}></{$tag}>";
        }

        return "<{$tag}{$attrString}>{$innerContent}</{$tag}>";
    }
}
