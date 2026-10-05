"""
TuxEditorialArticle — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxEditorialArticle:
    title: str = None
    category: str = "Inside"
    dek: str = None
    date: str = None
    date_label: str = None
    read_time: str = None
    author: str = None
    authors: str = "()"
    hero_image: str = None
    hero_alt: str = None
    hero_caption: str = None
    hero_layout: str = boxed
    stats: str = "()"
    highlights: str = "()"
    citation: str = "undefined"
    toc: bool = true
    toc_target: str = "#article-body"
    show_reading_progress: bool = true
    show_scroll_top: bool = true
    show_share: bool = true
    tags: str = "()"
    contact: str = "undefined"
    back_to: str = "undefined"
    label: str = None
    to: str = None

    def render_html(self, content: str = "") -> str:
        return f'<div class="tux-editorial-article">{content}</div>'
