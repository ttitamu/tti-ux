"""
TuxChartGeoCounty — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxChartGeoCounty:
    counties: Optional[str] = None
    legend_label: Optional[str] = None
    legend_stops: Optional[str] = None

    def render_html(self, content: str = "") -> str:
        return f'<svg class="tux-chart-geo-county">{content}</svg>'
