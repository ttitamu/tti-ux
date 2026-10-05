"""
TuxDocsSidebarNode — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxDocsSidebarNode:
    section: str = None
    path: str = None
    query: str = None
    open_map: str = None
    is_open: str = None
    is_active: str = None
    on_toggle: str = None
    depth: int = None

    def render_html(self, content: str = "") -> str:
        return f'<li class="tux-docs-sidebar-node">{content}</li>'
