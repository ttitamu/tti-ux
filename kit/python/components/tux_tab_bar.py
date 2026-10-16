"""
TuxTabBar — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxTabBar:
    items: Optional[str] = None
    aria_label: Optional[str] = None

    def render_html(self, content: str = "") -> str:
        return f'<nav class="tux-tab-bar">{content}</nav>'
