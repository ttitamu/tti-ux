"""
TuxChartScatter — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxChartScatter:
    series: Optional[str] = None
    x_label: str = "x"
    y_label: str = "y"
    width: int = 640
    height: int = 320
    palette: str = "brand"
    distinct_markers: bool = True
    trendline: bool = False
    legend: bool = True
    gridlines: bool = True
    x_ticks: int = 6
    y_ticks: int = 5
    format: Optional[str] = None
    decimals: int = 2
    aria_summary: Optional[str] = None
    units: Optional[str] = None
    tooltip: bool = True

    def render_html(self, content: str = "") -> str:
        return f'<figure class="tux-chart-scatter">{content}</figure>'
