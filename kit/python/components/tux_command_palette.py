"""
TuxCommandPalette — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxCommandPalette:
    groups: str = None
    placeholder: str = "Type"
    disable_hotkey: bool = false
    hotkey: str = "k"
    show_tabs: bool = true
    default_tab: str = "all"

    def render_html(self, content: str = "") -> str:
        return f'<dialog class="tux-command-palette">{content}</dialog>'
