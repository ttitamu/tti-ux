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
    noun: str = "undefined"
    noun_plural: str = "undefined"
    label: str = "Load"
    terminal_label: str = "All"

    def render_html(self, content: str = "") -> str:
        return f'<div class="tux-load-more">{content}</div>'
