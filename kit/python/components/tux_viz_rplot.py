"""
TuxVizRPlot — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxVizRPlot:
    src: str = None
    kind: str = "image"
    title: str = None
    eyebrow: str = None
    ratio: str = "16/10"
    alt: str = None
    src2x: str = None
    source: str = None
    level: int = 3

    def render_html(self, content: str = "") -> str:
        return f'<figure class="tux-viz-rplot">{content}</figure>'
