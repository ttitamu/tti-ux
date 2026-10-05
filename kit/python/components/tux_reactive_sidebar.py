"""
TuxReactiveSidebar — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxReactiveSidebar:
    sections: str = None
    all_sections: str = "undefined"
    collapsed: bool = false
    active_area_title: str = "Workspace"
    active_area_icon: str = "lucide:layers"
    search: bool = true
    search_placeholder: str = "Filter"
    show_all: bool = false
    default_expanded: bool = false
    exclusive: bool = false

    def render_html(self, content: str = "") -> str:
        return f'<nav class="tux-reactive-sidebar">{content}</nav>'
