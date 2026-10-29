"""
TuxLeaseBadge — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxLeaseBadge:
    label: Optional[str] = None
    remaining_hours: Optional[int] = None
    expires_label: Optional[str] = None
    warning_hours: int = 72
    extendable: bool = False
    releasable: bool = False
    extend_label: str = "Extend"
    release_label: str = "Release"

    def render_html(self, content: str = "") -> str:
        return f'<div class="tux-lease-badge">{content}</div>'
