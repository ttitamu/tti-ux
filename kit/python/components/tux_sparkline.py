"""
TuxSparkline — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxSparkline:
    data: str = None
    width: int = 120
    height: int = 32
    tone: str = "brand"
    stroke_width: int = 1.5
    show_area: bool = false
    show_last_point: bool = true
    show_delta: bool = false
    delta_format: str = percent
    aria_summary: str = "undefined"
    units: str = "undefined"

    def render_html(self, content: str = "") -> str:
        return f'<span class="tux-sparkline">{content}</span>'
