"""
TuxDocsSidebar — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxDocsSidebar:
    tree: Optional[str] = None
    title: str = "Docs"
    search: bool = True
    search_placeholder: str = "Filter docs…"
    storage_key: str = "tux-docs-sidebar"
    exclusive_top_level: bool = False

    def render_html(self, content: str = "") -> str:
        return f'<nav class="tux-docs-sidebar">{content}</nav>'
