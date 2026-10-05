"""
TuxPopover — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxPopover:
    title: str = "undefined"
    body: str = "undefined"
    mode: str = click
    side: str = bottom
    arrow: bool = true
    disabled: bool = false
    width: str = md

    def render_html(self, content: str = "") -> str:
        return f'<UPopover class="tux-popover">{content}</UPopover>'
