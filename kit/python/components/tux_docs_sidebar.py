"""
TuxDocsSidebar — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxDocsSidebar:
    tree: str = None
    title: str = "Docs"
    search: bool = true
    search_placeholder: str = "Filter"
    storage_key: str = tux-docs-sidebar
    exclusive_top_level: bool = false

    def render_html(self, content: str = "") -> str:
        return f'<div class="tux-docs-sidebar">{content}</div>'
