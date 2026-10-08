"""
TuxBreadcrumbs — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxBreadcrumbs:
    trail: Optional[str] = None
    home_icon: bool = True
    chevron: bool = False
    aria_label: str = "Breadcrumb"

    def render_html(self, content: str = "") -> str:
        return f'<nav class="tux-breadcrumbs">{content}</nav>'
