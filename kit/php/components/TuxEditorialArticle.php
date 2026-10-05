<?php
/**
 * TuxEditorialArticle — PHP & WordPress / Kadence component renderer.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
namespace Tti\Tux\Components;

final class TuxEditorialArticle
{
    public string $title;
    public string $category = 'Inside';
    public string $dek;
    public string $date;
    public string $dateLabel;
    public string $readTime;
    public string $author;
    public string $authors = '()';
    public string $heroImage;
    public string $heroAlt;
    public string $heroCaption;
    public string $heroLayout = boxed;
    public string $stats = '()';
    public string $highlights = '()';
    public string $citation = 'undefined';
    public bool $toc = true;
    public string $tocTarget = '#article-body';
    public bool $showReadingProgress = true;
    public bool $showScrollTop = true;
    public bool $showShare = true;
    public string $tags = '()';
    public string $contact = 'undefined';
    public string $backTo = 'undefined';
    public string $label;
    public string $to;

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
            '<div class="tux-editorial-article">%s</div>',
            $content
        );
    }
}
