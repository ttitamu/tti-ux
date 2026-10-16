"""
TuxReactiveSidebar — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxReactiveSidebar:
    sections: Optional[str] = None
    all_sections: Optional[str] = None
    collapsed: bool = False
    active_area_title: Optional[str] = None
    active_area_icon: str = "lucide:layers"
    search: bool = True
    search_placeholder: Optional[str] = None
    show_all: bool = False
    default_expanded: bool = False
    exclusive: bool = False

    def render_html(self, content: str = "") -> str:
        return f'<nav class="tux-reactive-sidebar">{content}</nav>'
