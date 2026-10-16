"""
TuxKbd — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxKbd:
    value: str = None
    keys: str = None
    size: str = "sm"
    separator: str = None

    def render_html(self, content: str = "") -> str:
        return f'<span class="tux-kbd">{content}</span>'
