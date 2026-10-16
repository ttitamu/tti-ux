"""
TuxChartLine — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxChartLine:
    labels: Optional[str] = None
    series: Optional[str] = None
    width: int = 640
    height: int = 280
    markers: bool = False
    distinct_markers: bool = True
    marker_radius: int = 3.5
    palette: str = "brand"
    stroke_width: int = 2
    patterns: bool = False
    end_labels: bool = True
    legend: bool = False
    gridlines: bool = True
    y_ticks: int = 5

    def render_html(self, content: str = "") -> str:
        return f'<figure class="tux-chart-line">{content}</figure>'
