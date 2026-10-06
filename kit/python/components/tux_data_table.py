"""
TuxDataTable — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxDataTable:
    columns: str = None
    rows: str = "()"
    groups: str = "()"
    row_key: str = "id"
    table_number: str = None
    caption: str = None
    description: str = None
    sort_key: str = "undefined"
    sort_dir: str = undefined
    sticky: bool = false
    max_height: str = "20rem"
    density: str = comfortable
    banded: bool = true
    footnotes: str = "()"
    source: str = None
    totals: str = "undefined"

    def render_html(self, content: str = "") -> str:
        return f'<figure class="tux-data-table">{content}</figure>'
