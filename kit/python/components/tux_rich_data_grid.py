"""
TuxRichDataGrid — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxRichDataGrid:
    columns: Optional[str] = None
    rows: Optional[str] = None
    row_key: str = "id"
    title: Optional[str] = None
    meta: Optional[str] = None
    search_placeholder: str = "Search…"
    show_search: bool = True
    show_filter: bool = True
    show_columns: bool = True
    show_export: bool = True
    filters: Optional[str] = None
    selected: Optional[str] = None
    selection_disabled: bool = False
    bulk_actions: Optional[str] = None
    expanded: Optional[str] = None
    expansion_disabled: bool = False
    sort_key: Optional[str] = None
    sort_dir: Optional[str] = None
    max_height: str = "440px"
    virtualized: bool = False
    virtual_row_height: int = 44
    density: str = "comfortable"
    pagination_label: Optional[str] = None
    pagination_tokens: Optional[str] = None

    def render_html(self, content: str = "") -> str:
        return f'<div class="tux-rich-data-grid">{content}</div>'
