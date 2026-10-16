"""
TuxPopover — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxPopover:
    title: str = None
    body: str = None
    mode: str = "click"
    side: str = "bottom"
    arrow: bool = true
    disabled: bool = false
    width: str = "md"

    def render_html(self, content: str = "") -> str:
        return f'<div class="tux-popover">{content}</div>'
