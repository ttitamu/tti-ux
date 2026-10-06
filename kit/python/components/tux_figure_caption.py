"""
TuxFigureCaption — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxFigureCaption:
    label: str = "Figure"
    number: str = None
    caption: str = "undefined"
    source: str = "undefined"
    placement: str = below

    def render_html(self, content: str = "") -> str:
        return f'<figure class="tux-figure-caption">{content}</figure>'
