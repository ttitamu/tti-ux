"""
TuxChartGeoFlow — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxChartGeoFlow:
    flows: str = None
    flow_legend: str = None

    def render_html(self, content: str = "") -> str:
        return f'<svg class="tux-chart-geo-flow">{content}</svg>'
