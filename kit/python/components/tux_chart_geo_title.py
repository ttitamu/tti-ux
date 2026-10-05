"""
TuxChartGeoTitle — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxChartGeoTitle:
    title: str = None
    x: int = None
    y: int = None

    def render_html(self, content: str = "") -> str:
        return f'<text class="tux-chart-geo-title">{content}</text>'
