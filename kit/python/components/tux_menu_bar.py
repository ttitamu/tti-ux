"""
TuxMenuBar — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxMenuBar:
    menus: Optional[str] = None
    render_on_mac: bool = False

    def render_html(self, content: str = "") -> str:
        return f'<div class="tux-menu-bar">{content}</div>'
