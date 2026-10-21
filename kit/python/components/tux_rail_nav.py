"""
TuxRailNav — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxRailNav:
    items: Optional[str] = None
    collapsed: bool = False
    aria_label: str = "Primary"

    def render_html(self, content: str = "") -> str:
        return f'<nav class="tux-rail-nav">{content}</nav>'
