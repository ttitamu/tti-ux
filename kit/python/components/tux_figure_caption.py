"""
TuxFigureCaption — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxFigureCaption:
    label: str = "Figure"
    number: Optional[str] = None
    caption: Optional[str] = None
    source: Optional[str] = None
    placement: str = "below"

    def render_html(self, content: str = "") -> str:
        return f'<figure class="tux-figure-caption">{content}</figure>'
