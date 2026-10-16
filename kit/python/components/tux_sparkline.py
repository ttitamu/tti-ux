"""
TuxSparkline — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxSparkline:
    data: Optional[str] = None
    width: int = 120
    height: int = 32
    tone: str = "brand"
    stroke_width: int = 1.5
    show_area: bool = False
    show_last_point: bool = True
    show_delta: bool = False
    delta_format: str = "percent"
    aria_summary: Optional[str] = None
    units: Optional[str] = None

    def render_html(self, content: str = "") -> str:
        return f'<span class="tux-sparkline">{content}</span>'
