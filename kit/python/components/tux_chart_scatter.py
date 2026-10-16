"""
TuxChartScatter — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxChartScatter:
    series: str = None
    x_label: str = "x"
    y_label: str = "y"
    width: int = 640
    height: int = 320
    palette: str = "brand"
    distinct_markers: bool = true
    trendline: bool = false
    legend: bool = true
    gridlines: bool = true
    x_ticks: int = 6
    y_ticks: int = 5
    format: str = None
    decimals: int = 2
    aria_summary: str = None
    units: str = None
    tooltip: bool = true

    def render_html(self, content: str = "") -> str:
        return f'<figure class="tux-chart-scatter">{content}</figure>'
