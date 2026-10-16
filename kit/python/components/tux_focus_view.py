"""
TuxFocusView — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxFocusView:
    open: bool = False
    title: Optional[str] = None
    eyebrow: Optional[str] = None
    dismiss_on_backdrop_click: bool = True
    dismiss_on_escape: bool = True
    back_label: str = "Close"

    def render_html(self, content: str = "") -> str:
        return f'<div class="tux-focus-view">{content}</div>'
