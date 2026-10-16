"""
TuxBadge — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxBadge:
    tier: str = None
    status: str = None
    tone: str = None
    kind: str = "default"
    variant: str = None
    bold: bool = false
    dot: bool = false
    icon: str = None
    count: str = None
    label: str = None
    uppercase: bool = false
    shape: str = "default"
    glyph: bool = false

    def render_html(self, content: str = "") -> str:
        return f'<div class="tux-badge">{content}</div>'
