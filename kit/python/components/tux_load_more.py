"""
TuxLoadMore — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxLoadMore:
    loaded: int = None
    total: int = None
    loading: bool = false
    noun: str = None
    noun_plural: str = None
    label: str = None
    terminal_label: str = None

    def render_html(self, content: str = "") -> str:
        return f'<div class="tux-load-more">{content}</div>'
