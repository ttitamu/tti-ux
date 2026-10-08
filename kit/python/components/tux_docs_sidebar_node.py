"""
TuxDocsSidebarNode — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxDocsSidebarNode:
    section: Optional[str] = None
    path: Optional[str] = None
    query: Optional[str] = None
    open_map: Optional[str] = None
    is_open: Optional[str] = None
    is_active: Optional[str] = None
    on_toggle: Optional[str] = None
    depth: Optional[int] = None

    def render_html(self, content: str = "") -> str:
        return f'<li class="tux-docs-sidebar-node">{content}</li>'
