"""
TuxNewsCollection — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxNewsCollection:
    items: str = None
    layout: str = stacked
    columns: str = 3
    read_more: str = "Read"

    def render_html(self, content: str = "") -> str:
        return f'<ul class="tux-news-collection">{content}</ul>'
