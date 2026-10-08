"""
TuxEditorialArticle — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxEditorialArticle:
    title: Optional[str] = None
    category: str = "Inside"
    dek: Optional[str] = None
    date: Optional[str] = None
    date_label: Optional[str] = None
    read_time: Optional[str] = None
    author: Optional[str] = None
    authors: str = "()"
    hero_image: Optional[str] = None
    hero_alt: Optional[str] = None
    hero_caption: Optional[str] = None
    hero_layout: str = "boxed"
    stats: str = "()"
    highlights: str = "()"
    citation: Optional[str] = None
    toc: bool = True
    toc_target: str = "#article-body"
    show_reading_progress: bool = True
    show_scroll_top: bool = True
    show_share: bool = True
    tags: str = "()"
    contact: Optional[str] = None
    back_to: Optional[str] = None
    label: Optional[str] = None
    to: Optional[str] = None

    def render_html(self, content: str = "") -> str:
        return f'<div class="tux-editorial-article">{content}</div>'
