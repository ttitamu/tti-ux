"""
TuxStatus — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxStatus:
    state: Optional[str] = None
    kind: str = "chip"
    acked: bool = False
    label: Optional[str] = None

    def render_html(self, content: str = "") -> str:
        return f'<span class="tux-status">{content}</span>'
