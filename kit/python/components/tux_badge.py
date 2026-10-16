"""
TuxBadge — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxBadge:
    tier: Optional[str] = None
    status: Optional[str] = None
    tone: Optional[str] = None
    kind: str = "default"
    variant: Optional[str] = None
    bold: bool = False
    dot: bool = False
    icon: Optional[str] = None
    count: Optional[str] = None
    label: Optional[str] = None
    uppercase: bool = False
    shape: str = "default"
    glyph: bool = False

    def render_html(self, content: str = "") -> str:
        return f'<div class="tux-badge">{content}</div>'
