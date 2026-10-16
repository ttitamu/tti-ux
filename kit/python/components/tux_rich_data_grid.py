"""
TuxRichDataGrid — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxRichDataGrid:
    columns: str = None
    rows: str = None
    row_key: str = "id"
    title: str = None
    meta: str = None
    search_placeholder: str = "Search…"
    show_search: bool = true
    show_filter: bool = true
    show_columns: bool = true
    show_export: bool = true
    filters: str = None
    selected: str = None
    selection_disabled: bool = false
    bulk_actions: str = None
    expanded: str = None
    expansion_disabled: bool = false
    sort_key: str = None
    sort_dir: str = None
    max_height: str = "440px"
    virtualized: bool = false
    virtual_row_height: int = 44
    density: str = "comfortable"
    pagination_label: str = None
    pagination_tokens: str = None

    def render_html(self, content: str = "") -> str:
        return f'<div class="tux-rich-data-grid">{content}</div>'
