"""
TuxChartGeoDotDensity — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxChartGeoDotDensity:
    dots: int = None
    dot_legend: str = None

    def render_html(self, content: str = "") -> str:
        return f'<svg class="tux-chart-geo-dot-density">{content}</svg>'
