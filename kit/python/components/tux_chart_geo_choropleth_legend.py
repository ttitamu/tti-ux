"""
TuxChartGeoChoroplethLegend — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxChartGeoChoroplethLegend:
    ramp: str = None
    label: str = None
    stops: str = None
    x: int = None
    y: int = None

    def render_html(self, content: str = "") -> str:
        return f'<g class="tux-chart-geo-choropleth-legend">{content}</g>'
