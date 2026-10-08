"""
TuxPagination — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxPagination:
    total: Optional[int] = None
    model_value: Optional[int] = None
    page_size: int = 20
    sibling_count: int = 1
    boundary_count: int = 1
    show_status: bool = False
    noun: str = "result"
    plural_noun: Optional[str] = None
    aria_label: str = "Pagination"

    def render_html(self, content: str = "") -> str:
        return f'<nav class="tux-pagination">{content}</nav>'
