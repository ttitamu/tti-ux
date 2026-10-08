"""
TuxDataTable — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxDataTable:
    columns: Optional[str] = None
    rows: str = "()"
    groups: str = "()"
    row_key: str = "id"
    table_number: Optional[str] = None
    caption: Optional[str] = None
    description: Optional[str] = None
    sort_key: Optional[str] = None
    sort_dir: Optional[str] = None
    sticky: bool = False
    max_height: str = "20rem"
    density: str = "comfortable"
    banded: bool = True
    footnotes: str = "()"
    source: Optional[str] = None
    totals: Optional[str] = None

    def render_html(self, content: str = "") -> str:
        return f'<figure class="tux-data-table">{content}</figure>'
