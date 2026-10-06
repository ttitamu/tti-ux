"""
TuxResultCount — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxResultCount:
    page: int = None
    page_size: int = None
    total: int = None
    noun: str = "undefined"
    noun_plural: str = "undefined"
    page_size_options: str = "undefined"
    hide_range: bool = false
    page_size_label: str = "per"

    def render_html(self, content: str = "") -> str:
        return f'<div class="tux-result-count">{content}</div>'
