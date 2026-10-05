"""
TuxTableCaption — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxTableCaption:
    label: str = "Table"
    number: str = None
    caption: str = "undefined"
    source: str = "undefined"
    placement: str = above

    def render_html(self, content: str = "") -> str:
        return f'<div class="tux-table-caption">{content}</div>'
