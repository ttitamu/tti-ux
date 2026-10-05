"""
TuxCenterBadge — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxCenterBadge:
    center: str = undefined
    label: str = "undefined"
    icon: str = "undefined"
    tone_index: int = 2
    short: bool = false
    size: str = md
    layout: str = chip

    def render_html(self, content: str = "") -> str:
        return f'<span class="tux-center-badge">{content}</span>'
