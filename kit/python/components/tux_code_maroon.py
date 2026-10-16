"""
TuxCodeMaroon — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxCodeMaroon:
    active: bool = False
    tone: str = "error"
    title: Optional[str] = None
    message: Optional[str] = None
    details_url: str = "https://tti.tamu.edu/emergency/"
    details_label: Optional[str] = None
    dismissible: bool = False
    model_value: bool = False
    sticky: bool = False

    def render_html(self, content: str = "") -> str:
        return f'<div class="tux-code-maroon">{content}</div>'
