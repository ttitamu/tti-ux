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
    eyebrow: str = "undefined"
    ratio: str = "16/10"
    alt: str = None
    src2x: str = "undefined"
    source: str = "undefined"
    level: str = 3

    def render_html(self, content: str = "") -> str:
        return f'<figure class="tux-viz-rplot">{content}</figure>'
