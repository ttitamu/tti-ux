"""
TuxPopover — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxPopover:
    title: Optional[str] = None
    body: Optional[str] = None
    mode: str = "click"
    side: str = "bottom"
    arrow: bool = True
    disabled: bool = False
    width: str = "md"

    def render_html(self, content: str = "") -> str:
        return f'<div class="tux-popover">{content}</div>'
