"""
TuxChartLine — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxChartLine:
    labels: str = None
    series: str = None
    width: int = 640
    height: int = 280
    markers: bool = false
    end_labels: bool = true
    legend: bool = false
    gridlines: bool = true
    y_ticks: int = 5

    def render_html(self, content: str = "") -> str:
        return f'<figure class="tux-chart-line">{content}</figure>'
