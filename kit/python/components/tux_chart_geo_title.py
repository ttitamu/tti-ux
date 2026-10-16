"""
TuxChartGeoTitle — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxChartGeoTitle:
    title: Optional[str] = None
    x: Optional[int] = None
    y: Optional[int] = None

    def render_html(self, content: str = "") -> str:
        return f'<div class="tux-chart-geo-title">{content}</div>'
