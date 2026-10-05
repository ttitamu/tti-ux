"""
TuxShortcutsHelp — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxShortcutsHelp:
    groups: str = None
    sequence_separator: str = "then"

    def render_html(self, content: str = "") -> str:
        return f'<dialog class="tux-shortcuts-help">{content}</dialog>'
