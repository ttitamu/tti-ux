<?php
/**
 * TuxEditorialArticle — PHP & WordPress / Kadence component renderer.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
namespace Tti\Tux\Components;

final class TuxEditorialArticle
{
    public ?string $title = null;
    public string $category = 'Inside Lane';
    public string $dek = '';
    public string $date = '';
    public string $dateLabel = '';
    public string $readTime = '';
    public string $author = '';
    public ?string $authors = null;
    public string $heroImage = '';
    public string $heroAlt = '';
    public string $heroCaption = '';
    public string $heroLayout = 'boxed';
    public ?string $stats = null;
    public ?string $highlights = null;
    public ?string $citation = null;
    public bool $toc = true;
    public string $tocTarget = '#article-body';
    public bool $showReadingProgress = true;
    public bool $showScrollTop = true;
    public bool $showShare = true;
    public ?string $tags = null;
    public ?string $contact = null;
    public ?string $backTo = null;
    public ?string $label = null;
    public ?string $to = null;

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
