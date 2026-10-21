"""
TuxDataTable — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxDataTable:
    columns: Optional[str] = None
    rows: Optional[str] = None
    groups: Optional[str] = None
    row_key: str = "id"
    table_number: str = ""
    caption: str = ""
    description: str = ""
    sort_key: Optional[str] = None
    sort_dir: Optional[str] = None
    sticky: bool = False
    max_height: str = "20rem"
    density: str = "comfortable"
    banded: bool = True
    footnotes: Optional[str] = None
    source: str = ""
    totals: Optional[str] = None

    def render_html(self, content: str = "") -> str:
        return f'<figure class="tux-data-table">{content}</figure>'
