"""
TuxTooltip — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxTooltip:
    text: str = None
    title: str = "undefined"
    kbds: str = "undefined"
    side: str = top
    arrow: bool = true
    disabled: bool = false

    def render_html(self, content: str = "") -> str:
        return f'<TooltipProvider class="tux-tooltip">{content}</TooltipProvider>'
