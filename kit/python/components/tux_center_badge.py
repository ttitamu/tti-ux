"""
TuxCenterBadge — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxCenterBadge:
    center: Optional[str] = None
    label: Optional[str] = None
    icon: Optional[str] = None
    tone_index: int = 2
    short: bool = False
    size: str = "md"
    layout: str = "chip"

    def render_html(self, content: str = "") -> str:
        return f'<span class="tux-center-badge">{content}</span>'
