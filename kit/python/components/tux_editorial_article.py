"""
TuxEditorialArticle — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxEditorialArticle:
    title: Optional[str] = None
    category: str = "Inside Lane"
    dek: str = ""
    date: str = ""
    date_label: str = ""
    read_time: str = ""
    author: str = ""
    authors: Optional[str] = None
    hero_image: str = ""
    hero_alt: str = ""
    hero_caption: str = ""
    hero_layout: str = "boxed"
    stats: Optional[str] = None
    highlights: Optional[str] = None
    citation: Optional[str] = None
    toc: bool = True
    toc_target: str = "#article-body"
    show_reading_progress: bool = True
    show_scroll_top: bool = True
    show_share: bool = True
    tags: Optional[str] = None
    contact: Optional[str] = None
    back_to: Optional[str] = None
    label: Optional[str] = None
    to: Optional[str] = None

    def render_html(self, content: str = "") -> str:
        return f'<div class="tux-editorial-article">{content}</div>'
