"""
TuxTable — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxTable:
    status_accessor: str = "status"

    def render_html(self, content: str = "") -> str:
        return f'<div class="tux-table">{content}</div>'
