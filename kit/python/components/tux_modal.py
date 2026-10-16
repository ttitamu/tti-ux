"""
TuxModal — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxModal:
    open: bool = false
    title: str = None
    eyebrow: str = None
    size: str = None
    variant: str = "standard"

    def render_html(self, content: str = "") -> str:
        return f'<div class="tux-modal">{content}</div>'
