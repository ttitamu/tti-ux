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
    title: str = "undefined"
    meta: str = "undefined"
    search_placeholder: str = "Search…"
    show_search: bool = true
    show_filter: bool = true
    show_columns: bool = true
    show_export: bool = true
    filters: str = "()"
    selected: str = ()
    selection_disabled: bool = false
    bulk_actions: str = "()"
    expanded: str = ()
    expansion_disabled: bool = false
    sort_key: str = "undefined"
    sort_dir: str = undefined
    max_height: str = "440px"
    virtualized: bool = false
    virtual_row_height: int = 44
    density: str = comfortable
    pagination_label: str = None
    pagination_tokens: str = "()"

    def render_html(self, content: str = "") -> str:
        return f'<div class="tux-rich-data-grid">{content}</div>'
