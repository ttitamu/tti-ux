"""
TuxResultCount — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxResultCount:
    page: Optional[int] = None
    page_size: Optional[int] = None
    total: Optional[int] = None
    noun: Optional[str] = None
    noun_plural: Optional[str] = None
    page_size_options: Optional[str] = None
    hide_range: bool = False
    page_size_label: str = "per page"

    def render_html(self, content: str = "") -> str:
        return f'<div class="tux-result-count">{content}</div>'
