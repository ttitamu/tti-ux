"""
TuxChartGeoUsContext — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxChartGeoUsContext:
    states: str = None
    highlight: str = None
    legend_label: str = None
    legend_stops: str = None

    def render_html(self, content: str = "") -> str:
        return f'<svg class="tux-chart-geo-us-context">{content}</svg>'
