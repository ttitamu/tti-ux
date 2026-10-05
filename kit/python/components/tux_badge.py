"""
TuxBadge — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxBadge:
    tier: str = "undefined"
    status: str = "undefined"
    tone: str = "undefined"
    kind: str = "default"
    variant: str = "undefined"
    bold: bool = false
    dot: bool = false
    icon: str = "undefined"
    count: str = undefined
    label: str = "undefined"
    uppercase: bool = false

    def render_html(self, content: str = "") -> str:
        return f'<UBadge class="tux-badge">{content}</UBadge>'
