"""
TuxTooltip — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxTooltip:
    text: Optional[str] = None
    title: Optional[str] = None
    kbds: Optional[str] = None
    side: str = "top"
    arrow: bool = True
    disabled: bool = False

    def render_html(self, content: str = "") -> str:
        return f'<div class="tux-tooltip">{content}</div>'
