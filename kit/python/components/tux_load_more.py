"""
TuxLoadMore — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxLoadMore:
    loaded: Optional[int] = None
    total: Optional[int] = None
    loading: bool = False
    noun: Optional[str] = None
    noun_plural: Optional[str] = None
    label: Optional[str] = None
    terminal_label: Optional[str] = None

    def render_html(self, content: str = "") -> str:
        return f'<div class="tux-load-more">{content}</div>'
