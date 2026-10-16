"""
TuxDocSearch — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxDocSearch:
    items: Optional[str] = None
    placeholder: Optional[str] = None
    max_results: int = 8

    def render_html(self, content: str = "") -> str:
        return f'<div class="tux-doc-search">{content}</div>'
