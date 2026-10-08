"""
TuxVizRPlot — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxVizRPlot:
    src: Optional[str] = None
    kind: str = "image"
    title: Optional[str] = None
    eyebrow: Optional[str] = None
    ratio: str = "16/10"
    alt: Optional[str] = None
    src2x: Optional[str] = None
    source: Optional[str] = None
    level: str = "3"

    def render_html(self, content: str = "") -> str:
        return f'<figure class="tux-viz-rplot">{content}</figure>'
