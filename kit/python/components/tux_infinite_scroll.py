"""
TuxInfiniteScroll — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxInfiniteScroll:
    loaded: int = None
    total: int = None
    loading: bool = false
    keyboard_fallback: bool = false
    root_margin: str = "200px"
    noun: str = "undefined"
    noun_plural: str = "undefined"

    def render_html(self, content: str = "") -> str:
        return f'<div class="tux-infinite-scroll">{content}</div>'
