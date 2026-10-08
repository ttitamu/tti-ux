"""
TuxInfiniteScroll — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxInfiniteScroll:
    loaded: Optional[int] = None
    total: Optional[int] = None
    loading: bool = False
    keyboard_fallback: bool = False
    root_margin: str = "200px"
    noun: Optional[str] = None
    noun_plural: Optional[str] = None

    def render_html(self, content: str = "") -> str:
        return f'<div class="tux-infinite-scroll">{content}</div>'
